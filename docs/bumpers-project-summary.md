# Brrtz Project Summary

Last updated: 2026-06-07

## What Brrtz Is

Brrtz is a local-first search radar for finding synthesizers, electronic music instruments, and pro audio gear across Japanese auction, flea market, and shop sources.

The core user problem is repetitive search: vintage synth and pro-audio listings are scattered across Yahoo Auctions, Mercari, Rakuma, OFFMALL, Digimart, Reverb Japan listings, and smaller Japanese gear shops. Brrtz gives the user one focused search surface, saved searches, visual source filtering, clean-gear filtering, and new-listing detection.

The intended long-term shape is:

```text
Brrtz responsive web UI
  -> Node search connector server
  -> Supabase auth, profiles, saved searches
  -> future iOS app using the same backend/data model
```

The current development strategy is to keep one shared codebase and one shared data model so desktop web, mobile web, and a future iOS app do not require separate search-engine or design-system work.

## Current Product Behavior

Brrtz currently supports:

- Multi-source search from one primary search field.
- Saved searches with terms, exclusions, source choices, max price, and alert mode.
- "Clean Gear" mode that filters marketplace noise such as records, CDs, books, clothing, stickers, manuals, cables, adapters, and other non-gear results.
- User-editable exclusion lists and Clean Gear noise terms.
- Positive/negative gear confidence scoring.
- User feedback buttons for "This is gear", "This is noise", and "Hide similar".
- Watched gear / saved listings using a heart icon.
- Fresh Finds and New Finds surfaces for saved-search discoveries.
- Source pills showing which marketplaces returned results.
- Collapsible Sources row: the default source pill reads like `08 Sources`; tapping expands all source filters.
- Result cards with large images, source logos, prices, quick watch controls, and listing links.
- `Open` plus overflow behavior for alternate open paths such as the source listing or Buyee where applicable.
- JPY/USD display setting using a configurable JPY-per-USD rate.
- Light and dark mode.
- Responsive mobile web layout, including local Wi-Fi preview support.
- Export/import for saved searches as JSON backups.
- Supabase-backed account sync for saved searches and profile preferences.

## Current Search Sources

The source vocabulary in the UI is "Sources". These are the current source ids and labels:

| Source id | Label | Current status |
| --- | --- | --- |
| `mercari` | Mercari | Browser-automation connector with warm browser/cache improvements. |
| `yahoo-auctions` | Yahoo Auctions | Live connector with category/quality filtering and Buyee-friendly URL context. |
| `yahoo-fleamarket` | Yahoo Fleamarket | Live connector coverage added. |
| `rakuma` | Rakuma | Live connector with image proxy/thumbnail repair work. Sold items are filtered. |
| `digimart` | Digimart | Live connector. |
| `offmall` | OFFMALL / Hard Off | Live connector. |
| `hardoff` | Hard Off | Represented in UI; OFFMALL connector is the main Hard Off data path. |
| `five-g` | Five G | Connector path exists; lower-volume source, still needs continued validation. |
| `implant4` | implant4 | Connector path exists; lower-volume source, still needs continued validation. |
| `reverb` | Reverb | Added as an orange source, focused on Japan listings. |
| `jimoty` | Jimoty | Added as a source for local Japanese listings. |

## Architecture

### Frontend

Main files:

- `index.html`: static app shell and modals.
- `app.js`: UI state, saved searches, search orchestration, filtering, auth client flow, cloud sync calls.
- `styles.css`: app layout, responsive behavior, component styling.
- `design-system.css`: shared design tokens and system cleanup layer.
- `assets/`: source logos, Brrtz logo, favicon, refine/search/settings/watch icons, waveform graphics.
- `MOCKS/`: visual experiments for Fresh Finds and Daily Radar layouts.

The frontend is currently vanilla HTML/CSS/JavaScript. It deliberately avoids a heavy framework while the product behavior and visual language are still being shaped.

### Server

Main file:

- `server.js`

The Node server does four main jobs:

1. Serves the static frontend locally.
2. Exposes `/api/search` to aggregate live connector results.
3. Provides helper routes for image/thumbnail proxying where sources need it.
4. Provides cloud/auth routes for Supabase-backed saved-search and profile sync.

Important routes include:

- `/api/search`
- `/api/auth/config`
- `/api/cloud/saved-searches`
- `/api/cloud/profile`
- `/api/rakuma-image`
- `/api/rakuma-thumbnail`

The only runtime dependency is Playwright, currently used for browser-automation-style connectors such as Mercari.

### Connector Model

Each connector normalizes listings into a common object shape:

```js
{
  id: "source-stable-listing-id",
  source: "mercari",
  title: "Listing title",
  price: 120000,
  condition: "Used",
  listedAt: "2026-06-07T09:30:00+09:00",
  url: "https://source.example/listing",
  image: "https://source.example/thumb.jpg"
}
```

The UI then applies common filtering, sorting, display, Fresh Finds, watched-listing, and saved-search logic on top of that normalized shape.

## Saved Search And Profile Data

Saved searches are cloud-ready but still local-first.

Current local storage key:

- `bumpers.profiles`

Saved search records include:

- `id`
- `schemaVersion`
- `userId`
- `name`
- `terms`
- `excludes`
- `noiseTerms`
- `sources`
- `maxPrice`
- `alertMode`
- `createdAt`
- `updatedAt`
- `deletedAt`
- `lastScannedAt`
- `lastMatchCount`
- `lastNewCount`
- `lastSourceCount`
- `lastScanStatus`
- `sync`

The app uses a saved-search repository layer in `app.js` so the UI is not tied directly to `localStorage`. This was added to prepare for cloud sync and future mobile/app reuse.

## Cloud Sync Status

Supabase alpha cloud sync has been started and tested.

Current Supabase tables:

- `saved_searches`
- `user_profiles`
- `alpha_invites`

Current cloud behavior:

- Supabase Auth magic-link login exists in Settings -> Account.
- Browser auth sessions are stored locally.
- The Node server verifies Supabase browser sessions server-side.
- Signed-in users sync saved searches under their Supabase user id.
- Signed-in users sync profile preferences through `user_profiles.preferences`.
- Profile preferences currently include theme, currency, JPY/USD rate, watched listing ids, watched listing snapshots, and feedback/noise rules.
- Saved-search create/delete/import/scan updates can auto-sync when signed in.
- Watched listing and feedback changes can auto-sync through profile preferences.
- Manual Settings -> Account -> Sync now remains available.
- Push/pull cloud buttons are still available as backup controls.
- Basic RLS policies exist for future direct authenticated client access.

Important security note:

- `SUPABASE_ANON_KEY` is safe to use in browser auth flows when RLS is configured.
- `SUPABASE_SERVICE_ROLE_KEY` must stay private in `.env.local` or server-side environment variables only.

## Invite-Only Alpha Status

Invite-only testing is supported through an email allowlist in Supabase.

Current flow:

1. Add a tester email to `public.alpha_invites`.
2. Set `BUMPERS_REQUIRE_INVITE=true`.
3. Restart the local Brrtz server.
4. Tester signs in using Settings -> Account.
5. Server checks the authenticated Supabase email against active invite rows.

There is not yet a typed invite-code UI. The current gate is email allowlist based, which is simpler for early friend testing.

Known operational note:

- Supabase free/default email sending can hit rate limits during repeated test sign-ins. The options are to wait, use fewer magic-link sends, or configure custom SMTP later.

## UI And Visual Direction

Brrtz is intentionally image-forward and media-like rather than dense enterprise software.

Current design direction:

- Large, rounded cards.
- Strong marketplace/source iconography.
- Source logos instead of text badges where possible.
- Fresh Finds with square image cards and overlay text/price treatments.
- Clean Gear as a prominent mode, not a minor dropdown.
- Minimal default home view with a strong search field.
- Saved searches hidden from the default canvas but accessible through top controls.
- Refine modal centered, with background blur.
- Header branding with Brrtz logo and waveform animation.
- Mobile-first considerations are now being folded into the same responsive web build.

Important assets:

- `assets/ICONS-site/bumpers_logo.svg`
- `assets/ICONS-site/b-favicon.svg`
- `assets/ICONS-site/icon-search.svg`
- `assets/ICONS-site/icon-refine-animated-v02-spin.svg`
- `assets/ICONS-site/icon-settings.svg`
- `assets/ICONS-site/icon-saved-search.svg`
- `assets/ICONS-site/icon-watched.svg`
- `assets/logos/ICONS/*.svg`

## Current Development Workflow

Run locally:

```sh
cd /Users/craigdrake/Documents/Codex/bumpers
npm start
```

Open:

```text
http://127.0.0.1:5173
```

For iPhone/mobile preview on the same Wi-Fi, use the local network URL printed by the server, for example:

```text
http://192.168.x.x:5173
```

For remote mobile testing outside the home network, Tailscale is the likely workflow: run Brrtz on the Mac, connect phone and Mac to the same Tailnet, then open the Mac Tailscale IP with port `5173`.

## Current Known Gaps / Next Good Steps

Search/source work:

- Continue validating low-volume shop connectors such as Five G and implant4.
- Keep improving Mercari browser automation speed and reliability.
- Continue source-specific filtering to remove sold/unavailable items and non-musical categories.
- Improve Fresh Finds ranking so first-time users see compelling live synth listings.
- Consider adding optional AI review for uncertain results later, but the current preferred path is deterministic scoring first.

Cloud/account work:

- Polish signed-in and invite-blocked states in Settings.
- Add clearer first-run account onboarding for friend testers.
- Decide whether invite-only remains email allowlist or evolves into typed invite codes.
- Eventually move hosted deployment behind a production Node server and Supabase environment.

Mobile/iOS work:

- Continue responsive web refinement first.
- Preserve shared search connector backend and shared saved-search schema.
- Later, build an iOS wrapper/native app against the same server and Supabase data model.

Alerts:

- The data foundation exists through saved-search scan metadata and new-listing tracking.
- Full email/push/desktop alert delivery is still future work.

## Useful Mental Model For Another Agent

Treat Brrtz as:

1. A local-first responsive web app.
2. A connector-based search aggregator.
3. A synth/pro-audio quality-filtering engine.
4. A saved-search radar with cloud sync in progress.
5. A future iOS app backend prototype.

When making changes, preserve these principles:

- Keep source connectors independent.
- Normalize all source listings into the common listing shape.
- Keep bulky listing/cache data out of saved-search records.
- Prefer deterministic filtering before adding AI cost.
- Do not expose service-role keys in browser code.
- Keep desktop and mobile web using the same codepath whenever possible.
- Favor image-first, polished, music-gear-centric UX over generic marketplace UI.
