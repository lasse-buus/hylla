'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { ShoppingBag, UserRound } from 'lucide-react'
import Link from 'next/link'

import { cartItemCount } from '@/lib/cart'
import { routes } from '@/lib/routes'

/** "Min side" and the cart, with the number of items in the visitor's cart. */
export function HeaderActions() {
  const { cart } = useCart()
  const cartCount = cartItemCount(cart)
  const countLabel = `${cartCount} ${cartCount === 1 ? 'vare' : 'varer'} i handlekurven`

  return (
    <nav aria-label="Konto og handlekurv" className="flex items-center gap-6 text-sm font-semibold">
      <Link href={routes.account} className="inline-flex items-center gap-2 hover:text-brand">
        <UserRound className="size-[23px]" strokeWidth={1.7} aria-hidden="true" />
        <span className="hidden sm:inline">Min side</span>
        <span className="sr-only sm:hidden">Min side</span>
      </Link>
      <Link href={routes.cart} className="inline-flex items-center gap-2 hover:text-brand">
        <ShoppingBag className="size-[23px]" strokeWidth={1.7} aria-hidden="true" />
        <span className="hidden sm:inline">Handlekurv</span>
        <span className="sr-only sm:hidden">Handlekurv</span>
        <span
          aria-label={countLabel}
          className="inline-flex h-[21px] min-w-[21px] items-center justify-center rounded-full bg-brand px-1.5 text-[11px] font-bold text-white"
        >
          {cartCount}
        </span>
      </Link>
    </nav>
  )
}
