import type { ServiceHighlightsBlock as ServiceHighlightsBlockData } from '@/payload-types'

import { Headset, RotateCcw, Truck, Wrench } from 'lucide-react'
import Link from 'next/link'

import { resolveLink } from '@/lib/links'

const icons = { truck: Truck, return: RotateCcw, help: Headset, repair: Wrench }

/** "Trygt å handle": up to four promises, each with an icon, short text and a link. */
export function ServiceHighlightsBlock({ block, headingID }: { block: ServiceHighlightsBlockData; headingID: string }) {
  const items = block.items ?? []
  if (!items.length) return null

  return (
    <section aria-labelledby={headingID}>
      <div className="mb-7 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h2 id={headingID} className="text-2xl font-bold tracking-[-0.4px]">
          {block.title}
        </h2>
        {block.intro ? <p className="text-[13px] text-muted">{block.intro}</p> : null}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
        {items.map((item) => {
          const Icon = icons[item.icon]
          const link = resolveLink(item.link)

          return (
            <li key={item.id ?? item.title} className="flex flex-col gap-3">
              <span className="flex size-[42px] items-center justify-center rounded-full bg-brand-soft text-brand">
                <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
              </span>
              <h3 className="text-base font-semibold">{item.title}</h3>
              {item.text ? <p className="text-sm leading-normal text-muted">{item.text}</p> : null}
              {link ? (
                <Link href={link.href} className="text-[13px] font-semibold text-brand hover:underline">
                  {link.label ?? 'Les mer'} →
                </Link>
              ) : null}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
