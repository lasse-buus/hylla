const tips = [
  {
    kicker: 'Sokkel',
    title: 'Sjekk sokkelen først',
    text: 'E27 er den vanlige store skrusokkelen, E14 den smale i lysekroner og GU10 har to pinner og sitter i spotter.',
  },
  {
    kicker: 'Lysstyrke',
    title: 'Lumen, ikke watt',
    text: 'Rundt 800 lumen tilsvarer en gammel 60 W-pære. Til lesing og kjøkken passer 1 100 lumen eller mer.',
  },
  {
    kicker: 'Lysfarge',
    title: 'Hvit, Ambiance eller farger',
    text: 'White lyser varmhvitt. White Ambiance går fra varm til kald hvit. White and Color kan i tillegg vise farger.',
  },
]

export function BulbBuyingTips() {
  return (
    <section aria-labelledby="paeretips-tittel">
      <h2 id="paeretips-tittel" className="mb-5 text-[26px] font-extrabold tracking-[-0.8px]">
        Slik velger du riktig pære
      </h2>
      <ul className="grid gap-5 lg:grid-cols-3">
        {tips.map((tip) => (
          <li key={tip.kicker} className="flex flex-col gap-2.5 rounded-xl border border-line bg-card p-6">
            <span className="text-xs font-bold tracking-[1px] text-accent uppercase">{tip.kicker}</span>
            <h3 className="text-[17px] font-bold">{tip.title}</h3>
            <p className="text-sm leading-[1.6] text-muted">{tip.text}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
