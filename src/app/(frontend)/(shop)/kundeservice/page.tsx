import type { Metadata } from 'next'

import config from '@payload-config'
import { CreditCard, Headset, Info, Mail, MessageCircle, RotateCcw, Truck, Wrench } from 'lucide-react'
import { getPayload } from 'payload'

import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { FaqAccordion } from '@/components/site/FaqAccordion'
import { SectionNav } from '@/components/site/SectionNav'
import { getFaqGroups } from '@/lib/faq'
import { formatKroner, formatPrice } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Kundeservice',
  description: 'Levering, retur, reklamasjon, betaling og svar på vanlige spørsmål.',
}

/** The footer links straight to these sections, e.g. /kundeservice#retur. */
const sections = [
  { id: 'kontakt', label: 'Kontakt oss' },
  { id: 'levering', label: 'Levering og frakt' },
  { id: 'retur', label: 'Retur og åpent kjøp' },
  { id: 'reklamasjon', label: 'Reklamasjon og service' },
  { id: 'betaling', label: 'Betaling' },
  { id: 'sporsmal', label: 'Ofte stilte spørsmål' },
]

const contactChannels = [
  { Icon: MessageCircle, title: 'Chat', text: 'Raskeste vei til svar. Hverdager 08–20, lørdag 10–16.' },
  { Icon: Headset, title: 'Telefon', text: 'Snakk med en produktekspert. Hverdager 08–18.' },
  { Icon: Mail, title: 'Skjema', text: 'For saker som ikke haster. Vi svarer innen én virkedag.' },
]

const sectionClass = 'scroll-mt-24 rounded-xl bg-white p-6 sm:p-8'
const headingClass = 'flex items-center gap-3 text-[24px] font-bold tracking-[-0.4px]'
const iconClass = 'flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand'
const bodyClass = 'mt-4 max-w-[720px] text-[15px] leading-[1.65] text-subtle'

export default async function CustomerServicePage() {
  const payload = await getPayload({ config })
  const [settings, faqGroups] = await Promise.all([
    payload.findGlobal({ slug: 'store-settings', depth: 0 }),
    getFaqGroups(),
  ])
  const threshold = settings.freeShippingThreshold ?? 1000
  const deliveryMethods = settings.deliveryMethods ?? []

  const deliveryPrice = (price: number, freeAboveThreshold: boolean | null | undefined) => {
    if (price === 0) return 'Gratis'
    return freeAboveThreshold ? `${formatPrice(price)} · gratis over ${formatKroner(threshold)}` : formatPrice(price)
  }

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <Breadcrumbs trail={[]} current="Kundeservice" />

      <header className="mt-6 max-w-[720px]">
        <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-[-1.4px] sm:text-[52px]">Kundeservice</h1>
        <p className="mt-4 text-lg leading-[1.55] text-subtle">
          Vi er her for hele produktets levetid. Her finner du svar om levering, retur, reklamasjon og betaling.
        </p>
      </header>

      <p className="mt-6 flex max-w-[720px] items-start gap-3 rounded-xl bg-brand-soft px-5 py-4 text-sm leading-normal">
        <Info className="mt-0.5 size-[18px] shrink-0 text-brand" strokeWidth={1.8} aria-hidden="true" />
        Hylla er en fiktiv nettbutikk laget som designprosjekt. Kundeservice er ikke bemannet, og ingen varer blir sendt.
      </p>

      <div className="mt-6">
        <SectionNav
          sections={faqGroups.length ? sections : sections.filter((section) => section.id !== 'sporsmal')}
          label="Kundeservice"
        />
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <section id="kontakt" aria-labelledby="kontakt-tittel" className={sectionClass}>
          <h2 id="kontakt-tittel" className={headingClass}>
            Kontakt oss
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-3">
            {contactChannels.map(({ Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-2 rounded-lg border border-line p-5">
                <span className={iconClass}>
                  <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                </span>
                <h3 className="mt-1 text-base font-semibold">{title}</h3>
                <p className="text-sm leading-normal text-muted">{text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="levering" aria-labelledby="levering-tittel" className={sectionClass}>
          <h2 id="levering-tittel" className={headingClass}>
            <span className={iconClass}>
              <Truck className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            Levering og frakt
          </h2>
          <p className={bodyClass}>
            Fri frakt på bestillinger over {formatKroner(threshold)}. Bestiller du innen kl. 16 på en hverdag, sender vi
            samme dag.
          </p>
          {deliveryMethods.length ? (
            <dl className="mt-5 divide-y divide-line rounded-lg border border-line">
              {deliveryMethods.map((method) => (
                <div key={method.id ?? method.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 px-5 py-4">
                  <dt>
                    <span className="block text-[15px] font-semibold">{method.label}</span>
                    {method.description ? <span className="text-[13px] text-muted">{method.description}</span> : null}
                  </dt>
                  <dd className="text-sm font-semibold">{deliveryPrice(method.price, method.freeAboveThreshold)}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>

        <section id="retur" aria-labelledby="retur-tittel" className={sectionClass}>
          <h2 id="retur-tittel" className={headingClass}>
            <span className={iconClass}>
              <RotateCcw className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            Retur og åpent kjøp
          </h2>
          <p className={bodyClass}>
            Du har 30 dagers åpent kjøp på alle varer. Ombestemmer du deg, kan du levere varen gratis i en av butikkene våre
            eller sende den i retur. Varen bør være ubrukt og helst ligge i originalemballasjen. Pengene er tilbake på kontoen
            din innen 14 dager etter at vi har mottatt returen.
          </p>
        </section>

        <section id="reklamasjon" aria-labelledby="reklamasjon-tittel" className={sectionClass}>
          <h2 id="reklamasjon-tittel" className={headingClass}>
            <span className={iconClass}>
              <Wrench className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            Reklamasjon og service
          </h2>
          <p className={bodyClass}>
            Alle produkter har 2 års garanti, og du har 5 års reklamasjonsrett på varer som er ment å vare lenge, som
            datamaskiner og TV-er. Er noe feil med varen, hjelper vi deg med reparasjon, ny vare eller pengene tilbake.
          </p>
        </section>

        <section id="betaling" aria-labelledby="betaling-tittel" className={sectionClass}>
          <h2 id="betaling-tittel" className={headingClass}>
            <span className={iconClass}>
              <CreditCard className="size-5" strokeWidth={1.7} aria-hidden="true" />
            </span>
            Betaling
          </h2>
          <p className={bodyClass}>
            I en ekte butikk ville du betalt med kort, Vipps eller faktura. Hylla tar ikke imot betaling: kassen fullfører
            bestillingen uten at noe blir belastet.
          </p>
        </section>

        {faqGroups.length ? (
          <section id="sporsmal" aria-labelledby="sporsmal-tittel" className={sectionClass}>
            <h2 id="sporsmal-tittel" className={headingClass}>
              Ofte stilte spørsmål
            </h2>
            <div className="mt-6">
              <FaqAccordion groups={faqGroups} />
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}
