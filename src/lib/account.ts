import type { Media, Order, Product } from '@/payload-types'

import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'

import {
  carrierOptions,
  deliveryMethodOptions,
  paymentMethodOptions,
  paymentStatusOptions,
  statusLabel,
} from '@/collections/orders/constants'

import { formatDateTime, formatPrice, formatShortDate } from './format'
import { type ImageData, toImage } from './media'
import { accountOrderIDs } from './orderReceipt'
import { routes } from './routes'

type OrderStatus = Order['status']

const STEP_LABELS = ['Mottatt', 'Behandles', 'Sendt', 'Levert'] as const
const OPEN_PURCHASE_DAYS = 30
const DAY = 24 * 60 * 60 * 1000

const stageByStatus: Record<OrderStatus, -1 | 0 | 1 | 2 | 3> = {
  received: 0,
  processing: 1,
  'on-hold': 1,
  shipped: 2,
  delivered: 3,
  cancelled: -1,
  refunded: -1,
}

export type ProgressStep = {
  label: (typeof STEP_LABELS)[number]
  state: 'done' | 'current' | 'todo'
  when: string | null
}

/** Mottatt → Behandles → Sendt → Levert. Cancelled and refunded orders are closed (stage -1, no step reached). */
export function orderProgress(order: Pick<Order, 'status'> & Partial<Pick<Order, 'placedAt' | 'shipping'>>) {
  const stage = stageByStatus[order.status]
  const dates = [order.placedAt, null, order.shipping?.shippedAt, order.shipping?.deliveredAt]

  const steps: ProgressStep[] = STEP_LABELS.map((label, index) => ({
    label,
    state: index < stage ? 'done' : index === stage ? 'current' : 'todo',
    when: index <= stage && dates[index] ? formatShortDate(dates[index]!) : null,
  }))
  return { stage, steps }
}

/** The last day of open purchase, or null once it has passed (or the order isn't delivered). */
export function returnDeadline(deliveredAt: string | null | undefined, now: Date): Date | null {
  if (!deliveredAt) return null
  const deadline = new Date(new Date(deliveredAt).getTime() + OPEN_PURCHASE_DAYS * DAY)
  return now <= deadline ? deadline : null
}

export const orderFilters = [
  { value: 'alle', label: 'Alle' },
  { value: 'pagaende', label: 'Pågående' },
  { value: 'fullforte', label: 'Fullførte' },
] as const

export type OrderFilter = (typeof orderFilters)[number]['value']

export const parseOrderFilter = (value: unknown): OrderFilter =>
  orderFilters.find((filter) => filter.value === value)?.value ?? 'alle'

export const matchesFilter = (stage: number, filter: OrderFilter) =>
  filter === 'pagaende' ? stage >= 0 && stage < 3 : filter === 'fullforte' ? stage === 3 || stage === -1 : true

export type AccountOrderSummary = {
  id: number
  number: number
  placedAt: string
  status: OrderStatus
  statusLabel: string
  statusLine: string
  stage: -1 | 0 | 1 | 2 | 3
  itemCount: number
  itemText: string
  /** "Vektor Core G5 gaming-PC og 1 vare til" */
  itemsHeadline: string
  thumbnails: ImageData[]
  total: number
}

export type AccountOrderDetail = AccountOrderSummary & {
  steps: ProgressStep[]
  closedText: string | null
  items: {
    id: string
    title: string
    href: string | null
    image: ImageData | null
    meta: string
    unitPrice: number
    quantity: number
    lineTotal: number
  }[]
  totals: { items: number; savings: number; discount: number; shipping: number; vat: number; total: number }
  delivery: { method: string; carrier: string | null; trackingNumber: string | null; canTrack: boolean }
  address: { name: string; lines: string[] }
  payment: { method: string; status: string; reference: string | null; isRefunded: boolean }
  events: { text: string; when: string }[]
  returnDeadline: string | null
}

const labelOf = (options: readonly { label: string; value: string }[], value: string | null | undefined) =>
  options.find((option) => option.value === value)?.label ?? null

const asDoc = <T extends object>(value: unknown): T | null => (value && typeof value === 'object' ? (value as T) : null)

const itemText = (count: number) => `${count} ${count === 1 ? 'vare' : 'varer'}`

function itemsHeadline(titles: string[]): string {
  const others = titles.length - 1
  return others > 0 ? `${titles[0]} og ${itemText(others)} til` : (titles[0] ?? '')
}

function statusLine(order: Order, now: Date): string {
  const shipping = order.shipping ?? {}
  const carrier = labelOf(carrierOptions, shipping.carrier)
  switch (order.status) {
    case 'received':
    case 'processing':
      return 'Vi gjør klar ordren din'
    case 'on-hold':
      return 'Venter på avklaring. Vi tar kontakt med deg.'
    case 'shipped':
      return carrier ? `Sendt med ${carrier}` : 'Sendt'
    case 'delivered': {
      const deadline = returnDeadline(shipping.deliveredAt, now)
      const delivered = shipping.deliveredAt ? formatShortDate(shipping.deliveredAt) : ''
      const prefix = shipping.method === 'store' ? 'Hentet i butikk' : 'Levert'
      return [`${prefix} ${delivered}`.trim(), deadline ? `åpent kjøp til ${formatShortDate(deadline)}` : null]
        .filter(Boolean)
        .join(' · ')
    }
    case 'refunded':
      return `Returnert · ${formatPrice(order.payment?.refundAmount ?? order.total ?? 0)} refundert`
    case 'cancelled':
      return 'Kansellert'
  }
}

function toSummary(order: Order, now: Date): AccountOrderSummary {
  const items = order.items ?? []
  const count = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  return {
    id: order.id,
    number: order.orderNumber ?? order.id,
    placedAt: order.placedAt ?? order.createdAt,
    status: order.status,
    statusLabel: statusLabel(order.status),
    statusLine: statusLine(order, now),
    stage: stageByStatus[order.status],
    itemCount: count,
    itemText: itemText(count),
    itemsHeadline: itemsHeadline(items.map((item) => item.title ?? asDoc<Product>(item.product)?.title ?? 'Vare')),
    thumbnails: items.flatMap((item) => {
      const image = toImage(asDoc<Media>(asDoc<Product>(item.product)?.gallery?.[0]), 'thumbnail')
      return image ? [image] : []
    }),
    total: order.total ?? 0,
  }
}

function toDetail(order: Order, now: Date): AccountOrderDetail {
  const { steps } = orderProgress(order)
  const shipping = order.shipping ?? {}
  const payment = order.payment ?? {}
  const address = order.shippingAddress ?? {}
  const totals = order.totals ?? {}
  const deadline = order.status === 'delivered' ? returnDeadline(shipping.deliveredAt, now) : null
  const paymentMethod = labelOf(paymentMethodOptions, payment.method) ?? 'Ukjent'

  return {
    ...toSummary(order, now),
    steps,
    closedText:
      order.status === 'refunded'
        ? `Varene ble returnert, og ${formatPrice(payment.refundAmount ?? order.total ?? 0)} er refundert til ${paymentMethod}.`
        : order.status === 'cancelled'
          ? 'Ordren er kansellert, og ingen penger er trukket.'
          : null,
    items: (order.items ?? []).map((item, index) => {
      const product = asDoc<Product>(item.product)
      return {
        id: item.id ?? String(index),
        title: item.title ?? product?.title ?? 'Vare',
        href: product?.slug ? routes.product(product.slug) : null,
        image: toImage(asDoc<Media>(product?.gallery?.[0]), 'thumbnail'),
        meta: [item.variantLabel, item.sku ? `Varenr. ${item.sku}` : null].filter(Boolean).join(' · '),
        unitPrice: item.unitPrice ?? 0,
        quantity: item.quantity ?? 1,
        lineTotal: item.lineTotal ?? 0,
      }
    }),
    totals: {
      items: (totals.subtotal ?? 0) + (totals.savings ?? 0),
      savings: totals.savings ?? 0,
      discount: totals.discount ?? 0,
      shipping: totals.shipping ?? 0,
      vat: totals.vat ?? 0,
      total: order.total ?? 0,
    },
    delivery: {
      method: shipping.label ?? labelOf(deliveryMethodOptions, shipping.method) ?? 'Levering',
      carrier: labelOf(carrierOptions, shipping.carrier),
      trackingNumber: shipping.trackingNumber ?? null,
      canTrack: order.status === 'shipped' && Boolean(shipping.trackingNumber),
    },
    address: {
      name: [order.customer?.firstName, order.customer?.lastName].filter(Boolean).join(' '),
      lines: [address.addressLine, [address.postalCode, address.city].filter(Boolean).join(' ')].filter(
        (line): line is string => Boolean(line),
      ),
    },
    payment: {
      method: payment.cardLast4 ? `${paymentMethod} · ···· ${payment.cardLast4}` : paymentMethod,
      status: labelOf(paymentStatusOptions, payment.status) ?? '',
      reference: payment.reference ?? null,
      isRefunded: payment.status === 'refunded',
    },
    // Private notes are the shop's own; customers see system events and messages meant for them.
    events: (order.notes ?? [])
      .filter((note) => note.type !== 'private' && note.createdAt)
      .sort((a, b) => b.createdAt!.localeCompare(a.createdAt!))
      .map((note) => ({ text: note.message, when: formatDateTime(note.createdAt!) })),
    returnDeadline: deadline ? deadline.toISOString() : null,
  }
}

type Visibility = { customerID: number; checkoutOrderIDs: number[] }

/** Lasse's seeded history plus the checkout orders this browser placed; other visitors' orders stay hidden. */
const visibleTo = ({ customerID, checkoutOrderIDs }: Visibility): Where => ({
  and: [
    { customerAccount: { equals: customerID } },
    {
      or: [
        { placedVia: { equals: 'seed' } },
        ...(checkoutOrderIDs.length ? [{ id: { in: checkoutOrderIDs } }] : []),
      ],
    },
  ],
})

const populate = { products: { slug: true, title: true, gallery: true } } as const

export async function getAccountOrders(visibility: Visibility): Promise<AccountOrderSummary[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'orders',
    where: visibleTo(visibility),
    sort: '-placedAt',
    depth: 2,
    populate,
    limit: 100,
  })
  const now = new Date()
  return docs.map((order) => toSummary(order, now))
}

export async function getAccountOrder({
  orderNumber,
  ...visibility
}: Visibility & { orderNumber: number }): Promise<AccountOrderDetail | null> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'orders',
    where: { and: [visibleTo(visibility), { orderNumber: { equals: orderNumber } }] },
    depth: 2,
    populate,
    limit: 1,
  })
  return docs[0] ? toDetail(docs[0], new Date()) : null
}

/** The logged-in customer's visible orders for this browser, loaded once per request. */
export const getMyAccountOrders = cache(async (customerID: number) =>
  getAccountOrders({ customerID, checkoutOrderIDs: await accountOrderIDs() }),
)

export async function getMyAccountOrder(customerID: number, orderNumber: number) {
  return getAccountOrder({ customerID, checkoutOrderIDs: await accountOrderIDs(), orderNumber })
}
