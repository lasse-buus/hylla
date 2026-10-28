import { Info } from 'lucide-react'

import { AccountBreadcrumbs } from '@/components/account/AccountBreadcrumbs'
import { AccountDraftProvider } from '@/components/account/AccountDraft'
import { AccountSidebar } from '@/components/account/AccountSidebar'
import { getMyAccountOrders } from '@/lib/account'
import { getShopCustomer } from '@/lib/shopSession'

/** The Min side frame. Each page checks the login itself (so it can return to the right page after logging in). */
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const customer = await getShopCustomer()
  if (!customer) return children

  const orders = await getMyAccountOrders(customer.id)
  const { firstName, lastName, email, phone, addresses, preferences } = customer

  return (
    <AccountDraftProvider initial={{ firstName, lastName, email, phone, addresses, preferences }}>
      <div className="shop-container pt-5 pb-[72px]">
        <AccountBreadcrumbs />
        <p role="note" className="mt-4 flex items-start gap-2.5 rounded-lg bg-warning-soft px-4 py-[11px] text-[13px] leading-[1.45] text-warning">
          <Info className="mt-px size-4 shrink-0" strokeWidth={1.8} aria-hidden="true" />
          <span>
            <strong className="font-semibold">Demokonto.</strong> Hylla er en fiktiv butikk. Personen, adressene og
            ordrene under er oppdiktet, og det du endrer her gjelder bare for dette besøket.
          </span>
        </p>
        <div className="mt-5 grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <AccountSidebar customerSince={customer.customerSince} orderCount={orders.length} />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </AccountDraftProvider>
  )
}
