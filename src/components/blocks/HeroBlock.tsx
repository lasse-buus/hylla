import type { HeroBlock as HeroBlockData } from '@/payload-types'

import { ArrowRight, ArrowUpRight, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getProductSummaries } from '@/lib/catalog'
import { formatPrice } from '@/lib/format'
import { resolveLink } from '@/lib/links'
import { toImage } from '@/lib/media'

type HeroBlockProps = {
  block: HeroBlockData
  headingID: string
  /** The first hero carries the page's h1; any later ones use h2. */
  isPageHeading: boolean
}

/** The campaign banner: copy on brand blue, an image, and optionally a product card on the image. */
export async function HeroBlock({ block, headingID, isPageHeading }: HeroBlockProps) {
  const Heading = isPageHeading ? 'h1' : 'h2'
  const image = toImage(block.image, 'large')
  const link = resolveLink(block.link)
  const [product] = block.featuredProduct ? await getProductSummaries([block.featuredProduct]) : []

  return (
    <section aria-labelledby={headingID} className="flex min-h-[470px] flex-wrap overflow-hidden rounded-2xl">
      <div className="flex flex-[1_1_420px] flex-col justify-center gap-[22px] bg-brand px-6 py-10 text-white sm:px-10">
        {block.eyebrow ? (
          <p className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.6px] uppercase">
            <Zap className="size-4" strokeWidth={1.8} aria-hidden="true" />
            {block.eyebrow}
          </p>
        ) : null}
        <Heading
          id={headingID}
          className="text-[42px] leading-[1.02] font-bold tracking-[-1.4px] whitespace-pre-line sm:text-[58px] sm:tracking-[-1.8px]"
        >
          {block.title}
        </Heading>
        {block.text ? <p className="max-w-[390px] text-base leading-normal text-brand-soft">{block.text}</p> : null}
        {link || block.highlightValue ? (
          <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
            {link ? (
              <Link
                href={link.href}
                className="inline-flex h-12 items-center gap-3.5 rounded-md bg-white px-[22px] text-sm font-semibold text-ink hover:bg-brand-soft"
              >
                {link.label ?? 'Se mer'}
                <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </Link>
            ) : null}
            {block.highlightValue ? (
              <p className="flex flex-col gap-0.5">
                {block.highlightLabel ? <span className="text-[11px] text-brand-soft">{block.highlightLabel}</span> : null}
                <span className="text-[30px] leading-none font-bold">{block.highlightValue}</span>
              </p>
            ) : null}
          </div>
        ) : null}
        {block.finePrint ? <p className="text-[11px] text-brand-soft">{block.finePrint}</p> : null}
      </div>

      <div className="relative min-h-[300px] flex-[1.42_1_560px] bg-navy sm:min-h-[380px]">
        {image ? (
          <Image src={image.url} alt={image.alt} fill preload sizes="(min-width: 1360px) 770px, 100vw" className="object-cover" />
        ) : null}
        {product ? (
          <Link
            href={product.href}
            className="group absolute right-4 bottom-4 flex w-[323px] max-w-[calc(100%-32px)] items-center justify-between gap-4 rounded-xl bg-white p-[18px] text-ink sm:right-6 sm:bottom-6"
          >
            <span className="flex flex-col gap-1">
              {product.tag ? (
                <span className="text-[10px] font-bold tracking-[0.4px] text-brand">{product.tag}</span>
              ) : null}
              <span className="text-sm font-semibold group-hover:underline">{product.title}</span>
              <span className="text-[23px] font-bold tracking-[-0.4px]">{formatPrice(product.price)}</span>
            </span>
            <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
              <ArrowUpRight className="size-[18px]" strokeWidth={1.8} />
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  )
}
