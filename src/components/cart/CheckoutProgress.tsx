'use client'

import { usePathname } from 'next/navigation'

import { routes } from '@/lib/routes'

import { CheckoutSteps } from './CheckoutSteps'

/** The step indicator in the checkout header, which is shared by the checkout and the confirmation page. */
export function CheckoutProgress() {
  const pathname = usePathname()
  return <CheckoutSteps current={pathname === routes.orderConfirmation ? 'Fullført' : 'Levering'} />
}
