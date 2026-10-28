import type { Category, Guide, Product } from '@/payload-types'

import config from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import { NAVIGATION_TAG } from '@/hooks/revalidateNavigation'

import { type ImageData, toImage } from './media'
import { routes } from './routes'

export type NavLink = { title: string; href: string }

export type NavImage = ImageData

export type NavDepartment = {
  slug: string
  title: string
  href: string
  icon: string | null
  groups: { title: string; links: NavLink[] }[]
  promo: {
    eyebrow: string | null
    title: string
    href: string
    price: number | null
    image: NavImage | null
  } | null
  guide: NavLink | null
}

export type Navigation = {
  departments: NavDepartment[]
  freeShippingThreshold: number
}

const asDoc = <T extends object>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

const groupLinks = (children: Category[]): NavDepartment['groups'] => {
  const groups = new Map<string, NavLink[]>()

  for (const child of children) {
    const groupTitle = child.menuGroup || 'Kategorier'
    const links = groups.get(groupTitle) ?? []
    links.push({ title: child.title, href: routes.category(child.slug ?? '') })
    groups.set(groupTitle, links)
  }

  return [...groups].map(([title, links]) => ({ title, links }))
}

async function loadNavigation(): Promise<Navigation> {
  const payload = await getPayload({ config })

  const [{ docs: categories }, settings] = await Promise.all([
    payload.find({
      collection: 'categories',
      depth: 1,
      limit: 500,
      pagination: false,
      sort: 'sortOrder',
    }),
    payload.findGlobal({ slug: 'store-settings', depth: 0 }),
  ])

  const parentID = (category: Category) =>
    typeof category.parent === 'object' ? category.parent?.id : category.parent

  const departments = categories
    .filter((category) => !category.parent)
    .map((department): NavDepartment => {
      const children = categories.filter((category) => parentID(category) === department.id)
      const product = asDoc<Product>(department.menuPromo?.product)
      const guide = asDoc<Guide>(department.menuPromo?.guide)

      return {
        slug: department.slug ?? '',
        title: department.title,
        href: routes.category(department.slug ?? ''),
        icon: department.icon ?? null,
        groups: groupLinks(children),
        promo: product
          ? {
              eyebrow: department.menuPromo?.eyebrow ?? null,
              title: product.title,
              href: routes.product(product.slug ?? ''),
              price: product.priceInNOK ?? null,
              image: toImage(department.menuPromo?.image),
            }
          : null,
        guide: guide ? { title: guide.title, href: routes.guide(guide.slug ?? '') } : null,
      }
    })

  return {
    departments,
    freeShippingThreshold: settings.freeShippingThreshold ?? 1000,
  }
}

/**
 * Header and footer data, cached across requests and cleared by the
 * collection hooks in `src/hooks/revalidateNavigation.ts` when content changes.
 */
export const getNavigation = unstable_cache(loadNavigation, ['navigation'], {
  tags: [NAVIGATION_TAG],
  revalidate: 3600,
})
