import assert from 'node:assert/strict'

import { lightColorOf, lightFor, scenes } from '@/lib/lighting'
import { applyFilters, emptyFilters, facetCounts, type FilterableProduct, filtersToQuery, parseFilters } from '@/lib/productFilters'

const WARM = '#ffc477'
const colourScenes = ['solnedgang', 'nordlys', 'lilla'] as const

// White and Color Ambiance shows every scene as it is.
for (const scene of scenes) {
  assert.deepEqual(lightFor('color', scene.id), { color: scene.color, color2: scene.second, note: null })
}

// White Ambiance follows the white scenes, and falls back to warm white (with a note) in the colour scenes.
assert.deepEqual(lightFor('ambiance', 'dag'), { color: '#e9f0ff', color2: '#cddcff', note: null })
assert.equal(lightFor('ambiance', 'varm').note, null)
for (const scene of colourScenes) {
  const light = lightFor('ambiance', scene)
  assert.equal(light.color, WARM)
  assert.equal(light.note, 'White Ambiance viser bare hvitt lys. Her: varm hvit.')
}

// Hue White is always warm white; the note explains it whenever another scene was picked.
assert.deepEqual(lightFor('white', 'varm'), { color: WARM, color2: '#ffad5c', note: null })
for (const scene of ['dag', ...colourScenes] as const) {
  assert.equal(lightFor('white', scene).color, WARM)
  assert.equal(lightFor('white', scene).note, 'Hue White lyser bare varmhvitt.')
}

// Filament is extra warm amber in every scene.
assert.deepEqual(lightFor('filament', 'varm'), { color: '#ffb257', color2: '#ff9a3d', note: null })
assert.equal(lightFor('filament', 'nordlys').color, '#ffb257')
assert.ok(lightFor('filament', 'nordlys').note)

// The Bridge only has its blue status LED.
for (const scene of scenes) {
  assert.deepEqual(lightFor('bridge', scene.id), { color: '#4aa3ff', color2: '#4aa3ff', note: null })
}

assert.equal(lightColorOf('filament'), 'white')
assert.equal(lightColorOf('bridge'), null)
assert.equal(lightColorOf('color'), 'color')

// The lighting facets live in the URL like the other filters.
const product = (overrides: Partial<FilterableProduct>): FilterableProduct => ({
  categorySlugs: ['smartlys'],
  brandSlug: 'philips-hue',
  price: 449,
  compareAtPrice: null,
  inventory: 10,
  rating: 4.7,
  reviewCount: 10,
  createdAt: '2026-11-10T00:00:00.000Z',
  lightColor: null,
  lightType: null,
  socket: null,
  worksWith: [],
  ...overrides,
})
const bulbs = [
  product({ lightColor: 'color', lightType: 'paerer', socket: 'E27', worksWith: ['bridge', 'bluetooth', 'matter'] }),
  product({ lightColor: 'ambiance', lightType: 'paerer', socket: 'E27', worksWith: ['bridge', 'bluetooth'] }),
  product({ lightColor: 'ambiance', lightType: 'spotter', socket: 'GU10', worksWith: ['bridge'] }),
  product({ lightType: 'bridge', worksWith: ['matter', 'apple-home'] }),
]

const filters = parseFilters({ lysfarge: 'ambiance,color', sokkel: 'E27', 'fungerer-med': 'matter', type: 'paerer' })
assert.deepEqual(filters.lightColors, ['ambiance', 'color'])
assert.deepEqual(filters.sockets, ['E27'])
assert.equal(filtersToQuery(filters), '?lysfarge=ambiance,color&sokkel=E27&fungerer-med=matter&type=paerer')
assert.equal(filtersToQuery(parseFilters({})), '')

assert.equal(applyFilters(bulbs, filters).total, 1)
assert.equal(applyFilters(bulbs, { ...emptyFilters, lightColors: ['ambiance'] }).total, 2)
assert.equal(applyFilters(bulbs, { ...emptyFilters, worksWith: ['matter'] }).total, 2)
assert.equal(applyFilters(bulbs, emptyFilters).total, 4)

// A facet's counts ignore its own selection but respect the others.
const counts = facetCounts(bulbs, { ...emptyFilters, sockets: ['E27'] })
assert.equal(counts.sockets.get('GU10'), 1)
assert.equal(counts.lightColors.get('ambiance'), 1)
assert.equal(counts.lightTypes.get('spotter'), undefined)
