import type { HomeBlock } from '@/lib/home'

import { CategoryGridBlock } from './CategoryGridBlock'
import { CtaBannerBlock } from './CtaBannerBlock'
import { GuideListBlock } from './GuideListBlock'
import { HeroBlock } from './HeroBlock'
import { ProductListBlock } from './ProductListBlock'
import { ProductTabsBlock } from './ProductTabsBlock'
import { PromoCardsBlock } from './PromoCardsBlock'
import { ServiceHighlightsBlock } from './ServiceHighlightsBlock'

type BlockProps = { block: HomeBlock; headingID: string; isPageHeading: boolean }

function Block({ block, headingID, isPageHeading }: BlockProps) {
  switch (block.blockType) {
    case 'hero':
      return <HeroBlock block={block} headingID={headingID} isPageHeading={isPageHeading} />
    case 'categoryGrid':
      return <CategoryGridBlock block={block} headingID={headingID} />
    case 'productTabs':
      return <ProductTabsBlock block={block} headingID={headingID} />
    case 'promoCards':
      return <PromoCardsBlock block={block} />
    case 'productList':
      return <ProductListBlock block={block} headingID={headingID} />
    case 'ctaBanner':
      return <CtaBannerBlock block={block} headingID={headingID} />
    case 'guideList':
      return <GuideListBlock block={block} headingID={headingID} />
    case 'serviceHighlights':
      return <ServiceHighlightsBlock block={block} headingID={headingID} />
  }
}

/**
 * Renders a page's blocks in order, with the shared spacing between sections.
 * The first hero is the page heading; without one, a visually hidden h1 names the page.
 */
export function RenderBlocks({ blocks, pageTitle }: { blocks: HomeBlock[]; pageTitle: string }) {
  const headingIndex = blocks.findIndex((block) => block.blockType === 'hero')

  return (
    <div className="shop-container flex flex-col gap-14 pt-6 pb-16">
      {headingIndex === -1 ? <h1 className="sr-only">{pageTitle}</h1> : null}
      {blocks.map((block, index) => (
        <Block
          key={block.id ?? index}
          block={block}
          headingID={`seksjon-${index + 1}`}
          isPageHeading={index === headingIndex}
        />
      ))}
    </div>
  )
}
