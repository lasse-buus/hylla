import assert from 'node:assert/strict'

import config from '@payload-config'
import { getPayload } from 'payload'

import { getAccountOrder, getAccountOrders, orderProgress, parseOrderFilter, returnDeadline } from '@/lib/account'
import { DEMO_ACCOUNT_EMAIL } from '@/lib/demoAccount'

// Progress steps: Mottatt → Behandles → Sendt → Levert; cancelled and refunded orders are closed.
const shipped = orderProgress({ status: 'shipped' })
assert.equal(shipped.stage, 2)
assert.deepEqual(
  shipped.steps.map((step) => step.state),
  ['done', 'done', 'current', 'todo'],
)
assert.equal(orderProgress({ status: 'on-hold' }).stage, 1)
assert.equal(orderProgress({ status: 'refunded' }).stage, -1)
assert.ok(orderProgress({ status: 'refunded' }).steps.every((step) => step.state === 'todo'))

// 30 days of open purchase from delivery.
assert.notEqual(returnDeadline('2026-10-01T12:00:00Z', new Date('2026-10-31T11:00:00Z')), null)
assert.equal(returnDeadline('2026-10-01T12:00:00Z', new Date('2026-11-01T00:00:00Z')), null)
assert.equal(returnDeadline(null, new Date()), null)

assert.equal(parseOrderFilter('x'), 'alle')
assert.equal(parseOrderFilter('pagaende'), 'pagaende')

// Visibility: Lasse's seeded orders, plus checkout orders this browser placed, and nothing else.
const payload = await getPayload({ config })
const lasse = (await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, depth: 0 })).docs[0]
const product = (await payload.find({ collection: 'products', where: { slug: { equals: 'klang-mini' } }, depth: 0 })).docs[0]
// Cancelled, so the test orders don't hold stock.
const orderData = { status: 'cancelled' as const, placedVia: 'checkout' as const, items: [{ product: product.id, quantity: 1 }] }
const visitorOrder = await payload.create({ collection: 'orders', data: { ...orderData, customerAccount: lasse.id }, depth: 0 })
const guestOrder = await payload.create({ collection: 'orders', data: orderData, depth: 0 })

try {
  const customerID = lasse.id
  assert.equal((await getAccountOrders({ customerID, checkoutOrderIDs: [] })).length, 5, 'seeded only')
  assert.equal((await getAccountOrders({ customerID, checkoutOrderIDs: [visitorOrder.id] })).length, 6, 'plus own checkout order')
  assert.equal((await getAccountOrders({ customerID, checkoutOrderIDs: [999999] })).length, 5, 'deleted order IDs are ignored')
  assert.equal((await getAccountOrders({ customerID, checkoutOrderIDs: [guestOrder.id] })).length, 5, 'guest orders never show')

  assert.equal(
    await getAccountOrder({ customerID, checkoutOrderIDs: [], orderNumber: visitorOrder.orderNumber! }),
    null,
    "another browser's order",
  )
  assert.equal(
    await getAccountOrder({ customerID, checkoutOrderIDs: [guestOrder.id], orderNumber: guestOrder.orderNumber! }),
    null,
    'guest order',
  )
  const own = await getAccountOrder({ customerID, checkoutOrderIDs: [visitorOrder.id], orderNumber: visitorOrder.orderNumber! })
  assert.equal(own?.number, visitorOrder.orderNumber)
  assert.ok(own?.events.every((event) => !event.text.includes('Privat')))
} finally {
  await payload.delete({ collection: 'orders', where: { id: { in: [visitorOrder.id, guestOrder.id] } } })
}
