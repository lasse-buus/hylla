import Link from 'next/link'

import { routes } from '@/lib/routes'

import { FacebookIcon, InstagramIcon, YoutubeIcon } from '../icons'
import { Logo } from '../Logo'
import { NewsletterForm } from './NewsletterForm'

const linkGroups = [
  {
    title: 'Kundeservice',
    links: [
      { title: 'Kontakt oss', href: `${routes.customerService}#kontakt` },
      { title: 'Levering og frakt', href: `${routes.customerService}#levering` },
      { title: 'Retur og åpent kjøp', href: `${routes.customerService}#retur` },
      { title: 'Reklamasjon og service', href: `${routes.customerService}#reklamasjon` },
      { title: 'Ofte stilte spørsmål', href: `${routes.customerService}#sporsmal` },
    ],
  },
  {
    title: 'Handle hos Hylla',
    links: [
      { title: 'Min side', href: routes.account },
      { title: 'Spor bestillingen din', href: '/min-side/ordrer' },
      { title: 'Betaling og finansiering', href: `${routes.customerService}#betaling` },
      { title: 'Gavekort', href: '/gavekort' },
      { title: 'Hylla for bedrifter', href: '/bedrift' },
    ],
  },
  {
    title: 'Om Hylla',
    links: [
      { title: 'Dette er oss', href: '/om-oss' },
      { title: 'Jobb hos oss', href: '/om-oss/jobb' },
      { title: 'Bærekraft og gjenvinning', href: '/om-oss/baerekraft' },
      { title: 'Presse', href: '/om-oss/presse' },
      { title: 'Personvern og vilkår', href: '/personvern' },
    ],
  },
]

const socialLinks = [
  { label: 'Hylla på Instagram', href: 'https://www.instagram.com', Icon: InstagramIcon },
  { label: 'Hylla på Facebook', href: 'https://www.facebook.com', Icon: FacebookIcon },
  { label: 'Hylla på YouTube', href: 'https://www.youtube.com', Icon: YoutubeIcon },
]

const paymentMethods = ['VISA', 'Mastercard', 'Vipps', 'Klarna']

export function SiteFooter() {
  return (
    <footer className="text-white">
      <section aria-labelledby="newsletter-title" className="bg-brand">
        <div className="shop-container flex flex-wrap items-center justify-between gap-x-12 gap-y-6 py-[38px]">
          <div className="flex-[1_1_420px]">
            <h2 id="newsletter-title" className="mb-2.5 text-[30px] font-bold tracking-[-0.6px]">
              Få det beste fra Hylla i innboksen.
            </h2>
            <p className="text-[15px] text-brand-soft">Gode tilbud, nyheter og smarte tips. Rett til deg.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>

      <div className="bg-navy">
        <div className="shop-container pt-12 pb-6">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
            <div>
              <Logo tone="light" />
              <p className="mt-[18px] mb-5 max-w-[270px] text-[13px] leading-relaxed text-steel">
                Teknologi for livet du lever. Fra smarte hverdagshjelpere til ditt neste gamingoppsett.
              </p>
              <ul className="flex gap-3">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      aria-label={label}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="flex size-8 items-center justify-center rounded-full border border-navy-border hover:border-white"
                    >
                      <Icon className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {linkGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <h3 className="mb-4 text-sm font-semibold">{group.title}</h3>
                <ul className="flex flex-col gap-[15px] text-[13px] text-steel">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="hover:text-white hover:underline">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div className="my-9 h-px bg-navy-line" />

          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul aria-label="Betalingsmåter" className="flex flex-wrap gap-2">
              {paymentMethods.map((method) => (
                <li key={method} className="rounded bg-white px-2.5 py-[7px] text-[11px] font-bold text-ink">
                  {method}
                </li>
              ))}
            </ul>
            <p className="flex items-center gap-3 text-[11px] text-steel">
              Trygg levering med <span className="text-sm font-semibold text-white">Posten / Bring</span>
            </p>
          </div>

          <div className="mt-9 flex flex-wrap justify-between gap-3 text-[11px] text-steel">
            <p>© {new Date().getFullYear()} Hylla. Fiktiv nettbutikk laget som designprosjekt. Produkter, priser og tilbud er eksempler.</p>
            <nav aria-label="Juridisk" className="flex gap-5">
              <Link href="/personvern/informasjonskapsler" className="hover:text-white hover:underline">
                Informasjonskapsler
              </Link>
              <Link href="/personvern" className="hover:text-white hover:underline">
                Personvern
              </Link>
              <Link href="/vilkar" className="hover:text-white hover:underline">
                Vilkår
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  )
}
