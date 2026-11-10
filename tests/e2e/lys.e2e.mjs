// End-to-end test of «Lys og pærer»: the Dag/Kveld switch, the scenes and the lighting filters.
// Run against `pnpm dev` after `pnpm seed`:  node tests/e2e/lys.e2e.mjs
import assert from 'node:assert/strict'
import { setTimeout as sleep } from 'node:timers/promises'

import { launch } from './cdp.mjs'

const ok = (message) => console.log(`ok ${message}`)
const room = `document.querySelector('.light-room')`
const toggle = `document.querySelector('button[aria-label="Skru lyset av eller på"]')`
const scene = (label) => `[...document.querySelectorAll('[aria-label="Velg lysscene"] button')].find((b) => b.textContent.trim() === ${JSON.stringify(label)})`
const card = (title) => `[...document.querySelectorAll('article')].find((a) => a.querySelector('h3').textContent.trim() === ${JSON.stringify(title)})`
const pageColor = `getComputedStyle(${room}).backgroundColor`

const browser = await launch()

try {
  // Dag is the default: a light page, unlit bulbs and no notes.
  await browser.goto('/kategori/smartlys')
  assert.equal(await browser.evaluate(`document.querySelector('h1').textContent`), 'Lys og pærer')
  assert.equal(await browser.evaluate(`${toggle}.getAttribute('aria-pressed')`), 'false')
  assert.equal(await browser.evaluate(pageColor), 'rgb(243, 245, 248)')
  assert.equal(await browser.evaluate(`document.querySelectorAll('article svg[role=img]').length`), 12)
  assert.equal(await browser.evaluate(`document.querySelectorAll('.bulb-tile p').length`), 0)
  ok('Dag: 12 unlit bulbs on a light page')

  // The switch turns the room dark; the shop chrome stays light.
  await browser.click(toggle)
  await browser.waitFor(`${toggle}.getAttribute('aria-pressed') === 'true'`)
  await sleep(900)
  assert.equal(await browser.evaluate(pageColor), 'rgb(14, 17, 24)')
  assert.equal(await browser.evaluate(`getComputedStyle(document.querySelector('header')).colorScheme`), 'normal')
  assert.equal(await browser.evaluate(`getComputedStyle(document.body).backgroundColor`), 'rgb(243, 245, 248)')
  assert.equal(await browser.evaluate(`document.querySelectorAll('.bulb-tile[data-lit=true]').length`), 12)
  ok('Kveld: the room is dark and every bulb is lit')

  // Nordlys: a colour bulb shows it, an Ambiance bulb can't and says so.
  await browser.click(scene('Nordlys'))
  await browser.waitFor(`${scene('Nordlys')}.getAttribute('aria-pressed') === 'true'`)
  const note = (title) => browser.evaluate(`${card(title)}.querySelector('.bulb-tile p')?.textContent ?? null`)
  const bulbColor = (title) => browser.evaluate(`${card(title)}.querySelector('.bulb-tile').style.getPropertyValue('--bulb')`)
  assert.equal(await note('Hue White Ambiance E27'), 'White Ambiance viser bare hvitt lys. Her: varm hvit.')
  assert.equal(await bulbColor('Hue White Ambiance E27'), '#ffc477')
  assert.equal(await note('Hue White and Color Ambiance E27, 2-pk'), null)
  assert.equal(await bulbColor('Hue White and Color Ambiance E27, 2-pk'), '#36e0a2')
  assert.equal(await note('Hue White E14 kronepære, 2-pk'), 'Hue White lyser bare varmhvitt.')
  assert.equal(await bulbColor('Hue Bridge Pro'), '#4aa3ff')
  ok('Nordlys: colour bulbs follow the scene, the others explain why not')

  // Picking a scene from Dag also turns the light on.
  await browser.click(toggle)
  await browser.waitFor(`${toggle}.getAttribute('aria-pressed') === 'false'`)
  await browser.click(scene('Solnedgang'))
  await browser.waitFor(`${toggle}.getAttribute('aria-pressed') === 'true'`)
  ok('picking a scene switches to Kveld')

  // The choice is a view preference: remembered across a reload, and not in the URL.
  assert.equal(await browser.evaluate(`location.search`), '')
  await browser.goto('/kategori/smartlys')
  await browser.waitFor(`${toggle}.getAttribute('aria-pressed') === 'true' && ${scene('Solnedgang')}.getAttribute('aria-pressed') === 'true'`)
  ok('Kveld and the scene survive a reload')

  // The lighting filters live in the URL.
  await browser.click(`[...document.querySelectorAll('aside label')].find((l) => l.textContent.startsWith('GU10')).querySelector('input')`)
  await browser.waitFor(`location.search === '?sokkel=GU10' && document.querySelectorAll('article').length === 2`)
  await browser.click(`[...document.querySelectorAll('nav[aria-label="Typer belysning"] a')].find((a) => a.textContent.startsWith('Bordlamper'))`)
  await browser.waitFor(`location.search.includes('type=bordlamper') && document.body.innerText.includes('Ingen produkter matcher filtrene')`)
  ok('socket and type filters narrow the grid through the URL')

  // Other category pages are unchanged, and bulbs outside the light room stay unlit.
  await browser.goto('/kategori/gaming')
  assert.equal(await browser.evaluate(`document.querySelector('.light-room')`), null)
  await browser.goto('/sok?q=hue')
  await browser.waitFor(`document.querySelectorAll('.bulb-tile').length > 0`)
  assert.equal(await browser.evaluate(`document.querySelectorAll('.bulb-tile[data-lit=true]').length`), 0)
  ok('search results show the bulbs unlit')

  await sleep(300)
  assert.deepEqual(browser.errors, [])
  ok('no page errors')
} catch (error) {
  console.error('FAILED:', error.message)
  await browser.shot('/tmp/lys-e2e-failure.png').catch(() => {})
  process.exitCode = 1
} finally {
  browser.close()
}
