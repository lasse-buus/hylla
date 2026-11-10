'use client'

import { type ListFacet, toggleIn } from '@/lib/productFilters'

import { useFilters } from './FilterContext'
import type { FilterOption } from './FilterPanel'

/** A list filter as a row of pill links, e.g. the bulb types above the lighting grid. */
export function FacetChips({ label, facet, options }: { label: string; facet: ListFacet; options: FilterOption[] }) {
  const { state, apply, hrefFor } = useFilters()

  return (
    <nav aria-label={label}>
      <ul className="flex flex-wrap gap-2.5">
        {options.map((option) => {
          const active = state[facet].includes(option.value)
          const next = toggleIn(state, facet, option.value)

          return (
            <li key={option.value}>
              <a
                href={hrefFor(next)}
                aria-current={active ? 'true' : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  apply(next)
                }}
                className={`inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-semibold ${
                  active ? 'border-ink bg-ink text-card' : 'border-line bg-card hover:border-ink'
                }`}
              >
                {option.label}
                <span className={`font-medium ${active ? '' : 'text-muted'}`}>{option.count}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
