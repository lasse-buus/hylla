import type { Metadata } from 'next'

import { CategoryHero } from '@/components/category/CategoryHero'
import { ProductBrowser } from '@/components/category/ProductBrowser'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { getDealsPage, maxDiscountPercent } from '@/lib/catalog'
import { parseFilters } from '@/lib/productFilters'

export const metadata: Metadata = {
  title: 'Ukens kupp',
  description: 'Alle tilbud hos Hylla. Førpris er laveste pris de siste 30 dagene.',
}

export default async function DealsPage(props: PageProps<'/tilbud'>) {
  const { products, departments, brands } = await getDealsPage()
  const filters = parseFilters(await props.searchParams)
  const biggestDiscount = maxDiscountPercent(products)

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <Breadcrumbs trail={[]} current="Ukens kupp" />

      <div className="mt-4">
        <CategoryHero
          title="Ukens kupp"
          eyebrow="Tilbud"
          description="Håndplukkede tilbud for hverdagen din. Førpris er laveste pris de siste 30 dagene, og alle priser er inkl. mva."
          icon={null}
          image={null}
          stats={[
            { label: 'Produkter på tilbud', value: String(products.length) },
            ...(biggestDiscount > 0 ? [{ label: 'Største rabatt', value: `Spar opptil ${biggestDiscount} %` }] : []),
          ]}
          shortcuts={[]}
        />
      </div>

      <div className="mt-9">
        <ProductBrowser
          products={products}
          filters={filters}
          categories={departments}
          brands={brands}
          scopeLabel="på tilbud"
          showOnSaleFilter={false}
        />
      </div>
    </div>
  )
}
