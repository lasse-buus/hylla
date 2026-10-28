'use client'

import { ChevronDown, SlidersHorizontal } from 'lucide-react'
import { useId, useState } from 'react'

import { StarRating } from '@/components/shop/StarRating'
import { clearFilters, type FilterState, hasActiveFilters, ratingOptions, toggleIn } from '@/lib/productFilters'

import { useFilters } from './FilterContext'

export type FilterOption = { value: string; label: string; count: number }

type FilterPanelProps = {
  categoryOptions: FilterOption[]
  brandOptions: FilterOption[]
  showOnSaleFilter: boolean
}

const fieldsetClass = 'border-t border-line px-5 py-[18px]'
const legendClass = 'float-left mb-3.5 w-full text-sm font-semibold'

/** The filter sidebar. Collapsed behind a toggle on small screens. */
export function FilterPanel({ categoryOptions, brandOptions, showOnSaleFilter }: FilterPanelProps) {
  const { state, apply } = useFilters()
  const [isOpen, setIsOpen] = useState(false)
  const panelID = useId()

  return (
    <aside aria-label="Filtre" className="rounded-xl bg-white">
      <div className="flex items-center justify-between p-5">
        {/* A plain heading on desktop, where the panel is always open; a toggle on small screens. */}
        <h2 className="hidden items-center gap-2.5 text-base font-bold lg:flex">
          <SlidersHorizontal className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
          Filtrer
        </h2>
        <h2 className="text-base font-bold lg:hidden">
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelID}
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center gap-2.5"
          >
            <SlidersHorizontal className="size-[18px]" strokeWidth={1.7} aria-hidden="true" />
            Filtrer
            <ChevronDown
              className={`size-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </button>
        </h2>
        {hasActiveFilters(state) ? (
          <button
            type="button"
            onClick={() => apply(clearFilters(state))}
            className="p-1 text-[13px] font-semibold text-brand hover:underline"
          >
            Nullstill
          </button>
        ) : null}
      </div>

      <div id={panelID} className={isOpen ? 'block' : 'hidden lg:block'}>
        {categoryOptions.length > 0 ? (
          <CheckboxGroup
            legend="Kategori"
            options={categoryOptions}
            selected={state.categories}
            onToggle={(value) => apply(toggleIn(state, 'categories', value))}
          />
        ) : null}

        <PriceFields key={`${state.minPrice}-${state.maxPrice}`} state={state} onApply={apply} />

        {brandOptions.length > 0 ? (
          <CheckboxGroup
            legend="Merke"
            options={brandOptions}
            selected={state.brands}
            onToggle={(value) => apply(toggleIn(state, 'brands', value))}
          />
        ) : null}

        <fieldset className={fieldsetClass}>
          <legend className={legendClass}>Tilgjengelighet</legend>
          <div className="clear-both flex flex-col gap-3.5">
            <Switch
              label="Kun varer på lager"
              checked={state.inStock}
              onChange={(inStock) => apply({ ...state, inStock, page: 1 })}
            />
            {showOnSaleFilter ? (
              <Switch
                label="Kun tilbud"
                checked={state.onSale}
                onChange={(onSale) => apply({ ...state, onSale, page: 1 })}
              />
            ) : null}
          </div>
        </fieldset>

        <fieldset className={`${fieldsetClass} pb-[22px]`}>
          <legend className={legendClass}>Kundevurdering</legend>
          <div className="clear-both flex flex-col gap-3">
            {[...ratingOptions, null].map((rating) => (
              <label key={rating ?? 'alle'} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="radio"
                  name="vurdering"
                  checked={state.minRating === rating}
                  onChange={() => apply({ ...state, minRating: rating, page: 1 })}
                  className="size-[18px] accent-brand"
                />
                {rating ? (
                  <>
                    <StarRating rating={rating} />
                    {rating} og over
                  </>
                ) : (
                  'Alle vurderinger'
                )}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
    </aside>
  )
}

type CheckboxGroupProps = {
  legend: string
  options: FilterOption[]
  selected: string[]
  onToggle: (value: string) => void
}

function CheckboxGroup({ legend, options, selected, onToggle }: CheckboxGroupProps) {
  return (
    <fieldset className={fieldsetClass}>
      <legend className={legendClass}>{legend}</legend>
      <div className="clear-both flex flex-col gap-3">
        {options.map((option) => {
          const checked = selected.includes(option.value)
          const disabled = !checked && option.count === 0

          return (
            <label
              key={option.value}
              className={`flex items-center gap-2.5 text-sm ${disabled ? 'text-muted' : 'cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(option.value)}
                className="size-[18px] accent-brand"
              />
              <span className="flex-1">{option.label}</span>
              <span className="text-xs text-muted">{option.count}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

const parseKroner = (value: string) => {
  const digits = value.replace(/\D/g, '')
  return digits ? Number(digits) : null
}

/** Applied on Enter or when the field loses focus, not on every keystroke. */
function PriceFields({ state, onApply }: { state: FilterState; onApply: (next: FilterState) => void }) {
  const [min, setMin] = useState(state.minPrice?.toString() ?? '')
  const [max, setMax] = useState(state.maxPrice?.toString() ?? '')

  const commit = () => {
    const minPrice = parseKroner(min)
    const maxPrice = parseKroner(max)
    if (minPrice === state.minPrice && maxPrice === state.maxPrice) return
    onApply({ ...state, minPrice, maxPrice, page: 1 })
  }

  const inputClass =
    'h-10 w-full rounded-md border border-line px-2.5 text-[13px] text-ink placeholder:text-muted focus:border-brand'

  return (
    <fieldset className={fieldsetClass}>
      <legend className={legendClass}>Pris</legend>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          commit()
        }}
        className="clear-both flex items-end gap-2.5"
      >
        <label className="flex flex-1 flex-col gap-1 text-[11px] text-muted">
          Fra (kr)
          <input
            inputMode="numeric"
            value={min}
            onChange={(event) => setMin(event.target.value)}
            onBlur={commit}
            placeholder="0"
            className={inputClass}
          />
        </label>
        <span aria-hidden="true" className="pb-2.5 text-muted">
          –
        </span>
        <label className="flex flex-1 flex-col gap-1 text-[11px] text-muted">
          Til (kr)
          <input
            inputMode="numeric"
            value={max}
            onChange={(event) => setMax(event.target.value)}
            onBlur={commit}
            placeholder="Ingen grense"
            className={inputClass}
          />
        </label>
        {/* Lets Enter submit the form; the fields also apply on blur. */}
        <button type="submit" className="sr-only">
          Bruk pris
        </button>
      </form>
    </fieldset>
  )
}

function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 text-sm">
      {label}
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden="true"
        className="relative h-[22px] w-[38px] shrink-0 rounded-full bg-steel transition-colors peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand after:absolute after:top-[3px] after:left-[3px] after:size-4 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-4"
      />
    </label>
  )
}
