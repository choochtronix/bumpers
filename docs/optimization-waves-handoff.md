# Optimization Waves — Handoff for Codex

Last updated: 2026-08-08

This briefs the next agent (Codex or otherwise) on a three-wave SEO/search
optimization pass done by Claude on branch `wave1-quickwins`. Read this before
touching gear pages, the sitemap, `llms.txt`, or the region-default logic.

## Status

**Merged to `main` and deployed** to Railway → brrtz.com on 2026-08-08. The work
below (Codex commit `1ab1017` + Claude's 9 commits) is now live. `wave1-quickwins`
and `main` are at the same commit; branch future work from `main`.

## TL;DR

- Three waves of optimization by Claude, based on Codex commit `1ab1017`, now
  merged to `main` and live. `main` auto-deploys to Railway → brrtz.com.
- Gear model pages are now **generated from data**, not hand-authored. Do not
  hand-edit `gear/*.html`, `gear/index.html`, or `sitemap.xml` — edit
  `data/gear-models.json` and run the generator.
- Craigslist stays **Assist-only** (deliberate). US/UK visitors now get a
  region-appropriate default (no more yen-by-default) on first visit.

## Commits (newest first)

| Commit | Summary |
| --- | --- |
| `f917ca8` | Retire legacy `bumpers_logo.svg` → `brrtz_logo.svg` (identical file) |
| `14e3910` | docs: add this optimization-waves handoff |
| `947f4b6` | Wave 3 (A4): FAQ schema on About + refresh gear links |
| `d38db4f` | Wave 3 (A5): first-visit region auto-detection |
| `95c21bb` | Wave 3: UK region page + second gear batch (13 → 19 models) |
| `c1f2ed5` | Wave 3 (A1): data-driven gear pages, expand catalog 3 → 13 |
| `f19a8f4` | Wave 2: honest per-source health reporting |
| `7b37660` | Wave 1: refresh naming to Brrtz and fix hero rail clipping |

## Wave 1 — foundation

- `CLAUDE.md`, `README.md`: updated stale "Bumpers / Japan-only" copy to the
  current Brrtz multi-region reality. **Kept** the intentional `bumpers.*`
  storage keys and `BUMPERS_*` env vars.
- `index.html`: hero rail (`#searchContextRail`) reworded to name multi-source
  search + Clean Gear + Fresh Finds.
- `styles.css`: made the hero rail a single-line ellipsis slot (was clipping);
  hardcoded rose rgba on the source-filter error state → `--rose` token.

## Wave 2 — per-source health honesty

- `app.js` (`createSourceBreakdown`): a failed source now reads "unavailable" /
  "(partial)" / "parked" instead of "<source> 0" (which was indistinguishable
  from a genuine zero-result source).
- Note: query/synonym expansion (`selectSearchDiscoveryTerms`) and per-source
  progressive rendering (one search group per source) were already implemented —
  no change needed.

## Wave 3 — SEO build-out

### A1 — gear model pages (3 → 19), data-driven

- **`data/gear-models.json`** — all editorial content per model.
- **`scripts/build-gear-pages.mjs`** — the generator. It OWNS and regenerates:
  `gear/<slug>.html`, `gear/index.html`, and `sitemap.xml`.
- The 3 original pages were ported into the data file byte-for-byte
  (verified identical), then 16 models were added.

**To add or edit a gear model (IMPORTANT):**

1. Edit `data/gear-models.json` (see any entry for the shape; write real
   editorial content — thin/boilerplate pages hurt SEO).
2. Run `node scripts/build-gear-pages.mjs` (regenerates HTML + sitemap and
   prints the sync blocks).
3. Paste the printed blocks into the two hand-maintained files:
   - `server.js` `llms.txt` model-page list (under "Gear model pages").
   - `scripts/aeo-check.mjs` — `requiredSitemapUrls` and the `gearPages` array.
4. Verify: `node scripts/build-gear-pages.mjs --check` (must be clean).

Do NOT hand-edit the generated files; the generator will overwrite them.

### UK region page

- Added `regions/uk.html` (the live UK region had no landing page); wired into
  `regions/index.html`, `sitemap.xml` (via the generator's `STATIC_SITEMAP`),
  and `aeo-check.mjs`.

### A2 — deliberately skipped

- A full region × category matrix (30 pages) was declined: templated across
  combos it risks thin doorway pages. We invested in more gear pages instead.

### A5 — first-visit region auto-detection

- `app.js` `loadSettings()` now calls `detectDefaultRegionId()` **only when
  nothing is stored** (first visit). Returning users' stored region and explicit
  URL `region` params always win.
- `detectDefaultRegionId()` is pure client-side (no geo-IP, no permission
  prompt): `ja`/Tokyo → `japan`; `en-GB`/London → `uk`; `en-US`/`en-CA` and
  `America/*` → nearest US region (Pacific → `bay-area`, else `east-coast`);
  anything unknown → the configured default. Verified in-browser: `en-US` first
  visit → `east-coast` + USD; a stored Japan choice is preserved.
- This intentionally overrides the ROADMAP's "Japan default for beta" for
  first-time US/UK visitors only. If reverting, remove the first-visit branch in
  `loadSettings()` — do not remove `detectDefaultRegionId()` callers elsewhere
  (there are none).

### A4 — About FAQ

- `about.html`: added a visible FAQ section + matching `FAQPage` JSON-LD (answer
  text must stay identical to the visible copy per Google's rules). Refreshed the
  "Model-aware searches" links.

## Craigslist (context)

- Stays parked / Assist-only (`BRRTZ_CRAIGSLIST_MODE=parked`). Tested facts:
  Craigslist blocks by IP (direct fetch 403s, RSS too, even via the Jina
  reader); listing URLs also changed to `/view/d/<slug>/<token>`, so the
  existing `/(\d+)\.html` parsers in `server.js` are stale and would need a
  rewrite before any live mode. Do not enable live mode without a new decision.

## Validation on this Windows/WSL setup

`npm` chokes on the UNC working directory, so run scripts via `node` directly:

```sh
node --test test/*.test.js          # 32 tests
node scripts/design-system-check.mjs
node scripts/build-gear-pages.mjs --check
# aeo:check needs a running server; 5173 is EACCES from Windows node (WSL proxy
# owns it), so use another port:
HOST=127.0.0.1 PORT=5199 node server.js &
node scripts/aeo-check.mjs http://127.0.0.1:5199
```

From WSL, the normal `npm run ...` and `git push` work as documented.

## Follow-ups / known debt

- (Resolved) The legacy `bumpers_logo.svg` was retired: the CSS mask references
  in `styles.css` and `aeo.css` now point to the byte-identical `brrtz_logo.svg`,
  and the duplicate file was deleted.
- `llms.txt` (in `server.js`) and the `aeo-check.mjs` arrays are hand-synced
  when gear models change — the generator prints exactly what to paste.
- The untracked junk files in the working tree (garbled names like
  `div:first-child`) are NOT part of this work — never `git add -A`.
