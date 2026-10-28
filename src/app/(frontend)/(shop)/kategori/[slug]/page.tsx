import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { CategoryHero } from '@/components/category/CategoryHero'
import { ProductBrowser } from '@/components/category/ProductBrowser'
import { SubcategoryTiles } from '@/components/category/SubcategoryTiles'
import { GuideCard } from '@/components/shop/GuideCard'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { type CategoryPageData, getCategoryPage, maxDiscountPercent } from '@/lib/catalog'
import { formatKroner } from '@/lib/format'
import { toImage } from '@/lib/media'
import { parseFilters } from '@/lib/productFilters'
import { routes } from '@/lib/routes'

export async function generateMetadata(props: PageProps<'/kategori/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const data = await getCategoryPage(slug)
  if (!data) return {}

  return {
    title: data.category.title,
    description: data.category.description ?? `Kjøp ${data.category.title.toLowerCase()} hos Hylla.`,
  }
}

function heroStats({ products, freeShippingThreshold }: CategoryPageData) {
  const biggestDiscount = maxDiscountPercent(products)

  return [
    { label: 'Produkter', value: String(products.length) },
    ...(biggestDiscount > 0 ? [{ label: 'Tilbud', value: `Spar opptil ${biggestDiscount} %` }] : []),
    { label: 'Fri frakt', value: `Over ${formatKroner(freeShippingThreshold)}` },
  ]
}

export default async function CategoryPage(props: PageProps<'/kategori/[slug]'>) {
  const { slug } = await props.params
  const data = await getCategoryPage(slug)
  if (!data) notFound()

  const { category, parent, subcategories, products, brands, guides, promoGuide } = data
  const filters = parseFilters(await props.searchParams)

  const stockedSubcategories = subcategories.filter((subcategory) => subcategory.productCount > 0)
  const shortcuts = [...stockedSubcategories].sort((a, b) => b.productCount - a.productCount).slice(0, 3)

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <Breadcrumbs
        trail={parent ? [{ title: parent.title, href: routes.category(parent.slug ?? '') }] : []}
        current={category.title}
      />

      <div className="mt-4">
        {parent ? (
          <header>
            <h1 id="kategori-tittel" className="text-[40px] leading-tight font-extrabold tracking-[-1.2px]">
              {category.title}
            </h1>
            {category.description ? (
              <p className="mt-2 max-w-[640px] text-base leading-[1.55] text-subtle">{category.description}</p>
            ) : null}
          </header>
        ) : (
          <CategoryHero
            title={category.title}
            description={category.description ?? null}
            icon={category.icon ?? null}
            image={toImage(category.heroImage, 'large')}
            stats={heroStats(data)}
            shortcuts={shortcuts}
          />
        )}
      </div>

      {stockedSubcategories.length > 1 ? (
        <div className="mt-9">
          <SubcategoryTiles title="Handle etter kategori" categories={stockedSubcategories} />
        </div>
      ) : null}

      <div className="mt-9">
        <ProductBrowser
          products={products}
          filters={filters}
          categories={subcategories}
          brands={brands}
          scopeLabel={`i ${category.title}`}
          promoGuide={promoGuide}
        />
      </div>

      {guides.length ? (
        <section aria-labelledby="guider-tittel" className="mt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="guider-tittel" className="mb-2 text-[30px] font-bold tracking-[-0.6px]">
                Guider og tips
              </h2>
              <p className="text-[15px] text-muted">Bli litt klokere før du kjøper.</p>
            </div>
            <Link href={routes.guides} className="inline-flex items-center gap-2.5 text-sm font-semibold text-brand hover:underline">
              Alle guider og tips
              <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {guides.map((guide) => (
              <li key={guide.id}>
                <GuideCard guide={guide} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
