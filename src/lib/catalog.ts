import type { Brand, Category, Guide, Product } from '@/payload-types'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { formatKroner } from './format'
import { type ImageData, toImage } from './media'
import type { FilterableProduct } from './productFilters'
import { routes } from './routes'

export type ProductSummary = FilterableProduct & {
  id: number
  title: string
  href: string
  brandName: string | null
  shortSpecs: string | null
  image: ImageData | null
  tag: string | null
  /** Variant products are bought from the product page, where a variant is chosen. */
  hasVariants: boolean
}

export type GuideSummary = {
  id: number
  title: string
  href: string
  kicker: string | null
  excerpt: string
  readingMinutes: number | null
  image: ImageData | null
}

export type CategoryLink = {
  slug: string
  title: string
  href: string
  icon: string | null
  productCount: number
}

export type CategoryPageData = {
  category: Category
  department: Category
  /** The parent department, when the page is a subcategory. */
  parent: Category | null
  subcategories: CategoryLink[]
  products: ProductSummary[]
  brands: { slug: string; name: string }[]
  guides: GuideSummary[]
  promoGuide: GuideSummary | null
  freeShippingThreshold: number
}

export const badgeLabels: Record<string, string> = {
  new: 'NYHET',
  bestseller: 'BESTSELGER',
  favorite: 'KUNDEFAVORITT',
  flagship: 'TOPPMODELL',
}

const asDoc = <T extends object>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

const idOf = (value: unknown): number | null =>
  typeof value === 'number' ? value : (asDoc<{ id: number }>(value)?.id ?? null)

/** A saving outranks the merchandising badge, as on the design's product cards. */
const productTag = (product: Product): string | null => {
  const price = product.priceInNOK ?? 0
  const saving = product.compareAtPrice ? product.compareAtPrice - price : 0
  if (saving > 0) return `SPAR ${formatKroner(saving).toUpperCase()}`
  return badgeLabels[product.badge ?? ''] ?? null
}

export const toProductSummary = (product: Product, slugByID = new Map<number, string>()): ProductSummary => {
  const brand = asDoc<Brand>(product.brand)

  return {
    id: product.id,
    title: product.title,
    href: routes.product(product.slug ?? ''),
    brandName: brand?.name ?? null,
    brandSlug: brand?.slug ?? null,
    shortSpecs: product.shortSpecs ?? null,
    image: toImage(product.gallery?.[0]),
    tag: productTag(product),
    hasVariants: Boolean(product.enableVariants),
    price: product.priceInNOK ?? 0,
    compareAtPrice: product.compareAtPrice ?? null,
    inventory: product.inventory ?? 0,
    rating: product.rating ?? null,
    reviewCount: product.reviewCount ?? 0,
    categorySlugs: (product.categories ?? [])
      .map((category) => slugByID.get(idOf(category) ?? -1))
      .filter((slug): slug is string => Boolean(slug)),
    createdAt: product.createdAt,
  }
}

/** The largest discount among the products, in whole percent (0 when nothing is on sale). */
export const maxDiscountPercent = (products: Pick<ProductSummary, 'price' | 'compareAtPrice'>[]) =>
  Math.max(
    0,
    ...products.map((product) =>
      product.compareAtPrice && product.compareAtPrice > product.price
        ? Math.round((1 - product.price / product.compareAtPrice) * 100)
        : 0,
    ),
  )

export const toGuideSummary = (guide: Guide): GuideSummary => ({
  id: guide.id,
  title: guide.title,
  href: routes.guide(guide.slug ?? ''),
  kicker: guide.kicker ?? null,
  excerpt: guide.excerpt,
  readingMinutes: guide.readingMinutes ?? null,
  image: toImage(guide.heroImage),
})

/** The brands among some products, for a brand filter, sorted by name. */
const brandsOf = (products: Product[]) => {
  const brands = new Map<string, string>()
  for (const product of products) {
    const brand = asDoc<Brand>(product.brand)
    if (brand?.slug) brands.set(brand.slug, brand.name)
  }
  return [...brands]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'nb'))
}

/**
 * Everything the category page needs. The whole category's products are loaded and
 * filtered in memory (see `productFilters.ts`): the demo catalog is small, and it gives
 * exact facet counts without a search index.
 */
export const getCategoryPage = cache(async (slug: string): Promise<CategoryPageData | null> => {
  const payload = await getPayload({ config })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    depth: 1,
    limit: 500,
    pagination: false,
    sort: 'sortOrder',
  })

  const category = categories.find((entry) => entry.slug === slug)
  if (!category) return null

  const parentID = (entry: Category) => idOf(entry.parent)
  const parent = categories.find((entry) => entry.id === parentID(category)) ?? null
  const department = parent ?? category
  const children = categories.filter((entry) => parentID(entry) === category.id)
  const slugByID = new Map(categories.map((entry) => [entry.id, entry.slug ?? '']))

  const [{ docs: products }, { docs: guides }, settings] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 1000,
      pagination: false,
      where: {
        and: [
          { _status: { equals: 'published' } },
          { categories: { in: [category.id, ...children.map((child) => child.id)] } },
        ],
      },
    }),
    payload.find({
      collection: 'guides',
      depth: 1,
      limit: 3,
      sort: '-publishedAt',
      where: {
        and: [{ _status: { equals: 'published' } }, { department: { equals: department.id } }],
      },
    }),
    payload.findGlobal({ slug: 'store-settings', depth: 0 }),
  ])

  const summaries = products.map((product) => toProductSummary(product, slugByID))
  const countIn = (categorySlug: string) =>
    summaries.filter((product) => product.categorySlugs.includes(categorySlug)).length


  const guideSummaries = guides.map(toGuideSummary)
  const menuGuideID = idOf(department.menuPromo?.guide)

  return {
    category,
    department,
    parent,
    subcategories: children.map((child) => ({
      slug: child.slug ?? '',
      title: child.title,
      href: routes.category(child.slug ?? ''),
      icon: child.icon ?? null,
      productCount: countIn(child.slug ?? ''),
    })),
    products: summaries,
    brands: brandsOf(products),
    guides: guideSummaries,
    promoGuide: guideSummaries.find((guide) => guide.id === menuGuideID) ?? guideSummaries[0] ?? null,
    freeShippingThreshold: settings.freeShippingThreshold ?? 1000,
  }
})

/** The most reviewed published products, for places with no better signal (e.g. the cart). */
export const getPopularProducts = cache(async (limit = 4): Promise<ProductSummary[]> => {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    limit,
    sort: '-reviewCount',
    where: { _status: { equals: 'published' } },
  })
  return docs.map((product) => toProductSummary(product))
})

const idsOf = (values: unknown[] | null | undefined): number[] =>
  (values ?? []).map(idOf).filter((id): id is number => id !== null)

/** Published products by ID, in the order given. Unpublished or deleted ones are left out. */
export const getProductSummaries = async (values: unknown[] | null | undefined): Promise<ProductSummary[]> => {
  const ids = idsOf(values)
  if (!ids.length) return []

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    pagination: false,
    where: { and: [{ id: { in: ids } }, { _status: { equals: 'published' } }] },
  })
  return ids
    .map((id) => docs.find((doc) => doc.id === id))
    .filter((doc): doc is Product => Boolean(doc))
    .map((doc) => toProductSummary(doc))
}

/**
 * In-stock products for a listing, optionally within some categories, biggest saving first,
 * then most reviewed. With `onSaleOnly`, only products priced below their compare-at price.
 * Filtered in memory because "price below compare-at price" compares two columns.
 */
export const getListingProducts = async ({
  categories,
  limit,
  onSaleOnly,
}: {
  categories?: unknown[] | null
  limit: number
  onSaleOnly: boolean
}): Promise<ProductSummary[]> => {
  const categoryIDs = idsOf(categories)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    depth: 1,
    pagination: false,
    where: {
      and: [
        { _status: { equals: 'published' } },
        ...(categoryIDs.length ? [{ categories: { in: categoryIDs } }] : []),
      ],
    },
  })
  const saving = (product: Product) => Math.max(0, (product.compareAtPrice ?? 0) - (product.priceInNOK ?? 0))

  return docs
    .filter((product) => (product.inventory ?? 0) > 0 && (!onSaleOnly || saving(product) > 0))
    .sort((a, b) => saving(b) - saving(a) || (b.reviewCount ?? 0) - (a.reviewCount ?? 0))
    .slice(0, limit)
    .map((product) => toProductSummary(product))
}

/** Published guides, newest first, or the ones given, in that order. */
export const getGuideSummaries = async ({
  guides,
  limit,
}: {
  guides?: unknown[] | null
  limit: number
}): Promise<GuideSummary[]> => {
  const ids = idsOf(guides)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'guides',
    depth: 1,
    limit: ids.length ? 0 : limit,
    pagination: ids.length === 0,
    sort: '-publishedAt',
    where: {
      and: [{ _status: { equals: 'published' } }, ...(ids.length ? [{ id: { in: ids } }] : [])],
    },
  })
  const ordered = ids.length
    ? ids.map((id) => docs.find((doc) => doc.id === id)).filter((doc): doc is Guide => Boolean(doc))
    : docs
  return ordered.slice(0, limit).map(toGuideSummary)
}

/** Categories as tiles: the ones given, or every department in menu order. */
export const getCategoryLinks = async (values: unknown[] | null | undefined): Promise<CategoryLink[]> => {
  const ids = idsOf(values)
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'categories',
    depth: 0,
    pagination: false,
    sort: 'sortOrder',
    where: ids.length ? { id: { in: ids } } : { parent: { exists: false } },
  })
  const ordered = ids.length
    ? ids.map((id) => docs.find((doc) => doc.id === id)).filter((doc): doc is Category => Boolean(doc))
    : docs
  return ordered.map((category) => ({
    slug: category.slug ?? '',
    title: category.title,
    href: routes.category(category.slug ?? ''),
    icon: category.icon ?? null,
    productCount: 0,
  }))
}

export type DealsPageData = {
  products: ProductSummary[]
  /** Departments, for the category filter (products carry their department's slug). */
  departments: { slug: string; title: string }[]
  brands: { slug: string; name: string }[]
}

/** Every published product priced below its compare-at price, for the "Ukens kupp" page. */
export const getDealsPage = cache(async (): Promise<DealsPageData> => {
  const payload = await getPayload({ config })
  const [{ docs: categories }, { docs: products }] = await Promise.all([
    payload.find({ collection: 'categories', depth: 0, pagination: false, sort: 'sortOrder' }),
    payload.find({
      collection: 'products',
      depth: 1,
      pagination: false,
      where: { and: [{ _status: { equals: 'published' } }, { compareAtPrice: { exists: true } }] },
    }),
  ])

  const onSale = products.filter((product) => (product.compareAtPrice ?? 0) > (product.priceInNOK ?? 0))
  const slugByID = new Map(categories.map((category) => [category.id, category.slug ?? '']))

  return {
    products: onSale.map((product) => toProductSummary(product, slugByID)),
    departments: categories
      .filter((category) => !category.parent)
      .map((category) => ({ slug: category.slug ?? '', title: category.title })),
    brands: brandsOf(onSale),
  }
})
