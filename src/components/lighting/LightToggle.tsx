'use client'

import { Moon, Sun } from 'lucide-react'

import { useLightPreview } from './LightRoom'

/** The Dag/Kveld switch. In Kveld the knob takes the scene's colour. */
export function LightToggle() {
  const { on, setOn } = useLightPreview()
  const Icon = on ? Moon : Sun

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label="Skru lyset av eller på"
      onClick={() => setOn(!on)}
      className="inline-flex h-12 items-center gap-3 rounded-full border border-line bg-card pr-2 pl-4 text-sm font-bold"
    >
      <span className="inline-flex items-center gap-2">
        <Icon className="size-[18px]" strokeWidth={2} aria-hidden="true" />
        {on ? 'Kveld' : 'Dag'}
      </span>
      <span aria-hidden="true" className={`relative h-8 w-[52px] rounded-full transition-colors duration-500 ${on ? 'bg-brand' : 'bg-steel'}`}>
        <span className="light-toggle__knob absolute top-[3px] size-[26px] rounded-full" />
      </span>
    </button>
  )
}
