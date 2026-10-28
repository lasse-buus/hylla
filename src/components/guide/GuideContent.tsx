import type { ProductSummary } from '@/lib/catalog'
import type { ChecklistBlock, ComparisonTableBlock, Guide, ProductEmbedBlock, TipBlock } from '@/payload-types'
import type { SerializedBlockNode, SerializedHeadingNode } from '@payloadcms/richtext-lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'

import { ArrowRight, CircleCheck, Lightbulb } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { RichText } from '@/components/site/RichText'
import { formatPrice } from '@/lib/format'
import { anchorID, plainText } from '@/lib/guide'

type GuideContentProps = {
  content: NonNullable<Guide['content']>
  embeddedProducts: Record<number, ProductSummary>
}

const idOf = (value: unknown): number | null =>
  typeof value === 'number' ? value : ((value as { id?: number } | null)?.id ?? null)

/** The guide body: Lexical content with anchored headings and the four guide blocks. */
export function GuideContent({ content, embeddedProducts }: GuideContentProps) {
  const converters: JSXConverters = {
    heading: ({ node, nodesToJSX }) => {
      const heading = node as SerializedHeadingNode
      const Tag = heading.tag
      const id = heading.tag === 'h2' ? anchorID(plainText(heading as never)) : undefined
      return <Tag id={id}>{nodesToJSX({ nodes: heading.children })}</Tag>
    },
    blocks: {
      tip: ({ node }) => <Tip {...(node as SerializedBlockNode<TipBlock>).fields} />,
      comparisonTable: ({ node }) => <ComparisonTable {...(node as SerializedBlockNode<ComparisonTableBlock>).fields} />,
      productEmbed: ({ node }) => {
        const { label, product } = (node as SerializedBlockNode<ProductEmbedBlock>).fields
        const summary = embeddedProducts[idOf(product) ?? -1]
        // An unpublished or deleted product is skipped rather than shown as a broken card.
        return summary ? <ProductEmbed label={label} product={summary} /> : null
      },
      checklist: ({ node }) => <Checklist {...(node as SerializedBlockNode<ChecklistBlock>).fields} />,
    },
  }

  return <RichText data={content} variant="article" converters={converters} />
}

function Tip({ title, text }: TipBlock) {
  return (
    <aside className="flex items-start gap-4 rounded-xl bg-brand-soft px-6 py-[22px]">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
        <Lightbulb className="size-5" strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        {title ? <h3 className="!mt-0 mb-1 text-[15px] font-bold">{title}</h3> : null}
        <p className="text-[15px] leading-[1.6]">{text}</p>
      </div>
    </aside>
  )
}

function ComparisonTable({ caption, columns, rows }: ComparisonTableBlock) {
  const highlighted = (index: number) => Boolean(columns?.[index]?.highlight)

  return (
    <div className="overflow-x-auto rounded-xl bg-white">
      <table className="w-full min-w-[560px] border-collapse text-sm leading-normal">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead>
          <tr className="text-left">
            <td className="border-b border-line px-[18px] py-4" />
            {columns?.map((column, index) => (
              <th
                key={column.id ?? column.label}
                scope="col"
                className={`border-b border-line px-[18px] py-4 font-bold ${highlighted(index) ? 'bg-brand-soft text-brand' : 'text-ink'}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => {
            const isLast = rowIndex === rows.length - 1

            return (
              <tr key={row.id ?? row.label} className={isLast ? 'font-semibold' : ''}>
                <th
                  scope="row"
                  className={`px-[18px] py-3.5 text-left font-semibold text-muted ${isLast ? '' : 'border-b border-line'}`}
                >
                  {row.label}
                </th>
                {columns?.map((column, index) => (
                  <td
                    key={column.id ?? column.label}
                    className={`px-[18px] py-3.5 text-ink ${isLast ? '' : 'border-b border-line'} ${highlighted(index) ? 'bg-[#f5f8ff]' : ''}`}
                  >
                    {row.cells?.[index]?.value ?? ''}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ProductEmbed({ label, product }: { label?: string | null; product: ProductSummary }) {
  const onSale = product.compareAtPrice !== null && product.compareAtPrice > product.price

  return (
    <section aria-label={label ?? product.title} className="!mt-7 flex flex-wrap items-center gap-5 rounded-xl bg-white p-5">
      <div className="relative h-[140px] w-40 shrink-0 overflow-hidden rounded-lg bg-navy">
        {product.image ? <Image src={product.image.url} alt="" fill sizes="160px" className="object-cover" /> : null}
      </div>
      <div className="flex flex-[1_1_240px] flex-col gap-1.5">
        {label ? <span className="text-[11px] font-bold tracking-[0.6px] text-brand uppercase">{label}</span> : null}
        <Link href={product.href} className="text-lg leading-[1.3] font-semibold !text-ink !no-underline hover:!underline">
          {product.title}
        </Link>
        {product.shortSpecs ? <span className="text-[13px] leading-normal text-muted">{product.shortSpecs}</span> : null}
        <span className="mt-1 flex items-baseline gap-2.5">
          <strong className="text-2xl font-bold">{formatPrice(product.price)}</strong>
          {onSale ? (
            <s className="text-[13px] text-muted">
              <span className="sr-only">Før </span>
              {formatPrice(product.compareAtPrice!)}
            </s>
          ) : null}
        </span>
      </div>
      <Link
        href={product.href}
        aria-hidden="true"
        tabIndex={-1}
        className="inline-flex h-[46px] shrink-0 items-center gap-2.5 rounded-md bg-brand px-5 text-sm font-semibold !text-white !no-underline hover:bg-brand-hover"
      >
        Se produktet
        <ArrowRight className="size-4" strokeWidth={1.8} />
      </Link>
    </section>
  )
}

function Checklist({ title, items }: ChecklistBlock) {
  const id = title ? anchorID(title) : undefined

  return (
    <section id={id} aria-labelledby={id ? `${id}-tittel` : undefined} className="!mt-10 scroll-mt-6 rounded-xl bg-ink p-7 text-white">
      {title ? (
        <h2 id={id ? `${id}-tittel` : undefined} className="!mt-0 mb-4 !text-[22px] !text-white">
          {title}
        </h2>
      ) : null}
      <ul className="flex list-none flex-col gap-3 !pl-0 text-[15px] leading-normal">
        {items?.map((item) => (
          <li key={item.id ?? item.text} className="!mt-0 flex gap-3">
            <CircleCheck className="mt-0.5 size-5 shrink-0 text-brand-light" strokeWidth={1.8} aria-hidden="true" />
            {item.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
