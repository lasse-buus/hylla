import Link from 'next/link'

import { routes } from '@/lib/routes'

type LogoProps = {
  tone?: 'dark' | 'light'
  className?: string
}

/** The Hylla wordmark: a slanted mark, the name and a dot. */
export function Logo({ tone = 'dark', className = '' }: LogoProps) {
  const isLight = tone === 'light'

  return (
    <Link
      href={routes.home}
      aria-label="Hylla, til forsiden"
      className={`inline-flex items-center ${isLight ? 'text-white' : 'text-ink'} ${className}`}
    >
      <svg width="24" height="32" viewBox="0 0 24 32" aria-hidden="true">
        <path d="M16 1.5h6.5L8 30.5H1.5z" className={isLight ? 'fill-brand-light' : 'fill-brand'} />
      </svg>
      <span className="ml-0.5 text-[36px] leading-none font-extrabold tracking-[-1.6px]">hylla</span>
      <span
        aria-hidden="true"
        className={`mt-1 ml-2 size-[7px] rounded-full ${isLight ? 'bg-brand-light' : 'bg-brand'}`}
      />
    </Link>
  )
}
