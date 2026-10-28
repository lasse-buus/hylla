import { Check } from 'lucide-react'
import Link from 'next/link'

import { formatKroner } from '@/lib/format'
import { routes } from '@/lib/routes'

export function ServiceBar({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const promises = [
    `Fri frakt over ${formatKroner(freeShippingThreshold)}`,
    '30 dagers åpent kjøp',
    'Sendes fra Norge',
  ]

  return (
    <div className="bg-navy text-white">
      <div className="shop-container flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2.5 text-[11px]">
        <ul className="flex flex-wrap gap-x-7 gap-y-1">
          {promises.map((promise, index) => (
            <li key={promise} className={`items-center gap-[7px] ${index === 0 ? 'inline-flex' : 'hidden sm:inline-flex'}`}>
              <Check className="size-[13px] text-brand-light" strokeWidth={2.4} aria-hidden="true" />
              {promise}
            </li>
          ))}
        </ul>
        <nav aria-label="Kundetype og hjelp" className="flex items-center gap-2.5 text-line">
          <span className="hidden items-center gap-2.5 sm:flex">
            <Link href={routes.home} className="text-white hover:underline">
              Privat
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/bedrift" className="hover:underline">
              Bedrift
            </Link>
          </span>
          <Link href={routes.customerService} className="hover:underline sm:ml-9">
            Kundeservice
          </Link>
        </nav>
      </div>
    </div>
  )
}
