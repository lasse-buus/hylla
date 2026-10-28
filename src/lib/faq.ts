import type { Faq } from '@/payload-types'

import config from '@payload-config'
import { getPayload } from 'payload'

import { faqTopics } from '@/collections/Faqs'

export type FaqEntry = Pick<Faq, 'id' | 'question' | 'answer'> & { followUps: Pick<Faq, 'id' | 'question' | 'answer'>[] }

export type FaqGroup = { topic: string; label: string; entries: FaqEntry[] }

const parentID = (faq: Faq) => (typeof faq.parent === 'object' ? (faq.parent?.id ?? null) : (faq.parent ?? null))

/**
 * Customer service questions grouped by topic, in the topics' fixed order, each with its
 * follow-up questions nested under it. Follow-ups take their parent's topic. Empty topics are left out.
 */
export async function getFaqGroups(): Promise<FaqGroup[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({ collection: 'faqs', depth: 0, pagination: false, sort: 'sortOrder' })

  const pick = ({ id, question, answer }: Faq) => ({ id, question, answer })
  const entries = docs
    .filter((faq) => parentID(faq) === null)
    .map((faq) => ({
      ...pick(faq),
      topic: faq.topic,
      followUps: docs.filter((child) => parentID(child) === faq.id).map(pick),
    }))

  return faqTopics
    .map((topic) => ({
      topic: topic.value,
      label: topic.label,
      entries: entries.filter((entry) => entry.topic === topic.value).map(({ topic: _topic, ...entry }) => entry),
    }))
    .filter((group) => group.entries.length)
}
