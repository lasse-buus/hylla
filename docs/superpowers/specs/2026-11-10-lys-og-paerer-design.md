# Lys og pærer (Philips Hue) – design handoff

Status 10 November 2026: **built** (see step 8 in `HANDOFF.md` for where things live and what differs).

The design is the artboard **"Kategori — Lys og pærer (Philips Hue)"** (`Belysning.dc.html`) on the Claude Design canvas:
https://claude.ai/artifact/VbdTqtVuhwxzNBjDpTHsWN. It sits to the right of Kundeservice in the pages row.

The idea comes from In Common With's lighting page (incommonwith.com/collections/all-lighting). There, a "Light" switch swaps every product photo for a lit version in a dark room. Hylla does the same for smart bulbs and adds colour scenes, so a visitor can see what each bulb can do before buying.

## What the page shows

1. **Header** with "Hjem" active, then a breadcrumb: Hjem › Hjem og kjøkken › Smarthus › Lys og pærer.
2. **Hero:**
   - **Left card:** the "PHILIPS HUE HOS HYLLA" eyebrow, the title, an intro, and the **Test pærene** panel with the Dag/Kveld switch and the scene chips.
   - **Right:** the living-room photo (`tv-stue.jpg`). In Kveld it is darkened, and the scene colour glows over it.
3. **Type chips:** Smarte pærer, Spotter, Lysstriper, Bordlamper, Utebelysning, Bridge og brytere.
4. **Filters on the left:**
   - Lysfarge: Hvit, White Ambiance, White and Color.
   - Sokkel: E27, E14, GU10.
   - Fungerer med: Hue Bridge, Bluetooth, Matter, Apple Home.
   - Tilgjengelighet: same as the other categories.
   - The filters are hidden at phone width, like the other category pages.
5. **Product grid:** 12 products, sort select and "Vis flere".
6. **"Slik velger du riktig pære":** three tips on base type, lumen and light colour.
7. **Footer.**

## The Dag/Kveld switch

**Dag (default)**
- The page looks like every other Hylla page.
- Product tiles show the unlit bulb on a light grey background.

**Kveld**
- The `main` area turns dark (`#0e1118`), along with cards and text.
- The header and footer stay as they are, as if the room went dark but the shop chrome did not.
- Every tile turns dark, and its bulb glows with a radial halo in the colour the bulb can actually make (table below).
- The switch knob takes the scene colour.
- Colours and backgrounds fade over 0.6 s.

**Scenes**
- Varm hvit, Dagslys, Solnedgang, Nordlys and Kveldslilla. Each scene has a main colour and a second colour, which is used for gradients.
- Picking a scene also switches to Kveld.

| Bulb type (`capability`) | Varm hvit / Dagslys | Colour scenes |
|---|---|---|
| `color` (White and Color Ambiance) | the scene colour | the scene colour |
| `ambiance` (White Ambiance) | the scene colour | warm white + note "White Ambiance viser bare hvitt lys. Her: varm hvit." |
| `white` (Hue White) | warm white | warm white + note "Hue White lyser bare varmhvitt." |
| `filament` | extra warm amber | extra warm amber + note |
| `bridge` | small blue status LED, faint glow | the same |

The notes are the point of the feature: the page teaches the difference between the bulb types.

### Scene colours (from the artboard)

| id | label | main | second |
|---|---|---|---|
| `varm` | Varm hvit | `#ffc477` | `#ffad5c` |
| `dag` | Dagslys | `#e9f0ff` | `#cddcff` |
| `solnedgang` | Solnedgang | `#ff7a3d` | `#ff3d7a` |
| `nordlys` | Nordlys | `#36e0a2` | `#3d8bff` |
| `lilla` | Kveldslilla | `#9a6bff` | `#ff5fd0` |

Filament: `#ffb257`. Bridge LED: `#4aa3ff`.

## Product images

> Update 11 November 2026: the cards now use AI-generated, unbranded photos (unlit and lit) instead of the drawings below. The drawings remain as the fallback. See step 8 in `HANDOFF.md`.

- The tiles are **drawn SVG bulbs**, not photos. Each one has a lit and an unlit state.
- **Do not use Philips' product photos or logo.** The brand and product names are real, but the images are Hylla's own.
- There are eight shapes, one per `illustration` value:

| `illustration` | Used for |
|---|---|
| `a60` | standard E27 bulb |
| `globe` | G93 globe; clear filament or opal |
| `gu10` | spot |
| `strip` | lightstrip with a gradient |
| `go` | Hue Go |
| `iris` | Hue Iris |
| `candle` | E14 candle bulb |
| `bridge` | Bridge |

- The SVG paths are in the artboard and can be copied straight into a `BulbIllustration` component.
- The product page gallery still needs images. Draw larger versions of the same illustrations, or take your own photos.

## Products (seed)

- **Prices and ratings are invented.** Real prices may differ.
- **Brand:** new `philips-hue` ("Philips Hue").
- **Category:** the existing subcategory `smartlys` under `hjem-og-kjokken` (Smarthus group). Consider renaming its title to "Lys og pærer".

| Product | `illustration` / `capability` | Base · lm | Price (before) | Badge |
|---|---|---|---|---|
| Hue White and Color Ambiance E27, 2-pk | a60 / color | E27 · 1 100 | 1 299 (1 599) | bestseller |
| Hue White Ambiance E27 | a60 / ambiance | E27 · 1 100 | 449 | |
| Hue Filament Globe G93 E27 | globe / filament | E27 · 550 | 399 | new |
| Hue White and Color Ambiance GU10, 3-pk | gu10 / color | GU10 · 400 | 1 499 (1 799) | |
| Hue Gradient Lightstrip 2 m | strip / color (gradient) | – | 1 799 | |
| Hue Go bærbar lampe | go / color | – | 1 190 | favorite |
| Hue Iris bordlampe | iris / color | – · 570 | 1 290 | |
| Hue White E14 kronepære, 2-pk | candle / white | E14 · 470 | 349 | |
| Hue Bridge Pro | bridge / bridge | – | 999 | |
| Hue startpakke E27, 3 pærer og Bridge | a60 / color | E27 | 2 490 (2 990) | "STARTPAKKE" |
| Hue White Ambiance Globe G93 E27 (opal) | globe / ambiance | E27 · 806 | 549 | |
| Hue White Ambiance GU10 | gu10 / ambiance | GU10 · 350 | 379 | |

**Placeholders in the artboard:**
- Badges the badge select doesn't have yet: "SPAR 300 KR", "STARTPAKKE".
- The counts: "64 produkter" and the chip and filter counts.

In the build, derive the counts from the data and the "SPAR" badge from `compareAtPrice`, as the other pages do.

## Data model changes

On `products`, add an optional **`lighting` group**, shown only when relevant (admin condition: has the brand `philips-hue` or the category `smartlys`):

- `capability`: select `white | ambiance | color | filament | bridge`
- `illustration`: select with the 8 shapes above
- `opal`: checkbox (globe only: opal glass rather than clear)
- `gradient`: checkbox (lightstrip)
- `socket`: select `E27 | E14 | GU10 | none`
- `lumen`: number
- `kelvinMin` and `kelvinMax`: numbers
- `worksWith`: multi-select `bridge | bluetooth | matter | apple-home`

Then:

- Create a migration (`pnpm migrate:create lighting`).
- Extend `SeedProduct` and the seed with the brand, the products and the `lighting` data.

## Build plan

- **Route:** reuse `/kategori/[slug]` for `smartlys`.
  - When the category's products have `lighting` data, render the lighting variant: the hero with the test panel, plus light-aware tiles.
  - Alternatively add a category field `layout: 'standard' | 'lighting'`. That is simpler to reason about and is the recommendation.
- **State:** a client `LightPreviewProvider` (context) holding `{ on, scene }`.
  - Keep it out of the URL: it is a view preference, not a filter. Remember it per tab in `sessionStorage` (`hylla-lys`), wrapped in try/catch.
  - The server renders "Dag" by default, so there is no hydration flash.
- **Components** (`src/components/lighting/`):
  - `LightToggle`: a real `<button aria-pressed>` with the label "Skru lyset av eller på".
  - `ScenePicker`: a group of `aria-pressed` buttons.
  - `BulbIllustration`: SVG, with props `illustration`, `color`, `color2` and `lit`.
  - `lightFor(capability, scene)`: a pure function returning `{ color, color2, note }`. Unit-test it against the table above.
  - The room hero.
- **ProductCard:** let the existing `src/components/shop/ProductCard.tsx` take an optional `media` slot, so the lighting grid can pass a `BulbIllustration` without forking the card.
- **Filters:** add Lysfarge, Sokkel and Fungerer med as facets to `parseFilters`/`ProductBrowser`, kept in the URL like the existing filters. Show them only for categories with lighting data.
- **Theme:** dark tokens for the `main` area in Kveld. Contrast has been checked against `#161b25` cards:
  - text `#f3f5f8`
  - muted `#a7b0c0`
  - line `#262d3a`
  - accent `#8ea6ff`
  - stock `#4fd18b`
- **Motion:** respect `prefers-reduced-motion` and drop the fades.
- **Tests:**
  - unit tests for `lightFor`
  - an e2e test: toggle, pick "Nordlys", and check that an Ambiance card shows the note and a Color card doesn't

## Open questions

- Should "Lys og pærer" get its own spot in the Hjem & kjøkken mega menu promo, and a guide such as "Kom i gang med smart belysning"?
- Should the product page also get the switch (lit or unlit gallery)? It is not designed yet.
