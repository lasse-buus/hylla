import type { CollectionConfig } from 'payload'

import { adminOnlyFieldAccess, isAdmin, userIsAdmin } from '@/access'
import { customerInterests } from '@/lib/customerInterests'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Bruker', plural: 'Brukere' },
  admin: {
    group: 'Innstillinger',
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
  },
  access: {
    admin: ({ req: { user } }) => userIsAdmin(user),
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      if (userIsAdmin(user)) return true
      if (user) return { id: { equals: user.id } }
      return false
    },
    // The demo customer's password is public, so customers can't change their own record.
    update: isAdmin,
  },
  auth: true,
  fields: [
    {
      name: 'name',
      label: 'Navn',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      label: 'Roller',
      type: 'select',
      hasMany: true,
      defaultValue: ['customer'],
      required: true,
      saveToJWT: true,
      access: {
        create: adminOnlyFieldAccess,
        update: adminOnlyFieldAccess,
      },
      options: [
        { label: 'Administrator', value: 'admin' },
        { label: 'Kunde', value: 'customer' },
      ],
    },
    {
      type: 'collapsible',
      label: 'Kundeprofil',
      admin: {
        condition: (data) => Boolean(data?.roles?.includes('customer')),
        description: 'Vises på Min side. Endringer kunden gjør der, lagres bare i nettleseren.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'phone', label: 'Mobilnummer', type: 'text' },
            { name: 'customerSince', label: 'Kunde siden', type: 'date' },
          ],
        },
        {
          name: 'addresses',
          label: 'Adresser',
          labels: { singular: 'Adresse', plural: 'Adresser' },
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', label: 'Navn på adressen', type: 'text', required: true },
                { name: 'isDefault', label: 'Standard', type: 'checkbox' },
              ],
            },
            { name: 'addressLine', label: 'Gateadresse', type: 'text' },
            {
              type: 'row',
              fields: [
                { name: 'postalCode', label: 'Postnummer', type: 'text', admin: { width: '35%' } },
                { name: 'city', label: 'Poststed', type: 'text', admin: { width: '65%' } },
              ],
            },
          ],
        },
        {
          name: 'preferences',
          label: 'Nyhetsbrev og varsler',
          type: 'group',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'newsletter', label: 'Nyhetsbrev på e-post', type: 'checkbox' },
                { name: 'smsOffers', label: 'Tilbud på SMS', type: 'checkbox' },
                { name: 'deliverySms', label: 'Leveringsvarsel på SMS', type: 'checkbox' },
                { name: 'backInStock', label: 'Varsel når en vare er tilbake på lager', type: 'checkbox' },
              ],
            },
            { name: 'interests', label: 'Interesser', type: 'select', hasMany: true, options: [...customerInterests] },
          ],
        },
      ],
    },
  ],
}
