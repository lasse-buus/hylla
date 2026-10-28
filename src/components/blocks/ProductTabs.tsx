'use client'

import { useState } from 'react'

/**
 * Tab pills over pre-rendered product grids. Each tab's grid is rendered on the server
 * and passed in as a node, so switching tabs needs no data fetching.
 */
export function ProductTabs({ tabs }: { tabs: { label: string; content: React.ReactNode }[] }) {
  const [active, setActive] = useState(0)

  return (
    <>
      {tabs.length > 1 ? (
        <div role="group" aria-label="Filtrer produkter" className="mb-6 flex flex-wrap gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              aria-pressed={index === active}
              onClick={() => setActive(index)}
              className={`h-[35px] rounded-full border px-[17px] text-xs font-semibold ${
                index === active ? 'border-ink bg-ink text-white' : 'border-line bg-white hover:border-steel'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}
      {tabs[active]?.content}
    </>
  )
}
