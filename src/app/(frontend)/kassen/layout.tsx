import { Lock } from 'lucide-react'
import Link from 'next/link'

import { CheckoutProgress } from '@/components/cart/CheckoutProgress'
import { Logo } from '@/components/site/Logo'
import { routes } from '@/lib/routes'

/** The checkout drops the shop's menus and search, so nothing pulls the visitor away mid-purchase. */
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="shop-container flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-[18px]">
          <Logo />
          <CheckoutProgress />
          <p className="hidden items-center gap-2 text-[13px] font-semibold text-subtle md:inline-flex">
            <Lock className="size-4 text-success" strokeWidth={1.8} aria-hidden="true" />
            Ingen ekte betaling
          </p>
        </div>
      </header>
      <main id="innhold" className="flex-1">
        {children}
      </main>
      <footer className="border-t border-line bg-white">
        <div className="shop-container flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-muted">
          <p>© {new Date().getFullYear()} Hylla. Fiktiv nettbutikk laget som designprosjekt.</p>
          <nav aria-label="Hjelp" className="flex flex-wrap gap-5">
            <Link href={routes.customerService} className="hover:text-ink hover:underline">
              Kundeservice
            </Link>
            <Link href={`${routes.customerService}#levering`} className="hover:text-ink hover:underline">
              Levering og frakt
            </Link>
            <Link href={`${routes.customerService}#retur`} className="hover:text-ink hover:underline">
              Retur og åpent kjøp
            </Link>
          </nav>
        </div>
      </footer>
    </>
  )
}
