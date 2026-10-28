import type { Author, Category, Guide, Media, Product } from '@/payload-types'

import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import { slugify } from '@/fields/slug'

import { type GuideSummary, type ProductSummary, toGuideSummary, toProductSummary } from './catalog'
import { type ImageData, toImage } from './media'

export type TocEntry = { id: string; label: string }

export type GuidePageData = {
  guide: Guide
  author: (Author & { image: ImageData | null }) | null
  department: Category | null
  hero: ImageData | null
  /** Products embedded in the content, by ID. Unpublished products are left out. */
  embeddedProducts: Record<number, ProductSummary>
  relatedProducts: ProductSummary[]
  toc: TocEntry[]
  moreGuides: GuideSummary[]
}

const MORE_GUIDES_COUNT = 3

type ContentNode = { type?: string; tag?: string; text?: string; children?: ContentNode[]; fields?: Record<string, unknown> }

const asDoc = <T extends object>(value: unknown): T | null =>
  value && typeof value === 'object' ? (value as T) : null

const idOf = (value: unknown): number | null =>
  typeof value === 'number' ? value : (asDoc<{ id: number }>(value)?.id ?? null)

export const plainText = (node: ContentNode): string =>
  node.text ?? (node.children ?? []).map(plainText).join('')

/**
 * The anchor for a heading or block title; the content renderer uses the same function.
 * Leading numbering is dropped so "#start-med-skjermen" survives renumbering the steps.
 */
const stripNumbering = (text: string) => text.replace(/^\d+\.\s*/, '')
export const anchorID = (text: string) => slugify(stripNumbering(text))

const contentNodes = (guide: Guide): ContentNode[] => (guide.content?.root.children ?? []) as ContentNode[]

/** h2 headings and checklist titles, in reading order. "1. Start med…" is listed as "Start med…". */
function tableOfContents(nodes: ContentNode[]): TocEntry[] {
  return nodes.flatMap((node): TocEntry[] => {
    if (node.type === 'heading' && node.tag === 'h2') {
      const text = plainText(node)
      return [{ id: anchorID(text), label: stripNumbering(text) }]
    }
    if (node.type === 'block' && node.fields?.blockType === 'checklist' && typeof node.fields.title === 'string') {
      return [{ id: anchorID(node.fields.title), label: node.fields.title }]
    }
    return []
  })
}

export const getGuidePage = cache(async (slug: string): Promise<GuidePageData | null> => {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'guides',
    depth: 2,
    limit: 1,
    where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
  })
  const guide = docs[0]
  if (!guide) return null

  const nodes = contentNodes(guide)
  const embeddedIDs = nodes
    .filter((node) => node.type === 'block' && node.fields?.blockType === 'productEmbed')
    .map((node) => idOf(node.fields?.product))
  const relatedIDs = (guide.relatedProducts ?? []).map(idOf)
  const productIDs = [...new Set([...embeddedIDs, ...relatedIDs])].filter((id): id is number => id !== null)
  const department = asDoc<Category>(guide.department)

  const [{ docs: products }, { docs: otherGuides }] = await Promise.all([
    productIDs.length
      ? payload.find({
          collection: 'products',
          depth: 1,
          pagination: false,
          where: { and: [{ id: { in: productIDs } }, { _status: { equals: 'published' } }] },
        })
      : { docs: [] as Product[] },
    payload.find({
      collection: 'guides',
      depth: 1,
      limit: MORE_GUIDES_COUNT * 2,
      sort: '-publishedAt',
      where: { and: [{ _status: { equals: 'published' } }, { id: { not_equals: guide.id } }] },
    }),
  ])

  const summaries = new Map(products.map((product) => [product.id, toProductSummary(product)]))
  const author = asDoc<Author>(guide.author)
  // Same department first, newest first within each group.
  const sameDepartment = (other: Guide) => (department && idOf(other.department) === department.id ? 0 : 1)

  return {
    guide,
    author: author ? { ...author, image: toImage(asDoc<Media>(author.avatar), 'thumbnail') } : null,
    department,
    hero: toImage(guide.heroImage, 'large'),
    embeddedProducts: Object.fromEntries(summaries),
    relatedProducts: relatedIDs
      .map((id) => (id === null ? undefined : summaries.get(id)))
      .filter((product): product is ProductSummary => Boolean(product)),
    toc: tableOfContents(nodes),
    moreGuides: [...otherGuides]
      .sort((a, b) => sameDepartment(a) - sameDepartment(b))
      .slice(0, MORE_GUIDES_COUNT)
      .map(toGuideSummary),
  }
})

export const ARCHIVE_PAGE_SIZE = 9

export type GuideArchive = {
  guides: GuideSummary[]
  /** Departments that have at least one published guide, for the filter. */
  departments: { slug: string; title: string; count: number }[]
  /** The active department filter, or null for all guides. */
  department: { slug: string; title: string } | null
  page: number
  totalPages: number
  total: number
}

/**
 * The "Guider og tips" archive: published guides, newest first, optionally within one department.
 * An unknown department slug is treated as no filter, so a stale link still shows guides.
 */
export async function getGuideArchive({ department, page }: { department?: string; page: number }): Promise<GuideArchive> {
  const payload = await getPayload({ config })

  // The filter is built from every published guide's department; guides are few, so one light query.
  const { docs: all } = await payload.find({
    collection: 'guides',
    depth: 1,
    pagination: false,
    select: { department: true },
    where: { _status: { equals: 'published' } },
  })
  const counts = new Map<number, { slug: string; title: string; count: number; sortOrder: number }>()
  for (const guide of all) {
    const category = asDoc<Category>(guide.department)
    if (!category?.slug) continue
    const entry = counts.get(category.id) ?? { slug: category.slug, title: category.title, count: 0, sortOrder: category.sortOrder ?? 0 }
    entry.count += 1
    counts.set(category.id, entry)
  }
  const departments = [...counts.values()].sort((a, b) => a.sortOrder - b.sortOrder)
  const departmentID = [...counts].find(([, entry]) => entry.slug === department)?.[0]
  const active = departmentID ? counts.get(departmentID)! : null

  const result = await payload.find({
    collection: 'guides',
    depth: 1,
    limit: ARCHIVE_PAGE_SIZE,
    page,
    sort: '-publishedAt',
    where: {
      and: [{ _status: { equals: 'published' } }, ...(departmentID ? [{ department: { equals: departmentID } }] : [])],
    },
  })

  return {
    guides: result.docs.map(toGuideSummary),
    departments: departments.map(({ slug, title, count }) => ({ slug, title, count })),
    department: active ? { slug: active.slug, title: active.title } : null,
    page: result.page ?? page,
    totalPages: result.totalPages,
    total: result.totalDocs,
  }
}
