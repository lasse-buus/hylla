import type { CtaBannerBlock as CtaBannerBlockData } from '@/payload-types'

import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { categoryIcons } from '@/components/site/icons'
import { getCategoryLinks } from '@/lib/catalog'
import { resolveLink } from '@/lib/links'
import { toImage } from '@/lib/media'

/** The dark call-to-action banner, with shortcut chips to categories on the image. */
export async function CtaBannerBlock({ block, headingID }: { block: CtaBannerBlockData; headingID: string }) {
  const image = toImage(block.image, 'large')
  const link = resolveLink(block.link)
  const shortcuts = block.shortcuts?.length ? await getCategoryLinks(block.shortcuts) : []
  const Icon = block.icon ? categoryIcons[block.icon] : null

  return (
    <section aria-labelledby={headingID} className="flex min-h-[364px] flex-wrap overflow-hidden rounded-2xl bg-ink text-white">
      <div className="flex flex-[1_1_400px] flex-col justify-center gap-5 px-6 py-12 sm:px-10 sm:py-[52px]">
        {block.eyebrow ? (
          <p className="inline-flex items-center gap-2 text-xs tracking-[0.4px] uppercase">
            {Icon ? <Icon className="size-5 text-brand-light" strokeWidth={1.7} aria-hidden="true" /> : null}
            {block.eyebrow}
          </p>
        ) : null}
        <h2 id={headingID} className="text-[32px] leading-[1.1] font-bold tracking-[-1px] whitespace-pre-line sm:text-[39px]">
          {block.title}
        </h2>
        {block.text ? <p className="max-w-[440px] text-[15px] leading-[1.55] text-steel">{block.text}</p> : null}
        {link ? (
          <Link
            href={link.href}
            className="inline-flex h-12 items-center gap-3.5 self-start rounded-md bg-brand px-[22px] text-sm font-semibold hover:bg-brand-hover"
          >
            {link.label ?? 'Se mer'}
            <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </Link>
        ) : null}
      </div>
      <div className="relative min-h-[300px] flex-[1.52_1_560px] bg-navy">
        {image ? (
          <Image src={image.url} alt={image.alt} fill sizes="(min-width: 1360px) 780px, 100vw" className="object-cover" />
        ) : null}
        {shortcuts.length ? (
          <ul aria-label="Snarveier" className="absolute bottom-6 left-6 flex flex-wrap gap-2 sm:left-7">
            {shortcuts.map((shortcut) => (
              <li key={shortcut.slug}>
                <Link
                  href={shortcut.href}
                  className="inline-flex items-center gap-1 rounded-full border border-[#5a6680] bg-[#26324a] px-3.5 py-[9px] text-[11px] font-semibold hover:bg-navy-raised hover:underline"
                >
                  {shortcut.title}
                  <ArrowUpRight className="size-3.5" strokeWidth={1.8} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  )
}
