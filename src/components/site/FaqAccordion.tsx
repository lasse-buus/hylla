'use client'

import type { FaqEntry, FaqGroup } from '@/lib/faq'

import { ChevronDown } from 'lucide-react'
import { useId, useState } from 'react'

/** Animates height with grid rows (0fr → 1fr), so content of any height opens smoothly. */
function Collapse({ id, open, children }: { id: string; open: boolean; children: React.ReactNode }) {
  return (
    <div
      id={id}
      className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
        open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
      }`}
    >
      {/* Closed panels stay in the page (and in search results) but are skipped by keyboard and screen readers. */}
      <div className="min-h-0 overflow-hidden" inert={!open}>
        {children}
      </div>
    </div>
  )
}

/**
 * The customer service FAQ: one card per topic, each question opening to its answer,
 * with follow-up questions nested underneath on a grey background.
 */
export function FaqAccordion({ groups }: { groups: FaqGroup[] }) {
  const baseID = useId()
  const [open, setOpen] = useState<number[]>([])

  const toggle = (id: number) =>
    setOpen((current) => (current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]))

  return (
    <div className="flex flex-col gap-7">
      {groups.map((group) => (
        <section key={group.topic} aria-labelledby={`${baseID}-${group.topic}`}>
          <h3 id={`${baseID}-${group.topic}`} className="mb-2.5 text-xs font-bold tracking-[0.6px] text-muted uppercase">
            {group.label}
          </h3>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {group.entries.map((entry) => (
              <Question key={entry.id} entry={entry} baseID={baseID} open={open} onToggle={toggle} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

type QuestionProps = {
  entry: FaqEntry
  baseID: string
  open: number[]
  onToggle: (id: number) => void
}

function Question({ entry, baseID, open, onToggle }: QuestionProps) {
  const isOpen = open.includes(entry.id)
  const panelID = `${baseID}-svar-${entry.id}`

  return (
    <li>
      <h4>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelID}
          onClick={() => onToggle(entry.id)}
          className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[15px] font-semibold hover:bg-surface/70 focus-visible:-outline-offset-2 sm:px-6"
        >
          {entry.question}
          <ChevronDown
            className={`size-5 shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
              isOpen ? 'rotate-180 text-brand' : 'text-muted group-hover:text-ink'
            }`}
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </button>
      </h4>

      <Collapse id={panelID} open={isOpen}>
        <p className="max-w-[760px] px-5 pb-5 text-[15px] leading-[1.6] whitespace-pre-line text-muted sm:px-6">
          {entry.answer}
        </p>

        {entry.followUps.length ? (
          <ul aria-label={`Oppfølgingsspørsmål til «${entry.question}»`} className="divide-y divide-line border-t border-line bg-surface">
            {entry.followUps.map((followUp) => {
              const isFollowUpOpen = open.includes(followUp.id)
              const followUpID = `${baseID}-svar-${followUp.id}`

              return (
                <li key={followUp.id}>
                  <h5>
                    <button
                      type="button"
                      aria-expanded={isFollowUpOpen}
                      aria-controls={followUpID}
                      onClick={() => onToggle(followUp.id)}
                      className="group flex w-full items-center gap-3 px-5 py-3.5 text-left text-[15px] font-medium hover:bg-brand-soft/50 focus-visible:-outline-offset-2 sm:px-6"
                    >
                      <ChevronDown
                        className={`size-[18px] shrink-0 transition-transform duration-300 motion-reduce:transition-none ${
                          isFollowUpOpen ? 'rotate-180 text-brand' : 'text-muted group-hover:text-ink'
                        }`}
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                      {followUp.question}
                    </button>
                  </h5>
                  <Collapse id={followUpID} open={isFollowUpOpen}>
                    <p className="max-w-[760px] pr-5 pb-4 pl-[50px] text-sm leading-[1.6] whitespace-pre-line text-muted sm:pr-6 sm:pl-[54px]">
                      {followUp.answer}
                    </p>
                  </Collapse>
                </li>
              )
            })}
          </ul>
        ) : null}
      </Collapse>
    </li>
  )
}
