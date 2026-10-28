import type { Metadata } from 'next'

import { CartView } from '@/components/cart/CartView'
import { ProductCard } from '@/components/shop/ProductCard'
import { getPopularProducts } from '@/lib/catalog'
import { getNavigation } from '@/lib/navigation'

export const metadata: Metadata = {
  title: 'Handlekurv',
  robots: { index: false },
}

/** The cart lives in the visitor's browser, so the page renders it client-side around server-loaded extras. */
export default async function CartPage() {
  const [{ freeShippingThreshold }, popular] = await Promise.all([getNavigation(), getPopularProducts(4)])

  return (
    <div className="shop-container pt-8">
      <CartView freeShippingThreshold={freeShippingThreshold} />

      {popular.length ? (
        <section aria-labelledby="populaert-tittel" className="pt-16 pb-[72px]">
          <h2 id="populaert-tittel" className="mb-2 text-[30px] font-bold tracking-[-0.6px]">
            Populært akkurat nå
          </h2>
          <p className="mb-6 text-[15px] text-muted">Produktene kundene våre vurderer høyest.</p>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
            {popular.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  )
}
