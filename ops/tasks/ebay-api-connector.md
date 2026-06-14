# Task: eBay Browse API Connector

Status: credential-ready scaffold
Owner: Codex + Craig
Target beta regions: Bay Area, Los Angeles, California

## Goal

Add eBay US as a reliable source for synth, drum machine, sampler, and pro-audio listings without increasing scrape risk or Craigslist-style blocking risk.

## Current State

- `ebay-us` exists in `src/sources/sourceRegistry.js`.
- `ebay-us` exists in the app source UI and region source lists.
- Server connector uses the eBay Browse API search endpoint.
- OAuth client-credentials flow is scaffolded.
- Connector remains inactive until credentials are configured.

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

Leave `EBAY_CATEGORY_IDS` blank until category IDs are verified. Multiple IDs should be comma-separated.

## Loop Plan

### 1. Ingestion Engineer

Checklist:

- [ ] Confirm eBay credentials are present via `/api/health` showing `ebayConfigured: true`.
- [ ] Run one small search with `sources=ebay-us`.
- [ ] Confirm returned fields: title, price, URL, image, condition, listing date, category path.
- [ ] Confirm authentication token refreshes without user interaction.
- [ ] Confirm source errors are isolated to the eBay pill and do not break other sources.

Acceptance:

- eBay returns real listings for `synthesizer`, `Roland Juno`, and `drum machine`.
- Empty or failed eBay results do not crash the search page.

### 2. Relevance Engineer

Checklist:

- [ ] Run Gear Mode on and off for noisy terms.
- [ ] Compare `Roland Juno 106` and `Roland Juno-106`.
- [ ] Confirm irrelevant accessories/manuals are suppressed in Gear Mode.
- [ ] Confirm “whole phrase plus variant” matching behaves like the other sources.
- [ ] If available, add verified eBay music/synth category IDs to `EBAY_CATEGORY_IDS`.

Acceptance:

- Gear Mode eBay results are mostly musical instruments/pro-audio.
- Category IDs improve signal without hiding obvious legit gear.

### 3. QA Release

Checklist:

- [ ] Run `npm run qa:golden-searches` against local Brrtz with eBay enabled.
- [ ] Run `npm run jobs:source-health:http` with `BUMPERS_JOB_TOKEN`.
- [ ] Spot-check card UI in card and list views.
- [ ] Spot-check mobile source pill row.
- [ ] Confirm eBay source status in `ops/reports/source-health-report.md`.

Acceptance:

- eBay can be left on for beta without noisy errors.
- Credentials are not committed.
- Production remains invite-only.

## Known Risks

- eBay inventory is broad and can be noisy without category narrowing.
- Search-locality is weaker than Craigslist and should be labeled as US/global unless a location strategy is added.
- Browse API quotas should be monitored once beta testers use it.

## Next Human Input Needed

Craig provides:

- eBay Client ID.
- eBay Client Secret.
- Confirmation that the eBay developer app is approved for Browse API production use.

Codex then:

- Tests local eBay live search.
- Updates category and relevance tuning based on real results.
- Adds production variables in Railway checklist only, not in code.
