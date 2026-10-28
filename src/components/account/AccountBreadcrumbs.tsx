'use client'

import { usePathname } from 'next/navigation'

import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { routes } from '@/lib/routes'

const titles: Record<string, string> = {
  [routes.accountOrders]: 'Ordrer',
  [routes.accountAddresses]: 'Adresser',
  [routes.accountProfile]: 'Profil og innlogging',
  [routes.accountNotifications]: 'Nyhetsbrev og varsler',
}

/** Hjem › Min side › the current section (or order). */
export function AccountBreadcrumbs() {
  const pathname = usePathname()
  if (pathname === routes.account) return <Breadcrumbs trail={[]} current="Min side" />

  const orderNumber = pathname.startsWith(`${routes.accountOrders}/`) ? pathname.split('/').pop() : null
  const current = orderNumber ? `Ordre #${orderNumber}` : (titles[pathname] ?? 'Min side')
  return <Breadcrumbs trail={[{ title: 'Min side', href: routes.account }]} current={current} />
}
