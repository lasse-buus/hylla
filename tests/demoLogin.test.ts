import assert from 'node:assert/strict'

import config from '@payload-config'
import { getPayload } from 'payload'

import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } from '@/lib/demoAccount'
import { verifyShopLogin } from '@/lib/shopSession'

const payload = await getPayload({ config })
const lasse = (await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, depth: 0 })).docs[0]

// Wrong passwords against the public demo account (e.g. through /api/users/login) must not lock out every visitor.
try {
  for (let attempt = 0; attempt < 6; attempt++) {
    await payload.login({ collection: 'users', data: { email: DEMO_ACCOUNT_EMAIL, password: 'feil-passord' } }).catch(() => null)
  }
  const customer = await verifyShopLogin(DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD)
  assert.equal(customer?.id, lasse.id, 'demo login works while the account is locked for the API')
  assert.equal(await verifyShopLogin(DEMO_ACCOUNT_EMAIL, 'feil-passord'), null, 'wrong demo password')
  assert.equal(await verifyShopLogin(process.env.SEED_ADMIN_EMAIL ?? 'admin@eksempel.no', process.env.SEED_ADMIN_PASSWORD ?? 'x'), null, 'admins never log in to the shop')
} finally {
  await payload.update({ collection: 'users', id: lasse.id, data: { loginAttempts: 0, lockUntil: null } as never, depth: 0 })
}
