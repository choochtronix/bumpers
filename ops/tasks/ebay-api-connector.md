# Task: eBay Browse API Connector

Status: beta-active
Owner: Codex + Craig
Target beta regions: Bay Area, Los Angeles, California

## Goal

Add eBay US as a reliable source for synth, drum machine, sampler, and pro-audio listings without increasing scrape risk or Craigslist-style blocking risk.

## Current State

- `ebay-us` exists in `src/sources/sourceRegistry.js`.
- `ebay-us` exists in the app source UI and region source lists.
- Server connector uses the eBay Browse API search endpoint.
- OAuth client-credentials flow is scaffolded.
- Connector is active locally and on Railway production when credentials are configured.
- June 15 beta check: Craig confirmed healthy eBay results in Bay Area and Los Angeles regions for broad and targeted searches.

## Required Credentials

Set these in local `.env.local` for development and Railway variables for production:

```text
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_MARKETPLACE_ID=EBAY_US
```

Optional category narrowing:

```text
EBAY_CATEGORY_IDS=
```

By default, Brrtz searches eBay category `619` (Musical Instruments & Gear). Multiple override IDs can be supplied with `EBAY_CATEGORY_IDS` as a comma-separated list.

## Loop Plan

### 1. Ingestion Engineer

Checklist:

- [x] Confirm eBay credentials are present via `/api/health` showing `ebayConfigured: true`.
- [x] Run one small search with `sources=ebay-us`.
- [x] Confirm returned fields: title, price, URL, image, condition, listing date, category path.
- [x] Confirm authentication token refreshes without user interaction.
- [x] Confirm source errors are isolated to the eBay pill and do not break other sources.

Acceptance:

- eBay returns real listings for `synthesizer`, `Roland Juno`, and `drum machine`.
- Empty or failed eBay results do not crash the search page.

### 2. Relevance Engineer

Checklist:

- [x] Run Gear Mode on and off for noisy terms.
- [x] Compare `Roland Juno 106` and `Roland Juno-106`.
- [x] Confirm broad searches such as `drum machine` return healthy eBay results.
- [x] Add default eBay category `619` (Musical Instruments & Gear) to improve signal.
- [ ] Continue collecting noisy-result examples from beta testers.

Acceptance:

- Gear Mode eBay results are mostly musical instruments/pro-audio.
- Category IDs improve signal without hiding obvious legit gear.

### 3. QA Release

Checklist:

- [ ] Run `npm run qa:golden-searches` against local Brrtz with eBay enabled.
- [x] Run targeted local eBay golden checks for Bay Area and Los Angeles.
- [x] Run targeted eBay source-health check with `BUMPERS_JOB_TOKEN`.
- [ ] Run full `npm run qa:golden-searches` against local Brrtz with eBay enabled.
- [ ] Run full `npm run jobs:source-health:http` with `BUMPERS_JOB_TOKEN`.
- [x] Spot-check card UI in card and list views.
- [x] Spot-check mobile source pill row.
- [ ] Confirm eBay source status in `ops/reports/source-health-report.md`.
- [x] Add eBay US to Bay Area / Los Angeles Synth Browser browse feeds.
- [x] Document eBay-backed US browse behavior in Synth Browser docs.

Acceptance:

- eBay can be left on for beta without noisy errors.
- Credentials are not committed.
- Production remains invite-only.

## Known Risks

- eBay inventory is broad and can be noisy without category narrowing.
- Search-locality is weaker than Craigslist and should be labeled as US/global unless a location strategy is added.
- Browse API quotas should be monitored once beta testers use it.

## Current Follow-up

- Keep credentials in `.env.local` and Railway Variables only.
- Watch beta feedback for eBay noise terms and false positives.
- Track Browse API quota once beta tester traffic increases.
- Consider a future location strategy if users expect eBay to be local rather than US/global.
- Continue tuning US browse seed terms as beta testers use Synth Browser.

## June 17 Polish Pass

- Bay Area Synth Browser now uses Reverb US and eBay US seed terms for `all` browse.
- Los Angeles Synth Browser now uses Reverb US and eBay US seed terms for category-specific browse.
- Local browse probe passed:
  - Bay Area / All Synth Gear: 442 listings from Reverb US + eBay US.
  - Los Angeles / Synthesizers: 340 listings from Reverb US + eBay US.
- Targeted local golden checks passed:
  - Bay Area / `synthesizer` / eBay US: 92 listings.
  - Los Angeles / `Waldorf` / eBay US: 99 listings.
- Targeted source-health check passed:
  - Bay Area / eBay US: healthy, 92 listings, 561ms.
