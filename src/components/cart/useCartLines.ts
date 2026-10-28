'use client'

import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { useEffect, useState, useSyncExternalStore } from 'react'

import { toCartLines } from '@/lib/cart'

/** How long to wait for a stored cart before treating it as gone (e.g. removed by the nightly reset). */
const LOAD_TIMEOUT_MS = 4000

const noSubscription = () => () => {}

/** Whether the visitor has a cart ID stored by the cart provider. */
const useHasStoredCart = () =>
  useSyncExternalStore(
    noSubscription,
    () => Boolean(localStorage.getItem('cart')),
    () => true,
  )

/**
 * The cart as display lines. `isRestoring` is true while a cart saved in the browser is still loading,
 * so pages can show a placeholder instead of flashing "empty".
 */
export function useCartLines() {
  const cartState = useCart()
  const hasStoredCart = useHasStoredCart()
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), LOAD_TIMEOUT_MS)
    return () => clearTimeout(timer)
  }, [])

  return {
    ...cartState,
    lines: toCartLines(cartState.cart),
    isRestoring: !cartState.cart && hasStoredCart && !timedOut,
  }
}
