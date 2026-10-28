import type { Metadata } from 'next'

import localFont from 'next/font/local'
import React from 'react'

import { CartProvider } from '@/components/cart/CartProvider'

import './globals.css'

// Inter is self-hosted from @fontsource-variable/inter, so neither the build nor visitors talk to Google Fonts.
const inter = localFont({
  src: '../../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  variable: '--font-inter',
  weight: '100 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'Hylla – teknologi for livet du lever', template: '%s · Hylla' },
  description: 'Hylla er en fiktiv norsk nettbutikk for elektronikk, laget som designprosjekt.',
}

/** The page shell and cart state. The shop and the checkout each add their own header and footer. */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nb" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#innhold"
          className="sr-only z-50 rounded-md bg-brand px-4 py-2 font-semibold text-white focus:not-sr-only focus:absolute focus:top-3 focus:left-3"
        >
          Hopp til innholdet
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
