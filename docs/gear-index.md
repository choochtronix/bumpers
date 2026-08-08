# Gear Index — daily going-rate snapshots

The Gear Index is the data layer behind the "Going rate" feature: a daily
asking-price index for a curated catalog of landmark instruments (Jupiter-8,
CS-80, TR-808/909/606, Minimoog, ARP 2600, OB-Xa, Prophet-5), tracked per
index region. Phase 1 (this document) is collection only — no UI. The board
page, gear-page charts, and deal chips come in Phase 2, once the index has
real history to show.

## What the number is

For each model x region, the index runs the model's search terms through the
same connectors a user search uses, filters the results, and records the
**median asking price** for the day. It is an asking-price index, not a
sold-price index — say so anywhere the number is shown.

Filtering, in order:

1. Listings with no usable price or currency are dropped.
2. The title must match the model's `includeTerms` and none of its
   `excludeTerms` (`data/gear-index.json`). Matching folds case, character
   width, and separators, so `TR-808` / `TR808` / `ＴＲ－８０８` are equal.
   Exclude terms are how clones, reissues, and near-miss models (Behringer
   RD-8, Boutique JP-08, Jupiter-80, Peavey CS-800…) stay out of the index.
3. The Gear Scanner curation hard-exclude rules apply
   (`gear-scanner-curation.js`), removing accessories, junk-tier noise, etc.
4. A per-model USD price band (`priceFloorUsd` / `priceCeilingUsd`) guards
   against leftovers: manuals, knobs, sample packs, decimal-slip prices.

Statistics: prices outside the IQR fence (1.5x) are trimmed, then median,
p25, and p75 are computed on the trimmed set. Below `minSample` matched
listings (default 3), the row records the count but publishes **no prices** —
thin days show as gaps, not noise.

Known caveats (accepted for v1, revisit with real data):

- Minimoog mixes vintage and Moog reissue units (Behringer clones are
  excluded). ARP 2600 excludes Korg/Behringer reissues by brand name, but a
  bare "ARP 2600M" title without "Korg" would slip in.
- Prophet-5 excludes Rev4 listings to keep the vintage series clean.
- Region "us" searches through the bay-area region config plus east-coast
  shop connectors; reverb-us and ebay-us are national feeds, which is why the
  index does not pretend to per-city US medians.

## Index regions vs search regions

`japan`, `us`, `uk` — defined in `src/gear-index/gearIndexCore.js` with an
explicit source list per region. Excluded on purpose: manual/assist sources
(Sweetwater, Guitar Center, ProAudioStar), parked Craigslist, and Mercari
(Playwright browser automation is too heavy/flaky for a scheduled job).

Each row stores the median in the region's native currency plus a
USD-normalized `usd_median` (and the `fx_rate_usd` used), so region
comparison works without letting FX drift wobble the native-currency history.
FX comes from frankfurter.dev (ECB) with open.er-api.com as fallback, cached
12 h; if both fail, USD conversion is null for that snapshot and native
prices are unaffected.

## Storage

- **Supabase** (production): `public.gear_index_daily` — run
  `docs/sql/gear-index-schema.sql` once. Aggregate stats only; the table
  never stores listings.
- **File fallback** (local dev without Supabase): `data/gear-index-daily.json`
  (gitignored).

## Running it

The scheduler is **off by default**. One snapshot (one model x region pair)
runs every `BRRTZ_INDEX_INTERVAL_MINUTES` (default 45). With 9 models x 3
regions = 27 pairs, a full cycle takes ~20 h — every pair lands roughly once
a day, and the load on any single source is one extra search per interval.

Environment:

```
BRRTZ_INDEX_SCHEDULER=true        # enable the in-process scheduler
BRRTZ_INDEX_INTERVAL_MINUTES=45   # optional; min 5
```

On Railway, set `BRRTZ_INDEX_SCHEDULER=true` (plus the existing Supabase
vars) and redeploy — collection starts ~2 minutes after boot.

Manual runs (ops-guarded like the other job routes: `Bearer
BUMPERS_JOB_TOKEN`, or localhost when no token is set):

```
# Run the next pair in the rotation
curl -X POST "http://127.0.0.1:5173/api/jobs/gear-index"

# Run one specific pair, computing but not storing
curl -X POST "http://127.0.0.1:5173/api/jobs/gear-index?model=roland-jupiter-8&region=japan&dryRun=true"

# Full sweep of all 27 pairs (testing/backfill; takes a while)
curl -X POST "http://127.0.0.1:5173/api/jobs/gear-index?all=true"
```

Public read endpoint (also how Phase 2 UI will consume it):

```
GET /api/gear-index?days=30
```

Returns the catalog (with launch-price `valueAnchors` for the long-arc
chart), the index regions, and the stored rows since the cutoff.

## Adding a model

Add an entry to `data/gear-index.json` — slug (match `data/gear-models.json`
when a gear page exists), `terms` (connector search queries), `categoryIntent`,
`includeTerms`/`excludeTerms`, price band, and a launch-price anchor. Then run
`npm test`: `test/gear-index.test.js` validates the catalog and the matching
rules. Watch for the separator-folding trap: exclude terms match anywhere in
the squashed title, so `cs-80v` would wrongly match "CS-80 Vintage" — prefer
brand words (`arturia`, `behringer`) over suffix fragments.
