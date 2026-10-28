import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const NAVIGATION_TAG = 'navigation'

/**
 * Clears the cached header/footer data. Outside a Next.js request (the seed script, migrations)
 * there is no cache to clear and revalidateTag throws, so that case is ignored.
 */
const revalidate = () => {
  try {
    revalidateTag(NAVIGATION_TAG, 'max')
  } catch {
    // Not running inside Next.js.
  }
}

export const revalidateNavigationAfterChange: CollectionAfterChangeHook = ({ doc }) => {
  revalidate()
  return doc
}

export const revalidateNavigationAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate()
  return doc
}
