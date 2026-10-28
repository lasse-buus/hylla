'use client'

import { X } from 'lucide-react'

import { formatKroner } from '@/lib/format'
import { clearFilters, type FilterState, hasActiveFilters, toggleIn } from '@/lib/productFilters'

import { useFilters } from './FilterContext'

type Chip = { label: string; next: FilterState }

const priceLabel = (min: number | null, max: number | null) => {
  if (min !== null && max !== null) return `${formatKroner(min)} – ${formatKroner(max)}`
  if (min !== null) return `Fra ${formatKroner(min)}`
  return `Opptil ${formatKroner(max ?? 0)}`
}

function chipsFor(state: FilterState, labels: Record<string, string>): Chip[] {
  const reset = { ...state, page: 1 }
  const chips: Chip[] = [
    ...state.categories.map((slug) => ({ label: labels[slug] ?? slug, next: toggleIn(state, 'categories', slug) })),
    ...state.brands.map((slug) => ({ label: labels[slug] ?? slug, next: toggleIn(state, 'brands', slug) })),
  ]

  if (state.minPrice !== null || state.maxPrice !== null) {
    chips.push({ label: priceLabel(state.minPrice, state.maxPrice), next: { ...reset, minPrice: null, maxPrice: null } })
  }
  if (state.inStock) chips.push({ label: 'Kun varer på lager', next: { ...reset, inStock: false } })
  if (state.onSale) chips.push({ label: 'Kun tilbud', next: { ...reset, onSale: false } })
  if (state.minRating !== null) {
    chips.push({ label: `${state.minRating} stjerner og over`, next: { ...reset, minRating: null } })
  }

  return chips
}

/** Removable chips for the active filters. `labels` maps category and brand slugs to names. */
export function ActiveFilters({ labels }: { labels: Record<string, string> }) {
  const { state, apply } = useFilters()
  if (!hasActiveFilters(state)) return null

  return (
    <ul aria-label="Aktive filtre" className="mt-3.5 flex flex-wrap items-center gap-2">
      {chipsFor(state, labels).map((chip) => (
        <li key={chip.label}>
          <button
            type="button"
            onClick={() => apply(chip.next)}
            aria-label={`Fjern filter ${chip.label}`}
            className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-2 text-xs font-semibold text-brand hover:bg-brand hover:text-white"
          >
            {chip.label}
            <X className="size-[13px]" strokeWidth={2.2} aria-hidden="true" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => apply(clearFilters(state))}
          className="px-1 py-2 text-xs font-semibold underline hover:text-brand"
        >
          Fjern alle
        </button>
      </li>
    </ul>
  )
}
