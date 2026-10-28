import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidateNavigationAfterChange, revalidateNavigationAfterDelete } from '@/hooks/revalidateNavigation'

/** Icons for category tiles; also used by the front page's CTA banner. */
export const categoryIconOptions = [
  { label: 'Gamepad', value: 'gamepad' },
  { label: 'Prosessor', value: 'cpu' },
  { label: 'Skjerm', value: 'monitor' },
  { label: 'Mus', value: 'mouse' },
  { label: 'Tastatur', value: 'keyboard' },
  { label: 'Hodetelefoner', value: 'headphones' },
  { label: 'Stol', value: 'armchair' },
  { label: 'Kabel', value: 'cable' },
  { label: 'Bærbar PC', value: 'laptop' },
  { label: 'Mobil', value: 'smartphone' },
  { label: 'TV', value: 'tv' },
  { label: 'Vaskemaskin', value: 'washing-machine' },
  { label: 'Kaffe', value: 'coffee' },
]

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: { singular: 'Kategori', plural: 'Kategorier' },
  admin: {
    group: 'Butikk',
    useAsTitle: 'title',
    defaultColumns: ['title', 'parent', 'slug', 'sortOrder'],
    description: 'Avdelinger (toppnivå) og underkategorier. Toppnivået vises i hovedmenyen og megamenyen.',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [revalidateNavigationAfterChange],
    afterDelete: [revalidateNavigationAfterDelete],
  },
  fields: [
    {
      name: 'title',
      label: 'Navn',
      type: 'text',
      required: true,
    },
    slugField('title'),
    {
      name: 'parent',
      label: 'Overordnet kategori',
      type: 'relationship',
      relationTo: 'categories',
      admin: { position: 'sidebar' },
    },
    {
      name: 'menuGroup',
      label: 'Gruppe i megamenyen',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Underkategorier med samme gruppe vises i samme kolonne, f.eks. «PC og konsoll».',
        condition: (data) => Boolean(data?.parent),
      },
    },
    {
      name: 'sortOrder',
      label: 'Sortering',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
    {
      name: 'icon',
      label: 'Ikon',
      type: 'select',
      admin: { description: 'Ikon som vises på kategorikortene.' },
      options: categoryIconOptions,
    },
    {
      name: 'description',
      label: 'Beskrivelse',
      type: 'textarea',
    },
    {
      name: 'heroImage',
      label: 'Toppbilde',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'menuPromo',
      label: 'Kampanje i megamenyen',
      type: 'group',
      admin: {
        description: 'Gjelder bare avdelinger (kategorier uten overordnet kategori).',
        condition: (data) => !data?.parent,
      },
      fields: [
        { name: 'eyebrow', label: 'Overtekst', type: 'text' },
        { name: 'product', label: 'Produkt', type: 'relationship', relationTo: 'products' },
        { name: 'image', label: 'Bilde', type: 'upload', relationTo: 'media' },
        { name: 'guide', label: 'Guide', type: 'relationship', relationTo: 'guides' },
      ],
    },
  ],
}
