# Brrtz Beta Friends Launch Todo

Goal: launch an invite-only public beta for a small group of trusted friends.

Target: week of June 8, 2026

## Status Legend

- Todo
- Doing
- Blocked
- Done

## Launch Criteria

- [x] Brrtz is reachable from a public beta URL.
- [x] Invite-only access works for approved beta users.
- [ ] Supabase profile, preferences, saved searches, watched gear, and feedback sync across browsers.
- [ ] No secrets are committed to GitHub.
- [ ] Mobile layout is usable on iPhone-sized screens.
- [ ] Core Japan sources return useful synth/pro-audio results.
- [ ] Region model exists so Japan and future US regions are config-driven, not forks.
- [ ] Beta tester instructions are clear enough to send by email or message.

## This Week Priorities

### 1. Cloud / Supabase

| Status | Task | Owner | Acceptance |
|---|---|---|---|
| Done | Confirm invite-only gate | Codex/Craig | Uninvited email cannot sync; invited email can sign in and sync. |
| Done | Confirm saved-search sync | Craig | Chrome, Safari, and mobile browser show the same saved searches after sync. |
| Done | Confirm watched gear sync | Craig | Watch/unwatch state survives browser reload and appears in a second browser. |
| Done | Confirm feedback sync | Craig | "This is gear" and "This is noise" feedback persists after sync. |
| Done | Document required production env vars | Codex | Public beta setup has a checklist with variable names and no secret values: `docs/production-env-checklist.md`. |

### 2. Region Architecture

| Status | Task | Owner | Acceptance |
|---|---|---|---|
| Done | Add region concept to product architecture | Codex | Brrtz has a documented first-class `region` object for Japan and future regions. |
| Done | Define Japan beta region | Codex/Craig | Japan config includes currency, locale, default sources, and clean-gear defaults. |
| Done | Stub Bay Area region | Codex/Craig | Bay Area config is documented as a future config, not a separate app fork. |
| Done | Identify UI placement for region selector | Codex/Craig | Decision recorded: Settings, search header, or onboarding. |
| Done | Confirm no search regression from region prep | Codex | Current Japan searches continue using existing source behavior. |

### 3. Public Beta Hosting

| Status | Task | Owner | Acceptance |
|---|---|---|---|
| Done | Choose beta hosting path | Craig/Codex | Railway + Docker selected for the beta. |
| Done | Configure production secrets outside Git | Craig/Codex | Supabase keys and invite settings live in host env vars only. |
| Done | Test public URL | Craig | Brrtz is live at `https://brrtz.com` and `/api/health` returns `ok=true`. |
| Todo | Smoke test search from public URL | Craig | At least one saved search returns live results through the hosted app. |

### 4. UI / Mobile Polish

| Status | Task | Owner | Acceptance |
|---|---|---|---|
| Todo | Mobile header final pass | Codex | Logo, wave, utility icons, search, and controls do not overlap on iPhone. |
| Todo | Settings modal beta pass | Codex | Account, sync, invite, and import/export controls fit on mobile. |
| Todo | List/card view sanity check | Craig | Both views are usable on mobile and desktop. |
| Todo | Gear Mode visual pass | Craig/Codex | Gear Mode feels like a primary Brrtz feature without cluttering search. |

### 5. Search Quality

| Status | Task | Owner | Acceptance |
|---|---|---|---|
| Todo | Validate top saved searches | Craig | 5-10 real saved searches return useful results. |
| Todo | Note bad-result examples | Craig | URLs and search terms are added under Known Issues. |
| Todo | Confirm source health | Codex | Enabled beta sources have a basic working/failing status. |
| Todo | Check "new" discovery behavior | Craig/Codex | New listings are understood as first-seen-by-Brrtz discoveries. |

## Region Architecture Notes

The region model should make location-specific search behavior configurable. Japan is the beta default. Bay Area and LA should become additional region configs later, not separate branches or forks.

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

const bayAreaRegion = {
  id: "bay-area",
  label: "Bay Area",
  currency: "USD",
  defaultLocale: "en-US",
  sources: ["craigslist-sfbay", "reverb-us"],
  searchDefaults: {
    cleanGear: true,
    maxDistanceMiles: 75
  }
};
```

Decision for beta: ship Japan as the active region, and add the region object now so future US expansion does not require a second Brrtz app.

Implementation note, June 8: `regions.js` now defines `window.BRRTZ_REGION_CONFIG` with Japan as the active region and Bay Area as a future region stub. `app.js` reads the active region for default currency, default max price, default source ids, and Gear Mode default without changing existing saved-search behavior.

Region selector placement decision, June 8: put region selection in Settings -> General for beta. Keep Japan as the active default, show Bay Area as a disabled/coming-soon region when useful, and avoid adding a persistent region selector to the main search header until multiple live regions are available. Future onboarding can ask for region once Brrtz supports more than Japan. Saved searches should become region-scoped when multi-region search ships; watched gear can remain global.

Region regression check, June 8: validated `app.js`, `server.js`, and `regions.js` with Node syntax checks. Local search smoke tests against Japan source groups returned live listings without connector errors for Waldorf, Roland Juno 106, and Oberheim across Yahoo Auctions, Yahoo Fleamarket, Digimart, OFFMALL, Rakuma, Mercari, Five G, implant4, and Reverb.

Bay Area beta source pass, June 9: Bay Area is now selectable in Settings -> General as a beta region. The first live California source set is intentionally lean: Craigslist SF Bay and Reverb US. Reverb US uses the Reverb country filter for US listings, while Craigslist SF Bay reads the public musical-instruments search page and normalizes listing title, price, city, URL, and image when available. eBay US, Craigslist LA/OC/SD, Facebook Marketplace, OfferUp, and specialty California synth shops remain follow-up source candidates.

## Known Issues

- Invite gate check, June 8: passed. Brrtz blocks unauthenticated cloud sync with `401` when invite mode is enabled, and invited sign-in works.
- Saved-search sync check, June 8: passed in Chrome and Safari. Migrated 10 alpha-only saved searches into the signed-in Gmail profile, then both browsers mirrored the same 28 cloud saved searches after Resend SMTP was configured for `brrtz.com`.
- Watched gear sync check, June 8: passed in Browser A and Browser B. Watch/unwatch state syncs through the cloud profile and the same listing heart appeared in the second browser after pull/sync.
- Feedback sync check, June 8: passed at the cloud-storage layer. Supabase has 1 synced gear feedback entry and 5 synced noise feedback entries for the signed-in Gmail profile.
- Safari stale-session check, June 8: Brrtz now clears local auth state when Supabase rejects a cloud token as unverifiable, so Safari should prompt for a clean sign-in instead of looping on sync failure.
- Production env checklist, June 8: added `docs/production-env-checklist.md` with required beta variables, secret handling notes, Supabase table requirements, invite SQL, and pre-launch checks.
- Public beta launch, June 9: Brrtz is live at `https://brrtz.com` on Railway with Supabase Auth and cloud pull confirmed. DNS/TLS launch notes are recorded in `docs/beta-launch-milestone-2026-06-09.md`.

## Beta Tester Notes

What Brrtz does:

- Searches multiple used gear sources with synth/pro-audio filtering.
- Lets users save searches, watch listings, and sync across browsers.
- Highlights newly discovered listings that Brrtz has not seen before.

What testers should try:

- Sign in with invite-only access.
- Save one or two real searches.
- Run searches on desktop and mobile.
- Watch/unwatch a listing.
- Report irrelevant results with the original listing URL.

Feedback wanted:

- Search result quality.
- Mobile usability.
- Missing sources.
- Confusing labels or controls.
- Speed problems.
