import { block, bulletList, heading, paragraph, richText, text } from '../lexical'

export const authors = [
  {
    slug: 'martin-hagen',
    name: 'Martin Hagen',
    role: 'Produktekspert, Hylla Gaming',
    bio: 'Martin tester gamingutstyr for Hylla og hjelper kunder med å finne riktig oppsett.',
  },
  {
    slug: 'ingrid-solheim',
    name: 'Ingrid Solheim',
    role: 'Produktekspert, hjem og lyd',
    bio: 'Ingrid tester alt fra kaffemaskiner til lydplanker, og skriver guider for hverdagen.',
  },
]

export type SeedGuide = {
  slug: string
  title: string
  kicker: string
  excerpt: string
  heroImage: string
  heroCaption?: string
  department: string
  author: string
  readingMinutes: number
  daysAgo: number
  relatedProducts: string[]
  /** Built after products exist, so product embeds can reference real IDs. */
  content: (productID: (slug: string) => number | string) => ReturnType<typeof richText>
}

export const guides: SeedGuide[] = [
  {
    slug: 'slik-velger-du-riktig-gaming-pc',
    title: 'Slik velger du riktig gaming-PC',
    kicker: 'Gaming · Kjøpeguide',
    excerpt:
      'Grafikkort, prosessor, minne: hva betyr egentlig noe for spillene dine? Vi forklarer hva du bør prioritere, og hvor du trygt kan spare.',
    heroImage: 'gaming-rom.jpg',
    heroCaption: 'Vektor Core G5 med Vektor Pulse 27″ i et typisk 1440p-oppsett.',
    department: 'gaming',
    author: 'martin-hagen',
    readingMinutes: 8,
    daysAgo: 3,
    relatedProducts: ['vektor-core-g5', 'vektor-pulse-27', 'vektor-glide-m2'],
    content: (productID) =>
      richText(
        paragraph(
          'En gaming-PC er en investering du skal ha glede av i flere år. Den gode nyheten er at du ikke trenger å forstå alle tekniske detaljer. Får du noen få valg riktig, faller resten på plass.',
        ),
        heading('1. Start med skjermen og spillene'),
        paragraph(
          'Det er skjermen som bestemmer hvor mye kraft du trenger. Spiller du i full HD på en 144 Hz-skjerm, holder det med en maskin i inngangsklassen. Har du, eller planlegger du, en 1440p-skjerm med høy oppdateringsfrekvens, bør du se mot mellomklassen.',
        ),
        paragraph(
          'Tenk også på hvilke spill du spiller. Konkurransespill er lette å kjøre, mens store åpne verdener krever mer av grafikkortet.',
        ),
        heading('2. Grafikkortet er viktigst'),
        paragraph(
          'I de fleste spill er det grafikkortet som avgjør hvor jevnt bildet går. Bruker du mest penger på én komponent, bør det være denne. Se etter minst 12 GB grafikkminne hvis du vil spille i 1440p de neste årene.',
        ),
        block('tip', {
          title: 'Tips fra eksperten',
          text: 'Det er ofte smartere å velge et sterkere grafikkort og litt mindre lagring. Lagring er enkelt og billig å legge til senere. Grafikkortet er det ikke.',
        }),
        heading('3. Prosessor og minne'),
        paragraph(
          'Prosessoren må henge med grafikkortet, men du trenger sjelden den dyreste modellen. For gaming er dette en god tommelfingerregel:',
        ),
        bulletList([
          [text('6–8 kjerner', { bold: true }), text(' er nok for nesten alle spill i dag.')],
          [text('32 GB minne', { bold: true }), text(' gir god margin, også om du strømmer mens du spiller.')],
          [text('NVMe SSD på minst 1 TB', { bold: true }), text(' gir korte lastetider og plass til flere store spill.')],
        ]),
        heading('4. Hvor mye bør du bruke?'),
        paragraph('Her er en enkel oversikt over de tre prisnivåene i sortimentet vårt, og hvem de passer for.'),
        block('comparisonTable', {
          caption: 'Sammenligning av prisnivåer for gaming-PC',
          columns: [{ label: 'Inngang' }, { label: 'Mellomklasse', highlight: true }, { label: 'Toppklasse' }],
          rows: [
            { label: 'Passer for', cells: [{ value: 'Esport og lettere spill' }, { value: 'De fleste spillere' }, { value: 'Entusiaster og strømming' }] },
            { label: 'Oppløsning', cells: [{ value: '1080p' }, { value: '1440p' }, { value: '1440p og 4K' }] },
            { label: 'Minne', cells: [{ value: '16 GB' }, { value: '32 GB' }, { value: '32–64 GB' }] },
            { label: 'Pris hos Hylla', cells: [{ value: 'Fra 8 990,–' }, { value: '12 000–18 000,–' }, { value: 'Fra 20 000,–' }] },
          ],
        }),
        block('productEmbed', { label: 'Vår anbefaling i mellomklassen', product: productID('vektor-core-g5') }),
        heading('5. Tenk på hele oppsettet'),
        paragraph(
          'En rask maskin kommer best til sin rett med en skjerm som kan vise bildene den lager. Sett av penger til en skjerm med høy oppdateringsfrekvens, en mus som ligger godt i hånden og et headset du kan ha på i timevis.',
        ),
        block('checklist', {
          title: 'Sjekkliste før du kjøper',
          items: [
            { text: 'Vet du hvilken oppløsning og Hz skjermen din har?' },
            { text: 'Har grafikkortet nok minne for spillene du vil spille?' },
            { text: 'Er det minst 1 TB lagring, eller plass til å utvide?' },
            { text: 'Har du satt av budsjett til skjerm, mus og headset?' },
          ],
        }),
      ),
  },
  {
    slug: 'hz-ms-og-paneltyper',
    title: 'Hz, ms og paneltyper: Finn riktig gamingskjerm',
    kicker: 'Skjermer',
    excerpt: 'Oppdateringsfrekvens, responstid og paneltype forklart på norsk, og hva som faktisk merkes når du spiller.',
    heroImage: 'c-ultrawide.jpg',
    department: 'gaming',
    author: 'martin-hagen',
    readingMinutes: 6,
    daysAgo: 10,
    relatedProducts: ['vektor-pulse-27', 'vektor-pulse-34'],
    content: (productID) =>
      richText(
        paragraph('Tre tall dukker opp på nesten alle gamingskjermer: Hz, ms og paneltype. Her er hva de betyr i praksis.'),
        heading('Hz: hvor mange bilder i sekundet'),
        paragraph(
          'En skjerm på 144 Hz eller mer gjør bevegelser merkbart jevnere enn en vanlig 60 Hz-skjerm. Over 180 Hz er forskjellen mindre for de fleste.',
        ),
        heading('ms: hvor raskt pikslene skifter'),
        paragraph('Lav responstid gir mindre slør bak objekter i bevegelse. 1–5 ms holder for alle spill.'),
        heading('IPS, VA eller OLED?'),
        bulletList([
          [text('IPS', { bold: true }), text(' har gode farger og vide innsynsvinkler.')],
          [text('VA', { bold: true }), text(' har dypere svart og passer i mørke rom.')],
          [text('OLED', { bold: true }), text(' har perfekt svart og raskest respons, men koster mer.')],
        ]),
        block('productEmbed', { label: 'Populær i mellomklassen', product: productID('vektor-pulse-27') }),
      ),
  },
  {
    slug: 'bygg-et-oppsett-som-holder-hele-kvelden',
    title: 'Bygg et oppsett som holder hele kvelden',
    kicker: 'Oppsett',
    excerpt: 'Små grep for et gamingoppsett som er like behagelig etter fire timer som etter fire minutter.',
    heroImage: 'gaming-utstyr.jpg',
    department: 'gaming',
    author: 'martin-hagen',
    readingMinutes: 5,
    daysAgo: 17,
    relatedProducts: ['vektor-tactile-k75', 'klang-arena-h7', 'nova-pro-kontroller'],
    content: () =>
      richText(
        paragraph('Det beste oppsettet er det du ikke tenker på mens du spiller. Start med høyden på skjermen, og jobb deg nedover.'),
        heading('Skjermen i øyehøyde'),
        paragraph('Toppen av skjermen bør være omtrent i øyehøyde, en armlengde unna.'),
        heading('Lys som ikke blender'),
        paragraph('Litt lys bak skjermen reduserer kontrasten mellom skjerm og rom, og gjør øynene mindre slitne.'),
        block('tip', { title: 'Tips', text: 'En stor musematte gir plass til både tastatur og mus, og holder pulten ryddig.' }),
      ),
  },
  {
    slug: 'hvilken-pc-passer-til-din-hverdag',
    title: 'Hvilken PC passer til din hverdag?',
    kicker: 'PC & data',
    excerpt: 'Bærbar eller stasjonær, lett eller kraftig? Slik finner du en PC som passer hvordan du faktisk bruker den.',
    heroImage: 'laptop-pult.jpg',
    department: 'pc-og-data',
    author: 'ingrid-solheim',
    readingMinutes: 4,
    daysAgo: 21,
    relatedProducts: ['vektor-air-14'],
    content: (productID) =>
      richText(
        paragraph('De fleste trenger mindre kraft enn de tror, men mer batteri og en god skjerm.'),
        heading('Til skole og jobb'),
        paragraph('Se etter en lett maskin med minst 16 GB minne og et batteri som holder en hel arbeidsdag.'),
        block('productEmbed', { label: 'Vår favoritt', product: productID('vektor-air-14') }),
      ),
  },
  {
    slug: 'stor-lyd-uten-et-stort-oppsett',
    title: 'Stor lyd. Uten et stort oppsett.',
    kicker: 'TV & lyd',
    excerpt: 'Slik får du kinolyd i stua uten fem høyttalere og kabler langs veggene.',
    heroImage: 'tv-stue.jpg',
    department: 'tv-og-lyd',
    author: 'ingrid-solheim',
    readingMinutes: 3,
    daysAgo: 26,
    relatedProducts: ['luma-view-55', 'klang-mini'],
    content: () =>
      richText(
        paragraph('Innebygde TV-høyttalere er små. En lydplanke under TV-en er den enkleste oppgraderingen du kan gjøre.'),
        heading('Plassering'),
        paragraph('Plasser lydplanken rett under skjermen, og la ingenting stå foran den.'),
      ),
  },
  {
    slug: 'finn-vaskemaskinen-som-passer',
    title: 'Finn vaskemaskinen som passer',
    kicker: 'Hjem & vaskerom',
    excerpt: 'Kapasitet, energiklasse og støy: dette bør du se etter når vaskemaskinen skal byttes.',
    heroImage: 'vaskerom.jpg',
    department: 'hjem-og-kjokken',
    author: 'ingrid-solheim',
    readingMinutes: 4,
    daysAgo: 29,
    relatedProducts: [],
    content: () =>
      richText(
        paragraph('En vaskemaskin skal vare i mange år. Bruk fem minutter på å velge riktig størrelse.'),
        heading('Kapasitet'),
        bulletList(['1–2 personer: 7 kg', '3–4 personer: 8–9 kg', 'Store familier: 10 kg eller mer']),
      ),
  },
]
