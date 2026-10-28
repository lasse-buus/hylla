// A tiny headless-Chrome driver over the DevTools protocol, for the end-to-end scripts in this folder.
// Needs Google Chrome installed and `pnpm dev` running on BASE.
import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { setTimeout as sleep } from 'node:timers/promises'

export const BASE = process.env.BASE_URL ?? 'http://localhost:3000'
const CHROME = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

let nextPort = 9400

/** Starts a fresh Chrome profile (its own cookies and storage) and returns helpers for driving one tab. */
export async function launch({ width = 1440, height = 1800 } = {}) {
  const port = nextPort++
  const profile = mkdtempSync(join(tmpdir(), 'hylla-e2e-'))
  const chrome = spawn(
    CHROME,
    ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, `--window-size=${width},${height}`, 'about:blank'],
    { stdio: 'ignore' },
  )

  let target
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250)
    try {
      target = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page')
    } catch {}
  }
  if (!target) throw new Error('Chrome did not start')

  const ws = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve) => (ws.onopen = resolve))
  let id = 0
  const pending = new Map()
  const errors = []
  ws.onmessage = ({ data }) => {
    const msg = JSON.parse(data)
    if (msg.method === 'Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails.exception?.description?.split('\n')[0])
    const waiter = pending.get(msg.id)
    if (waiter) {
      pending.delete(msg.id)
      if (msg.error) waiter.reject(new Error(msg.error.message))
      else waiter.resolve(msg.result)
    }
  }
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const msgID = ++id
      pending.set(msgID, { resolve, reject })
      ws.send(JSON.stringify({ id: msgID, method, params }))
    })
  await send('Page.enable')
  await send('Runtime.enable')

  const evaluate = async (expression) => {
    const { result, exceptionDetails } = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
    return result.value
  }
  const waitFor = async (expression, timeout = 30000) => {
    const start = Date.now()
    while (Date.now() - start < timeout) {
      try {
        if (await evaluate(`Boolean(${expression})`)) return
      } catch {}
      await sleep(200)
    }
    throw new Error(`Timed out waiting for: ${expression}`)
  }
  const goto = async (path) => {
    await send('Page.navigate', { url: BASE + path })
    await sleep(300)
    await waitFor('document.readyState === "complete"')
    await sleep(800)
  }
  const click = (selectorJS) =>
    evaluate(`(() => { const el = ${selectorJS}; if (!el) throw new Error('not found: ' + ${JSON.stringify(selectorJS)}); el.click(); return true })()`)
  const shot = async (file) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true })
    writeFileSync(file, Buffer.from(data, 'base64'))
  }
  const close = () => {
    ws.close()
    chrome.kill()
  }

  return { send, evaluate, waitFor, goto, click, shot, close, errors }
}

/** JS for the first element of `tag` whose text starts with `text`. */
export const byText = (tag, text) =>
  `[...document.querySelectorAll(${JSON.stringify(tag)})].find((el) => el.textContent.trim().startsWith(${JSON.stringify(text)}))`
