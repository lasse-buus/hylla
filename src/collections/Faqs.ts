import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig, Where } from 'payload'

import { revalidatePath } from 'next/cache'

import { anyone, isAdmin } from '@/access'

export const faqTopics = [
  { label: 'Bestilling', value: 'bestilling' },
  { label: 'Levering', value: 'levering' },
  { label: 'Retur', value: 'retur' },
  { label: 'Reklamasjon', value: 'reklamasjon' },
  { label: 'Betaling', value: 'betaling' },
  { label: 'Personvern', value: 'personvern' },
] as const

/** The customer service page lists these, so it is refreshed when one changes. */
const revalidate = () => {
  try {
    revalidatePath('/kundeservice')
  } catch {
    // Not running inside Next.js (seed script, migrations).
  }
}

const revalidateAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidate()
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate()
  return doc
}

/** Shop-wide questions and answers for customer service. Product-specific ones live on the product. */
export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: { singular: 'Spørsmål og svar', plural: 'Spørsmål og svar' },
  admin: {
    group: 'Innhold',
    useAsTitle: 'question',
    defaultColumns: ['question', 'topic', 'sortOrder'],
    description: 'Vises under «Ofte stilte spørsmål» på kundeservicesiden, gruppert etter tema.',
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: anyone,
    update: isAdmin,
  },
  defaultSort: 'sortOrder',
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'question', label: 'Spørsmål', type: 'text', required: true },
    { name: 'answer', label: 'Svar', type: 'textarea', required: true },
    {
      name: 'parent',
      label: 'Oppfølging av',
      type: 'relationship',
      relationTo: 'faqs',
      // Only one level of nesting: a follow-up can't have follow-ups of its own.
      filterOptions: ({ id }): Where => ({
        and: [{ parent: { exists: false } }, ...(id ? [{ id: { not_equals: id } }] : [])],
      }),
      admin: {
        description: 'Velg et spørsmål for å vise dette som et oppfølgingsspørsmål under det. Temaet arves da fra spørsmålet.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'topic',
          label: 'Tema',
          type: 'select',
          options: [...faqTopics],
          admin: { condition: (data) => !data?.parent },
          validate: (value: unknown, { siblingData }: { siblingData: { parent?: unknown } }) =>
            Boolean(value) || Boolean(siblingData?.parent) || 'Velg et tema.',
        },
        {
          name: 'sortOrder',
          label: 'Sortering',
          type: 'number',
          defaultValue: 0,
          admin: { description: 'Lavest først, innenfor temaet eller under spørsmålet.' },
        },
      ],
    },
  ],
}
