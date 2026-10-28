import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'
import { NAVIGATION_TAG } from '@/hooks/revalidateNavigation'
import { revalidatePath, revalidateTag } from 'next/cache'
import { carrierOptions, deliveryMethodOptions } from '@/collections/orders/constants'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Butikkinnstillinger',
  admin: { group: 'Innstillinger' },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidateTag(NAVIGATION_TAG, 'max')
          // The customer service page lists the delivery methods and the free-shipping limit.
          revalidatePath('/kundeservice')
        } catch {
          // Not running inside Next.js.
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'freeShippingThreshold',
      label: 'Fri frakt fra (kr)',
      type: 'number',
      defaultValue: 1000,
      required: true,
    },
    {
      name: 'deliveryMethods',
      label: 'Leveringsmåter',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'method', label: 'Metode', type: 'select', options: deliveryMethodOptions, required: true },
            { name: 'carrier', label: 'Transportør', type: 'select', options: carrierOptions, required: true },
          ],
        },
        { name: 'label', label: 'Navn i kassen', type: 'text', required: true },
        { name: 'description', label: 'Beskrivelse', type: 'text' },
        {
          type: 'row',
          fields: [
            { name: 'price', label: 'Pris (kr)', type: 'number', defaultValue: 0, required: true },
            {
              name: 'freeAboveThreshold',
              label: 'Gratis over fri frakt-grensen',
              type: 'checkbox',
              defaultValue: true,
            },
          ],
        },
      ],
    },
  ],
}

export type DeliveryMethodSetting = {
  carrier: string
  description?: string | null
  freeAboveThreshold?: boolean | null
  label: string
  method: string
  price: number
}

export const defaultDeliveryMethods: DeliveryMethodSetting[] = [
  {
    method: 'home-evening',
    carrier: 'porterbuddy',
    label: 'Hjemlevering på kvelden',
    description: 'Levering i morgen mellom kl. 17 og 21',
    price: 99,
    freeAboveThreshold: true,
  },
  {
    method: 'pickup-point',
    carrier: 'posten',
    label: 'Hent på hentested',
    description: 'Velg hentested nær deg etter postnummer',
    price: 69,
    freeAboveThreshold: true,
  },
  {
    method: 'express',
    carrier: 'bring',
    label: 'Ekspress før kl. 12',
    description: 'Levering neste virkedag med Bring',
    price: 149,
    freeAboveThreshold: false,
  },
  {
    method: 'store',
    carrier: 'store',
    label: 'Hent i butikk',
    description: 'Hylla Oslo City · Klar om 2 timer',
    price: 0,
    freeAboveThreshold: true,
  },
]

/** The configured delivery methods, or the defaults when none are set up yet. */
export const deliveryMethodsOf = (settings: { deliveryMethods?: DeliveryMethodSetting[] | null }): DeliveryMethodSetting[] =>
  settings.deliveryMethods?.length ? settings.deliveryMethods : defaultDeliveryMethods
