import { fakerNB_NO as faker } from '@faker-js/faker'

import type { OrderStatusValue } from '@/collections/orders/constants'

import { demoCustomer } from '@/lib/demoCustomer'

export type CatalogEntry = {
  productID: number | string
  slug: string
  title: string
  sku: string
  price: number
  compareAtPrice?: number
  variants?: { variantID: number | string; label: string; sku: string; price: number; compareAtPrice?: number }[]
}

const DAY = 24 * 60 * 60 * 1000

const pickWeighted = <T,>(options: [T, number][]): T => {
  const total = options.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = Math.random() * total
  for (const [value, weight] of options) {
    roll -= weight
    if (roll <= 0) return value
  }
  return options[options.length - 1][0]
}

const statusForAge = (ageInDays: number): OrderStatusValue => {
  if (ageInDays < 1) return pickWeighted([['received', 7], ['processing', 3]])
  if (ageInDays < 4) return pickWeighted([['processing', 4], ['shipped', 4], ['on-hold', 1], ['received', 1]])
  if (ageInDays < 10) return pickWeighted([['shipped', 6], ['delivered', 3], ['cancelled', 1]])
  return pickWeighted([['delivered', 16], ['cancelled', 2], ['refunded', 1], ['shipped', 1]])
}

const deliveryFor = () =>
  pickWeighted([
    [{ method: 'home-evening', carrier: 'porterbuddy' }, 5],
    [{ method: 'pickup-point', carrier: 'posten' }, 4],
    [{ method: 'express', carrier: 'bring' }, 1],
    [{ method: 'store', carrier: 'store' }, 2],
  ])

const digits = (length: number) => faker.string.numeric({ length, allowLeadingZeros: true })

const paymentFor = (method: string) => {
  if (method === 'card') {
    return { reference: `ch_${faker.string.alphanumeric({ length: 18, casing: 'lower' })}`, cardLast4: digits(4) }
  }
  if (method === 'klarna') return { reference: `KL-${digits(10)}` }
  return { reference: `VIPPS-${digits(9)}` }
}

/**
 * Builds fictional orders spread across the last `days` days. Every person,
 * address and payment reference is generated – nothing here is real.
 */
export function buildDemoOrders(catalog: CatalogEntry[], count = 40, days = 30) {
  const now = Date.now()

  return Array.from({ length: count }, (_, index) => {
    const ageInDays = index < 4 ? Math.random() * 0.9 : Math.random() * days
    const placedAt = new Date(now - ageInDays * DAY - Math.random() * 3 * 60 * 60 * 1000)
    const status = statusForAge(ageInDays)

    const { address, ...person } = demoCustomer(faker.number.int({ max: 2 ** 31 }))
    const lineCount = pickWeighted([[1, 6], [2, 3], [3, 1]])
    const chosen = faker.helpers.arrayElements(catalog, lineCount)

    const items = chosen.map((entry) => {
      const variant = entry.variants?.length ? faker.helpers.arrayElement(entry.variants) : undefined
      return {
        product: entry.productID,
        variant: variant?.variantID,
        title: entry.title,
        variantLabel: variant?.label,
        sku: variant?.sku ?? entry.sku,
        unitPrice: variant?.price ?? entry.price,
        compareAtPrice: variant?.compareAtPrice ?? entry.compareAtPrice,
        quantity: entry.price < 1500 ? pickWeighted([[1, 8], [2, 2]]) : 1,
      }
    })

    const delivery = deliveryFor()
    const paymentMethod = pickWeighted([['vipps', 5], ['card', 4], ['klarna', 2]])
    const paymentDetails = paymentFor(paymentMethod)
    const minutesAfter = (minutes: number) => new Date(placedAt.getTime() + minutes * 60 * 1000).toISOString()

    const shippedAt = ['shipped', 'delivered', 'refunded'].includes(status) ? minutesAfter(60 * 20) : undefined
    const deliveredAt = ['delivered', 'refunded'].includes(status) ? minutesAfter(60 * 46) : undefined
    const trackingNumber = shippedAt && delivery.method !== 'store' ? `70${digits(15)}` : undefined

    const paymentStatus =
      status === 'refunded' ? 'refunded' : status === 'cancelled' ? 'voided' : status === 'received' ? 'authorized' : 'paid'

    const notes = [
      { type: 'system', author: 'System', createdAt: placedAt.toISOString(), message: 'Ordren ble lagt inn i nettbutikken.' },
      {
        type: 'system',
        author: 'System',
        createdAt: minutesAfter(1),
        message:
          paymentStatus === 'authorized'
            ? `Betalingen er reservert hos ${paymentMethod === 'card' ? 'kortutsteder' : paymentMethod === 'klarna' ? 'Klarna' : 'Vipps'}.`
            : `Betaling mottatt med ${paymentMethod === 'card' ? 'kort' : paymentMethod === 'klarna' ? 'Klarna' : 'Vipps'} (${paymentDetails.reference}).`,
      },
    ]

    if (status !== 'received' && status !== 'cancelled') {
      notes.push({ type: 'system', author: 'Lagerteamet', createdAt: minutesAfter(90), message: 'Ordren er plukket og pakket.' })
    }
    if (status === 'on-hold') {
      notes.push({ type: 'private', author: 'Kundeservice', createdAt: minutesAfter(120), message: 'Venter på svar fra kunden om leveringsadresse.' })
    }
    if (shippedAt) {
      notes.push({
        type: 'customer',
        author: 'System',
        createdAt: shippedAt,
        message: trackingNumber ? `Sendt med sporingsnummer ${trackingNumber}.` : 'Ordren er klar til henting i butikk.',
      })
    }
    if (deliveredAt) {
      notes.push({ type: 'system', author: 'System', createdAt: deliveredAt, message: 'Levert til kunden.' })
    }
    if (status === 'cancelled') {
      notes.push({ type: 'private', author: 'Kundeservice', createdAt: minutesAfter(45), message: 'Kunden ba om å kansellere ordren før den ble sendt.' })
    }
    if (status === 'refunded') {
      notes.push({ type: 'system', author: 'System', createdAt: minutesAfter(60 * 24 * 5), message: 'Varen kom i retur innenfor åpent kjøp. Beløpet er refundert.' })
    }

    notes.sort((a, b) => a.createdAt.localeCompare(b.createdAt))

    const sameBilling = Math.random() > 0.15

    return {
      status,
      placedVia: 'seed' as const,
      placedAt: placedAt.toISOString(),
      customer: { firstName: person.firstName, lastName: person.lastName, email: person.email, phone: person.phone },
      shippingAddress: address,
      billingSameAsShipping: sameBilling,
      billingAddress: sameBilling
        ? undefined
        : {
            addressLine: faker.location.streetAddress(),
            postalCode: faker.location.zipCode('####'),
            city: faker.location.city(),
            country: 'Norge',
          },
      items,
      services: Math.random() > 0.85 ? [{ label: 'Oppsett og installasjon', price: 499 }] : [],
      discount: Math.random() > 0.9 ? 200 : 0,
      shipping: { ...delivery, trackingNumber, shippedAt, deliveredAt },
      payment: {
        method: paymentMethod,
        status: paymentStatus,
        ...paymentDetails,
        paidAt: paymentStatus === 'authorized' ? undefined : minutesAfter(1),
        refundedAt: status === 'refunded' ? minutesAfter(60 * 24 * 5) : undefined,
      },
      customerNote: Math.random() > 0.85 ? 'Kan pakken settes ved døren hvis jeg ikke er hjemme?' : undefined,
      notes,
    }
  })
}
