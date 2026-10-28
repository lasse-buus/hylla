'use client'

import { useRowLabel } from '@payloadcms/ui'

type NoteRow = { author?: string | null; createdAt?: string | null; message?: string | null; type?: string | null }

const typeLabels: Record<string, string> = { customer: 'Til kunde', private: 'Privat', system: 'System' }

const dateFormat = new Intl.DateTimeFormat('nb-NO', { dateStyle: 'medium', timeStyle: 'short' })

export const OrderNoteRowLabel = () => {
  const { data } = useRowLabel<NoteRow>()
  const when = data?.createdAt ? dateFormat.format(new Date(data.createdAt)) : 'Nytt notat'
  const message = data?.message ? data.message.slice(0, 90) + (data.message.length > 90 ? '…' : '') : ''

  return (
    <span>
      <strong>{typeLabels[data?.type ?? 'private'] ?? 'Notat'}</strong> · {when}
      {data?.author ? ` · ${data.author}` : ''}
      {message ? ` — ${message}` : ''}
    </span>
  )
}
