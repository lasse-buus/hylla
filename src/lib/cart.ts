import type { Brand, Cart, Media, Product, Variant, VariantOption } from '@/payload-types'

import { VAT_RATE } from '@/collections/orders/constants'

import { toImage, type ImageData } from './media'
import { routes } from './routes'

/** The most of one product or variant a single cart line can hold. */
export const MAX_PER_LINE = 9

/**
 * What the cart provider asks Payload for: the product, variant, brand and image
 * fields the cart page shows, and nothing more.
 */
export const cartsFetchQuery = {
  depth: 2,
  populate: {
    products: {
      title: true,
      slug: true,
      shortSpecs: true,
      priceInNOK: true,
      compareAtPrice: true,
      inventory: true,
      gallery: true,
      brand: true,
    },
    variants: { options: true, priceInNOK: true, compareAtPrice: true, inventory: true },
    brands: { name: true },
    media: { alt: true, url: true, sizes: true, width: true, height: true },
    variantOptions: { label: true },
  },
} as const

export type CartLine = {
  /** The cart item's own ID, used by increment/decrement/remove. */
  id: string
  productID: number
  variantID: number | null
  title: string
  href: string
  brandName: string | null
  details: string | null
  image: ImageData | null
  price: number
  compareAtPrice: number | null
  inventory: number
  quantity: number
}

const asDoc = <T extends object>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

/**
 * Cart items with their product populated. An item whose product the visitor can't read
 * (unpublished since it was added) is left out; the server drops it on the next change.
 */
export function toCartLines(cart: Cart | undefined): CartLine[] {
  return (cart?.items ?? []).flatMap((item): CartLine[] => {
    const product = asDoc<Product>(item.product)
    if (!item.id || !product?.title) return []
    const variant = asDoc<Variant>(item.variant)
    const variantLabel = (variant?.options ?? [])
      .map((option) => asDoc<VariantOption>(option)?.label)
      .filter(Boolean)
      .join(' · ')

    return [
      {
        id: item.id,
        productID: product.id,
        variantID: variant?.id ?? null,
        title: product.title,
        href: routes.product(product.slug ?? ''),
        brandName: asDoc<Brand>(product.brand)?.name ?? null,
        details: variantLabel || product.shortSpecs || null,
        image: toImage(asDoc<Media>(product.gallery?.[0]), 'thumbnail'),
        price: (variant ? variant.priceInNOK : product.priceInNOK) ?? 0,
        compareAtPrice: (variant ? variant.compareAtPrice : product.compareAtPrice) ?? null,
        inventory: (variant ? variant.inventory : product.inventory) ?? 0,
        quantity: item.quantity,
      },
    ]
  })
}

export const cartItemCount = (cart: Cart | undefined) =>
  (cart?.items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0)

/** Item count, what the items cost, what they would have cost before any sale, and the VAT included. */
export function cartTotals(lines: CartLine[]) {
  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const savings = lines.reduce(
    (sum, line) => sum + Math.max(0, (line.compareAtPrice ?? line.price) - line.price) * line.quantity,
    0,
  )
  return { count, total, savings, vat: vatOf(total) }
}

/** The VAT included in a price (prices are shown with VAT). */
export const vatOf = (amount: number) => Math.round(amount - amount / (1 + VAT_RATE))
