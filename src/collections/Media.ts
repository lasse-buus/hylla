import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Bilde', plural: 'Mediebibliotek' },
  admin: {
    group: 'Innhold',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      label: 'Alternativ tekst',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 240 },
      { name: 'card', width: 640 },
      { name: 'large', width: 1600 },
    ],
  },
}
