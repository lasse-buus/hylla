import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'

export const Brands: CollectionConfig = {
  slug: 'brands',
  labels: { singular: 'Merke', plural: 'Merker' },
  admin: {
    group: 'Butikk',
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'name',
      label: 'Navn',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'description',
      label: 'Beskrivelse',
      type: 'textarea',
    },
  ],
}
