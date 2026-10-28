import type { GlobalConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import { isAdmin } from '@/access'
import { homeBlocks } from '@/blocks/homeBlocks'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Forside',
  admin: {
    group: 'Innhold',
    description: 'Seksjonene på forsiden. Legg til, fjern og dra dem i den rekkefølgen de skal vises.',
  },
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/')
        } catch {
          // Not running inside Next.js (seed script, migrations).
        }
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'layout',
      label: 'Seksjoner',
      type: 'blocks',
      blocks: homeBlocks,
    },
  ],
}
