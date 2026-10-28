import type { TextField } from 'payload'

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * A unique slug that is generated from another field when left empty.
 */
export const slugField = (fromField = 'title'): TextField => ({
  name: 'slug',
  label: 'URL-navn',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
    description: `Lages automatisk fra «${fromField}» hvis feltet er tomt.`,
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return slugify(value)
        const source = data?.[fromField]
        return typeof source === 'string' ? slugify(source) : value
      },
    ],
  },
})
