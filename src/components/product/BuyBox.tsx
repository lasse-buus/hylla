'use client'

import type { ProductSummary } from '@/lib/catalog'

import { CircleCheck, Minus, Plus, RotateCcw, ShieldCheck, ShoppingCart, Store, Truck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import { useAddToCart } from '@/components/cart/useAddToCart'
import { formatKroner, formatPrice, formatStock } from '@/lib/format'
import { routes } from '@/lib/routes'
import { findVariant, type VariantData, type VariantGroup } from '@/lib/variants'

const MAX_QUANTITY = 9
const INSTALMENT_MONTHS = 24

type BuyBoxProps = {
  productID: number
  variantGroups: VariantGroup[]
  /** A product without variants is passed as a single variant with no options. */
  variants: VariantData[]
  initialVariantID: number
  addOns: ProductSummary[]
  freeShippingThreshold: number
  storePickup: string | null
}

const priceDifference = (difference: number) => {
  if (difference === 0) return 'Inkludert'
  return `${difference > 0 ? '+' : '−'} ${formatPrice(Math.abs(difference))}`
}

export function BuyBox({ productID, variantGroups, variants, initialVariantID, addOns, freeShippingThreshold, storePickup }: BuyBoxProps) {
  const [variant, setVariant] = useState(() => variants.find((entry) => entry.id === initialVariantID) ?? variants[0])
  const [quantity, setQuantity] = useState(1)
  const [chosenAddOns, setChosenAddOns] = useState<number[]>([])
  const addToCartItems = useAddToCart()
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle')

  const inStock = variant.inventory > 0
  const maxQuantity = Math.max(1, Math.min(MAX_QUANTITY, variant.inventory))
  const saving = variant.compareAtPrice ? variant.compareAtPrice - variant.price : 0
  const addOnTotal = addOns
    .filter((addOn) => chosenAddOns.includes(addOn.id))
    .reduce((sum, addOn) => sum + addOn.price, 0)
  const itemCount = quantity + chosenAddOns.length

  /** Keeps the choice in the URL so a configuration can be shared, without a server round trip. */
  const choose = (next: VariantData) => {
    setVariant(next)
    setQuantity((current) => Math.min(current, Math.max(1, Math.min(MAX_QUANTITY, next.inventory))))
    const params = new URLSearchParams(window.location.search)
    for (const [name, value] of Object.entries(next.options)) params.set(name, value)
    window.history.replaceState(null, '', `?${params}`)
  }

  /** Adds the chosen variant, then each ticked add-on. The server caps quantities at stock. */
  const addToCart = async () => {
    setStatus('adding')
    await addToCartItems([
      { product: productID, variant: variantGroups.length ? variant.id : undefined, quantity },
      ...chosenAddOns.map((addOnID) => ({ product: addOnID })),
    ])
    setChosenAddOns([])
    setStatus('added')
  }

  const toggleAddOn = (id: number) =>
    setChosenAddOns((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]))

  return (
    <div className="flex flex-col gap-[22px]">
      {variantGroups.length ? (
        <div className="flex flex-col gap-4">
          {variantGroups.map((group) => (
            <fieldset key={group.name}>
              <legend className="mb-2 text-[13px] font-semibold">{group.label}</legend>
              <div className="grid grid-cols-2 gap-2">
                {group.options.map((option) => {
                  const candidate = findVariant(variants, { ...variant.options, [group.name]: option.value })
                  const isSelected = variant.options[group.name] === option.value
                  const note = !candidate
                    ? 'Ikke tilgjengelig'
                    : candidate.inventory <= 0
                      ? 'Utsolgt'
                      : priceDifference(candidate.price - variant.price)

                  return (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={isSelected}
                      disabled={!candidate}
                      onClick={() => candidate && !isSelected && choose(candidate)}
                      className={`flex flex-col gap-0.5 rounded-lg px-3.5 py-[11px] text-left disabled:cursor-not-allowed disabled:opacity-50 ${
                        isSelected
                          ? 'border-2 border-brand bg-brand-soft'
                          : 'border border-line bg-white px-[15px] py-3 hover:border-steel'
                      }`}
                    >
                      <span className="text-sm font-semibold">{option.label}</span>
                      <span className={`text-xs ${isSelected ? 'text-subtle' : 'text-muted'}`}>{note}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5 border-t border-line pt-5">
        {saving > 0 ? (
          <span className="self-start rounded bg-brand-soft px-[9px] py-[5px] text-[11px] font-bold tracking-[0.4px] text-brand">
            SPAR {formatKroner(saving).toUpperCase()}
          </span>
        ) : null}
        <p className="mt-1.5 flex flex-wrap items-baseline gap-x-3.5 gap-y-1.5">
          <span className="text-[42px] leading-none font-bold tracking-[-1px]">{formatPrice(variant.price)}</span>
          {saving > 0 ? (
            <span className="text-sm text-muted">
              Førpris <s>{formatPrice(variant.compareAtPrice!)}</s>
            </span>
          ) : null}
        </p>
        <p className="mt-1 text-[13px] text-muted">
          Eller fra {formatPrice(Math.ceil(variant.price / INSTALMENT_MONTHS))} /mnd. i {INSTALMENT_MONTHS} mnd. med delbetaling.
        </p>
      </div>

      <div className="flex flex-col gap-2.5 text-[13px]">
        <p className="flex items-center gap-[9px]">
          <span aria-hidden="true" className={`size-2 shrink-0 rounded-full ${inStock ? 'bg-success' : 'bg-steel'}`} />
          {inStock ? (
            <span>
              <strong className="font-semibold">{formatStock(variant.inventory)} på lager i nettbutikken.</strong> Bestill innen
              kl. 16 for å få den sendt i dag.
            </span>
          ) : (
            <span>
              <strong className="font-semibold">Midlertidig utsolgt.</strong> Velg en annen variant, eller kom tilbake snart.
            </span>
          )}
        </p>
        {storePickup && inStock ? (
          <p className="flex items-center gap-[9px]">
            <Store className="size-4 shrink-0 text-muted" strokeWidth={1.7} aria-hidden="true" />
            {storePickup}
          </p>
        ) : null}
        {variant.sku ? <p className="text-xs text-muted">Varenr. {variant.sku}</p> : null}
      </div>

      <div className="flex flex-wrap gap-2.5">
        <div role="group" aria-label="Antall" className="flex h-[52px] items-center rounded-md border border-line">
          <button
            type="button"
            onClick={() => setQuantity(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Færre"
            className="flex h-full w-11 items-center justify-center disabled:text-steel"
          >
            <Minus className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
          <output aria-live="polite" className="min-w-7 text-center text-[15px] font-semibold">
            {quantity}
          </output>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            disabled={quantity >= maxQuantity}
            aria-label="Flere"
            className="flex h-full w-11 items-center justify-center disabled:text-steel"
          >
            <Plus className="size-4" strokeWidth={2} aria-hidden="true" />
          </button>
        </div>
        {inStock ? (
          <button
            type="button"
            onClick={addToCart}
            disabled={status === 'adding'}
            className="flex h-[52px] flex-[1_1_220px] items-center justify-center gap-2.5 rounded-md bg-brand text-[15px] font-semibold text-white hover:bg-brand-hover disabled:opacity-70"
          >
            <ShoppingCart className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
            {status === 'adding'
              ? 'Legger i handlekurven …'
              : itemCount > 1
                ? `Legg ${itemCount} varer i handlekurv`
                : 'Legg i handlekurv'}
          </button>
        ) : (
          <button
            type="button"
            disabled
            className="flex h-[52px] flex-[1_1_220px] items-center justify-center rounded-md bg-line text-[15px] font-semibold text-muted"
          >
            Utsolgt
          </button>
        )}
      </div>
      <p role="status" className={status === 'added' ? '-mt-2.5 flex items-center gap-2 text-sm font-semibold text-success' : 'sr-only'}>
        {status === 'added' ? (
          <>
            <CircleCheck className="size-[18px]" strokeWidth={2} aria-hidden="true" />
            Lagt i handlekurven.
            <Link href={routes.cart} className="text-brand underline">
              Gå til handlekurven
            </Link>
          </>
        ) : null}
      </p>

      {addOns.length ? (
        <div className="rounded-xl bg-surface px-5 py-[18px]">
          <h2 className="mb-1 text-[15px] font-bold">Fullfør oppsettet</h2>
          <p className="mb-3 text-xs text-muted">Legg til utstyr og få alt i samme pakke.</p>
          <div className="flex flex-col gap-2">
            {addOns.map((addOn) => (
              <label key={addOn.id} className="flex cursor-pointer items-center gap-3 rounded-lg bg-white px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={chosenAddOns.includes(addOn.id)}
                  onChange={() => toggleAddOn(addOn.id)}
                  className="size-[18px] shrink-0 accent-brand"
                />
                <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-surface">
                  {addOn.image ? <Image src={addOn.image.url} alt="" fill sizes="44px" className="object-cover" /> : null}
                </span>
                <span className="min-w-0 flex-1 text-[13px] font-medium">{addOn.title}</span>
                <span className="text-[13px] font-bold whitespace-nowrap">+ {formatPrice(addOn.price)}</span>
              </label>
            ))}
          </div>
          {chosenAddOns.length ? (
            <p className="mt-3 flex justify-between text-sm">
              <span>Totalt med tillegg</span>
              <strong className="font-bold">{formatPrice(variant.price * quantity + addOnTotal)}</strong>
            </p>
          ) : null}
        </div>
      ) : null}

      <ul className="flex flex-col gap-3 text-[13px]">
        <li className="flex items-center gap-3">
          <Truck className="size-[18px] shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
          <span>
            {variant.price >= freeShippingThreshold ? (
              <strong className="font-semibold">Fri frakt.</strong>
            ) : (
              <strong className="font-semibold">Fri frakt over {formatKroner(freeShippingThreshold)}.</strong>
            )}{' '}
            Levering på 1–3 virkedager.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <RotateCcw className="size-[18px] shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
          <span>
            <strong className="font-semibold">30 dagers åpent kjøp.</strong> Gratis retur i butikk.
          </span>
        </li>
        <li className="flex items-center gap-3">
          <ShieldCheck className="size-[18px] shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
          <span>
            <strong className="font-semibold">2 års garanti</strong> og 5 års reklamasjonsrett.
          </span>
        </li>
      </ul>
    </div>
  )
}
