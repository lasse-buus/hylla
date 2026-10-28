import type { User } from '@/payload-types'

import config from '@payload-config'
import { timingSafeEqual } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import { cache } from 'react'

import { userIsAdmin } from '@/access'

import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } from './demoAccount'
import { routes } from './routes'
import { readSignedValue, signValue } from './signedValue'

/**
 * The shop's own login, separate from Payload's admin session: an editor can be logged in to
 * /admin and Min side at the same time, and an admin session never counts as a shop customer.
 */
const COOKIE = 'hylla_kunde'
const PURPOSE = 'kunde'

export type ShopAddress = {
  id: string
  label: string
  addressLine: string
  postalCode: string
  city: string
  isDefault: boolean
}

export type ShopCustomer = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  customerSince: string | null
  addresses: ShopAddress[]
  preferences: {
    newsletter: boolean
    smsOffers: boolean
    deliverySms: boolean
    backInStock: boolean
    interests: string[]
  }
}

/** The user as a shop customer, or null for anyone who isn't purely a customer (admins included). */
export function toShopCustomer(user: User | null | undefined): ShopCustomer | null {
  if (!user?.roles?.includes('customer') || userIsAdmin(user)) return null

  const [firstName = '', ...rest] = (user.name ?? '').trim().split(/\s+/)
  const preferences = user.preferences ?? {}

  return {
    id: user.id,
    firstName,
    lastName: rest.join(' '),
    email: user.email,
    phone: user.phone ?? '',
    customerSince: user.customerSince ?? null,
    addresses: (user.addresses ?? []).map((address, index) => ({
      id: address.id ?? String(index),
      label: address.label,
      addressLine: address.addressLine ?? '',
      postalCode: address.postalCode ?? '',
      city: address.city ?? '',
      isDefault: Boolean(address.isDefault),
    })),
    preferences: {
      newsletter: Boolean(preferences.newsletter),
      smsOffers: Boolean(preferences.smsOffers),
      deliverySms: Boolean(preferences.deliverySms),
      backInStock: Boolean(preferences.backInStock),
      interests: preferences.interests ?? [],
    },
  }
}

/** The customer's details as an order needs them, with the saved default address (or the first one). */
export function accountContact(account: ShopCustomer) {
  const address = account.addresses.find((candidate) => candidate.isDefault) ?? account.addresses[0]
  return {
    firstName: account.firstName,
    lastName: account.lastName,
    email: account.email,
    phone: account.phone,
    address: {
      addressLine: address?.addressLine ?? '',
      postalCode: address?.postalCode ?? '',
      city: address?.city ?? '',
      country: 'Norge',
    },
  }
}

const sameText = (a: string, b: string) => {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

/**
 * The customer for these credentials, or null (wrong password, unknown user, or not a customer).
 * The demo account's password is public, so it is checked here rather than with Payload's login:
 * that way failed attempts through the API can't lock the account for every visitor, and logging in
 * writes nothing to the shared user record.
 */
export async function verifyShopLogin(email: string, password: string): Promise<ShopCustomer | null> {
  const payload = await getPayload({ config })

  if (email.toLowerCase() === DEMO_ACCOUNT_EMAIL) {
    if (!sameText(password, DEMO_ACCOUNT_PASSWORD)) return null
    const { docs } = await payload.find({ collection: 'users', where: { email: { equals: DEMO_ACCOUNT_EMAIL } }, depth: 0, limit: 1 })
    return toShopCustomer(docs[0])
  }

  const user = await payload
    .login({ collection: 'users', data: { email, password } })
    .then((result) => result.user)
    .catch(() => null)
  return toShopCustomer(user)
}

/** Where to go after logging in: only Min side pages, so the login link can't send people elsewhere. */
export function safeReturnPath(value: string | null | undefined): string {
  const isAccountPath = value === routes.account || Boolean(value?.startsWith(`${routes.account}/`))
  return value && isAccountPath && !value.includes('//') && !value.includes('\\') ? value : routes.account
}

/** The logged-in shop customer (loaded once per request), or null. A cookie naming a deleted user (e.g. after the nightly reset) counts as logged out. */
export const getShopCustomer = cache(async (): Promise<ShopCustomer | null> => {
  const id = Number(readSignedValue(PURPOSE, (await cookies()).get(COOKIE)?.value) ?? NaN)
  if (!Number.isInteger(id)) return null

  const payload = await getPayload({ config })
  const user = await payload.findByID({ collection: 'users', id, depth: 0, disableErrors: true })
  return toShopCustomer(user)
})

/** The logged-in customer, or a redirect to the login page that comes back to `returnTo`. */
export async function requireShopCustomer(returnTo: string): Promise<ShopCustomer> {
  const customer = await getShopCustomer()
  if (!customer) redirect(`${routes.login}?neste=${encodeURIComponent(returnTo)}`)
  return customer
}

export async function startShopSession(userID: number) {
  ;(await cookies()).set(COOKIE, signValue(PURPOSE, String(userID)), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24,
  })
}

export async function endShopSession() {
  ;(await cookies()).delete(COOKIE)
}
