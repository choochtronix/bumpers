# Brrtz Newness Model

This document defines how Brrtz treats "new" listings during beta. The goal is to make the app feel live while avoiding misleading badges on stale, reposted, or already-seen listings.

## Terms

### Latest source listing

A listing with a recent `listedAt` value from the source marketplace. This is useful for sorting browse feeds and keeping "latest first" views honest.

Latest source listings do not automatically get the visible `New` pill. A source can report a recent listing that the user has already seen.

### New to Brrtz

A listing ID that was not present in the local listing ledger before the current live scan. This is the core beta definition of a new discovery.

New-to-Brrtz listings:

- count toward saved-search scan `new` totals
- get the visible `New` pill until acknowledged
- are recorded with `firstDiscoveredAt`, `firstSeenAt`, `lastFoundAt`, and source metadata

### New to a Saved Search

A listing that Brrtz has seen before, but has not previously associated with the current saved-search profile.

This catches cases where a listing begins matching a different search after the user changes terms, regions, sources, or filters.

### New to User

A listing that has not been acknowledged by the current user/browser/account. A listing becomes acknowledged when the user meaningfully acts on it, such as opening it, watching it, hiding/dismissing it, or marking it through listing feedback.

## Visible `New` Pill

The `New` pill appears when a listing is either:

- new to Brrtz in the current scan
- new to the current saved search and not yet acknowledged

The pill is intentionally not used for every source-fresh listing. That keeps the badge meaningful.

## Current Beta Storage

The beta implementation uses the browser listing ledger and cloud-synced user state where available. The ledger stores:

- `firstDiscoveredAt`
- `firstSeenAt`
- `lastFoundAt`
- `lastSeenAt`
- `lastVerifiedAt`
- `freshnessStatus`
- `profileNames`

This gives Brrtz enough history to distinguish "latest marketplace data" from "new discovery for this user."

## Future Upgrade

For a multi-user public beta, move the listing ledger into cloud storage so newness can be consistent across devices and browsers. The current local ledger is enough for beta UX validation, but cross-device "new-to-user" will get more precise once listing observations are server-side.
