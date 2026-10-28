import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Fragment } from 'react'

import { routes } from '@/lib/routes'

export type Crumb = { title: string; href: string }

/** Hjem › …trail › current page. */
export function Breadcrumbs({ trail, current }: { trail: Crumb[]; current: string }) {
  const separator = (
    <li aria-hidden="true" className="flex">
      <ChevronRight className="size-3" strokeWidth={2} />
    </li>
  )

  return (
    <nav aria-label="Brødsmuler">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
        {[{ title: 'Hjem', href: routes.home }, ...trail].map((crumb) => (
          <Fragment key={crumb.href}>
            <li>
              <Link href={crumb.href} className="hover:text-ink hover:underline">
                {crumb.title}
              </Link>
            </li>
            {separator}
          </Fragment>
        ))}
        <li aria-current="page" className="font-semibold text-ink">
          {current}
        </li>
      </ol>
    </nav>
  )
}
