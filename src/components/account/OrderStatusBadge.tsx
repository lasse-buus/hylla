import type { Order } from '@/payload-types'

import { orderStatusTones, statusLabel } from '@/collections/orders/constants'

export function OrderStatusBadge({ status, size = 'sm' }: { status: Order['status']; size?: 'sm' | 'md' }) {
  return (
    <span
      style={orderStatusTones[status]}
      className={`inline-flex rounded-full font-semibold tracking-normal whitespace-nowrap ${
        size === 'md' ? 'px-3 py-1 text-[13px]' : 'px-2.5 py-[3px] text-xs'
      }`}
    >
      {statusLabel(status)}
    </span>
  )
}
