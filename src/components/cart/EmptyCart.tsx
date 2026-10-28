import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'

import { routes } from '@/lib/routes'

export function EmptyCart() {
  return (
    <section className="mt-6 flex flex-col items-center gap-3.5 rounded-2xl bg-white px-6 py-16 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
        <ShoppingBag className="size-7" strokeWidth={1.7} aria-hidden="true" />
      </span>
      <h2 className="text-[22px] font-bold">Handlekurven din er tom</h2>
      <p className="text-[15px] text-muted">Finn noe du liker, så tar vi vare på det her.</p>
      <Link
        href={routes.home}
        className="mt-1.5 inline-flex h-[46px] items-center rounded-md bg-brand px-[22px] text-sm font-semibold text-white hover:bg-brand-hover"
      >
        Fortsett å handle
      </Link>
    </section>
  )
}
