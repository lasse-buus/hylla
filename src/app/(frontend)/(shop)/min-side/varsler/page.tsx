import type { Metadata } from 'next'

import { NotificationSettings } from '@/components/account/NotificationSettings'
import { routes } from '@/lib/routes'
import { requireShopCustomer } from '@/lib/shopSession'

export const metadata: Metadata = {
  title: 'Nyhetsbrev og varsler',
  robots: { index: false },
}

export default async function AccountNotificationsPage() {
  await requireShopCustomer(routes.accountNotifications)

  return (
    <section aria-labelledby="nyhetsbrev-tittel" className="flex flex-col gap-4">
      <div>
        <h1 id="nyhetsbrev-tittel" className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">
          Nyhetsbrev og varsler
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">Bestem selv hva du vil høre fra oss, og hvor.</p>
      </div>
      <NotificationSettings />
    </section>
  )
}
