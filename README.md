# Hylla

Hylla er en fiktiv norsk nettbutikk for elektronikk, laget som designprosjekt. Den er bygget med
**Next.js 16** og **Payload 3** med **Postgres**, og bruker Payloads ecommerce-plugin for produkter,
varianter og handlekurver. Det finnes ingen betalingsløsning, og all kundedata i demoen er oppdiktet.

## Kom i gang lokalt

Krever Node 22.23+ (eller 24.22+), pnpm og Docker.

```bash
cp .env.example .env          # fyll inn PAYLOAD_SECRET og SEED_ADMIN_PASSWORD
pnpm install
pnpm db:up                    # starter Postgres i Docker
pnpm seed                     # fyller databasen med produkter, guider og 40 fiktive ordrer
pnpm dev
```

Åpne <http://localhost:3000/admin> og logg inn med `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

I utvikling oppdaterer Payload databaseskjemaet automatisk. Når du endrer felter som skal i
produksjon, lag en migrering med `pnpm migrate:create <navn>`.

## Hva som ligger hvor

| Mappe | Innhold |
| --- | --- |
| `src/payload.config.ts` | Payload-oppsett: samlinger, ecommerce-plugin, norsk admin, Postgres og Vercel Blob |
| `src/collections/` | Kategorier, merker, vurderinger, guider, skribenter, media og brukere |
| `src/collections/products.ts` | Hyllas felter på toppen av pluginens produkter og varianter |
| `src/collections/orders/` | Ordre i WooCommerce-stil: felter, statuser og hooks for totaler, lager og ordrelogg |
| `src/components/admin/` | Admin-komponenter: statusfaner, statusmerker, handlingsknapper og radetiketter |
| `src/globals/StoreSettings.ts` | Fri frakt-grense og leveringsmåter |
| `src/seed/` | Demodata, bilder og `resetDemo()` som tilbakestiller butikken |
| `src/endpoints/demoReset.ts` | `GET /api/demo/reset`, kalles hver natt av Vercel Cron |

## Ordrer i admin

- **Liste:** statusfaner med antall (Alle, Mottatt, Behandles, Sendt …), søk på ordrenummer, navn, e-post eller sporingsnummer.
- **Handlinger i sidepanelet:** Start behandling, Marker som sendt (med sporingsnummer), Marker som levert, Sett på vent, Kanseller og Refunder. Hver handling lagrer ordren.
- **Redigering:** legg til, fjern eller endre varer. Navn, varenummer og pris hentes fra produktet, og totaler, frakt og mva. regnes ut på nytt ved lagring.
- **Lager:** en ordre holder av lager så lenge den ikke er kansellert eller refundert. Endrer du antall eller status, justeres lageret med differansen.
- **Ordrelogg:** statusendringer og lagerjusteringer logges automatisk. Egne notater kan være private eller merket som notat til kunde.

## Nattlig tilbakestilling

`vercel.json` kaller `/api/demo/reset` kl. 02:00 UTC hver natt med `Authorization: Bearer $CRON_SECRET`.
Endepunktet:

1. sletter alle ordrer, handlekurver og vurderinger
2. oppdaterer katalog, priser, lager, guider og innstillinger fra `src/seed/data/` (ID-er og bilder gjenbrukes)
3. fjerner produkter, kategorier og guider som ikke finnes i seed-filene
4. lager 40 nye fiktive ordrer spredt over de siste 30 dagene

En innlogget administrator kan også åpne `/api/demo/reset` direkte for å tilbakestille.

## Deploy til Vercel

1. Opprett en Postgres-database (f.eks. Neon) og sett `DATABASE_URL`.
2. Koble til Vercel Blob Storage, slik at `BLOB_READ_WRITE_TOKEN` settes.
3. Sett `PAYLOAD_SECRET`, `CRON_SECRET`, `SEED_ADMIN_EMAIL` og `SEED_ADMIN_PASSWORD`.
4. Sett byggkommandoen til `pnpm run ci`, som kjører migreringer før `next build`.
5. Kjør tilbakestillingen én gang for å fylle databasen: åpne `/api/demo/reset` med cron-hemmeligheten.
