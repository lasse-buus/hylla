import type { Metadata } from 'next'

import { AddressBook } from '@/components/account/AddressBook'
import { routes } from '@/lib/routes'
import { requireShopCustomer } from '@/lib/shopSession'

export const metadata: Metadata = {
  title: 'Adresser',
  robots: { index: false },
}

export default async function AccountAddressesPage() {
  await requireShopCustomer(routes.accountAddresses)

  return (
    <section aria-labelledby="adresser-tittel" className="flex flex-col gap-4">
      <div>
        <h1 id="adresser-tittel" className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">
          Adresser
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">
          Kassen bruker den lagrede standardadressen. Endringer her gjelder bare for dette besøket.
        </p>
      </div>
      <AddressBook />
    </section>
  )
}
