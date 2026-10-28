import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import type { AccountOrderSummary } from '@/lib/account'
import { formatPrice, formatShortDate } from '@/lib/format'
import { routes } from '@/lib/routes'

import { OrderStatusBadge } from './OrderStatusBadge'

/** One line in "Siste bestillinger". */
export function OrderRow({ order }: { order: AccountOrderSummary }) {
  return (
    <li className="border-t border-line">
      <Link href={routes.accountOrder(order.number)} className="group flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
        <span className="flex flex-[1_1_180px] flex-col gap-0.5">
          <span className="text-sm font-semibold group-hover:underline">Ordre #{order.number}</span>
          <span className="text-xs text-muted">
            {formatShortDate(order.placedAt)} · {order.itemText}
          </span>
        </span>
        <OrderStatusBadge status={order.status} />
        <span className="min-w-[90px] text-right text-[15px] font-bold">{formatPrice(order.total)}</span>
        <ChevronRight className="size-4 text-muted" strokeWidth={1.8} aria-hidden="true" />
      </Link>
    </li>
  )
}
