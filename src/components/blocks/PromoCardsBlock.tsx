import type { PromoCardsBlock as PromoCardsBlockData } from '@/payload-types'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getProductSummaries } from '@/lib/catalog'
import { formatPrice } from '@/lib/format'
import { resolveLink } from '@/lib/links'
import { toImage } from '@/lib/media'

const tones = {
  sand: { card: 'bg-[#e7ebe6]', eyebrow: 'text-success' },
  blue: { card: 'bg-brand-soft', eyebrow: 'text-brand' },
}

type Card = NonNullable<PromoCardsBlockData['cards']>[number]

/** One or two campaign cards side by side, each with copy, an image and a button. */
export async function PromoCardsBlock({ block }: { block: PromoCardsBlockData }) {
  const cards = block.cards ?? []
  if (!cards.length) return null

  return (
    <section aria-label="Kampanjer" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,560px),1fr))] gap-6">
      {cards.map((card) => (
        <PromoCard key={card.id ?? card.title} card={card} />
      ))}
    </section>
  )
}

async function PromoCard({ card }: { card: Card }) {
  const tone = tones[card.tone ?? 'sand']
  const image = toImage(card.image, 'card')
  const link = resolveLink(card.link)
  const [product] = card.product ? await getProductSummaries([card.product]) : []

  return (
    <article className={`flex min-h-[348px] flex-wrap overflow-hidden rounded-2xl ${tone.card}`}>
      <div className="flex flex-[1_1_260px] flex-col justify-center gap-4 p-[30px]">
        {card.eyebrow ? (
          <p className={`text-[11px] font-bold tracking-[0.6px] uppercase ${tone.eyebrow}`}>{card.eyebrow}</p>
        ) : null}
        <h2 className="text-[31px] leading-[1.1] font-bold tracking-[-0.6px] whitespace-pre-line">{card.title}</h2>
        {card.text ? <p className="text-sm leading-normal text-subtle">{card.text}</p> : null}
        {product ? (
          <p className="flex items-baseline gap-2">
            <span className="text-[13px] text-muted">Fra</span>
            <span className="text-[27px] font-bold tracking-[-0.4px]">{formatPrice(product.price)}</span>
          </p>
        ) : null}
        {link ? (
          <Link
            href={link.href}
            className="inline-flex h-10 items-center gap-3.5 self-start rounded-md bg-brand px-4 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            {link.label ?? 'Se mer'}
            <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      {image ? (
        <div className="relative min-h-[260px] flex-[1_1_260px]">
          <Image src={image.url} alt={image.alt} fill sizes="(min-width: 1360px) 320px, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : null}
    </article>
  )
}
