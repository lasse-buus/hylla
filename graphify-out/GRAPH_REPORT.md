# Graph Report - hylla  (2026-11-10)

## Corpus Check
- 220 files · ~263,635 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1167 nodes · 2943 edges · 47 communities (41 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b4169737`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- payload.config.ts
- Category Page & Filters
- SiteFooter.tsx
- Seed Catalog Data
- Payload Generated Types
- produkt/[slug]/page.tsx
- hooks.ts
- Project Docs & Handoff
- TypeScript Config
- Runtime Dependencies
- Dev Dependencies
- NPM Scripts
- Local Postgres (Docker)
- Database Migrations
- lucide-react
- RenderBlocks.tsx
- shopSession.ts
- lib/catalog.ts
- package.json
- routes.ts
- (payload)/layout.tsx
- account.ts
- Min side (my account) – design
- AddressBook.tsx
- pnpm Build Approvals
- Prettier Config
- lighting.ts
- ESLint Config
- Vercel Cron
- Design Tokens Notes
- guide.ts
- links.ts
- cart.ts
- CtaBannerBlock.tsx
- min-side.e2e.mjs
- @payloadcms/translations
- PostCSS Config
- Housekeeping Notes
- importMap.js
- constants.ts
- toImage
- navigation.ts
- AccountDraft.tsx
- statusLabel
- progress.md
- unit.test.ts
- [...slug]/route.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 69 edges
2. `lucide-react` - 55 edges
3. `payload` - 47 edges
4. `routes` - 40 edges
5. `formatPrice()` - 38 edges
6. `react` - 34 edges
7. `toImage()` - 27 edges
8. `Breadcrumbs()` - 21 edges
9. `ProductBrowser()` - 20 edges
10. `toProductSummary()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Task 7: Min side shell and overview` --references--> `logOut()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/app/(frontend)/(shop)/logg-inn/actions.ts
- `Constraints and facts from the codebase` --references--> `placeOrder()`  [INFERRED]
  docs/superpowers/specs/2026-10-28-min-side-design.md → src/app/(frontend)/kassen/actions.ts
- `Global Constraints` --references--> `statusLabel()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/collections/orders/constants.ts
- `Task 5: Account order data` --references--> `now()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/collections/orders/hooks.ts
- `Task 9: Addresses, profile and notifications (edits for this visit only)` --references--> `DemoUnavailableButton()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/DemoUnavailableButton.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Hylla core stack** — handoff_nextjs_16, handoff_payload_3_92, handoff_postgres, handoff_ecommerce_plugin, handoff_vercel_hosting [EXTRACTED 1.00]
- **Nightly demo reset flow** — handoff_vercel_hosting, readme_demo_reset_endpoint, handoff_reset_demo, handoff_orders_collection, handoff_no_personal_data_rule [INFERRED 0.85]
- **WooCommerce-style order management** — handoff_orders_collection, handoff_order_hooks, handoff_order_admin_ui, readme_order_admin [INFERRED 0.85]

## Communities (47 total, 6 thin omitted)

### Community 0 - "payload.config.ts"
Cohesion: 0.05
Nodes (65): dirname, __filename, nextConfig, payload, @payloadcms/richtext-lexical, adminOnlyFieldAccess(), adminOrPublishedStatus(), anyone() (+57 more)

### Community 1 - "Category Page & Filters"
Cohesion: 0.06
Nodes (63): CategoryPage(), generateMetadata(), heroStats(), DealsPage(), metadata, ActiveFilters(), Chip, chipsFor() (+55 more)

### Community 2 - "SiteFooter.tsx"
Cohesion: 0.12
Nodes (17): react, CategoryHeroProps, productCountLabel(), SubcategoryTiles(), ProductGalleryProps, NewsletterForm(), linkGroups, paymentMethods (+9 more)

### Community 3 - "Seed Catalog Data"
Cohesion: 0.05
Nodes (60): Task 3: Seed Lasse and his order history, Capability, brands, categories, descriptionFor(), HueProduct, hueProducts, images (+52 more)

### Community 4 - "Payload Generated Types"
Cohesion: 0.04
Nodes (45): Address, AddressesSelect, Auth, AuthorsSelect, BrandsSelect, CartsSelect, CategoriesSelect, CategoryGridBlockSelect (+37 more)

### Community 5 - "produkt/[slug]/page.tsx"
Cohesion: 0.06
Nodes (68): Global Constraints, Constraints and facts from the codebase, contactChannels, CustomerServicePage(), metadata, sections, generateMetadata(), productJsonLd() (+60 more)

### Community 6 - "hooks.ts"
Cohesion: 0.20
Nodes (16): actorName(), applyStockChanges(), findDeliveryMethod(), formatKroner(), now(), orderBeforeChange(), OrderData, OrderHookContext (+8 more)

### Community 7 - "Project Docs & Handoff"
Cohesion: 0.08
Nodes (28): generate-agent-files.js (next dev), node_modules/next/dist/docs guides, CLAUDE.md includes AGENTS.md, Claude Design canvas (page and component reference), Data model (src/collections): products, variants, categories, brands, reviews, guides, authors, media, Payload ecommerce plugin (products, variants, carts; NOK 0 decimals), Figma file opZsA3Ael2wlE1S7sCdYPH (original homepage), formatPrice() (src/lib/format.ts) (+20 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (20): dependencies, dotenv@16.4.7, @faker-js/faker@10.1.0, @fontsource-variable/inter@^5.3.0, graphql@^16.8.1, lucide-react@^1.61.0, next@16.3.3, payload@3.92.0 (+12 more)

### Community 10 - "Dev Dependencies"
Cohesion: 0.12
Nodes (17): devDependencies, eslint@^9.16.0, prettier@^3.4.2, tailwindcss@^4.3.3, @tailwindcss/postcss@^4.3.3, @types/node@22.19.9, @types/react@19.2.14, @types/react-dom@19.2.3 (+9 more)

### Community 11 - "NPM Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, ci, db:up, dev, devsafe, generate:importmap, generate:types (+8 more)

### Community 12 - "Local Postgres (Docker)"
Cohesion: 0.15
Nodes (12): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+4 more)

### Community 13 - "Database Migrations"
Cohesion: 0.07
Nodes (3): @payloadcms/db-postgres@3.92.0, @payloadcms/db-postgres, migrations

### Community 14 - "lucide-react"
Cohesion: 0.17
Nodes (16): lucide-react, AccountOverviewPage(), metadata, AccountNotificationsPage(), metadata, AccountDraft, useAccountDraft(), marketing (+8 more)

### Community 15 - "RenderBlocks.tsx"
Cohesion: 0.20
Nodes (11): HomePage(), metadata, revalidate, BlockProps, RenderBlocks(), icons, ServiceHighlightsBlock(), getHomePage() (+3 more)

### Community 16 - "shopSession.ts"
Cohesion: 0.08
Nodes (47): Task 4: Shop session, login and logout, Task 6: Checkout as Lasse, DeliveryMethod, idOf(), newDemoCustomer(), PaymentMethod, placeOrder(), PlaceOrderInput (+39 more)

### Community 17 - "lib/catalog.ts"
Cohesion: 0.22
Nodes (16): CartPage(), metadata, asDoc(), badgeLabels, brandsOf(), DealsPageData, getCategoryPage, getDealsPage (+8 more)

### Community 18 - "package.json"
Cohesion: 0.14
Nodes (13): cross-env@^7.0.3, @payloadcms/storage-vercel-blob@3.92.0, description, engines, node, license, name, packageManager (+5 more)

### Community 19 - "routes.ts"
Cohesion: 0.21
Nodes (13): next, CheckoutLayout(), LogInState, logOut(), sections, CartLineItemProps, CheckoutProgress(), CheckoutSteps() (+5 more)

### Community 20 - "(payload)/layout.tsx"
Cohesion: 0.11
Nodes (8): @payloadcms/next, importMap, Args, Args, GET, OPTIONS, POST, Args

### Community 21 - "account.ts"
Cohesion: 0.06
Nodes (56): Min side Implementation Plan, Review Focus, Task 10: End-to-end test and handoff, Task 1: Signed cookie values and the test runner, Task 2: Data model (user profile fields, locked-down users, order origin), Task 5: Account order data, Task 7: Min side shell and overview, Task 8: Orders list and order detail (+48 more)

### Community 22 - "Min side (my account) – design"
Cohesion: 0.25
Nodes (7): Anti-goals (failure even if it "works"), Decisions made (the author's calls, open to override), Goals, Intent, Left to the builder, Min side (my account) – design, Non-goals

### Community 23 - "AddressBook.tsx"
Cohesion: 0.11
Nodes (23): LoginFormProps, AccountAddressesPage(), metadata, AccountProfilePage(), metadata, AddressBook(), AddressFields, AddressForm() (+15 more)

### Community 24 - "pnpm Build Approvals"
Cohesion: 0.40
Nodes (4): allowBuilds, esbuild, sharp, unrs-resolver

### Community 25 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 26 - "lighting.ts"
Cohesion: 0.06
Nodes (46): Build plan, Data model changes, Lys og pærer (Philips Hue) – design handoff, Open questions, Product images, Products (seed), Scene colours (from the artboard), The Dag/Kveld switch (+38 more)

### Community 27 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.3, eslint-config-next

### Community 28 - "Vercel Cron"
Cohesion: 0.50
Nodes (3): buildCommand, crons, $schema

### Community 30 - "guide.ts"
Cohesion: 0.06
Nodes (53): archiveHref(), first(), GuideArchivePage(), metadata, AuthorAvatar(), generateMetadata(), GuidePage(), initials() (+45 more)

### Community 31 - "links.ts"
Cohesion: 0.19
Nodes (17): GuideListBlock(), ProductGrid(), ProductListBlock(), ProductTabs(), ProductTabsBlock(), SectionHeader(), SectionHeaderProps, getGuideSummaries() (+9 more)

### Community 32 - "cart.ts"
Cohesion: 0.11
Nodes (20): @payloadcms/plugin-ecommerce, inter, metadata, RootLayout(), VAT_RATE, api, CartProvider(), currenciesConfig (+12 more)

### Community 33 - "CtaBannerBlock.tsx"
Cohesion: 0.38
Nodes (5): CategoryGridBlock(), CtaBannerBlock(), getCategoryLinks(), CategoryGridBlock, CtaBannerBlock

### Community 34 - "min-side.e2e.mjs"
Cohesion: 0.12
Nodes (5): BASE, byText(), launch(), scene(), logIn()

### Community 39 - "importMap.js"
Cohesion: 0.17
Nodes (11): @payloadcms/ui@3.92.0, @payloadcms/ui, ItemRow, kroner, OrderItemRowLabel(), dateFormat, NoteRow, OrderNoteRowLabel() (+3 more)

### Community 40 - "constants.ts"
Cohesion: 0.23
Nodes (10): carrierOptions, deliveryMethodOptions, noteTypeOptions, orderStatuses, paymentMethodOptions, paymentStatusOptions, releasedStockStatuses, addressFields (+2 more)

### Community 42 - "toImage"
Cohesion: 0.23
Nodes (10): HeroBlock(), HeroBlockProps, Card, PromoCard(), PromoCardsBlock(), tones, Block(), getProductSummaries() (+2 more)

### Community 44 - "navigation.ts"
Cohesion: 0.14
Nodes (19): ShopLayout(), SiteFooter(), DepartmentNav(), MegaMenuPanel(), MegaMenuPanelProps, HeaderActions(), Option, SearchForm() (+11 more)

### Community 46 - "AccountDraft.tsx"
Cohesion: 0.18
Nodes (15): AccountLayout(), AccountBreadcrumbs(), titles, AccountDraftProvider(), clearAccountDraft(), Context, DraftContext, listeners (+7 more)

### Community 47 - "statusLabel"
Cohesion: 0.43
Nodes (5): OrderStatusValue, statusLabel(), fakeTrackingNumber(), OrderActions(), OrderStatusCell()

### Community 51 - "[...slug]/route.ts"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

## Knowledge Gaps
- **13 isolated node(s):** `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)`, `generate-agent-files.js (next dev)`, `formatPrice() (src/lib/format.ts)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 384 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `routes.ts` to `payload.config.ts`, `Category Page & Filters`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `Runtime Dependencies`, `lucide-react`, `RenderBlocks.tsx`, `shopSession.ts`, `lib/catalog.ts`, `package.json`, `(payload)/layout.tsx`, `account.ts`, `AddressBook.tsx`, `lighting.ts`, `guide.ts`, `links.ts`, `cart.ts`, `CtaBannerBlock.tsx`, `importMap.js`, `toImage`, `navigation.ts`, `AccountDraft.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `formatPrice()` (e.g. with `Global Constraints` and `Constraints and facts from the codebase`) actually correct?**
  _`formatPrice()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `payload.config.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.050187265917602995 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `payload.config.ts` to `Seed Catalog Data`, `produkt/[slug]/page.tsx`, `hooks.ts`, `importMap.js`, `constants.ts`, `Runtime Dependencies`, `navigation.ts`, `statusLabel`, `shopSession.ts`, `lib/catalog.ts`, `package.json`, `RenderBlocks.tsx`, `(payload)/layout.tsx`, `account.ts`, `lighting.ts`, `guide.ts`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Should `Category Page & Filters` be split into smaller, more focused modules?**
  _Cohesion score 0.06456140350877193 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Category Page & Filters`, `CtaBannerBlock.tsx`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `Runtime Dependencies`, `toImage`, `navigation.ts`, `AccountDraft.tsx`, `RenderBlocks.tsx`, `shopSession.ts`, `package.json`, `routes.ts`, `account.ts`, `AddressBook.tsx`, `lighting.ts`, `guide.ts`, `links.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._