import type { Metadata } from 'next'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

import { GuideCard } from '@/components/shop/GuideCard'
import { GuideFeatureCard } from '@/components/shop/GuideFeatureCard'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { getGuideArchive } from '@/lib/guide'
import { routes } from '@/lib/routes'

export const metadata: Metadata = {
  title: 'Guider og tips',
  description: 'Kjøpeguider og tips fra Hyllas produkteksperter: enkle råd som hjelper deg å velge riktig.',
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

/** The archive URL for a department filter and page; defaults are left out. */
const archiveHref = (department: string | null, page = 1) => {
  const params = new URLSearchParams()
  if (department) params.set('avdeling', department)
  if (page > 1) params.set('side', String(page))
  const query = params.toString()
  return query ? `${routes.guides}?${query}` : routes.guides
}

export default async function GuideArchivePage(props: PageProps<'/guider'>) {
  const searchParams = await props.searchParams
  const page = Math.max(1, Number(first(searchParams.side)) || 1)
  const archive = await getGuideArchive({ department: first(searchParams.avdeling), page })
  const activeSlug = archive.department?.slug ?? null

  // The newest guide gets the wide card, but only on the unfiltered first page.
  const showFeatured = !activeSlug && archive.page === 1
  const featured = showFeatured ? archive.guides[0] : undefined
  const rest = showFeatured ? archive.guides.slice(1) : archive.guides

  return (
    <div className="shop-container pt-5 pb-[72px]">
      <Breadcrumbs trail={[]} current="Guider og tips" />

      <header className="mt-6 max-w-[720px]">
        <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-[-1.4px] sm:text-[52px]">Guider og tips</h1>
        <p className="mt-4 text-lg leading-[1.55] text-subtle">
          Enkle råd fra produktekspertene våre. Finn ut hva som betyr noe, og hva du trygt kan spare på.
        </p>
      </header>

      {archive.departments.length > 1 ? (
        <nav aria-label="Filtrer etter avdeling" className="mt-8">
          <ul className="flex flex-wrap gap-2">
            {[{ slug: null, title: 'Alle guider', count: null }, ...archive.departments].map((department) => {
              const isActive = department.slug === activeSlug

              return (
                <li key={department.slug ?? 'alle'}>
                  <Link
                    href={archiveHref(department.slug)}
                    aria-current={isActive ? 'true' : undefined}
                    scroll={false}
                    className={`inline-flex h-[35px] items-center gap-1.5 rounded-full border px-[17px] text-xs font-semibold ${
                      isActive ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-steel'
                    }`}
                  >
                    {department.title}
                    {department.count !== null ? (
                      <span className={isActive ? 'text-steel' : 'text-muted'}>{department.count}</span>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      ) : null}

      <h2 className="sr-only" aria-live="polite">
        {archive.department ? `Guider om ${archive.department.title}` : 'Alle guider'}, {archive.total} totalt
      </h2>

      {featured ? (
        <div className="mt-8">
          <GuideFeatureCard guide={featured} />
        </div>
      ) : null}

      {rest.length ? (
        <ul className="mt-8 grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {rest.map((guide) => (
            <li key={guide.id}>
              <GuideCard guide={guide} />
            </li>
          ))}
        </ul>
      ) : null}

      {!archive.guides.length ? (
        <div className="mt-8 rounded-xl bg-white px-6 py-14 text-center">
          <p className="text-lg font-semibold">Ingen guider her ennå</p>
          <Link href={routes.guides} className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
            Se alle guider
          </Link>
        </div>
      ) : null}

      {archive.totalPages > 1 ? (
        <nav aria-label="Sider" className="mt-10 flex items-center justify-center gap-4 text-sm font-semibold">
          {archive.page > 1 ? (
            <Link href={archiveHref(activeSlug, archive.page - 1)} className="inline-flex items-center gap-1 text-brand hover:underline">
              <ChevronLeft className="size-4" strokeWidth={2} aria-hidden="true" />
              Forrige
            </Link>
          ) : null}
          <span className="text-muted">
            Side {archive.page} av {archive.totalPages}
          </span>
          {archive.page < archive.totalPages ? (
            <Link href={archiveHref(activeSlug, archive.page + 1)} className="inline-flex items-center gap-1 text-brand hover:underline">
              Neste
              <ChevronRight className="size-4" strokeWidth={2} aria-hidden="true" />
            </Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  )
}
