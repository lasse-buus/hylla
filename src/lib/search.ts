import type { Where } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'

import { type GuideSummary, type ProductSummary, toGuideSummary, toProductSummary } from './catalog'

const MAX_QUERY_LENGTH = 80
const MIN_QUERY_LENGTH = 2

export type SearchResults = {
  query: string
  products: ProductSummary[]
  productTotal: number
  guides: GuideSummary[]
  guideTotal: number
}

/** The search text from a URL parameter: trimmed, single-spaced and capped. */
export const normalizeQuery = (raw: unknown): string =>
  typeof raw === 'string' ? raw.trim().replace(/\s+/g, ' ').slice(0, MAX_QUERY_LENGTH) : ''

/** Every word must appear in one of the fields (Payload's `like` matches each word, case-insensitively). */
const anyFieldLike = (fields: string[], query: string): Where => ({
  or: fields.map((field) => ({ [field]: { like: query } })),
})

/**
 * Searches published products (name, specs, SKU, brand, category) and guides (title, kicker, excerpt).
 * Products with the most reviews come first; guides newest first.
 */
export async function searchShop(
  raw: string,
  { productLimit, guideLimit }: { productLimit: number; guideLimit: number },
): Promise<SearchResults> {
  const query = normalizeQuery(raw)
  // SQL wildcards would turn a query into "match everything", so they are not searchable.
  const terms = query.replace(/[%_\\]/g, ' ').replace(/\s+/g, ' ').trim()
  const empty = { query, products: [], productTotal: 0, guides: [], guideTotal: 0 }
  if (terms.length < MIN_QUERY_LENGTH) return empty

  const payload = await getPayload({ config })
  const published: Where = { _status: { equals: 'published' } }

  const [products, guides] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: Math.max(productLimit, 1),
      sort: '-reviewCount',
      where: { and: [published, anyFieldLike(['title', 'shortSpecs', 'sku', 'brand.name', 'categories.title'], terms)] },
    }),
    payload.find({
      collection: 'guides',
      depth: 1,
      limit: Math.max(guideLimit, 1),
      sort: '-publishedAt',
      where: { and: [published, anyFieldLike(['title', 'kicker', 'excerpt'], terms)] },
    }),
  ])

  return {
    query,
    products: products.docs.slice(0, productLimit).map((product) => toProductSummary(product)),
    productTotal: products.totalDocs,
    guides: guides.docs.slice(0, guideLimit).map(toGuideSummary),
    guideTotal: guides.totalDocs,
  }
}
