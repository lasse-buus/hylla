/**
 * Category filters, with the URL as the source of truth.
 * Pure functions only, so the server page and the client filter UI share them.
 *
 * URL format: ?kategori=mus,tastatur&merke=vektor&fra=500&til=3000&lager=1&tilbud=1&vurdering=4&sorter=pris-lav&side=2
 * Smart lighting adds ?lysfarge=color&sokkel=E27&fungerer-med=matter&type=spotter
 */

export const PAGE_SIZE = 12

export const sortOptions = [
  { value: 'populaer', label: 'Mest populære' },
  { value: 'pris-lav', label: 'Lavest pris' },
  { value: 'pris-hoy', label: 'Høyest pris' },
  { value: 'vurdering', label: 'Best vurdert' },
  { value: 'nyheter', label: 'Nyheter' },
] as const

export type SortKey = (typeof sortOptions)[number]['value']

export const ratingOptions = [4, 3] as const

export type FilterState = {
  categories: string[]
  brands: string[]
  lightColors: string[]
  sockets: string[]
  worksWith: string[]
  lightTypes: string[]
  minPrice: number | null
  maxPrice: number | null
  inStock: boolean
  onSale: boolean
  minRating: number | null
  sort: SortKey
  page: number
}

/** The fields filtering and sorting need, a subset of the product card data. */
export type FilterableProduct = {
  categorySlugs: string[]
  brandSlug: string | null
  price: number
  compareAtPrice: number | null
  inventory: number
  rating: number | null
  reviewCount: number
  createdAt: string
  /** Smart lighting only (see src/lib/lighting.ts); null or empty on everything else. */
  lightColor: string | null
  lightType: string | null
  socket: string | null
  worksWith: string[]
}

/** The filters where several values can be picked: a product matches when it has any of them. */
const listFacets = {
  categories: { param: 'kategori', values: (product) => product.categorySlugs },
  brands: { param: 'merke', values: (product) => (product.brandSlug ? [product.brandSlug] : []) },
  lightColors: { param: 'lysfarge', values: (product) => (product.lightColor ? [product.lightColor] : []) },
  sockets: { param: 'sokkel', values: (product) => (product.socket ? [product.socket] : []) },
  worksWith: { param: 'fungerer-med', values: (product) => product.worksWith },
  lightTypes: { param: 'type', values: (product) => (product.lightType ? [product.lightType] : []) },
} satisfies Record<string, { param: string; values: (product: FilterableProduct) => string[] }>

export type ListFacet = keyof typeof listFacets

export const listFacetKeys = Object.keys(listFacets) as ListFacet[]

export const emptyFilters: FilterState = {
  categories: [],
  brands: [],
  lightColors: [],
  sockets: [],
  worksWith: [],
  lightTypes: [],
  minPrice: null,
  maxPrice: null,
  inStock: false,
  onSale: false,
  minRating: null,
  sort: 'populaer',
  page: 1,
}

type SearchParams = Record<string, string | string[] | undefined>

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const list = (value: string | string[] | undefined): string[] =>
  [value ?? []]
    .flat()
    .flatMap((entry) => entry.split(','))
    .map((entry) => entry.trim())
    .filter(Boolean)

const wholeNumber = (value: string | string[] | undefined): number | null => {
  const digits = first(value)?.replace(/\D/g, '')
  return digits ? Number(digits) : null
}

export function parseFilters(params: SearchParams): FilterState {
  const sort = first(params.sorter)
  const rating = wholeNumber(params.vurdering)

  return {
    ...emptyFilters,
    ...Object.fromEntries(listFacetKeys.map((key) => [key, list(params[listFacets[key].param])])),
    minPrice: wholeNumber(params.fra),
    maxPrice: wholeNumber(params.til),
    inStock: first(params.lager) === '1',
    onSale: first(params.tilbud) === '1',
    minRating: rating && rating >= 1 && rating <= 5 ? rating : null,
    sort: sortOptions.some((option) => option.value === sort) ? (sort as SortKey) : 'populaer',
    page: Math.max(1, wholeNumber(params.side) ?? 1),
  }
}

/** Builds the query string for a filter state, leaving out defaults so URLs stay short. */
export function filtersToQuery(state: FilterState): string {
  const params = new URLSearchParams()

  for (const key of listFacetKeys) {
    if (state[key].length) params.set(listFacets[key].param, state[key].join(','))
  }
  if (state.minPrice !== null) params.set('fra', String(state.minPrice))
  if (state.maxPrice !== null) params.set('til', String(state.maxPrice))
  if (state.inStock) params.set('lager', '1')
  if (state.onSale) params.set('tilbud', '1')
  if (state.minRating !== null) params.set('vurdering', String(state.minRating))
  if (state.sort !== 'populaer') params.set('sorter', state.sort)
  if (state.page > 1) params.set('side', String(state.page))

  const query = params.toString()
  return query ? `?${query.replaceAll('%2C', ',')}` : ''
}

export const hasActiveFilters = (state: FilterState) =>
  listFacetKeys.some((key) => state[key].length > 0) ||
  state.minPrice !== null ||
  state.maxPrice !== null ||
  state.inStock ||
  state.onSale ||
  state.minRating !== null

/** Toggles a value in a list filter and returns to the first page. */
export const toggleIn = (state: FilterState, key: ListFacet, value: string): FilterState => ({
  ...state,
  [key]: state[key].includes(value) ? state[key].filter((entry) => entry !== value) : [...state[key], value],
  page: 1,
})

export const clearFilters = (state: FilterState): FilterState => ({ ...emptyFilters, sort: state.sort })

/** `skip` leaves one filter out, which is how facet counts are computed. */
function matches(product: FilterableProduct, state: FilterState, skip?: ListFacet): boolean {
  for (const key of listFacetKeys) {
    if (key === skip || !state[key].length) continue
    if (!listFacets[key].values(product).some((value) => state[key].includes(value))) return false
  }
  if (state.minPrice !== null && product.price < state.minPrice) return false
  if (state.maxPrice !== null && product.price > state.maxPrice) return false
  if (state.inStock && product.inventory <= 0) return false
  if (state.onSale && !(product.compareAtPrice && product.compareAtPrice > product.price)) return false
  if (state.minRating !== null && (product.rating ?? 0) < state.minRating) return false
  return true
}

const sorters: Record<SortKey, (a: FilterableProduct, b: FilterableProduct) => number> = {
  populaer: (a, b) => b.reviewCount - a.reviewCount,
  'pris-lav': (a, b) => a.price - b.price,
  'pris-hoy': (a, b) => b.price - a.price,
  vurdering: (a, b) => (b.rating ?? 0) - (a.rating ?? 0) || b.reviewCount - a.reviewCount,
  nyheter: (a, b) => b.createdAt.localeCompare(a.createdAt),
}

export function applyFilters<T extends FilterableProduct>(products: T[], state: FilterState) {
  const filtered = products.filter((product) => matches(product, state)).sort(sorters[state.sort])
  const visible = filtered.slice(0, state.page * PAGE_SIZE)

  return { total: filtered.length, visible, hasMore: visible.length < filtered.length }
}

/** How many products each option would show, given the other active filters. */
export function facetCounts(products: FilterableProduct[], state: FilterState) {
  const counts = Object.fromEntries(listFacetKeys.map((key) => [key, new Map<string, number>()])) as Record<
    ListFacet,
    Map<string, number>
  >

  for (const product of products) {
    for (const key of listFacetKeys) {
      if (!matches(product, state, key)) continue
      for (const value of listFacets[key].values(product)) counts[key].set(value, (counts[key].get(value) ?? 0) + 1)
    }
  }

  return counts
}
