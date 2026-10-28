import type { GuideSummary } from '@/lib/catalog'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function GuideCard({ guide }: { guide: GuideSummary }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl bg-white">
      <div className="relative h-[211px] bg-line">
        {guide.image ? (
          <Image
            src={guide.image.url}
            alt={guide.image.alt}
            fill
            sizes="(min-width: 1360px) 420px, (min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <p className="flex items-center justify-between gap-3">
          {guide.kicker ? (
            <span className="text-[11px] font-bold tracking-[0.5px] text-brand uppercase">{guide.kicker}</span>
          ) : null}
          {guide.readingMinutes ? <span className="text-xs text-muted">{guide.readingMinutes} min lesetid</span> : null}
        </p>
        <h3 className="text-[22px] leading-[1.25] font-semibold tracking-[-0.3px]">
          <Link href={guide.href} className="after:absolute after:inset-0 hover:underline">
            {guide.title}
          </Link>
        </h3>
        <span aria-hidden="true" className="mt-auto inline-flex items-center gap-2 text-[13px] font-semibold text-brand">
          Les guiden
          <ArrowRight className="size-4" strokeWidth={1.8} />
        </span>
      </div>
    </article>
  )
}
