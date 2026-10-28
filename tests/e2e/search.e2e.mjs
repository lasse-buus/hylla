// End-to-end test of the header's live search and the /sok results page.
// Run against `pnpm dev` after `pnpm seed`:  node tests/e2e/search.e2e.mjs
import assert from 'node:assert/strict'
import { setTimeout as sleep } from 'node:timers/promises'

import { launch } from './cdp.mjs'

const ok = (message) => console.log(`ok ${message}`)
const input = `document.querySelector('header input[role=combobox]')`
const options = `[...document.querySelectorAll('[role=listbox] [role=option]')]`

const browser = await launch()
const key = async (key, code = key, keyCode) => {
  // Enter needs its character too, or the browser won't submit the form.
  const text = key === 'Enter' ? '\r' : undefined
  await browser.send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode, text })
  await browser.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode })
}
const typeInSearch = async (text) => {
  await browser.evaluate(`${input}.focus()`)
  await browser.evaluate(`${input}.select()`)
  await browser.send('Input.insertText', { text })
}

try {
  // Suggestions appear while typing: products, then the "see all" option.
  await browser.goto('/')
  await typeInSearch('vektor')
  await browser.waitFor(`${input}.getAttribute('aria-expanded') === 'true' && ${options}.length > 2`)
  const labels = await browser.evaluate(`${options}.map((option) => option.textContent)`)
  assert.ok(labels.slice(0, -1).every((label) => /vektor/i.test(label)), 'product suggestions match')
  assert.match(labels.at(-1), /^Se alle \d+ treff for «vektor»/)
  ok(`typing "vektor" suggests ${labels.length - 1} products`)

  // Arrow keys pick a suggestion; Enter opens it.
  await key('ArrowDown', 'ArrowDown', 40)
  const firstID = await browser.evaluate(`${options}[0].id`)
  assert.equal(await browser.evaluate(`${input}.getAttribute('aria-activedescendant')`), firstID)
  await key('Enter', 'Enter', 13)
  await browser.waitFor(`location.pathname.startsWith('/produkt/')`)
  ok('ArrowDown + Enter opens the first product')

  // Guides are suggested too, and a click opens one.
  await typeInSearch('gaming-PC')
  await browser.waitFor(`${options}.some((option) => option.closest('[role=group]')?.textContent.startsWith('Guider og tips'))`)
  await browser.click(`${options}.find((option) => option.closest('[role=group]')?.textContent.startsWith('Guider og tips'))`)
  await browser.waitFor(`location.pathname.startsWith('/guider/')`)
  ok('guide suggestions open on click')

  // Escape closes the list.
  await typeInSearch('klang')
  await browser.waitFor(`${input}.getAttribute('aria-expanded') === 'true'`)
  await key('Escape', 'Escape', 27)
  assert.equal(await browser.evaluate(`${input}.getAttribute('aria-expanded')`), 'false')
  ok('Escape closes the suggestions')

  // Enter without a selection goes to the results page.
  await typeInSearch('klang')
  await browser.waitFor(`${options}.length > 1`)
  await key('Enter', 'Enter', 13)
  await browser.waitFor(`location.pathname === '/sok' && document.querySelector('h1')?.textContent.includes('klang')`)
  assert.ok(await browser.evaluate(`document.querySelectorAll('#produkter-tittel + ul > li').length >= 2`))
  ok('Enter shows /sok?q=klang with product results')
  // The form submit was a full page load; let the new page hydrate before typing again.
  await browser.waitFor('document.readyState === "complete"')
  await sleep(800)

  // No match: the list says so, and the results page offers a way on.
  await typeInSearch('xyzzyfinnesikke')
  await browser.waitFor(`${options}.length === 1 && document.querySelector('[role=listbox]').textContent.includes('Ingen treff')`)
  await browser.goto('/sok?q=xyzzyfinnesikke')
  assert.ok(await browser.evaluate(`document.body.innerText.includes('Vi fant ingenting som passer')`))
  assert.ok(await browser.evaluate(`document.querySelectorAll('#populaert-tittel + ul > li').length > 0`))
  ok('no-match states in the list and on /sok')

  await sleep(300)
  assert.deepEqual(browser.errors, [])
  ok('no page errors')
} catch (error) {
  console.error('FAILED:', error.message)
  await browser.shot('/tmp/search-e2e-failure.png').catch(() => {})
  process.exitCode = 1
} finally {
  browser.close()
}
