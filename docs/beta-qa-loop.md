# Brrtz Beta QA Loop

This checklist keeps the friend beta stable while Brrtz is changing quickly. Use it before a beta-facing push, after source connector changes, and after any UI change that touches search, sync, mobile layout, or listing cards.

## When To Run This

- Before pushing a beta-facing change to GitHub.
- After adding or changing a source connector.
- After changing Settings, account sync, saved searches, watched gear, or feedback.
- After changing mobile header, source pills, search controls, Gear Browser, Fresh Finds, listing cards, or list/card view.
- After Railway deploys a meaningful change.

## Agent-Run Checks

These can be run by Codex without Craig input when the local server is running.

```bash
npm run qa:golden-searches
BRRTZ_QA_REGION=bay-area BRRTZ_QA_SOURCES=reverb-us,ebay-us npm run jobs:source-health:http
BRRTZ_QA_REGION=los-angeles BRRTZ_QA_SOURCES=reverb-us,ebay-us npm run jobs:source-health:http
```

Run Japan source health before Japan-facing search changes:

```bash
BRRTZ_QA_REGION=japan npm run jobs:source-health:http
```

Run production checks only when the Railway environment is intentionally being verified:

```bash
BRRTZ_QA_BASE_URL=https://brrtz.com BUMPERS_JOB_TOKEN=<token> npm run jobs:source-health:http
BRRTZ_QA_BASE_URL=https://brrtz.com npm run qa:golden-searches
```

Do not print or commit `BUMPERS_JOB_TOKEN`.

## Craig-Run Checks

These need real browser/device confirmation.

### Cloud Sync

Use Chrome as Browser A and Safari as Browser B.

1. Sign in to Brrtz in both browsers with the same invited email.
2. In Browser A, save a new search.
3. Wait 2-3 seconds, then open Settings -> Account in Browser B and click `Sync now`.
4. Confirm Browser B shows the new saved search.
5. In Browser A, watch one listing.
6. Sync Browser B and confirm the same heart state appears.
7. In Browser A, mark one listing `This is gear` or `This is noise`.
8. Sync Browser B and confirm the search result behavior still feels consistent.

Pass condition: saved searches, watched gear, and feedback survive reload and appear in the second browser.

### Mobile Header

Check on an iPhone-sized viewport or phone.

1. Open the homepage.
2. Confirm logo, region badge, wave, Saved, Watching, theme, and Settings do not overlap.
3. Type a search term and submit.
4. Scroll down and confirm the sticky mobile search affordance does not cover important controls.
5. Open Settings and confirm tabs, close button, and bottom actions remain reachable.

Pass condition: no control overlap, no trapped modal, and search remains easy to reach.

### List/Card View

Check desktop and mobile.

1. Run a search with enough results, such as `Waldorf`, `drum machine`, or `Mackie Mixer`.
2. Toggle card grid -> list view.
3. Confirm thumbnail size is readable and row height still feels compact.
4. Toggle list view -> card grid.
5. Open one listing from each view.

Pass condition: both views are usable, source badges remain legible, and listing links work.

### Gear Browser

1. Open the homepage.
2. Confirm `Gear Browser` appears before `Fresh Finds`.
3. Change category from the Browse dropdown.
4. Confirm the section does not disappear.
5. Click `See all`.
6. On the Gear Browser page, toggle card/list view and change category again.

Pass condition: newest-first browsing feels stable and the large browse page has enough density for exploration.

## Pass / Fail Notes

When reporting a failure, capture:

- Browser and device.
- Region.
- Search term.
- Source pill counts.
- Screenshot if visual.
- Listing URL if result quality is the issue.
- Console error only if easy to access.

## Cloud Ledger Reminder

Do not build the cloud listing ledger yet unless beta testers show that cross-device newness confusion is hurting the product. Current beta priority is validating the UX and source quality with the local listing ledger plus cloud-synced user state.

Move Cloud Ledger forward when:

- Multiple testers use Brrtz across two or more devices daily.
- `New` labels feel inconsistent across devices.
- Fresh Finds needs account-aware newness instead of local browser newness.
- We need shared server-side listing observation history for notifications.
