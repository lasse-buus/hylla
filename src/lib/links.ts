import type { Category, Guide, Product } from '@/payload-types'

import { routes } from './routes'

/** The shape of the front page blocks' link field (see `linkField` in src/blocks/homeBlocks.ts). */
export type LinkValue = {
  label?: string | null
  reference?:
    | { relationTo: 'categories'; value: number | Category }
    | { relationTo: 'products'; value: number | Product }
    | { relationTo: 'guides'; value: number | Guide }
    | null
  url?: string | null
}

export type ResolvedLink = { href: string; label: string | null }

/**
 * A referenced document wins over the plain URL. A reference that is no longer readable
 * (deleted or unpublished, so not populated) falls back to the URL, or to no link at all.
 */
export function resolveLink(link: LinkValue | null | undefined): ResolvedLink | null {
  if (!link) return null
  const label = link.label ?? null
  const doc = link.reference?.value

  if (doc && typeof doc === 'object' && doc.slug) {
    const href =
      link.reference?.relationTo === 'categories'
        ? routes.category(doc.slug)
        : link.reference?.relationTo === 'products'
          ? routes.product(doc.slug)
          : routes.guide(doc.slug)
    return { href, label: label ?? ('title' in doc ? doc.title : null) }
  }

  return link.url ? { href: link.url, label } : null
}
