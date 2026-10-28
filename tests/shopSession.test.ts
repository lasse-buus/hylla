import type { User } from '@/payload-types'

import assert from 'node:assert/strict'

import { safeReturnPath, toShopCustomer } from '@/lib/shopSession'

// Only Min side pages are valid places to return to after login.
assert.equal(safeReturnPath('/min-side/ordrer'), '/min-side/ordrer')
assert.equal(safeReturnPath('/min-side'), '/min-side')
for (const unsafe of ['//evil.com', 'https://evil.com', '/kassen', '/min-side//x', '/min-side-x', '/min-side/\\evil', null, undefined]) {
  assert.equal(safeReturnPath(unsafe), '/min-side', `unsafe ${JSON.stringify(unsafe)}`)
}

const user = (overrides: Partial<User>) =>
  ({ id: 6, name: 'Lasse Nielsen', email: 'lasse.nielsen@eksempel.no', roles: ['customer'], ...overrides }) as User

// Only customers can be logged in to the shop; an admin never is.
assert.equal(toShopCustomer(null), null)
assert.equal(toShopCustomer(user({ roles: ['admin'] })), null)
assert.equal(toShopCustomer(user({ roles: ['admin', 'customer'] })), null)

const lasse = toShopCustomer(user({}))
assert.equal(lasse?.firstName, 'Lasse')
assert.equal(lasse?.lastName, 'Nielsen')
assert.deepEqual(lasse?.addresses, [])
