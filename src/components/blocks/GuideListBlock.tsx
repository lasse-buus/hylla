import type { GuideListBlock as GuideListBlockData } from '@/payload-types'

import { GuideCard } from '@/components/shop/GuideCard'
import { getGuideSummaries } from '@/lib/catalog'
import { resolveLink } from '@/lib/links'

import { SectionHeader } from './SectionHeader'

export async function GuideListBlock({ block, headingID }: { block: GuideListBlockData; headingID: string }) {
  const guides = await getGuideSummaries({
    guides: block.source === 'manual' ? block.guides : null,
    limit: block.limit ?? 3,
  })
  if (!guides.length) return null

  return (
    <section aria-labelledby={headingID}>
      <SectionHeader id={headingID} title={block.title} intro={block.intro} link={resolveLink(block.link)} />
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
        {guides.map((guide) => (
          <li key={guide.id}>
            <GuideCard guide={guide} />
          </li>
        ))}
      </ul>
    </section>
  )
}
