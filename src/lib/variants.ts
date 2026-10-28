/** Variant selection, shared by the product page (server) and the buy box (client). */

export type VariantGroup = { name: string; label: string; options: { value: string; label: string }[] }

export type VariantData = {
  id: number
  sku: string | null
  price: number
  compareAtPrice: number | null
  inventory: number
  /** Variant type name → option value, e.g. { lagring: '2tb', minne: '32gb' }. */
  options: Record<string, string>
}

export type VariantSelection = Record<string, string>

export const findVariant = (variants: VariantData[], selection: VariantSelection) =>
  variants.find((variant) => Object.entries(variant.options).every(([name, value]) => selection[name] === value)) ?? null

/**
 * The variant to show first: the one named in the URL (`?lagring=2tb&minne=64gb`) if it exists,
 * otherwise the one priced like the product itself, otherwise the first in stock.
 */
export function initialVariant(
  variants: VariantData[],
  groups: VariantGroup[],
  params: Record<string, string | string[] | undefined>,
  basePrice: number | null,
): VariantData | null {
  const fromURL = Object.fromEntries(groups.map((group) => [group.name, String(params[group.name] ?? '')]))

  return (
    findVariant(variants, fromURL) ??
    variants.find((variant) => variant.price === basePrice && variant.inventory > 0) ??
    variants.find((variant) => variant.inventory > 0) ??
    variants[0] ??
    null
  )
}
