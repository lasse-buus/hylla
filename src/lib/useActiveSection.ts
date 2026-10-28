'use client'

import { useEffect, useState } from 'react'

/**
 * The ID of the section the reader is in: the last one whose top has passed
 * the upper third of the viewport. Used by in-page navigation.
 */
export function useActiveSection(ids: string[]) {
  const [activeID, setActiveID] = useState(ids[0])
  const key = ids.join(',')

  useEffect(() => {
    const elements = key
      .split(',')
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length) setActiveID(visible[visible.length - 1].target.id)
      },
      { rootMargin: '-80px 0px -66% 0px' },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [key])

  return activeID
}
