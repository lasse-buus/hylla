// End-to-end test of Min side: demo login, checkout as Lasse, per-browser order visibility,
// admin status changes, coexisting admin session, and edits that last only for the visit.
//
// Run against `pnpm dev` after a fresh `pnpm seed`:
//   node --env-file=.env tests/e2e/min-side.e2e.mjs
import assert from 'node:assert/strict'

import { BASE, byText, launch } from './cdp.mjs'

const ok = (message) => console.log(`ok ${message}`)
const text = (selector) => `document.querySelector(${JSON.stringify(selector)})?.textContent?.trim()`
const orderCount = (browser) => browser.evaluate(`document.querySelectorAll('main article h2').length`)

async function logIn(browser) {
  await browser.goto('/min-side')
  await browser.waitFor(`location.pathname === '/logg-inn'`)
  await browser.click(byText('button', 'Logg inn som demokunde'))
  await browser.waitFor(`location.pathname === '/min-side' && document.querySelector('h1')?.textContent.includes('Lasse')`)
}

async function adminToken() {
  const response = await fetch(`${BASE}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.SEED_ADMIN_EMAIL, password: process.env.SEED_ADMIN_PASSWORD }),
  })
  const { token } = await response.json()
  assert.ok(token, 'admin login (set SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD, e.g. with --env-file=.env)')
  return token
}

const first = await launch()
const second = await launch()

try {
  // 1. Logged out, Min side leads to the login page with the demo credentials filled in.
  await first.goto('/min-side')
  await first.waitFor(`location.pathname === '/logg-inn'`)
  assert.equal(await first.evaluate(`location.search`), '?neste=%2Fmin-side')
  assert.equal(await first.evaluate(`document.querySelector('input[name=email]').value`), 'lasse.nielsen@eksempel.no')
  assert.ok(await first.evaluate(`document.querySelector('input[name=password]').value.length > 0`))
  assert.equal(await first.evaluate(`[...document.querySelectorAll('a')].some((a) => /registrer|opprett konto/i.test(a.textContent))`), false)
  await first.click(byText('button', 'Logg inn som demokunde'))
  await first.waitFor(`location.pathname === '/min-side'`)
  await first.waitFor(`document.querySelector('h1')?.textContent === 'Hei, Lasse!'`)
  ok('demo login lands on "Hei, Lasse!"')

  // 2. Demo-only actions say so.
  await first.goto('/min-side/profil')
  await first.click(byText('button', 'Slett kontoen'))
  await first.waitFor(`[...document.querySelectorAll('[role=status]')].some((el) => el.textContent === 'Ikke tilgjengelig i demoen')`)
  ok('"Slett kontoen" shows "Ikke tilgjengelig i demoen"')

  // 3. Checkout as Lasse: no demo customer switch, and the order joins his list in this browser.
  await first.goto('/produkt/klang-mini')
  await first.click(byText('button', 'Legg'))
  await first.waitFor(`Number(document.querySelector('nav[aria-label="Konto og handlekurv"] [aria-label$="handlekurven"]')?.textContent || 0) >= 1`)
  await first.goto('/kassen')
  await first.waitFor(`document.querySelector('form')`)
  assert.equal(await first.evaluate(`Boolean(${byText('button', 'Ny demokunde')})`), false, 'no "Ny demokunde" when logged in')
  assert.ok((await first.evaluate(`document.querySelector('main').innerText`)).includes('Logget inn som Lasse Nielsen'))
  await first.click(`document.querySelector('form input[type=checkbox]')`)
  await first.click(`document.querySelector('button[type=submit]')`)
  await first.waitFor(`location.pathname === '/kassen/bekreftelse' && document.querySelector('h1')`)
  assert.equal(await first.evaluate(text('h1')), 'Takk for bestillingen, Lasse!')
  const orderNumber = Number((await first.evaluate(`document.querySelector('main strong').textContent`)).replace('#', ''))
  await first.goto('/min-side/ordrer')
  assert.equal(await orderCount(first), 6)
  assert.ok(await first.evaluate(`document.querySelector('main').innerText.includes('Ordre #${orderNumber}')`))
  ok(`checkout as Lasse placed #${orderNumber}, listed in this browser (6 orders)`)

  // 4. Another browser logged in as Lasse doesn't see it.
  await logIn(second)
  await second.goto('/min-side/ordrer')
  assert.equal(await orderCount(second), 5)
  assert.equal(await second.evaluate(`document.querySelector('main').innerText.includes('Ordre #${orderNumber}')`), false)
  await second.goto(`/min-side/ordrer/${orderNumber}`)
  assert.equal(await second.evaluate(text('h1')), '404')
  ok("another browser sees 5 orders and gets 404 for the first browser's order")

  // 5. An admin marks it shipped; the visitor's order page shows the change on reload.
  const token = await adminToken()
  const headers = { Authorization: `JWT ${token}`, 'Content-Type': 'application/json' }
  const found = await (await fetch(`${BASE}/api/orders?where[orderNumber][equals]=${orderNumber}&depth=0`, { headers })).json()
  const orderID = found.docs[0].id
  const patched = await fetch(`${BASE}/api/orders/${orderID}`, { method: 'PATCH', headers, body: JSON.stringify({ status: 'shipped' }) })
  assert.equal(patched.status, 200)
  await first.goto(`/min-side/ordrer/${orderNumber}`)
  assert.ok((await first.evaluate(text('h1'))).includes('Sendt'))
  assert.equal(await first.evaluate(`[...document.querySelectorAll('ol[aria-label=Ordrestatus] li')].findIndex((li) => li.textContent.includes('(nå)'))`), 2)
  ok('admin status change shows as "Sendt" with the shipped step current')

  // 6. An admin session in the same browser doesn't replace or become the shop login, and survives shop logout.
  const adminLogin = await first.evaluate(`fetch('/api/users/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ${JSON.stringify(process.env.SEED_ADMIN_EMAIL)}, password: ${JSON.stringify(process.env.SEED_ADMIN_PASSWORD)} }) }).then((r) => r.status)`)
  assert.equal(adminLogin, 200)
  await first.goto('/min-side')
  assert.equal(await first.evaluate(text('h1')), 'Hei, Lasse!')

  // 7. Edits last for the visit only: they survive a reload, other browsers don't see them, logging out drops them.
  await first.goto('/min-side/profil')
  await first.evaluate(`(() => {
    const input = document.querySelector('input[autocomplete=given-name]')
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Ola')
    input.dispatchEvent(new Event('input', { bubbles: true }))
  })()`)
  await first.click(byText('button', 'Lagre endringer'))
  await first.waitFor(`document.body.innerText.includes('Endringene er lagret')`)
  await first.goto('/min-side/adresser')
  await first.click(byText('button', 'Legg til ny adresse'))
  await first.click(byText('button', 'Lagre adresse'))
  assert.ok(await first.evaluate(`document.body.innerText.includes('Postnummeret har fire siffer.')`), 'address form validates')
  await first.evaluate(`(() => {
    const set = (selector, value) => {
      const input = document.querySelector(selector)
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, value)
      input.dispatchEvent(new Event('input', { bubbles: true }))
    }
    set('input[placeholder="F.eks. Jobb"]', 'Jobb')
    set('input[autocomplete=street-address]', 'Karl Johans gate 1')
    set('input[autocomplete=postal-code]', '0154')
    set('input[autocomplete=address-level2]', 'Oslo')
  })()`)
  await first.click(byText('button', 'Lagre adresse'))
  await first.waitFor(`document.querySelectorAll('main article').length === 3`)
  await first.goto('/min-side')
  assert.equal(await first.evaluate(text('h1')), 'Hei, Ola!')
  assert.equal(await first.evaluate(`document.querySelector('aside[aria-label="Min side"] span.text-base')?.textContent`), 'Ola Nielsen')
  await second.goto('/min-side/adresser')
  assert.equal(await second.evaluate(`document.querySelectorAll('main article').length`), 2)
  await second.goto('/min-side')
  assert.equal(await second.evaluate(text('h1')), 'Hei, Lasse!')
  ok('edits survive a reload in this browser only')

  await first.click(byText('button', 'Logg ut'))
  await first.waitFor(`location.pathname === '/logg-inn'`)
  const adminStillIn = await first.evaluate(`fetch('/api/users/me', { credentials: 'include' }).then((r) => r.json()).then((d) => Boolean(d.user?.roles?.includes('admin')))`)
  assert.equal(adminStillIn, true, 'admin session survives shop logout')
  await first.click(byText('button', 'Logg inn som demokunde'))
  await first.waitFor(`location.pathname === '/min-side' && document.querySelector('h1')`)
  assert.equal(await first.evaluate(text('h1')), 'Hei, Lasse!')
  await first.goto('/min-side/ordrer')
  assert.equal(await orderCount(first), 6)
  ok('admin and shop sessions coexist; logout drops edits but keeps placed orders')

  // 8. No page errors.
  assert.deepEqual(first.errors, [])
  assert.deepEqual(second.errors, [])
  ok('no page errors')
} catch (error) {
  console.error('FAILED:', error.message)
  await first.shot('/tmp/min-side-e2e-failure.png').catch(() => {})
  process.exitCode = 1
} finally {
  first.close()
  second.close()
}
