import type { CategoryGridBlock as CategoryGridBlockData } from '@/payload-types'

import { Tag } from 'lucide-react'
import Link from 'next/link'

import { categoryIcons } from '@/components/site/icons'
import { getCategoryLinks } from '@/lib/catalog'

export async function CategoryGridBlock({ block, headingID }: { block: CategoryGridBlockData; headingID: string }) {
  const categories = await getCategoryLinks(block.categories)
  if (!categories.length) return null

  return (
    <section aria-labelledby={headingID}>
      <h2 id={headingID} className="mb-5 text-[22px] font-bold tracking-[-0.3px]">
        {block.title}
      </h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {categories.map((category) => {
          const Icon = (category.icon && categoryIcons[category.icon]) || Tag

          return (
            <li key={category.slug}>
              <Link
                href={category.href}
                className="flex h-[116px] flex-col items-center justify-center gap-3.5 rounded-xl bg-white px-2 text-center hover:ring-2 hover:ring-brand-soft"
              >
                <Icon className="size-7 text-brand" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-xs font-semibold">{category.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
