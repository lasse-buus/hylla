import type { Payload } from 'payload'

import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } from '@/lib/demoAccount'

import type { CatalogEntry } from './demoOrders'

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR

const home = { addressLine: 'Storgata 12', postalCode: '0155', city: 'Oslo', country: 'Norge' }
const cabin = { addressLine: 'Fjellveien 4', postalCode: '3580', city: 'Geilo', country: 'Norge' }

type Note = { type: 'system' | 'customer'; message: string; hoursAfter: number }

type AccountOrder = {
  daysAgo: number
  status: 'processing' | 'shipped' | 'delivered' | 'refunded'
  slugs: string[]
  address: typeof home
  shipping: { method: string; carrier: string; trackingNumber?: string; shippedAfterHours?: number; deliveredAfterHours?: number }
  payment: { method: 'vipps' | 'card' | 'klarna'; status: 'authorized' | 'paid' | 'refunded'; reference: string; cardLast4?: string }
  notes: Note[]
}

/** Lasse's order history, shaped after the "MinSide" artboard: one on its way, one being packed, two delivered, one returned. */
const accountOrders: AccountOrder[] = [
  {
    daysAgo: 1.5,
    status: 'shipped',
    slugs: ['vektor-core-g5', 'vektor-pulse-27'],
    address: home,
    shipping: { method: 'home-evening', carrier: 'porterbuddy', trackingNumber: '70412839012745562', shippedAfterHours: 19 },
    payment: { method: 'vipps', status: 'paid', reference: 'VIPPS-482019377' },
    notes: [
      { type: 'system', message: 'Betaling mottatt med Vipps.', hoursAfter: 0.02 },
      { type: 'system', message: 'Ordren er plukket og pakket.', hoursAfter: 12.5 },
      { type: 'customer', message: 'Ordren er sendt med Porterbuddy.', hoursAfter: 19 },
    ],
  },
  {
    daysAgo: 0.2,
    status: 'processing',
    slugs: ['klang-mini'],
    address: home,
    shipping: { method: 'store', carrier: 'store' },
    payment: { method: 'card', status: 'authorized', reference: 'ch_3nf81kq0pz7xw2cv5m', cardLast4: '4242' },
    notes: [{ type: 'system', message: 'Betalingen er reservert hos kortutsteder.', hoursAfter: 0.02 }],
  },
  {
    daysAgo: 16,
    status: 'delivered',
    slugs: ['klang-arena-h7', 'vektor-glide-m2'],
    address: home,
    shipping: {
      method: 'pickup-point',
      carrier: 'posten',
      trackingNumber: '70398127734501928',
      shippedAfterHours: 22,
      deliveredAfterHours: 52,
    },
    payment: { method: 'card', status: 'paid', reference: 'ch_8kq2m1vx0tz4nd7p3b', cardLast4: '4242' },
    notes: [
      { type: 'system', message: 'Betaling mottatt med kort.', hoursAfter: 0.02 },
      { type: 'customer', message: 'Ordren er sendt med Posten.', hoursAfter: 22 },
      { type: 'customer', message: 'Pakken er klar på hentestedet.', hoursAfter: 43 },
      { type: 'system', message: 'Pakken er hentet.', hoursAfter: 52 },
    ],
  },
  {
    daysAgo: 40,
    status: 'delivered',
    slugs: ['heim-barista'],
    address: home,
    shipping: { method: 'store', carrier: 'store', shippedAfterHours: 1.5, deliveredAfterHours: 5.5 },
    payment: { method: 'klarna', status: 'paid', reference: 'KL-4417730092' },
    notes: [
      { type: 'system', message: 'Betaling mottatt med Klarna.', hoursAfter: 0.02 },
      { type: 'customer', message: 'Klar til henting i Hylla Oslo City.', hoursAfter: 1.5 },
      { type: 'system', message: 'Hentet i Hylla Oslo City.', hoursAfter: 5.5 },
    ],
  },
  {
    daysAgo: 56,
    status: 'refunded',
    slugs: ['nova-pro-kontroller'],
    address: cabin,
    shipping: {
      method: 'pickup-point',
      carrier: 'posten',
      trackingNumber: '70370011829364401',
      shippedAfterHours: 20,
      deliveredAfterHours: 43,
    },
    payment: { method: 'vipps', status: 'refunded', reference: 'VIPPS-401883210' },
    notes: [
      { type: 'system', message: 'Betaling mottatt med Vipps.', hoursAfter: 0.02 },
      { type: 'customer', message: 'Ordren er sendt med Posten.', hoursAfter: 20 },
      { type: 'system', message: 'Pakken er hentet.', hoursAfter: 43 },
      { type: 'system', message: 'Returen er mottatt.', hoursAfter: 13 * 24 },
      { type: 'customer', message: 'Beløpet er refundert til Vipps.', hoursAfter: 14 * 24 },
    ],
  },
]

/**
 * Creates (or resets) the demo customer Lasse Nielsen and his order history. The user is upserted by
 * email so his ID stays the same across nightly resets, and anything a visitor might have changed is put back.
 */
export async function seedDemoAccount(payload: Payload, catalog: CatalogEntry[]): Promise<{ userID: number; orders: number }> {
  const data = {
    email: DEMO_ACCOUNT_EMAIL,
    password: DEMO_ACCOUNT_PASSWORD,
    name: 'Lasse Nielsen',
    roles: ['customer' as const],
    phone: '91234567',
    customerSince: '2024-03-01T12:00:00.000Z',
    addresses: [
      { label: 'Hjem', ...home, isDefault: true },
      { label: 'Hytta', ...cabin, isDefault: false },
    ].map(({ country: _country, ...address }) => address),
    preferences: {
      newsletter: true,
      smsOffers: false,
      deliverySms: true,
      backInStock: false,
      interests: ['gaming' as const, 'pc-og-data' as const],
    },
  }

  const existing = await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, limit: 1, depth: 0 })
  const user = existing.docs[0]
    ? await payload.update({ collection: 'users', id: existing.docs[0].id, data, depth: 0 })
    : await payload.create({ collection: 'users', data, depth: 0 })

  const now = Date.now()
  for (const order of accountOrders) {
    const placedAt = now - order.daysAgo * DAY
    const at = (hours?: number) => (hours === undefined ? undefined : new Date(placedAt + hours * HOUR).toISOString())

    const items = order.slugs.map((slug) => {
      const entry = catalog.find((candidate) => candidate.slug === slug)
      if (!entry) throw new Error(`Seed: fant ikke produktet «${slug}» for demokunden`)
      return { product: entry.productID as number, variant: entry.variants?.[0]?.variantID as number | undefined, quantity: 1 }
    })

    await payload.create({
      collection: 'orders',
      context: { isSeeding: true },
      depth: 0,
      data: {
        status: order.status,
        placedVia: 'seed',
        customerAccount: user.id,
        placedAt: new Date(placedAt).toISOString(),
        customer: { firstName: 'Lasse', lastName: 'Nielsen', email: DEMO_ACCOUNT_EMAIL, phone: data.phone },
        shippingAddress: order.address,
        billingSameAsShipping: true,
        items,
        shipping: {
          method: order.shipping.method as never,
          carrier: order.shipping.carrier as never,
          trackingNumber: order.shipping.trackingNumber,
          shippedAt: at(order.shipping.shippedAfterHours),
          deliveredAt: at(order.shipping.deliveredAfterHours),
        },
        payment: {
          method: order.payment.method,
          status: order.payment.status,
          reference: order.payment.reference,
          cardLast4: order.payment.cardLast4,
          paidAt: order.payment.status === 'authorized' ? undefined : at(0.02),
          refundedAt: order.payment.status === 'refunded' ? at(14 * 24) : undefined,
        },
        notes: [
          { type: 'system', author: 'System', createdAt: at(0), message: 'Ordren er mottatt.' },
          ...order.notes.map((note) => ({ type: note.type, author: 'System', createdAt: at(note.hoursAfter), message: note.message })),
        ],
      },
    })
  }

  return { userID: user.id, orders: accountOrders.length }
}
