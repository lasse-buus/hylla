import type { Metadata } from 'next'

import { ArrowRight, BookOpen, Clock, MessageCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { GuideContent } from '@/components/guide/GuideContent'
import { GuideToc } from '@/components/guide/GuideToc'
import { GuideCard } from '@/components/shop/GuideCard'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { formatDate, formatPrice } from '@/lib/format'
import { getGuidePage, type GuidePageData } from '@/lib/guide'
import { routes } from '@/lib/routes'

export async function generateMetadata(props: PageProps<'/guider/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const data = await getGuidePage(slug)
  if (!data) return {}

  return {
    title: data.guide.title,
    description: data.guide.excerpt,
    openGraph: {
      type: 'article',
      publishedTime: data.guide.publishedAt ?? undefined,
      images: data.hero ? [{ url: data.hero.url, width: data.hero.width, height: data.hero.height, alt: data.hero.alt }] : undefined,
    },
  }
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

function AuthorAvatar({ author, size }: { author: NonNullable<GuidePageData['author']>; size: 'sm' | 'lg' }) {
  const className = size === 'sm' ? 'size-10 text-[13px]' : 'size-[52px] text-base'

  return author.image ? (
    <Image
      src={author.image.url}
      alt=""
      width={size === 'sm' ? 40 : 52}
      height={size === 'sm' ? 40 : 52}
      className={`${className} shrink-0 rounded-full object-cover`}
    />
  ) : (
    <span aria-hidden="true" className={`${className} inline-flex shrink-0 items-center justify-center rounded-full bg-ink font-bold text-white`}>
      {initials(author.name)}
    </span>
  )
}

export default async function GuidePage(props: PageProps<'/guider/[slug]'>) {
  const { slug } = await props.params
  const data = await getGuidePage(slug)
  if (!data) notFound()

  const { guide, author, department, hero, embeddedProducts, relatedProducts, toc, moreGuides } = data

  return (
    <>
      <article>
        <header className="shop-container pt-5">
          <Breadcrumbs trail={[{ title: 'Guider og tips', href: routes.guides }]} current={guide.title} />

          <div className="mx-auto mt-12 flex max-w-[860px] flex-col items-center gap-5 text-center">
            {guide.kicker ? (
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-[7px] text-[11px] font-bold tracking-[0.6px] text-brand uppercase">
                <BookOpen className="size-4" strokeWidth={1.8} aria-hidden="true" />
                {guide.kicker}
              </p>
            ) : null}
            <h1 className="text-[38px] leading-[1.04] font-extrabold tracking-[-1.2px] sm:text-[56px] sm:tracking-[-1.8px]">
              {guide.title}
            </h1>
            <p className="max-w-[720px] text-lg leading-[1.55] text-subtle sm:text-xl">{guide.excerpt}</p>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-[13px] text-muted">
              {author ? (
                <span className="inline-flex items-center gap-2.5 text-left">
                  <AuthorAvatar author={author} size="sm" />
                  <span className="flex flex-col gap-0.5">
                    <span className="font-semibold text-ink">{author.name}</span>
                    {author.role ? <span className="text-xs">{author.role}</span> : null}
                  </span>
                </span>
              ) : null}
              {guide.publishedAt ? (
                <span>
                  Publisert <time dateTime={guide.publishedAt}>{formatDate(guide.publishedAt)}</time>
                </span>
              ) : null}
              {guide.readingMinutes ? (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  {guide.readingMinutes} min lesetid
                </span>
              ) : null}
            </div>
          </div>
        </header>

        {hero ? (
          <figure className="shop-container mt-10">
            <div className="relative h-[280px] overflow-hidden rounded-2xl bg-navy-raised sm:h-[560px]">
              <Image src={hero.url} alt={hero.alt} fill preload sizes="(min-width: 1360px) 1312px, 100vw" className="object-cover" />
            </div>
            {guide.heroCaption ? <figcaption className="mt-2.5 text-xs text-muted">{guide.heroCaption}</figcaption> : null}
          </figure>
        ) : null}

        <div className="shop-container grid items-start gap-x-14 gap-y-10 pt-14 lg:grid-cols-[220px_minmax(0,720px)_minmax(0,1fr)]">
          <GuideToc entries={toc} title={guide.title} />

          <div className="min-w-0">
            {guide.content ? <GuideContent content={guide.content} embeddedProducts={embeddedProducts} /> : null}

            {author ? (
              <div className="mt-10 flex items-center gap-4 rounded-xl bg-white px-6 py-[22px]">
                <AuthorAvatar author={author} size="lg" />
                <div className="text-sm leading-[1.55]">
                  <p className="font-semibold">Skrevet av {author.name}</p>
                  {author.bio ? <p className="mt-0.5 text-muted">{author.bio}</p> : null}
                </div>
              </div>
            ) : null}
          </div>

          <aside aria-label="Relatert" className="flex flex-col gap-4">
            {relatedProducts.length ? (
              <section aria-labelledby="iguiden" className="rounded-xl bg-white p-5">
                <h2 id="iguiden" className="mb-3.5 text-[15px] font-bold">
                  Produkter i guiden
                </h2>
                <ul className="flex flex-col">
                  {relatedProducts.map((product) => (
                    <li key={product.id} className="flex items-center gap-3 border-t border-line py-3">
                      <span className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                        {product.image ? <Image src={product.image.url} alt="" fill sizes="56px" className="object-cover" /> : null}
                      </span>
                      <span className="flex min-w-0 flex-col gap-[3px]">
                        <Link href={product.href} className="text-[13px] leading-[1.35] font-semibold hover:underline">
                          {product.title}
                        </Link>
                        <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {department ? (
                  <Link
                    href={routes.category(department.slug ?? '')}
                    className="mt-2 flex h-[42px] items-center justify-center rounded-md border-[1.5px] border-ink text-[13px] font-semibold hover:bg-surface"
                  >
                    Se alt i {department.title}
                  </Link>
                ) : null}
              </section>
            ) : null}

            <section aria-labelledby="raad" className="rounded-xl bg-ink p-[22px] text-white">
              <span className="flex size-[42px] items-center justify-center rounded-full bg-[#26324a] text-brand-light">
                <MessageCircle className="size-5" strokeWidth={1.8} aria-hidden="true" />
              </span>
              <h2 id="raad" className="mt-3.5 mb-1.5 text-lg font-bold">
                Trenger du råd?
              </h2>
              <p className="mb-4 text-[13px] leading-[1.55] text-steel">
                Ekspertene våre hjelper deg å finne riktig produkt og sette det opp.
              </p>
              <Link
                href={`${routes.customerService}#kontakt`}
                className="flex h-[42px] items-center justify-center rounded-md bg-white text-[13px] font-semibold text-ink hover:bg-surface"
              >
                Kontakt kundeservice
              </Link>
            </section>
          </aside>
        </div>
      </article>

      {moreGuides.length ? (
        <section aria-labelledby="lesogsaa" className="shop-container pt-20 pb-[72px]">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="lesogsaa" className="text-[30px] font-bold tracking-[-0.6px]">
              Les også
            </h2>
            <Link href={routes.guides} className="inline-flex items-center gap-2.5 text-sm font-semibold text-brand hover:underline">
              Alle guider og tips
              <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
            {moreGuides.map((other) => (
              <li key={other.id}>
                <GuideCard guide={other} />
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <div className="pb-[72px]" />
      )}
    </>
  )
}
