# Synth Browser

Last updated: 2026-06-17

Synth Browser is Brrtz's homepage browsing layer. It is meant to feel like walking into a live vintage synth shop: image-forward, fast, and useful even before a user has saved searches.

## Product Goal

The normal Brrtz search flow answers, "Find this exact thing for me." Synth Browser answers, "Show me the latest synth-adjacent gear worth browsing."

It should:

- Keep the homepage alive for first-time users.
- Provide a fast random-browse experience similar to category browsing on Buyee.
- Prefer real, current listings from Brrtz sources over static demo cards.
- Stay synth-centric by default.
- Let users pivot into broader categories without making the primary search UI heavier.

## Current Homepage Behavior

On the idle homepage, Brrtz shows these sections in order:

1. Fresh Finds
2. Synth Browser
3. Watched Gear, only when the signed-in or local user has watched listings

Fresh Finds and Synth Browser are intentionally separate:

- Fresh Finds is a curated feed from seed searches and recent live scans.
- Synth Browser is category-oriented browsing from source category IDs or category search terms.
- Watched Gear belongs to the user and should not replace Fresh Finds.

## User Controls

Synth Browser includes a compact category dropdown in the section header.

Current options:

- All Synth Gear
- Synthesizers
- Drum Machines
- Samplers
- Sequencers
- Eurorack / Modular
- Effects / Pedals
- Pro Audio

`All Synth Gear` is the default homepage browse mode. It aggregates the fast, verified synth-centric Yahoo Auctions category branches:

- Synthesizers
- Drum Machines

In US beta regions, `All Synth Gear` uses conservative category search terms across Reverb US and eBay US:

- `synthesizer`
- `drum machine`
- `sampler`
- `sequencer`
- `eurorack`

Pro Audio is intentionally kept as its own selectable category. It is verified and useful, but mixing it into the default feed brought in broader PA and lighting-adjacent results that weakened the vintage synth browsing feel.

## Server Endpoint

Synth Browser uses:

```text
GET /api/browse?region=japan&categoryIntent=all&maxPrice=0
```

Important query params:

| Param | Purpose |
| --- | --- |
| `region` | Active Brrtz region. Japan uses verified Yahoo Auctions categories; US beta regions use Reverb US + eBay US category terms. |
| `categoryIntent` | One of the shared category intent IDs. |
| `excludes` | Pipe-delimited terms to exclude. |
| `maxPrice` | Optional price ceiling. `0` means no ceiling. |

The response returns normalized listing objects using the same shape as normal search results.

## Category Intent Model

The UI category list lives in `app.js` as `CATEGORY_INTENTS`.

The server source behavior lives in `server.js` as `CATEGORY_INTENT_CONFIG`.

Each category intent can use one of three strategies:

1. Exact source category ID
2. Aggregated exact source category intents
3. Keyword-backed category search
4. US beta source terms for Reverb/eBay browse

Examples:

```js
all: {
  label: "All Synth Gear",
  yahooAuctionsBrowseCategoryIntents: ["synthesizers", "drum-machines"],
}
```

```js
synthesizers: {
  label: "Synthesizers",
  yahooAuctionsBrowseCategoryId: "2084019003",
}
```

```js
samplers: {
  label: "Samplers",
  usBrowseTerms: ["sampler", "akai mpc", "sp-404"],
  yahooAuctionsBrowseTerms: ["sampler", "サンプラー", "akai mpc", "sp-404"],
}
```

## United States Beta Browse

Bay Area and Los Angeles browse feeds use:

- Reverb US keyword search filtered to US listings
- eBay Browse API keyword search filtered to US item location and category `619` by default

Craigslist, Sweetwater, and Guitar Center remain assist/manual sources in the browse context. They are intentionally not mixed into Synth Browser cards until a low-risk live listing strategy exists.

The US browse path favors freshness and breadth over perfect locality. Craigslist remains the local-first path through prepared deep links.

## Verified Yahoo Auctions Categories

The current verified source map is tracked in:

```text
docs/browse-category-verification.md
```

Current verified Yahoo Auctions category IDs:

| Intent | Category ID | Yahoo label |
| --- | --- | --- |
| `synthesizers` | `2084019003` | `キーボード、シンセサイザー` |
| `drum-machines` | `2084019005` | `リズムマシン` |
| `pro-audio` | `2084019010` | `レコーディング、PA機器` |

Current keyword-backed intents:

- `samplers`
- `sequencers`
- `modular`
- `effects-pedals`

These stay keyword-backed until a source exposes a clean category branch or a better connector-specific category filter.

## Caching

Synth Browser uses a local last-known-good cache to keep the homepage from feeling empty or slow.

Behavior:

- If live browse listings are available, render them and save a small cache.
- If the live request is still loading, show cached listings immediately when available.
- If live request fails and cache exists, keep showing cached listings.
- If no cache exists, show loading cards while the live request warms up.

Cache data is stored inside the existing Fresh Finds cache structure, under a region and `browseCategories`.

The section header includes freshness text such as:

- `Updated just now`
- `Updated 4 min ago`
- `Updated Jun 14, 03:10 PM`

## Filtering

Before rendering, Synth Browser listings pass through the same beta quality gates as homepage Fresh Finds:

- Unavailable, sold, or ended listings are removed.
- User or default excludes are applied.
- Gear Mode quality filtering is applied when active.
- Starter Fresh Finds noise terms are applied.
- Results are deduped by listing ID.

## Region Behavior

Japan is the only fully wired browse region for beta.

US beta regions currently remain search-based:

- Bay Area: Reverb US plus Craigslist Assist
- Los Angeles: Reverb US plus Craigslist Assist

Craigslist is intentionally parked as manual assist and should not be used as an automatic browse source during beta.

## Agent Notes

When extending Synth Browser:

- Prefer exact category IDs over keyword searches when reliable IDs exist.
- Do not mix broad pro-audio categories into the default homepage feed unless the ranking layer can keep the feed synth-forward.
- Keep source requests conservative. Homepage browse should feel alive without becoming aggressive.
- Update `docs/browse-category-verification.md` whenever adding or changing category IDs.
- Keep UI labels human-friendly, but keep intent IDs stable for saved profiles and cache keys.
- Test with `categoryIntent=all`, one exact category, and one keyword-backed category.

## Follow-Up Work

- Add Digimart category browsing for synths and related gear.
- Add Reverb category/API browse support for US regions.
- Add eBay Browse API category support after developer approval.
- Add server-side browse cache if public beta traffic makes homepage warming too slow.
- Add a lightweight "Browse All" freshness/ranking layer that favors image-rich, recent, gear-confident listings.
