# Min side (my account) – design

Date: 28 October 2026
Design reference: the "MinSide" artboard on the Claude Design canvas (`project/MinSide.dc.html` in https://claude.ai/artifact/VbdTqtVuhwxzNBjDpTHsWN).

## Intent

Hylla is a fictional Norwegian electronics webshop built as a portfolio project. Min side lets a portfolio visitor experience a logged-in customer account without creating one. The visitor logs in as a shared demo customer, **Lasse Nielsen**, with one click. They can browse his order history, place an order as him and follow it, and try out the account settings.

The project's ground rules still apply: no real payments, and **no personal data stored**.

## Goals

1. **Login page.** When signed out, "Min side" (header link and `/min-side`) shows a login page instead.
   - Email and password fields come pre-filled with Lasse's demo credentials.
   - A prominent **"Logg inn som demokunde"** button submits them.
2. **No registration.** There is no "create account" link anywhere.
3. **Min side views**, following the artboard:
   - Overview: "Hei, Lasse!", the order on its way, cards for delivery address, newsletter and profile, and the latest orders.
   - Orders: list with status filters.
   - Order detail: status steps, items, totals, events, delivery, payment and help.
   - Addresses.
   - Profile and login.
   - Newsletter and alerts.
   - The sidebar has links to Kundeservice and Logg ut.
4. **Edits last for the visitor's own visit only.**
   - Profile fields, addresses (add, edit, set default, delete) and newsletter or alert toggles all work in the UI.
   - They are kept in the browser for that visit and are never saved to the server, so the next visitor always meets the same Lasse.
   - Logging out discards them.
5. **Checkout as Lasse.**
   - When logged in, the checkout places the order as Lasse, using his server-side profile and default address, and links it to his account.
   - The "Ny demokunde" button is hidden.
   - When logged out, checkout behaves as today: a random generated demo customer.
6. **Orders the visitor placed show up for them only.**
   - Min side lists Lasse's seeded order history, plus orders placed through checkout **in this browser**.
   - Orders other visitors placed as Lasse are not shown.
   - The admin sees all of Lasse's orders. When an editor changes an order's status (e.g. to "Sendt"), the visitor who placed it sees the change on its order page.
7. **Demo-only actions** are kept for the look, but clicking them shows "Ikke tilgjengelig i demoen":
   - Endre passord
   - Koble fra (Vipps login)
   - Last ned dataene mine
   - Slett kontoen
   - Kvittering (PDF)
   - Spor pakken
   - Returner varer
8. **Nightly reset.** The reset (`src/seed/resetDemo.ts`) recreates Lasse and his seeded history, and deletes orders placed by visitors.

## Non-goals

- Real accounts, registration, password reset, or Vipps login.
- Persisting any visitor edit server-side.
- Sending emails or SMS.
- Changing how guest checkout works for logged-out visitors.

## Anti-goals (failure even if it "works")

- **One visitor's actions leak to another.** This covers edits, test orders, and the cart.
- **Logging in as Lasse gives any access to `/admin`.**
- **A visitor can change Lasse's server-side data**, for example through the REST API with the public password, and other visitors see the change.
- **Visitor-typed text ends up stored in an order or user record**, which would break the no-personal-data rule.

## Constraints and facts from the codebase

- **Stack:** Next.js 16 App Router, Payload 3.92 (Postgres), and `@payloadcms/plugin-ecommerce`. Read `node_modules/next/dist/docs/` before using Next APIs (see `AGENTS.md`).
- **Users collection** (`src/collections/Users.ts`):
  - `auth: true`, `name`, and `roles` (`admin` / `customer`).
  - Payload admin access already requires the `admin` role.
  - Today users can update themselves. That must change so a customer cannot update their own record (anti-goal above).
- **Orders** (`src/collections/orders`):
  - The order already has `customerAccount` (relationship to users), customer, address, shipping, payment and notes fields.
  - The order hook computes totals, logs status changes and adjusts stock.
  - Orders have no way to tell a seeded order from one placed through checkout. Goal 6 needs that, so add one field (for example `placedVia: 'seed' | 'checkout'`) plus a migration.
- **Checkout** (`src/app/(frontend)/kassen/actions.ts`, `placeOrder`):
  - The customer is rebuilt on the server from a seed (`src/lib/demoCustomer.ts`).
  - A signed, httpOnly cookie (`src/lib/orderReceipt.ts`) names the order the browser just placed; the confirmation page uses it.
  - Goal 6 should reuse this signing approach (see "Remembering placed orders" below).
- **Carts:** the ecommerce provider (`src/components/cart/CartProvider.tsx`) fetches `/api/users/me`, and once it knows the user it creates and merges carts **owned by that user**. Every visitor shares Lasse, so this would give everyone one shared cart.
  - Carts must stay per-browser guest carts even while logged in as Lasse.
  - The builder chooses how, for example by keeping the provider from picking up the user.
- **Personal data:**
  - Checkout as Lasse must use his server-side record, never values the visitor edited in the browser. Browser-only edits stay display-only.
  - This is a deliberate trade-off: an address the visitor adds in this visit is not used at checkout.
- **Routes** (`src/lib/routes.ts`): `account: '/min-side'` already exists, and the header links to it.
- **Copy:** all copy is Norwegian bokmål. Reuse design tokens, `formatPrice`, `formatDate`, `Breadcrumbs`, the order status labels from `orders/constants.ts`, and existing card and section styles.
- **Seeded data:** demo emails use `@eksempel.no`, and seeded orders are generated in `src/seed/demoOrders.ts` with the faker NB locale.

## Decisions made (the author's calls, open to override)

- **Demo user:**
  - Lasse Nielsen, `lasse.nielsen@eksempel.no`, role `customer`.
  - His password is a fixed constant shown on the login page (it is public by design). Seeding creates him and sets the password.
- **New user fields:** phone, saved addresses (label, street, postal code, city, default flag), newsletter and alert preferences, and "kunde siden" date.
  - Seed them to match the artboard: Hjem (Storgata 12, 0155 Oslo, default) and Hytta (Fjellveien 4, 3580 Geilo); customer since March 2024.
- **Seeded history:** about 5 orders over the last ~2 months, covering the artboard's states: one "Sendt" (on its way, shown on the overview), two "Levert" (one still within open purchase, so it gets "Returner varer"), one "Refundert" and one "Behandles". Products, prices and totals are real catalog items via the order hook.
- **Routes:** one URL per view instead of the artboard's in-page switching, so the back button and deep links work.
  - `/min-side` (overview), `/min-side/ordrer` (with `?status=` filter), `/min-side/ordrer/[orderNumber]`, `/min-side/adresser`, `/min-side/profil` and `/min-side/varsler`.
  - The login page is `/logg-inn`, redirecting back to the requested page after login.
- **Layout:** Min side lives in the shop layout (header and footer) with the artboard's left sidebar.
- **Where browser edits live:** `sessionStorage`, so they end with the tab or visit. Logging out clears them too.
- **Order detail:**
  - Status steps map from order status.
  - Events come from the order's `notes` with type `system` or `customer`, never `private`.
  - Visitors can only open orders in their visible list. Any other order number returns 404.
- **Session (decided by the user):** the shop has its own login for Lasse, separate from the admin's. This lets an editor be logged into `/admin` and Min side at the same time in one browser.
  - Logging in on `/logg-inn` checks the email and password with Payload (`payload.login`).
  - It then sets a shop-only signed, httpOnly cookie naming the user. It does not set Payload's `payload-token` cookie.
  - Server components and the checkout read this cookie, not `payload.auth`.
  - Only users with the `customer` role (and not `admin`) can log in to the shop. Admin credentials are rejected on `/logg-inn`, and an admin's Payload session is never treated as a shop customer.
  - "Logg ut" deletes the shop cookie and leaves any admin session untouched.
- **Remembering placed orders (decided by the user):** orders this browser placed as Lasse stay visible on Min side until the nightly reset.
  - They survive "Logg ut" and logging in again, and closing the tab.
  - Profile and address edits still end with the visit or at logout.
  - Use a signed cookie listing the order IDs, scoped to the site and lasting until about the next reset (e.g. 24 hours). The checkout confirmation page keeps working.
## Left to the builder

- Component structure and the client/server split.
- The exact sessionStorage shape.
- How to stop the cart provider from claiming the user.
- Whether the header shows "Hei, Lasse" when logged in.
- Exact seeded order contents.
- The migration name.
- The test approach. It should at least cover:
  - logging in and out;
  - a checkout as Lasse that appears only in the placing browser;
  - an admin status change reflected on the order page;
  - a customer unable to update their user record, or reach `/admin`, via the API.
