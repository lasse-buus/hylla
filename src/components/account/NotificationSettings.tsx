'use client'

import type { AccountDraft } from './AccountDraft'

import { Check } from 'lucide-react'

import { customerInterests } from '@/lib/customerInterests'

import { useAccountDraft } from './AccountDraft'

type Preference = Exclude<keyof AccountDraft['preferences'], 'interests'>

const marketing: { key: Preference; label: string; description: string }[] = [
  { key: 'newsletter', label: 'Nyhetsbrev på e-post', description: 'Ukens kupp, nyheter og guider. Omtrent én gang i uken.' },
  { key: 'smsOffers', label: 'Tilbud på SMS', description: 'Korte varsler om de største kampanjene. Maks to i måneden.' },
]

const orderAlerts: { key: Preference; label: string; description: string }[] = [
  { key: 'deliverySms', label: 'Leveringsvarsel på SMS', description: 'Beskjed når pakken er sendt, og når den er på vei til deg.' },
  { key: 'backInStock', label: 'Varsel når en vare er tilbake på lager', description: 'For varer du har lagret i ønskelisten.' },
]

const cardClass = 'rounded-xl bg-white px-6 py-2'

/** Marketing and order notifications plus newsletter interests, for this visit only. */
export function NotificationSettings() {
  const { draft, update } = useAccountDraft()
  const { preferences } = draft

  const toggle = (key: Preference) =>
    update((current) => ({ ...current, preferences: { ...current.preferences, [key]: !current.preferences[key] } }))
  const toggleInterest = (value: string) =>
    update((current) => {
      const interests = current.preferences.interests
      return {
        ...current,
        preferences: {
          ...current.preferences,
          interests: interests.includes(value) ? interests.filter((interest) => interest !== value) : [...interests, value],
        },
      }
    })

  const switchRow = ({ key, label, description }: (typeof marketing)[number]) => (
    <label key={key} className="relative flex cursor-pointer items-center justify-between gap-5 border-t border-line py-4">
      <span className="flex flex-col gap-[3px]">
        <span className="text-[15px] font-semibold">{label}</span>
        <span className="text-[13px] leading-normal text-muted">{description}</span>
      </span>
      <input type="checkbox" role="switch" checked={preferences[key]} onChange={() => toggle(key)} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="relative h-[26px] w-11 shrink-0 rounded-full bg-steel transition-colors peer-checked:bg-brand peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand motion-reduce:transition-none after:absolute after:top-[3px] after:left-[3px] after:size-5 after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(14,23,40,0.25)] after:transition-transform peer-checked:after:translate-x-[18px] motion-reduce:after:transition-none"
      />
    </label>
  )

  return (
    <>
      <section aria-labelledby="markedsforing-tittel" className={cardClass}>
        <h2 id="markedsforing-tittel" className="pt-[18px] pb-1.5 text-lg font-bold">
          Tilbud og nyheter
        </h2>
        {marketing.map(switchRow)}
      </section>

      {preferences.newsletter ? (
        <section aria-labelledby="interesser-tittel" className="flex flex-col gap-3 rounded-xl bg-white px-6 py-[22px]">
          <h2 id="interesser-tittel" className="text-lg font-bold">
            Hva er du interessert i?
          </h2>
          <p className="text-[13px] text-muted">Vi tilpasser nyhetsbrevet etter avdelingene du velger.</p>
          <div role="group" aria-label="Interesser" className="flex flex-wrap gap-2">
            {customerInterests.map((interest) => {
              const on = preferences.interests.includes(interest.value)
              return (
                <button
                  key={interest.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleInterest(interest.value)}
                  className={`inline-flex h-[38px] items-center gap-2 rounded-full border px-4 text-[13px] font-semibold ${
                    on ? 'border-brand bg-brand-soft text-brand' : 'border-line bg-white hover:border-steel'
                  }`}
                >
                  {on ? <Check className="size-4" strokeWidth={2.2} aria-hidden="true" /> : null}
                  {interest.label}
                </button>
              )
            })}
          </div>
        </section>
      ) : null}

      <section aria-labelledby="ordrevarsler-tittel" className={cardClass}>
        <h2 id="ordrevarsler-tittel" className="pt-[18px] pb-1.5 text-lg font-bold">
          Varsler om bestillinger
        </h2>
        {orderAlerts.map(switchRow)}
        <p className="pb-4 text-xs text-muted">Kvitteringer og viktige beskjeder om ordren sendes alltid på e-post.</p>
      </section>
    </>
  )
}
