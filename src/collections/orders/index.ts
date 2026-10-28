import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import type { Field, Where } from 'payload'

import { isAdmin, userIsAdmin } from '@/access'

import {
  carrierOptions,
  deliveryMethodOptions,
  noteTypeOptions,
  orderStatuses,
  paymentMethodOptions,
  paymentStatusOptions,
} from './constants'
import { orderBeforeChange } from './hooks'

const kroner = (name: string, label: string, extra: Record<string, unknown> = {}): Field => {
  const { admin, ...rest } = extra as { admin?: Record<string, unknown> }

  return { name, label, type: 'number', ...rest, admin: { step: 1, ...(admin ?? {}) } } as Field
}

const addressFields: Field[] = [
  { name: 'addressLine', label: 'Gateadresse', type: 'text' },
  {
    type: 'row',
    fields: [
      { name: 'postalCode', label: 'Postnummer', type: 'text', admin: { width: '35%' } },
      { name: 'city', label: 'Poststed', type: 'text', admin: { width: '65%' } },
    ],
  },
  { name: 'country', label: 'Land', type: 'text', defaultValue: 'Norge' },
]

const itemsField: Field = {
  name: 'items',
  label: 'Varer',
  labels: { singular: 'Vare', plural: 'Varer' },
  type: 'array',
  admin: {
    initCollapsed: false,
    components: { RowLabel: '/components/admin/OrderItemRowLabel#OrderItemRowLabel' },
    description:
      'Velg et produkt og antall. Navn, varenummer og pris hentes automatisk når du lagrer, og totalene regnes ut på nytt.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'product',
          label: 'Produkt',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'variant',
          label: 'Variant',
          type: 'relationship',
          relationTo: 'variants',
          admin: { width: '30%' },
          filterOptions: ({ siblingData }) => {
            const product = (siblingData as { product?: unknown })?.product
            const productID = typeof product === 'object' && product ? (product as { id: unknown }).id : product
            return productID ? { product: { equals: productID } } : true
          },
        },
        { name: 'quantity', label: 'Antall', type: 'number', min: 1, defaultValue: 1, required: true, admin: { width: '20%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'title', label: 'Navn på ordren', type: 'text', admin: { width: '40%' } },
        { name: 'variantLabel', label: 'Variant (tekst)', type: 'text', admin: { width: '25%' } },
        { name: 'sku', label: 'Varenr.', type: 'text', admin: { width: '35%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        kroner('unitPrice', 'Stykkpris (kr)', { admin: { width: '33%' } }),
        kroner('compareAtPrice', 'Førpris (kr)', { admin: { width: '33%' } }),
        kroner('lineTotal', 'Linjesum (kr)', { admin: { width: '34%', readOnly: true } }),
      ],
    },
  ],
}

const fields: Field[] = [
  {
    type: 'tabs',
    tabs: [
      {
        label: 'Ordre',
        fields: [
          itemsField,
          {
            name: 'services',
            label: 'Tjenester',
            labels: { singular: 'Tjeneste', plural: 'Tjenester' },
            type: 'array',
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'label', label: 'Tjeneste', type: 'text', required: true, admin: { width: '70%' } },
                  kroner('price', 'Pris (kr)', { required: true, admin: { width: '30%' } }),
                ],
              },
            ],
          },
          kroner('discount', 'Rabatt (kr)', {
            defaultValue: 0,
            admin: { description: 'Trekkes fra før frakt legges til.' },
          }),
          {
            name: 'totals',
            label: 'Totaler',
            type: 'group',
            admin: { readOnly: true, description: 'Regnes ut automatisk ved lagring.' },
            fields: [
              {
                type: 'row',
                fields: [
                  kroner('subtotal', 'Varer og tjenester'),
                  kroner('savings', 'Kunden sparte'),
                  kroner('discount', 'Rabatt'),
                ],
              },
              {
                type: 'row',
                fields: [kroner('shipping', 'Frakt'), kroner('vat', 'Herav mva. (25 %)')],
              },
            ],
          },
        ],
      },
      {
        label: 'Kunde og levering',
        fields: [
          {
            name: 'customer',
            label: 'Kunde',
            type: 'group',
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'firstName', label: 'Fornavn', type: 'text' },
                  { name: 'lastName', label: 'Etternavn', type: 'text' },
                ],
              },
              {
                type: 'row',
                fields: [
                  { name: 'email', label: 'E-post', type: 'email' },
                  { name: 'phone', label: 'Mobil', type: 'text' },
                ],
              },
            ],
          },
          {
            name: 'shippingAddress',
            label: 'Leveringsadresse',
            type: 'group',
            fields: addressFields,
          },
          {
            name: 'billingSameAsShipping',
            label: 'Fakturaadressen er den samme som leveringsadressen',
            type: 'checkbox',
            defaultValue: true,
          },
          {
            name: 'billingAddress',
            label: 'Fakturaadresse',
            type: 'group',
            admin: { condition: (data) => !data?.billingSameAsShipping },
            fields: addressFields,
          },
          {
            name: 'shipping',
            label: 'Frakt',
            type: 'group',
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'method', label: 'Leveringsmåte', type: 'select', options: deliveryMethodOptions },
                  { name: 'carrier', label: 'Transportør', type: 'select', options: carrierOptions },
                ],
              },
              { name: 'label', label: 'Navn i kassen', type: 'text' },
              {
                type: 'row',
                fields: [
                  kroner('price', 'Fraktpris (kr)', {
                    admin: {
                      readOnly: false,
                      description: 'Hentes fra butikkinnstillingene med mindre «Overstyr pris» er huket av.',
                    },
                  }),
                  { name: 'manualPrice', label: 'Overstyr pris', type: 'checkbox' },
                ],
              },
              {
                type: 'row',
                fields: [
                  { name: 'trackingNumber', label: 'Sporingsnummer', type: 'text' },
                  { name: 'shippedAt', label: 'Sendt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                  { name: 'deliveredAt', label: 'Levert', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                ],
              },
            ],
          },
          { name: 'customerNote', label: 'Beskjed fra kunden', type: 'textarea' },
        ],
      },
      {
        label: 'Betaling',
        fields: [
          {
            name: 'payment',
            label: 'Betaling',
            type: 'group',
            admin: {
              description:
                'Hylla er en demobutikk. Ingen betaling gjennomføres, og referansene er fiktive.',
            },
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'method', label: 'Betalingsmåte', type: 'select', options: paymentMethodOptions },
                  { name: 'status', label: 'Betalingsstatus', type: 'select', options: paymentStatusOptions, defaultValue: 'paid' },
                ],
              },
              {
                type: 'row',
                fields: [
                  { name: 'reference', label: 'Transaksjonsreferanse', type: 'text' },
                  {
                    name: 'cardLast4',
                    label: 'Kort (siste 4)',
                    type: 'text',
                    maxLength: 4,
                    admin: { condition: (_, siblingData) => siblingData?.method === 'card' },
                  },
                ],
              },
              {
                type: 'row',
                fields: [
                  { name: 'paidAt', label: 'Betalt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                  { name: 'refundedAt', label: 'Refundert', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
                  kroner('refundAmount', 'Refundert beløp (kr)'),
                ],
              },
            ],
          },
        ],
      },
      {
        label: 'Ordrelogg',
        fields: [
          {
            name: 'notes',
            label: 'Notater og hendelser',
            labels: { singular: 'Notat', plural: 'Notater' },
            type: 'array',
            admin: {
              initCollapsed: true,
              components: { RowLabel: '/components/admin/OrderNoteRowLabel#OrderNoteRowLabel' },
              description: 'Systemet logger statusendringer og lagerjusteringer her. Legg til egne notater nederst.',
            },
            fields: [
              {
                type: 'row',
                fields: [
                  { name: 'type', label: 'Type', type: 'select', options: noteTypeOptions, defaultValue: 'private' },
                  { name: 'author', label: 'Av', type: 'text', admin: { readOnly: true } },
                  {
                    name: 'createdAt',
                    label: 'Tidspunkt',
                    type: 'date',
                    admin: { readOnly: true, date: { pickerAppearance: 'dayAndTime' } },
                  },
                ],
              },
              { name: 'message', label: 'Notat', type: 'textarea', required: true },
            ],
          },
        ],
      },
    ],
  },
  // Sidebar
  {
    name: 'orderActions',
    type: 'ui',
    admin: {
      position: 'sidebar',
      components: { Field: '/components/admin/OrderActions#OrderActions' },
    },
  },
  {
    name: 'status',
    label: 'Status',
    type: 'select',
    defaultValue: 'received',
    required: true,
    index: true,
    options: [...orderStatuses],
    admin: {
      position: 'sidebar',
      components: { Cell: '/components/admin/OrderStatusCell#OrderStatusCell' },
    },
  },
  {
    name: 'placedAt',
    label: 'Bestilt',
    type: 'date',
    index: true,
    admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime', displayFormat: 'd. MMM yyyy HH:mm' } },
  },
  kroner('total', 'Totalt (kr)', { admin: { position: 'sidebar', readOnly: true } }),
  {
    name: 'itemCount',
    label: 'Antall varer',
    type: 'number',
    admin: { position: 'sidebar', readOnly: true },
  },
  {
    name: 'orderNumber',
    label: 'Ordrenummer',
    type: 'number',
    unique: true,
    index: true,
    admin: { position: 'sidebar', readOnly: true },
  },
  {
    name: 'customerAccount',
    label: 'Kundekonto',
    type: 'relationship',
    relationTo: 'users',
    admin: { position: 'sidebar', description: 'Tom for gjestekjøp, som er alle ordrer i demobutikken.' },
  },
  {
    name: 'placedVia',
    label: 'Opprettet via',
    type: 'select',
    // No default: only orders explicitly marked as seeded history are shown to every demo visitor.
    options: [
      { label: 'Demodata', value: 'seed' },
      { label: 'Kassen', value: 'checkout' },
    ],
    admin: { position: 'sidebar', readOnly: true },
  },
  { name: 'title', label: 'Ordre', type: 'text', admin: { hidden: true } },
  { name: 'stockReserved', type: 'checkbox', defaultValue: false, admin: { hidden: true } },
]

/**
 * Replaces the plugin's minimal orders collection with a WooCommerce-style order:
 * customer, addresses, shipping, payment, editable lines, totals and an order log.
 */
export const ordersCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  labels: { singular: 'Ordre', plural: 'Ordrer' },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (userIsAdmin(user)) return true
      // Customers see only their seeded history over the API. Orders placed through the checkout are
      // shown on Min side by the server, per browser, because every visitor shares the demo account.
      if (!user) return false
      const ownSeededOrders: Where = { and: [{ customerAccount: { equals: user.id } }, { placedVia: { equals: 'seed' } }] }
      return ownSeededOrders
    },
    update: isAdmin,
  },
  admin: {
    ...defaultCollection.admin,
    group: 'Butikk',
    description: undefined,
    useAsTitle: 'title',
    defaultColumns: ['title', 'placedAt', 'status', 'itemCount', 'total'],
    listSearchableFields: ['title', 'customer.email', 'shipping.trackingNumber'],
    pagination: { defaultLimit: 25 },
    components: {
      beforeListTable: ['/components/admin/OrderStatusTabs#OrderStatusTabs'],
    },
  },
  defaultSort: '-placedAt',
  fields,
  hooks: {
    ...defaultCollection.hooks,
    beforeChange: [...(defaultCollection.hooks?.beforeChange ?? []), orderBeforeChange],
  },
})
