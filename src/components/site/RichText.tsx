import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { JSXConverters } from '@payloadcms/richtext-lexical/react'

import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

const shared =
  '[&_a]:text-brand [&_a]:underline [&_h2]:font-bold [&_h2]:text-ink [&_h3]:font-semibold [&_h3]:text-ink [&_ol]:list-decimal [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:list-disc'

const variants = {
  /** Product descriptions. */
  base: `text-base leading-[1.65] text-subtle [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-lg [&_li]:mt-1.5 [&_ol]:pl-6 [&_p:not(:first-child)]:mt-3.5 [&_ul]:pl-6`,
  /** Long-form guides: larger type, a lead paragraph and roomy spacing between blocks. */
  article: `text-[17px] leading-[1.75] text-[#2b3546] [&>*+*]:mt-[18px] [&>h2]:mt-12 [&>h2+*]:mt-3 [&>p:first-child]:text-[19px] [&>p:first-child]:leading-[1.7] [&>p:first-child]:text-ink [&_h2]:scroll-mt-6 [&_h2]:text-[28px] [&_h2]:leading-[1.2] [&_h2]:tracking-[-0.5px] [&_h3]:mt-8 [&_h3]:text-xl [&_li+li]:mt-2 [&_ol]:pl-[22px] [&_ul]:pl-[22px]`,
}

type RichTextProps = {
  data: SerializedEditorState
  variant?: keyof typeof variants
  /** Extra converters, e.g. for the guide blocks. */
  converters?: JSXConverters
}

/** Renders Lexical content from Payload with the shop's body text styles. */
export function RichText({ data, variant = 'base', converters }: RichTextProps) {
  return (
    <LexicalRichText
      data={data}
      converters={
        converters
          ? ({ defaultConverters }) => ({
              ...defaultConverters,
              ...converters,
              blocks: { ...defaultConverters.blocks, ...converters.blocks },
            })
          : undefined
      }
      className={`${shared} ${variants[variant]}`}
    />
  )
}
