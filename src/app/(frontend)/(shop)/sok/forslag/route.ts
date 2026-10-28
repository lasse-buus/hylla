import type { NextRequest } from 'next/server'

import { searchShop } from '@/lib/search'

/** What the header's live search shows while typing. */
export type SearchSuggestions = {
  query: string
  products: { id: number; title: string; href: string; brandName: string | null; price: number; compareAtPrice: number | null; image: string | null }[]
  productTotal: number
  guides: { id: number; title: string; href: string; kicker: string | null }[]
  guideTotal: number
}

export async function GET(request: NextRequest) {
  const results = await searchShop(request.nextUrl.searchParams.get('q') ?? '', { productLimit: 5, guideLimit: 3 })

  const body: SearchSuggestions = {
    query: results.query,
    products: results.products.map(({ id, title, href, brandName, price, compareAtPrice, image }) => ({
      id,
      title,
      href,
      brandName,
      price,
      compareAtPrice,
      image: image?.url ?? null,
    })),
    productTotal: results.productTotal,
    guides: results.guides.map(({ id, title, href, kicker }) => ({ id, title, href, kicker })),
    guideTotal: results.guideTotal,
  }

  // Same query, same answer for a minute: typing back and forth doesn't hit the database again.
  return Response.json(body, { headers: { 'Cache-Control': 'public, max-age=60' } })
}
