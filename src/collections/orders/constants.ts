export const orderStatuses = [
  { label: 'Mottatt', value: 'received' },
  { label: 'Behandles', value: 'processing' },
  { label: 'På vent', value: 'on-hold' },
  { label: 'Sendt', value: 'shipped' },
  { label: 'Levert', value: 'delivered' },
  { label: 'Kansellert', value: 'cancelled' },
  { label: 'Refundert', value: 'refunded' },
] as const

export type OrderStatusValue = (typeof orderStatuses)[number]['value']

/** Orders in these statuses no longer hold stock. */
export const releasedStockStatuses: OrderStatusValue[] = ['cancelled', 'refunded']

/** Badge colours per status, shared by the admin list and Min side. */
export const orderStatusTones: Record<OrderStatusValue, { background: string; color: string }> = {
  received: { background: '#eaf0ff', color: '#1a3bc4' },
  processing: { background: '#fff4dc', color: '#8a5300' },
  'on-hold': { background: '#f1f2f4', color: '#3d4859' },
  shipped: { background: '#e3f1ff', color: '#0b5394' },
  delivered: { background: '#e7f3ee', color: '#0f4d38' },
  cancelled: { background: '#fdecea', color: '#a32016' },
  refunded: { background: '#f3e8ff', color: '#5b2c91' },
}

export const statusLabel = (value?: string | null): string =>
  orderStatuses.find((status) => status.value === value)?.label ?? value ?? 'Ukjent'

export const deliveryMethodOptions = [
  { label: 'Hjemlevering på kvelden', value: 'home-evening' },
  { label: 'Hent på hentested', value: 'pickup-point' },
  { label: 'Ekspress før kl. 12', value: 'express' },
  { label: 'Hent i butikk', value: 'store' },
]

export const carrierOptions = [
  { label: 'Posten', value: 'posten' },
  { label: 'Bring', value: 'bring' },
  { label: 'Porterbuddy', value: 'porterbuddy' },
  { label: 'Hylla butikk', value: 'store' },
]

export const paymentMethodOptions = [
  { label: 'Vipps', value: 'vipps' },
  { label: 'Kort', value: 'card' },
  { label: 'Klarna', value: 'klarna' },
]

export const paymentStatusOptions = [
  { label: 'Venter', value: 'pending' },
  { label: 'Reservert', value: 'authorized' },
  { label: 'Betalt', value: 'paid' },
  { label: 'Annullert', value: 'voided' },
  { label: 'Refundert', value: 'refunded' },
]

export const noteTypeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Privat notat', value: 'private' },
  { label: 'Notat til kunde', value: 'customer' },
]

export const VAT_RATE = 0.25
