import type { Media } from '@/payload-types'

export type ImageData = { url: string; alt: string; width: number; height: number }

type ImageSize = keyof NonNullable<Media['sizes']>

const FILE_PATH = '/api/media/file/'

/**
 * Payload returns absolute URLs once `serverURL` is set, but Next's image optimizer only accepts our own
 * files by their relative path (`images.localPatterns`), so those are made relative. Other URLs stay as they are.
 */
const relativeFileURL = (url: string): string => {
  try {
    const parsed = new URL(url, 'http://relative.invalid')
    return parsed.pathname.startsWith(FILE_PATH) ? `${parsed.pathname}${parsed.search}` : url
  } catch {
    return url
  }
}

/** Picks one of the Media collection's generated sizes, falling back to the original upload. */
export const toImage = (value: unknown, size: ImageSize = 'card'): ImageData | null => {
  const media = value && typeof value === 'object' ? (value as Media) : null
  const resized = media?.sizes?.[size]
  const url = resized?.url ?? media?.url
  if (!media || !url) return null

  return {
    url: relativeFileURL(url),
    alt: media.alt,
    width: resized?.width ?? media.width ?? 640,
    height: resized?.height ?? media.height ?? 400,
  }
}
