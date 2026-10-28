type ID = number | string

type Refs = {
  category: (slug: string) => ID
  product: (slug: string) => ID
  media: (file: string) => ID
}

const linkTo = (relationTo: 'categories' | 'products' | 'guides', value: ID, label: string) => ({
  label,
  reference: { relationTo, value },
  url: null,
})

/**
 * The front page as designed in the "Forside" artboard.
 */
export const homeLayout = ({ category, product, media }: Refs) => [
  {
    blockType: 'hero',
    eyebrow: 'Høstens oppgradering',
    title: 'Mer kraft.\nMer spilleglede.',
    text: 'Gjør mørke kvelder til neste level. Spar på gaming-PC, skjermer og utstyr.',
    link: linkTo('categories', category('gaming'), 'Se alle gamingtilbud'),
    highlightLabel: 'Spar opptil',
    highlightValue: '30 %',
    finePrint: 'Gjelder til 1. november eller så langt lageret rekker.',
    image: media('gaming-rom.jpg'),
    featuredProduct: product('vektor-core-g5'),
  },
  {
    blockType: 'categoryGrid',
    title: 'Hva vil du oppgradere?',
    categories: [],
  },
  {
    blockType: 'productTabs',
    title: 'Små priser. Store oppgraderinger.',
    intro: 'Ukens kupp – håndplukket for hverdagen din.',
    link: { label: 'Se alle tilbud', reference: null, url: '/tilbud' },
    onSaleOnly: true,
    limit: 4,
    tabs: [
      { label: 'PC & gaming', categories: [category('gaming'), category('pc-og-data')] },
      { label: 'Mobil & tilbehør', categories: [category('mobil-og-nettbrett'), category('tilbehor')] },
      { label: 'TV & lyd', categories: [category('tv-og-lyd')] },
      { label: 'Hjem & kjøkken', categories: [category('hjem-og-kjokken')] },
    ],
    finePrint: 'Alle priser er i NOK inkl. mva. Førpris er laveste pris de siste 30 dagene.',
  },
  {
    blockType: 'promoCards',
    cards: [
      {
        eyebrow: 'Hjem & kjøkken',
        title: 'Litt smartere.\nMye enklere.',
        text: 'Fra første kaffekopp til nyvaskede gulv. Finn dine nye hverdagshjelpere.',
        image: media('lifestyle-kaffe.jpg'),
        link: linkTo('categories', category('hjem-og-kjokken'), 'Gjør hjemmet smartere'),
        tone: 'sand',
      },
      {
        eyebrow: 'Mobil & nettbrett',
        title: 'Ny mobil.\nNye muligheter.',
        text: 'Møt Nord X2. Skarpe øyeblikk og batteri som holder følge.',
        image: media('p-mobil.jpg'),
        link: linkTo('products', product('nord-x2'), 'Finn din nye mobil'),
        product: product('nord-x2'),
        tone: 'blue',
      },
    ],
  },
  {
    blockType: 'productList',
    title: 'Populært akkurat nå',
    intro: 'Teknologien kundene våre kommer tilbake for.',
    source: 'popular',
    limit: 4,
  },
  {
    blockType: 'ctaBanner',
    eyebrow: 'Hylla Gaming',
    icon: 'gamepad',
    title: 'Ditt neste level\nstarter her.',
    text: 'Bygg et oppsett som spiller på lag med deg. Fra første gaming-PC til den siste detaljen.',
    link: linkTo('categories', category('gaming'), 'Utforsk gaminguniverset'),
    image: media('gaming-utstyr.jpg'),
    shortcuts: [category('gaming-pc'), category('gamingskjermer'), category('tastatur')],
  },
  {
    blockType: 'guideList',
    title: 'Litt hjelp til å velge riktig',
    intro: 'Enkle råd. Smarte valg. Mer ut av teknologien din.',
    link: { label: 'Alle guider og tips', reference: null, url: '/guider' },
    source: 'latest',
    limit: 3,
  },
  {
    blockType: 'serviceHighlights',
    title: 'Trygt å handle. Enkelt å få hjelp.',
    intro: 'Vi er her for hele produktets levetid.',
    items: [
      { icon: 'truck', title: 'Fri frakt over 1 000 kr', text: 'Bestill innen kl. 16, så sender vi samme dag.', link: { label: 'Levering og frakt', reference: null, url: '/kundeservice#levering' } },
      { icon: 'return', title: '30 dagers åpent kjøp', text: 'Ombestemt deg? Returner varen gratis i butikk.', link: { label: 'Om åpent kjøp', reference: null, url: '/kundeservice#retur' } },
      { icon: 'help', title: 'Hjelp fra ekspertene', text: 'Produktekspertene våre hjelper deg å velge og komme i gang.', link: { label: 'Kontakt oss', reference: null, url: '/kundeservice#kontakt' } },
      { icon: 'repair', title: 'Service og reparasjon', text: 'Vi tar oss av reklamasjon og reparasjon når noe går galt.', link: { label: 'Reklamasjon og service', reference: null, url: '/kundeservice#reklamasjon' } },
    ],
  },
]
