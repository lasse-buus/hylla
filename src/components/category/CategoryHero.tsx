import type { CategoryLink } from '@/lib/catalog'
import type { ImageData } from '@/lib/media'

import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { categoryIcons } from '@/components/site/icons'

type CategoryHeroProps = {
  title: string
  /** Defaults to "Hylla {title}". */
  eyebrow?: string
  description: string | null
  icon: string | null
  image: ImageData | null
  stats: { label: string; value: string }[]
  shortcuts: CategoryLink[]
}

/** The dark department banner. Without a hero image it collapses to the text column. */
export function CategoryHero({ title, eyebrow = `Hylla ${title}`, description, icon, image, stats, shortcuts }: CategoryHeroProps) {
  const Icon = icon ? categoryIcons[icon] : null

  return (
    <section aria-labelledby="kategori-tittel" className="flex flex-wrap overflow-hidden rounded-2xl bg-ink text-white">
      <div className="flex flex-[1_1_420px] flex-col justify-center gap-[18px] px-6 py-9 sm:px-10 sm:py-11">
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.8px] uppercase">
          {Icon ? <Icon className="size-5 text-brand-light" strokeWidth={1.7} aria-hidden="true" /> : null}
          {eyebrow}
        </p>
        <h1 id="kategori-tittel" className="text-[44px] leading-none font-extrabold tracking-[-1.4px] sm:text-[58px] sm:tracking-[-1.8px]">
          {title}
        </h1>
        {description ? <p className="max-w-[440px] text-base leading-[1.55] text-steel">{description}</p> : null}
        {stats.length ? (
          <dl className="mt-2.5 flex flex-wrap gap-x-9 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs text-steel">{stat.label}</dt>
                <dd className="mt-1 text-[22px] font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>

      {image ? (
        <div className="relative min-h-[260px] flex-[1_1_560px] bg-navy-raised sm:min-h-[340px]">
          <Image src={image.url} alt={image.alt} fill preload sizes="(min-width: 1360px) 760px, 100vw" className="object-cover" />
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
      ) : null}
    </section>
  )
}
