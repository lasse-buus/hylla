'use client'

import { scenes } from '@/lib/lighting'

import { useLightPreview } from './LightRoom'

export function ScenePicker() {
  const { on, scene, pickScene } = useLightPreview()

  return (
    <div role="group" aria-label="Velg lysscene" className="flex flex-wrap gap-2">
      {scenes.map(({ id, label, color }) => {
        const active = on && id === scene.id

        return (
          <button
            key={id}
            type="button"
            aria-pressed={active}
            onClick={() => pickScene(id)}
            className={`inline-flex h-10 items-center gap-2 rounded-full border pr-3.5 pl-2.5 text-[13px] font-semibold ${
              active ? 'border-white bg-white text-navy' : 'border-line bg-card hover:border-ink'
            }`}
          >
            <span
              aria-hidden="true"
              className="size-[18px] rounded-full shadow-[inset_0_0_0_1px_rgb(0_0_0/0.12)]"
              style={{ backgroundColor: color }}
            />
            {label}
          </button>
        )
      })}
    </div>
  )
}
