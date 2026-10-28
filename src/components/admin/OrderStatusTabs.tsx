import type { BeforeListTableServerProps } from 'payload'

import Link from 'next/link'

import { orderStatuses } from '@/collections/orders/constants'

const activeStatusFrom = (searchParams: BeforeListTableServerProps['searchParams']): string | undefined => {
  if (!searchParams) return undefined
  const flat = searchParams['where[status][equals]']
  if (typeof flat === 'string') return flat

  const where = (searchParams as Record<string, unknown>).where as
    | { status?: { equals?: string } }
    | undefined
  return where?.status?.equals
}

/**
 * Status filter tabs above the order list, like WooCommerce's
 * "Alle (40) | Behandles (6) | Sendt (12) …".
 */
export const OrderStatusTabs = async ({ payload, searchParams }: BeforeListTableServerProps) => {
  const active = activeStatusFrom(searchParams)
  const basePath = `${payload.config.routes.admin}/collections/orders`

  const counts = await Promise.all(
    orderStatuses.map(async (status) => {
      const { totalDocs } = await payload.count({
        collection: 'orders',
        overrideAccess: true,
        where: { status: { equals: status.value } },
      })
      return { ...status, count: totalDocs }
    }),
  )
  const total = counts.reduce((sum, status) => sum + status.count, 0)

  const tabs = [
    { count: total, href: basePath, isActive: !active, label: 'Alle' },
    ...counts
      .filter((status) => status.count > 0 || status.value === active)
      .map((status) => ({
        count: status.count,
        href: `${basePath}?where[status][equals]=${status.value}`,
        isActive: active === status.value,
        label: status.label,
      })),
  ]

  return (
    <nav aria-label="Filtrer ordrer på status" style={{ marginBottom: 16 }}>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 4, listStyle: 'none', margin: 0, padding: 0 }}>
        {tabs.map((tab) => (
          <li key={tab.label}>
            <Link
              aria-current={tab.isActive ? 'page' : undefined}
              href={tab.href}
              style={{
                background: tab.isActive ? 'var(--theme-elevation-100)' : 'transparent',
                borderRadius: 6,
                color: tab.isActive ? 'var(--theme-text)' : 'var(--theme-elevation-600)',
                display: 'inline-block',
                fontSize: 13,
                fontWeight: tab.isActive ? 600 : 400,
                padding: '6px 10px',
                textDecoration: 'none',
              }}
            >
              {tab.label} <span style={{ color: 'var(--theme-elevation-500)' }}>({tab.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
