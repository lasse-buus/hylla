'use client'

import type { ImageData } from '@/lib/media'

import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

type ProductGalleryProps = {
  title: string
  images: ImageData[]
  tags: { label: string; tone: 'brand' | 'ink' }[]
}

const roundButton =
  'flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-surface'

export function ProductGallery({ title, images, tags }: ProductGalleryProps) {
  const [index, setIndex] = useState(0)
  const current = images[index]
  const step = (delta: number) => setIndex((index + delta + images.length) % images.length)

  return (
    <div className="flex min-w-0 flex-col gap-3.5">
      <div className="relative h-[360px] overflow-hidden rounded-xl bg-navy sm:h-[560px]">
        {current ? (
          <Image
            src={current.url}
            alt={`${title}, bilde ${index + 1} av ${images.length}: ${current.alt}`}
            fill
            preload={index === 0}
            sizes="(min-width: 1360px) 700px, (min-width: 1024px) 55vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-steel">
            <ImageOff className="size-10" strokeWidth={1.5} aria-label="Bilde mangler" />
          </div>
        )}

        {tags.length ? (
          <div className="absolute top-[18px] left-[18px] flex gap-2">
            {tags.map((tag) => (
              <span
                key={tag.label}
                className={`rounded px-2.5 py-1.5 text-[11px] font-bold tracking-[0.4px] ${
                  tag.tone === 'brand' ? 'bg-brand-soft text-brand' : 'bg-ink text-white'
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        ) : null}

        {images.length > 1 ? (
          <>
            <span
              aria-hidden="true"
              className="absolute bottom-[30px] left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-[5px] text-xs font-semibold"
            >
              {index + 1} / {images.length}
            </span>
            <div className="absolute inset-x-[18px] bottom-[18px] flex justify-between">
              <button type="button" onClick={() => step(-1)} aria-label="Forrige bilde" className={roundButton}>
                <ChevronLeft className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Neste bilde" className={roundButton}>
                <ChevronRight className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul aria-label="Velg bilde" className="grid grid-cols-5 gap-2.5">
          {images.map((image, imageIndex) => {
            const isCurrent = imageIndex === index

            return (
              <li key={image.url}>
                <button
                  type="button"
                  onClick={() => setIndex(imageIndex)}
                  aria-current={isCurrent ? 'true' : undefined}
                  aria-label={`Bilde ${imageIndex + 1}: ${image.alt}`}
                  className={`relative block h-16 w-full overflow-hidden rounded-lg bg-navy sm:h-[92px] ${
                    isCurrent ? 'ring-2 ring-brand ring-offset-2' : 'opacity-75 hover:opacity-100'
                  }`}
                >
                  <Image src={image.url} alt="" fill sizes="140px" className="object-cover" />
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
