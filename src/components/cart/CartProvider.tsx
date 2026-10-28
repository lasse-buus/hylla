'use client'

import { EcommerceProvider } from '@payloadcms/plugin-ecommerce/client/react'

import { cartsFetchQuery } from '@/lib/cart'
import { NOK } from '@/lib/currency'

const currenciesConfig = { defaultCurrency: 'NOK', supportedCurrencies: [NOK] }
const api = { cartsFetchQuery }

/**
 * The ecommerce plugin's client state: a guest cart whose ID and secret live in localStorage.
 * Nothing about the visitor is stored, in line with the shop's no-personal-data rule.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <EcommerceProvider api={api} currenciesConfig={currenciesConfig} customersSlug="users" enableVariants>
      {children}
    </EcommerceProvider>
  )
}
