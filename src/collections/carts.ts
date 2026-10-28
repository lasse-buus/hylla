import type { CollectionOverride } from '@payloadcms/plugin-ecommerce/types'
import type { CollectionBeforeChangeHook, Payload, PayloadRequest } from 'payload'

import { userIsAdmin } from '@/access'
import { MAX_PER_LINE } from '@/lib/cart'

export type CartItem = { product?: unknown; variant?: unknown; quantity?: number }

const idOf = (value: unknown): number | string | null => {
  if (typeof value === 'number' || typeof value === 'string') return value
  return (value as { id?: number | string } | null)?.id ?? null
}

/**
 * How many of a cart line can be bought right now, or null when the line can't be bought at all:
 * the product (or its variant) is unpublished, sold out, or the variant belongs to another product.
 */
export async function purchasableQuantity(
  item: CartItem,
  { payload, req }: { payload: Payload; req?: PayloadRequest },
): Promise<number | null> {
  const productID = idOf(item.product)
  const variantID = idOf(item.variant)
  if (productID === null) return null

  const product = await payload.findByID({
    collection: 'products',
    id: productID,
    depth: 0,
    disableErrors: true,
    select: { _status: true, inventory: true, enableVariants: true },
    req,
  })
  if (!product || product._status !== 'published') return null

  let inventory = product.inventory ?? 0
  if (product.enableVariants) {
    if (variantID === null) return null
    const variant = await payload.findByID({
      collection: 'variants',
      id: variantID,
      depth: 0,
      disableErrors: true,
      select: { _status: true, inventory: true, product: true },
      req,
    })
    if (!variant || variant._status !== 'published' || idOf(variant.product) !== productID) return null
    inventory = variant.inventory ?? 0
  }

  const quantity = Math.min(Math.max(1, Math.floor(Number(item.quantity) || 1)), inventory, MAX_PER_LINE)
  return quantity > 0 ? quantity : null
}

/**
 * Guests can post any cart contents to the API, so lines are checked here:
 * unpublished, sold-out or mismatched items are dropped, and quantities are capped at stock.
 * Runs before the plugin's own hook, so the subtotal is computed from the cleaned lines.
 */
const keepCartWithinStock: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!Array.isArray(data.items)) return data

  const items: CartItem[] = []
  for (const item of data.items as CartItem[]) {
    const quantity = await purchasableQuantity(item, { payload: req.payload, req })
    if (quantity !== null) items.push({ ...item, quantity })
  }

  return { ...data, items }
}

/**
 * Who owns a cart is decided by the server: a logged-in user's own ID, or nobody for a guest cart
 * (which the plugin then protects with a secret). Visitors can't link a cart to another account.
 */
const keepCartOwner: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  if (userIsAdmin(req.user)) return data
  const owner = originalDoc ? (originalDoc.customer ?? null) : (req.user?.id ?? null)
  return { ...data, customer: idOf(owner) }
}

export const cartsCollectionOverride: CollectionOverride = ({ defaultCollection }) => ({
  ...defaultCollection,
  labels: { singular: 'Handlekurv', plural: 'Handlekurver' },
  hooks: {
    ...defaultCollection.hooks,
    beforeChange: [keepCartOwner, keepCartWithinStock, ...(defaultCollection.hooks?.beforeChange ?? [])],
  },
})
