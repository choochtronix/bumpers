# Brrtz Roadmap

Brrtz is a gear-search radar for synthesizers, electronic music instruments, and pro-audio listings. The near-term product is focused on Japan used-gear sources, with cloud sync and invite-only beta access. The long-term product should support multiple regions without forking the codebase.

## Product Principles

- Search original sources directly whenever possible.
- Keep Gear Mode as the signature Brrtz filtering experience.
- Make saved searches and watched gear portable across desktop, mobile web, and the future iOS app.
- Treat regions as configuration, not separate apps.
- Keep the interface visual, fast, and enjoyable, but avoid hiding core search controls.

## Near Term: Beta Friends Launch

Primary doc: `docs/beta-friends-launch-todo.md`

Goals:

- Invite-only beta URL.
- Supabase-backed account profile and saved-search sync.
- Japan as the default active region.
- Mobile web usable enough for real testers.
- Clear tester instructions and feedback loop.

## Region Strategy

Regions should become first-class objects that define currency, locale, source availability, and search defaults.

Example active beta region:

```js
const japanRegion = {
  id: "japan",
  label: "Japan",
  currency: "JPY",
  defaultLocale: "ja-JP",
  sources: ["mercari", "yahoo-auctions", "rakuma", "digimart"],
  searchDefaults: {
    cleanGear: true,
    maxResults: 80
  }
};
```

Future US region example:

```js
const bayAreaRegion = {
  id: "bay-area",
  label: "Bay Area",
  currency: "USD",
  defaultLocale: "en-US",
  sources: ["craigslist-sfbay", "reverb-us", "ebay-us"],
  searchDefaults: {
    cleanGear: true,
    maxDistanceMiles: 75
  }
};
```

Open questions:

- Should LA be a separate region or a sibling metro inside a broader US region model?
- Should region selection live in onboarding, Settings, or the main search header?
- Should saved searches be region-scoped by default?
- Should watched gear be global or region-scoped?

## Phase 1: Japan Beta

Focus:

- Japan source reliability.
- Invite-only users.
- Supabase sync.
- Mobile responsive polish.
- Saved searches, watched gear, and feedback sync.

Candidate sources:

- Mercari Japan
- Yahoo Auctions
- Rakuma
- Digimart
- OFFMALL / Hard Off
- Yahoo Fleamarket
- Reverb Japan listings
- Jimoty
- Five G
- implant4

## Phase 2: Public Web Foundation

Focus:

- Choose production hosting for Brrtz server/search connectors.
- Keep secrets in hosted environment variables.
- Add production logging for source failures and slow connectors.
- Add source health indicators.
- Harden invite/auth flows.

Potential hosting:

- Render
- Railway
- Fly.io
- VPS
- Cloudflare Workers only if connector architecture becomes compatible
- Codex Sites later for frontend or compatible hosted app versions

## Phase 3: Region Expansion

Focus:

- Bay Area region.
- LA region or broader US metro model.
- Craigslist, Reverb US, and eBay US source connectors.
- Distance and local-pickup filtering.
- USD-first pricing and locale behavior.

## Phase 4: Alerts and Daily Radar

Focus:

- Email or push-style alerts.
- Daily digest.
- Better first-seen vs recently-listed distinction.
- Saved search alert rules.
- Fresh Finds algorithm tuned by watched gear and saved searches.

## Phase 5: iOS App

Focus:

- Reuse same backend and region configs.
- Reuse design system tokens and assets.
- Account login and synced saved searches.
- Mobile-first saved search management.
- Push notifications when ready.

## Parking Lot

- Optional AI review for uncertain results.
- Advanced noise-learning per saved search.
- Price history.
- Buyee open action for compatible Yahoo Auctions listings.
- Source-specific diagnostics panel.
- Region onboarding flow.
- Tester feedback form.
