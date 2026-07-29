# Brrtz App Version Living Plan

Last updated: 2026-07-29

## Purpose

This is a living planning document for the future Brrtz app experience. The immediate priority remains polishing the web beta UI/UX, but this file captures the app direction so decisions do not get lost.

## Current Direction

The recommended first app step is a polished mobile web app / PWA before a fully native iOS or Android build.

Why:
- Reuses the current Brrtz web app.
- Gives users a home-screen icon and app-like launch flow.
- Keeps cost and complexity lower during beta.
- Creates a path toward web push notifications.
- Lets current account, saved search, watchlist, and alert systems mature before native app investment.

## App Experience Goals

- Make Brrtz feel like a daily gear radar, not only a search page.
- Center the experience around saved searches, new listing detection, watchlist, and fast repeat searches.
- Preserve the Brrtz visual system: bold logo, brand gradient used sparingly, clean controls, compact utility UI, and strong mobile ergonomics.
- Keep source links transparent and always send buyers back to the original marketplace or Buyee when applicable.

## Likely App Shell

Primary mobile navigation:
- Home
- Saved
- Watchlist
- Settings

Core surfaces:
- Main search
- Gear Scanner live feed
- Saved Searches / My Page dashboard
- Watchlist
- Settings and account
- Refine search modal

## PWA Phase

Potential scope:
- Add manifest and app icons.
- Add installable home-screen behavior.
- Add service worker only if it has a clear purpose.
- Preserve live search behavior and avoid caching stale marketplace results.
- Improve signed-in persistence.
- Ensure mobile bottom nav and safe-area spacing feel native.

Risks:
- Marketplace result freshness must not be confused by aggressive offline caching.
- iOS PWA behavior has platform limitations.
- Push notification support may require additional backend work and user permission flows.

## Account And Sync

App readiness depends on:
- Reliable Supabase sign-in.
- Persistent sessions after first login.
- Saved searches syncing automatically to cloud.
- Watchlist syncing automatically to cloud.
- Settings syncing or at least restoring predictably.
- Clear signed-in indicator in the header/nav.

Current principle:
- Users should not need a manual extra sync step after saving or refining searches.

## Notifications

Phase 1:
- Email alerts for saved searches.
- Alert toggle per saved search.
- Scheduled backend scan job.
- Deduped "new listing" logic.

Phase 2:
- Web push notifications for installed PWA users.

Phase 3:
- Native push notifications if Brrtz moves to iOS/Android.

Future community channels:
- Discord alerts.
- Slack alerts.
- Shared watchlists or community radar feeds.

## Backend Requirements

Likely needed:
- Scheduled saved-search scanner.
- Listing identity ledger for dedupe and newness.
- Alert delivery log.
- Per-user alert frequency controls.
- Source-safe fetch pacing.
- Clear fallback behavior when a source fails.

Hosting direction:
- Keep within Railway and Supabase for now.
- Avoid AI search costs until deterministic source/query tuning is fully exhausted.

## Native App Later

Native app should wait until:
- Web beta has clear daily-use patterns.
- Saved-search alerts prove useful.
- Source quality and newness logic are reliable.
- Core UI conventions are stable in the design system.

Potential native advantages:
- Better push notification reliability.
- Share-sheet support.
- Faster app launch.
- More native account/session handling.
- Better saved search and watchlist dashboard polish.

## UI/UX Polish Before App Work

Keep improving:
- Gear Scanner layout and motion.
- Saved Searches page density and scanning.
- Refine modal clarity.
- Card consistency across Grid, List, Gallery.
- Mobile drawer behavior.
- Account/settings polish.
- Design system parity between Figma and production.

## Open Questions

- Should the installed PWA open to Home or Saved Searches by default?
- Should Gear Scanner or Saved Searches become the primary app home?
- Which notification mode is the most useful for beta users: immediate, daily digest, or manual scan?
- How much source-specific detail should be shown inside app cards?
- When should Brrtz introduce community channels such as Discord or Slack?

## Decision Log

- 2026-07-29: Prefer PWA first, native app later.
- 2026-07-29: Continue current web beta UI/UX polish before starting app implementation.
