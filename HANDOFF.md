# Hylla – handoff

Context for picking this project up in a new session. Status as of 28 October 2026.

## What this is

**Hylla** is a fictional Norwegian electronics webshop, built as a design and portfolio project.
It was called "Strøm" until it was renamed, and the Figma file still uses the old name.
All UI copy is Norwegian (bokmål).

- **Figma:** file `opZsA3Ael2wlE1S7sCdYPH`, node `5:4405`, is the original homepage.
- **Claude Design canvas:** https://claude.ai/artifact/VbdTqtVuhwxzNBjDpTHsWN
  - It is the design reference for every page: forside, kategori (Gaming), produkt (Vektor Core G5), guide, handlekurv, kassen and min side.
  - It also holds shared components: header, mega menu, footer, product card and guide card.

**Ground rules**
- No real payments. All payment data is fictional.
- **Store no personal data.** Checkout uses generated demo customers, the newsletter form stores nothing, and the nightly reset wipes orders.

## Stack and decisions

- **Next.js 16** (App Router) with **Payload 3.92.0** running inside the same app. The admin is at `/admin`, in Norwegian.
  - Payload is pinned to 3.92.0, not 3.92.1. The user's pnpm 12 refuses packages published less than a day ago.
- **Postgres** through `@payloadcms/db-postgres`.
  - In development, Payload pushes the schema automatically.
  - Production uses the migrations in `src/migrations` (`pnpm migrate:create <name>`), and `pnpm run ci` runs them before the build.
- **Payload ecommerce plugin** handles products, variants and carts. Currency is NOK with 0 decimals, so prices are whole kroner.
  - Plugin transactions are kept but hidden from the admin, because the plugin's types depend on them.
  - Plugin addresses are turned off.
- **Frontend:** Tailwind v4 and `lucide-react`. Inter is self-hosted with `@fontsource-variable/inter` through `next/font/local`, with no Google Fonts.
- **Hosting target:** Vercel, with Neon Postgres, Vercel Blob for media, and Vercel Cron for the reset.
- **Package manager:** pnpm 12. Build-script approvals live in `pnpm-workspace.yaml` under `allowBuilds`.

## Data model (`src/collections`)

- **Catalog:**
  - `products`: the plugin's collection with Hylla fields added.
  - `variants`: the Core G5 has storage × memory variants.
  - `categories`: departments, plus subcategories with `menuGroup` and a `menuPromo` for the mega menu.
  - `brands` and `reviews`.
- **Content:** `guides` (Lexical editor with blocks for tip box, comparison table, product embed and checklist), `authors` and `media`.
- **Settings:** the `store-settings` global holds the free-shipping limit and the delivery methods.

## Order admin, WooCommerce style (`src/collections/orders`)

- **Order fields:** order number from 10001, statuses (Mottatt, Behandles, På vent, Sendt, Levert, Kansellert, Refundert), customer, addresses, shipping (method, carrier, tracking), payment (fictional reference), lines, services, discount, totals and an order log.
- **`hooks.ts` on every save:**
  - copies product data onto new lines
  - recalculates totals, shipping and VAT
  - logs status changes as notes
  - keeps stock in sync: cancelled and refunded orders release their stock
  - marks reserved payments as paid when the order ships
- **Admin UI (`src/components/admin`):**
  - status tabs above the list, with counts
  - coloured status labels in the list
  - sidebar buttons: Start behandling, Marker som sendt, Marker som levert, Sett på vent, Kanseller and Refunder

## Demo reset

- **What it does:** `src/seed/resetDemo.ts`
  1. Deletes orders, carts and reviews.
  2. Updates catalog, guides and settings from `src/seed/data/*` in place (by slug or SKU), and removes anything not in the seed.
  3. Creates about 40 fictional orders over the last 30 days, with Norwegian demo customers from faker.
- **How to run it:**
  - `pnpm seed` locally.
  - `GET /api/demo/reset` with `Authorization: Bearer $CRON_SECRET`, or opened by a logged-in admin.
  - `vercel.json` schedules it nightly at 02:00 UTC.
- **Seed images:** `src/seed/images`.

## Frontend so far

- **Header and footer:** `src/components/site`.
  - The header data comes from `src/lib/navigation.ts`. It is cached with `unstable_cache` under the tag `navigation`, and `src/hooks/revalidateNavigation.ts` clears it when content changes.
- **Design tokens:** in `src/app/(frontend)/globals.css`, for example `brand`, `brand-soft`, `ink`, `muted`, `line`, `surface` and `navy`, plus the `shop-container` utility (1360px wide with 24px gutters).
- **URLs:** built in `src/lib/routes.ts`: `/kategori/[slug]`, `/produkt/[slug]`, `/guider/[slug]`, `/handlekurv`, `/sok`.
- **Prices:** `formatPrice()` in `src/lib/format.ts` gives `12 990,–`.
- **Homepage:** built from Payload blocks (the `home-page` global).
- **Search:** the header field suggests products and guides while you type. The suggestions come from `GET /sok/forslag?q=` in `src/lib/search.ts`, which matches product name, specs, SKU, brand and category, and guide title, kicker and excerpt. Enter goes to the results page `/sok?q=`.
- **Min side** (`/min-side`, login at `/logg-inn`): visitors log in as the shared demo customer **Lasse Nielsen** (`lasse.nielsen@eksempel.no`, password in `src/lib/demoAccount.ts`, shown on the login page). There is no registration.
  - **Shop login:** separate from the admin. It uses a signed cookie, `hylla_kunde` (`src/lib/shopSession.ts`), and only `customer` users can use it, so an admin session never counts as a shop login. Customers can't update their own user record.
  - **Orders:** Min side shows Lasse's seeded orders (`placedVia: 'seed'`), plus checkout orders this browser placed. Those are remembered in the signed cookie `hylla_mine_ordrer` for 24 hours, and they survive logout.
  - **Edits** to profile, addresses and notifications live in `sessionStorage` (`hylla-min-side`) and are dropped on logout. Checkout as Lasse always uses his saved record.
  - **Seed:** Lasse and his 5 orders are created by `src/seed/demoAccount.ts`, with his ID kept stable across resets.

## Run locally

```bash
pnpm install
# Postgres: `pnpm db:up` (Docker) or Homebrew postgresql@17, then set DATABASE_URL in .env
pnpm seed
pnpm dev   # http://localhost:3000, admin at /admin
pnpm test  # unit + DB tests (tests/*.test.ts via `payload run`; needs a seeded DB)
node --env-file=.env tests/e2e/min-side.e2e.mjs   # browser test; needs `pnpm dev`, a fresh `pnpm seed` and Google Chrome
node tests/e2e/search.e2e.mjs                       # live search browser test
```

`.env` holds `DATABASE_URL`, `PAYLOAD_SECRET`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` and `CRON_SECRET`. See `.env.example`.

## Next steps

1. **Category page** `/kategori/[slug]`: hero, subcategory tiles, filters (category, price, brand, stock, rating) with the URL as the source of truth, the product grid and guides. Build a `ProductCard` component first; it is reused everywhere.
2. **Product page** `/produkt/[slug]`: gallery, variant picker, add-ons, specs, reviews, Q&A and related products.
3. **Guide page** `/guider/[slug]`: render Lexical content with the four custom blocks.
4. **Cart:** the plugin's guest carts, with the header count connected.
5. ~~Checkout~~ (done: `/kassen`, no payment; a demo Stripe account may come later).
6. ~~Homepage~~ (done).
7. ~~Min side~~ (done). Design and plan: `docs/superpowers/specs/2026-10-28-min-side-design.md`, `docs/superpowers/plans/2026-10-28-min-side.md`.

## Deploying (security checklist)

1. **Seed the production database right after the first migration, before the site is public.** On an empty database Payload's first-user signup (`/admin/create-first-user`) lets anyone create an admin. Once seeded, check that `POST /api/users/first-register` returns 403.
2. **Use fresh production secrets in Vercel:** `PAYLOAD_SECRET` and `CRON_SECRET` (`openssl rand -hex 32`), and a new `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD`. `CRON_SECRET` must be set, or the nightly reset gets 401.
3. **`SERVER_URL`** is optional on Vercel, where the production and preview URLs are picked up automatically. Set it for a custom domain. Login cookies are only accepted from these origins (`csrf`/`cors` in `payload.config.ts`).
4. **Hardening already in place:**
   - Customers can't update their user record.
   - The demo login can't be locked out.
   - Over the API, customers only see seeded orders.
   - A cart's owner is decided by the server.
   - Cookie signing refuses to run without `PAYLOAD_SECRET`.
   - These are covered by `tests/access.test.ts`, `tests/demoLogin.test.ts` and `tests/hardening.test.ts`.

## Housekeeping

- **Leftover files to delete:** `src/app/(frontend)/styles.css`, and the `.hylla-*.tar.gz` files in the root (transfer archives).
- **Git:** not initialised yet. Commits should use the GitHub noreply email.
