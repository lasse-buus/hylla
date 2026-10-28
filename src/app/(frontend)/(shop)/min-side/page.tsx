import type { Metadata } from 'next'

import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { OrderProgress } from '@/components/account/OrderProgress'
import { OrderRow } from '@/components/account/OrderRow'
import { AccountGreeting, OverviewCards } from '@/components/account/OverviewCards'
import { getMyAccountOrders, orderProgress } from '@/lib/account'
import { routes } from '@/lib/routes'
import { requireShopCustomer } from '@/lib/shopSession'

export const metadata: Metadata = {
  title: 'Min side',
  robots: { index: false },
}

export default async function AccountOverviewPage() {
  const customer = await requireShopCustomer(routes.account)
  const orders = await getMyAccountOrders(customer.id)
  // The order to show up top: the latest one on its way, or else the latest one still being prepared.
  const active = orders.find((order) => order.status === 'shipped') ?? orders.find((order) => order.stage === 0 || order.stage === 1)

  return (
    <section aria-labelledby="oversikt-tittel" className="flex flex-col gap-4">
      <div>
        <h1 id="oversikt-tittel" className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">
          <AccountGreeting />
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">Her finner du bestillingene dine, adressene og innstillingene dine.</p>
      </div>

      {active ? (
        <article aria-labelledby="aktiv-ordre" className="flex flex-col gap-[18px] rounded-xl bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold tracking-[0.6px] text-brand uppercase">
                {active.status === 'shipped' ? 'På vei til deg' : 'Under behandling'}
              </span>
              <h2 id="aktiv-ordre" className="text-xl font-bold">
                Ordre #{active.number} {active.status === 'shipped' ? 'er sendt' : 'behandles'}
              </h2>
              <span className="text-[13px] text-muted">{active.statusLine}</span>
            </div>
            <Link
              href={routes.accountOrder(active.number)}
              className="inline-flex h-11 items-center gap-2.5 rounded-md bg-brand px-[18px] text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Se ordren
              <ArrowRight className="size-4" strokeWidth={1.8} aria-hidden="true" />
            </Link>
          </div>
          <OrderProgress steps={orderProgress({ status: active.status }).steps} label={`Status for ordre ${active.number}`} />
          <div className="flex items-center gap-2.5">
            {active.thumbnails.slice(0, 3).map((image) => (
              <Image key={image.url} src={image.url} alt="" width={56} height={56} className="size-14 rounded-lg bg-surface object-cover" />
            ))}
            <span className="text-[13px] text-muted">{active.itemsHeadline}</span>
          </div>
        </article>
      ) : null}

      <OverviewCards />

      <section aria-labelledby="siste-tittel" className="rounded-xl bg-white px-6 pt-2 pb-4">
        <div className="flex items-baseline justify-between gap-3 pt-4 pb-2">
          <h2 id="siste-tittel" className="text-lg font-bold">
            Siste bestillinger
          </h2>
          <Link href={routes.accountOrders} className="text-[13px] font-semibold text-brand hover:underline">
            Se alle ordrer
          </Link>
        </div>
        {orders.length ? (
          <ul>
            {orders.slice(0, 3).map((order) => (
              <OrderRow key={order.id} order={order} />
            ))}
          </ul>
        ) : (
          <p className="border-t border-line py-6 text-sm text-muted">Du har ingen bestillinger ennå.</p>
        )}
      </section>
    </section>
  )
}
