'use client'

import { ArrowRight, Minus, Plus, RotateCcw, Trash2, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { type CartLine, cartTotals, MAX_PER_LINE } from '@/lib/cart'
import { formatKroner, formatPrice } from '@/lib/format'
import { routes } from '@/lib/routes'

import { CheckoutSteps } from './CheckoutSteps'
import { EmptyCart } from './EmptyCart'
import { useCartLines } from './useCartLines'

const itemLabel = (count: number) => `${count} ${count === 1 ? 'vare' : 'varer'}`

export function CartView({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const { lines, isRestoring, isLoading, incrementItem, decrementItem, removeItem } = useCartLines()
  const { count, total, savings, vat } = cartTotals(lines)
  const hasFreeShipping = total >= freeShippingThreshold

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <h1 className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">
          Handlekurv{' '}
          {lines.length ? <span className="text-lg font-medium tracking-normal text-muted">{itemLabel(count)}</span> : null}
        </h1>
        <CheckoutSteps current="Handlekurv" />
      </div>

      {isRestoring ? (
        <div aria-busy="true" className="mt-6 h-64 animate-pulse rounded-2xl bg-white" />
      ) : !lines.length ? (
        <EmptyCart />
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="flex min-w-0 flex-col gap-4">
            <FreeShippingProgress total={total} threshold={freeShippingThreshold} />

            <ul aria-label="Varer i handlekurven" aria-busy={isLoading} className="rounded-xl bg-white px-5 sm:px-6">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  disabled={isLoading}
                  onIncrement={() => incrementItem(line.id)}
                  onDecrement={() => decrementItem(line.id)}
                  onRemove={() => removeItem(line.id)}
                />
              ))}
            </ul>
          </div>

          <aside aria-labelledby="sammendrag" className="flex flex-col gap-3 lg:sticky lg:top-6">
            <section className="rounded-xl bg-white p-6">
              <h2 id="sammendrag" className="mb-[18px] text-lg font-bold">
                Ordresammendrag
              </h2>
              <dl className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-subtle">Varer ({count})</dt>
                  <dd className="font-medium">{formatPrice(total + savings)}</dd>
                </div>
                {savings > 0 ? (
                  <div className="flex justify-between gap-3 font-semibold text-success">
                    <dt>Du sparer</dt>
                    <dd>− {formatPrice(savings)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between gap-3">
                  <dt className="text-subtle">Frakt</dt>
                  <dd className={hasFreeShipping ? 'font-semibold text-success' : 'text-subtle'}>
                    {hasFreeShipping ? 'Gratis' : 'Beregnes i kassen'}
                  </dd>
                </div>
              </dl>
              <div className="my-[18px] h-px bg-line" />
              <p className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-semibold">Totalt</span>
                <span className="text-[30px] font-bold tracking-[-0.6px]">{formatPrice(total)}</span>
              </p>
              <p className="mt-1 text-right text-xs text-muted">Inkl. mva. {formatPrice(vat)}</p>

              <Link
                href={routes.checkout}
                className="mt-5 flex h-[52px] items-center justify-center gap-2.5 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-brand-hover"
              >
                Gå til kassen
                <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
              </Link>
              <p className="mt-3 text-center text-xs text-muted">
                Hylla er en demobutikk. Ingen ekte betaling blir gjennomført.
              </p>
            </section>
            <ul className="flex flex-col gap-3 rounded-xl bg-white px-6 py-5 text-[13px]">
              <li className="flex items-center gap-3">
                <RotateCcw className="size-[18px] shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
                30 dagers åpent kjøp
              </li>
              <li className="flex items-center gap-3">
                <Truck className="size-[18px] shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
                Fri frakt over {formatKroner(freeShippingThreshold)}
              </li>
            </ul>
          </aside>
        </div>
      )}
    </>
  )
}

function FreeShippingProgress({ total, threshold }: { total: number; threshold: number }) {
  const remaining = threshold - total
  const progress = Math.min(100, (total / threshold) * 100)

  return (
    <div className="flex flex-col gap-2.5 rounded-xl bg-white px-6 py-[18px]">
      <p className={`flex items-center gap-2.5 text-sm font-semibold ${remaining <= 0 ? 'text-success' : ''}`}>
        <Truck className="size-5 shrink-0" strokeWidth={1.7} aria-hidden="true" />
        {remaining <= 0
          ? 'Du har fri frakt. Bestill innen kl. 16, så sender vi i dag.'
          : `Handle for ${formatKroner(remaining)} til, så får du fri frakt.`}
      </p>
      <div aria-hidden="true" className="h-1.5 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${remaining <= 0 ? 'bg-success' : 'bg-brand'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

type CartLineItemProps = {
  line: CartLine
  disabled: boolean
  onIncrement: () => void
  onDecrement: () => void
  onRemove: () => void
}

function CartLineItem({ line, disabled, onIncrement, onDecrement, onRemove }: CartLineItemProps) {
  const maxQuantity = Math.min(MAX_PER_LINE, line.inventory)
  const hasSaving = line.compareAtPrice !== null && line.compareAtPrice > line.price

  return (
    <li className="flex flex-wrap gap-5 border-b border-line py-6 last:border-b-0">
      <div className="relative size-24 shrink-0 overflow-hidden rounded-lg bg-surface sm:size-[120px]">
        {line.image ? <Image src={line.image.url} alt="" fill sizes="120px" className="object-cover" /> : null}
      </div>
      <div className="flex min-w-0 flex-[1_1_220px] flex-col gap-1">
        {line.brandName ? (
          <span className="text-[11px] font-semibold tracking-[0.5px] text-muted uppercase">{line.brandName}</span>
        ) : null}
        <Link href={line.href} className="text-[17px] leading-[1.35] font-semibold hover:underline">
          {line.title}
        </Link>
        {line.details ? <span className="text-[13px] text-muted">{line.details}</span> : null}
        <span className="mt-1.5 inline-flex items-center gap-[7px] text-xs text-subtle">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
          På lager · Sendes i dag
        </span>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`Fjern ${line.title}`}
          className="mt-2.5 inline-flex items-center gap-1.5 self-start text-[13px] text-subtle hover:text-ink hover:underline disabled:opacity-50"
        >
          <Trash2 className="size-4" strokeWidth={1.7} aria-hidden="true" />
          Fjern
        </button>
      </div>
      <div className="flex min-w-[150px] flex-auto flex-row-reverse items-end justify-between gap-4 sm:flex-none sm:flex-col">
        <div className="text-right">
          <p className="text-[22px] font-bold tracking-[-0.4px]">{formatPrice(line.price * line.quantity)}</p>
          {hasSaving ? (
            <p className="mt-0.5 text-xs text-muted">
              Førpris <s>{formatPrice(line.compareAtPrice! * line.quantity)}</s>
            </p>
          ) : null}
        </div>
        <div role="group" aria-label={`Antall ${line.title}`} className="flex h-10 items-center rounded-md border border-line">
          <button
            type="button"
            onClick={onDecrement}
            disabled={disabled || line.quantity <= 1}
            aria-label="Færre"
            className="flex h-full w-10 items-center justify-center disabled:text-steel"
          >
            <Minus className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <output aria-live="polite" className="min-w-6 text-center text-sm font-semibold">
            {line.quantity}
          </output>
          <button
            type="button"
            onClick={onIncrement}
            disabled={disabled || line.quantity >= maxQuantity}
            aria-label="Flere"
            className="flex h-full w-10 items-center justify-center disabled:text-steel"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
      </div>
    </li>
  )
}
