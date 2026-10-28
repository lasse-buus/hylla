# Graph Report - hylla  (2026-10-28)

## Corpus Check
- 203 files · ~217,268 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: .example 1, (none) 1, .css 1)

## Summary
- 1079 nodes · 2738 edges · 58 communities (51 shown, 7 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 100 edges (avg confidence: 0.89)
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
- RenderBlocks.tsx
- shopSession.ts
- lib/catalog.ts
- @fontsource-variable/inter@^5.3.0
- routes.ts
- (payload)/layout.tsx
- account.ts
- CheckoutView.tsx
- shopSession.ts
- pnpm Build Approvals
- Prettier Config
- Categories.ts
- ESLint Config
- Vercel Cron
- Design Tokens Notes
- guide.ts
- links.ts
- CartProvider.tsx
- GuideContent.tsx
- min-side.e2e.mjs
- payload
- PostCSS Config
- Housekeeping Notes
- sok/page.tsx
- importMap.js
- constants.ts
- CartView.tsx
- toImage
- Guides.ts
- navigation.ts
- homeBlocks.ts
- lucide-react
- statusLabel
- SearchForm.tsx
- progress.md
- unit.test.ts
- [...slug]/route.ts
- @payloadcms/next
- carts.ts
- react-dom@19.2.6
- bekreftelse/page.tsx
- Faqs.ts
- StoreSettings.ts

## God Nodes (most connected - your core abstractions)
1. `next` - 68 edges
2. `lucide-react` - 53 edges
3. `payload` - 47 edges
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
- `Global Constraints` --references--> `statusLabel()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/collections/orders/constants.ts
- `Task 2: Data model (user profile fields, locked-down users, order origin)` --references--> `read()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/AccountDraft.tsx
- `Task 9: Addresses, profile and notifications (edits for this visit only)` --references--> `DemoUnavailableButton()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/DemoUnavailableButton.tsx
- `Task 6: Checkout as Lasse` --references--> `CheckoutView()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/cart/CheckoutView.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Hylla core stack** — handoff_nextjs_16, handoff_payload_3_92, handoff_postgres, handoff_ecommerce_plugin, handoff_vercel_hosting [EXTRACTED 1.00]
- **Nightly demo reset flow** — handoff_vercel_hosting, readme_demo_reset_endpoint, handoff_reset_demo, handoff_orders_collection, handoff_no_personal_data_rule [INFERRED 0.85]
- **WooCommerce-style order management** — handoff_orders_collection, handoff_order_hooks, handoff_order_admin_ui, readme_order_admin [INFERRED 0.85]

## Communities (58 total, 7 thin omitted)

### Community 0 - "payload.config.ts"
Cohesion: 0.20
Nodes (16): adminOnlyFieldAccess(), adminOrPublishedStatus(), anyone(), isAdmin(), isAuthenticated(), isCustomer(), isDocumentOwner(), userIsAdmin() (+8 more)

### Community 1 - "Category Page & Filters"
Cohesion: 0.09
Nodes (44): ActiveFilters(), Chip, chipsFor(), priceLabel(), FilterContext, FilterContextValue, FilterProvider(), FilterResults() (+36 more)

### Community 2 - "SiteFooter.tsx"
Cohesion: 0.23
Nodes (9): NewsletterForm(), linkGroups, paymentMethods, socialLinks, BrandIconProps, FacebookIcon(), featureIcons, InstagramIcon() (+1 more)

### Community 3 - "Seed Catalog Data"
Cohesion: 0.05
Nodes (56): Task 3: Seed Lasse and his order history, brands, categories, descriptionFor(), images, MenuLink, menuTree, products (+48 more)

### Community 4 - "Payload Generated Types"
Cohesion: 0.05
Nodes (44): Address, AddressesSelect, Auth, AuthorsSelect, BrandsSelect, CartsSelect, CategoriesSelect, CategoryGridBlockSelect (+36 more)

### Community 5 - "produkt/[slug]/page.tsx"
Cohesion: 0.08
Nodes (45): react, generateMetadata(), productJsonLd(), ProductPage(), sellableVariants(), AddToCartButton(), AddToCartButtonProps, CartItemInput (+37 more)

### Community 6 - "hooks.ts"
Cohesion: 0.18
Nodes (17): releasedStockStatuses, VAT_RATE, actorName(), applyStockChanges(), findDeliveryMethod(), formatKroner(), orderBeforeChange(), OrderData (+9 more)

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
Cohesion: 0.09
Nodes (3): @payloadcms/db-postgres@3.92.0, @payloadcms/db-postgres, migrations

### Community 14 - "kundeservice/page.tsx"
Cohesion: 0.21
Nodes (13): contactChannels, CustomerServicePage(), metadata, sections, Collapse(), FaqAccordion(), Question(), QuestionProps (+5 more)

### Community 15 - "RenderBlocks.tsx"
Cohesion: 0.15
Nodes (17): HomePage(), metadata, revalidate, CategoryGridBlock(), PromoCardsBlock(), Block(), BlockProps, RenderBlocks() (+9 more)

### Community 16 - "shopSession.ts"
Cohesion: 0.10
Nodes (29): Task 6: Checkout as Lasse, Anti-goals (failure even if it "works"), Constraints and facts from the codebase, Decisions made (the author's calls, open to override), Goals, Intent, Left to the builder, Min side (my account) – design (+21 more)

### Community 17 - "lib/catalog.ts"
Cohesion: 0.16
Nodes (24): CategoryPage(), generateMetadata(), heroStats(), DealsPage(), metadata, CategoryHero(), CategoryHeroProps, productCountLabel() (+16 more)

### Community 18 - "@fontsource-variable/inter@^5.3.0"
Cohesion: 0.33
Nodes (4): @fontsource-variable/inter@^5.3.0, engines, node, @fontsource-variable/inter

### Community 19 - "routes.ts"
Cohesion: 0.24
Nodes (10): next, CheckoutLayout(), LogInState, metadata, CheckoutProgress(), stepLinks, steps, Logo() (+2 more)

### Community 20 - "(payload)/layout.tsx"
Cohesion: 0.14
Nodes (4): importMap, Args, Args, Args

### Community 21 - "account.ts"
Cohesion: 0.07
Nodes (61): Global Constraints, Min side Implementation Plan, Review Focus, Task 10: End-to-end test and handoff, Task 1: Signed cookie values and the test runner, Task 2: Data model (user profile fields, locked-down users, order origin), Task 5: Account order data, Task 7: Min side shell and overview (+53 more)

### Community 22 - "CheckoutView.tsx"
Cohesion: 0.19
Nodes (17): newDemoCustomer(), CheckoutCustomer, CheckoutView(), CheckoutViewProps, formatPhone(), paymentMethods, SectionHeading(), EmptyCart() (+9 more)

### Community 23 - "shopSession.ts"
Cohesion: 0.05
Nodes (57): Task 4: Shop session, login and logout, logIn(), logOut(), LoginForm(), LoginFormProps, AccountAddressesPage(), metadata, AccountLayout() (+49 more)

### Community 24 - "pnpm Build Approvals"
Cohesion: 0.40
Nodes (4): allowBuilds, esbuild, sharp, unrs-resolver

### Community 25 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 26 - "Categories.ts"
Cohesion: 0.21
Nodes (12): Authors, Brands, Categories, badgeOptions, iconOptions, productsCollectionOverride(), variantsCollectionOverride(), slugField() (+4 more)

### Community 27 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.3, eslint-config-next

### Community 30 - "guide.ts"
Cohesion: 0.17
Nodes (20): AuthorAvatar(), generateMetadata(), GuidePage(), initials(), GuideToc(), noSubscription(), toGuideSummary(), ARCHIVE_PAGE_SIZE (+12 more)

### Community 31 - "links.ts"
Cohesion: 0.19
Nodes (14): GuideListBlock(), ProductGrid(), ProductListBlock(), ProductTabs(), ProductTabsBlock(), SectionHeader(), SectionHeaderProps, getGuideSummaries() (+6 more)

### Community 32 - "CartProvider.tsx"
Cohesion: 0.19
Nodes (9): @payloadcms/plugin-ecommerce, inter, metadata, RootLayout(), api, CartProvider(), currenciesConfig, cartsFetchQuery (+1 more)

### Community 33 - "GuideContent.tsx"
Cohesion: 0.18
Nodes (16): Checklist(), ComparisonTable(), GuideContent(), GuideContentProps, idOf(), ProductEmbed(), Tip(), RichText() (+8 more)

### Community 34 - "min-side.e2e.mjs"
Cohesion: 0.14
Nodes (4): BASE, byText(), launch(), logIn()

### Community 35 - "payload"
Cohesion: 0.33
Nodes (6): payload, Users, DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD, adminAccess, fieldNames

### Community 38 - "sok/page.tsx"
Cohesion: 0.33
Nodes (9): count(), generateMetadata(), SearchPage(), getPopularProducts, ProductSummary, anyFieldLike(), normalizeQuery(), SearchResults (+1 more)

### Community 39 - "importMap.js"
Cohesion: 0.17
Nodes (11): @payloadcms/ui@3.92.0, @payloadcms/ui, ItemRow, kroner, OrderItemRowLabel(), dateFormat, NoteRow, OrderNoteRowLabel() (+3 more)

### Community 40 - "constants.ts"
Cohesion: 0.26
Nodes (9): carrierOptions, deliveryMethodOptions, noteTypeOptions, orderStatuses, paymentMethodOptions, paymentStatusOptions, addressFields, fields (+1 more)

### Community 41 - "CartView.tsx"
Cohesion: 0.33
Nodes (9): CartPage(), metadata, CartLineItem(), CartLineItemProps, CartView(), FreeShippingProgress(), itemLabel(), CheckoutSteps() (+1 more)

### Community 42 - "toImage"
Cohesion: 0.20
Nodes (13): CtaBannerBlock(), HeroBlock(), HeroBlockProps, Card, PromoCard(), tones, resolveLink(), ImageSize (+5 more)

### Community 43 - "Guides.ts"
Cohesion: 0.25
Nodes (7): @payloadcms/richtext-lexical, ChecklistBlock, ComparisonTableBlock, guideBlocks, ProductEmbedBlock, TipBlock, Guides

### Community 44 - "navigation.ts"
Cohesion: 0.14
Nodes (19): ShopLayout(), SiteFooter(), DepartmentNav(), MegaMenuPanel(), MegaMenuPanelProps, HeaderActions(), ServiceBar(), SiteHeader() (+11 more)

### Community 45 - "homeBlocks.ts"
Cohesion: 0.13
Nodes (12): CategoryGridBlock, CtaBannerBlock, GuideListBlock, HeroBlock, homeBlocks, ProductListBlock, ProductTabsBlock, PromoCardsBlock (+4 more)

### Community 46 - "lucide-react"
Cohesion: 0.22
Nodes (12): lucide-react, archiveHref(), first(), GuideArchivePage(), metadata, LoginPage(), metadata, titles (+4 more)

### Community 47 - "statusLabel"
Cohesion: 0.36
Nodes (6): orderStatusTones, OrderStatusValue, statusLabel(), fakeTrackingNumber(), OrderActions(), OrderStatusCell()

### Community 48 - "SearchForm.tsx"
Cohesion: 0.38
Nodes (5): GET(), SearchSuggestions, Option, SearchForm(), searchHref()

### Community 51 - "[...slug]/route.ts"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

### Community 52 - "@payloadcms/next"
Cohesion: 0.15
Nodes (8): dirname, __filename, nextConfig, @payloadcms/next@3.92.0, @payloadcms/next, GET, OPTIONS, POST

### Community 53 - "carts.ts"
Cohesion: 0.43
Nodes (7): CartItem, cartsCollectionOverride(), idOf(), keepCartOwner(), keepCartWithinStock(), purchasableQuantity(), MAX_PER_LINE

### Community 55 - "bekreftelse/page.tsx"
Cohesion: 0.47
Nodes (5): asDoc(), metadata, OrderConfirmationPage(), placedOrderID(), Product

### Community 56 - "Faqs.ts"
Cohesion: 0.47
Nodes (5): Faqs, faqTopics, revalidate(), revalidateAfterChange(), revalidateAfterDelete()

### Community 57 - "StoreSettings.ts"
Cohesion: 0.40
Nodes (4): defaultDeliveryMethods, DeliveryMethodSetting, StoreSettings, NAVIGATION_TAG

## Knowledge Gaps
- **13 isolated node(s):** `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)`, `generate-agent-files.js (next dev)`, `formatPrice() (src/lib/format.ts)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 353 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `payload` connect `payload` to `payload.config.ts`, `Seed Catalog Data`, `produkt/[slug]/page.tsx`, `hooks.ts`, `Runtime Dependencies`, `Dev Dependencies`, `kundeservice/page.tsx`, `RenderBlocks.tsx`, `shopSession.ts`, `lib/catalog.ts`, `(payload)/layout.tsx`, `account.ts`, `shopSession.ts`, `Categories.ts`, `guide.ts`, `sok/page.tsx`, `importMap.js`, `constants.ts`, `Guides.ts`, `navigation.ts`, `homeBlocks.ts`, `statusLabel`, `carts.ts`, `bekreftelse/page.tsx`, `Faqs.ts`, `StoreSettings.ts`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `formatPrice()` (e.g. with `Global Constraints` and `Constraints and facts from the codebase`) actually correct?**
  _`formatPrice()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Category Page & Filters` be split into smaller, more focused modules?**
  _Cohesion score 0.09254901960784313 - nodes in this community are weakly interconnected._
- **Why does `next` connect `routes.ts` to `Category Page & Filters`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `Runtime Dependencies`, `Dev Dependencies`, `kundeservice/page.tsx`, `RenderBlocks.tsx`, `shopSession.ts`, `lib/catalog.ts`, `(payload)/layout.tsx`, `account.ts`, `CheckoutView.tsx`, `shopSession.ts`, `Categories.ts`, `guide.ts`, `links.ts`, `CartProvider.tsx`, `GuideContent.tsx`, `sok/page.tsx`, `importMap.js`, `CartView.tsx`, `toImage`, `navigation.ts`, `homeBlocks.ts`, `lucide-react`, `SearchForm.tsx`, `@payloadcms/next`, `bekreftelse/page.tsx`, `Faqs.ts`, `StoreSettings.ts`?**
  _High betweenness centrality (0.142) - this node is a cross-community bridge._
- **Should `Seed Catalog Data` be split into smaller, more focused modules?**
  _Cohesion score 0.05472636815920398 - nodes in this community are weakly interconnected._
- **Why does `react` connect `produkt/[slug]/page.tsx` to `CartProvider.tsx`, `Category Page & Filters`, `SiteFooter.tsx`, `Runtime Dependencies`, `Dev Dependencies`, `navigation.ts`, `lucide-react`, `statusLabel`, `kundeservice/page.tsx`, `SearchForm.tsx`, `lib/catalog.ts`, `routes.ts`, `(payload)/layout.tsx`, `account.ts`, `CheckoutView.tsx`, `shopSession.ts`, `guide.ts`, `links.ts`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._