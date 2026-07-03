# Bumpers

Local-first synth and pro-audio gear search aggregator. Searches multiple Japanese marketplaces simultaneously from one interface. Expanding to Bay Area / US next.

## What Bumpers Is

A free public search tool for finding used synthesizers, electronic music instruments, and pro audio gear across Japanese auction, flea market, and shop sources. Core differentiators: multi-source search, Clean Gear filtering, saved searches with alert mode, Fresh Finds new-listing detection, and Watched gear. No paid tier — free with invite-gated beta.

## Stack

- **Frontend**: Vanilla HTML/CSS/JS — `index.html`, `app.js`, `gear-scanner-curation.js`, `styles.css`, `design-system.css`
- **Server**: Node (`server.js`) — search aggregation, connector routing, image proxying, Supabase auth routes
- **Backend**: Supabase — `saved_searches`, `user_profiles`, `alpha_invites` tables
- **Browser automation**: Playwright (Mercari connector only)

## Running Locally

```sh
cd /Users/craigdrake/Documents/Codex/bumpers
npm start
```

Open: `http://127.0.0.1:5173`

For iPhone/mobile preview on the same Wi-Fi, use the LAN URL printed by the server.

## Gear Scanner Curation

Classification logic (term lists, hard-exclude rules, scoring) lives in `gear-scanner-curation.js`, shared by the browser and Node:

- In the browser it loads as a classic `<script>` **before** `app.js` in `index.html` — its declarations are globals that `app.js` uses directly. Never redeclare them in `app.js`.
- Keep the file free of DOM/localStorage access. Browser-only globals (`loadLedger`, `createGearQualityContext`, `getProfileFeedback`, `getActiveNoiseTerms`) are reached through `resolve*` typeof guards that fall back to neutral defaults in Node.
- Fixtures: `test/fixtures/gear-scanner-curation.json`. When a bad listing slips through, add it to fixtures **first** (confirm it fails), then generalize the rule.
- `npm test` — fast Node fixture check (~0.2s, no server). **Run this before any commit or tool handoff that touches curation.**
- `npm run qa:gear-scanner-curation` — same fixtures through the real page via Playwright (needs `npm start` running); validates browser wiring.
- `npm run qa:gear-scanner-report` — decision report against live feed data, for tuning passes.

## Architecture

### Connector Model

Every connector in `server.js` normalizes listings into this common shape:

```js
{
  id: "source-stable-listing-id",
  source: "mercari",
  region: "japan",          // expanding — do not omit
  currency: "JPY",          // expanding — do not omit
  title: "Listing title",
  price: 120000,
  condition: "Used",
  listedAt: "2026-06-07T09:30:00+09:00",
  url: "https://source.example/listing",
  image: "https://source.example/thumb.jpg"
}
```

`region` and `currency` are required on all listings. Current region value is `"japan"` for all existing connectors. US connectors will use `"us-bay-area"` and `"USD"`.

### Current Sources (`app.js` — `SOURCES` array)

| id | Label | Region | Status |
|---|---|---|---|
| `mercari` | Mercari | japan | Playwright browser automation |
| `yahoo-auctions` | Yahoo Auctions | japan | Live |
| `yahoo-fleamarket` | Yahoo Fleamarket | japan | Live |
| `rakuma` | Rakuma | japan | Live, image proxy required |
| `digimart` | Digimart | japan | Live |
| `offmall` | OFFMALL | japan | Live |
| `hardoff` | Hard Off | japan | Alias for OFFMALL connector |
| `five-g` | Five G | japan | Live, lower volume |
| `implant4` | implant4 | japan | Live, lower volume |
| `reverb` | Reverb | japan | Live, orange source, Japan listings |
| `jimoty` | Jimoty | japan | Live |

Next US sources to add: `ebay` (official Finding API), `reverb` globally (already has currency-aware parsing).

### Server Routes

- `GET /api/search` — aggregates all connector results
- `GET /api/auth/config` — Supabase public config for browser auth
- `GET /api/cloud/saved-searches` — cloud sync for saved searches
- `GET /api/cloud/profile` — cloud sync for profile preferences
- `GET /api/rakuma-image` — image proxy
- `GET /api/rakuma-thumbnail` — thumbnail proxy

### Saved Search Schema

`SAVED_SEARCH_SCHEMA_VERSION` in `app.js` — **bump this whenever the saved search schema changes** and add a migration check to `shouldMigrateStoredProfiles`.

Current schema fields: `id`, `schemaVersion`, `userId`, `name`, `terms`, `excludes`, `noiseTerms`, `sources`, `regions`, `maxPrice`, `alertMode`, `createdAt`, `updatedAt`, `deletedAt`, `lastScannedAt`, `lastMatchCount`, `lastNewCount`, `lastSourceCount`, `lastScanStatus`, `sync`.

`regions` defaults to `["japan"]` for existing saved searches — always provide a safe fallback.

Local storage key: `bumpers.profiles`

## Key Conventions

- **Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.** Service role key is server-side only (`.env.local`). `SUPABASE_ANON_KEY` is safe for browser auth flows.
- **All connector parse functions return the full common listing shape** — never omit `region` or `currency`.
- **Keep bulky listing/cache data out of saved search records.** Saved searches store user intent (terms, filters), not listing snapshots.
- **Prefer deterministic filtering before adding AI cost.** Clean Gear uses scoring, not model calls.
- **Schema version bumps are required** when adding fields to saved search records — old saves must silently migrate via `hydrateProfile`.
- **Desktop and mobile web use the same codepath.** No separate mobile build.
- **`formatPrice` should read `listing.currency`**, not just the global `appSettings.currency`, so multi-currency result sets display correctly.

## Regional Expansion Plan

The codebase is being made region-aware. When adding US connectors:

1. Add `region: "us-bay-area"` and `currency: "USD"` to every listing the connector returns
2. Add the source to `SOURCES` in `app.js` with a `region` field
3. Add `regions` filtering to `handleSearch` in `server.js`
4. The Refine modal source list should group sources by region

First US sources: eBay (official Finding API — use it, do not scrape), Reverb global (already in codebase, just remove Japan filter).

## Legal Posture

Bumpers is a **free public tool** — no paid tier, no data resale. Listings are fetched live and linked back to source. This is the defensible position; do not add features that store or republish full listing databases. A Privacy Policy and Terms of Service are required before public launch.

## Invite-Only Beta

- Add tester email to `public.alpha_invites` in Supabase
- Set `BUMPERS_REQUIRE_INVITE=true` and restart server
- Gate is email allowlist based — no typed invite code UI yet

## Assets

- `assets/ICONS-site/bumpers_logo.svg` — main logo
- `assets/ICONS-site/b-favicon.svg` — favicon
- `assets/logos/ICONS/*.svg` — source logos
- `assets/ICONS-site/icon-refine-animated-v02-spin.svg` — refine button
