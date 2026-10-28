'use client'

import type { DefaultCellComponentProps } from 'payload'

import { orderStatusTones, type OrderStatusValue, statusLabel } from '@/collections/orders/constants'

export const OrderStatusCell = ({ cellData }: DefaultCellComponentProps) => {
  const value = typeof cellData === 'string' ? cellData : ''
  const tone = orderStatusTones[value as OrderStatusValue] ?? orderStatusTones['on-hold']

  return (
    <span
      style={{
        background: tone.background,
        borderRadius: 100,
        color: tone.color,
        display: 'inline-block',
        fontSize: 12,
        fontWeight: 600,
        padding: '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {statusLabel(value)}
    </span>
  )
}
