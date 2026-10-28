'use client'

import type { SearchSuggestions } from '@/app/(frontend)/(shop)/sok/forslag/route'

import { ArrowRight, BookOpen, LoaderCircle, Search } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState } from 'react'

import { formatPrice } from '@/lib/format'
import { routes } from '@/lib/routes'

const MIN_LENGTH = 2
const DEBOUNCE_MS = 180

const searchHref = (query: string) => `${routes.search}?q=${encodeURIComponent(query)}`

type Option = { id: string; href: string }

/**
 * The header search. While typing it suggests products and guides (a combobox: arrow keys move through
 * the suggestions, Enter opens one, Escape closes the list). Pressing Enter without a suggestion
 * selected opens the full results page. ⌘K / Ctrl+K focuses the field.
 */
export function SearchForm() {
  const router = useRouter()
  const baseID = useId()
  const listboxID = `${baseID}-forslag`
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchSuggestions | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Fetch suggestions shortly after typing stops; a newer query cancels the older request.
  const trimmed = query.trim()
  useEffect(() => {
    if (trimmed.length < MIN_LENGTH) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${routes.search}/forslag?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal })
        if (response.ok) {
          setResults((await response.json()) as SearchSuggestions)
          setActiveIndex(-1)
        }
      } catch {
        // Aborted by a newer query, or offline: keep showing what we had.
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [trimmed])

  const current = trimmed.length >= MIN_LENGTH ? results : null
  const options: Option[] = current
    ? [
        ...current.products.map((product) => ({ id: `${baseID}-p${product.id}`, href: product.href })),
        ...current.guides.map((guide) => ({ id: `${baseID}-g${guide.id}`, href: guide.href })),
        { id: `${baseID}-alle`, href: searchHref(trimmed) },
      ]
    : []
  const showPanel = isOpen && trimmed.length >= MIN_LENGTH && (current !== null || isLoading)
  const total = current ? current.productTotal + current.guideTotal : 0

  const go = (href: string) => {
    setIsOpen(false)
    setActiveIndex(-1)
    ;(document.activeElement as HTMLElement | null)?.blur()
    router.push(href)
  }

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!options.length) return
      event.preventDefault()
      setIsOpen(true)
      // Wraps around: down from the last suggestion goes to the first, up from the first to the last.
      setActiveIndex((index) =>
        event.key === 'ArrowDown' ? (index + 1) % options.length : index <= 0 ? options.length - 1 : index - 1,
      )
    } else if (event.key === 'Enter' && showPanel && options[activeIndex]) {
      event.preventDefault()
      go(options[activeIndex].href)
    } else if (event.key === 'Escape') {
      if (isOpen) setIsOpen(false)
      else setQuery('')
    }
  }

  const optionProps = (option: Option | undefined) => {
    const index = option ? options.indexOf(option) : -1
    return {
      id: option?.id,
      role: 'option' as const,
      'aria-selected': index === activeIndex,
      // Keep focus in the field, so the list doesn't close before the click lands.
      onMouseDown: (event: React.MouseEvent) => event.preventDefault(),
      onMouseEnter: () => setActiveIndex(index),
      onClick: () => option && go(option.href),
      className: `flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 ${index === activeIndex ? 'bg-surface' : ''}`,
    }
  }

  let optionIndex = 0
  const nextOption = () => options[optionIndex++]

  return (
    <form
      action={routes.search}
      role="search"
      onSubmit={(event) => {
        // An empty search has nowhere useful to go.
        if (!trimmed) event.preventDefault()
        setIsOpen(false)
      }}
      className="relative flex h-[46px] w-full min-w-0 items-center gap-3 rounded-md border border-line bg-surface pr-3 pl-4 focus-within:border-brand"
    >
      <Search className="size-5 shrink-0 text-muted" strokeWidth={1.7} aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        name="q"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
          setActiveIndex(-1)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onKeyDown={onKeyDown}
        role="combobox"
        aria-label="Søk i Hylla"
        aria-autocomplete="list"
        aria-expanded={showPanel}
        aria-controls={listboxID}
        aria-activedescendant={showPanel && options[activeIndex] ? options[activeIndex].id : undefined}
        autoComplete="off"
        maxLength={80}
        placeholder="Hva leter du etter? Søk blant 12 000 produkter"
        className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {isLoading ? (
        <LoaderCircle className="size-4 shrink-0 animate-spin text-muted motion-reduce:animate-none" strokeWidth={2} aria-hidden="true" />
      ) : (
        <kbd className="hidden rounded border border-line bg-white px-1.5 py-0.5 font-sans text-[11px] text-muted sm:inline">⌘ K</kbd>
      )}

      <p className="sr-only" aria-live="polite">
        {showPanel && current ? (total ? `${total} treff. Bruk piltastene for å velge.` : 'Ingen treff.') : ''}
      </p>

      <div
        id={listboxID}
        role="listbox"
        aria-label="Søkeforslag"
        hidden={!showPanel}
        className="absolute top-[calc(100%+8px)] right-0 left-0 z-40 max-h-[min(70vh,560px)] overflow-y-auto rounded-xl border border-line bg-white p-2 shadow-[0_12px_32px_rgba(14,23,40,0.14)]"
      >
        {current === null ? (
          <p className="px-3 py-4 text-sm text-muted">Søker …</p>
        ) : (
          <>
            {current.products.length ? (
              <div role="group" aria-labelledby={`${baseID}-produkter`}>
                <p id={`${baseID}-produkter`} className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-[0.6px] text-muted uppercase">
                  Produkter
                </p>
                {current.products.map((product) => (
                  <div key={product.id} {...optionProps(nextOption())}>
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface">
                      {product.image ? <Image src={product.image} alt="" fill sizes="48px" className="object-cover" /> : null}
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      {product.brandName ? (
                        <span className="text-[10px] font-semibold tracking-[0.5px] text-muted uppercase">{product.brandName}</span>
                      ) : null}
                      <span className="truncate text-sm font-medium">{product.title}</span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end">
                      <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                      {product.compareAtPrice && product.compareAtPrice > product.price ? (
                        <s className="text-[11px] text-muted">{formatPrice(product.compareAtPrice)}</s>
                      ) : null}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {current.guides.length ? (
              <div role="group" aria-labelledby={`${baseID}-guider`} className={current.products.length ? 'mt-1 border-t border-line pt-1' : ''}>
                <p id={`${baseID}-guider`} className="px-3 pt-2 pb-1 text-[11px] font-bold tracking-[0.6px] text-muted uppercase">
                  Guider og tips
                </p>
                {current.guides.map((guide) => (
                  <div key={guide.id} {...optionProps(nextOption())}>
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-md bg-brand-soft text-brand">
                      <BookOpen className="size-5" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col">
                      {guide.kicker ? (
                        <span className="text-[10px] font-semibold tracking-[0.5px] text-brand uppercase">{guide.kicker}</span>
                      ) : null}
                      <span className="truncate text-sm font-medium">{guide.title}</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : null}

            {total === 0 ? <p className="px-3 py-3 text-sm text-muted">Ingen treff på «{trimmed}».</p> : null}

            <div className={total ? 'mt-1 border-t border-line pt-1' : ''}>
              <div {...optionProps(nextOption())}>
                <span className="flex-1 text-sm font-semibold text-brand">
                  {total ? `Se alle ${total} treff for «${trimmed}»` : `Søk etter «${trimmed}»`}
                </span>
                <ArrowRight className="size-4 text-brand" strokeWidth={1.8} aria-hidden="true" />
              </div>
            </div>
          </>
        )}
      </div>
    </form>
  )
}
