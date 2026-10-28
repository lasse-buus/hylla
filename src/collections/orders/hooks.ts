import type { CollectionBeforeChangeHook, PayloadRequest } from 'payload'

import { deliveryMethodsOf, type DeliveryMethodSetting } from '@/globals/StoreSettings'

import { releasedStockStatuses, statusLabel, VAT_RATE } from './constants'

type Relation = number | string | { id: number | string } | null | undefined

type OrderItem = {
  compareAtPrice?: number | null
  id?: string | null
  lineTotal?: number | null
  product?: Relation
  quantity?: number | null
  sku?: string | null
  title?: string | null
  unitPrice?: number | null
  variant?: Relation
  variantLabel?: string | null
}

type OrderService = { label?: string | null; price?: number | null }

type OrderNote = {
  author?: string | null
  createdAt?: string | null
  message?: string | null
  type?: string | null
}

type OrderData = {
  customer?: { email?: string | null; firstName?: string | null; lastName?: string | null }
  discount?: number | null
  itemCount?: number | null
  items?: OrderItem[] | null
  notes?: OrderNote[] | null
  orderNumber?: number | null
  payment?: {
    method?: string | null
    paidAt?: string | null
    refundAmount?: number | null
    refundedAt?: string | null
    status?: string | null
  }
  placedAt?: string | null
  services?: OrderService[] | null
  shipping?: {
    carrier?: string | null
    deliveredAt?: string | null
    label?: string | null
    manualPrice?: boolean | null
    method?: string | null
    price?: number | null
    shippedAt?: string | null
    trackingNumber?: string | null
  }
  status?: string | null
  stockReserved?: boolean | null
  title?: string | null
  total?: number | null
  totals?: {
    discount?: number | null
    savings?: number | null
    shipping?: number | null
    subtotal?: number | null
    vat?: number | null
  }
}

export type OrderHookContext = {
  /** Set by the demo seed so generated orders don't get a system note for every field. */
  isSeeding?: boolean
}

const relationID = (value: Relation): number | string | undefined => {
  if (value === null || value === undefined) return undefined
  return typeof value === 'object' ? value.id : value
}

const now = () => new Date().toISOString()

const actorName = (req: PayloadRequest): string => {
  const user = req.user as { email?: string; name?: string } | null
  return user?.name || user?.email || 'System'
}

/**
 * Keeps an order consistent whenever it is created or edited in the admin:
 * assigns the order number, snapshots product data on new lines, recalculates totals,
 * logs status changes as notes and keeps product stock in sync with the order lines.
 */
export const orderBeforeChange: CollectionBeforeChangeHook = async ({
  context,
  data,
  operation,
  originalDoc,
  req,
}) => {
  const order = data as OrderData
  const previous = (originalDoc ?? {}) as OrderData
  const hookContext = context as OrderHookContext
  const notes: OrderNote[] = [...(order.notes ?? previous.notes ?? [])]

  const addNote = (message: string, type = 'system') => {
    notes.push({ author: type === 'system' ? 'System' : actorName(req), createdAt: now(), message, type })
  }

  if (operation === 'create' && !order.orderNumber) {
    const latest = await req.payload.find({
      collection: 'orders',
      depth: 0,
      limit: 1,
      req,
      select: { orderNumber: true },
      sort: '-orderNumber',
    })
    const latestNumber = (latest.docs[0] as OrderData | undefined)?.orderNumber ?? 10000
    order.orderNumber = latestNumber + 1
  }

  if (!order.placedAt && !previous.placedAt) order.placedAt = now()

  const items = await snapshotItems(order.items ?? previous.items ?? [], req)
  order.items = items

  const status = order.status ?? previous.status ?? 'received'
  const shipping = { ...(previous.shipping ?? {}), ...(order.shipping ?? {}) }
  const payment = { ...(previous.payment ?? {}), ...(order.payment ?? {}) }

  // Totals
  const productSubtotal = items.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0)
  const services = order.services ?? previous.services ?? []
  const serviceTotal = services.reduce((sum, service) => sum + (service.price ?? 0), 0)
  const savings = items.reduce((sum, item) => {
    const compareAt = item.compareAtPrice ?? 0
    const unit = item.unitPrice ?? 0
    return compareAt > unit ? sum + (compareAt - unit) * (item.quantity ?? 1) : sum
  }, 0)
  const subtotal = productSubtotal + serviceTotal
  const discount = Math.max(0, order.discount ?? previous.discount ?? 0)

  if (shipping.method && !shipping.manualPrice) {
    const method = await findDeliveryMethod(shipping.method, req)
    if (method) {
      const isFree = Boolean(method.freeAboveThreshold) && subtotal >= method.threshold
      shipping.price = isFree ? 0 : method.price
      shipping.label = shipping.label || method.label
      shipping.carrier = shipping.carrier || method.carrier
    }
  }

  const shippingPrice = shipping.price ?? 0
  const total = Math.max(0, subtotal - discount + shippingPrice)

  order.totals = {
    discount,
    savings,
    shipping: shippingPrice,
    subtotal,
    vat: Math.round(total - total / (1 + VAT_RATE)),
  }
  order.total = total
  order.itemCount = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0)

  // Status changes and their side effects
  const previousStatus = previous.status
  if (operation === 'create' && !hookContext.isSeeding) {
    addNote(`Ordren ble opprettet med status «${statusLabel(status)}».`)
  }

  if (operation === 'update' && previousStatus && previousStatus !== status) {
    addNote(`Status endret fra «${statusLabel(previousStatus)}» til «${statusLabel(status)}» av ${actorName(req)}.`)

    if (status === 'shipped') {
      shipping.shippedAt = shipping.shippedAt || now()
      if (payment.status === 'authorized' || payment.status === 'pending') {
        payment.status = 'paid'
        payment.paidAt = payment.paidAt || now()
        addNote('Reservert beløp er trukket fra kunden ved forsendelse.')
      }
      if (shipping.trackingNumber) addNote(`Sendt med sporingsnummer ${shipping.trackingNumber}.`, 'customer')
    }

    if (status === 'delivered') {
      shipping.deliveredAt = shipping.deliveredAt || now()
    }

    if (status === 'cancelled') {
      if (payment.status === 'paid') {
        addNote('Ordren er kansellert, men betalingen er fortsatt registrert som betalt. Husk å refundere.')
      } else {
        payment.status = 'voided'
      }
    }

    if (status === 'refunded') {
      payment.status = 'refunded'
      payment.refundedAt = payment.refundedAt || now()
      payment.refundAmount = payment.refundAmount ?? total
      addNote(`Refundert ${formatKroner(payment.refundAmount ?? total)} til kunden.`)
    }
  }

  // Stock
  const shouldReserve = !releasedStockStatuses.includes(status as (typeof releasedStockStatuses)[number])
  const previousReservation = previous.stockReserved ? quantitiesByStockKey(previous.items ?? []) : {}
  const nextReservation = shouldReserve ? quantitiesByStockKey(items) : {}
  const stockMessages = await applyStockChanges(previousReservation, nextReservation, items, req)

  if (operation === 'update') stockMessages.forEach((message) => addNote(message))

  order.stockReserved = shouldReserve
  order.shipping = shipping
  order.payment = payment
  order.status = status

  // Rows added by an editor in the admin get an author and timestamp.
  order.notes = notes.map((note) => ({
    ...note,
    author: note.author || actorName(req),
    createdAt: note.createdAt || now(),
    type: note.type || 'private',
  }))

  const customer = { ...(previous.customer ?? {}), ...(order.customer ?? {}) }
  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ')
  order.title = `#${order.orderNumber ?? previous.orderNumber} – ${customerName || customer.email || 'Gjest'}`

  return order
}

async function snapshotItems(items: OrderItem[], req: PayloadRequest): Promise<OrderItem[]> {
  return Promise.all(
    items.map(async (item) => {
      const productID = relationID(item.product)
      const variantID = relationID(item.variant)
      const next: OrderItem = { ...item, quantity: Math.max(1, item.quantity ?? 1) }

      const needsSnapshot = productID && (!next.title || next.unitPrice === null || next.unitPrice === undefined)

      if (needsSnapshot) {
        const product = await req.payload.findByID({ collection: 'products', depth: 0, id: productID, req })

        let price = product.priceInNOK ?? undefined
        let compareAt = product.compareAtPrice ?? undefined
        let sku = product.sku ?? undefined
        let variantLabel: string | undefined

        if (variantID) {
          const variant = await req.payload.findByID({ collection: 'variants', depth: 1, id: variantID, req })
          price = variant.priceInNOK ?? price
          compareAt = variant.compareAtPrice ?? compareAt
          sku = variant.sku ?? sku
          variantLabel = (variant.options ?? [])
            .map((option) => (typeof option === 'object' ? option.label : undefined))
            .filter(Boolean)
            .join(' · ')
        }

        next.title = next.title || product.title
        next.sku = next.sku || sku
        next.variantLabel = next.variantLabel || variantLabel
        next.unitPrice = next.unitPrice ?? price ?? 0
        next.compareAtPrice = next.compareAtPrice ?? compareAt
      }

      next.lineTotal = (next.unitPrice ?? 0) * (next.quantity ?? 1)
      return next
    }),
  )
}

const stockKey = (item: OrderItem): string | undefined => {
  const variantID = relationID(item.variant)
  if (variantID) return `variants:${variantID}`
  const productID = relationID(item.product)
  return productID ? `products:${productID}` : undefined
}

function quantitiesByStockKey(items: OrderItem[]): Record<string, number> {
  return items.reduce<Record<string, number>>((acc, item) => {
    const key = stockKey(item)
    if (key) acc[key] = (acc[key] ?? 0) + (item.quantity ?? 1)
    return acc
  }, {})
}

async function applyStockChanges(
  previous: Record<string, number>,
  next: Record<string, number>,
  items: OrderItem[],
  req: PayloadRequest,
): Promise<string[]> {
  const keys = new Set([...Object.keys(previous), ...Object.keys(next)])
  const messages: string[] = []

  for (const key of keys) {
    const change = (next[key] ?? 0) - (previous[key] ?? 0)
    if (change === 0) continue

    const [collection, id] = key.split(':') as ['products' | 'variants', string]
    const doc = (await req.payload.findByID({ collection, depth: 0, id, req })) as {
      inventory?: number | null
    }
    const current = doc.inventory ?? 0
    const updated = Math.max(0, current - change)

    await req.payload.update({
      collection,
      data: { inventory: updated },
      depth: 0,
      id,
      req,
    })

    const name =
      items.find((item) => stockKey(item) === key)?.title ?? (collection === 'variants' ? 'Variant' : 'Produkt')
    messages.push(
      change > 0
        ? `Lager redusert for ${name}: ${current} → ${updated}.`
        : `Lager økt for ${name}: ${current} → ${updated}.`,
    )
  }

  return messages
}

async function findDeliveryMethod(
  method: string,
  req: PayloadRequest,
): Promise<(DeliveryMethodSetting & { threshold: number }) | undefined> {
  const settings = (await req.payload.findGlobal({ slug: 'store-settings', depth: 0, req })) as {
    deliveryMethods?: DeliveryMethodSetting[] | null
    freeShippingThreshold?: number | null
  }
  const found = deliveryMethodsOf(settings).find((candidate) => candidate.method === method)

  return found ? { ...found, threshold: settings.freeShippingThreshold ?? 1000 } : undefined
}

export const formatKroner = (amount: number): string =>
  `${new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 }).format(amount)},–`
