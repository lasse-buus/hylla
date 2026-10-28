import type { Metadata } from 'next'

import Image from 'next/image'
import Link from 'next/link'

import { OrderStatusBadge } from '@/components/account/OrderStatusBadge'
import { getMyAccountOrders, matchesFilter, orderFilters, parseOrderFilter } from '@/lib/account'
import { formatPrice, formatShortDate } from '@/lib/format'
import { routes } from '@/lib/routes'
import { requireShopCustomer } from '@/lib/shopSession'

export const metadata: Metadata = {
  title: 'Ordrer',
  robots: { index: false },
}

export default async function AccountOrdersPage(props: PageProps<'/min-side/ordrer'>) {
  const filter = parseOrderFilter((await props.searchParams).status)
  const customer = await requireShopCustomer(filter === 'alle' ? routes.accountOrders : `${routes.accountOrders}?status=${filter}`)
  const orders = (await getMyAccountOrders(customer.id)).filter((order) => matchesFilter(order.stage, filter))

  return (
    <section aria-labelledby="ordrer-tittel" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 id="ordrer-tittel" className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">
            Ordrer
          </h1>
          <p className="mt-1.5 text-[15px] text-muted">Alle bestillinger fra de siste to årene.</p>
        </div>
        <nav aria-label="Filtrer ordrer" className="flex flex-wrap gap-1.5">
          {orderFilters.map((option) => {
            const active = option.value === filter
            return (
              <Link
                key={option.value}
                href={option.value === 'alle' ? routes.accountOrders : `${routes.accountOrders}?status=${option.value}`}
                aria-current={active ? 'true' : undefined}
                className={`inline-flex h-[35px] items-center rounded-full border px-[15px] text-xs font-semibold ${
                  active ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-steel'
                }`}
              >
                {option.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {orders.length ? (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => (
            <li key={order.id}>
              <article className="flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl bg-white px-6 py-5">
                <div className="flex flex-[1_1_200px] flex-col gap-1.5">
                  <span className="flex flex-wrap items-center gap-2.5">
                    <h2 className="text-base font-bold">Ordre #{order.number}</h2>
                    <OrderStatusBadge status={order.status} />
                  </span>
                  <span className="text-[13px] text-muted">
                    Bestilt {formatShortDate(order.placedAt)} · {order.itemText}
                  </span>
                  <span className="text-[13px] text-subtle">{order.statusLine}</span>
                </div>
                <div aria-hidden="true" className="flex gap-2">
                  {order.thumbnails.slice(0, 3).map((image) => (
                    <Image key={image.url} src={image.url} alt="" width={56} height={56} className="size-14 rounded-lg bg-surface object-cover" />
                  ))}
                </div>
                <div className="flex min-w-[130px] flex-col items-end gap-2">
                  <span className="text-lg font-bold">{formatPrice(order.total)}</span>
                  <Link
                    href={routes.accountOrder(order.number)}
                    aria-label={`Se detaljer for ordre ${order.number}`}
                    className="inline-flex h-[38px] items-center rounded-md border-[1.5px] border-ink bg-white px-3.5 text-[13px] font-semibold hover:bg-surface"
                  >
                    Se detaljer
                  </Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-white p-8 text-center text-sm text-muted">Ingen ordrer med denne statusen.</p>
      )}
    </section>
  )
}
