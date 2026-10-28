import type { CategoryLink } from '@/lib/catalog'

import { Tag } from 'lucide-react'
import Link from 'next/link'

import { categoryIcons } from '@/components/site/icons'

const productCountLabel = (count: number) => `${count} ${count === 1 ? 'produkt' : 'produkter'}`

export function SubcategoryTiles({ title, categories }: { title: string; categories: CategoryLink[] }) {
  return (
    <section aria-labelledby="underkategorier">
      <h2 id="underkategorier" className="mb-4 text-[22px] font-bold tracking-[-0.3px]">
        {title}
      </h2>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3">
        {categories.map((category) => {
          const Icon = (category.icon && categoryIcons[category.icon]) || Tag

          return (
            <li key={category.slug}>
              <Link
                href={category.href}
                className="flex h-[116px] flex-col items-center justify-center gap-2 rounded-xl bg-white px-3 text-center outline-offset-[-2px] hover:ring-2 hover:ring-brand-soft"
              >
                <Icon className="size-8 text-brand" strokeWidth={1.5} aria-hidden="true" />
                <span className="text-[13px] font-semibold">{category.title}</span>
                <span className="text-[11px] text-muted">{productCountLabel(category.productCount)}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
