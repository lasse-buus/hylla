import type { ResolvedLink } from '@/lib/links'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

type SectionHeaderProps = {
  id: string
  title: string
  intro?: string | null
  link?: ResolvedLink | null
}

/** A section's heading, intro and optional "see all" link. */
export function SectionHeader({ id, title, intro, link }: SectionHeaderProps) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-[26px] font-bold tracking-[-0.6px] sm:text-[30px]">
          {title}
        </h2>
        {intro ? <p className="mt-2 text-[15px] text-muted">{intro}</p> : null}
      </div>
      {link ? (
        <Link href={link.href} className="inline-flex items-center gap-2.5 text-sm font-semibold text-brand hover:underline">
          {link.label ?? 'Se alle'}
          <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  )
}
