import { cookies } from 'next/headers'

import { routes } from './routes'
import { readSignedValue, signValue } from './signedValue'

/**
 * Guests can't read orders, so after checkout the browser gets a signed cookie naming the order
 * it just placed. The confirmation page shows that order and nothing else.
 */
const COOKIE = 'hylla_ordre'
const PURPOSE = 'ordre'

export async function rememberPlacedOrder(orderID: number) {
  const store = await cookies()
  store.set(COOKIE, signValue(PURPOSE, String(orderID)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: routes.orderConfirmation,
    maxAge: 60 * 60 * 24,
  })
}

/** The order this browser placed most recently, if the cookie is present and untampered. */
export async function placedOrderID(): Promise<number | null> {
  const orderID = Number(readSignedValue(PURPOSE, (await cookies()).get(COOKIE)?.value) ?? NaN)
  return Number.isInteger(orderID) ? orderID : null
}

/**
 * Orders this browser placed while logged in as the demo customer. Min side lists these next to his
 * seeded history, so a visitor sees their own purchases but never another visitor's. Logging out keeps
 * them; they expire around the nightly reset, which deletes the orders anyway.
 */
const ACCOUNT_COOKIE = 'hylla_mine_ordrer'
const ACCOUNT_PURPOSE = 'mine-ordrer'
const MAX_REMEMBERED = 20

export async function accountOrderIDs(): Promise<number[]> {
  const value = readSignedValue(ACCOUNT_PURPOSE, (await cookies()).get(ACCOUNT_COOKIE)?.value)
  return (value?.split('-') ?? []).map(Number).filter(Number.isInteger)
}

export async function rememberAccountOrder(orderID: number) {
  const ids = [orderID, ...(await accountOrderIDs()).filter((id) => id !== orderID)].slice(0, MAX_REMEMBERED)
  ;(await cookies()).set(ACCOUNT_COOKIE, signValue(ACCOUNT_PURPOSE, ids.join('-')), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}
