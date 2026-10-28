/**
 * Tiny helpers for writing Lexical rich text as plain data in seed files.
 */

type LexicalNode = Record<string, unknown>

const BOLD = 1

export const text = (value: string, options: { bold?: boolean } = {}): LexicalNode => ({
  type: 'text',
  text: value,
  format: options.bold ? BOLD : 0,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

const toChildren = (content: string | LexicalNode[]): LexicalNode[] =>
  typeof content === 'string' ? [text(content)] : content

export const paragraph = (content: string | LexicalNode[]): LexicalNode => ({
  type: 'paragraph',
  children: toChildren(content),
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})

export const heading = (value: string, tag: 'h2' | 'h3' = 'h2'): LexicalNode => ({
  type: 'heading',
  tag,
  children: [text(value)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

export const bulletList = (items: (string | LexicalNode[])[]): LexicalNode => ({
  type: 'list',
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  children: items.map((item, index) => ({
    type: 'listitem',
    value: index + 1,
    children: toChildren(item),
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})

let blockCounter = 0

export const block = (blockType: string, fields: Record<string, unknown>): LexicalNode => {
  blockCounter += 1

  return {
    type: 'block',
    version: 2,
    format: '',
    fields: {
      id: `seed-block-${blockCounter.toString(16).padStart(8, '0')}`,
      blockName: '',
      blockType,
      ...fields,
    },
  }
}

export const richText = (...children: LexicalNode[]) => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})
