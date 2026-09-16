# System Audit Repairs

Scope: all numbered findings in `system-audit-2026-09-16.md`.
Status: deployed to production on 2026-09-16. The repair implementation is
`1ed1258`; the two additive Supabase migrations were applied before that
commit reached `main`. No live email was sent as part of this release.

## Production Release Record

- Confirmed the signed-in Bumpers Supabase project matched the configured
  production project. Its Free plan has no scheduled backups. Before the
  migration, exported all 65 `saved_searches` rows to a private local backup
  outside the repository. A full-project restore drill was not performed.
- Confirmed the live table's columns, defaults, and text primary key, then
  applied both SQL migrations transactionally. The existing 65 rows remained.
  Both new tables have RLS enabled and are accessible to `service_role`, not
  `anon`; all four RPCs allow `service_role` execution and deny `anon` and
  `authenticated` execution.
- Exercised production sync and soft deletion inside a rolled-back SQL
  transaction. The result was correct and left zero probe rows or revisions.
- Pushed `1ed1258` to `main` and confirmed `https://brrtz.com/api/health`
  reported that revision. Production AEO passed; public assets returned 200,
  private SQL files returned 404, and unauthenticated cloud and job routes
  returned 401 and 403 respectively.
- A production alert dry-run was not performed because the protected job token
  is not available locally. Dedicated two-account/two-device sync, actual
  Safari coverage, live alert delivery, and provider-authorized Reverb access
  remain follow-up checks. Do not infer those results from the release smoke
  tests.

## Finding Status

| Finding | Local change | Original release dependency |
| --- | --- | --- |
| A01 | Explicit public-file allowlist, realpath/symlink containment, HTTP regression tests | Deploy |
| A02 | Owner-scoped browser data, preserved legacy recovery archive, session guards and cross-tab account changes | Deploy; guest transfer remains explicit export/import |
| A03 | Atomic PostgreSQL RPC with owner validation and optimistic revisions; serialized atomic file emulator writes | Saved-search migration first |
| A04 | Durable server tombstones; stale writes rejected; client reconciles deletions and duplicate IDs | Saved-search migration first |
| A05 | Memoized repository counts and shared classification caches; realistic browser performance budget | Deploy |
| A06 | Watchlist reconstruction preserves currency/region and repairs legacy source metadata | Deploy |
| A07 | Schema 3; cloud region/category serialization; keep local criteria when old cloud rows lack fields | Saved-search migration first |
| A08 | Absent alert limit uses configured default; explicit zero and invalid limits tested | Alert migration before enabling new job code |
| A09 | Durable per-search claims/pending delivery, cadence and fair due selection, per-search failure isolation, scoped event pagination, Resend idempotency | Alert migration and approved dry-run; live sends need separate approval |
| A10 | Per-client request budgets, bounded queues, source coalescing, deadlines/cancellation, Mercari page ceiling and capped feedback inbox | Deploy; review trusted-proxy setting |
| A11 | Server-only optional Reverb credential, failure backoff, honest unavailable result and original-source link | Approved Reverb integration/access still required; 403 is not resolved by code alone |
| A12 | Source-aware top-level listing provenance; common region configuration for browser/server/MCP; regional validation | Deploy; national Gear Index coverage preserved through regional batches |
| A13 | GBP, GLG view and Gear Mode preference round trips; queue changes made during a preference upload | Deploy |
| A14 | Bounded byte/entry/TTL image caches; body caps, timeouts, MIME checking, redirect rejection | Deploy |
| A15 | Compatible transitive dependency updates; production audit clean | Deploy |
| A16 | Security headers, limited enforced CSP plus report-only script/style policy, safe redirect origins, sanitized errors, gzip, ETag/no-cache revalidation | Deploy; review report-only policy before broader enforcement |

## Database Release Order

This batch was not deployed before applying the migrations. The new
server fails closed with `424 migration_required` instead of falling back to
the old destructive write path. Local edits remain on the device.

1. Confirm the actual production table definitions match the documented text
   IDs and current columns. Verify a current Supabase backup and the restore
   procedure. Never place a production dump or credentials in this repository.
2. Apply `docs/sql/2026-09-16-saved-search-integrity.sql` and
   `docs/sql/2026-09-16-alert-delivery.sql`. Both are additive and transactional.
3. Verify RPC permissions: only the server service role may call them. Confirm
   existing table RLS and service-role grants using dedicated test accounts.
4. Deploy the matching server/client. Old tabs must reload; legacy full-list
   PUTs receive 409 rather than deleting the cloud collection.
5. Test two dedicated accounts and two devices, including offline deletion,
   concurrent edits, duplicate repair, explicit recreation and preference sync.
6. Run the protected alert endpoint with `dryRun=true`. Check actual scheduler
   URL, due batches and service configuration before separately authorizing a
   live fixture email. Never print the job token or email credentials.

Rollback must NOT restore the old DELETE-then-INSERT save implementation.
Pause cloud writes/jobs and fix forward if a release problem occurs. Existing
rows and additive migration columns are retained; restore data only from an
approved, verified backup procedure.

## Data And Delivery Rules

- New browser keys resolve to `<legacy-key>.owner.<encoded-user-id>` or
  `.owner.guest`. Existing bulky cache keys are permanently bound to their
  original owner through a small migration record, avoiding a duplicate copy
  that could exhaust browser storage. The original profile list is retained
  as a recovery archive and read only through owner filtering until that owner
  writes a scoped replacement. Ambiguous legacy ownership is quarantined, not
  silently assigned. Explicit export/import is the supported account/guest
  transfer operation; unowned legacy searches remain in the guest collection.
- A deleted ID cannot be revived. Recreating a search generates a new ID.
  Duplicate aliases are retained in compact sync metadata so deleting the
  visible row also deletes its known remote duplicates.
- Criteria already lost in historical cloud data cannot always be inferred.
  A matching local copy is preserved when available; otherwise the existing
  source-based region/default-category fallback remains.
- Cloud mutations accept at most 500 active profiles and 5,000 deleted IDs.
  Oversized batches fail visibly rather than being truncated.
- A source's first alert scan establishes a baseline, not an email backlog.
  Later arrivals are eligible; dated items older than seven days are excluded.
  Cadences are five minutes (immediate), one hour, and one day, subject to the
  external scheduler actually invoking the job.
- Pending email requests persist before sending. Retries reuse their exact
  idempotency key and frozen message inputs. Ambiguous deliveries older than
  23 hours require review rather than risking a repeat after the provider's
  dedupe window. See [Resend idempotency](https://resend.com/docs/dashboard/emails/idempotency-keys).
- File cloud mode is a development emulator, not a coordinated live mail sender.
- Reverb credentials must stay server-side. Review the approved integration
  and minimal scopes with the provider; do not bypass a denied API with scraping.
  See [Reverb authentication](https://www.reverb-api.com/docs/authentication).

## Validation And Operations

Maintained regression commands:

```sh
npm test
npm run qa:saved-searches
npm run qa:system
npm run qa:ui
npm run qa:gear-scanner-curation
npm run design:check
npm run design:map-check
node scripts/build-gear-pages.mjs --check
npm run aeo:check
npm audit --omit=dev
```

The new CI workflow runs deterministic tests, including PostgreSQL migrations
inside PGlite, without real accounts, credentials, connectors or email sends.
Live connector golden checks remain separate so marketplace outages are not
mistaken for deterministic regression failures. Adding this workflow does not
configure branch protection or make Railway wait for its result.

The final repair validation passed 72 unit/integration checks, saved-search
browser checks, curation, design/map checks, gear-page generation and local AEO.
Chromium covered five views at four widths in both themes (40 combinations),
plus Refine and stable gallery positioning. Representative screenshots were
inspected under ignored `card-snapshots/system-repairs/`.

The 30-search/250-shared-listing benchmark improved from roughly 3,000 ms per
read and 5,930 ms per render to 222-266 ms cold, less than 1 ms warm and 7-9 ms
rendering. Budgets are enforced by `qa:system`; fixtures never use real accounts.

Live golden checks still fail three of five scenarios because Reverb returns
403 (or its subsequent five-minute backoff). Japan Juno-106 and drum-machine
checks passed; other marketplaces returned results in all five scenarios.
This provider-access issue remains open pending approved Reverb credentials.

WebKit installation was attempted but Playwright reports that Ubuntu 26.04 x64
is unsupported. Actual iPhone/Safari coverage, a full backup restore drill,
dedicated-account production RLS tests, provider access, scheduler
configuration and delivery must not be claimed from these local checks. Run
`BROWSER=webkit npm run qa:ui` on a supported host.

`/api/health` now separates liveness from sanitized source/job observations and
includes deployment revision/uptime. It is not a dependency-readiness guarantee.
External monitoring/notification services and branch protections remain an
operator setup task requiring approval.

Public route limits use socket identity by default. Enable `BRRTZ_TRUST_PROXY`
only after verifying that the hosting proxy sanitizes forwarded addresses;
otherwise spoofed headers can defeat per-client budgets. The feedback inbox
stops accepting submissions at 10 MiB until it is archived; local noise hiding
is independent of remote capture.

Unversioned public assets use ETag revalidation, not immutable caching. Basic
frame/object/base protections are enforced; script/style CSP remains report-only
while auth, fonts and all production asset origins are reviewed.
