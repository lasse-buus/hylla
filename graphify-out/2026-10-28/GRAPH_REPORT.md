# Graph Report - hylla  (2026-10-28)

## Corpus Check
- 200 files · ~197,567 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1072 nodes · 2719 edges · 55 communities (48 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 99 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

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
- kundeservice/page.tsx
- (shop)/page.tsx
- shopSession.ts
- next
- @fontsource-variable/inter@^5.3.0
- routes.ts
- importMap.js
- account.ts
- [orderNumber]/page.tsx
- AddressBook.tsx
- pnpm Build Approvals
- Prettier Config
- Guides.ts
- ESLint Config
- Vercel Cron
- Design Tokens Notes
- guide.ts
- links.ts
- CartProvider.tsx
- format.ts
- min-side.e2e.mjs
- AccountDraft.tsx
- PostCSS Config
- Housekeeping Notes
- sok/page.tsx
- importMap.js
- lib/catalog.ts
- min-side/page.tsx
- toImage
- PromoCardsBlock.tsx
- SiteHeader.tsx
- homeBlocks.ts
- lucide-react
- navigation.ts
- Min side (my account) – design
- progress.md
- unit.test.ts
- guider/[slug]/page.tsx
- next.config.ts
- carts.ts
- react-dom@19.2.6

## God Nodes (most connected - your core abstractions)
1. `next` - 68 edges
2. `lucide-react` - 53 edges
3. `payload` - 46 edges
4. `routes` - 40 edges
5. `formatPrice()` - 38 edges
6. `react` - 32 edges
7. `toImage()` - 25 edges
8. `Breadcrumbs()` - 21 edges
9. `ProductBrowser()` - 18 edges
10. `formatKroner()` - 18 edges

## Surprising Connections (you probably didn't know these)
- `Task 7: Min side shell and overview` --references--> `logOut()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/app/(frontend)/(shop)/logg-inn/actions.ts
- `Constraints and facts from the codebase` --references--> `placeOrder()`  [INFERRED]
  docs/superpowers/specs/2026-10-28-min-side-design.md → src/app/(frontend)/kassen/actions.ts
- `Global Constraints` --references--> `statusLabel()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/collections/orders/constants.ts
- `Task 8: Orders list and order detail` --references--> `DemoUnavailableButton()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/DemoUnavailableButton.tsx
- `Task 9: Addresses, profile and notifications (edits for this visit only)` --references--> `DemoUnavailableButton()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/DemoUnavailableButton.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Hylla core stack** — handoff_nextjs_16, handoff_payload_3_92, handoff_postgres, handoff_ecommerce_plugin, handoff_vercel_hosting [EXTRACTED 1.00]
- **Nightly demo reset flow** — handoff_vercel_hosting, readme_demo_reset_endpoint, handoff_reset_demo, handoff_orders_collection, handoff_no_personal_data_rule [INFERRED 0.85]
- **WooCommerce-style order management** — handoff_orders_collection, handoff_order_hooks, handoff_order_admin_ui, readme_order_admin [INFERRED 0.85]

## Communities (55 total, 7 thin omitted)

### Community 0 - "payload.config.ts"
Cohesion: 0.13
Nodes (29): payload, adminOnlyFieldAccess(), adminOrPublishedStatus(), anyone(), isAdmin(), isAuthenticated(), isCustomer(), isDocumentOwner() (+21 more)

### Community 1 - "Category Page & Filters"
Cohesion: 0.09
Nodes (44): ActiveFilters(), Chip, chipsFor(), priceLabel(), FilterContext, FilterContextValue, FilterProvider(), FilterResults() (+36 more)

### Community 2 - "SiteFooter.tsx"
Cohesion: 0.19
Nodes (12): ShopLayout(), NewsletterForm(), linkGroups, paymentMethods, SiteFooter(), socialLinks, BrandIconProps, FacebookIcon() (+4 more)

### Community 3 - "Seed Catalog Data"
Cohesion: 0.05
Nodes (57): Task 3: Seed Lasse and his order history, defaultDeliveryMethods, brands, categories, descriptionFor(), images, MenuLink, menuTree (+49 more)

### Community 4 - "Payload Generated Types"
Cohesion: 0.04
Nodes (48): Address, AddressesSelect, Auth, AuthorsSelect, BrandsSelect, CartsSelect, CategoriesSelect, CategoryGridBlockSelect (+40 more)

### Community 5 - "produkt/[slug]/page.tsx"
Cohesion: 0.05
Nodes (76): newDemoCustomer(), CartPage(), metadata, generateMetadata(), productJsonLd(), ProductPage(), sellableVariants(), AddToCartButton() (+68 more)

### Community 6 - "hooks.ts"
Cohesion: 0.10
Nodes (28): carrierOptions, deliveryMethodOptions, noteTypeOptions, paymentMethodOptions, paymentStatusOptions, releasedStockStatuses, VAT_RATE, actorName() (+20 more)

### Community 7 - "Project Docs & Handoff"
Cohesion: 0.08
Nodes (28): generate-agent-files.js (next dev), node_modules/next/dist/docs guides, CLAUDE.md includes AGENTS.md, Claude Design canvas (page and component reference), Data model (src/collections): products, variants, categories, brands, reviews, guides, authors, media, Payload ecommerce plugin (products, variants, carts; NOK 0 decimals), Figma file opZsA3Ael2wlE1S7sCdYPH (original homepage), formatPrice() (src/lib/format.ts) (+20 more)

### Community 8 - "TypeScript Config"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 9 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, cross-env@^7.0.3, dotenv@16.4.7, @faker-js/faker@10.1.0, graphql@^16.8.1, lucide-react@^1.61.0, next@16.3.3, payload@3.92.0 (+13 more)

### Community 10 - "Dev Dependencies"
Cohesion: 0.11
Nodes (23): description, devDependencies, eslint@^9.16.0, prettier@^3.4.2, tailwindcss@^4.3.3, @tailwindcss/postcss@^4.3.3, @types/node@22.19.9, @types/react@19.2.14 (+15 more)

### Community 11 - "NPM Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, ci, db:up, dev, devsafe, generate:importmap, generate:types (+8 more)

### Community 12 - "Local Postgres (Docker)"
Cohesion: 0.15
Nodes (12): POSTGRES_DB, POSTGRES_PASSWORD, POSTGRES_USER, environment, image, ports, restart, volumes (+4 more)

### Community 13 - "Database Migrations"
Cohesion: 0.10
Nodes (3): @payloadcms/db-postgres@3.92.0, @payloadcms/db-postgres, migrations

### Community 14 - "kundeservice/page.tsx"
Cohesion: 0.15
Nodes (17): contactChannels, CustomerServicePage(), metadata, sections, faqTopics, Collapse(), FaqAccordion(), Question() (+9 more)

### Community 15 - "(shop)/page.tsx"
Cohesion: 0.31
Nodes (7): HomePage(), metadata, revalidate, RenderBlocks(), getHomePage(), HomeBlock, HomePage

### Community 16 - "shopSession.ts"
Cohesion: 0.09
Nodes (35): Task 4: Shop session, login and logout, Task 6: Checkout as Lasse, DeliveryMethod, idOf(), PaymentMethod, placeOrder(), PlaceOrderInput, PlaceOrderResult (+27 more)

### Community 17 - "next"
Cohesion: 0.18
Nodes (18): next, CategoryPage(), heroStats(), logIn(), LoginForm(), LoginPage(), metadata, DealsPage() (+10 more)

### Community 18 - "@fontsource-variable/inter@^5.3.0"
Cohesion: 0.33
Nodes (4): @fontsource-variable/inter@^5.3.0, engines, node, @fontsource-variable/inter

### Community 19 - "routes.ts"
Cohesion: 0.21
Nodes (11): CheckoutLayout(), LogInState, logOut(), sections, CheckoutProgress(), CheckoutSteps(), stepLinks, steps (+3 more)

### Community 20 - "importMap.js"
Cohesion: 0.08
Nodes (15): @payloadcms/next@3.92.0, @payloadcms/next, importMap, Args, Args, GET, OPTIONS, POST (+7 more)

### Community 21 - "account.ts"
Cohesion: 0.15
Nodes (23): Task 5: Account order data, Task 7: Min side shell and overview, Task 8: Orders list and order detail, now(), AccountOrderDetail, AccountOrderSummary, asDoc(), getAccountOrder() (+15 more)

### Community 22 - "[orderNumber]/page.tsx"
Cohesion: 0.15
Nodes (14): Global Constraints, Min side Implementation Plan, Review Focus, Task 10: End-to-end test and handoff, Task 1: Signed cookie values and the test runner, Task 9: Addresses, profile and notifications (edits for this visit only), AccountOrderPage(), DemoUnavailableButton() (+6 more)

### Community 23 - "AddressBook.tsx"
Cohesion: 0.11
Nodes (24): react, LoginFormProps, AccountAddressesPage(), metadata, AccountProfilePage(), metadata, AddressBook(), AddressFields (+16 more)

### Community 24 - "pnpm Build Approvals"
Cohesion: 0.40
Nodes (4): allowBuilds, esbuild, sharp, unrs-resolver

### Community 25 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 26 - "Guides.ts"
Cohesion: 0.17
Nodes (14): @payloadcms/plugin-ecommerce, ChecklistBlock, ComparisonTableBlock, guideBlocks, ProductEmbedBlock, TipBlock, Guides, badgeOptions (+6 more)

### Community 27 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.3, eslint-config-next

### Community 30 - "guide.ts"
Cohesion: 0.12
Nodes (26): generateMetadata(), Checklist(), ComparisonTable(), GuideContent(), GuideContentProps, idOf(), ProductEmbed(), Tip() (+18 more)

### Community 31 - "links.ts"
Cohesion: 0.22
Nodes (16): CtaBannerBlock(), GuideListBlock(), ProductGrid(), ProductListBlock(), ProductTabs(), ProductTabsBlock(), Block(), BlockProps (+8 more)

### Community 32 - "CartProvider.tsx"
Cohesion: 0.21
Nodes (8): inter, metadata, RootLayout(), api, CartProvider(), currenciesConfig, cartsFetchQuery, NOK

### Community 33 - "format.ts"
Cohesion: 0.35
Nodes (8): AccountOrdersPage(), metadata, OrderRow(), OrderStatusBadge(), matchesFilter(), orderFilters, parseOrderFilter(), formatShortDate()

### Community 34 - "min-side.e2e.mjs"
Cohesion: 0.14
Nodes (4): BASE, byText(), launch(), logIn()

### Community 35 - "AccountDraft.tsx"
Cohesion: 0.19
Nodes (15): Task 2: Data model (user profile fields, locked-down users, order origin), AccountLayout(), AccountBreadcrumbs(), AccountDraftProvider(), clearAccountDraft(), Context, DraftContext, listeners (+7 more)

### Community 38 - "sok/page.tsx"
Cohesion: 0.26
Nodes (11): GET(), SearchSuggestions, count(), generateMetadata(), SearchPage(), GuideCard(), ProductSummary, anyFieldLike() (+3 more)

### Community 39 - "importMap.js"
Cohesion: 0.11
Nodes (19): @payloadcms/ui@3.92.0, @payloadcms/richtext-lexical, @payloadcms/ui, orderStatuses, orderStatusTones, OrderStatusValue, statusLabel(), fakeTrackingNumber() (+11 more)

### Community 40 - "lib/catalog.ts"
Cohesion: 0.19
Nodes (19): generateMetadata(), CategoryGridBlock(), categoryIcons, asDoc(), badgeLabels, brandsOf(), CategoryPageData, DealsPageData (+11 more)

### Community 41 - "min-side/page.tsx"
Cohesion: 0.18
Nodes (15): AccountOverviewPage(), metadata, AccountNotificationsPage(), metadata, AccountDraft, useAccountDraft(), marketing, NotificationSettings() (+7 more)

### Community 42 - "toImage"
Cohesion: 0.19
Nodes (12): asDoc(), metadata, OrderConfirmationPage(), HeroBlock(), HeroBlockProps, ImageSize, toImage(), placedOrderID() (+4 more)

### Community 43 - "PromoCardsBlock.tsx"
Cohesion: 0.40
Nodes (5): Card, PromoCard(), PromoCardsBlock(), tones, PromoCardsBlock

### Community 44 - "SiteHeader.tsx"
Cohesion: 0.24
Nodes (10): DepartmentNav(), MegaMenuPanel(), MegaMenuPanelProps, HeaderActions(), Option, SearchForm(), searchHref(), ServiceBar() (+2 more)

### Community 45 - "homeBlocks.ts"
Cohesion: 0.14
Nodes (11): CategoryGridBlock, CtaBannerBlock, GuideListBlock, HeroBlock, homeBlocks, ProductListBlock, ProductTabsBlock, PromoCardsBlock (+3 more)

### Community 46 - "lucide-react"
Cohesion: 0.30
Nodes (8): lucide-react, archiveHref(), first(), GuideArchivePage(), metadata, GuideFeatureCard(), GuideSummary, getGuideArchive()

### Community 47 - "navigation.ts"
Cohesion: 0.24
Nodes (9): asDoc(), groupLinks(), loadNavigation(), NavDepartment, Navigation, NavImage, NavLink, Category (+1 more)

### Community 48 - "Min side (my account) – design"
Cohesion: 0.22
Nodes (8): Anti-goals (failure even if it "works"), Constraints and facts from the codebase, Decisions made (the author's calls, open to override), Goals, Intent, Left to the builder, Min side (my account) – design, Non-goals

### Community 51 - "guider/[slug]/page.tsx"
Cohesion: 0.52
Nodes (5): AuthorAvatar(), GuidePage(), initials(), GuideToc(), noSubscription()

### Community 52 - "next.config.ts"
Cohesion: 0.33
Nodes (3): dirname, __filename, nextConfig

### Community 53 - "carts.ts"
Cohesion: 0.53
Nodes (5): CartItem, cartsCollectionOverride(), idOf(), keepCartWithinStock(), purchasableQuantity()

## Knowledge Gaps
- **13 isolated node(s):** `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)`, `generate-agent-files.js (next dev)`, `formatPrice() (src/lib/format.ts)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 349 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `payload` connect `payload.config.ts` to `Seed Catalog Data`, `produkt/[slug]/page.tsx`, `hooks.ts`, `Runtime Dependencies`, `Dev Dependencies`, `kundeservice/page.tsx`, `(shop)/page.tsx`, `shopSession.ts`, `importMap.js`, `account.ts`, `Guides.ts`, `guide.ts`, `sok/page.tsx`, `importMap.js`, `lib/catalog.ts`, `toImage`, `homeBlocks.ts`, `navigation.ts`, `carts.ts`?**
  _High betweenness centrality (0.150) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `formatPrice()` (e.g. with `Global Constraints` and `Constraints and facts from the codebase`) actually correct?**
  _`formatPrice()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `payload.config.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13008130081300814 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `payload.config.ts`, `Category Page & Filters`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `hooks.ts`, `Runtime Dependencies`, `Dev Dependencies`, `kundeservice/page.tsx`, `(shop)/page.tsx`, `shopSession.ts`, `routes.ts`, `importMap.js`, `[orderNumber]/page.tsx`, `AddressBook.tsx`, `Guides.ts`, `guide.ts`, `links.ts`, `CartProvider.tsx`, `format.ts`, `sok/page.tsx`, `importMap.js`, `lib/catalog.ts`, `min-side/page.tsx`, `toImage`, `PromoCardsBlock.tsx`, `SiteHeader.tsx`, `lucide-react`, `navigation.ts`, `guider/[slug]/page.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Should `Category Page & Filters` be split into smaller, more focused modules?**
  _Cohesion score 0.09387755102040816 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Category Page & Filters`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `Runtime Dependencies`, `Dev Dependencies`, `kundeservice/page.tsx`, `next`, `routes.ts`, `[orderNumber]/page.tsx`, `AddressBook.tsx`, `guide.ts`, `links.ts`, `format.ts`, `AccountDraft.tsx`, `sok/page.tsx`, `lib/catalog.ts`, `min-side/page.tsx`, `toImage`, `PromoCardsBlock.tsx`, `SiteHeader.tsx`, `guider/[slug]/page.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._