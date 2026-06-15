# Source Health Report

Date:

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
- eBay source health is credential-gated. It is skipped until `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` are configured.
- Reverb US is the current safest live US source while eBay is awaiting credentials.
- A source with `pending` status is a setup state, not a failure. This currently applies to eBay before credentials are present.
- A source with `manual` status is a user-assisted deep link, not an automated ingestion check. This currently applies to Craigslist Assist.

## Summary

- Source-health CLI now supports `BRRTZ_QA_REGION`.
- Golden-search CLI now reports source states such as `pending`, `manual`, `parked`, and `error` beside raw counts.
- Treat real `error` statuses as beta blockers; treat `pending` and `manual` as expected setup/user-assist states.

## Active Sources

| Source | Region | Status | Listings | Last Checked | Notes |
|---|---|---|---:|---|---|

## Broken or Degraded Sources

| Source | Problem | Suspected Cause | Priority | Next Action |
|---|---|---|---|---|

## New Candidate Sources

| Source | Region | Priority | Notes |
|---|---|---|---|

## Follow-up Tasks

1. Run `BRRTZ_QA_REGION=japan npm run jobs:source-health:http` before Japan-facing beta pushes.
2. Run `BRRTZ_QA_REGION=bay-area npm run jobs:source-health:http` before Bay Area-facing beta pushes.
3. After eBay approval, add credentials locally and confirm eBay moves from `pending` to live results in golden searches.
