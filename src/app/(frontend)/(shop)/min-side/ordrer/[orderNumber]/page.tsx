import type { Metadata } from 'next'

import { ChevronLeft, FileText, Info, MessageCircle, MapPinned, RotateCcw } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { orderStatusTones } from '@/collections/orders/constants'
import { DemoUnavailableButton } from '@/components/account/DemoUnavailableButton'
import { OrderProgress } from '@/components/account/OrderProgress'
import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import { getMyAccountOrder } from '@/lib/account'
import { formatDate, formatDateTime, formatPrice } from '@/lib/format'
import { routes } from '@/lib/routes'
import { requireShopCustomer } from '@/lib/shopSession'

export async function generateMetadata(props: PageProps<'/min-side/ordrer/[orderNumber]'>): Promise<Metadata> {
  const { orderNumber } = await props.params
  return { title: `Ordre #${orderNumber}`, robots: { index: false } }
}

const cardClass = 'rounded-xl bg-white'
const sideHeadingClass = 'text-[15px] font-bold'

export default async function AccountOrderPage(props: PageProps<'/min-side/ordrer/[orderNumber]'>) {
  const { orderNumber: param } = await props.params
  const customer = await requireShopCustomer(`${routes.accountOrders}/${encodeURIComponent(param)}`)

  const orderNumber = Number(param)
  if (!Number.isSafeInteger(orderNumber)) notFound()
  // Only orders this visitor may see: Lasse's history and the ones this browser placed.
  const order = await getMyAccountOrder(customer.id, orderNumber)
  if (!order) notFound()

  return (
    <section aria-labelledby="ordre-tittel" className="flex flex-col gap-4">
      <Link href={routes.accountOrders} className="inline-flex items-center gap-1.5 self-start text-[13px] font-semibold text-brand hover:underline">
        <ChevronLeft className="size-4" strokeWidth={1.8} aria-hidden="true" />
        Alle ordrer
      </Link>

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 id="ordre-tittel" className="flex flex-wrap items-center gap-3 text-[28px] font-extrabold tracking-[-0.8px] sm:text-[32px]">
            Ordre #{order.number}
            <OrderStatusBadge status={order.status} size="md" />
          </h1>
          <p className="mt-1.5 text-sm text-muted">Bestilt {formatDateTime(order.placedAt)}</p>
        </div>
        <div className="flex flex-wrap items-start gap-2">
          {order.delivery.canTrack ? (
            <DemoUnavailableButton className="inline-flex h-[42px] items-center gap-2 rounded-md bg-brand px-4 text-[13px] font-semibold text-white hover:bg-brand-hover">
              <MapPinned className="size-4" strokeWidth={1.8} aria-hidden="true" />
              Spor pakken
            </DemoUnavailableButton>
          ) : null}
          <DemoUnavailableButton className="inline-flex h-[42px] items-center gap-2 rounded-md border-[1.5px] border-ink px-4 text-[13px] font-semibold hover:bg-white">
            <FileText className="size-4" strokeWidth={1.8} aria-hidden="true" />
            Kvittering (PDF)
          </DemoUnavailableButton>
        </div>
      </div>

      {order.closedText ? (
        <p style={orderStatusTones[order.status]} className="flex items-center gap-2.5 rounded-xl px-5 py-4 text-sm">
          <Info className="size-[18px] shrink-0" strokeWidth={1.8} aria-hidden="true" />
          {order.closedText}
        </p>
      ) : (
        <div className={`${cardClass} px-6 py-[22px]`}>
          <OrderProgress steps={order.steps} label="Ordrestatus" showDates />
        </div>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="flex min-w-0 flex-col gap-4">
          <section aria-labelledby="varer-tittel" className={`${cardClass} px-6 pt-2 pb-5`}>
            <h2 id="varer-tittel" className="pt-4 pb-1 text-base font-bold">
              Varer
            </h2>
            <ul>
              {order.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 border-b border-line py-3.5">
                  <span className="relative size-[72px] shrink-0 overflow-hidden rounded-lg bg-surface">
                    {item.image ? <Image src={item.image.url} alt="" fill sizes="72px" className="object-cover" /> : null}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    {item.href ? (
                      <Link href={item.href} className="text-sm font-semibold hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold">{item.title}</span>
                    )}
                    {item.meta ? <span className="text-xs text-muted">{item.meta}</span> : null}
                  </span>
                  <span className="flex flex-col gap-0.5 text-right">
                    <span className="text-[15px] font-bold">{formatPrice(item.lineTotal)}</span>
                    <span className="text-xs text-muted">{item.quantity} stk.</span>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">Varer</dt>
                <dd>{formatPrice(order.totals.items)}</dd>
              </div>
              {order.totals.savings > 0 ? (
                <div className="flex justify-between gap-3 font-semibold text-success">
                  <dt>Du sparte</dt>
                  <dd>− {formatPrice(order.totals.savings)}</dd>
                </div>
              ) : null}
              {order.totals.discount > 0 ? (
                <div className="flex justify-between gap-3">
                  <dt className="text-subtle">Rabatt</dt>
                  <dd>− {formatPrice(order.totals.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-3">
                <dt className="text-subtle">Frakt · {order.delivery.method}</dt>
                <dd>{order.totals.shipping ? formatPrice(order.totals.shipping) : 'Gratis'}</dd>
              </div>
              <div className="flex justify-between gap-3 border-t border-line pt-2.5 text-base font-bold">
                <dt>Totalt</dt>
                <dd>{formatPrice(order.totals.total)}</dd>
              </div>
              <div className="flex justify-between gap-3 text-xs text-muted">
                <dt>Herav mva.</dt>
                <dd>{formatPrice(order.totals.vat)}</dd>
              </div>
            </dl>
          </section>

          {order.events.length ? (
            <section aria-labelledby="hendelser-tittel" className={`${cardClass} px-6 py-5`}>
              <h2 id="hendelser-tittel" className="mb-3.5 text-base font-bold">
                Hendelser
              </h2>
              <ol>
                {order.events.map((event, index) => (
                  <li key={`${event.when}-${index}`} className="flex gap-3.5 pb-3.5">
                    <span aria-hidden="true" className={`mt-1 size-2.5 shrink-0 rounded-full ${index === 0 ? 'bg-brand' : 'bg-steel'}`} />
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm">{event.text}</span>
                      <span className="text-xs text-muted">{event.when}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <section aria-labelledby="levering-tittel" className={`${cardClass} flex flex-col gap-2.5 px-[22px] py-5`}>
            <h2 id="levering-tittel" className={sideHeadingClass}>
              Levering
            </h2>
            <p className="text-sm leading-[1.55] text-subtle">
              {order.delivery.method}
              {order.delivery.carrier ? (
                <>
                  <br />
                  {order.delivery.carrier}
                </>
              ) : null}
            </p>
            {order.delivery.trackingNumber ? (
              <p className="text-[13px] text-subtle">
                Sporingsnummer
                <br />
                <span className="font-mono text-[13px] text-ink">{order.delivery.trackingNumber}</span>
              </p>
            ) : null}
            <p className="mt-1.5 border-t border-line pt-3 text-sm leading-[1.55] text-subtle">
              {[order.address.name, ...order.address.lines].map((line, index) => (
                <span key={index} className="block">
                  {line}
                </span>
              ))}
            </p>
          </section>

          <section aria-labelledby="betaling-tittel" className={`${cardClass} flex flex-col gap-2.5 px-[22px] py-5`}>
            <h2 id="betaling-tittel" className={sideHeadingClass}>
              Betaling
            </h2>
            <p className="flex justify-between gap-3 text-sm">
              <span className="text-subtle">{order.payment.method}</span>
              <span
                style={order.payment.isRefunded ? { color: orderStatusTones.refunded.color } : undefined}
                className={`font-semibold ${order.payment.isRefunded ? '' : 'text-success'}`}
              >
                {order.payment.status}
              </span>
            </p>
            {order.payment.reference ? <p className="text-xs text-muted">Referanse {order.payment.reference}</p> : null}
          </section>

          <section aria-labelledby="hjelp-tittel" className={`${cardClass} flex flex-col gap-2.5 px-[22px] py-5`}>
            <h2 id="hjelp-tittel" className={sideHeadingClass}>
              Trenger du hjelp?
            </h2>
            {order.returnDeadline ? (
              <>
                <DemoUnavailableButton className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline">
                  <RotateCcw className="size-4" strokeWidth={1.8} aria-hidden="true" />
                  Returner varer
                </DemoUnavailableButton>
                <p className="text-[13px] leading-normal text-muted">
                  Du kan returnere varene gratis til og med {formatDate(order.returnDeadline)}.
                </p>
              </>
            ) : null}
            <Link
              href={`${routes.customerService}#kontakt`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
            >
              <MessageCircle className="size-4" strokeWidth={1.8} aria-hidden="true" />
              Kontakt kundeservice om ordren
            </Link>
          </section>
        </div>
      </div>
    </section>
  )
}
