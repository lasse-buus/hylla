# Graph Report - hylla  (2026-11-11)

## Corpus Check
- 222 files · ~283,851 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 5 file(s) not represented in the graph (top: .css 2, .example 1, (none) 1)

## Summary
- 1171 nodes · 2951 edges · 60 communities (54 shown, 6 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 110 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f373456c`
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
- CartView.tsx
- package.json
- next
- importMap.js
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
- CartProvider.tsx
- lucide-react
- min-side.e2e.mjs
- shopSession.ts
- PostCSS Config
- Housekeeping Notes
- kundeservice/page.tsx
- homeBlocks.ts
- constants.ts
- products.ts
- product.ts
- formatPrice
- navigation.ts
- ProductCard.tsx
- AccountDraft.tsx
- statusLabel
- [orderNumber]/page.tsx
- progress.md
- unit.test.ts
- carts.ts
- ref_node_assert
- Review Focus
- Guides.ts
- payload
- react
- Faqs.ts
- format.ts
- @payloadcms/storage-vercel-blob

## God Nodes (most connected - your core abstractions)
1. `next` - 70 edges
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
- `Task 9: Addresses, profile and notifications (edits for this visit only)` --references--> `DemoUnavailableButton()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/DemoUnavailableButton.tsx
- `Constraints and facts from the codebase` --references--> `placeOrder()`  [INFERRED]
  docs/superpowers/specs/2026-10-28-min-side-design.md → src/app/(frontend)/kassen/actions.ts
- `Global Constraints` --references--> `statusLabel()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/collections/orders/constants.ts
- `Task 8: Orders list and order detail` --references--> `DemoUnavailableButton()`  [INFERRED]
  docs/superpowers/plans/2026-10-28-min-side.md → src/components/account/DemoUnavailableButton.tsx
- `Build plan` --references--> `ProductBrowser()`  [INFERRED]
  docs/superpowers/specs/2026-11-10-lys-og-paerer-design.md → src/components/category/ProductBrowser.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Hylla core stack** — handoff_nextjs_16, handoff_payload_3_92, handoff_postgres, handoff_ecommerce_plugin, handoff_vercel_hosting [EXTRACTED 1.00]
- **Nightly demo reset flow** — handoff_vercel_hosting, readme_demo_reset_endpoint, handoff_reset_demo, handoff_orders_collection, handoff_no_personal_data_rule [INFERRED 0.85]
- **WooCommerce-style order management** — handoff_orders_collection, handoff_order_hooks, handoff_order_admin_ui, readme_order_admin [INFERRED 0.85]

## Communities (60 total, 6 thin omitted)

### Community 0 - "payload.config.ts"
Cohesion: 0.16
Nodes (19): adminOnlyFieldAccess(), adminOrPublishedStatus(), isAdmin(), isAuthenticated(), isCustomer(), isDocumentOwner(), userIsAdmin(), UserWithRoles (+11 more)

### Community 1 - "Category Page & Filters"
Cohesion: 0.06
Nodes (69): CategoryPage(), heroStats(), DealsPage(), metadata, ActiveFilters(), Chip, chipsFor(), FacetLabels (+61 more)

### Community 2 - "SiteFooter.tsx"
Cohesion: 0.19
Nodes (12): ShopLayout(), NewsletterForm(), linkGroups, paymentMethods, SiteFooter(), socialLinks, BrandIconProps, FacebookIcon() (+4 more)

### Community 3 - "Seed Catalog Data"
Cohesion: 0.05
Nodes (59): Task 3: Seed Lasse and his order history, brands, categories, descriptionFor(), HueProduct, hueProducts, images, MenuLink (+51 more)

### Community 4 - "Payload Generated Types"
Cohesion: 0.05
Nodes (44): Address, AddressesSelect, Auth, AuthorsSelect, BrandsSelect, CartsSelect, CategoriesSelect, CategoryGridBlockSelect (+36 more)

### Community 5 - "produkt/[slug]/page.tsx"
Cohesion: 0.21
Nodes (16): generateMetadata(), productJsonLd(), ProductPage(), sellableVariants(), ProductGallery(), ProductReviews(), ProductReviewsProps, formatRating() (+8 more)

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
Cohesion: 0.11
Nodes (19): dependencies, cross-env@^7.0.3, dotenv@16.4.7, @faker-js/faker@10.1.0, @fontsource-variable/inter@^5.3.0, graphql@^16.8.1, lucide-react@^1.61.0, next@16.3.3 (+11 more)

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
Cohesion: 0.14
Nodes (22): AccountOrdersPage(), metadata, AccountOverviewPage(), metadata, AccountNotificationsPage(), metadata, AccountDraft, useAccountDraft() (+14 more)

### Community 15 - "RenderBlocks.tsx"
Cohesion: 0.12
Nodes (24): HomePage(), metadata, revalidate, CategoryGridBlock(), CtaBannerBlock(), Card, PromoCard(), PromoCardsBlock() (+16 more)

### Community 16 - "shopSession.ts"
Cohesion: 0.09
Nodes (41): Task 6: Checkout as Lasse, DeliveryMethod, idOf(), newDemoCustomer(), PaymentMethod, placeOrder(), PlaceOrderInput, PlaceOrderResult (+33 more)

### Community 17 - "CartView.tsx"
Cohesion: 0.36
Nodes (8): CartPage(), metadata, CartLineItem(), CartLineItemProps, CartView(), FreeShippingProgress(), itemLabel(), formatKroner()

### Community 18 - "package.json"
Cohesion: 0.14
Nodes (13): react-dom@19.2.6, sharp@0.35.4, description, engines, node, license, name, packageManager (+5 more)

### Community 19 - "next"
Cohesion: 0.14
Nodes (21): next, CheckoutLayout(), titles, CheckoutProgress(), CheckoutSteps(), stepLinks, steps, DepartmentNav() (+13 more)

### Community 20 - "importMap.js"
Cohesion: 0.05
Nodes (28): dirname, __filename, nextConfig, @payloadcms/ui@3.92.0, @payloadcms/next, @payloadcms/ui, importMap, Args (+20 more)

### Community 21 - "account.ts"
Cohesion: 0.18
Nodes (19): Task 8: Orders list and order detail, asDoc(), getAccountOrder(), getAccountOrders(), itemsHeadline(), itemText(), labelOf(), OrderFilter (+11 more)

### Community 22 - "Min side (my account) – design"
Cohesion: 0.22
Nodes (8): Anti-goals (failure even if it "works"), Constraints and facts from the codebase, Decisions made (the author's calls, open to override), Goals, Intent, Left to the builder, Min side (my account) – design, Non-goals

### Community 23 - "AddressBook.tsx"
Cohesion: 0.13
Nodes (21): AccountAddressesPage(), metadata, AccountProfilePage(), metadata, AddressBook(), AddressFields, AddressForm(), AddressFormProps (+13 more)

### Community 24 - "pnpm Build Approvals"
Cohesion: 0.40
Nodes (4): allowBuilds, esbuild, sharp, unrs-resolver

### Community 25 - "Prettier Config"
Cohesion: 0.40
Nodes (4): printWidth, semi, singleQuote, trailingComma

### Community 26 - "lighting.ts"
Cohesion: 0.07
Nodes (42): Build plan, Data model changes, Lys og pærer (Philips Hue) – design handoff, Open questions, Product images, Products (seed), Scene colours (from the artboard), The Dag/Kveld switch (+34 more)

### Community 27 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint-config-next@16.3.3, eslint-config-next

### Community 28 - "Vercel Cron"
Cohesion: 0.50
Nodes (3): buildCommand, crons, $schema

### Community 30 - "guide.ts"
Cohesion: 0.11
Nodes (29): generateMetadata(), Checklist(), ComparisonTable(), GuideContent(), GuideContentProps, idOf(), ProductEmbed(), Tip() (+21 more)

### Community 31 - "links.ts"
Cohesion: 0.14
Nodes (26): generateMetadata(), GuideListBlock(), ProductGrid(), ProductListBlock(), ProductTabs(), ProductTabsBlock(), SectionHeader(), SectionHeaderProps (+18 more)

### Community 32 - "CartProvider.tsx"
Cohesion: 0.21
Nodes (8): inter, metadata, RootLayout(), api, CartProvider(), currenciesConfig, cartsFetchQuery, NOK

### Community 33 - "lucide-react"
Cohesion: 0.15
Nodes (21): lucide-react, archiveHref(), first(), GuideArchivePage(), metadata, AuthorAvatar(), GuidePage(), initials() (+13 more)

### Community 34 - "min-side.e2e.mjs"
Cohesion: 0.12
Nodes (5): BASE, byText(), launch(), scene(), logIn()

### Community 35 - "shopSession.ts"
Cohesion: 0.16
Nodes (20): Task 4: Shop session, login and logout, Task 7: Min side shell and overview, logIn(), LogInState, logOut(), LoginForm(), LoginFormProps, LoginPage() (+12 more)

### Community 38 - "kundeservice/page.tsx"
Cohesion: 0.19
Nodes (14): contactChannels, CustomerServicePage(), metadata, sections, faqTopics, Collapse(), FaqAccordion(), Question() (+6 more)

### Community 39 - "homeBlocks.ts"
Cohesion: 0.13
Nodes (12): CategoryGridBlock, CtaBannerBlock, GuideListBlock, HeroBlock, homeBlocks, ProductListBlock, ProductTabsBlock, PromoCardsBlock (+4 more)

### Community 40 - "constants.ts"
Cohesion: 0.16
Nodes (14): carrierOptions, deliveryMethodOptions, noteTypeOptions, orderStatuses, paymentMethodOptions, paymentStatusOptions, addressFields, fields (+6 more)

### Community 41 - "products.ts"
Cohesion: 0.19
Nodes (13): Categories, badgeOptions, iconOptions, productsCollectionOverride(), variantsCollectionOverride(), NAVIGATION_TAG, revalidate(), revalidateNavigationAfterChange() (+5 more)

### Community 42 - "product.ts"
Cohesion: 0.13
Nodes (22): HeroBlock(), HeroBlockProps, ProductGalleryProps, Crumb, CartLine, ImageData, ImageSize, relativeFileURL() (+14 more)

### Community 43 - "formatPrice"
Cohesion: 0.23
Nodes (11): Global Constraints, Min side Implementation Plan, BuyBox(), BuyBoxProps, priceDifference(), formatPrice(), findVariant(), initialVariant() (+3 more)

### Community 44 - "navigation.ts"
Cohesion: 0.23
Nodes (10): LinkValue, asDoc(), groupLinks(), loadNavigation(), Navigation, NavImage, NavLink, Category (+2 more)

### Community 45 - "ProductCard.tsx"
Cohesion: 0.27
Nodes (9): AddToCartButton(), AddToCartButtonProps, CartItemInput, nextFrame(), useAddToCart(), ProductCard(), ProductCardProps, stockText() (+1 more)

### Community 46 - "AccountDraft.tsx"
Cohesion: 0.22
Nodes (14): AccountLayout(), AccountBreadcrumbs(), AccountDraftProvider(), clearAccountDraft(), Context, DraftContext, listeners, read() (+6 more)

### Community 47 - "statusLabel"
Cohesion: 0.47
Nodes (4): orderStatusTones, OrderStatusValue, statusLabel(), OrderStatusCell()

### Community 48 - "[orderNumber]/page.tsx"
Cohesion: 0.29
Nodes (7): AccountOrderPage(), DemoUnavailableButton(), OrderProgress(), stateText, getMyAccountOrder(), ProgressStep, formatDateTime()

### Community 51 - "carts.ts"
Cohesion: 0.31
Nodes (9): @payloadcms/plugin-ecommerce@3.92.0, @payloadcms/plugin-ecommerce, CartItem, cartsCollectionOverride(), idOf(), keepCartOwner(), keepCartWithinStock(), purchasableQuantity() (+1 more)

### Community 52 - "ref_node_assert"
Cohesion: 0.40
Nodes (4): DEMO_ACCOUNT_EMAIL, DEMO_ACCOUNT_PASSWORD, orderData, shipped

### Community 53 - "Review Focus"
Cohesion: 0.22
Nodes (9): Review Focus, Task 10: End-to-end test and handoff, Task 1: Signed cookie values and the test runner, Task 2: Data model (user profile fields, locked-down users, order origin), Task 5: Account order data, Task 9: Addresses, profile and notifications (edits for this visit only), now(), AccountOrderDetail (+1 more)

### Community 54 - "Guides.ts"
Cohesion: 0.25
Nodes (7): @payloadcms/richtext-lexical, ChecklistBlock, ComparisonTableBlock, guideBlocks, ProductEmbedBlock, TipBlock, Guides

### Community 55 - "payload"
Cohesion: 0.46
Nodes (4): payload, anyone(), Brands, slugField()

### Community 56 - "react"
Cohesion: 0.48
Nodes (5): react, GuideToc(), noSubscription(), TocEntry, useActiveSection()

### Community 57 - "Faqs.ts"
Cohesion: 0.60
Nodes (4): Faqs, revalidate(), revalidateAfterChange(), revalidateAfterDelete()

### Community 58 - "format.ts"
Cohesion: 0.40
Nodes (4): dateTime, kroner, longDate, shortDate

## Knowledge Gaps
- **13 isolated node(s):** `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)`, `generate-agent-files.js (next dev)`, `formatPrice() (src/lib/format.ts)` (+8 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 387 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Category Page & Filters`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `Runtime Dependencies`, `lucide-react`, `RenderBlocks.tsx`, `shopSession.ts`, `CartView.tsx`, `package.json`, `importMap.js`, `AddressBook.tsx`, `lighting.ts`, `guide.ts`, `links.ts`, `CartProvider.tsx`, `lucide-react`, `shopSession.ts`, `kundeservice/page.tsx`, `homeBlocks.ts`, `constants.ts`, `products.ts`, `product.ts`, `formatPrice`, `navigation.ts`, `ProductCard.tsx`, `AccountDraft.tsx`, `[orderNumber]/page.tsx`, `Faqs.ts`?**
  _High betweenness centrality (0.143) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `formatPrice()` (e.g. with `Global Constraints` and `Constraints and facts from the codebase`) actually correct?**
  _`formatPrice()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Design tokens in globals.css (brand, ink, muted, shop-container)`, `Frontend: Tailwind v4, lucide-react, self-hosted Inter`, `Housekeeping (leftover styles.css, tar.gz archives, git not initialised)` to the rest of the system?**
  _13 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Category Page & Filters` be split into smaller, more focused modules?**
  _Cohesion score 0.05737234652897304 - nodes in this community are weakly interconnected._
- **Why does `payload` connect `payload` to `payload.config.ts`, `Seed Catalog Data`, `hooks.ts`, `Runtime Dependencies`, `RenderBlocks.tsx`, `shopSession.ts`, `package.json`, `importMap.js`, `account.ts`, `guide.ts`, `links.ts`, `lucide-react`, `shopSession.ts`, `kundeservice/page.tsx`, `homeBlocks.ts`, `constants.ts`, `products.ts`, `product.ts`, `navigation.ts`, `statusLabel`, `carts.ts`, `ref_node_assert`, `Guides.ts`, `Faqs.ts`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Should `Seed Catalog Data` be split into smaller, more focused modules?**
  _Cohesion score 0.05134575569358178 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `lucide-react` to `Category Page & Filters`, `SiteFooter.tsx`, `produkt/[slug]/page.tsx`, `Runtime Dependencies`, `lucide-react`, `RenderBlocks.tsx`, `shopSession.ts`, `CartView.tsx`, `package.json`, `next`, `AddressBook.tsx`, `lighting.ts`, `guide.ts`, `links.ts`, `shopSession.ts`, `kundeservice/page.tsx`, `product.ts`, `formatPrice`, `ProductCard.tsx`, `AccountDraft.tsx`, `[orderNumber]/page.tsx`, `react`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._