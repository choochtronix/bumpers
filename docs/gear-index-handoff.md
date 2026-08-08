# Gear Index (Going Rate) — Handoff for Codex

Last updated: 2026-08-08

This briefs the next agent on **Phase 1 of the Gear Index**, built by Claude and
merged to `main`. Read this before touching `src/gear-index/`, the
`/api/gear-index*` routes, or anything that reads `gear_index_daily`.

The Gear Index is the data layer behind "Going Rate": a daily asking-price
index for landmark instruments, tracked per region, intended to feel like a
calm stock ticker for vintage synths. Phase 1 is **collection only — there is
no UI yet.** That is deliberate (see "Why no UI yet").

## Status

**Merged to `main` and deployed** to Railway → brrtz.com on 2026-08-08.
`main` is at `e40c0ed`. The Supabase table exists and the full loop is verified
in production.

**One step is still outstanding and blocks all data collection:**
`BRRTZ_INDEX_SCHEDULER=true` must be set in Railway's service variables. Until
then `/api/gear-index` reports `"scheduler": { "enabled": false }` and **no rows
accumulate**. Check this before assuming the index is broken — an empty `rows`
array most likely means the variable was never set.

## TL;DR

- New subsystem under `src/gear-index/`. Pure logic is separated from I/O:
  `gearIndexCore.js` has no network, storage, or scheduling.
- Stores **aggregate statistics only** (median, quartiles, counts) — never
  listing snapshots. This is a legal-posture requirement, not a preference.
- One snapshot per `model × region` pair every 45 minutes (staggered, not a
  burst sweep). 9 models × 3 regions = 27 pairs ≈ a 20-hour full cycle.
- **Deploying does not disrupt collection.** The rotation picks the stalest
  pair from stored history rather than an in-memory cursor, so redeploys are
  safe — ship UI work as often as you like.
- Reuses the existing search stack: it calls `/api/search` on localhost with
  the model's terms and the region's source list, then filters and aggregates.
- Two hard-won deploy/infra gotchas are documented below — read them before
  adding any new table or any runtime-read data file.

## Commits (newest first)

| Commit | Summary |
| --- | --- |
| `e40c0ed` | fix: ship gear index catalog in the production image (`data/` → `src/`) |
| `777100a` | fix: grant `service_role` table privileges for `gear_index_daily` |
| `f32957c` | feat: Gear Index phase 1 — daily going-rate collection |

## Files

| Path | Role |
| --- | --- |
| `src/gear-index/gearIndexCore.js` | Pure logic: region defs, model matching, IQR-trimmed stats, row building, catalog validation. No I/O. |
| `src/gear-index/catalog.json` | The tracked-model catalog (editorial + match rules). **Not** in `data/` — see gotcha 2. |
| `server.js` | Routes, scheduler, Supabase/file storage, FX fetching. Search for "Gear Index —". |
| `test/gear-index.test.js` | 11 tests covering catalog validity, matching, stats, row building. |
| `docs/sql/gear-index-schema.sql` | `gear_index_daily` table + grants + RLS policy. Idempotent. |
| `docs/gear-index.md` | Methodology and ops runbook (the "what does this number mean" doc). |

## What the number is

An **asking-price median**, not a sold-price median. Say so anywhere it is
displayed — the trust of this feature depends on not overclaiming.

Filtering pipeline, in order:

1. Drop listings with no usable price. Missing `currency` falls back to the
   region currency (several connectors omit it despite the documented common
   shape — do not "fix" this by dropping those listings).
2. Title must match the model's `includeTerms` and none of its `excludeTerms`.
   Matching normalizes via NFKC and strips separators, so `TR-808`, `TR808`,
   and `ＴＲ－８０８` are equivalent.
3. Gear Scanner curation hard-excludes apply (`gear-scanner-curation.js`).
4. A per-model USD price band (`priceFloorUsd`/`priceCeilingUsd`) drops
   accessories, manuals, sample packs, and decimal-slip prices.

Then: trim prices outside the 1.5× IQR fence, and compute median/p25/p75 on
what remains. Below `minSample` matched listings (default 3, per-model
overridable via a `minSample` field), the row records counts but publishes
**null prices** — thin days must show as gaps, never as a noisy number.

## Index regions

Defined in `gearIndexCore.js` as `japan`, `us`, `uk` — deliberately coarser
than search regions. Reverb US and eBay US are national feeds shared by every
US search region, so per-city medians would mostly re-measure the same
inventory. The `us` index region searches through the `bay-area` region config
plus the East Coast shop connectors.

Excluded from index sweeps on purpose: manual/Assist sources (Sweetwater,
Guitar Center, ProAudioStar), parked Craigslist, and **Mercari** (Playwright
browser automation is too slow and flaky for a scheduled job).

Each row stores the native-currency median plus a USD-normalized `usd_median`
and the `fx_rate_usd` used, so region comparison works without FX drift
wobbling the native-currency history. FX comes from frankfurter.dev (ECB) with
open.er-api.com as fallback, cached 12 hours.

## Adding or editing a tracked model

1. Edit `src/gear-index/catalog.json`. Match the `slug` to `data/gear-models.json`
   when a gear page exists for that model.
2. Run `npm test` — `test/gear-index.test.js` validates catalog shape and the
   matching rules.
3. Add a matching/exclusion test case for anything non-obvious about the model.

**Traps when writing match rules** (both cost a debug cycle already):

- Exclude terms match the *separator-stripped* title, so `cs-80v` wrongly
  matches "CS-80 Vintage". Prefer brand words (`arturia`, `behringer`) over
  suffix fragments.
- Search terms are homonym-prone. Bare `jupiter-8` on Yahoo Auctions returns
  overwhelmingly Soviet **camera lenses**; the term had to become
  `roland jupiter-8` plus lens excludes (`sonnar`, `kiev`, `leica`, `50mm`,
  `レンズ`). Always dry-run a new model against live data before trusting it.

## Ops

Environment (see `.env.example`):

```
BRRTZ_INDEX_SCHEDULER=true        # off by default; required for collection
BRRTZ_INDEX_INTERVAL_MINUTES=45   # optional, min 5
```

Routes:

- `GET|POST /api/jobs/gear-index` — ops-guarded (Bearer `BUMPERS_JOB_TOKEN`, or
  localhost when no token is set). Query params: `model` + `region` (both or
  neither), `dryRun=true` (compute without storing), `all=true` (sweep every
  pair). With no params it runs the next pair in the rotation.
- `GET /api/gear-index?days=N` — public read. Returns catalog (with
  `valueAnchors`), regions, rows since the cutoff, and scheduler status.

```sh
# dry-run a single pair against live sources
curl -X POST "http://127.0.0.1:5173/api/jobs/gear-index?model=roland-tr-909&region=japan&dryRun=true"
```

Storage: Supabase `public.gear_index_daily` in production; file fallback at
`data/gear-index-daily.json` (gitignored) when Supabase is unconfigured.

**Do not run `all=true` on a schedule.** The stagger is a deliberate courtesy
to scraped sources, agreed with the product owner. A full sweep is for manual
testing and backfill only.

## Two gotchas that bit during deployment

**1. Supabase RLS ≠ table privileges.** An RLS policy grants *row* access; the
role still needs a `GRANT` for *table* access. Without it, service-role writes
fail with `42501 permission denied for table gear_index_daily`. The grants are
now in `docs/sql/gear-index-schema.sql` — apply the same pattern to any new
table.

**2. `.dockerignore` excludes `data/`.** Anything the *server reads at runtime*
must not live there, or it 500s in production with `ENOENT` while working fine
locally. This is why the catalog is at `src/gear-index/catalog.json`.
`data/gear-models.json` is fine where it is only because gear pages are
generated at build time and the committed HTML is what ships.

## Validation

```sh
npm test                    # 43 tests total, 11 of them gear-index
npm run design:check
```

On this Windows/WSL setup, run git and npm from inside WSL
(`wsl.exe -- bash -lc "cd ~/code/brrtz && ..."`) — Windows-side git can't
authenticate the SSH remote and npm chokes on the UNC path. In PowerShell,
`curl` is aliased to `Invoke-WebRequest`; use `curl.exe` or `Invoke-RestMethod`.

Live results confirmed during build (2026-08-08), useful as sanity baselines:

| Model / region | n | Median |
| --- | --- | --- |
| `roland-tr-909` / japan | 24 | ¥889,000 (~$5,615), 5 sources |
| `roland-tr-808` / japan | 10 | ¥448,000 (~$2,829) |
| `roland-tr-808` / us | 10 | $7,500 |
| `roland-jupiter-8` / japan | 3 | ¥3,964,975 (~$25,041), 91 lens listings rejected |

## Why no UI yet

The index's value is its history, and history only accrues in real time.
Launching a chart with a flat, one-point line would undermine the "trusted and
up to date" feel the feature exists to create. The plan is to let collection
run ~30 days, then build Phase 2 against real data.

## Phase 2 — planned, not started

Consume `GET /api/gear-index`. The `valueAnchors` in each catalog entry
(launch list price, e.g. Jupiter-8 1981 → $5,295) are there to draw the long
historical arc; the dense daily line begins when collection started. Label
anchors as estimates in the UI.

Three surfaces, one shared component:

1. **Gear landing pages first** (`gear/*.html`) — highest leverage: turns SEO
   pages into bookmarkable "what is this worth" pages and answers a question
   answer-engines get asked constantly.
2. **A `/index` board page** — all tracked models, sortable by 30-day change.
3. **Deal chips in search results** — "going rate in Japan: ¥8.6M; this listing
   is 12% under". This is what makes the index actionable, and it feeds
   Watched gear and alert-mode saved searches in Phase 3.

Design direction agreed with the product owner: **calm, not a stock-market
panic display.** No red/green up/down coloring; neutral secondary text with
small trend icons, region series in categorical blue/orange, soft filled area
under the line (the "waveform meter" feel). Always show sample count (`n=11`)
and the last-updated timestamp next to any figure — the honesty *is* the
feature.

## Known debt / follow-ups

- **CS-80 and OB-Xa will frequently fall below the sample floor** — they are
  genuinely rare. Expect gaps. When Phase 2 arrives, consider a 7-day rolling
  median for low-volume models rather than daily. Decide with real data.
- **Minimoog mixes vintage and Moog reissue units** (Behringer clones are
  excluded). ARP 2600 excludes Korg/Behringer reissues by brand name, but a
  bare "ARP 2600M" title without "Korg" would slip through.
- A sold-price source (eBay marketplace insights, Yahoo closed auctions) would
  upgrade this from asking-price to true market value. Explicitly deferred, not
  rejected.
- The scheduler is in-process (`setTimeout`, unref'd). Restart safety is
  handled (rotation reads stored history, so redeploys don't reset coverage),
  but if the service ever scales to **multiple instances**, each one would run
  its own rotation and multiply source load. Move to an external cron hitting
  `/api/jobs/gear-index` at that point.
- Untracked junk files in the working tree (garbled names like `div:first-child`)
  are not part of this work — never `git add -A`.
