# Brrtz Code And Systems Audit

Date: 2026-09-16
Revision reviewed: `d9bd48a` on `main`.
Scope: application and server code, cloud serialization and sync, alerts,
marketplace connectors, Gear Index, public HTTP behavior, dependencies,
responsive UI, tests, deployment configuration, and operating documentation.

This was an audit, not a production change. No real account was modified, no
email was sent, no database mutation/job was run, and no secret-file contents
were retrieved. Application files, dependencies, and deployment configuration
were left unchanged. The only repository addition is this report; screenshots
are ignored local QA artifacts.

## Executive Assessment

Brrtz's visible UI and existing test suite are in better shape than its cloud
data contracts and operational safeguards. All existing deterministic checks
passed, but isolated reproductions exposed failures outside their coverage.

The previous saved-search fix improves single-browser behavior but does not
solve deletion across stale devices. It also introduces expensive synchronous
count recomputation for realistic saved-search collections.

Fix security and data integrity before another substantial feature pass. Do
not treat a passing health endpoint or the existing tests as proof of correct
sync, alert delivery, or source health.

## Findings

### A01 - P1: Repository Files Are Served As Public Assets

Location: `server.js:5114`, particularly the unrestricted read at line 5129.

`serveStatic` checks that a path stays inside the repository, but does not
restrict which files inside that repository may be served. Gitignore and
Docker exclusions are not HTTP access controls.

Header-only checks returned HTTP 200 locally for `.env.local`, `.git/config`,
the local saved-search data file, and the curation inbox. No response bodies
were retrieved for those paths. The server is reachable through the existing
Windows-to-WSL proxy and binds to `0.0.0.0`, so this is not merely a file on an
isolated loopback process. Actual external exposure depends on network/firewall
access; this audit did not establish public Internet reachability of the PC.

Production returned 404 for the tested secret/runtime paths, but 200 for
`server.js`. Production secret disclosure was NOT demonstrated. The same
handler could expose runtime files if they exist there later.

Recommended fix: use a public asset allowlist or dedicated public directory;
deny dotfiles, source/configuration files, local data, operational data, and
dependency internals regardless of extension. Add HTTP integration tests with
synthetic secret/runtime fixtures. Until fixed, avoid sharing the development
server with untrusted networks. Review access logs before deciding whether any
credential rotation is warranted; no evidence of credential theft was found.

### A02 - P1: Account Switching Can Upload Another Account's Saved Searches

Locations: `app.js:6550`, `app.js:6749`, `app.js:7163`, `app.js:7282`.

Sign-out removes the authentication session but leaves the shared
`bumpers.profiles` collection in place. A later account sync merges that list
and `prepareLocalProfileForCloud` rewrites every record's user ID to the
currently signed-in user.

Isolated browser reproduction: create one search owned by fixture account A,
sign out, switch to fixture account B, and intercept the outbound sync payload.
One A record remained after sign-out and was uploaded with B's user ID. All
network/cloud responses in this reproduction were mocked.

Recommended fix: namespace account data, scan indexes, deletion tombstones,
and sync metadata by owner. Offer an explicit guest-data import rather than
silently adopting another account's records. Guard in-flight cloud responses
and uploads with the initiating account/session revision. Retain previous
account data safely, without exposing it as the next user's active collection.

### A03 - P1: A Failed Cloud Save Can Erase All Saved Searches

Location: `server.js:1782`, DELETE at line 1791 followed by POST at line 1802.

The server deletes all of a user's rows before inserting the replacement
collection, using two independent Supabase requests. An insert error, outage,
process interruption, or conflicting request can leave an empty collection.

Isolated server-function reproduction: allow DELETE to succeed, fail POST,
and inspect a fake database. The operation fails with zero rows remaining.
No real database was used.

Recommended fix: transactional mutation through a database function, or
versioned per-record operations with an atomic commit boundary. Validate the
payload before mutation. Test a failed insert, overlapping saves, and a
simultaneous read. A backup/restore rehearsal should accompany this change.

### A04 - P1: Stale Browsers Resurrect Deleted Searches

Locations: `app.js:7069`, `app.js:7112`, `app.js:7441`, `server.js:1817`.

Deletion tombstones are browser-local. Cloud reads return only undeleted rows,
and a pull is a merge rather than an authoritative deletion reconciliation.
An empty cloud result explicitly preserves local records. The next sync sends
those old records back to the server.

Reproduction: browser B retains one old saved search while mocked cloud state
is empty after deletion from browser A. Calling `reconcileCloudSavedSearches`
uploads that search again. This remains reproducible on `d9bd48a` despite the
recent single-browser deletion fixes.

Recommended fix: durable server-side tombstones and revision-aware updates,
with a rule that an old client update cannot undo a newer deletion. Do not
interpret absence as deletion for unsynced guest saves. Cover two devices,
offline edits, refresh, sign-in, delayed responses, and explicit recreation.

### A05 - P1: Saved-Search Counts Block The Main Thread

Locations: `app.js:7659`, `app.js:7671`, `app.js:13045`, `app.js:13841`.

Repository `list()` recomputes unread counts by reclassifying all matching
listings for every saved search. It is used repeatedly during rendering,
discovery, background scans, and card acknowledgement. Each call creates new
filter caches, so unchanged listings are repeatedly scored.

Synthetic benchmark in isolated system Chrome, with 30 saved searches and 250
matches per search (250 shared ledger listings, Gear Mode enabled):

| Operation | Observed Time |
| --- | --- |
| Five consecutive `loadProfiles()` calls | 3048, 2996, 2980, 2962, 3037 ms |
| `renderSavedSearches()` | 5930 ms |

These are synchronous main-thread durations, not source/network delays. The
fixture is intentionally larger than the existing one-search regression test,
but comparable to a heavy beta user's saved collection. This is a regression
introduced by the latest count recalculation approach, not evidence of a slow
marketplace.

Recommended fix: keep repository reads cheap; memoize derived counts by scan,
ledger/seen/feedback revision, gear settings, and expiry. Recompute affected
searches incrementally, share classification caches, and batch UI updates.
Add a realistic dataset performance budget before another saved-search push.

### A06 - P1: Watchlist Restoration Loses Currency

Locations: `app.js:12338`, `app.js:12015`, `app.js:10167`, `app.js:13872`.

`createListingFromLedgerEntry` omits `currency` and `region`, even when present
in the stored entry. The card formatter then defaults to the active region's
currency. Global watchlists therefore display incorrect prices after changing
regions.

Reproduction: restore a Japanese listing priced at JPY 155,000 while the active
region is Bay Area and display currency is USD, at JPY 155 per USD. Expected
display: `$1,000`. Actual display: `$155,000`.

Recommended fix: preserve the fields during reconstruction, repair older
entries conservatively from source identity, and test mixed-currency watchlists
after refresh and cloud sync.

### A07 - P1: Cloud Saved-Search Round Trips Lose Region And Category

Locations: `server.js:2017`, `server.js:2041`, `app.js:13272`.

Neither server row conversion preserves `regionId` or `categoryIntent`.
Hydration guesses a region from sources and defaults the category. The same US
sources belong to multiple regions, so that guess is ambiguous.

Reproduction: serialize and restore a Los Angeles effects-pedals search using
Reverb US and eBay US. The server round trip returns neither field; browser
hydration turns it into Bay Area / synthesizers.

Recommended fix: add/migrate explicit database fields, update both conversion
directions, and bump/migrate the saved-search schema as required by the repo
contract. Test every region and non-default category through actual server
serialization, not just mocked client payloads.

### A08 - P1: Default Alert Job Invocation Processes Zero Searches

Location: `server.js:771`.

`Number(url.searchParams.get("limit"))` converts a missing parameter to zero.
Zero is accepted, overriding `BRRTZ_ALERT_SEARCH_LIMIT`. The documented default
job URL therefore selects an empty batch.

Isolated route reproduction with two eligible fixture searches: omit `limit`
and the job reports eligible=2, processed=0. Add `limit=2` and processed=2.
No live alert job or email was invoked. Whether the deployed external scheduler
passes an explicit limit was not verified.

Recommended fix: distinguish absent from explicit zero, validate bounds, and
test the documented URL plus configured fallback. Verify the actual scheduler
invocation with a dry run before authorizing any delivery.

### A09 - P2: Alert Delivery Is Not Failure-Isolated Or Cadence-Aware

Locations: `server.js:788`, `server.js:798`, `server.js:817`, `server.js:896`.

Events for sent emails are persisted only after the entire batch finishes. If
a later search fails, earlier successful sends have no durable dedupe event.
A subsequent run can send them again. Concurrent job runs have a similar gap.

Isolated reproduction: first fake send succeeds, second profile throws; one
simulated email has been sent, but zero dedupe events are persisted.

The job also reads all alert-enabled searches, sorts by edit time, and slices
the first batch without considering `immediate`/`hourly`/`daily` due times or
rotating beyond the first configured limit. The event read uses a fixed limit
without pagination. These need integration coverage as the beta grows.

Recommended fix: per-search error isolation, durable claim/outbox plus delivery
idempotency, due-time scheduling and fair batches, and scoped/paginated event
lookups. Keep client unread badges distinct from email delivery state.

### A10 - P1: Expensive Public Routes Lack Shared Resource Controls

Locations: `server.js:421`, `server.js:697`, `server.js:2116`,
`server.js:3111`; client search fetch at `app.js:10040`.

MCP has a rate limiter, but direct search/browse endpoints do not share it.
Public searches can fan out across sources and create Mercari browser pages
without a global/per-source concurrency ceiling. Most upstream fetches have
no explicit deadline, and abandoning a frontend search does not cancel the
server work. Public noise feedback also writes a file without authentication
or a route-specific limiter.

This was verified by code inspection, not a stress test. The earlier security
baseline already records these gaps; they remain open. Public search may be
intentional, but unrestricted resource use need not be.

Recommended fix: bounded query schemas, per-client limits, global and
per-source queues, deadlines/cancellation, identical-request coalescing,
`Retry-After`, and bounded feedback submissions. Coordinate rate budgets with
the new automatic saved-search refresh so legitimate users are not locked out.

### A11 - P2: Reverb Is Currently Unavailable Across Tested Regions

Location: `server.js:3575`.

Local golden tests failed for Japan Waldorf, Bay Area synthesizer, and Los
Angeles Waldorf because Reverb returned 403. Other sources still returned
results, so the test prints a result-count PASS before reporting the source
failure and exiting nonzero. A UK Moog check also returned Reverb 403.

A production Japan/Waldorf search reproduced the 403, so this is not solely a
local PC/IP symptom. Production US and UK searches were not separately tested.
The precise upstream access-policy cause is not established by a 403 alone.

Recommended fix: verify the approved Reverb API integration and access with
the provider, preserve the honest unavailable indicator, add a short failure
backoff/circuit breaker, and provide the existing original-source search link.
Do not replace denied API access with an unapproved scraping workaround.

### A12 - P2: Listing Responses Violate The Region/Currency Contract

Locations: `server.js:3979` and other Japanese parsers;
`src/agents/listingNormalizerAgent.js:7`.

The normalizer attaches a nested `normalized` object but does not fill the
required top-level fields. A live Moog search returned 416 listings: all 416
lacked both top-level `region` and `currency`. A UK check returned 86 listings
with both fields present, showing inconsistent connector contracts.

The main search handler also derives source choices independently of region
when sources are omitted. Incorrect request/source combinations can therefore
produce metadata based on the requested region rather than actual provenance.

Recommended fix: centralize the source-aware output contract at the server
boundary, retain actual source currency/region, and validate allowed regional
source sets. Keep the Gear Index's deliberately national US source selection
working. Add contract assertions for every connector and MCP result path.

### A13 - P2: Cloud Preferences Drop GBP, Gallery Mode, And Gear Mode

Locations: `server.js:1991`, `app.js:6931` (`getLocalPreferencePayload`).

The client sends `currency`, `resultView`, and `gearMode`, but the server only
accepts USD/JPY and omits the latter two fields entirely. Reproduction:
normalizing `{currency: 'GBP', resultView: 'gallery', gearMode: false}` returns
an empty object. These preferences cannot reliably follow the user to another
browser.

Recommended fix: align the server preference schema with the supported client
fields and currencies, retaining backwards-compatible defaults. Add round-trip
and concurrent preference-change tests.

### A14 - P2: Image Proxy Cache Has No Size/Eviction Bound

Location: `server.js:2617`.

Each unique allowed image URL stores a full response buffer in a process-wide
Map. Expiry is checked on lookup, but expired keys are not proactively removed;
there is no byte/entry ceiling or response-body cap. Over time or under abuse,
the image cache can consume the service's memory allocation.

Recommended fix: bounded LRU/TTL cache with a byte budget, upstream timeout,
response-size limit, and explicit image MIME validation. Verify redirect
destinations remain inside the intended proxy trust boundary. No memory-stress
or malicious upstream test was performed.

### A15 - P2: Dependency Audit Is No Longer Clean

Locations in `package-lock.json`: 449 (`fast-uri`), 600 (`hono`),
651 (`ip-address`), 898 (`qs`).

`npm audit --omit=dev` reports four affected production dependency packages:
two high and two moderate. Installed versions are fast-uri 3.1.4, ip-address
10.3.0, hono 4.12.32, and qs 6.15.3, all through the MCP SDK dependency tree.
This is an advisory finding, not proof that each vulnerable feature is
reachable in Brrtz.

Recommended fix: update compatible dependencies in a dedicated change, inspect
the resulting lockfile, and rerun MCP, HTTP, and application checks. Do not use
an unreviewed force upgrade.

Primary references:

- [fast-uri advisory](https://github.com/advisories/GHSA-7p8r-x3mc-p8w7)
- [ip-address advisory](https://github.com/advisories/GHSA-mwp4-54f8-5fhr)

### A16 - P2: HTTP Security And Static Delivery Need Hardening

Locations: `server.js:384`, `server.js:5114`.

The production response checked had no CSP, MIME-sniffing protection, frame
protection, referrer policy, or HSTS header. Auth tokens live in localStorage,
making an XSS defect particularly consequential. This audit did not demonstrate
XSS or inspect any token values.

Production `app.js` is 514,487 bytes, returned without compression, ETag, or
caching (`no-store`) even when compression is requested. Locally compressing
the unchanged bytes gives about 109,921 bytes. CSS is 342,721 bytes versus
49,108 gzip bytes. This is avoidable bandwidth and parse/download work.

Recommended fix: a tested, staged security-header policy; sanitized public
errors; compression; and versioned/cacheable static assets. Keep HTML/auth/API
cache policies separate. Do not turn on aggressive asset caching without cache
invalidation and a deployment smoke test.

## Validation Results

| Check | Result |
| --- | --- |
| `node --test test/*.test.js` | 51/51 passed |
| `npm run qa:saved-searches` | 31 assertions, click behavior, desktop/mobile themes passed |
| `npm run qa:gear-scanner-curation` | Passed existing browser fixtures |
| `npm run design:check` | Passed |
| `npm run design:map-check` | Passed |
| `node scripts/build-gear-pages.mjs --check` | 19 generated models current |
| `npm run aeo:check` | Passed locally |
| `npm run aeo:check:prod` | Passed on production |
| `npm run qa:golden-searches` | Failed 3/5 checks because of Reverb 403s |
| Production Japan/Waldorf golden check | Reverb 403 reproduced; 67 listings from other sources |
| `npm audit --omit=dev` | Failed: 2 high, 2 moderate affected packages |
| Production health | HTTP 200; Supabase/eBay configured, invite required, Craigslist parked |
| Unauthenticated production cloud routes | HTTP 401, as expected |
| Unauthenticated production admin sources | HTTP 403, as expected |
| Production Gear Index | Scheduler enabled, 45-minute interval; 233 rows in seven-day response, latest dated today |

Additional live connector sample:

- Japan Moog: 416 listings in about 16 seconds. Digimart, Five G, implant4,
  Jimoty, OFFMALL, Yahoo Auctions, Yahoo Fleamarket, and Mercari returned
  listings. Qsic returned zero without a reported error. Rakuma was suppressed
  by the existing query rule, so this request did not verify it.
- UK Moog: 86 eBay listings in about 1.2 seconds; Reverb failed.
- These are point-in-time source observations, not availability guarantees or
  a quality certification for every returned listing.

## UI Coverage And Limits

System Chrome/Playwright checked home, general gallery search, watchlist,
saved-search page, and settings at 320, 390, 770, and 1440 pixels, both themes
(40 route/viewport/theme combinations), plus Refine expansion in all eight
viewport/theme combinations. Fixture data and isolated browser storage avoided
touching the user's real account.

No JS page exceptions or page-width overflow were recorded. Search fields stayed
inside their viewport. Refine source expansion scrolled the panel and light/dark
label colors were correct. The first eight gallery card positions remained
stable after scrolling with the controlled 60-card fixture. This does not prove
every multi-source/image-timing race is gone.

Representative screenshots were visually inspected for mobile Refine (light),
desktop Settings (dark), mobile Gallery (dark), and desktop Home (light).
Fixture thumbnails intentionally used a local asset; these screenshots do not
verify live marketplace image quality. Captures are under ignored
`card-snapshots/audit-20260916/`.

No real iPhone Safari/WebKit run, two-real-user Supabase RLS test, payment or
email flow, password reset, external job scheduling dashboard, database restore,
or administrative MFA/backup attestation was performed. Those require separate
controlled access and test accounts. The running scheduler and public auth
rejections do not establish those controls.

## Improvement Order

1. Restrict static file serving and add HTTP protection tests (A01).
2. Make account data ownership and cloud mutation/deletion correct together
   (A02-A04); agree on migration and recovery before changing the database.
3. Remove synchronous saved-count rescoring and set a realistic performance
   budget (A05).
4. Repair currency, regional saved-search fields, and preference round trips
   with one shared schema contract (A06-A07, A12-A13).
5. Fix the alert limit, then implement reliable delivery/due-time semantics
   with mocked delivery plus an approved production dry run (A08-A09).
6. Add public-route budgets and bounded caches, restore approved Reverb access,
   and patch dependencies (A10-A11, A14-A15).
7. Introduce caching/compression/security headers and monitoring (A16).

## Maintainability And Test Improvements

- Add CI: the tracked `.github` directory has a PR template but no workflow
  that gates deployment on tests. Separate deterministic tests from network
  source smoke tests so transient marketplace outages are visible without
  making every unit-test run unstable.
- Add integration tests for HTTP routing, secret-file rejection, cloud
  ownership, transactional failure, stale devices, schema round trips,
  preference persistence, and alert delivery. The 51 unit tests are valuable
  but do not cover those production boundaries.
- Extract server cloud-sync, alert delivery, and connector I/O behind small
  testable modules. `app.js` is 13,929 lines, `server.js` 5,594, and `styles.css`
  14,813. Size alone is not a defect, but the current arrangement encourages
  mock-only testing and duplicated contracts. Avoid a broad framework rewrite.
- Reconcile `regions.js`, `src/regions/regionRegistry.js`, MCP region metadata,
  and connector defaults deliberately. Their current disagreement already
  affects inference, currency handling, and documentation.
- Distinguish liveness from readiness, source health, alert delivery, and job
  freshness. `/api/health` currently confirms configuration booleans rather
  than exercising dependencies. Add sanitized revision/job metrics and alerts
  for stale or repeatedly failing sources.
- Update stale operating docs: the Gear Index handoff still says its scheduler
  is disabled, while production confirms it is enabled; ROADMAP and AGENTS
  retain pre-expansion assumptions; the security baseline's July clean audit
  is no longer current. Preserve historical handoffs but label current state.
- Expand the design checker deliberately: its current pass validates references
  and selected AEO conventions, not every hardcoded style or accessibility rule.
  Add accessibility and real WebKit checks before claiming broad UI coverage.

## Reproduction Artifacts

Temporary local harnesses from this audit:

```sh
node /tmp/brrtz-audit-20260916.mjs --quick
node /tmp/brrtz-audit-20260916.mjs
node /tmp/brrtz-ui-audit-20260916.mjs
```

The first uses extracted server functions with fake persistence and an isolated
browser with intercepted API responses; the second additionally measures the
large saved-search fixture. The third uses mocked listing/account responses
and writes only ignored screenshots. These are investigative harnesses, not
substitutes for maintained integration tests. `/tmp` is disposable; the
reproduction evidence and locations above are retained in this report.

No changes were committed, pushed, or deployed during this audit.
