'use client'

import { Check, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { useAddToCart } from './useAddToCart'

const ADDED_FEEDBACK_MS = 2000

type AddToCartButtonProps = {
  productID: number
  productTitle: string
  href: string
  inStock: boolean
  hasVariants: boolean
}

/** The product card's buy button. Variant products send the shopper to the product page to choose one. */
export function AddToCartButton({ productID, productTitle, href, inStock, hasVariants }: AddToCartButtonProps) {
  const addToCart = useAddToCart()
  const [status, setStatus] = useState<'idle' | 'adding' | 'added'>('idle')

  useEffect(() => {
    if (status !== 'added') return
    const timer = setTimeout(() => setStatus('idle'), ADDED_FEEDBACK_MS)
    return () => clearTimeout(timer)
  }, [status])

  const className =
    'relative mt-auto flex h-10 items-center justify-center gap-2.5 rounded-md text-[13px] font-semibold'

  if (hasVariants) {
    return (
      <Link href={href} tabIndex={-1} aria-hidden="true" className={`${className} bg-brand text-white hover:bg-brand-hover`}>
        Velg variant
      </Link>
    )
  }

  if (!inStock) {
    return (
      <button type="button" disabled className={`${className} bg-line text-muted`}>
        Utsolgt
      </button>
    )
  }

  const add = async () => {
    setStatus('adding')
    await addToCart([{ product: productID }])
    setStatus('added')
  }

  return (
    <button
      type="button"
      onClick={add}
      disabled={status === 'adding'}
      aria-label={`Legg ${productTitle} i handlekurven`}
      className={`${className} text-white disabled:opacity-70 ${status === 'added' ? 'bg-success' : 'bg-brand hover:bg-brand-hover'}`}
    >
      {status === 'added' ? (
        <>
          <Check className="size-4" strokeWidth={2.2} aria-hidden="true" />
          Lagt i handlekurven
        </>
      ) : (
        <>
          <ShoppingCart className="size-4" strokeWidth={1.8} aria-hidden="true" />
          Legg i handlekurv
        </>
      )}
      <span role="status" className="sr-only">
        {status === 'added' ? `${productTitle} er lagt i handlekurven` : ''}
      </span>
    </button>
  )
}
