import type { ProductTabsBlock as ProductTabsBlockData } from '@/payload-types'

import { getListingProducts } from '@/lib/catalog'
import { resolveLink } from '@/lib/links'

import { ProductGrid } from './ProductGrid'
import { ProductTabs } from './ProductTabs'
import { SectionHeader } from './SectionHeader'

/** Products with a row of category tabs; "Alle" comes first and covers every tab's categories. */
export async function ProductTabsBlock({ block, headingID }: { block: ProductTabsBlockData; headingID: string }) {
  const tabs = [
    { label: 'Alle', categories: null },
    ...(block.tabs ?? []).map((tab) => ({ label: tab.label, categories: tab.categories ?? [] })),
  ]
  const loaded = await Promise.all(
    tabs.map((tab) =>
      getListingProducts({ categories: tab.categories, limit: block.limit ?? 4, onSaleOnly: block.onSaleOnly ?? true }),
    ),
  )
  const visibleTabs = tabs
    .map((tab, index) => ({ label: tab.label, products: loaded[index] }))
    .filter((tab) => tab.products.length)
  if (!visibleTabs.length) return null

  return (
    <section aria-labelledby={headingID}>
      <SectionHeader id={headingID} title={block.title} intro={block.intro} link={resolveLink(block.link)} />
      <ProductTabs tabs={visibleTabs.map((tab) => ({ label: tab.label, content: <ProductGrid products={tab.products} /> }))} />
      {block.finePrint ? <p className="mt-6 text-[11px] text-muted">{block.finePrint}</p> : null}
    </section>
  )
}
