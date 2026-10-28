import assert from 'node:assert/strict'

import config from '@payload-config'
import { getPayload } from 'payload'

import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } from '@/lib/demoAccount'

// Runs against a freshly seeded database (`pnpm seed`).
const payload = await getPayload({ config })

const { docs } = await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, depth: 0 })
const lasse = docs[0]
assert.ok(lasse, 'Lasse exists')
assert.deepEqual(lasse.roles, ['customer'])
assert.equal(lasse.addresses?.length, 2, 'two addresses')
assert.equal(lasse.addresses?.filter((address) => address.isDefault).length, 1, 'one default address')

const login = await payload.login({ collection: 'users', data: { email: DEMO_ACCOUNT_EMAIL, password: DEMO_ACCOUNT_PASSWORD } })
assert.equal(login.user?.id, lasse.id, 'demo password works')

const orders = await payload.find({
  collection: 'orders',
  where: { customerAccount: { equals: lasse.id }, placedVia: { equals: 'seed' } },
  depth: 0,
  limit: 50,
})
assert.equal(orders.docs.length, 5, 'five seeded orders')
assert.deepEqual(
  orders.docs.map((order) => order.status).sort(),
  ['delivered', 'delivered', 'processing', 'refunded', 'shipped'],
)
