'use client'

import { useState } from 'react'

/** A button kept for the design that can't work in the demo: clicking it says so. */
export function DemoUnavailableButton({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [clicked, setClicked] = useState(false)

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <button type="button" onClick={() => setClicked(true)} className={className}>
        {children}
      </button>
      <span role="status" className="text-xs font-semibold text-subtle">
        {clicked ? 'Ikke tilgjengelig i demoen' : ''}
      </span>
    </span>
  )
}
