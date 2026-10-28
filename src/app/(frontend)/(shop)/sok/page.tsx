import type { Metadata } from 'next'

import { SearchX } from 'lucide-react'
import Link from 'next/link'

import { GuideCard } from '@/components/shop/GuideCard'
import { ProductCard } from '@/components/shop/ProductCard'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { getPopularProducts } from '@/lib/catalog'
import { routes } from '@/lib/routes'
import { normalizeQuery, searchShop } from '@/lib/search'

const PRODUCT_LIMIT = 24
const GUIDE_LIMIT = 6

export async function generateMetadata(props: PageProps<'/sok'>): Promise<Metadata> {
  const query = normalizeQuery((await props.searchParams).q)
  return { title: query ? `Søk: ${query}` : 'Søk', robots: { index: false } }
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

export default async function SearchPage(props: PageProps<'/sok'>) {
  const query = normalizeQuery((await props.searchParams).q)
  const results = await searchShop(query, { productLimit: PRODUCT_LIMIT, guideLimit: GUIDE_LIMIT })
  const hasResults = results.productTotal + results.guideTotal > 0
  const popular = hasResults ? [] : await getPopularProducts(4)

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <Breadcrumbs trail={[]} current="Søk" />

      <header className="mt-6">
        <h1 className="text-[32px] leading-tight font-extrabold tracking-[-1px] sm:text-4xl">
          {query ? <>Søkeresultater for «{query}»</> : 'Søk i Hylla'}
        </h1>
        <p className="mt-2 text-[15px] text-muted" aria-live="polite">
          {!query
            ? 'Skriv i søkefeltet øverst for å finne produkter, guider og tips.'
            : hasResults
              ? `${count(results.productTotal, 'produkt', 'produkter')} og ${count(results.guideTotal, 'guide', 'guider')}`
              : 'Ingen treff.'}
        </p>
      </header>

      {results.products.length ? (
        <section aria-labelledby="produkter-tittel" className="mt-8">
          <h2 id="produkter-tittel" className="mb-4 text-[22px] font-bold tracking-[-0.4px]">
            Produkter
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {results.products.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} priority={index < 4} />
              </li>
            ))}
          </ul>
          {results.productTotal > results.products.length ? (
            <p className="mt-4 text-sm text-muted">
              Viser {results.products.length} av {results.productTotal}. Prøv et mer presist søk for å snevre inn.
            </p>
          ) : null}
        </section>
      ) : null}

      {results.guides.length ? (
        <section aria-labelledby="guider-tittel" className="mt-12">
          <h2 id="guider-tittel" className="mb-4 text-[22px] font-bold tracking-[-0.4px]">
            Guider og tips
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {results.guides.map((guide) => (
              <li key={guide.id}>
                <GuideCard guide={guide} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {query && !hasResults ? (
        <section className="mt-8 flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-14 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
            <SearchX className="size-7" strokeWidth={1.7} aria-hidden="true" />
          </span>
          <h2 className="text-[22px] font-bold">Vi fant ingenting som passer «{query}»</h2>
          <p className="max-w-[460px] text-[15px] text-muted">
            Sjekk stavingen, prøv et kortere ord eller søk på merke eller produkttype, for eksempel «Vektor» eller «hodetelefoner».
          </p>
          <Link href={routes.deals} className="mt-1.5 text-sm font-semibold text-brand hover:underline">
            Se ukens tilbud
          </Link>
        </section>
      ) : null}

      {popular.length ? (
        <section aria-labelledby="populaert-tittel" className="mt-14">
          <h2 id="populaert-tittel" className="mb-4 text-[22px] font-bold tracking-[-0.4px]">
            Populært akkurat nå
          </h2>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {popular.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
