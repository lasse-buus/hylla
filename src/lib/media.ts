import type { Media } from '@/payload-types'

export type ImageData = { url: string; alt: string; width: number; height: number }

type ImageSize = keyof NonNullable<Media['sizes']>

/** Picks one of the Media collection's generated sizes, falling back to the original upload. */
export const toImage = (value: unknown, size: ImageSize = 'card'): ImageData | null => {
  const media = value && typeof value === 'object' ? (value as Media) : null
  const resized = media?.sizes?.[size]
  const url = resized?.url ?? media?.url
  if (!media || !url) return null

  return {
    url,
    alt: media.alt,
    width: resized?.width ?? media.width ?? 640,
    height: resized?.height ?? media.height ?? 400,
  }
}
