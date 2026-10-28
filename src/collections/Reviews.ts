import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Vurdering', plural: 'Vurderinger' },
  admin: {
    group: 'Butikk',
    useAsTitle: 'title',
    defaultColumns: ['title', 'product', 'rating', 'authorName', 'publishedAt'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'product',
      label: 'Produkt',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      index: true,
    },
    {
      type: 'row',
      fields: [
        { name: 'authorName', label: 'Navn', type: 'text', required: true },
        { name: 'place', label: 'Sted', type: 'text' },
        { name: 'rating', label: 'Stjerner', type: 'number', min: 1, max: 5, required: true },
      ],
    },
    { name: 'title', label: 'Tittel', type: 'text', required: true },
    { name: 'body', label: 'Tekst', type: 'textarea', required: true },
    {
      type: 'row',
      fields: [
        { name: 'verifiedPurchase', label: 'Verifisert kjøp', type: 'checkbox', defaultValue: true },
        { name: 'helpfulCount', label: 'Antall «nyttig»', type: 'number', defaultValue: 0 },
        { name: 'publishedAt', label: 'Publisert', type: 'date' },
      ],
    },
  ],
}
