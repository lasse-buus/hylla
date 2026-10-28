import { paragraph, richText } from '../lexical'

export type SeedImage = { file: string; alt: string }

export const images: SeedImage[] = [
  { file: 'c-pc-kabinett.jpg', alt: 'Vektor Core G5 med glassside og blå vifter' },
  { file: 'c-pc-side.jpg', alt: 'Gaming-PC med blå vifter ved en panelvegg' },
  { file: 'gaming-rom.jpg', alt: 'Gaming-PC og buet ultrawide-skjerm på en trepult' },
  { file: 'gaming-utstyr.jpg', alt: 'Tastatur, kontroller og headset på en mørk pult' },
  { file: 'c-tastatur-mus.jpg', alt: 'Tastatur og mus på en stor musematte' },
  { file: 'c-ultrawide.jpg', alt: 'Buet ultrawide-skjerm med blått bakgrunnsbilde' },
  { file: 'c-mus.jpg', alt: 'Trådløs gamingmus på musematte' },
  { file: 'c-kontroller.jpg', alt: 'Svart trådløs kontroller på en pult' },
  { file: 'c-headset-stativ.jpg', alt: 'Gamingheadset med lys på et stativ' },
  { file: 'p-skjerm-27.jpg', alt: 'Vektor Pulse 27″ gamingskjerm' },
  { file: 'p-tastatur-k75.jpg', alt: 'Vektor Tactile K75 mekanisk tastatur' },
  { file: 'p-headset.jpg', alt: 'Klang Ro trådløse hodetelefoner' },
  { file: 'p-laptop.jpg', alt: 'Vektor Air 14 bærbar PC' },
  { file: 'p-robotstovsuger.jpg', alt: 'Heim R3 robotstøvsuger med ladestasjon' },
  { file: 'p-tv-55.jpg', alt: 'Luma View 55″ 4K QLED-TV' },
  { file: 'p-kaffemaskin.jpg', alt: 'Heim Barista kaffemaskin i børstet stål' },
  { file: 'p-hoyttaler.jpg', alt: 'Klang Mini bærbar høyttaler i blått' },
  { file: 'p-mobil.jpg', alt: 'Nord X2 smarttelefon i lyseblått' },
  { file: 'laptop-pult.jpg', alt: 'Bærbar PC på et skrivebord ved vinduet' },
  { file: 'tv-stue.jpg', alt: 'TV på veggen i en lun stue om kvelden' },
  { file: 'vaskerom.jpg', alt: 'Vaskemaskin i et lyst vaskerom' },
  { file: 'lifestyle-kaffe.jpg', alt: 'Espressomaskin på kjøkkenbenken' },
]

export const brands = [
  { slug: 'vektor', name: 'Vektor', description: 'Gaming-PC-er, skjermer og utstyr designet for lange kvelder.' },
  { slug: 'klang', name: 'Klang', description: 'Lyd for hverdagen, fra headset til høyttalere.' },
  { slug: 'heim', name: 'Heim', description: 'Smarte hjelpere til kjøkken og hjem.' },
  { slug: 'luma', name: 'Luma', description: 'TV-er med skarpt bilde og enkel smart-TV.' },
  { slug: 'nova', name: 'Nova', description: 'Kontrollere og tilbehør for PC og konsoll.' },
  { slug: 'nord', name: 'Nord', description: 'Mobiler med batteri som holder følge.' },
]

export type SeedCategory = {
  slug: string
  title: string
  parent?: string
  menuGroup?: string
  icon?: string
  sortOrder: number
  description?: string
  heroImage?: string
  menuPromo?: { eyebrow: string; product: string; image: string; guide?: string }
}

type MenuLink = [slug: string, title: string, icon?: string]

/**
 * The department → group → subcategory tree that drives the mega menu.
 * Groups are labels on the subcategories (`menuGroup`), not categories of their own.
 */
const menuTree: Record<string, [group: string, links: MenuLink[]][]> = {
  gaming: [
    ['PC og konsoll', [['gaming-pc', 'Gaming-PC', 'cpu'], ['baerbare-gaming-pc', 'Bærbare gaming-PC-er', 'laptop'], ['konsoller', 'Konsoller', 'gamepad'], ['spill', 'Spill', 'gamepad'], ['vr-briller', 'VR-briller', 'gamepad']]],
    ['Skjerm og utstyr', [['gamingskjermer', 'Skjermer', 'monitor'], ['mus', 'Mus', 'mouse'], ['tastatur', 'Tastatur', 'keyboard'], ['headset', 'Headset', 'headphones'], ['kontrollere', 'Kontrollere', 'gamepad']]],
    ['Oppsett', [['gamingstoler', 'Gamingstoler', 'armchair'], ['gamingbord', 'Gamingbord', 'armchair'], ['musematter', 'Musematter', 'mouse'], ['gamingbelysning', 'Belysning'], ['stromming-og-opptak', 'Strømming og opptak'], ['gamingtilbehor', 'Tilbehør', 'cable']]],
  ],
  'pc-og-data': [
    ['Datamaskiner', [['baerbare-pc', 'Bærbare PC-er', 'laptop'], ['stasjonaere-pc', 'Stasjonære PC-er', 'cpu'], ['alt-i-ett-pc', 'Alt-i-ett-PC-er', 'monitor'], ['chromebook', 'Chromebook', 'laptop'], ['fornyede-pc', 'Brukte og fornyede']]],
    ['Komponenter', [['grafikkort', 'Grafikkort', 'cpu'], ['prosessorer', 'Prosessorer', 'cpu'], ['minne', 'Minne'], ['lagring-og-ssd', 'Lagring og SSD'], ['hovedkort', 'Hovedkort']]],
    ['Kontor', [['pc-skjermer', 'PC-skjermer', 'monitor'], ['skrivere', 'Skrivere'], ['webkamera', 'Webkamera'], ['dokkingstasjoner', 'Dokkingstasjoner', 'cable'], ['programvare', 'Programvare']]],
  ],
  'mobil-og-nettbrett': [
    ['Mobil', [['mobiltelefoner', 'Alle mobiltelefoner', 'smartphone'], ['seniortelefoner', 'Seniortelefoner', 'smartphone'], ['fornyede-mobiler', 'Fornyede mobiler', 'smartphone'], ['mobilabonnement', 'Mobilabonnement']]],
    ['Nettbrett', [['nettbrett', 'Alle nettbrett'], ['lesebrett', 'Lesebrett'], ['nettbrett-for-barn', 'Nettbrett for barn']]],
    ['Tilbehør', [['deksler', 'Deksler'], ['mobilladere', 'Ladere', 'cable'], ['skjermbeskyttere', 'Skjermbeskyttere'], ['smartklokker', 'Smartklokker'], ['treningsarmband', 'Treningsarmbånd']]],
  ],
  'tv-og-lyd': [
    ['TV', [['tv', '4K TV', 'tv'], ['oled-tv', 'OLED TV', 'tv'], ['qled-tv', 'QLED TV', 'tv'], ['store-tv', 'Store TV-er 75″+', 'tv'], ['tv-stativer', 'TV-stativer og -fester']]],
    ['Lyd', [['lydplanker', 'Lydplanker', 'headphones'], ['hoyttalere', 'Høyttalere', 'headphones'], ['hodetelefoner', 'Hodetelefoner', 'headphones'], ['hi-fi', 'Hi-fi'], ['platespillere', 'Platespillere']]],
    ['Hjemmekino', [['projektorer', 'Projektorer'], ['mediaspillere', 'Mediaspillere'], ['tv-kabler', 'Kabler', 'cable'], ['fjernkontroller', 'Fjernkontroller']]],
  ],
  'hjem-og-kjokken': [
    ['Kjøkken', [['kaffemaskiner', 'Kaffemaskiner', 'coffee'], ['airfryere', 'Airfryere'], ['blendere', 'Blendere'], ['vannkokere', 'Vannkokere', 'coffee'], ['mikrobolgeovner', 'Mikrobølgeovner']]],
    ['Rengjøring', [['robotstovsugere', 'Robotstøvsugere', 'washing-machine'], ['stovsugere', 'Støvsugere'], ['vaskemaskiner', 'Vaskemaskiner', 'washing-machine'], ['torketromler', 'Tørketromler', 'washing-machine']]],
    ['Smarthus', [['smarthoyttalere', 'Smarthøyttalere', 'headphones'], ['smartlys', 'Smartlys'], ['overvakingskameraer', 'Overvåkingskameraer'], ['termostater', 'Termostater']]],
  ],
  tilbehor: [
    ['Strøm og lading', [['powerbanker', 'Powerbanker'], ['ladere', 'Ladere', 'cable'], ['kabler', 'Kabler', 'cable'], ['skjoteledninger', 'Skjøteledninger', 'cable']]],
    ['Nettverk', [['rutere', 'Rutere'], ['mesh-nettverk', 'Mesh-nettverk'], ['switcher', 'Switcher'], ['nettverkskabler', 'Nettverkskabler', 'cable']]],
    ['Lagring', [['minnekort', 'Minnekort'], ['minnepinner', 'Minnepinner'], ['eksterne-harddisker', 'Eksterne harddisker'], ['skylagring', 'Skylagring']]],
  ],
}

function subcategories(): SeedCategory[] {
  return Object.entries(menuTree).flatMap(([parent, groups]) => {
    let sortOrder = 0
    return groups.flatMap(([menuGroup, links]) =>
      links.map(([slug, title, icon]) => {
        sortOrder += 1
        return { slug, title, parent, menuGroup, icon, sortOrder }
      }),
    )
  })
}

export const categories: SeedCategory[] = [
  {
    slug: 'gaming',
    title: 'Gaming',
    icon: 'gamepad',
    sortOrder: 1,
    description:
      'Gaming-PC-er, skjermer og utstyr som spiller på lag med deg. Fra første oppsett til den siste detaljen.',
    heroImage: 'gaming-utstyr.jpg',
    menuPromo: { eyebrow: 'SPAR 3 000 KR', product: 'vektor-core-g5', image: 'c-pc-side.jpg', guide: 'slik-velger-du-riktig-gaming-pc' },
  },
  {
    slug: 'pc-og-data',
    title: 'PC & data',
    icon: 'laptop',
    sortOrder: 2,
    menuPromo: { eyebrow: 'SPAR 2 000 KR', product: 'vektor-air-14', image: 'laptop-pult.jpg', guide: 'hvilken-pc-passer-til-din-hverdag' },
  },
  {
    slug: 'mobil-og-nettbrett',
    title: 'Mobil & nettbrett',
    icon: 'smartphone',
    sortOrder: 3,
    menuPromo: { eyebrow: 'NYHET', product: 'nord-x2', image: 'p-mobil.jpg' },
  },
  {
    slug: 'tv-og-lyd',
    title: 'TV & lyd',
    icon: 'tv',
    sortOrder: 4,
    menuPromo: { eyebrow: 'KUNDEFAVORITT', product: 'luma-view-55', image: 'tv-stue.jpg', guide: 'stor-lyd-uten-et-stort-oppsett' },
  },
  {
    slug: 'hjem-og-kjokken',
    title: 'Hjem & kjøkken',
    icon: 'coffee',
    sortOrder: 5,
    menuPromo: { eyebrow: 'BESTSELGER', product: 'heim-barista', image: 'lifestyle-kaffe.jpg', guide: 'finn-vaskemaskinen-som-passer' },
  },
  {
    slug: 'tilbehor',
    title: 'Tilbehør',
    icon: 'cable',
    sortOrder: 6,
    menuPromo: { eyebrow: 'KUNDEFAVORITT', product: 'klang-mini', image: 'p-hoyttaler.jpg' },
  },
  ...subcategories(),
]

export type SeedVariant = {
  sku: string
  options: { type: string; value: string }[]
  price: number
  compareAtPrice?: number
  inventory: number
}

export type SeedProduct = {
  slug: string
  sku: string
  title: string
  brand: string
  categories: string[]
  shortSpecs: string
  price: number
  compareAtPrice?: number
  inventory: number
  badge?: 'none' | 'new' | 'bestseller' | 'favorite' | 'flagship'
  rating: number
  reviewCount: number
  gallery: string[]
  highlights?: string[]
  overviewTitle?: string
  description?: string[]
  features?: { icon: string; title: string; text: string }[]
  specGroups?: { title: string; rows: [string, string][] }[]
  faq?: { question: string; answer: string }[]
  related?: string[]
  variantTypes?: string[]
  variants?: SeedVariant[]
}

export const variantTypes = [
  {
    name: 'lagring',
    label: 'Lagring',
    options: [
      { value: '1tb', label: '1 TB NVMe SSD' },
      { value: '2tb', label: '2 TB NVMe SSD' },
    ],
  },
  {
    name: 'minne',
    label: 'Minne',
    options: [
      { value: '32gb', label: '32 GB DDR5' },
      { value: '64gb', label: '64 GB DDR5' },
    ],
  },
]

export const products: SeedProduct[] = [
  {
    slug: 'vektor-core-g5',
    sku: '482913',
    title: 'Vektor Core G5 gaming-PC',
    brand: 'vektor',
    categories: ['gaming', 'gaming-pc'],
    shortSpecs: 'RTX 5070 · Ryzen 7 9700X · 32 GB RAM · 2 TB SSD',
    price: 12990,
    compareAtPrice: 15990,
    inventory: 35,
    badge: 'bestseller',
    rating: 4.8,
    reviewCount: 124,
    gallery: ['c-pc-kabinett.jpg', 'gaming-rom.jpg', 'c-pc-side.jpg', 'c-tastatur-mus.jpg', 'gaming-utstyr.jpg'],
    highlights: [
      'NVIDIA GeForce RTX 5070 med 12 GB GDDR7',
      'AMD Ryzen 7 9700X, 8 kjerner',
      '32 GB DDR5 RAM og 2 TB NVMe SSD',
      'Windows 11 Home, ferdig installert og oppdatert',
    ],
    overviewTitle: 'Klar for 1440p. Stille når det gjelder.',
    description: [
      'Vektor Core G5 er bygget for deg som vil spille de nyeste spillene i høy oppløsning uten å bruke kvelden på oppsett. Den kommer ferdig montert, testet og oppdatert, så du kan koble til og starte.',
      'Kabinettet har god luftflyt og plass til å vokse. Når du vil oppgradere, er det ledige spor for både minne og lagring.',
    ],
    features: [
      { icon: 'monitor', title: 'Grafikk for høye bilderater', text: 'RTX 5070 gir jevn spilling i 1440p med høye grafikkinnstillinger.' },
      { icon: 'wind', title: 'Kjølig og stillegående', text: '240 mm vannkjøling og tre store vifter holder lydnivået nede.' },
      { icon: 'wrench', title: 'Enkel å oppgradere', text: 'Verktøyfri sidepanel, ledige minnespor og plass til en ekstra M.2-disk.' },
      { icon: 'headphones', title: 'Hjelp når du trenger det', text: 'Gamingteamet vårt hjelper deg med oppsett, drivere og oppgraderinger.' },
    ],
    specGroups: [
      {
        title: 'Ytelse',
        rows: [
          ['Prosessor', 'AMD Ryzen 7 9700X, 8 kjerner / 16 tråder'],
          ['Grafikkort', 'NVIDIA GeForce RTX 5070, 12 GB GDDR7'],
          ['Minne', '32 GB DDR5 6000 MHz (2 × 16 GB)'],
          ['Lagring', '2 TB NVMe M.2 SSD, PCIe 4.0'],
        ],
      },
      {
        title: 'Kjøling og strøm',
        rows: [
          ['Prosessorkjøling', '240 mm vannkjøling'],
          ['Vifter', '3 × 140 mm, ARGB'],
          ['Strømforsyning', '750 W, 80 Plus Gold'],
        ],
      },
      {
        title: 'Tilkobling',
        rows: [
          ['Front', '2 × USB-A 3.2, 1 × USB-C, lyd'],
          ['Bak', '4 × USB-A, 1 × USB-C, HDMI 2.1, 3 × DisplayPort 2.1'],
          ['Nettverk', '2,5 Gbit Ethernet, Wi-Fi 7, Bluetooth 5.4'],
        ],
      },
      {
        title: 'Fysisk og programvare',
        rows: [
          ['Mål (H × B × D)', '47 × 22 × 46 cm'],
          ['Vekt', '11,4 kg'],
          ['Operativsystem', 'Windows 11 Home'],
          ['Garanti', '2 år, 5 års reklamasjonsrett'],
        ],
      },
    ],
    faq: [
      {
        question: 'Kan jeg koble til tre skjermer?',
        answer: 'Ja. Grafikkortet har én HDMI 2.1- og tre DisplayPort-utganger, så du kan bruke opptil fire skjermer samtidig.',
      },
      {
        question: 'Følger det med tastatur, mus og skjerm?',
        answer: 'Nei, maskinen leveres uten utstyr. Du kan legge til skjerm, tastatur og headset under «Fullfør oppsettet».',
      },
    ],
    related: ['vektor-pulse-27', 'vektor-tactile-k75', 'vektor-glide-m2', 'klang-arena-h7'],
    variantTypes: ['lagring', 'minne'],
    variants: [
      { sku: '482913-1T32', options: [{ type: 'lagring', value: '1tb' }, { type: 'minne', value: '32gb' }], price: 11990, compareAtPrice: 14990, inventory: 9 },
      { sku: '482913-2T32', options: [{ type: 'lagring', value: '2tb' }, { type: 'minne', value: '32gb' }], price: 12990, compareAtPrice: 15990, inventory: 18 },
      { sku: '482913-1T64', options: [{ type: 'lagring', value: '1tb' }, { type: 'minne', value: '64gb' }], price: 13490, compareAtPrice: 16490, inventory: 3 },
      { sku: '482913-2T64', options: [{ type: 'lagring', value: '2tb' }, { type: 'minne', value: '64gb' }], price: 14490, compareAtPrice: 17490, inventory: 5 },
    ],
  },
  {
    slug: 'vektor-core-g7',
    sku: '482977',
    title: 'Vektor Core G7 gaming-PC',
    brand: 'vektor',
    categories: ['gaming', 'gaming-pc'],
    shortSpecs: 'RTX 5080 · Ryzen 9 9900X · 64 GB RAM · 2 TB SSD',
    price: 24990,
    inventory: 6,
    badge: 'favorite',
    rating: 4.9,
    reviewCount: 58,
    gallery: ['c-pc-side.jpg', 'gaming-rom.jpg'],
    highlights: ['NVIDIA GeForce RTX 5080 med 16 GB GDDR7', 'AMD Ryzen 9 9900X, 12 kjerner', '64 GB DDR5 RAM og 2 TB NVMe SSD'],
    specGroups: [
      {
        title: 'Ytelse',
        rows: [
          ['Prosessor', 'AMD Ryzen 9 9900X, 12 kjerner / 24 tråder'],
          ['Grafikkort', 'NVIDIA GeForce RTX 5080, 16 GB GDDR7'],
          ['Minne', '64 GB DDR5 6000 MHz'],
          ['Lagring', '2 TB NVMe M.2 SSD, PCIe 5.0'],
        ],
      },
    ],
    related: ['vektor-pulse-34', 'vektor-tactile-k75', 'klang-arena-h7'],
  },
  {
    slug: 'vektor-pulse-27',
    sku: '510274',
    title: 'Vektor Pulse 27″ gamingskjerm',
    brand: 'vektor',
    categories: ['gaming', 'gamingskjermer'],
    shortSpecs: 'QHD · 180 Hz · 1 ms · IPS-panel',
    price: 2490,
    compareAtPrice: 3490,
    inventory: 52,
    rating: 4.8,
    reviewCount: 63,
    gallery: ['p-skjerm-27.jpg'],
    specGroups: [
      { title: 'Skjerm', rows: [['Størrelse', '27″'], ['Oppløsning', '2560 × 1440 (QHD)'], ['Oppdateringsfrekvens', '180 Hz'], ['Responstid', '1 ms (GtG)']] },
    ],
    related: ['vektor-core-g5', 'vektor-pulse-34'],
  },
  {
    slug: 'vektor-pulse-34',
    sku: '510349',
    title: 'Vektor Pulse 34″ ultrawide-skjerm',
    brand: 'vektor',
    categories: ['gaming', 'gamingskjermer'],
    shortSpecs: 'UWQHD · 165 Hz · Buet VA-panel',
    price: 4490,
    compareAtPrice: 5990,
    inventory: 12,
    rating: 4.7,
    reviewCount: 38,
    gallery: ['c-ultrawide.jpg', 'gaming-rom.jpg'],
    specGroups: [
      { title: 'Skjerm', rows: [['Størrelse', '34″, buet 1500R'], ['Oppløsning', '3440 × 1440 (UWQHD)'], ['Oppdateringsfrekvens', '165 Hz']] },
    ],
  },
  {
    slug: 'vektor-tactile-k75',
    sku: '520751',
    title: 'Vektor Tactile K75 tastatur',
    brand: 'vektor',
    categories: ['gaming', 'tastatur'],
    shortSpecs: 'Mekanisk · Trådløst · Nordisk layout',
    price: 1290,
    inventory: 64,
    badge: 'new',
    rating: 4.9,
    reviewCount: 21,
    gallery: ['p-tastatur-k75.jpg'],
  },
  {
    slug: 'vektor-glide-m2',
    sku: '520822',
    title: 'Vektor Glide M2 gamingmus',
    brand: 'vektor',
    categories: ['gaming', 'mus'],
    shortSpecs: '59 g · 26 000 DPI · Trådløs',
    price: 790,
    inventory: 58,
    badge: 'bestseller',
    rating: 4.8,
    reviewCount: 147,
    gallery: ['c-mus.jpg'],
  },
  {
    slug: 'klang-arena-h7',
    sku: '531077',
    title: 'Klang Arena H7 gamingheadset',
    brand: 'klang',
    categories: ['gaming', 'headset'],
    shortSpecs: 'Trådløst · 7.1 surround · 40 t batteritid',
    price: 1090,
    compareAtPrice: 1490,
    inventory: 104,
    rating: 4.7,
    reviewCount: 92,
    gallery: ['c-headset-stativ.jpg'],
  },
  {
    slug: 'nova-pro-kontroller',
    sku: '540190',
    title: 'Nova Pro trådløs kontroller',
    brand: 'nova',
    categories: ['gaming', 'kontrollere'],
    shortSpecs: 'Hall-effekt-spaker · PC og konsoll',
    price: 790,
    inventory: 30,
    badge: 'new',
    rating: 4.6,
    reviewCount: 44,
    gallery: ['c-kontroller.jpg'],
  },
  {
    slug: 'vektor-air-14',
    sku: '600140',
    title: 'Vektor Air 14 bærbar PC',
    brand: 'vektor',
    categories: ['pc-og-data', 'baerbare-pc'],
    shortSpecs: '14″ OLED · 16 GB RAM · 512 GB SSD',
    price: 8990,
    compareAtPrice: 10990,
    inventory: 50,
    rating: 4.8,
    reviewCount: 42,
    gallery: ['p-laptop.jpg', 'laptop-pult.jpg'],
  },
  {
    slug: 'klang-ro',
    sku: '531010',
    title: 'Klang Ro trådløse hodetelefoner',
    brand: 'klang',
    categories: ['tv-og-lyd', 'hodetelefoner'],
    shortSpecs: 'Aktiv støydemping · 50 t batteritid',
    price: 1490,
    compareAtPrice: 1990,
    inventory: 100,
    rating: 4.7,
    reviewCount: 86,
    gallery: ['p-headset.jpg'],
  },
  {
    slug: 'heim-r3',
    sku: '700303',
    title: 'Heim R3 robotstøvsuger',
    brand: 'heim',
    categories: ['hjem-og-kjokken', 'robotstovsugere'],
    shortSpecs: 'Støvsuger og mopper · LiDAR-navigasjon',
    price: 3490,
    compareAtPrice: 4990,
    inventory: 24,
    rating: 4.6,
    reviewCount: 28,
    gallery: ['p-robotstovsuger.jpg'],
  },
  {
    slug: 'luma-view-55',
    sku: '650055',
    title: 'Luma View 55″ 4K QLED-TV',
    brand: 'luma',
    categories: ['tv-og-lyd', 'tv'],
    shortSpecs: '4K HDR · 120 Hz · Smart TV',
    price: 7990,
    inventory: 18,
    badge: 'favorite',
    rating: 4.8,
    reviewCount: 54,
    gallery: ['p-tv-55.jpg', 'tv-stue.jpg'],
  },
  {
    slug: 'heim-barista',
    sku: '710020',
    title: 'Heim Barista kaffemaskin',
    brand: 'heim',
    categories: ['hjem-og-kjokken', 'kaffemaskiner'],
    shortSpecs: 'Integrert kvern · Melkeskummer · 15 bar',
    price: 4490,
    inventory: 32,
    badge: 'bestseller',
    rating: 4.7,
    reviewCount: 39,
    gallery: ['p-kaffemaskin.jpg', 'lifestyle-kaffe.jpg'],
  },
  {
    slug: 'klang-mini',
    sku: '531120',
    title: 'Klang Mini bærbar høyttaler',
    brand: 'klang',
    categories: ['tv-og-lyd', 'hoyttalere', 'tilbehor'],
    shortSpecs: 'Bluetooth · IP67 · 20 t spilletid',
    price: 790,
    inventory: 120,
    badge: 'favorite',
    rating: 4.7,
    reviewCount: 77,
    gallery: ['p-hoyttaler.jpg'],
  },
  {
    slug: 'nord-x2',
    sku: '800220',
    title: 'Nord X2 smarttelefon',
    brand: 'nord',
    categories: ['mobil-og-nettbrett', 'mobiltelefoner'],
    shortSpecs: '6,5″ OLED · 50 MP kamera · 5G',
    price: 5990,
    inventory: 40,
    badge: 'new',
    rating: 4.6,
    reviewCount: 31,
    gallery: ['p-mobil.jpg'],
  },
]

/**
 * A plausible star distribution whose average rounds to the product's rating:
 * a small tail of low ratings, then enough 4★ to bring the average down from 5.
 */
export function ratingBreakdownFor({ rating, reviewCount: count }: SeedProduct) {
  let deficit = Math.round(count * 5 - rating * count)
  const tail = (share: number, cost: number) => {
    const amount = Math.min(Math.floor(count * share), Math.floor(deficit / cost))
    deficit -= amount * cost
    return amount
  }
  const stars1 = tail(0.01, 4)
  const stars2 = tail(0.01, 3)
  const stars3 = tail(0.03, 2)
  const stars4 = deficit
  return { stars5: count - stars4 - stars3 - stars2 - stars1, stars4, stars3, stars2, stars1 }
}

export const descriptionFor = (product: SeedProduct) =>
  product.description?.length ? richText(...product.description.map((value) => paragraph(value))) : undefined

export const reviews = [
  {
    product: 'vektor-core-g5',
    authorName: 'Jonas K.',
    place: 'Bergen',
    rating: 5,
    title: 'Stille og rask fra første oppstart',
    body: 'Kom ferdig oppsatt, og jeg spilte i 1440p samme kveld. Viftene er overraskende stille, også i lange økter.',
    helpfulCount: 24,
    daysAgo: 9,
  },
  {
    product: 'vektor-core-g5',
    authorName: 'Sara M.',
    place: 'Trondheim',
    rating: 5,
    title: 'Ryddig bygget og lett å oppgradere',
    body: 'Kablene er pent lagt, og det er lett å komme til de ledige minnesporene. Fikk god hjelp av kundeservice med Windows-oppsettet.',
    helpfulCount: 11,
    daysAgo: 18,
  },
  {
    product: 'vektor-core-g5',
    authorName: 'Emil H.',
    place: 'Oslo',
    rating: 4,
    title: 'Mye maskin for pengene',
    body: 'Skulle gjerne hatt mer kontroll over lyset i programvaren, men ytelsen er akkurat det jeg håpet på.',
    helpfulCount: 7,
    daysAgo: 25,
  },
  {
    product: 'vektor-pulse-27',
    authorName: 'Maria L.',
    place: 'Stavanger',
    rating: 5,
    title: 'Skarpt bilde og jevn bevegelse',
    body: 'Merker stor forskjell fra 60 Hz. Foten er stabil, og det var enkelt å justere høyden.',
    helpfulCount: 5,
    daysAgo: 12,
  },
  {
    product: 'heim-barista',
    authorName: 'Ola B.',
    place: 'Tromsø',
    rating: 5,
    title: 'Kafékaffe hjemme',
    body: 'Kvernen er justerbar, og melkeskummeren gir fin konsistens. Litt læring i starten, men verdt det.',
    helpfulCount: 9,
    daysAgo: 30,
  },
]
