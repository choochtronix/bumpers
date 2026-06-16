# Brrtz PC Codex Handoff

Last updated: 2026-06-16

Use this file when continuing Brrtz from a new Codex session on the Windows PC.

## Short Prompt For New Codex Session

```text
We are continuing Brrtz, a live beta web app for searching used synthesizers and pro-audio gear across Japan and US sources. The repo is https://github.com/choochtronix/bumpers, but the product is now called Brrtz and is live at https://brrtz.com.

Before coding, read:
- docs/windows-migration.md
- docs/pc-codex-handoff.md
- docs/beta-friends-launch-todo.md
- docs/synth-browser.md
- ops/data/source-registry.md
- ops/tasks/ebay-api-connector.md
- ops/tasks/sweetwater-used-source.md
- ops/tasks/guitar-center-used-source.md

Respect existing UI direction: minimal, high-polish, dark-mode friendly, Brrtz gradient only for core actions, source pills compact, Gear Mode is a signature feature.
```

## Current Product State

Brrtz is an invite-only public beta at:

- Production: `https://brrtz.com`
- Railway fallback: `https://brrtz-beta-production.up.railway.app`
- Local dev: `http://127.0.0.1:5173`

Cloud/profile sync:

- Supabase stores profiles, saved searches, watched gear, and feedback.
- Resend handles Supabase auth email through the `brrtz.com` domain.
- Invite gate is enabled for beta.

Active regions:

- Japan
- Bay Area
- Los Angeles

Active/working source model:

- Japan sources include Yahoo Auctions, Yahoo Fleamarket, Mercari, Rakuma, Digimart, OFFMALL, Five G, implant4, Hard Off, and related Japan gear sources.
- US beta sources include Reverb US and eBay US.
- Craigslist is parked as a manual deep-link assist because live scraping caused blocking risk.
- Sweetwater and Guitar Center are treated as Search Assist sources, not live listing sources.

## Current Technical Shape

Core files:

- `server.js`: Node server, source connectors, API routes, Supabase/cloud, browse cache, source assist URL generation.
- `app.js`: UI state, search behavior, source pills, saved searches, settings, watched/feedback sync, browse sections.
- `styles.css`: primary UI styling.
- `design-system.css`: shared design tokens.
- `regions.js`: region config.
- `index.html`: app shell.
- `.env.example`: local env template.

Important docs:

- `docs/windows-migration.md`: exact Windows setup.
- `docs/production-env-checklist.md`: required hosted env vars.
- `docs/beta-friends-launch-todo.md`: launch checklist.
- `docs/beta-launch-milestone-2026-06-09.md`: DNS/Railway/Supabase launch record.
- `docs/ebay-browse-api.md`: eBay connector setup.
- `docs/synth-browser.md`: homepage browse/category system.
- `ops/data/source-registry.md`: source inventory.

## Windows Boot Sequence

```powershell
cd $HOME\Documents
git clone https://github.com/choochtronix/bumpers.git brrtz
cd brrtz
npm install
copy .env.example .env.local
notepad .env.local
npm start
```

Optional helper:

```powershell
.\scripts\start-brrtz-windows.ps1
```

Mobile Wi-Fi preview:

```powershell
.\scripts\start-brrtz-windows.ps1 -Host 0.0.0.0
```

## Required `.env.local` Shape

```env
BUMPERS_CLOUD_PROVIDER=supabase
BUMPERS_REQUIRE_INVITE=true
BUMPERS_JOB_TOKEN=your-long-random-job-token

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

EBAY_CLIENT_ID=your-ebay-client-id
EBAY_CLIENT_SECRET=your-ebay-client-secret
EBAY_MARKETPLACE_ID=EBAY_US
```

Never commit `.env.local`.

## Recent Work Context

Most recent source/UI direction:

- eBay Browse API is live and confirmed healthy for Bay Area and LA.
- Guitar Center was investigated but parked because it behaves more like Craigslist and does not currently meet Brrtz quality standards.
- Sweetwater was added as a Search Assist style source instead of live listings.
- Manual/assist sources should appear separately from live listing source counts, with a prepared search URL and clear `↗` behavior.

Most recent migration direction:

- Move active local development to Windows to save Mac compute.
- Use GitHub as the project transfer.
- Use this handoff doc as the chat/context transfer.
- Use Supabase sync for saved searches/watched gear/profile data.

## Suggested Next Tasks

1. Finish and QA Search Assist UX for Sweetwater / Guitar Center / Craigslist manual deep links.
2. Keep eBay connector healthy and document rate/error behavior.
3. Continue Beta launch polish from `docs/beta-friends-launch-todo.md`.
4. Add next high-signal US source only if it can meet Brrtz quality standards.
5. Keep source changes flowing through the ops loop docs before implementation.

## Human Notes For Craig

- If this exact Mac Codex chat does not appear on Windows, do not block on it.
- Clone the repo, open this file, and prompt the new Codex session with the short prompt above.
- Push current Mac changes before switching machines.
- Copy secrets manually into Windows `.env.local`; never put them in GitHub.
- After sign-in on Windows Brrtz, use Settings -> Account -> Pull from cloud.

