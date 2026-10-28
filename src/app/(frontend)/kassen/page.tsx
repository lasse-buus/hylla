import type { Metadata } from 'next'

import config from '@payload-config'
import { connection } from 'next/server'
import { getPayload } from 'payload'

import { CheckoutView } from '@/components/cart/CheckoutView'
import { deliveryMethodsOf } from '@/globals/StoreSettings'
import { demoCustomer, randomDemoSeed } from '@/lib/demoCustomer'
import { accountContact, getShopCustomer } from '@/lib/shopSession'

export const metadata: Metadata = {
  title: 'Kassen',
  robots: { index: false },
}

/** The cart lives in the browser, so the checkout form renders client-side around the shop's delivery settings. */
export default async function CheckoutPage() {
  // A new demo customer for every visit.
  await connection()

  const payload = await getPayload({ config })
  const [settings, account] = await Promise.all([
    payload.findGlobal({ slug: 'store-settings', depth: 0 }),
    getShopCustomer(),
  ])

  return (
    <div className="shop-container pt-8 pb-16">
      <CheckoutView
        initialCustomer={account ? { seed: null, ...accountContact(account) } : demoCustomer(randomDemoSeed())}
        isAccount={Boolean(account)}
        deliveryMethods={deliveryMethodsOf(settings)}
        freeShippingThreshold={settings.freeShippingThreshold ?? 1000}
      />
    </div>
  )
}
