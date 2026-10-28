import type { Brand, Category, Product, Review, Variant, VariantOption, VariantType } from '@/payload-types'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { Crumb } from '@/components/site/Breadcrumbs'

import { type ProductSummary, toProductSummary } from './catalog'
import { type ImageData, toImage } from './media'
import { routes } from './routes'
import type { VariantData, VariantGroup } from './variants'

export type ProductPageData = {
  product: Product
  brand: Brand | null
  trail: Crumb[]
  department: Category | null
  gallery: ImageData[]
  variantGroups: VariantGroup[]
  variants: VariantData[]
  reviews: Review[]
  /** The first related products, offered as add-ons in the buy box. */
  addOns: ProductSummary[]
  related: ProductSummary[]
  freeShippingThreshold: number
  storePickup: string | null
}

const RELATED_COUNT = 4
const ADD_ON_COUNT = 3

const asDoc = <T extends object>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

const idOf = (value: unknown): number | null =>
  typeof value === 'number' ? value : (asDoc<{ id: number }>(value)?.id ?? null)

const docs = <T extends object>(values: unknown[] | null | undefined): T[] =>
  (values ?? []).map((value) => asDoc<T>(value)).filter((value): value is T => value !== null)

export const getProductPage = cache(async (slug: string): Promise<ProductPageData | null> => {
  const payload = await getPayload({ config })

  const { docs: found } = await payload.find({
    collection: 'products',
    depth: 1,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })
  const product = found[0]
  if (!product) return null

  // Breadcrumb: the product's subcategory and its department.
  const categories = docs<Category>(product.categories)
  const subcategory = categories.find((category) => category.parent) ?? null
  const departmentID = subcategory ? idOf(subcategory.parent) : (categories[0]?.id ?? null)
  const department =
    categories.find((category) => category.id === departmentID) ??
    (departmentID ? await payload.findByID({ collection: 'categories', id: departmentID, depth: 0 }) : null)
  const trail = [department, subcategory]
    .filter((category): category is Category => category !== null)
    .map((category) => ({ title: category.title, href: routes.category(category.slug ?? '') }))

  const relatedIDs = (product.related ?? []).map(idOf).filter((id): id is number => id !== null)
  const sameCategoryIDs = [subcategory?.id, department?.id].filter((id): id is number => typeof id === 'number')

  const [variantResult, { docs: reviews }, { docs: relatedDocs }, { docs: similarDocs }, settings] = await Promise.all([
    product.enableVariants
      ? payload.find({
          collection: 'variants',
          depth: 2,
          pagination: false,
          where: { and: [{ product: { equals: product.id } }, { _status: { equals: 'published' } }] },
        })
      : null,
    payload.find({ collection: 'reviews', depth: 0, limit: 10, sort: '-publishedAt', where: { product: { equals: product.id } } }),
    relatedIDs.length
      ? payload.find({
          collection: 'products',
          depth: 1,
          pagination: false,
          where: { and: [{ id: { in: relatedIDs } }, { _status: { equals: 'published' } }] },
        })
      : { docs: [] },
    sameCategoryIDs.length
      ? payload.find({
          collection: 'products',
          depth: 1,
          limit: RELATED_COUNT,
          sort: '-reviewCount',
          where: {
            and: [
              { _status: { equals: 'published' } },
              { categories: { in: sameCategoryIDs } },
              { id: { not_in: [product.id, ...relatedIDs] } },
            ],
          },
        })
      : { docs: [] },
    payload.findGlobal({ slug: 'store-settings', depth: 0 }),
  ])

  // Keep the editor's order for related products, then top up with the most reviewed in the same department.
  const relatedProducts = relatedIDs
    .map((id) => relatedDocs.find((doc) => doc.id === id))
    .filter((doc): doc is Product => Boolean(doc))
  const related = [...relatedProducts, ...similarDocs].slice(0, RELATED_COUNT).map((doc) => toProductSummary(doc))
  const addOns = relatedProducts
    .filter((doc) => !doc.enableVariants && (doc.inventory ?? 0) > 0)
    .slice(0, ADD_ON_COUNT)
    .map((doc) => toProductSummary(doc))

  const { variantGroups, variants } = toVariants(product, variantResult?.docs ?? [])
  const store = settings.deliveryMethods?.find((method) => method.method === 'store')

  return {
    product,
    brand: asDoc<Brand>(product.brand),
    trail,
    department,
    gallery: (product.gallery ?? []).map((media) => toImage(media, 'large')).filter((image) => image !== null),
    variantGroups,
    variants,
    reviews,
    addOns,
    related,
    freeShippingThreshold: settings.freeShippingThreshold ?? 1000,
    storePickup: store ? [store.label, store.description].filter(Boolean).join(' · ') : null,
  }
})

/** Groups the variants' options by variant type, in the order the product lists its types. */
function toVariants(product: Product, variantDocs: Variant[]) {
  const types = docs<VariantType>(product.variantTypes)
  const groups = new Map(types.map((type) => [type.id, { name: type.name, label: type.label, options: new Map<string, string>() }]))

  const variants: VariantData[] = variantDocs.map((variant) => {
    const options: Record<string, string> = {}
    for (const option of docs<VariantOption>(variant.options)) {
      const group = groups.get(idOf(option.variantType) ?? -1)
      if (!group) continue
      group.options.set(option.value, option.label)
      options[group.name] = option.value
    }

    return {
      id: variant.id,
      sku: variant.sku ?? null,
      price: variant.priceInNOK ?? 0,
      compareAtPrice: variant.compareAtPrice ?? null,
      inventory: variant.inventory ?? 0,
      options,
    }
  })

  const variantGroups = [...groups.values()]
    .filter((group) => group.options.size > 0)
    .map((group) => ({
      name: group.name,
      label: group.label,
      options: [...group.options]
        .map(([value, label]) => ({ value, label }))
        .sort((a, b) => a.label.localeCompare(b.label, 'nb', { numeric: true })),
    }))

  return { variantGroups, variants }
}
