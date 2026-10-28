import type { CollectionConfig } from 'payload'

import { BlocksFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { adminOrPublishedStatus, isAdmin } from '@/access'
import { guideBlocks } from '@/blocks/guideBlocks'
import { slugField } from '@/fields/slug'
import { revalidateNavigationAfterChange, revalidateNavigationAfterDelete } from '@/hooks/revalidateNavigation'

export const Guides: CollectionConfig = {
  slug: 'guides',
  labels: { singular: 'Guide', plural: 'Guider og tips' },
  admin: {
    group: 'Innhold',
    useAsTitle: 'title',
    defaultColumns: ['title', 'department', 'author', 'publishedAt', '_status'],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: adminOrPublishedStatus,
    update: isAdmin,
  },
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [revalidateNavigationAfterChange],
    afterDelete: [revalidateNavigationAfterDelete],
  },
  versions: {
    drafts: true,
  },
  fields: [
    { name: 'title', label: 'Tittel', type: 'text', required: true },
    {
      name: 'kicker',
      label: 'Overtekst',
      type: 'text',
      admin: { description: 'F.eks. «Gaming · Kjøpeguide».' },
    },
    { name: 'excerpt', label: 'Ingress', type: 'textarea', required: true },
    { name: 'heroImage', label: 'Hovedbilde', type: 'upload', relationTo: 'media', required: true },
    { name: 'heroCaption', label: 'Bildetekst', type: 'text' },
    {
      name: 'content',
      label: 'Innhold',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, BlocksFeature({ blocks: guideBlocks })],
      }),
    },
    {
      name: 'relatedProducts',
      label: 'Produkter i guiden',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
    },
    slugField('title'),
    {
      name: 'department',
      label: 'Avdeling',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'author',
      label: 'Skribent',
      type: 'relationship',
      relationTo: 'authors',
      admin: { position: 'sidebar' },
    },
    {
      name: 'readingMinutes',
      label: 'Lesetid (minutter)',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      label: 'Publisert',
      type: 'date',
      admin: { position: 'sidebar' },
    },
  ],
}
