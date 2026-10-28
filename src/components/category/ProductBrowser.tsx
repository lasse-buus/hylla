import type { GuideSummary, ProductSummary } from '@/lib/catalog'

import { ProductCard } from '@/components/shop/ProductCard'
import { applyFilters, facetCounts, type FilterState, hasActiveFilters } from '@/lib/productFilters'

import { ActiveFilters } from './ActiveFilters'
import { FilterProvider, FilterResults, LoadMoreLink, SortSelect } from './FilterContext'
import { FilterPanel } from './FilterPanel'
import { GuidePromoCard } from './GuidePromoCard'

/** Where the guide card goes in the product grid. */
const PROMO_POSITION = 5

const productCountLabel = (count: number) => `${count} ${count === 1 ? 'produkt' : 'produkter'}`

type ProductBrowserProps = {
  products: ProductSummary[]
  filters: FilterState
  /** Categories offered in the "Kategori" filter. Ones without products are hidden. */
  categories: { slug: string; title: string }[]
  brands: { slug: string; name: string }[]
  /** Completes "N produkter av M …" when filters are active, e.g. "i Gaming". */
  scopeLabel: string
  promoGuide?: GuideSummary | null
  /** Hidden where every product is already on sale. */
  showOnSaleFilter?: boolean
}

/**
 * The filterable product listing shared by category pages and the deals page:
 * filter sidebar, sort, active-filter chips, the grid and "Vis flere".
 * The URL is the source of truth (see src/lib/productFilters.ts).
 */
export function ProductBrowser({
  products,
  filters: requested,
  categories,
  brands,
  scopeLabel,
  promoGuide = null,
  showOnSaleFilter = true,
}: ProductBrowserProps) {
  // Slugs that don't belong here (a stale or hand-edited URL) are dropped, so they can't hide everything.
  const categorySlugs = new Set(categories.map((category) => category.slug))
  const brandSlugs = new Set(brands.map((brand) => brand.slug))
  const filters: FilterState = {
    ...requested,
    categories: requested.categories.filter((slug) => categorySlugs.has(slug)),
    brands: requested.brands.filter((slug) => brandSlugs.has(slug)),
  }

  const { total, visible, hasMore } = applyFilters(products, filters)
  const counts = facetCounts(products, filters)
  const inAnyProduct = (slug: string) => products.some((product) => product.categorySlugs.includes(slug))

  const categoryOptions = categories
    .filter((category) => inAnyProduct(category.slug) || filters.categories.includes(category.slug))
    .map((category) => ({ value: category.slug, label: category.title, count: counts.categories.get(category.slug) ?? 0 }))
  const brandOptions = brands.map((brand) => ({
    value: brand.slug,
    label: brand.name,
    count: counts.brands.get(brand.slug) ?? 0,
  }))
  const labels = Object.fromEntries([
    ...categories.map((category) => [category.slug, category.title]),
    ...brands.map((brand) => [brand.slug, brand.name]),
  ])

  const promoIndex = promoGuide ? Math.min(PROMO_POSITION, visible.length) : -1
  const promoItem = promoGuide ? (
    <li>
      <GuidePromoCard guide={promoGuide} />
    </li>
  ) : null

  return (
    <FilterProvider initialState={filters}>
      <section aria-labelledby="produkter-tittel" className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <FilterPanel categoryOptions={categoryOptions} brandOptions={brandOptions} showOnSaleFilter={showOnSaleFilter} />

        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
            <h2 id="produkter-tittel" className="text-[15px] font-semibold" aria-live="polite">
              {productCountLabel(total)}
              {hasActiveFilters(filters) ? (
                <span className="font-normal text-muted">
                  {' '}
                  av {products.length} {scopeLabel}
                </span>
              ) : null}
            </h2>
            <SortSelect />
          </div>
          <ActiveFilters labels={labels} />

          <FilterResults>
            {visible.length ? (
              <ul className="mt-[18px] grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
                {visible.map((product, index) => (
                  <ProductItem key={product.id} promo={index === promoIndex ? promoItem : null}>
                    <ProductCard product={product} priority={index < 3} />
                  </ProductItem>
                ))}
                {promoIndex === visible.length ? promoItem : null}
              </ul>
            ) : (
              <div className="mt-[18px] rounded-xl bg-white px-6 py-14 text-center">
                <p className="text-lg font-semibold">Ingen produkter matcher filtrene</p>
                <p className="mt-2 text-sm text-muted">Prøv å fjerne et filter eller utvide prisområdet.</p>
              </div>
            )}

            {total > 0 ? (
              <div className="mt-8 flex flex-col items-center gap-3.5">
                <p className="text-[13px] text-muted">
                  Viser {visible.length} av {productCountLabel(total)}
                </p>
                <div aria-hidden="true" className="h-1 w-60 overflow-hidden rounded-full bg-line">
                  <div className="h-full bg-brand" style={{ width: `${(visible.length / total) * 100}%` }} />
                </div>
                {hasMore ? <LoadMoreLink /> : null}
              </div>
            ) : null}
          </FilterResults>
        </div>
      </section>
    </FilterProvider>
  )
}

/** A grid item, preceded by the guide card when it is the promo's slot. */
function ProductItem({ promo, children }: { promo: React.ReactNode; children: React.ReactNode }) {
  return (
    <>
      {promo}
      <li>{children}</li>
    </>
  )
}
