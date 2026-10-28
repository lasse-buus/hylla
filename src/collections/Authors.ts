import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'

export const Authors: CollectionConfig = {
  slug: 'authors',
  labels: { singular: 'Skribent', plural: 'Skribenter' },
  admin: {
    group: 'Innhold',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  fields: [
    { name: 'name', label: 'Navn', type: 'text', required: true },
    slugField('name'),
    { name: 'role', label: 'Rolle', type: 'text' },
    { name: 'bio', label: 'Kort om skribenten', type: 'textarea' },
    { name: 'avatar', label: 'Profilbilde', type: 'upload', relationTo: 'media' },
  ],
}
