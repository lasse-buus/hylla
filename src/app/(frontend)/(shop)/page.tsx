import type { Metadata } from 'next'

import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { getHomePage } from '@/lib/home'

export const metadata: Metadata = {
  title: { absolute: 'Hylla – teknologi for livet du lever' },
}

/** Prices and stock change outside the editor, so the page is refreshed every five minutes as well. */
export const revalidate = 300

export default async function HomePage() {
  const blocks = await getHomePage()
  return <RenderBlocks blocks={blocks} pageTitle="Hylla – teknologi for livet du lever" />
}
