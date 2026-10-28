const kroner = new Intl.NumberFormat('nb-NO', { maximumFractionDigits: 0 })

/** 12990 → "12 990,–" (Norwegian shop convention for whole-krone prices). */
export const formatPrice = (amount: number): string => `${kroner.format(amount)},–`

/** 1000 → "1 000 kr" */
export const formatKroner = (amount: number): string => `${kroner.format(amount)} kr`

/** Rounds big stock numbers down the way shops show them: 64 → "50+", 120 → "100+". */
export const formatStock = (inventory: number): string =>
  inventory >= 100 ? '100+' : inventory >= 50 ? '50+' : String(inventory)

const longDate = new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })

/** "2026-10-12T…" → "12. oktober 2026" */
export const formatDate = (value: string): string => longDate.format(new Date(value))

const shortDate = new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Oslo' })
const dateTime = new Intl.DateTimeFormat('nb-NO', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Europe/Oslo',
})

/** "2026-10-26T…" → "26. okt. 2026" */
export const formatShortDate = (value: string | Date): string => shortDate.format(new Date(value))

/** "2026-10-26T19:14…" → "26. oktober 2026 kl. 20:14" */
export const formatDateTime = (value: string | Date): string => dateTime.format(new Date(value))
