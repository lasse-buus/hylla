'use client'

import type { NavDepartment } from '@/lib/navigation'

import { ArrowRight, ArrowUpRight, ChevronRight, Lightbulb, Menu, X, Zap } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useId, useRef, useState } from 'react'

import { formatPrice } from '@/lib/format'
import { routes } from '@/lib/routes'

const HOVER_OPEN_DELAY = 120
const HOVER_CLOSE_DELAY = 180

/**
 * The department row under the header and its mega menu.
 * Hovering a department opens its panel; "Alle kategorier" toggles it for touch and keyboard users.
 */
export function DepartmentNav({ departments }: { departments: NavDepartment[] }) {
  const pathname = usePathname()
  const panelID = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [openSlug, setOpenSlug] = useState<string | null>(null)

  const clearTimer = () => {
    if (timer.current) clearTimeout(timer.current)
    timer.current = null
  }

  const close = useCallback(() => {
    clearTimer()
    setOpenSlug(null)
  }, [])

  const openSoon = (slug: string) => {
    clearTimer()
    timer.current = setTimeout(() => setOpenSlug(slug), openSlug ? 0 : HOVER_OPEN_DELAY)
  }

  const closeSoon = () => {
    clearTimer()
    timer.current = setTimeout(() => setOpenSlug(null), HOVER_CLOSE_DELAY)
  }

  useEffect(() => {
    if (!openSlug) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      close()
      toggleRef.current?.focus()
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [openSlug, close])

  useEffect(() => clearTimer, [])

  const isOpen = openSlug !== null
  const current = departments.find((department) => department.slug === openSlug) ?? departments[0]
  const activeSlug = departments.find((department) => pathname?.startsWith(department.href))?.slug

  return (
    <div onMouseEnter={clearTimer} onMouseLeave={isOpen ? closeSoon : clearTimer}>
      <div className="border-y border-line">
        <nav
          aria-label="Avdelinger"
          className="shop-container flex h-[52px] items-center justify-between gap-8 overflow-x-auto text-sm font-semibold whitespace-nowrap"
        >
          <button
            ref={toggleRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls={panelID}
            onClick={() => (isOpen ? close() : setOpenSlug(activeSlug ?? departments[0]?.slug ?? null))}
            className="inline-flex h-full items-center gap-2.5 font-bold hover:text-brand"
          >
            {isOpen ? (
              <X className="size-[19px]" strokeWidth={1.7} aria-hidden="true" />
            ) : (
              <Menu className="size-[19px]" strokeWidth={1.7} aria-hidden="true" />
            )}
            Alle kategorier
          </button>

          {departments.map((department) => {
            const isHighlighted = isOpen ? department.slug === openSlug : department.slug === activeSlug

            return (
              <Link
                key={department.slug}
                href={department.href}
                aria-current={department.slug === activeSlug ? 'page' : undefined}
                onMouseEnter={() => openSoon(department.slug)}
                onMouseLeave={() => !isOpen && clearTimer()}
                onClick={close}
                className={`inline-flex h-full items-center border-b-2 pt-0.5 ${
                  isHighlighted ? 'border-brand text-brand' : 'border-transparent font-medium hover:text-brand'
                }`}
              >
                {department.title}
              </Link>
            )
          })}

          <Link
            href={routes.deals}
            onMouseEnter={closeSoon}
            className="inline-flex items-center gap-[7px] text-brand hover:underline"
          >
            <Zap className="size-4" strokeWidth={1.7} aria-hidden="true" />
            Ukens kupp
          </Link>
        </nav>
      </div>

      {isOpen && current ? (
        <>
          <div aria-hidden="true" onClick={close} className="absolute inset-x-0 top-full z-30 h-screen bg-navy/40" />
          <div
            id={panelID}
            className="absolute inset-x-0 top-full z-40 border-b border-line bg-white shadow-[0_24px_48px_-24px_rgba(14,23,40,0.35)]"
          >
            <MegaMenuPanel
              current={current}
              departments={departments}
              onSelect={setOpenSlug}
              onNavigate={close}
            />
          </div>
        </>
      ) : null}
    </div>
  )
}

type MegaMenuPanelProps = {
  current: NavDepartment
  departments: NavDepartment[]
  onSelect: (slug: string) => void
  onNavigate: () => void
}

function MegaMenuPanel({ current, departments, onSelect, onNavigate }: MegaMenuPanelProps) {
  return (
    <div className="shop-container flex max-h-[calc(100vh-180px)] flex-wrap overflow-y-auto">
      <nav aria-label="Alle avdelinger" className="w-full border-line pt-4 md:w-[248px] md:border-r md:py-5 md:pr-5">
        <ul className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 md:mx-0 md:flex-col md:gap-0.5 md:overflow-visible md:px-0 md:pb-0">
          {departments.map((department) => {
            const isSelected = department.slug === current.slug

            return (
              <li key={department.slug}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onMouseEnter={() => onSelect(department.slug)}
                  onFocus={() => onSelect(department.slug)}
                  onClick={() => onSelect(department.slug)}
                  className={`flex shrink-0 items-center justify-between gap-3 rounded-full border px-3.5 py-2 text-left text-sm whitespace-nowrap md:w-full md:rounded-md md:border-0 md:py-[11px] ${
                    isSelected
                      ? 'border-brand-soft bg-brand-soft font-semibold text-brand'
                      : 'border-line font-medium hover:bg-surface'
                  }`}
                >
                  {department.title}
                  <ChevronRight
                    className={`hidden size-4 md:block ${isSelected ? '' : 'text-steel'}`}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mx-3.5 mt-4 hidden flex-col gap-3 border-t border-line pt-4 text-[13px] font-semibold md:flex">
          <Link href={routes.deals} onClick={onNavigate} className="text-brand hover:underline">
            Ukens kupp
          </Link>
          <Link href={routes.guides} onClick={onNavigate} className="hover:underline">
            Guider og tips
          </Link>
          <Link href="/bedrift" onClick={onNavigate} className="hover:underline">
            Hylla for bedrifter
          </Link>
        </div>
      </nav>

      <div className="min-w-0 flex-[1_1_520px] pt-5 pb-7 md:px-8 md:pt-7">
        <div className="mb-[22px] flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h2 className="text-[22px] font-bold tracking-[-0.3px]">{current.title}</h2>
          <Link
            href={current.href}
            onClick={onNavigate}
            className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand hover:underline"
          >
            Se alt i {current.title}
            <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(170px,1fr))] gap-x-8 gap-y-7">
          {current.groups.map((group) => (
            <section key={group.title}>
              <h3 className="mb-3 text-[11px] font-bold tracking-[0.6px] text-muted uppercase">{group.title}</h3>
              <ul className="flex flex-col gap-[11px] text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} onClick={onNavigate} className="hover:text-brand hover:underline">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {current.promo || current.guide ? (
        <aside aria-label="Kampanje" className="hidden w-[300px] flex-col gap-3 py-6 pl-2 lg:flex">
          {current.promo ? (
            <Link
              href={current.promo.href}
              onClick={onNavigate}
              className="group flex min-h-[300px] flex-1 flex-col overflow-hidden rounded-xl bg-ink text-white"
            >
              <span className="relative block h-[170px] bg-navy-raised">
                {current.promo.image ? (
                  <Image
                    src={current.promo.image.url}
                    alt={current.promo.image.alt}
                    fill
                    loading="eager"
                    sizes="300px"
                    className="object-cover"
                  />
                ) : null}
              </span>
              <span className="flex flex-col gap-1.5 px-5 pt-[18px] pb-5">
                {current.promo.eyebrow ? (
                  <span className="text-[11px] font-bold tracking-[0.6px] text-brand-light">
                    {current.promo.eyebrow}
                  </span>
                ) : null}
                <span className="text-base leading-snug font-semibold group-hover:underline">{current.promo.title}</span>
                <span className="mt-1.5 flex items-center justify-between gap-3">
                  <span className="text-2xl font-bold tracking-[-0.4px]">
                    {current.promo.price !== null ? formatPrice(current.promo.price) : ''}
                  </span>
                  <span
                    aria-hidden="true"
                    className="flex size-9 items-center justify-center rounded-full bg-white text-brand"
                  >
                    <ArrowUpRight className="size-[18px]" strokeWidth={1.8} />
                  </span>
                </span>
              </span>
            </Link>
          ) : null}
          {current.guide ? (
            <Link
              href={current.guide.href}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl bg-brand-soft px-4 py-3.5 hover:underline"
            >
              <Lightbulb className="size-5 shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
              <span className="flex flex-col gap-0.5">
                <span className="text-[11px] font-bold tracking-[0.5px] text-brand">GUIDE</span>
                <span className="text-[13px] font-semibold">{current.guide.title}</span>
              </span>
            </Link>
          ) : null}
        </aside>
      ) : null}
    </div>
  )
}
