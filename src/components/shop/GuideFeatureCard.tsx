import type { GuideSummary } from '@/lib/catalog'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

/** A wide card for a highlighted guide: image on one side, kicker, title and excerpt on the other. */
export function GuideFeatureCard({ guide }: { guide: GuideSummary }) {
  return (
    <article className="relative flex flex-wrap overflow-hidden rounded-2xl bg-white">
      <div className="relative min-h-[260px] flex-[1.3_1_480px] bg-line">
        {guide.image ? (
          <Image
            src={guide.image.url}
            alt={guide.image.alt}
            fill
            preload
            sizes="(min-width: 1360px) 740px, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-[1_1_360px] flex-col justify-center gap-4 p-6 sm:p-10">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="rounded-full bg-brand-soft px-3 py-1 text-[11px] font-bold tracking-[0.5px] text-brand">NYESTE</span>
          {guide.kicker ? (
            <span className="text-[11px] font-bold tracking-[0.5px] text-brand uppercase">{guide.kicker}</span>
          ) : null}
          {guide.readingMinutes ? <span className="text-xs text-muted">{guide.readingMinutes} min lesetid</span> : null}
        </p>
        <h2 className="text-[28px] leading-[1.15] font-bold tracking-[-0.6px] sm:text-[34px]">
          <Link href={guide.href} className="after:absolute after:inset-0 hover:underline">
            {guide.title}
          </Link>
        </h2>
        <p className="text-base leading-[1.55] text-subtle">{guide.excerpt}</p>
        <span aria-hidden="true" className="inline-flex items-center gap-2 text-sm font-semibold text-brand">
          Les guiden
          <ArrowRight className="size-4" strokeWidth={1.8} />
        </span>
      </div>
    </article>
  )
}
