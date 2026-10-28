type Topic = 'bestilling' | 'levering' | 'retur' | 'reklamasjon' | 'betaling' | 'personvern'

/** A top-level question has a topic; a follow-up names its parent's question and inherits the topic. */
export type SeedFaq = { question: string; answer: string } & ({ topic: Topic; parent?: never } | { parent: string; topic?: never })

/** Customer service questions. The question text is the seed key, so editing it creates a new entry. */
export const faqs: SeedFaq[] = [
  {
    topic: 'bestilling',
    question: 'Kan jeg endre eller kansellere en bestilling?',
    answer: 'Ja, så lenge den ikke er sendt. Ta kontakt så raskt som mulig, så stopper vi den.',
  },
  {
    topic: 'bestilling',
    question: 'Hva betyr «førpris»?',
    answer: 'Førpris er den laveste prisen varen har hatt de siste 30 dagene før tilbudet startet.',
  },
  {
    topic: 'levering',
    question: 'Når får jeg varene?',
    answer:
      'Bestiller du innen kl. 16 på en hverdag, sender vi samme dag. Levering tar vanligvis 1–3 virkedager, avhengig av leveringsmåte.',
  },
  {
    parent: 'Når får jeg varene?',
    question: 'Kan jeg følge pakken underveis?',
    answer: 'Ja. Når pakken er sendt, får du en sporingslenke fra transportøren på SMS og e-post.',
  },
  {
    topic: 'levering',
    question: 'Kan jeg hente varene i butikk?',
    answer: 'Ja. Velg «Hent i butikk» i kassen, så får du beskjed når varene er klare, vanligvis innen to timer.',
  },
  {
    topic: 'retur',
    question: 'Hvordan returnerer jeg en vare?',
    answer:
      'Lever varen gratis i en av butikkene våre, eller send den i retur med returetiketten fra Min side. Du har 30 dagers åpent kjøp.',
  },
  {
    parent: 'Hvordan returnerer jeg en vare?',
    question: 'Må varen ligge i originalemballasjen?',
    answer: 'Helst, men det er ikke et krav. Varen bør være ubrukt og komplett med alt tilbehør.',
  },
  {
    parent: 'Hvordan returnerer jeg en vare?',
    question: 'Når får jeg pengene tilbake?',
    answer: 'Innen 14 dager etter at vi har mottatt returen. Pengene går tilbake til samme betalingsmåte som du brukte.',
  },
  {
    topic: 'reklamasjon',
    question: 'Varen min er ødelagt. Hva gjør jeg?',
    answer:
      'Ta kontakt med oss med bilde av feilen og ordrenummeret ditt. Vi hjelper deg med reparasjon, ny vare eller pengene tilbake.',
  },
  {
    topic: 'betaling',
    question: 'Blir kortet mitt belastet?',
    answer: 'Nei. Hylla er en demobutikk og tar ikke imot betaling. Kassen fullfører bestillingen uten at noe blir belastet.',
  },
  {
    topic: 'personvern',
    question: 'Lagrer dere opplysninger om meg?',
    answer:
      'Nei. Handlekurven ligger bare i nettleseren din, kassen bruker oppdiktede kunder, og alle bestillinger slettes hver natt.',
  },
]
