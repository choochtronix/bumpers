# Brrtz

Free beta gear radar for finding used synthesizers, drum machines, samplers, modular gear, effects, and pro audio across regional marketplaces — with links back to the original listing. Live at <https://brrtz.com>.

> Naming note: the repo, some storage keys (`bumpers.*`), and `BUMPERS_*` environment
> variables retain the former project name **Bumpers**. Use **Brrtz** for new product
> copy; do not rename stable storage keys or env vars. See `docs/BRRTZ-HANDOFF.md`.

## What It Does

- Multi-source search across regional marketplaces from one interface
- Live regions: Japan (JPY), US Bay Area / Los Angeles / East Coast (USD), UK (GBP) — see `regions.js`
- Clean Gear filtering to keep records, books, clothing, and other marketplace noise out of results
- Saved searches with per-search email alert mode (local-first, cloud-synced when signed in)
- Fresh Finds new-listing detection and Watched gear
- Gear Scanner browse feed and curated Brand Browser recipes
- Marketplace source badges and Grid / List / Gallery (GLG) result cards
- Feedback controls for teaching Brrtz which listings are gear vs. noise

## Running Locally

Brrtz is a Node server app (live connector data requires the server — opening
`index.html` directly will not fetch listings).

```sh
cd /home/hanzj/code/brrtz
npm start
```

Then open:

```text
http://127.0.0.1:5173
```

For iPhone/mobile preview on the same Wi-Fi, use the LAN URL printed by the server.

## Architecture & Handoff

The durable entry point for resuming work is `docs/BRRTZ-HANDOFF.md`, with
onboarding in `docs/AI-START-HERE.md`. Product sequencing lives in `ROADMAP.md`,
and the visual contract in `DESIGN-SYSTEM.md` / `AGENTS.md`.

## Feature Docs

- [Synth Browser](docs/synth-browser.md): homepage browse mode, category intents, cache behavior, and source category strategy.
- [Browse category verification](docs/browse-category-verification.md): verified category IDs and keyword-backed category notes.
- [Beta QA loop](docs/beta-qa-loop.md): repeatable beta checks for cloud sync, mobile header, list/card view, Gear Browser, and source health.
- [Windows migration](docs/windows-migration.md): moving local development from Mac to Windows while keeping Supabase, Railway, and GitHub in sync.

## Connector Model

Every live source returns normalized listing objects. `region` and `currency`
are required on every listing:

```js
{
  id: "source-stable-listing-id",
  source: "mercari",
  region: "japan",
  currency: "JPY",
  title: "Listing title",
  price: 120000,
  condition: "Used",
  listedAt: "2026-07-23T09:30:00+09:00",
  url: "https://source.example/listing",
  image: "https://source.example/thumb.jpg"
}
```

See `docs/BRRTZ-HANDOFF.md` (Regions And Sources) for the current source roster
and access posture per region, and `src/sources/sourceRegistry.js` for
operational status.
