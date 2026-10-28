import type { ProductListBlock as ProductListBlockData } from '@/payload-types'

import { getListingProducts, getPopularProducts, getProductSummaries } from '@/lib/catalog'
import { resolveLink } from '@/lib/links'

import { ProductGrid } from './ProductGrid'
import { SectionHeader } from './SectionHeader'

export async function ProductListBlock({ block, headingID }: { block: ProductListBlockData; headingID: string }) {
  const limit = block.limit ?? 4
  const products =
    block.source === 'manual'
      ? (await getProductSummaries(block.products)).slice(0, limit)
      : block.source === 'onSale'
        ? await getListingProducts({ limit, onSaleOnly: true })
        : await getPopularProducts(limit)
  if (!products.length) return null

  return (
    <section aria-labelledby={headingID}>
      <SectionHeader id={headingID} title={block.title} intro={block.intro} link={resolveLink(block.link)} />
      <ProductGrid products={products} />
    </section>
  )
}
