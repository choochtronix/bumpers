# Brrtz Source Registry

This registry tracks active integrations, parked sources, and source candidates. Treat it as the human-readable companion to `src/sources/sourceRegistry.js`.

## Status Values

- `active`: used by Brrtz in normal beta search.
- `testing`: wired or partially wired, but still needs QA before broad trust.
- `paused`: intentionally unavailable or parked for safety.
- `candidate`: worth investigating, not yet part of automated ingestion.
- `blocked`: should not be ingested unless conditions change.

## Access Types

- `api`: official or stable API access.
- `search-url`: query URL or page data that Brrtz can read without browser automation.
- `browser-assisted`: browser automation where source rendering requires it.
- `scrape`: respectful server-side page parsing.
- `manual`: user-assisted deep link or future source candidate.

## Japan

| Source | Status | Access | Type | Test Query | Notes |
|---|---|---|---|---|---|
| Mercari Japan | active | browser-assisted | marketplace | Roland Juno 106 | High-value Japan source. Slower than direct page parsing, but essential. |
| Yahoo Auctions Japan | active | search-url | auction | Waldorf | Core Japan auction source. Strong category and gear-confidence filtering. |
| Yahoo Fleamarket | active | search-url | marketplace | Waldorf | Useful Japan marketplace source with occasional noise. |
| Rakuma | active | search-url | marketplace | Waldorf | Useful but noisy. Thumbnail proxy support matters. |
| Digimart | active | search-url | marketplace | Sequential Circuits | High-signal music gear source. |
| Jimoty | active | search-url | classifieds | シンセサイザー | Local classifieds source. Useful but likely noisy. |
| OFFMALL / Hard Off | active | search-url | shop | Roland | Strong used gear network source. |
| Five G | active | scrape | shop | Oberheim | Low volume, high-signal specialist shop. |
| implant4 | active | scrape | shop | Oberheim | Low volume, high-signal specialist shop. |
| Reverb Japan | active | api | marketplace | Oberheim | Queried with Japan country filter. |

## United States / California

| Source | Status | Access | Type | Test Query | Notes |
|---|---|---|---|---|---|
| Reverb US | active | api | marketplace | synth | Live in Bay Area and Los Angeles. Broad, fast, and useful, but region-locality is weaker than Craigslist. |
| eBay US | active | api | marketplace | drum machine | Official Browse API connector. Uses eBay category `619` (Musical Instruments & Gear) by default and is live in Bay Area and Los Angeles. Treat as US/global inventory unless a future location strategy is added. |
| Craigslist SF Bay Area | paused | search-url | classifieds | synth | Parked for beta safety after Craigslist blocking. Use Craigslist Assist manual deep links only. |
| Craigslist Los Angeles | paused | search-url | classifieds | synth | Parked for beta safety after Craigslist blocking. Use Craigslist Assist manual deep links only. |
| Facebook Marketplace Musical Instruments | candidate | manual | marketplace | synth | High signal, but keep manual/user-assisted until official access is clear. |
| OfferUp | candidate | manual | marketplace | synth | Local signal, app-first friction. Manual/user-assisted first. |
| Robot Speak | candidate | manual | shop | synth | Key SF synth shop candidate. |

## Near-Term Candidates

These were gathered for Bay Area / California expansion and should be promoted only through the source-discovery loop.

| Source | Region | Priority | Notes |
|---|---|---:|---|
| Guitar Center Used Synths | US | P1 | High inventory; useful used-gear filters. Next safest source-scout target after eBay because it is music-specific and lower-risk than social/local marketplaces. Task: `ops/tasks/guitar-center-used-source.md`. |
| Sweetwater Gear Exchange | US | P1 | Used peer-to-peer music gear. Good second source-scout target after Guitar Center because it is music-gear-specific. |
| ShopGoodwill Musical Instruments | US | P1 | Potential hidden gems, but noisy and condition varies. |
| Mission Synths | San Francisco | P1 | Local synth/modular specialist; investigate used or consignment surfaces. |
| Perfect Circuit | Los Angeles | P1 | Major CA synth/modular/pro-audio retailer. |
| Noisebug | SoCal | P1 | Strong modular/synth specialty shop. |
| Analogue Haven | Los Angeles / online | P1 | Used modular/synth consignments. |
| Bananas at Large | Bay Area | P2 | Pre-owned keyboards/synths. |
| Starving Musician | Bay Area | P2 | Independent music shop, likely easiest via Reverb storefront. |
| Music Go Round Elk Grove | Sacramento area | P2 | Used instruments; keyboard/synth inventory may be sporadic. |
| Mod Wiggler BST | forum/global | P2 | High-signal modular classifieds, but community/login constraints. |
| Reddit r/Synths4Sale | forum/social | P2 | Useful marketplace, location often in title; access policies need review. |
| Elektronauts marketplace | forum/global | P2 | Good for Elektron gear; marketplace access may vary. |

## Source Promotion Checklist

Before a candidate becomes `testing` or `active`:

- [ ] Access method is documented and legally/ethically acceptable.
- [ ] Source appears in `src/sources/sourceRegistry.js`.
- [ ] Region mapping is documented in `src/regions/regionRegistry.js` or app region config.
- [ ] A test query is assigned.
- [ ] At least three golden searches have been manually spot-checked.
- [ ] Source health behavior is known: healthy, stale, credential-gated, or parked.
- [ ] Noise/relevance behavior is checked in Gear Mode.
- [ ] Failure state is user-friendly in the source pill row.

## Last Updated

2026-06-15
