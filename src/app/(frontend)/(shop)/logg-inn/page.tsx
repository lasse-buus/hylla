import type { Metadata } from 'next'

import { Info } from 'lucide-react'
import { redirect } from 'next/navigation'

import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD } from '@/lib/demoAccount'
import { getShopCustomer, safeReturnPath } from '@/lib/shopSession'

import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: 'Logg inn',
  robots: { index: false },
}

export default async function LoginPage(props: PageProps<'/logg-inn'>) {
  const { neste } = await props.searchParams
  const returnTo = safeReturnPath(typeof neste === 'string' ? neste : null)
  if (await getShopCustomer()) redirect(returnTo)

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <Breadcrumbs trail={[]} current="Logg inn" />

      <section aria-labelledby="logg-inn" className="mx-auto mt-10 max-w-[460px] rounded-2xl bg-white p-7 sm:p-9">
        <h1 id="logg-inn" className="text-[30px] font-extrabold tracking-[-0.8px]">
          Logg inn
        </h1>
        <p className="mt-2 text-[15px] leading-normal text-subtle">
          Se bestillingene dine, følg pakker og endre innstillingene på Min side.
        </p>

        <p className="mt-5 flex items-start gap-2.5 rounded-lg bg-brand-soft px-4 py-3 text-[13px] leading-normal">
          <Info className="mt-px size-4 shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
          Hylla er en fiktiv butikk. Du logger inn som demokunden Lasse Nielsen, og alt du endrer gjelder bare for
          besøket ditt.
        </p>

        <div className="mt-6">
          <LoginForm email={DEMO_ACCOUNT_EMAIL} password={DEMO_ACCOUNT_PASSWORD} returnTo={returnTo} />
        </div>
      </section>
    </div>
  )
}
