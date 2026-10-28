'use client'

import { Bell, MapPin, UserRound } from 'lucide-react'
import Link from 'next/link'

import { customerInterests } from '@/lib/customerInterests'
import { routes } from '@/lib/routes'

import { useAccountDraft } from './AccountDraft'

const cardClass = 'flex flex-col gap-2.5 rounded-xl bg-white p-[22px]'
const headingClass = 'flex items-center gap-2.5 text-[15px] font-bold'
const linkClass = 'mt-auto self-start py-1 text-[13px] font-semibold text-brand hover:underline'

/** Delivery address, newsletter and profile as edited during this visit. */
export function OverviewCards() {
  const { draft } = useAccountDraft()
  const address = draft.addresses.find((candidate) => candidate.isDefault) ?? draft.addresses[0]
  const { newsletter, interests } = draft.preferences
  const chosen = customerInterests.filter((interest) => interests.includes(interest.value)).map((interest) => interest.label)
  const phone = draft.phone.replace(/^(\d{3})(\d{2})(\d{3})$/, '$1 $2 $3')

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-4">
      <article className={cardClass}>
        <h2 className={headingClass}>
          <MapPin className="size-[18px] text-brand" strokeWidth={1.7} aria-hidden="true" />
          Leveringsadresse
        </h2>
        <p className="text-sm leading-[1.55] text-subtle">
          {draft.firstName} {draft.lastName}
          {address ? (
            <>
              <br />
              {address.addressLine}
              <br />
              {address.postalCode} {address.city}
            </>
          ) : null}
        </p>
        <Link href={routes.accountAddresses} className={linkClass}>
          Administrer adresser
        </Link>
      </article>

      <article className={cardClass}>
        <h2 className={headingClass}>
          <Bell className="size-[18px] text-brand" strokeWidth={1.7} aria-hidden="true" />
          Nyhetsbrev
        </h2>
        <p className="flex items-center gap-2 text-sm text-subtle">
          <span aria-hidden="true" className={`size-2 rounded-full ${newsletter ? 'bg-success' : 'bg-steel'}`} />
          {newsletter ? 'Påmeldt nyhetsbrev på e-post' : 'Ikke påmeldt'}
        </p>
        <p className="text-[13px] leading-normal text-muted">
          {newsletter
            ? chosen.length
              ? `Interesser: ${chosen.join(', ')}`
              : 'Ingen interesser valgt'
            : 'Meld deg på for tilbud og tips.'}
        </p>
        <Link href={routes.accountNotifications} className={linkClass}>
          Endre innstillinger
        </Link>
      </article>

      <article className={cardClass}>
        <h2 className={headingClass}>
          <UserRound className="size-[18px] text-brand" strokeWidth={1.7} aria-hidden="true" />
          Profil
        </h2>
        <p className="text-sm leading-[1.55] break-all text-subtle">
          {draft.email}
          <br />
          +47 {phone}
        </p>
        <Link href={routes.accountProfile} className={linkClass}>
          Endre profil
        </Link>
      </article>
    </div>
  )
}

/** "Hei, Lasse!" with the name as edited during this visit. */
export function AccountGreeting() {
  const { draft } = useAccountDraft()
  return <>Hei, {draft.firstName}!</>
}

