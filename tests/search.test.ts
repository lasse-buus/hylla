import assert from 'node:assert/strict'

import { normalizeQuery, searchShop } from '@/lib/search'

// Queries are trimmed, whitespace collapsed, and capped.
assert.equal(normalizeQuery('  gaming   pc '), 'gaming pc')
assert.equal(normalizeQuery(undefined), '')
assert.equal(normalizeQuery(['a', 'b']), '')
assert.equal(normalizeQuery('x'.repeat(200)).length, 80)

// Matches product titles, case-insensitively.
const vektor = await searchShop('VEKTOR', { productLimit: 50, guideLimit: 5 })
assert.ok(vektor.products.length >= 5, 'several Vektor products')
assert.ok(vektor.products.every((product) => /vektor/i.test(product.title)))
assert.equal(vektor.productTotal, vektor.products.length)

// Matches short specs, not only titles.
const ip67 = await searchShop('ip67', { productLimit: 10, guideLimit: 5 })
assert.ok(ip67.products.some((product) => product.title.startsWith('Klang Mini')), 'spec match')

// Matches guides by title or excerpt.
const gaming = await searchShop('gaming-PC', { productLimit: 5, guideLimit: 5 })
assert.ok(gaming.guides.some((guide) => guide.title.includes('gaming-PC')), 'guide match')

// Limits apply, totals still count everything.
const limited = await searchShop('vektor', { productLimit: 2, guideLimit: 0 })
assert.equal(limited.products.length, 2)
assert.equal(limited.productTotal, vektor.productTotal)

// Too-short, empty and wildcard-only queries return nothing instead of everything.
for (const query of ['', 'a', '%%', '__']) {
  const result = await searchShop(query, { productLimit: 5, guideLimit: 5 })
  assert.equal(result.products.length + result.guides.length, 0, `query ${JSON.stringify(query)}`)
}

// No match.
const none = await searchShop('xyzzyfinnesikke', { productLimit: 5, guideLimit: 5 })
assert.equal(none.productTotal + none.guideTotal, 0)
