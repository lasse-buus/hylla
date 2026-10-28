'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useOptimistic, useTransition } from 'react'

import { type FilterState, filtersToQuery, type SortKey, sortOptions } from '@/lib/productFilters'

type FilterContextValue = {
  state: FilterState
  isPending: boolean
  hrefFor: (next: FilterState) => string
  apply: (next: FilterState) => void
}

const FilterContext = createContext<FilterContextValue | null>(null)

export const useFilters = () => {
  const context = useContext(FilterContext)
  if (!context) throw new Error('useFilters must be used inside <FilterProvider>')
  return context
}

/**
 * The URL is the source of truth: applying a filter navigates to the new query string and the
 * server re-renders the results. The state is updated optimistically so controls respond at once.
 */
export function FilterProvider({ initialState, children }: { initialState: FilterState; children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const [state, setOptimisticState] = useOptimistic(initialState)

  const hrefFor = (next: FilterState) => `${pathname}${filtersToQuery(next)}`

  const apply = (next: FilterState) => {
    startTransition(() => {
      setOptimisticState(next)
      router.push(hrefFor(next), { scroll: false })
    })
  }

  return <FilterContext value={{ state, isPending, hrefFor, apply }}>{children}</FilterContext>
}

/** Dims the results while a filter change is loading. */
export function FilterResults({ children }: { children: React.ReactNode }) {
  const { isPending } = useFilters()

  return (
    <div aria-busy={isPending} className={`transition-opacity ${isPending ? 'opacity-60' : ''}`}>
      {children}
    </div>
  )
}

export function SortSelect() {
  const { state, apply } = useFilters()

  return (
    <label className="flex items-center gap-2.5 text-[13px] text-muted">
      Sorter etter
      <select
        value={state.sort}
        onChange={(event) => apply({ ...state, sort: event.target.value as SortKey, page: 1 })}
        className="h-10 rounded-md border border-line bg-white px-3 text-[13px] font-semibold text-ink"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function LoadMoreLink() {
  const { state, apply, hrefFor } = useFilters()
  const next = { ...state, page: state.page + 1 }

  return (
    <a
      href={hrefFor(next)}
      onClick={(event) => {
        event.preventDefault()
        apply(next)
      }}
      className="inline-flex h-12 items-center rounded-md border-[1.5px] border-ink bg-white px-7 text-sm font-semibold hover:bg-surface"
    >
      Vis flere produkter
    </a>
  )
}
