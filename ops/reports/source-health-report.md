# Source Health Report

Date:

## Commands

Local server:

```bash
npm run jobs:source-health:http
```

Production:

```bash
BRRTZ_QA_BASE_URL=https://brrtz.com BUMPERS_JOB_TOKEN=<token> npm run jobs:source-health:http
```

Golden searches:

```bash
npm run qa:golden-searches
```

## Current Notes

- Craigslist sources are parked for beta safety and should be manual deep-link assists, not automated checks.
- eBay source health is credential-gated. It is skipped until `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` are configured.
- Reverb US is the current safest live US source while eBay is awaiting credentials.

## Summary

-

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

1.
2.
3.
