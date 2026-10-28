'use server'

import type { Order } from '@/payload-types'

import config from '@payload-config'
import { randomBytes } from 'node:crypto'
import { getPayload } from 'payload'

import { purchasableQuantity } from '@/collections/carts'
import { paymentMethodOptions } from '@/collections/orders/constants'
import { deliveryMethodsOf } from '@/globals/StoreSettings'
import { type DemoCustomer, demoCustomer, randomDemoSeed } from '@/lib/demoCustomer'
import { rememberAccountOrder, rememberPlacedOrder } from '@/lib/orderReceipt'
import { accountContact, getShopCustomer } from '@/lib/shopSession'

export async function newDemoCustomer(): Promise<DemoCustomer> {
  return demoCustomer(randomDemoSeed())
}

export type PlaceOrderInput = {
  cartID: number
  cartSecret: string | null
  /** The generated customer's seed; null when logged in as the demo account. */
  customerSeed: number | null
  deliveryMethod: string
  paymentMethod: string
  acknowledged: boolean
}

export type PlaceOrderResult = { ok: true } | { ok: false; error: string; cartChanged?: boolean }

type PaymentMethod = NonNullable<NonNullable<Order['payment']>['method']>
type DeliveryMethod = NonNullable<NonNullable<Order['shipping']>['method']>

const idOf = (value: unknown) => (value && typeof value === 'object' ? (value as { id: number }).id : (value as number))

/**
 * Turns the visitor's guest cart into an order. Hylla takes no payment: the order is registered
 * with a reserved, fictional payment. The customer is the logged-in demo account's saved record, or a
 * generated person rebuilt on the server from its seed, so nothing the browser sends ends up as personal
 * data. Prices come from the catalog, not the browser.
 */
export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  if (!input.acknowledged) {
    return { ok: false, error: 'Bekreft at du har forstått at Hylla er en demobutikk.' }
  }
  // Who the customer is comes from the server: the logged-in account, or the seed's generated person.
  const account = await getShopCustomer()
  const seed = input.customerSeed
  if (!account && (seed === null || !Number.isSafeInteger(seed) || seed < 0)) {
    return { ok: false, error: 'Demokunden er ugyldig. Last inn siden på nytt.' }
  }

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'store-settings', depth: 0 })
  const delivery = deliveryMethodsOf(settings).find((method) => method.method === input.deliveryMethod)
  const payment = paymentMethodOptions.find((option) => option.value === input.paymentMethod)
  if (!delivery || !payment) return { ok: false, error: 'Velg leveringsmåte og betalingsmåte.' }

  // The secret is what proves the cart belongs to this visitor; the plugin's access rules check it.
  const cart = await payload.findByID({
    collection: 'carts',
    id: input.cartID,
    depth: 0,
    overrideAccess: false,
    context: { cartSecret: input.cartSecret },
    disableErrors: true,
  })
  if (!cart?.items?.length) {
    return { ok: false, error: 'Handlekurven er tom eller utløpt. Legg varene i handlekurven på nytt.' }
  }

  // Stock may have changed since the items were added. If so, fix the cart and let the visitor look again.
  const quantities = await Promise.all(cart.items.map((item) => purchasableQuantity(item, { payload })))
  if (quantities.some((quantity, index) => quantity !== cart.items![index].quantity)) {
    await payload.update({ collection: 'carts', id: cart.id, data: { items: cart.items }, depth: 0 })
    return {
      ok: false,
      cartChanged: true,
      error: 'Noen varer er ikke lenger på lager i antallet du valgte. Vi har oppdatert ordren, se over den før du fullfører.',
    }
  }

  const customer = account ? accountContact(account) : demoCustomer(seed!)
  const order = await payload.create({
    collection: 'orders',
    depth: 0,
    data: {
      status: 'received',
      placedVia: 'checkout',
      customerAccount: account?.id,
      customer: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
      },
      shippingAddress: customer.address,
      billingSameAsShipping: true,
      items: cart.items.map((item) => ({
        product: idOf(item.product),
        variant: item.variant ? idOf(item.variant) : undefined,
        quantity: item.quantity,
      })),
      shipping: { method: delivery.method as DeliveryMethod },
      payment: {
        method: payment.value as PaymentMethod,
        status: 'authorized',
        reference: `DEMO-${randomBytes(5).toString('hex').toUpperCase()}`,
      },
      notes: [
        {
          type: 'system',
          author: 'System',
          message: `Bestilt i nettbutikken med ${payment.label}. Demobetaling: ingen penger er reservert eller trukket.`,
        },
      ],
    },
  })

  await payload.delete({ collection: 'carts', id: cart.id, depth: 0 })
  await rememberPlacedOrder(order.id)
  if (account) await rememberAccountOrder(order.id)

  return { ok: true }
}
