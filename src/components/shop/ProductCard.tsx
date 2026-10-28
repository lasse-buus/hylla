import type { ProductSummary } from '@/lib/catalog'

import Image from 'next/image'
import Link from 'next/link'

import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { formatPrice, formatStock } from '@/lib/format'

import { formatRating, StarRating } from './StarRating'

const stockText = (inventory: number) => {
  if (inventory <= 0) return 'Ikke på lager'
  return `${formatStock(inventory)} på lager · Sendes i dag`
}

type ProductCardProps = {
  product: ProductSummary
  /** Set on the first cards in view so the largest image loads early. */
  priority?: boolean
}

/** The product card used in category grids, search results, carousels and the mega menu. */
export function ProductCard({ product, priority = false }: ProductCardProps) {
  const inStock = product.inventory > 0
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price

  return (
    <article className="relative flex h-full flex-col rounded-xl bg-white p-5">
      <div className="relative mb-3.5 h-[190px] overflow-hidden rounded-lg bg-white">
        {product.image ? (
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            sizes="(min-width: 1360px) 300px, (min-width: 640px) 45vw, 100vw"
            loading={priority ? 'eager' : 'lazy'}
            className="object-cover"
          />
        ) : null}
        {product.tag ? (
          <span className="absolute top-0 left-0 rounded bg-brand-soft px-[9px] py-[5px] text-[10px] font-bold tracking-[0.4px] text-brand">
            {product.tag}
          </span>
        ) : null}
      </div>

      {product.brandName ? (
        <p className="mb-1 text-[11px] font-semibold tracking-[0.5px] text-muted uppercase">{product.brandName}</p>
      ) : null}
      <h3 className="min-h-[45px] text-base leading-[1.4] font-semibold">
        {/* The link covers the whole card; the CTA below sits above it. */}
        <Link href={product.href} className="after:absolute after:inset-0 after:rounded-xl hover:underline">
          {product.title}
        </Link>
      </h3>
      {product.shortSpecs ? <p className="mt-1 text-xs leading-[1.4] text-muted">{product.shortSpecs}</p> : null}

      {product.rating !== null ? (
        <p className="my-3 flex items-center gap-1.5 text-[11px] text-muted">
          <StarRating rating={product.rating} />
          <span>
            {formatRating(product.rating)} ({product.reviewCount})
          </span>
        </p>
      ) : (
        <div className="my-3" />
      )}

      <p className="flex items-baseline gap-2.5">
        <span className="text-[27px] font-bold tracking-[-0.5px]">{formatPrice(product.price)}</span>
        {onSale ? (
          <s className="text-[13px] text-muted">
            <span className="sr-only">Før </span>
            {formatPrice(product.compareAtPrice!)}
          </s>
        ) : null}
      </p>
      <p className="mt-2.5 mb-4 flex items-center gap-1.5 text-[11px] text-subtle">
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${inStock ? 'bg-success' : 'bg-steel'}`}
        />
        {stockText(product.inventory)}
      </p>

      <AddToCartButton
        productID={product.id}
        productTitle={product.title}
        href={product.href}
        inStock={inStock}
        hasVariants={product.hasVariants}
      />
    </article>
  )
}
