import type { Metadata } from 'next'

import { DemoUnavailableButton } from '@/components/account/DemoUnavailableButton'
import { ProfileForm } from '@/components/account/ProfileForm'
import { routes } from '@/lib/routes'
import { requireShopCustomer } from '@/lib/shopSession'

export const metadata: Metadata = {
  title: 'Profil og innlogging',
  robots: { index: false },
}

const outlineButton = 'inline-flex h-10 items-center rounded-md border-[1.5px] border-ink bg-white px-4 text-[13px] font-semibold hover:bg-surface'

export default async function AccountProfilePage() {
  await requireShopCustomer(routes.accountProfile)

  return (
    <section aria-labelledby="profil-tittel" className="flex flex-col gap-4">
      <div>
        <h1 id="profil-tittel" className="text-[32px] font-extrabold tracking-[-1px] sm:text-4xl">
          Profil og innlogging
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">Opplysningene brukes i kassen og når vi sender deg ordrebekreftelser.</p>
      </div>

      <ProfileForm />

      <section aria-labelledby="innlogging-tittel" className="flex flex-col gap-3.5 rounded-xl bg-white p-6">
        <h2 id="innlogging-tittel" className="text-lg font-bold">
          Innlogging
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-3.5">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">Passord</span>
            <span className="text-[13px] text-muted">Sist endret 14. august 2026</span>
          </span>
          <DemoUnavailableButton className={outlineButton}>Endre passord</DemoUnavailableButton>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold">Logg inn med Vipps</span>
            <span className="text-[13px] text-muted">Koblet til mobilnummeret ditt</span>
          </span>
          <DemoUnavailableButton className="py-1 text-[13px] font-semibold text-brand hover:underline">Koble fra</DemoUnavailableButton>
        </div>
      </section>

      <section aria-labelledby="personvern-tittel" className="flex flex-col gap-3 rounded-xl bg-white p-6">
        <h2 id="personvern-tittel" className="text-lg font-bold">
          Personvern
        </h2>
        <p className="text-sm leading-[1.55] text-subtle">
          Du kan når som helst laste ned opplysningene vi har om deg, eller slette kontoen. Ordrer vi må ta vare på etter
          bokføringsloven, anonymiseres.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <DemoUnavailableButton className={`${outlineButton} h-[42px]`}>Last ned dataene mine</DemoUnavailableButton>
          <DemoUnavailableButton className={`${outlineButton} h-[42px] border-danger text-danger hover:bg-danger/5`}>
            Slett kontoen
          </DemoUnavailableButton>
        </div>
      </section>
    </section>
  )
}
