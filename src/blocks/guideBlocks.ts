import type { Block } from 'payload'

export const TipBlock: Block = {
  slug: 'tip',
  labels: { singular: 'Tips-boks', plural: 'Tips-bokser' },
  interfaceName: 'TipBlock',
  fields: [
    { name: 'title', label: 'Tittel', type: 'text', defaultValue: 'Tips fra eksperten' },
    { name: 'text', label: 'Tekst', type: 'textarea', required: true },
  ],
}

export const ComparisonTableBlock: Block = {
  slug: 'comparisonTable',
  labels: { singular: 'Sammenligningstabell', plural: 'Sammenligningstabeller' },
  interfaceName: 'ComparisonTableBlock',
  fields: [
    {
      name: 'caption',
      label: 'Tabellbeskrivelse (for skjermlesere)',
      type: 'text',
    },
    {
      name: 'columns',
      label: 'Kolonner',
      type: 'array',
      minRows: 1,
      fields: [
        { name: 'label', label: 'Overskrift', type: 'text', required: true },
        { name: 'highlight', label: 'Uthev kolonnen', type: 'checkbox' },
      ],
    },
    {
      name: 'rows',
      label: 'Rader',
      type: 'array',
      fields: [
        { name: 'label', label: 'Radnavn', type: 'text', required: true },
        {
          name: 'cells',
          label: 'Celler (én per kolonne)',
          type: 'array',
          fields: [{ name: 'value', label: 'Verdi', type: 'text' }],
        },
      ],
    },
  ],
}

export const ProductEmbedBlock: Block = {
  slug: 'productEmbed',
  labels: { singular: 'Produkt', plural: 'Produkter' },
  interfaceName: 'ProductEmbedBlock',
  fields: [
    { name: 'label', label: 'Overtekst', type: 'text', defaultValue: 'Vår anbefaling' },
    { name: 'product', label: 'Produkt', type: 'relationship', relationTo: 'products', required: true },
  ],
}

export const ChecklistBlock: Block = {
  slug: 'checklist',
  labels: { singular: 'Sjekkliste', plural: 'Sjekklister' },
  interfaceName: 'ChecklistBlock',
  fields: [
    { name: 'title', label: 'Tittel', type: 'text', defaultValue: 'Sjekkliste før du kjøper' },
    {
      name: 'items',
      label: 'Punkter',
      type: 'array',
      fields: [{ name: 'text', label: 'Tekst', type: 'text', required: true }],
    },
  ],
}

export const guideBlocks: Block[] = [TipBlock, ComparisonTableBlock, ProductEmbedBlock, ChecklistBlock]
