'use client'

import type { ImageData } from '@/lib/media'

import { Lightbulb } from 'lucide-react'
import Image from 'next/image'

import { useLightPreview } from './LightRoom'
import { LightToggle } from './LightToggle'
import { ScenePicker } from './ScenePicker'

type LightingHeroProps = {
  eyebrow: string
  title: string
  description: string | null
  /** A photo of a room. In Kveld it is darkened and the scene's colours glow over it. */
  image: ImageData | null
}

/** The lighting category's hero: the «Test pærene» panel next to a room that follows the switch. */
export function LightingHero({ eyebrow, title, description, image }: LightingHeroProps) {
  const { on, scene } = useLightPreview()

  return (
    <section aria-labelledby="kategori-tittel" className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
      <div className="flex flex-col gap-[18px] rounded-[14px] border border-line bg-card px-6 py-9 sm:px-11 sm:pt-11 sm:pb-10">
        <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[1.2px] text-accent uppercase">
          <Lightbulb className="size-4" strokeWidth={2} aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 id="kategori-tittel" className="text-[clamp(38px,7vw,56px)] leading-[1.02] font-extrabold tracking-[-2px]">
          {title}
        </h1>
        {description ? <p className="max-w-[520px] text-[17px] leading-[1.6] text-muted">{description}</p> : null}

        <div className="mt-2 flex flex-col gap-4 rounded-xl border border-line bg-surface p-[18px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[15px] font-bold">Test pærene</h2>
              <p className="mt-1 text-[13px] text-muted" aria-live="polite">
                {on ? 'Kveld: rommet er mørkt og alle pærene er skrudd på.' : 'Dag: slik ser pærene ut når de er av.'}
              </p>
            </div>
            <LightToggle />
          </div>
          <ScenePicker />
        </div>
      </div>

      <div className="relative min-h-[300px] overflow-hidden rounded-[14px] bg-[#0c0f15] sm:min-h-[420px]">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt}
            fill
            preload
            sizes="(min-width: 1360px) 670px, (min-width: 1024px) 50vw, 100vw"
            className="light-room__photo object-cover"
          />
        ) : null}
        <div aria-hidden="true" className="light-room__glow absolute inset-0" />
        <p className="absolute bottom-5 left-5 max-w-[calc(100%-40px)] rounded-[10px] bg-[#0c0f15]/[0.72] px-3.5 py-2.5 text-[13px] leading-[1.45] text-white">
          <strong className="block text-sm">{on ? `Scene: ${scene.label}` : 'Lyset er av'}</strong>
          {on ? 'Hue-lys i taket og lysstripe bak TV-en.' : 'Skru på lyset for å se stua med Hue.'}
        </p>
      </div>
    </section>
  )
}
