'use client'

import type { DeliveryMethodSetting } from '@/globals/StoreSettings'

import { useEcommerce } from '@payloadcms/plugin-ecommerce/client/react'
import { AlertCircle, ArrowRight, ChevronLeft, Info, RefreshCw, RotateCcw, ShieldCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { newDemoCustomer, placeOrder } from '@/app/(frontend)/kassen/actions'
import { cartTotals, vatOf } from '@/lib/cart'
import type { DemoCustomer } from '@/lib/demoCustomer'

/** A generated demo customer (with a seed), or the logged-in demo account (no seed: the server knows who it is). */
export type CheckoutCustomer = Omit<DemoCustomer, 'seed'> & { seed: number | null }
import { formatPrice } from '@/lib/format'
import { routes } from '@/lib/routes'

import { EmptyCart } from './EmptyCart'
import { useCartLines } from './useCartLines'

const paymentMethods = [
  { value: 'vipps', name: 'Vipps', description: 'Betal raskt og trygt i appen', badge: 'Vipps' },
  { value: 'card', name: 'Kort', description: 'Visa og Mastercard', badge: 'VISA · MC' },
  { value: 'klarna', name: 'Klarna', description: 'Betal om 30 dager eller del opp betalingen', badge: 'Klarna' },
]

/** "91234567" → "912 34 567" */
const formatPhone = (phone: string) => `${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5)}`

const sectionClass = 'rounded-xl bg-white p-6 sm:p-7'
const optionClass =
  'flex cursor-pointer items-center gap-3.5 rounded-lg border border-line px-[18px] py-4 hover:border-steel has-checked:border-brand has-checked:bg-brand-soft/50 has-checked:ring-1 has-checked:ring-brand has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-brand'
const radioClass = 'size-[18px] shrink-0 accent-brand focus-visible:outline-none'

function SectionHeading({ id, step, children }: { id: string; step: number; children: React.ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-3 text-lg font-bold">
      <span aria-hidden="true" className="inline-flex size-7 items-center justify-center rounded-full bg-ink text-[13px] text-white">
        {step}
      </span>
      {children}
    </h2>
  )
}

type CheckoutViewProps = {
  initialCustomer: CheckoutCustomer
  isAccount: boolean
  deliveryMethods: DeliveryMethodSetting[]
  freeShippingThreshold: number
}

export function CheckoutView({ initialCustomer, isAccount, deliveryMethods, freeShippingThreshold }: CheckoutViewProps) {
  const router = useRouter()
  const { clearSession } = useEcommerce()
  const { cart, lines, isRestoring, refreshCart } = useCartLines()
  const { count, total, savings } = cartTotals(lines)

  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer)
  const [deliveryMethod, setDeliveryMethod] = useState(deliveryMethods[0]?.method ?? '')
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0].value)
  const [acknowledged, setAcknowledged] = useState(false)
  const [showAcknowledgeError, setShowAcknowledgeError] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPlaced, setIsPlaced] = useState(false)
  const [isSubmitting, startSubmit] = useTransition()
  const [isSwitchingCustomer, startSwitchCustomer] = useTransition()

  const shippingPrice = (method: DeliveryMethodSetting) =>
    method.freeAboveThreshold && total >= freeShippingThreshold ? 0 : method.price
  const delivery = deliveryMethods.find((method) => method.method === deliveryMethod)
  const shipping = delivery ? shippingPrice(delivery) : 0
  const grandTotal = total + shipping

  const switchCustomer = () => startSwitchCustomer(async () => setCustomer(await newDemoCustomer()))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!acknowledged) {
      setShowAcknowledgeError(true)
      return
    }
    if (!cart) return

    setError(null)
    startSubmit(async () => {
      const result = await placeOrder({
        cartID: cart.id,
        cartSecret: localStorage.getItem('cart_secret'),
        customerSeed: customer.seed,
        deliveryMethod,
        paymentMethod,
        acknowledged,
      })

      if (result.ok) {
        // The order is placed and the cart deleted on the server; forget it here too.
        setIsPlaced(true)
        clearSession()
        router.replace(routes.orderConfirmation)
        return
      }

      setError(result.error)
      if (result.cartChanged) await refreshCart()
    })
  }

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">Kassen</h1>
        <Link href={routes.cart} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand hover:underline">
          <ChevronLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
          Tilbake til handlekurven
        </Link>
      </div>

      {isRestoring || isPlaced ? (
        <div aria-busy="true" className="mt-6 h-96 animate-pulse rounded-2xl bg-white" />
      ) : !lines.length ? (
        <EmptyCart />
      ) : (
        <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <form onSubmit={submit} noValidate className="flex min-w-0 flex-col gap-4">
            <section aria-labelledby="kunde" className={sectionClass}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <SectionHeading id="kunde" step={1}>
                  Kunde og leveringsadresse
                </SectionHeading>
                {isAccount ? null : (
                  <button
                    type="button"
                    onClick={switchCustomer}
                    disabled={isSwitchingCustomer}
                    className="inline-flex items-center gap-2 text-[13px] font-semibold text-brand hover:underline disabled:opacity-60"
                  >
                    <RefreshCw
                      className={`size-4 ${isSwitchingCustomer ? 'animate-spin motion-reduce:animate-none' : ''}`}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                    Ny demokunde
                  </button>
                )}
              </div>
              <p className="mt-3 flex items-start gap-2.5 text-[13px] leading-normal text-muted">
                <Info className="mt-px size-4 shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
                {isAccount
                  ? `Logget inn som ${customer.firstName} ${customer.lastName}. Vi bruker den lagrede standardadressen din.`
                  : 'Kassen bruker en oppdiktet kunde, så du slipper å oppgi egne opplysninger. Ingenting her er ekte.'}
              </p>
              <dl aria-live="polite" className="mt-5 grid gap-x-6 gap-y-4 rounded-lg bg-surface p-5 text-[15px] sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-semibold text-muted">Navn</dt>
                  <dd className="mt-1 font-medium">
                    {customer.firstName} {customer.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted">Mobilnummer</dt>
                  <dd className="mt-1 font-medium">+47 {formatPhone(customer.phone)}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted">E-post</dt>
                  <dd className="mt-1 font-medium break-all">{customer.email}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted">Leveringsadresse</dt>
                  <dd className="mt-1 font-medium">
                    {customer.address.addressLine}, {customer.address.postalCode} {customer.address.city}
                  </dd>
                </div>
              </dl>
            </section>

            <fieldset aria-labelledby="levering" className={`min-w-0 ${sectionClass}`}>
              <SectionHeading id="levering" step={2}>
                Leveringsmåte
              </SectionHeading>
              <div className="mt-5 flex flex-col gap-2.5">
                {deliveryMethods.map((method) => {
                  const price = shippingPrice(method)
                  return (
                    <label key={method.method} className={optionClass}>
                      <input
                        type="radio"
                        name="levering"
                        value={method.method}
                        checked={deliveryMethod === method.method}
                        onChange={() => setDeliveryMethod(method.method)}
                        className={radioClass}
                      />
                      <span className="flex flex-1 flex-col gap-[3px]">
                        <span className="text-[15px] font-semibold">{method.label}</span>
                        {method.description ? <span className="text-[13px] text-muted">{method.description}</span> : null}
                      </span>
                      <span className={`text-sm font-bold ${price === 0 ? 'text-success' : ''}`}>
                        {price === 0 ? 'Gratis' : formatPrice(price)}
                      </span>
                    </label>
                  )
                })}
              </div>
            </fieldset>

            <section aria-labelledby="betaling" className={sectionClass}>
              <SectionHeading id="betaling" step={3}>
                Betaling
              </SectionHeading>
              <fieldset aria-labelledby="betaling" className="mt-5 flex flex-col gap-2.5">
                {paymentMethods.map((method) => (
                  <label key={method.value} className={optionClass}>
                    <input
                      type="radio"
                      name="betaling"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className={radioClass}
                    />
                    <span className="flex flex-1 flex-col gap-[3px]">
                      <span className="text-[15px] font-semibold">{method.name}</span>
                      <span className="text-[13px] text-muted">{method.description}</span>
                    </span>
                    <span className="rounded border border-line bg-white px-2 py-[5px] text-[10px] font-bold">{method.badge}</span>
                  </label>
                ))}
              </fieldset>

              <p className="mt-4 flex items-start gap-2.5 rounded-lg bg-surface px-4 py-3.5 text-[13px] leading-normal text-subtle">
                <Info className="mt-px size-4 shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
                Hylla tar ikke imot betaling. Bestillingen registreres som om betalingen var reservert, men ingen penger blir
                trukket.
              </p>

              <label className="mt-5 flex cursor-pointer items-start gap-2.5 text-sm leading-normal">
                <input
                  type="checkbox"
                  checked={acknowledged}
                  onChange={(event) => {
                    setAcknowledged(event.target.checked)
                    setShowAcknowledgeError(false)
                  }}
                  aria-invalid={showAcknowledgeError}
                  aria-describedby={showAcknowledgeError ? 'bekreft-feil' : undefined}
                  className="mt-0.5 size-[18px] shrink-0 accent-brand"
                />
                Jeg forstår at Hylla er en demobutikk, og at bestillingen ikke blir sendt.
              </label>
              {showAcknowledgeError ? (
                <p id="bekreft-feil" role="alert" className="mt-2.5 flex items-center gap-2 text-[13px] font-semibold text-danger">
                  <AlertCircle className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  Kryss av for å fullføre bestillingen.
                </p>
              ) : null}

              {error ? (
                <p role="alert" className="mt-4 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting || !cart}
                className="mt-5 flex h-14 w-full items-center justify-center gap-2.5 rounded-md bg-brand text-base font-semibold text-white hover:bg-brand-hover disabled:opacity-70"
              >
                {isSubmitting ? 'Sender bestillingen …' : `Fullfør bestilling · ${formatPrice(grandTotal)}`}
                {isSubmitting ? null : <ArrowRight className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />}
              </button>
            </section>
          </form>

          <aside aria-labelledby="ordre" className="order-first rounded-xl bg-white p-6 lg:sticky lg:top-6 lg:order-none">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="ordre" className="text-lg font-bold">
                Din ordre
              </h2>
              <Link href={routes.cart} className="text-[13px] font-semibold text-brand hover:underline">
                Endre
              </Link>
            </div>
            <ul className="flex flex-col gap-3.5">
              {lines.map((line) => (
                <li key={line.id} className="flex items-center gap-3.5">
                  <span className="relative size-16 shrink-0 rounded-lg bg-surface">
                    {line.image ? (
                      <Image src={line.image.url} alt="" fill sizes="64px" className="rounded-lg object-cover" />
                    ) : null}
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-[11px] font-bold text-white">
                      <span className="sr-only">Antall: </span>
                      {line.quantity}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="text-[13px] leading-[1.4] font-medium">{line.title}</span>
                    {line.details ? <span className="truncate text-xs text-muted">{line.details}</span> : null}
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap">{formatPrice(line.price * line.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="my-5 h-px bg-line" />
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">Varer ({count})</dt>
                <dd>{formatPrice(total + savings)}</dd>
              </div>
              {savings > 0 ? (
                <div className="flex justify-between gap-3 font-semibold text-success">
                  <dt>Du sparer</dt>
                  <dd>− {formatPrice(savings)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">Frakt{delivery ? ` · ${delivery.label}` : ''}</dt>
                <dd className={`font-semibold ${shipping === 0 ? 'text-success' : ''}`}>
                  {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
                </dd>
              </div>
            </dl>
            <div className="my-5 h-px bg-line" />
            <p className="flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold">Å betale</span>
              <span className="text-[30px] font-bold tracking-[-0.6px]">{formatPrice(grandTotal)}</span>
            </p>
            <p className="mt-1 text-right text-xs text-muted">Inkl. mva. {formatPrice(vatOf(grandTotal))}</p>

            <ul className="mt-5 flex flex-col gap-2.5 rounded-lg bg-surface px-4 py-3.5 text-xs text-subtle">
              <li className="flex items-center gap-2.5">
                <RotateCcw className="size-4 shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
                30 dagers åpent kjøp på alle varer
              </li>
              <li className="flex items-center gap-2.5">
                <ShieldCheck className="size-4 shrink-0 text-brand" strokeWidth={1.7} aria-hidden="true" />
                2 års garanti på alle produkter
              </li>
            </ul>
          </aside>
        </div>
      )}
    </>
  )
}
