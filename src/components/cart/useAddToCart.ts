'use client'

import { useEcommerce } from '@payloadcms/plugin-ecommerce/client/react'
import { useCallback, useLayoutEffect, useRef } from 'react'

type CartItemInput = { product: number; variant?: number; quantity?: number }

const CART_CREATE_TIMEOUT_MS = 3000

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(resolve))

/**
 * Adds one or more items in sequence. The plugin's `addItem` creates the cart on first use,
 * but a callback captured before that render still sees "no cart" and would create a second one,
 * so each call goes through the latest `addItem`, waiting for a new cart's ID to reach state first.
 */
export function useAddToCart() {
  const { addItem, cartID } = useEcommerce()
  const latest = useRef({ addItem, cartID })

  useLayoutEffect(() => {
    latest.current = { addItem, cartID }
  })

  return useCallback(async (items: CartItemInput[]) => {
    for (const { product, variant, quantity = 1 } of items) {
      const hadCart = Boolean(latest.current.cartID)
      await latest.current.addItem({ product, variant }, quantity)

      if (!hadCart) {
        const started = Date.now()
        while (!latest.current.cartID && Date.now() - started < CART_CREATE_TIMEOUT_MS) await nextFrame()
      }
    }
  }, [])
}
