'use client'

import { Bell, Headset, LayoutGrid, LogOut, MapPin, Package, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { logOut } from '@/app/(frontend)/(shop)/logg-inn/actions'
import { routes } from '@/lib/routes'

import { clearAccountDraft, useAccountDraft } from './AccountDraft'

const sections = [
  { href: routes.account, label: 'Oversikt', Icon: LayoutGrid },
  { href: routes.accountOrders, label: 'Ordrer', Icon: Package },
  { href: routes.accountAddresses, label: 'Adresser', Icon: MapPin },
  { href: routes.accountProfile, label: 'Profil og innlogging', Icon: UserRound },
  { href: routes.accountNotifications, label: 'Nyhetsbrev og varsler', Icon: Bell },
]

const isActive = (pathname: string, href: string) =>
  href === routes.account ? pathname === href : pathname === href || pathname.startsWith(`${href}/`)

/** Who is logged in, the Min side sections, and the way out. */
export function AccountSidebar({ customerSince, orderCount }: { customerSince: string | null; orderCount: number }) {
  const pathname = usePathname()
  const { draft } = useAccountDraft()
  const initials = `${draft.firstName.charAt(0)}${draft.lastName.charAt(0)}`.toUpperCase()
  const since = customerSince
    ? new Intl.DateTimeFormat('nb-NO', { month: 'long', year: 'numeric' }).format(new Date(customerSince))
    : null

  return (
    <aside aria-label="Min side" className="flex flex-col gap-3">
      <div className="flex items-center gap-3.5 rounded-xl bg-white p-5">
        <span aria-hidden="true" className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-brand text-lg font-bold text-white">
          {initials}
        </span>
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="text-base font-bold">
            {draft.firstName} {draft.lastName}
          </span>
          <span className="truncate text-xs text-muted">{draft.email}</span>
          {since ? <span className="text-[11px] text-muted">Kunde siden {since}</span> : null}
        </span>
      </div>

      <nav aria-label="Seksjoner på Min side" className="rounded-xl bg-white p-2">
        <ul className="flex flex-col gap-0.5">
          {sections.map(({ href, label, Icon }) => {
            const active = isActive(pathname, href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center gap-3 rounded-lg px-3.5 py-3 text-sm ${
                    active ? 'bg-brand-soft font-semibold text-brand' : 'font-medium hover:bg-surface'
                  }`}
                >
                  <Icon className="size-[18px] shrink-0" strokeWidth={1.7} aria-hidden="true" />
                  <span className="flex-1">{label}</span>
                  {href === routes.accountOrders ? (
                    <span className="text-xs font-semibold text-muted">
                      {orderCount}
                      <span className="sr-only"> ordrer</span>
                    </span>
                  ) : null}
                </Link>
              </li>
            )
          })}
        </ul>
        <div className="mx-3.5 mt-2 flex flex-col gap-2.5 border-t border-line pt-3 pb-1.5 text-[13px] text-subtle">
          <Link href={routes.customerService} className="flex items-center gap-2.5 hover:text-ink hover:underline">
            <Headset className="size-4" strokeWidth={1.7} aria-hidden="true" />
            Kundeservice
          </Link>
          {/* Logging out forgets this visit's edits; placed orders stay until the nightly reset. */}
          <form action={logOut} onSubmit={clearAccountDraft}>
            <button type="submit" className="flex items-center gap-2.5 hover:text-ink hover:underline">
              <LogOut className="size-4" strokeWidth={1.7} aria-hidden="true" />
              Logg ut
            </button>
          </form>
        </div>
      </nav>
    </aside>
  )
}
