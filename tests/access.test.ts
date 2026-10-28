import assert from 'node:assert/strict'

import config from '@payload-config'
import { getPayload, type PayloadRequest } from 'payload'

import { ordersCollectionOverride } from '@/collections/orders'
import { Users } from '@/collections/Users'

const payload = await getPayload({ config })

// Customers can't change their own user record (Lasse's password is public).
const email = 'access-test@eksempel.no'
await payload.delete({ collection: 'users', where: { email: { equals: email } } })
const customer = await payload.create({
  collection: 'users',
  data: { email, password: 'test-passord-123', name: 'Access Test', roles: ['customer'] },
})
try {
  await assert.rejects(
    payload.update({ collection: 'users', id: customer.id, data: { name: 'Endret' }, overrideAccess: false, user: customer }),
    'customer updating own record',
  )
} finally {
  await payload.delete({ collection: 'users', id: customer.id })
}

// Customers never get into the admin panel.
const adminAccess = Users.access?.admin as (args: { req: PayloadRequest }) => boolean
assert.equal(adminAccess({ req: { user: { roles: ['customer'] } } as unknown as PayloadRequest }), false, 'admin access')

// Orders record where they came from.
const orders = await ordersCollectionOverride({ defaultCollection: { slug: 'orders', fields: [] } } as never)
const fieldNames = JSON.stringify(orders.fields)
assert.ok(fieldNames.includes('"name":"placedVia"'), 'orders.placedVia')

// With the public demo password, the API must not reveal other visitors' checkout orders.
const { DEMO_ACCOUNT_EMAIL } = await import('@/lib/demoAccount')
const lasse = (await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, depth: 0 })).docs[0]
const product = (await payload.find({ collection: 'products', limit: 1, depth: 0 })).docs[0]
const visitorOrder = await payload.create({
  collection: 'orders',
  data: { status: 'cancelled', placedVia: 'checkout', customerAccount: lasse.id, items: [{ product: product.id, quantity: 1 }] },
  depth: 0,
})
try {
  const visible = await payload.find({ collection: 'orders', overrideAccess: false, user: lasse, depth: 0, limit: 100 })
  assert.equal(visible.docs.some((order) => order.id === visitorOrder.id), false, "another visitor's checkout order via the API")
  assert.equal(visible.docs.length, 5, 'only the seeded history')
} finally {
  await payload.delete({ collection: 'orders', id: visitorOrder.id })
}
