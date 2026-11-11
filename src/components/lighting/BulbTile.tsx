'use client'

import type { Bulb } from '@/lib/catalog'
import type { ImageData } from '@/lib/media'

import Image from 'next/image'

import { lightFor } from '@/lib/lighting'

import { BulbIllustration } from './BulbIllustration'
import { useLightPreview } from './LightRoom'

import './lighting.css'

const SIZES = '(min-width: 1360px) 300px, (min-width: 640px) 45vw, 100vw'

type BulbTileProps = {
  bulb: Bulb
  title: string
  /** The product's own image: the bulb unlit. */
  image: ImageData | null
}

/**
 * A product card's picture for smart lighting. It fills its (relative) parent.
 * In Kveld the bulb glows in the colour it can actually make in the chosen scene,
 * with a note when that isn't the scene's colour.
 * Products without both an unlit and a lit photo get a drawn bulb.
 */
export function BulbTile({ bulb, title, image }: BulbTileProps) {
  const { on, scene } = useLightPreview()
  const light = lightFor(bulb.capability, scene.id)
  // A Bridge has no lamp, only a status LED.
  const [glow, glowEdge] = bulb.capability === 'bridge' ? ['14%', '3.5%'] : ['50%', '12.5%']

  return (
    <div
      className="bulb-tile absolute inset-0"
      data-lit={on}
      style={
        {
          '--bulb': light.color,
          '--bulb2': bulb.gradient ? light.color2 : light.color,
          '--glow': glow,
          '--glow-edge': glowEdge,
        } as React.CSSProperties
      }
    >
      {image && bulb.litImage ? (
        <>
          <Image src={image.url} alt={image.alt} fill sizes={SIZES} className="object-cover" />
          <div aria-hidden="true" className="bulb-tile__lit absolute inset-0">
            <Image src={bulb.litImage.url} alt="" fill sizes={SIZES} className="object-cover" />
            <div className="bulb-tile__tint absolute inset-0" />
          </div>
        </>
      ) : (
        <>
          <div aria-hidden="true" className="bulb-tile__night absolute inset-0" />
          <BulbIllustration illustration={bulb.illustration} opal={bulb.opal} lit={on} label={`Tegning av ${title}`} />
        </>
      )}
      {on && light.note ? (
        <p className="absolute inset-x-2.5 bottom-2.5 rounded-md bg-[#0c0f15]/[0.78] px-2.5 py-[7px] text-[11px] leading-[1.35] text-white">
          {light.note}
        </p>
      ) : null}
    </div>
  )
}
