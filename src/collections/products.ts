import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import type { Field } from 'payload'

import { slugField } from '@/fields/slug'
import { revalidateNavigationAfterChange, revalidateNavigationAfterDelete } from '@/hooks/revalidateNavigation'

const badgeOptions = [
  { label: 'Ingen', value: 'none' },
  { label: 'Nyhet', value: 'new' },
  { label: 'Bestselger', value: 'bestseller' },
  { label: 'Kundefavoritt', value: 'favorite' },
  { label: 'Toppmodell', value: 'flagship' },
]

const iconOptions = [
  { label: 'Skjerm', value: 'monitor' },
  { label: 'Vifte', value: 'wind' },
  { label: 'Verktøy', value: 'wrench' },
  { label: 'Headset', value: 'headphones' },
  { label: 'Lyn', value: 'zap' },
  { label: 'Skjold', value: 'shield' },
  { label: 'Batteri', value: 'battery' },
]

/**
 * Hylla's fields on top of the ecommerce plugin's product collection
 * (which provides inventory, prices and variants).
 */
export const productsCollectionOverride: CollectionOverride = ({ defaultCollection }) => {
  const pluginFields = defaultCollection.fields

  const generalFields: Field[] = [
    { name: 'title', label: 'Produktnavn', type: 'text', required: true },
    {
      name: 'shortSpecs',
      label: 'Kortspesifikasjoner',
      type: 'text',
      admin: { description: 'Vises på produktkortet, f.eks. «QHD · 180 Hz · 1 ms · IPS-panel».' },
    },
    {
      name: 'highlights',
      label: 'Nøkkelpunkter',
      type: 'array',
      admin: { description: 'Vises med hake over kjøpsknappen.' },
      fields: [{ name: 'text', label: 'Tekst', type: 'text', required: true }],
    },
    {
      name: 'overviewTitle',
      label: 'Oversikt – overskrift',
      type: 'text',
    },
    { name: 'description', label: 'Beskrivelse', type: 'richText' },
    {
      name: 'features',
      label: 'Fordeler',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'icon', label: 'Ikon', type: 'select', options: iconOptions },
            { name: 'title', label: 'Tittel', type: 'text', required: true },
          ],
        },
        { name: 'text', label: 'Tekst', type: 'textarea' },
      ],
    },
  ]

  const priceFields: Field[] = [
    ...pluginFields,
    {
      name: 'compareAtPrice',
      label: 'Førpris (kr)',
      type: 'number',
      min: 0,
      admin: {
        description:
          'Laveste pris de siste 30 dagene. Fylles ut når produktet er på tilbud. Varianter har egen førpris.',
        condition: (data) => !data?.enableVariants,
      },
    },
  ]

  const specFields: Field[] = [
    {
      name: 'specGroups',
      label: 'Spesifikasjoner',
      type: 'array',
      fields: [
        { name: 'title', label: 'Gruppe', type: 'text', required: true },
        {
          name: 'rows',
          label: 'Rader',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'label', label: 'Egenskap', type: 'text', required: true },
                { name: 'value', label: 'Verdi', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'faq',
      label: 'Spørsmål og svar',
      type: 'array',
      fields: [
        { name: 'question', label: 'Spørsmål', type: 'text', required: true },
        { name: 'answer', label: 'Svar', type: 'textarea', required: true },
      ],
    },
  ]

  return {
    ...defaultCollection,
    labels: { singular: 'Produkt', plural: 'Produkter' },
    admin: {
      ...defaultCollection.admin,
      group: 'Butikk',
      useAsTitle: 'title',
      defaultColumns: ['title', 'brand', 'priceInNOK', 'inventory', '_status'],
      listSearchableFields: ['title', 'sku', 'shortSpecs'],
    },
    hooks: {
      ...defaultCollection.hooks,
      afterChange: [...(defaultCollection.hooks?.afterChange ?? []), revalidateNavigationAfterChange],
      afterDelete: [...(defaultCollection.hooks?.afterDelete ?? []), revalidateNavigationAfterDelete],
    },
    fields: [
      {
        type: 'tabs',
        tabs: [
          { label: 'Generelt', fields: generalFields },
          { label: 'Pris, lager og varianter', fields: priceFields },
          {
            label: 'Bilder',
            fields: [
              {
                name: 'gallery',
                label: 'Bildegalleri',
                type: 'upload',
                relationTo: 'media',
                hasMany: true,
                admin: { description: 'Første bilde brukes på produktkortet.' },
              },
            ],
          },
          { label: 'Spesifikasjoner', fields: specFields },
        ],
      },
      slugField('title'),
      {
        name: 'sku',
        label: 'Varenummer',
        type: 'text',
        index: true,
        admin: { position: 'sidebar' },
      },
      {
        name: 'brand',
        label: 'Merke',
        type: 'relationship',
        relationTo: 'brands',
        admin: { position: 'sidebar' },
      },
      {
        name: 'categories',
        label: 'Kategorier',
        type: 'relationship',
        relationTo: 'categories',
        hasMany: true,
        admin: { position: 'sidebar' },
      },
      {
        name: 'badge',
        label: 'Merkelapp',
        type: 'select',
        defaultValue: 'none',
        options: badgeOptions,
        admin: {
          position: 'sidebar',
          description: '«Spar X kr» vises automatisk når det finnes en førpris.',
        },
      },
      {
        type: 'row',
        admin: { position: 'sidebar' },
        fields: [
          { name: 'rating', label: 'Snittvurdering', type: 'number', min: 0, max: 5 },
          { name: 'reviewCount', label: 'Antall vurderinger', type: 'number', min: 0 },
        ],
      },
      {
        name: 'ratingBreakdown',
        label: 'Fordeling av vurderinger',
        type: 'group',
        admin: {
          position: 'sidebar',
          description: 'Antall vurderinger per stjerne, vist som søyler på produktsiden. Summen bør være lik «Antall vurderinger».',
        },
        fields: [
          {
            type: 'row',
            fields: [5, 4, 3, 2, 1].map((stars): Field => ({
              name: `stars${stars}`,
              label: `${stars} ★`,
              type: 'number',
              min: 0,
            })),
          },
        ],
      },
      {
        name: 'related',
        label: 'Passer godt sammen med',
        type: 'relationship',
        relationTo: 'products',
        hasMany: true,
        admin: { position: 'sidebar' },
      },
    ],
  }
}

export const variantsCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  labels: { singular: 'Variant', plural: 'Varianter' },
  fields: [
    ...defaultCollection.fields,
    {
      name: 'compareAtPrice',
      label: 'Førpris (kr)',
      type: 'number',
      min: 0,
    },
    {
      name: 'sku',
      label: 'Varenummer',
      type: 'text',
      index: true,
      admin: { position: 'sidebar' },
    },
  ],
})
