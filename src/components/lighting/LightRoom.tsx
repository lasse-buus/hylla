'use client'

import { createContext, useContext, useMemo, useSyncExternalStore } from 'react'

import { defaultScene, type Scene, sceneByID, type SceneID } from '@/lib/lighting'

import './lighting.css'

/** A view preference, not a filter: remembered for this tab and kept out of the URL. */
const KEY = 'hylla-lys'
const listeners = new Set<() => void>()
// Used when sessionStorage is blocked (some private windows); the choice then lasts until the page reloads.
let memory: string | null = null

const read = (): string | null => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return memory
  }
}

const write = (preview: { on: boolean; scene: SceneID }) => {
  const value = JSON.stringify(preview)
  try {
    sessionStorage.setItem(KEY, value)
  } catch {
    // Storage unavailable: keep the choice in memory instead.
  }
  memory = value
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const parse = (stored: string | null): { on: boolean; scene: Scene } => {
  try {
    const value = JSON.parse(stored ?? '{}') as { on?: unknown; scene?: unknown }
    return { on: value.on === true, scene: sceneByID(value.scene) }
  } catch {
    return { on: false, scene: defaultScene }
  }
}

type LightPreview = {
  /** Kveld: the room is dark and every bulb is lit. */
  on: boolean
  scene: Scene
  setOn: (on: boolean) => void
  /** Picking a scene also switches the light on. */
  pickScene: (scene: SceneID) => void
}

// Outside a light room (search results, the cart, the front page) bulbs are simply shown unlit.
const Context = createContext<LightPreview>({ on: false, scene: defaultScene, setOn: () => {}, pickScene: () => {} })

export const useLightPreview = () => useContext(Context)

/**
 * The part of the page the Dag/Kveld switch darkens, and the state behind the switch.
 * The server renders Dag; a remembered Kveld fades in after hydration.
 */
export function LightRoom({ children }: { children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, read, () => null)

  const preview = useMemo<LightPreview>(() => {
    const { on, scene } = parse(stored)
    return {
      on,
      scene,
      setOn: (next) => write({ on: next, scene: scene.id }),
      pickScene: (id) => write({ on: true, scene: id }),
    }
  }, [stored])

  return (
    <Context value={preview}>
      <div
        className="light-room"
        data-lit={preview.on}
        style={{ '--scene': preview.scene.color, '--scene2': preview.scene.second } as React.CSSProperties}
      >
        {children}
      </div>
    </Context>
  )
}
