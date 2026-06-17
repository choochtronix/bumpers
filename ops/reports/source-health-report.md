# Source Health Report

Date: 2026-06-17

## Commands

Local server:

```bash
npm run jobs:source-health:http
```

Specific beta region:

```bash
BRRTZ_QA_REGION=bay-area npm run jobs:source-health:http
BRRTZ_QA_REGION=los-angeles npm run jobs:source-health:http
```

Production:

```bash
BRRTZ_QA_BASE_URL=https://brrtz.com BUMPERS_JOB_TOKEN=<token> npm run jobs:source-health:http
```

Production region:

```bash
BRRTZ_QA_BASE_URL=https://brrtz.com BRRTZ_QA_REGION=bay-area BUMPERS_JOB_TOKEN=<token> npm run jobs:source-health:http
```

Golden searches:

```bash
npm run qa:golden-searches
```

Focused golden search:

```bash
BRRTZ_QA_REGION=bay-area BRRTZ_QA_QUERY=Waldorf npm run qa:golden-searches
```

## Current Notes

- Craigslist sources are parked for beta safety and should be manual deep-link assists, not automated checks.
- eBay source health is credential-gated. Local and production beta now report `ebayConfigured: true`.
- Reverb US and eBay US are the current safest live US sources.
- A source with `pending` status is a setup state, not a failure. This applies if eBay credentials are absent in a local environment.
- A source with `manual` status is a user-assisted deep link, not an automated ingestion check. This currently applies to Craigslist Assist.

## Summary

- Source-health CLI now supports `BRRTZ_QA_REGION`.
- Golden-search CLI now reports source states such as `pending`, `manual`, `parked`, and `error` beside raw counts.
- Treat real `error` statuses as beta blockers; treat `pending` and `manual` as expected setup/user-assist states.
- June 15 eBay beta checks passed locally and on production search smoke tests.
- June 17 eBay polish checks passed locally for targeted Bay Area and Los Angeles beta paths.
- Source health now maps shared US sources into both Bay Area and Los Angeles health checks.
- Production source-health jobs are protected by `BUMPERS_JOB_TOKEN`; do not run them from local shells without that token.

## Latest eBay Polish Snapshot - 2026-06-17

Local server on `http://127.0.0.1:5173`:

| Check | Result | Notes |
|---|---|---|
| Bay Area Synth Browser / All Synth Gear | Passed | 442 listings from Reverb US + eBay US. |
| Los Angeles Synth Browser / Synthesizers | Passed | 340 listings from Reverb US + eBay US. |
| Bay Area golden search / `synthesizer` / eBay US | Passed | 92 listings. |
| Los Angeles golden search / `Waldorf` / eBay US | Passed | 99 listings. |
| Bay Area source health / eBay US | Healthy | 92 listings, 561ms. |

## Latest Snapshot - 2026-06-15

Local patched server on `http://127.0.0.1:5199`:

| Region | Source Count | Summary | Listings |
|---|---:|---|---|
| Bay Area | 2 | healthy: 2 | Reverb US: 32, eBay US: 92 |
| Los Angeles | 2 | healthy: 2 | Reverb US: 32, eBay US: 92 |

Local existing server on `http://127.0.0.1:5173`:

| Region | Source Count | Summary | Notes |
|---|---:|---|---|
| Japan | 10 | healthy: 10 | Mercari, Yahoo Auctions, Yahoo Fleamarket, Rakuma, Digimart, Jimoty, OFFMALL, Five G, implant4, and Reverb Japan returned healthy checks. |

Golden search smoke tests:

| Target | Result | Notes |
|---|---|---|
| Local patched server | Passed | Japan, Bay Area, and Los Angeles golden searches passed. |
| Production `https://brrtz.com` eBay-only smoke | Passed | eBay US returned results across the golden query set. |

## Active Sources

| Source | Region | Status | Listings | Last Checked | Notes |
|---|---|---|---:|---|---|
| Mercari Japan | Japan | Healthy | 12 | 2026-06-15 | Browser-assisted connector; slower but useful. |
| Yahoo Auctions Japan | Japan | Healthy | 17 | 2026-06-15 | Core Japan auction source. |
| Yahoo Fleamarket | Japan | Healthy | 27 | 2026-06-15 | Japan marketplace source. |
| Rakuma | Japan | Healthy | 36 | 2026-06-15 | Thumbnail proxy support active. |
| Digimart | Japan | Healthy | 20 | 2026-06-15 | High-signal music gear source. |
| Jimoty | Japan | Healthy | 57 | 2026-06-15 | Local classifieds source; noisy but useful. |
| OFFMALL / Hard Off | Japan | Healthy | 30 | 2026-06-15 | Used gear network source. |
| Five G | Japan | Healthy | 11 | 2026-06-15 | Low-volume specialist shop. |
| implant4 | Japan | Healthy | 4 | 2026-06-15 | Low-volume specialist shop. |
| Reverb Japan | Japan | Healthy | 14 | 2026-06-15 | Reverb country filter for Japan. |
| Reverb US | Bay Area, Los Angeles | Healthy | 32 | 2026-06-15 | Active shared US beta source. |
| eBay US | Bay Area, Los Angeles | Healthy | 92 | 2026-06-15 | Active official Browse API source; default category `619`. |

## Broken or Degraded Sources

| Source | Problem | Suspected Cause | Priority | Next Action |
|---|---|---|---|---|

## New Candidate Sources

| Source | Region | Priority | Notes |
|---|---|---|---|

## Follow-up Tasks

1. Run `BRRTZ_QA_REGION=japan npm run jobs:source-health:http` before Japan-facing beta pushes.
2. Run `BRRTZ_QA_REGION=bay-area npm run jobs:source-health:http` before Bay Area-facing beta pushes.
3. Run `BRRTZ_QA_REGION=los-angeles npm run jobs:source-health:http` before Los Angeles-facing beta pushes.
4. Keep eBay golden searches in the beta smoke suite and watch for noisy false positives from broad eBay inventory.
5. Add the Railway `BUMPERS_JOB_TOKEN` locally only when a protected production source-health job needs to be run.
