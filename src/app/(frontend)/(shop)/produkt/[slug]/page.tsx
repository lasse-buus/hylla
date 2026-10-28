import type { Metadata } from 'next'

import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { BuyBox } from '@/components/product/BuyBox'
import { ProductGallery } from '@/components/product/ProductGallery'
import { ProductReviews } from '@/components/product/ProductReviews'
import { ProductCard } from '@/components/shop/ProductCard'
import { formatRating, StarRating } from '@/components/shop/StarRating'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { featureIcons } from '@/components/site/icons'
import { RichText } from '@/components/site/RichText'
import { type Section, SectionNav } from '@/components/site/SectionNav'
import { badgeLabels } from '@/lib/catalog'
import { formatKroner } from '@/lib/format'
import { getProductPage, type ProductPageData } from '@/lib/product'
import { routes } from '@/lib/routes'
import { initialVariant, type VariantData } from '@/lib/variants'

export async function generateMetadata(props: PageProps<'/produkt/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const data = await getProductPage(slug)
  if (!data) return {}

  const image = data.gallery[0]
  return {
    title: data.product.title,
    description: data.product.shortSpecs ?? undefined,
    openGraph: image ? { images: [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] } : undefined,
  }
}

/** A product without variants is offered to the buy box as one variant with no options. */
const sellableVariants = ({ product, variants }: ProductPageData): VariantData[] =>
  variants.length
    ? variants
    : [
        {
          id: product.id,
          sku: product.sku ?? null,
          price: product.priceInNOK ?? 0,
          compareAtPrice: product.compareAtPrice ?? null,
          inventory: product.inventory ?? 0,
          options: {},
        },
      ]

/** Structured data for search engines. Prices are fictional, like the rest of the shop. */
function productJsonLd({ product, brand, gallery }: ProductPageData, variant: VariantData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: variant.sku ?? undefined,
    brand: brand ? { '@type': 'Brand', name: brand.name } : undefined,
    image: gallery.map((image) => image.url),
    description: product.shortSpecs ?? undefined,
    aggregateRating:
      product.rating && product.reviewCount
        ? { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviewCount }
        : undefined,
    offers: {
      '@type': 'Offer',
      price: variant.price,
      priceCurrency: 'NOK',
      availability: variant.inventory > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  }
}

export default async function ProductPage(props: PageProps<'/produkt/[slug]'>) {
  const { slug } = await props.params
  const data = await getProductPage(slug)
  if (!data) notFound()

  const { product, brand, trail, department, gallery, variantGroups, reviews, addOns, related } = data
  const variants = sellableVariants(data)
  const variant = initialVariant(variants, variantGroups, await props.searchParams, product.priceInNOK ?? null) ?? variants[0]

  const saving = product.compareAtPrice && product.priceInNOK ? product.compareAtPrice - product.priceInNOK : 0
  const badge = badgeLabels[product.badge ?? '']
  const galleryTags = [
    ...(saving > 0 ? [{ label: `SPAR ${formatKroner(saving).toUpperCase()}`, tone: 'brand' as const }] : []),
    ...(badge ? [{ label: badge, tone: 'ink' as const }] : []),
  ]

  const specGroups = product.specGroups ?? []
  const features = product.features ?? []
  const faq = product.faq ?? []
  const rating = product.rating ?? 0
  const reviewCount = product.reviewCount ?? 0
  const hasOverview = Boolean(product.description || product.overviewTitle || features.length)

  const sections: Section[] = [
    ...(hasOverview ? [{ id: 'oversikt', label: 'Oversikt' }] : []),
    ...(specGroups.length ? [{ id: 'spesifikasjoner', label: 'Spesifikasjoner' }] : []),
    ...(reviewCount ? [{ id: 'vurderinger', label: `Vurderinger (${reviewCount})` }] : []),
    ...(faq.length ? [{ id: 'sporsmal', label: `Spørsmål og svar (${faq.length})` }] : []),
  ]

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <script
        type="application/ld+json"
        // JSON.stringify doesn't escape "<", so a "</script>" in content can't break out of the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(data, variant)).replace(/</g, '\\u003c') }}
      />
      <Breadcrumbs trail={trail} current={product.title} />

      <section
        aria-labelledby="produktnavn"
        className="mt-4 grid items-start gap-10 rounded-2xl bg-white p-5 sm:p-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
      >
        <ProductGallery title={product.title} images={gallery} tags={galleryTags} />

        <div className="flex min-w-0 flex-col gap-[22px]">
          <div>
            {brand ? <p className="mb-2 text-[13px] font-semibold text-brand">{brand.name}</p> : null}
            <h1 id="produktnavn" className="text-[28px] leading-[1.15] font-bold tracking-[-0.8px] sm:text-[34px]">
              {product.title}
            </h1>
            {reviewCount ? (
              <p className="mt-2.5 flex items-center gap-2 text-[13px]">
                <StarRating rating={rating} />
                <span className="font-semibold">{formatRating(rating)}</span>
                <a href="#vurderinger" className="text-muted underline hover:text-ink">
                  {reviewCount} vurderinger
                </a>
              </p>
            ) : null}
          </div>

          {product.highlights?.length ? (
            <div className="flex flex-col gap-2.5">
              <ul className="flex flex-col gap-[9px] text-sm">
                {product.highlights.map((highlight) => (
                  <li key={highlight.id ?? highlight.text} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-success" strokeWidth={2.2} aria-hidden="true" />
                    {highlight.text}
                  </li>
                ))}
              </ul>
              {specGroups.length ? (
                <a href="#spesifikasjoner" className="text-[13px] font-semibold text-brand hover:underline">
                  Se alle spesifikasjoner
                </a>
              ) : null}
            </div>
          ) : null}

          <BuyBox
            productID={product.id}
            variantGroups={variantGroups}
            variants={variants}
            initialVariantID={variant.id}
            addOns={addOns}
            freeShippingThreshold={data.freeShippingThreshold}
            storePickup={data.storePickup}
          />
        </div>
      </section>

      {/* The nav stays sticky while these sections scroll past. */}
      <div className="mt-6">
        {sections.length > 1 ? <SectionNav sections={sections} label="Om produktet" /> : null}

        {hasOverview ? (
          <section
            id="oversikt"
            aria-labelledby="oversikt-tittel"
            className="flex scroll-mt-24 flex-wrap gap-x-14 gap-y-8 pt-12"
          >
            <div className="flex-[1_1_420px]">
              <p className="mb-2.5 text-[11px] font-bold tracking-[0.8px] text-brand">OVERSIKT</p>
              <h2 id="oversikt-tittel" className="mb-[18px] text-[30px] leading-[1.1] font-bold tracking-[-0.8px] sm:text-4xl">
                {product.overviewTitle ?? `Om ${product.title}`}
              </h2>
              {product.description ? <RichText data={product.description} /> : null}
            </div>
            {features.length ? (
              <ul className="grid flex-[1_1_520px] gap-3 sm:grid-cols-2">
                {features.map((feature) => {
                  const Icon = feature.icon ? featureIcons[feature.icon] : null

                  return (
                    <li key={feature.id ?? feature.title} className="flex flex-col gap-2.5 rounded-xl bg-white p-6">
                      {Icon ? (
                        <span className="flex size-[42px] items-center justify-center rounded-full bg-brand-soft text-brand">
                          <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                        </span>
                      ) : null}
                      <h3 className="mt-1 text-base font-semibold">{feature.title}</h3>
                      {feature.text ? <p className="text-[13px] leading-[1.55] text-muted">{feature.text}</p> : null}
                    </li>
                  )
                })}
              </ul>
            ) : null}
          </section>
        ) : null}

        {specGroups.length ? (
          <section id="spesifikasjoner" aria-labelledby="spes-tittel" className="scroll-mt-24 pt-16">
            <h2 id="spes-tittel" className="mb-5 text-[30px] font-bold tracking-[-0.6px]">
              Spesifikasjoner
            </h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(420px,100%),1fr))] gap-x-14 rounded-xl bg-white px-5 pt-3 pb-6 sm:px-8">
              {specGroups.map((group) => (
                <div key={group.id ?? group.title} className="pt-5">
                  <h3 className="mb-1 text-[13px] font-bold tracking-[0.4px] text-muted uppercase">{group.title}</h3>
                  <dl>
                    {(group.rows ?? []).map((row) => (
                      <div key={row.id ?? row.label} className="flex gap-4 border-b border-line py-3 text-sm">
                        <dt className="flex-[0_0_40%] text-muted">{row.label}</dt>
                        <dd className="flex-1 font-medium">{row.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {reviewCount ? (
          <section id="vurderinger" aria-labelledby="vurd-tittel" className="scroll-mt-24 pt-16">
            <h2 id="vurd-tittel" className="mb-5 text-[30px] font-bold tracking-[-0.6px]">
              Kundevurderinger
            </h2>
            <ProductReviews
              rating={rating}
              reviewCount={reviewCount}
              breakdown={product.ratingBreakdown}
              reviews={reviews}
            />
          </section>
        ) : null}

        {faq.length ? (
          <section id="sporsmal" aria-labelledby="qa-tittel" className="scroll-mt-24 pt-16">
            <h2 id="qa-tittel" className="mb-5 text-[30px] font-bold tracking-[-0.6px]">
              Spørsmål og svar
            </h2>
            <div className="rounded-xl bg-white px-5 py-1 sm:px-7">
              {faq.map((entry, index) => (
                <details
                  key={entry.id ?? entry.question}
                  open={index === 0}
                  className="border-b border-line py-5 last:border-b-0"
                >
                  <summary className="cursor-pointer text-base font-semibold">{entry.question}</summary>
                  <p className="mt-3 text-sm leading-[1.6] text-subtle">{entry.answer}</p>
                  <p className="mt-2 text-xs text-muted">Svar fra Hylla kundeservice</p>
                </details>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      {related.length ? (
        <section aria-labelledby="relatert-tittel" className="pt-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="relatert-tittel" className="mb-2 text-[30px] font-bold tracking-[-0.6px]">
                Passer godt sammen med
              </h2>
              <p className="text-[15px] text-muted">Utstyr som gjør oppsettet komplett.</p>
            </div>
            {department ? (
              <Link
                href={routes.category(department.slug ?? '')}
                className="inline-flex items-center gap-2.5 text-sm font-semibold text-brand hover:underline"
              >
                Se alt i {department.title}
                <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </Link>
            ) : null}
          </div>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {related.map((relatedProduct) => (
              <li key={relatedProduct.id}>
                <ProductCard product={relatedProduct} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
