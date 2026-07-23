# Brrtz Project Handoff

Last reviewed: 2026-07-23

This is the durable entry point for resuming Brrtz work in a new Codex task,
on another machine, or after a long break. It summarizes the current product,
where authoritative implementation details live, how to run and deploy it, and
which rules must survive future edits.

Do not add passwords, API keys, tokens, recovery codes, private user data, or
full Codex transcripts to this file.

## One-Minute Orientation

Brrtz is a free beta gear radar for finding used synthesizers, drum machines,
samplers, modular, effects, and pro audio across regional marketplaces. It
normalizes listings from multiple sources, filters marketplace noise, tracks
saved searches and watched gear, and always sends the buyer back to the
original listing.

Current production site:

- <https://brrtz.com>
- GitHub: <https://github.com/choochtronix/bumpers>
- Production branch: `main`
- Hosting: Railway, service `brrtz-beta`
- Backend: Supabase
- Transactional email: Resend

The repo and some environment variables still use the former project name
`Bumpers`. Use `Brrtz` for new product copy, but do not casually rename stable
storage keys or `BUMPERS_*` environment variables.

## Product Principles

- Search original sources directly whenever practical and permitted.
- Preserve source, region, currency, original URL, and freshness context.
- Treat Brrtz as a discovery layer, not the merchant of record.
- Keep Gear Mode deterministic and explainable before adding paid AI calls.
- Store user intent and compact state, not full marketplace databases.
- Keep desktop and mobile web on the same code path.
- Favor responsive controls and cancellable work over blocking the UI while
  sources load.
- Use the brand gradient selectively for important Brrtz actions and signals.

## Current Architecture

The application is intentionally framework-light:

```text
Browser: index.html + app.js + styles.css + design-system.css
    -> Node server.js
    -> marketplace APIs, HTML connectors, and browser-assisted connectors
    -> Supabase auth, profiles, saved searches, invites, and alert events
    -> Resend saved-search alert email
```

Primary files:

| Area | Source of truth |
| --- | --- |
| App shell and modal markup | `index.html` |
| Client state and UI behavior | `app.js` |
| Responsive/component CSS | `styles.css` |
| Generated design tokens | `design-system.css` |
| Design-system rules | `DESIGN-SYSTEM.md`, `AGENTS.md` |
| Server, routes, and connectors | `server.js` |
| User-facing region definitions | `regions.js` |
| Source operations registry | `src/sources/sourceRegistry.js` |
| Listing normalization | `src/lib/normalization.js` |
| Gear taxonomy | `src/lib/gearTaxonomy.js` |
| Gear Scanner curation | `gear-scanner-curation.js` |
| Listing freshness helpers | `listing-freshness.js` |
| Auth session helpers | `auth-session.js` |
| Agent/AEO tool metadata | `src/aeo/agentTools.js` |

The source operations registry and some older docs can lag behind the
user-facing region configuration. For product-visible region membership,
check `regions.js`; for operational status and connector notes, check
`src/sources/sourceRegistry.js`; then confirm the connector in `server.js`.

## Normalized Listing Contract

Every connector must return the common listing shape. `region` and `currency`
are required:

```js
{
  id: "source-stable-listing-id",
  source: "mercari",
  region: "japan",
  currency: "JPY",
  title: "Listing title",
  price: 120000,
  condition: "Used",
  listedAt: "2026-07-23T09:30:00+09:00",
  url: "https://source.example/listing",
  image: "https://source.example/thumb.jpg"
}
```

Do not make price formatting depend only on the selected app currency. Mixed
result sets must respect each listing's `currency`.

## Regions And Sources

The current user-facing regions are defined in `regions.js`:

| Region | Currency | Current source groups |
| --- | --- | --- |
| Japan | JPY | Mercari, Yahoo Auctions, Yahoo Fleamarket, Rakuma, Digimart, Reverb Japan, Jimoty, OFFMALL/Hard Off, Five G, implant4 |
| Bay Area | USD | Robot Speak, Mission Synths, Starving Musician, Bananas at Large, Gelb Music, Craigslist assist, Reverb US, eBay US, Sweetwater assist, Guitar Center assist |
| Los Angeles | USD | Craigslist assist, Reverb US, eBay US, Sweetwater assist, Guitar Center assist |
| East Coast | USD | Main Drag, Rogue Music, Three Wave, Alto Music, Tone Tweakers, ProAudioStar assist, Craigslist assist, Reverb US, eBay US |
| UK | GBP | Reverb UK, eBay UK |

Important access distinctions:

- eBay uses the official Browse API. Do not replace it with scraping.
- Mercari is browser-assisted and uses Playwright.
- Craigslist is parked by default and should remain assist/manual-first unless
  a controlled access path is explicitly enabled.
- Some sources are search-assist links rather than server-fetched card data.
- A source being present in the UI does not prove it is healthy. Run source QA.

When adding a region or source, update all affected layers:

1. Normalize `region` and `currency` in the connector.
2. Add product-visible source membership in `regions.js`.
3. Update `src/sources/sourceRegistry.js` with access type and status.
4. Update the client source definition in `app.js` when needed.
5. Add a source color token instead of hardcoding a color.
6. Run source health, golden searches, curation QA, and device checks.

## Core Product Surfaces

### Search And Refine

- The main field supports search, autosuggest, clear, Refine, and quick-save.
- Refine manages additive search terms, exclusions, source selection, region,
  price, category, Gear Mode, and saved-search behavior.
- Search work must not freeze pulldowns or block a newer user selection.
- A refresh of a search-results URL must restore the user's search state.

### GLG Listing System

`GLG` is the shared card vocabulary:

- Grid
- List
- Gallery

The general search-results implementations are the visual source of truth.
Gear Scanner and Brand Browser should inherit those conventions instead of
forking new card systems. Keep source icons, price, More Actions, image sizing,
corner radii, hover states, menus, and mobile behavior consistent.

The Gear Scanner home preview is allowed to use its compact live-feed variant,
but should still reuse GLG controls and tokens where practical.

### Gear Scanner

- A live-looking browse feed with category selection, rescan, See All, and a
  responsive carousel/live-feed presentation.
- The section uses the perspective-line SVG background.
- UI remains interactive while source requests run.
- A newer category/region action cancels or supersedes stale work.
- Carousel movement should feel fluid and preserve touch inertia on mobile.

### Brand Browser

Curated brand recipes currently focus on specialist synth makers, including
Moog, ARP, Oberheim, Sequential Circuits, and Waldorf. Recipes combine aliases,
known models, exclusions, source coverage, and Gear Mode. Broad makers such as
Roland and Yamaha were intentionally removed from the curated brand strip.

### Saved Searches And Watchlist

- Saved searches are local-first and cloud-synced when authenticated.
- The Saved Searches page is a compact, mostly text-based account radar.
- Rows support new-result indication, details, email alerts, refine, and delete.
- Alphabet hotkeys jump to the first matching saved search.
- Watchlist is global. Opening it must not retain an active Brand Browser or
  Gear Scanner category filter.
- Mobile bottom navigation contains Home, Saved, Watchlist, and Settings.

### More Actions And Curation

The listing More Actions menu contains relevant marketplace open actions,
Buyee where applicable, Add to Watchlist, and `This is noise`. Mobile uses a
bottom-sheet treatment with large tap targets.

`This is noise` captures evidence and dismisses the listing for the current
profile. It does not immediately create a global filter. See
`docs/this-is-noise-curation-process.md` before changing that workflow.

## Newness And Freshness

The visible `New` marker must represent a plausible new discovery, not merely a
listing that still exists. Current policy distinguishes:

- source freshness
- first discovery by Brrtz
- first match for a saved search
- whether the user has acknowledged the listing

Listings with trustworthy dates must also satisfy the recent time window.
Undated listings require a prior baseline and a much shorter discovery window.
Do not loosen the badge to label an initial backlog as new. The detailed model
and future cloud-ledger direction live in `docs/newness-model.md`.

## Saved Search Schema

The browser storage key remains `bumpers.profiles`. The current schema version
is defined by `SAVED_SEARCH_SCHEMA_VERSION` in `app.js`.

When adding or changing saved-search fields:

1. Bump `SAVED_SEARCH_SCHEMA_VERSION`.
2. Add backward hydration/migration behavior.
3. Update Supabase serialization and the schema docs.
4. Keep listing arrays and caches out of saved-search records.
5. Test local-only, signed-in sync, import/export, and a stale second browser.

Current fields include identity, terms, exclusions, noise terms, sources,
regions, max price, alert settings, timestamps, scan counters, and sync state.
See `docs/saved-search-cloud-schema.md` and
`docs/supabase-alpha-cloud-sync.md` for the database contract.

## Accounts, Auth, And Email Alerts

Supabase provides auth, profiles, saved searches, invite gating, and alert
dedupe state. Resend sends saved-search alert emails.

Current account behavior:

- First-time users can verify by email link.
- Returning users can use a password once configured.
- Browser sessions persist through `auth-session.js`.
- The signed-in avatar exposes account shortcuts and sign out.
- Local fallback mode remains available when Supabase is not configured.

Saved-search alerts are opt-in per search. The protected job route is:

```text
GET /api/jobs/saved-search-alerts
Authorization: Bearer <BUMPERS_JOB_TOKEN>
```

Use `?dryRun=true` before live delivery. Alert setup and database migration are
documented in `docs/supabase-alpha-cloud-sync.md` and
`docs/railway-beta-deploy.md`.

## Environment Variables

Names only are documented here. Real values belong in `.env.local`, Railway,
Supabase, Resend, or the relevant service dashboard.

Core cloud and auth:

```text
BUMPERS_CLOUD_PROVIDER
BUMPERS_REQUIRE_INVITE
BUMPERS_JOB_TOKEN
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Alert email:

```text
RESEND_API_KEY
BRRTZ_ALERT_EMAIL_FROM
BRRTZ_ALERT_DIGEST_BASE_URL
BRRTZ_ALERT_SEARCH_LIMIT
BRRTZ_ALERT_LISTING_LIMIT
```

eBay:

```text
EBAY_CLIENT_ID
EBAY_CLIENT_SECRET
EBAY_MARKETPLACE_ID
EBAY_CATEGORY_IDS
```

Runtime and connector controls:

```text
HOST
PORT
BRRTZ_CRAIGSLIST_MODE
```

Local fallback identity variables also exist under `BUMPERS_CLOUD_USER_*`.
Use `docs/production-env-checklist.md` as the current authoritative checklist.

Security rules:

- Never expose `SUPABASE_SERVICE_ROLE_KEY` in browser code.
- Never commit `.env.local`.
- Never print a job token or secret into a test report or chat response.
- Treat the Supabase anon/publishable key as browser-visible, but still rely on
  Row Level Security and server-side authorization.

## Design System

The Figma library is:

<https://www.figma.com/design/U1J4gaqeqckMVjwyrdGiuW/Brrtz-Design-System?node-id=0-1>

Code-side sources:

- `DESIGN-SYSTEM.md`
- `design-system.css`
- `tokens/brrtz-tokens.json`
- `docs/figma-code-map.json`
- `docs/figma-code-map.md`

Rules that must survive every UI pass:

- `design-system.css` is generated. Never edit it by hand.
- Do not hardcode colors, font families, weights, radii, shadows, or motion
  durations in component CSS or JavaScript.
- Use semantic tokens first, then documented compatibility aliases.
- Theme switching is token-driven through `body[data-theme="dark"]`.
- Use the existing icon language and at least 44 by 44 pixel tap targets.
- Preserve visible focus states and accessible labels for icon-only controls.
- Use the project breakpoint and spacing rhythm rather than one-off fixes.
- Avoid nested cards and unnecessary containers.

Run these after design-system work:

```sh
npm run design:sync
npm run design:check
npm run design:map-check
```

## AEO And Agent Readiness

Brrtz has crawlable About, Regions, Sources, Gear, For Agents, and Agent
Connector surfaces. Machine-readable endpoints include:

```text
/robots.txt
/llms.txt
/sitemap.xml
/agent-tools.json
```

Parameterized `/search` pages are useful to users and agents but deliberately
emit `noindex,follow` to avoid an unbounded crawl surface. Durable pages should
not inherit that directive.

Structured data currently covers the organization/site/application and key
gear model pages. Preserve canonical IDs and avoid merchant `Offer` markup;
Brrtz is not the seller.

Primary references:

- `docs/aeo-agent-readiness-milestone-2026-06-26.md`
- `docs/aeo-post-deploy-checklist.md`
- `docs/brrtz-agent-connector-spec-2026-06-26.md`
- `src/aeo/agentTools.js`

## Local Development Environment

Canonical WSL project directory:

```sh
/home/hanzj/code/brrtz
```

Windows Explorer path:

```text
\\wsl$\Ubuntu\home\hanzj\code\brrtz
```

Start the server in Ubuntu WSL:

```sh
cd ~/code/brrtz
npm start
```

Local browser:

```text
http://127.0.0.1:5173
```

Rigby LAN preview from Mac or another device on the same network:

```text
http://192.168.3.45:5173
```

The server also prints WSL's current internal Wi-Fi address. That internal IP
can change after a full Windows/WSL reboot; the stable cross-device URL depends
on the Windows firewall rule and Windows-to-WSL port proxy.

### If Port 5173 Is Already In Use

Find the existing process in WSL:

```sh
ss -ltnp | grep ':5173'
```

If it is the intended Brrtz process, do not start a second copy. Stop the old
foreground server with `Ctrl+C`, or terminate only the confirmed Node process,
then run `npm start` again.

### If The LAN Preview Stops Working

1. Confirm `curl http://127.0.0.1:5173/api/health` works inside WSL.
2. Get the current WSL IP with `hostname -I`.
3. In Administrator PowerShell, rebuild the Windows port proxy to that IP.
4. Confirm Windows firewall still allows inbound TCP 5173.
5. Retest `http://192.168.3.45:5173` from the same Wi-Fi network.

The exact workflow is preserved in
`docs/rigby-mac-wsl-preview-workflow.md`.

### Playwright On This WSL Environment

Bundled Playwright `install-deps` is not reliable on Ubuntu 26.04 WSL. Use the
system Chrome binary for verification:

```js
chromium.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox"]
});
```

Do not silently switch browser verification back to a missing bundled binary.

### Private Codex History Backup

Windows Task Scheduler runs `Brrtz - Backup Codex History` at user sign-in and
nightly at 2:00 AM. The installed script is:

```text
D:\SHARED\Brrtz Backups\Tools\Backup-Codex-History.ps1
```

The maintained source is `scripts/backup-codex-history.ps1`. Backups live at:

```text
D:\SHARED\Brrtz Backups\Codex
```

The backup uses one immutable baseline, an incrementally refreshed `Current`
mirror, and dated append-only session snapshots. It includes task sessions,
task indexes, selected app-state metadata, attachments, and visualizations. It
explicitly excludes authentication files, sandbox secrets, browser sessions,
caches, and temporary runtime data. Live SQLite files are skipped while Codex
is open and captured by a later run when Codex is closed.

To check the latest run:

```powershell
Get-ScheduledTaskInfo -TaskName "Brrtz - Backup Codex History"
Get-Content "D:\SHARED\Brrtz Backups\Codex\backup.log" -Tail 20
```

Never add these private archives to GitHub. Restore only with Codex closed and
after preserving the current `C:\Users\hanzj\.codex` directory.

## Validation Commands

Choose checks according to the change surface. Before a broad beta-facing
push, run the full useful set:

```sh
npm test
npm run design:check
npm run design:map-check
npm run aeo:check
npm run qa:golden-searches
npm run qa:gear-scanner-curation
```

Other operational checks:

```sh
npm run qa:gear-scanner-report
npm run curation:noise-inbox
npm run jobs:source-health
npm run jobs:source-health:http
npm run aeo:check:prod
```

For visual changes, verify light and dark themes, desktop, reduced desktop,
and a real iPhone-sized viewport. Pay special attention to the search field,
GLG cards, More Actions, modal scrolling, Gear Scanner, bottom navigation,
footer spacing, and fixed controls.

## Git And Deployment

Normal production flow:

```sh
cd ~/code/brrtz
git status
git diff --check
git add <intentional files>
git commit -m "Describe the change"
git push origin main
```

Railway deploys `main` from GitHub using the root `Dockerfile`. After a push:

1. Confirm Railway deploy status.
2. Open <https://brrtz.com/api/health>.
3. Smoke-test the changed behavior on the live site.
4. Run production AEO or source checks when those areas changed.

Do not commit unrelated local artifacts. `.claude/`, `card-snapshots/`, local
curation inboxes, screenshots, caches, exports, and `.env.local` are not part
of a normal production commit unless explicitly reviewed and intended.

## Known Debt And Caution Areas

- Older docs may still describe Japan-only behavior or pre-GLG UI. Prefer the
  current code and this handoff's source-of-truth map.
- `src/regions/regionRegistry.js` does not yet mirror every user-facing region
  in `regions.js`; reconcile deliberately rather than assuming they match.
- The Bumpers-to-Brrtz internal naming transition is incomplete.
- Marketplace markup and anti-bot behavior can change without notice.
- Browser-assisted sources are slower and more operationally fragile.
- Newness is still partly browser-led; cross-device precision improves when a
  full cloud listing observation ledger becomes justified.
- Source counts are not equal to source quality. Always inspect representative
  results and curation failures.
- Responsive layout regressions have historically clustered around iPhone
  Safari, modal positioning, first-card image sizing, and utility controls.

## Recommended Work Priorities

1. Keep source quality and freshness honest before adding more source volume.
2. Continue alert reliability and scheduled-job observability.
3. Reconcile duplicated region/source configuration into one authoritative
   configuration path without breaking the current product.
4. Continue GLG and design-system cleanup instead of adding card variants.
5. Move newness observations cloud-side only when multi-device beta behavior
   proves the need.
6. Advance the agent connector from published contract to permissioned tools
   after core search, saved-search, and alert behavior is stable.

## Documentation Index

Start here, then follow the specialist document for the task:

| Topic | Document |
| --- | --- |
| Project summary | `docs/bumpers-project-summary.md` |
| Rigby/Mac/WSL preview | `docs/rigby-mac-wsl-preview-workflow.md` |
| Production environment | `docs/production-env-checklist.md` |
| Railway deployment | `docs/railway-beta-deploy.md` |
| Supabase setup | `docs/supabase-alpha-cloud-sync.md` |
| Saved-search schema | `docs/saved-search-cloud-schema.md` |
| External services | `docs/account-services-register.md` |
| Newness rules | `docs/newness-model.md` |
| Noise curation | `docs/this-is-noise-curation-process.md` |
| Beta QA | `docs/beta-qa-loop.md` |
| Design system | `DESIGN-SYSTEM.md` |
| Figma mapping | `docs/figma-code-map.md` |
| AEO milestone | `docs/aeo-agent-readiness-milestone-2026-06-26.md` |
| AEO deploy checks | `docs/aeo-post-deploy-checklist.md` |
| Agent connector | `docs/brrtz-agent-connector-spec-2026-06-26.md` |

## Updating This Handoff

Update this file when any of these change:

- production host, domain, branch, or deployment workflow
- supported regions or source posture
- canonical architecture or source-of-truth files
- account, saved-search, watchlist, alert, or newness contracts
- design-system workflow
- AEO/agent endpoints
- local development or LAN preview process

Keep detailed implementation instructions in the specialist docs. This file
should remain the reliable map that tells the next person where to look.
