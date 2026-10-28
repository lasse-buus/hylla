'use client'

import type { ShopCustomer } from '@/lib/shopSession'

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from 'react'

/** What a visitor can change on Min side. Changes live in this tab's sessionStorage and never reach the server. */
export type AccountDraft = Pick<ShopCustomer, 'firstName' | 'lastName' | 'email' | 'phone' | 'addresses' | 'preferences'>

const KEY = 'hylla-min-side'
const listeners = new Set<() => void>()
// Used when sessionStorage is blocked (some private windows); edits then last until the page reloads.
let memory: string | null = null

const read = (): string | null => {
  try {
    return sessionStorage.getItem(KEY)
  } catch {
    return memory
  }
}

const write = (value: string | null) => {
  try {
    if (value === null) sessionStorage.removeItem(KEY)
    else sessionStorage.setItem(KEY, value)
  } catch {
    // Storage unavailable: keep the edit in memory instead.
  }
  memory = value
  listeners.forEach((listener) => listener())
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Forgets this visit's edits, e.g. on "Logg ut". */
export const clearAccountDraft = () => write(null)

type DraftContext = { draft: AccountDraft; update: (change: (draft: AccountDraft) => AccountDraft) => void }

const Context = createContext<DraftContext | null>(null)

export function AccountDraftProvider({ initial, children }: { initial: AccountDraft; children: React.ReactNode }) {
  const stored = useSyncExternalStore(subscribe, read, () => null)

  const draft = useMemo<AccountDraft>(() => {
    if (!stored) return initial
    try {
      return { ...initial, ...(JSON.parse(stored) as Partial<AccountDraft>) }
    } catch {
      return initial
    }
  }, [initial, stored])

  const update = useCallback((change: (draft: AccountDraft) => AccountDraft) => write(JSON.stringify(change(draft))), [draft])

  return <Context value={{ draft, update }}>{children}</Context>
}

/** The account as the visitor has edited it during this visit. */
export function useAccountDraft(): DraftContext {
  const context = useContext(Context)
  if (!context) throw new Error('useAccountDraft must be used inside AccountDraftProvider')
  return context
}
