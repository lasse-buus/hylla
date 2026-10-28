import type { Block, Field } from 'payload'

import { categoryIconOptions } from '@/collections/Categories'

/**
 * A link that points at a category, product or guide (so it follows slug changes),
 * or at a plain URL when there is nothing to reference.
 */
const linkField = (name = 'link', label = 'Lenke'): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'label', label: 'Tekst', type: 'text' },
        {
          name: 'reference',
          label: 'Lenker til',
          type: 'relationship',
          relationTo: ['categories', 'products', 'guides'],
        },
        {
          name: 'url',
          label: 'Eller adresse',
          type: 'text',
          admin: { description: 'Brukes når «Lenker til» er tom, f.eks. /tilbud.' },
        },
      ],
    },
  ],
})

const sectionFields: Field[] = [
  { name: 'title', label: 'Overskrift', type: 'text', required: true },
  { name: 'intro', label: 'Ingress', type: 'text' },
  linkField('link', '«Se alle»-lenke'),
]

const limitField = (defaultValue: number): Field => ({
  name: 'limit',
  label: 'Antall',
  type: 'number',
  defaultValue,
  min: 1,
  max: 12,
})

export const HeroBlock: Block = {
  slug: 'hero',
  labels: { singular: 'Kampanjebanner', plural: 'Kampanjebannere' },
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'eyebrow', label: 'Overtekst', type: 'text' },
    {
      name: 'title',
      label: 'Overskrift',
      type: 'textarea',
      required: true,
      admin: { description: 'Linjeskift vises som linjeskift.' },
    },
    { name: 'text', label: 'Tekst', type: 'textarea' },
    linkField('link', 'Knapp'),
    {
      type: 'row',
      fields: [
        { name: 'highlightLabel', label: 'Uthevet – liten tekst', type: 'text', admin: { placeholder: 'Spar opptil' } },
        { name: 'highlightValue', label: 'Uthevet – stor tekst', type: 'text', admin: { placeholder: '30 %' } },
      ],
    },
    { name: 'finePrint', label: 'Liten skrift', type: 'text' },
    { name: 'image', label: 'Bilde', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'featuredProduct',
      label: 'Produkt på bildet',
      type: 'relationship',
      relationTo: 'products',
      admin: { description: 'Vises som et lite produktkort nede til høyre på bildet.' },
    },
  ],
}

export const CategoryGridBlock: Block = {
  slug: 'categoryGrid',
  labels: { singular: 'Kategorivalg', plural: 'Kategorivalg' },
  interfaceName: 'CategoryGridBlock',
  fields: [
    { name: 'title', label: 'Overskrift', type: 'text', required: true },
    {
      name: 'categories',
      label: 'Kategorier',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      admin: { description: 'La stå tom for å vise alle avdelinger.' },
    },
  ],
}

export const ProductTabsBlock: Block = {
  slug: 'productTabs',
  labels: { singular: 'Produkter med faner', plural: 'Produkter med faner' },
  interfaceName: 'ProductTabsBlock',
  fields: [
    ...sectionFields,
    {
      type: 'row',
      fields: [
        { name: 'onSaleOnly', label: 'Bare produkter på tilbud', type: 'checkbox', defaultValue: true },
        limitField(4),
      ],
    },
    {
      name: 'tabs',
      label: 'Faner',
      type: 'array',
      admin: { description: 'Fanen «Alle» legges til først automatisk.' },
      fields: [
        { name: 'label', label: 'Navn', type: 'text', required: true },
        { name: 'categories', label: 'Kategorier', type: 'relationship', relationTo: 'categories', hasMany: true, required: true },
      ],
    },
    {
      name: 'finePrint',
      label: 'Liten skrift',
      type: 'text',
      defaultValue: 'Alle priser er i NOK inkl. mva. Førpris er laveste pris de siste 30 dagene.',
    },
  ],
}

export const PromoCardsBlock: Block = {
  slug: 'promoCards',
  labels: { singular: 'Kampanjekort', plural: 'Kampanjekort' },
  interfaceName: 'PromoCardsBlock',
  fields: [
    {
      name: 'cards',
      label: 'Kort',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      fields: [
        { name: 'eyebrow', label: 'Overtekst', type: 'text' },
        { name: 'title', label: 'Overskrift', type: 'textarea', required: true },
        { name: 'text', label: 'Tekst', type: 'textarea' },
        { name: 'image', label: 'Bilde', type: 'upload', relationTo: 'media', required: true },
        linkField('link', 'Knapp'),
        {
          type: 'row',
          fields: [
            {
              name: 'product',
              label: 'Vis «Fra»-pris for',
              type: 'relationship',
              relationTo: 'products',
            },
            {
              name: 'tone',
              label: 'Bakgrunn',
              type: 'select',
              defaultValue: 'sand',
              options: [
                { label: 'Sand', value: 'sand' },
                { label: 'Blå', value: 'blue' },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const ProductListBlock: Block = {
  slug: 'productList',
  labels: { singular: 'Produktliste', plural: 'Produktlister' },
  interfaceName: 'ProductListBlock',
  fields: [
    ...sectionFields,
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          label: 'Produkter',
          type: 'select',
          defaultValue: 'popular',
          options: [
            { label: 'Mest populære', value: 'popular' },
            { label: 'På tilbud', value: 'onSale' },
            { label: 'Velg selv', value: 'manual' },
          ],
        },
        limitField(4),
      ],
    },
    {
      name: 'products',
      label: 'Valgte produkter',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { condition: (_, siblingData) => siblingData?.source === 'manual' },
    },
  ],
}

export const CtaBannerBlock: Block = {
  slug: 'ctaBanner',
  labels: { singular: 'CTA-banner', plural: 'CTA-bannere' },
  interfaceName: 'CtaBannerBlock',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'eyebrow', label: 'Overtekst', type: 'text' },
        { name: 'icon', label: 'Ikon', type: 'select', options: categoryIconOptions },
      ],
    },
    { name: 'title', label: 'Overskrift', type: 'textarea', required: true },
    { name: 'text', label: 'Tekst', type: 'textarea' },
    linkField('link', 'Knapp'),
    { name: 'image', label: 'Bilde', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'shortcuts',
      label: 'Snarveier på bildet',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
      maxRows: 4,
    },
  ],
}

export const GuideListBlock: Block = {
  slug: 'guideList',
  labels: { singular: 'Guider og tips', plural: 'Guider og tips' },
  interfaceName: 'GuideListBlock',
  fields: [
    ...sectionFields,
    {
      type: 'row',
      fields: [
        {
          name: 'source',
          label: 'Guider',
          type: 'select',
          defaultValue: 'latest',
          options: [
            { label: 'Nyeste', value: 'latest' },
            { label: 'Velg selv', value: 'manual' },
          ],
        },
        limitField(3),
      ],
    },
    {
      name: 'guides',
      label: 'Valgte guider',
      type: 'relationship',
      relationTo: 'guides',
      hasMany: true,
      admin: { condition: (_, siblingData) => siblingData?.source === 'manual' },
    },
  ],
}

export const ServiceHighlightsBlock: Block = {
  slug: 'serviceHighlights',
  labels: { singular: 'Tjenester og trygghet', plural: 'Tjenester og trygghet' },
  interfaceName: 'ServiceHighlightsBlock',
  fields: [
    { name: 'title', label: 'Overskrift', type: 'text', required: true },
    { name: 'intro', label: 'Ingress', type: 'text' },
    {
      name: 'items',
      label: 'Punkter',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'icon',
              label: 'Ikon',
              type: 'select',
              required: true,
              options: [
                { label: 'Levering', value: 'truck' },
                { label: 'Retur', value: 'return' },
                { label: 'Hjelp', value: 'help' },
                { label: 'Reparasjon', value: 'repair' },
              ],
            },
            { name: 'title', label: 'Tittel', type: 'text', required: true },
          ],
        },
        { name: 'text', label: 'Tekst', type: 'textarea' },
        linkField(),
      ],
    },
  ],
}

export const homeBlocks: Block[] = [
  HeroBlock,
  CategoryGridBlock,
  ProductTabsBlock,
  PromoCardsBlock,
  ProductListBlock,
  CtaBannerBlock,
  GuideListBlock,
  ServiceHighlightsBlock,
]
