import assert from 'node:assert/strict'

import config from '@payload-config'
import { getPayload } from 'payload'

import { DEMO_ACCOUNT_EMAIL } from '@/lib/demoAccount'
import { signValue } from '@/lib/signedValue'

const payload = await getPayload({ config })

// 1. Cookie logins only count when the request comes from the shop's own origin.
const admin = (await payload.find({ collection: 'users', where: { roles: { contains: 'admin' } }, limit: 1, depth: 0 })).docs[0]
assert.ok(admin, 'needs the seeded admin')
const adminWithPassword = await payload.update({ collection: 'users', id: admin.id, data: { password: 'hardening-test-1' }, depth: 0 })
try {
  const { token } = await payload.login({ collection: 'users', data: { email: adminWithPassword.email, password: 'hardening-test-1' } })
  const authFrom = async (origin: string) =>
    (await payload.auth({ headers: new Headers({ Cookie: `payload-token=${token}`, Origin: origin }) })).user
  assert.equal(await authFrom('https://evil.example'), null, 'admin cookie from a foreign origin')
  assert.equal((await authFrom('http://localhost:3000'))?.id, admin.id, 'admin cookie from the shop itself')
} finally {
  // Put the seeded password back.
  if (process.env.SEED_ADMIN_PASSWORD) {
    await payload.update({ collection: 'users', id: admin.id, data: { password: process.env.SEED_ADMIN_PASSWORD }, depth: 0 })
  }
}

// 2. Signing refuses to run without a secret, instead of signing with an empty key.
const secret = process.env.PAYLOAD_SECRET
delete process.env.PAYLOAD_SECRET
try {
  assert.throws(() => signValue('kunde', '1'), /PAYLOAD_SECRET/)
} finally {
  process.env.PAYLOAD_SECRET = secret
}

// 3 + 4. Orders don't default to "seed", and visitors can't link a cart to someone else.
const lasse = (await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, depth: 0 })).docs[0]
const product = (await payload.find({ collection: 'products', limit: 1, depth: 0 })).docs[0]
const order = await payload.create({
  collection: 'orders',
  data: { status: 'cancelled', customerAccount: lasse.id, items: [{ product: product.id, quantity: 1 }] },
  depth: 0,
})
const cart = await payload.create({
  collection: 'carts',
  data: { customer: lasse.id, items: [] } as never,
  overrideAccess: false,
  depth: 0,
})
try {
  assert.notEqual(order.placedVia, 'seed', 'an order without an origin must not count as seeded history')
  assert.equal(cart.customer ?? null, null, "a guest can't link a cart to another user")
} finally {
  await payload.delete({ collection: 'orders', id: order.id })
  await payload.delete({ collection: 'carts', id: cart.id })
}
