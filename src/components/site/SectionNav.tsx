'use client'

import { useActiveSection } from '@/lib/useActiveSection'

export type Section = { id: string; label: string }

/** Sticky jump links for long pages, highlighting the section in view. */
export function SectionNav({ sections, label }: { sections: Section[]; label: string }) {
  const activeID = useActiveSection(sections.map((section) => section.id))

  return (
    <nav aria-label={label} className="sticky top-0 z-20 pt-3">
      <ul className="flex gap-1 overflow-x-auto rounded-xl bg-white px-2 text-sm font-semibold whitespace-nowrap shadow-[0_8px_24px_-16px_rgba(14,23,40,0.35)]">
        {sections.map((section) => {
          const isActive = section.id === activeID

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={isActive ? 'true' : undefined}
                className={`inline-flex h-14 items-center border-b-2 px-4 ${
                  isActive ? 'border-brand text-brand' : 'border-transparent hover:text-brand'
                }`}
              >
                {section.label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
