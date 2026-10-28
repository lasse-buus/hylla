'use client'

import type { TocEntry } from '@/lib/guide'

import { Check, Link2, Share2 } from 'lucide-react'
import { useState, useSyncExternalStore } from 'react'

import { useActiveSection } from '@/lib/useActiveSection'

const noSubscription = () => () => {}

const roundButton =
  'flex size-10 items-center justify-center rounded-full border border-line bg-white text-ink hover:bg-surface'

/** The sticky table of contents, with copy-link and native share. */
export function GuideToc({ entries, title }: { entries: TocEntry[]; title: string }) {
  const activeID = useActiveSection(entries.map((entry) => entry.id))
  const [copied, setCopied] = useState(false)
  // navigator.share only exists in some browsers, and never on the server.
  const canShare = useSyncExternalStore(
    noSubscription,
    () => typeof navigator.share === 'function',
    () => false,
  )

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href.split('#')[0])
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const share = () => navigator.share({ title, url: window.location.href.split('#')[0] }).catch(() => {})

  return (
    <nav aria-labelledby="innhold-tittel" className="lg:sticky lg:top-6">
      {entries.length ? (
        <>
          <h2 id="innhold-tittel" className="mb-3.5 text-[11px] font-bold tracking-[0.8px] text-muted">
            INNHOLD
          </h2>
          <ol className="flex flex-col gap-1 text-sm">
            {entries.map((entry) => {
              const isActive = entry.id === activeID

              return (
                <li key={entry.id}>
                  <a
                    href={`#${entry.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-center gap-2.5 rounded-md px-3 py-2 ${
                      isActive ? 'bg-white font-semibold text-brand' : 'pl-7 text-subtle hover:text-ink'
                    }`}
                  >
                    {isActive ? <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-brand" /> : null}
                    {entry.label}
                  </a>
                </li>
              )
            })}
          </ol>
        </>
      ) : null}
      <div className="mt-6 flex items-center gap-2">
        <button type="button" onClick={copyLink} aria-label="Kopier lenke" className={roundButton}>
          {copied ? (
            <Check className="size-[18px] text-success" strokeWidth={2} aria-hidden="true" />
          ) : (
            <Link2 className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          )}
        </button>
        {canShare ? (
          <button type="button" onClick={share} aria-label="Del guiden" className={roundButton}>
            <Share2 className="size-[18px]" strokeWidth={1.8} aria-hidden="true" />
          </button>
        ) : null}
        <span role="status" className="text-xs font-semibold text-success">
          {copied ? 'Lenke kopiert' : ''}
        </span>
      </div>
    </nav>
  )
}
