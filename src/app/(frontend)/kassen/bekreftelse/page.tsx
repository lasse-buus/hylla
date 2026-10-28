import type { Metadata } from 'next'
import type { Media, Product } from '@/payload-types'

import config from '@payload-config'
import { CircleCheck, Info } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { paymentMethodOptions } from '@/collections/orders/constants'
import { formatPrice } from '@/lib/format'
import { toImage } from '@/lib/media'
import { placedOrderID } from '@/lib/orderReceipt'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Takk for bestillingen',
  robots: { index: false },
}

const asDoc = <T extends object>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

export default async function OrderConfirmationPage() {
  const orderID = await placedOrderID()
  if (!orderID) redirect(routes.cart)

  const payload = await getPayload({ config })
  const order = await payload.findByID({
    collection: 'orders',
    id: orderID,
    depth: 2,
    populate: { products: { slug: true, gallery: true } },
    disableErrors: true,
  })
  // Gone after the nightly reset.
  if (!order) redirect(routes.cart)

  const { customer, shippingAddress, shipping, payment, totals } = order
  const paymentLabel = paymentMethodOptions.find((option) => option.value === payment?.method)?.label

  return (
    <div className="shop-container pt-10 pb-16">
      <div className="mx-auto flex max-w-[760px] flex-col gap-4">
        <section className="flex flex-col items-center gap-3 rounded-2xl bg-white px-6 py-10 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success-soft text-success">
            <CircleCheck className="size-8" strokeWidth={1.7} aria-hidden="true" />
          </span>
          <h1 className="text-[32px] leading-tight font-extrabold tracking-[-1px] sm:text-4xl">
            Takk for bestillingen{customer?.firstName ? `, ${customer.firstName}` : ''}!
          </h1>
          <p className="text-[15px] text-subtle">
            Ordrenummer <strong className="font-semibold text-ink">#{order.orderNumber}</strong>
          </p>
          <p className="mt-2 flex max-w-[560px] items-start gap-2.5 rounded-lg bg-brand-soft px-4 py-3 text-left text-[13px] leading-normal">
            <Info className="mt-px size-4 shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
            Dette er en demobestilling. Ingen penger er trukket, ingen e-post er sendt, og ordren slettes i natt. Du finner den
            under Ordrer i adminpanelet til da.
          </p>
        </section>

        <section aria-labelledby="levering-tittel" className="grid gap-6 rounded-xl bg-white p-6 sm:grid-cols-3 sm:p-7">
          <h2 id="levering-tittel" className="sr-only">
            Levering og betaling
          </h2>
          <div>
            <h3 className="text-xs font-semibold text-muted">Leveres til</h3>
            <p className="mt-1.5 text-sm leading-normal">
              {customer?.firstName} {customer?.lastName}
              <br />
              {shippingAddress?.addressLine}
              <br />
              {shippingAddress?.postalCode} {shippingAddress?.city}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted">Leveringsmåte</h3>
            <p className="mt-1.5 text-sm leading-normal">{shipping?.label}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold text-muted">Betaling</h3>
            <p className="mt-1.5 text-sm leading-normal">
              {paymentLabel} (demo)
              <br />
              <span className="text-muted">Ref. {payment?.reference}</span>
            </p>
          </div>
        </section>

        <section aria-labelledby="varer-tittel" className="rounded-xl bg-white p-6 sm:p-7">
          <h2 id="varer-tittel" className="mb-4 text-lg font-bold">
            Varer
          </h2>
          <ul className="flex flex-col gap-3.5">
            {(order.items ?? []).map((item) => {
              const product = asDoc<Product>(item.product)
              const image = toImage(asDoc<Media>(product?.gallery?.[0]), 'thumbnail')
              return (
                <li key={item.id} className="flex items-center gap-3.5">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface">
                    {image ? <Image src={image.url} alt="" fill sizes="64px" className="object-cover" /> : null}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    {product?.slug ? (
                      <Link href={routes.product(product.slug)} className="text-sm font-medium hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium">{item.title}</span>
                    )}
                    <span className="text-xs text-muted">
                      {[item.variantLabel, `${item.quantity} stk.`].filter(Boolean).join(' · ')}
                    </span>
                  </span>
                  <span className="text-sm font-semibold whitespace-nowrap">{formatPrice(item.lineTotal ?? 0)}</span>
                </li>
              )
            })}
          </ul>

          <div className="my-5 h-px bg-line" />
          <dl className="flex flex-col gap-2.5 text-sm">
            {totals?.savings ? (
              <div className="flex justify-between gap-3 font-semibold text-success">
                <dt>Du sparte</dt>
                <dd>{formatPrice(totals.savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-3">
              <dt className="text-subtle">Frakt</dt>
              <dd className={totals?.shipping ? '' : 'font-semibold text-success'}>
                {totals?.shipping ? formatPrice(totals.shipping) : 'Gratis'}
              </dd>
            </div>
          </dl>
          <div className="my-5 h-px bg-line" />
          <p className="flex items-baseline justify-between gap-3">
            <span className="text-[15px] font-semibold">Totalt</span>
            <span className="text-[26px] font-bold tracking-[-0.5px]">{formatPrice(order.total ?? 0)}</span>
          </p>
          <p className="mt-1 text-right text-xs text-muted">Inkl. mva. {formatPrice(totals?.vat ?? 0)}</p>
        </section>

        <Link
          href={routes.home}
          className="flex h-[52px] items-center justify-center self-center rounded-md bg-brand px-8 text-[15px] font-semibold text-white hover:bg-brand-hover"
        >
          Fortsett å handle
        </Link>
      </div>
    </div>
  )
}
