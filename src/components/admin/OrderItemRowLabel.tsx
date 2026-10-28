'use client'

import { useRowLabel } from '@payloadcms/ui'

type ItemRow = { lineTotal?: number | null; quantity?: number | null; title?: string | null; variantLabel?: string | null }

const kroner = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 })

export const OrderItemRowLabel = () => {
  const { data, rowNumber } = useRowLabel<ItemRow>()
  const name = data?.title ? `${data.title}${data.variantLabel ? ` (${data.variantLabel})` : ''}` : `Vare ${(rowNumber ?? 0) + 1}`
  const total = typeof data?.lineTotal === 'number' ? ` · ${kroner.format(data.lineTotal)},–` : ''

  return (
    <span>
      {data?.quantity ?? 1} × {name}
      {total}
    </span>
  )
}
