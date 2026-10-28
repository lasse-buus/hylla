import type { GuideSummary } from '@/lib/catalog'

import { ArrowRight, Lightbulb } from 'lucide-react'
import Link from 'next/link'

/** The blue guide card that sits between products in the grid. */
export function GuidePromoCard({ guide }: { guide: GuideSummary }) {
  const kind = guide.kicker?.split('·').at(-1)?.trim()
  const eyebrow = [kind, guide.readingMinutes ? `${guide.readingMinutes} min` : null].filter(Boolean).join(' · ')

  return (
    <Link
      href={guide.href}
      className="group flex min-h-[466px] flex-col gap-4 rounded-xl bg-brand p-7 text-white hover:bg-brand-hover"
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.8px] uppercase">
          <Lightbulb className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <span className="text-[30px] leading-[1.12] font-bold tracking-[-0.6px]">{guide.title}</span>
      <span className="text-[15px] leading-normal text-brand-soft">{guide.excerpt}</span>
      <span className="mt-auto inline-flex items-center gap-3 self-start rounded-md bg-white px-5 py-3.5 text-sm font-semibold text-ink group-hover:underline">
        Les guiden
        <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
      </span>
    </Link>
  )
}
