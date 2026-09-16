# Brrtz Newness Model

This document defines how Brrtz treats "new" listings during beta. The goal is to make the app feel live while avoiding misleading badges on stale, reposted, or already-seen listings.

## Terms

### Latest source listing

A listing with a recent `listedAt` value from the source marketplace. This is useful for sorting browse feeds and keeping "latest first" views honest.

Latest source listings do not automatically get the visible `New` pill. A source can report a recent listing that the user has already seen.

### New to Brrtz

A listing ID that was not present in the local listing ledger before the current live scan. This is the core beta definition of a new discovery.

New-to-Brrtz listings are recorded with `firstDiscoveredAt`, `firstSeenAt`,
`lastFoundAt`, and source metadata. First discovery alone does not guarantee a
`New` badge: the age and acknowledgement rules below also apply.

### New to a Saved Search

A listing that Brrtz has seen before, but has not previously associated with the current saved-search profile.

This catches cases where a listing begins matching a different search after the user changes terms, regions, sources, or filters.

### New to User

A listing that has not been acknowledged by the current user/browser/account. A listing becomes acknowledged when the user meaningfully acts on it, such as opening it, watching it, hiding/dismissing it, or marking it through listing feedback.

## Visible `New` Pill

The badge requires a recent discovery, no acknowledgement, and either:

- A trustworthy marketplace date within 72 hours, with discovery also within
  72 hours.
- No marketplace date, discovery within 24 hours, and a prior successful scan
  of that source for the search.

An initial undated backlog is not new. A successful scan with zero matches is
still a baseline, so a later undated arrival can be new. A failed source does
not establish a baseline. Merely refreshing a listing does not reset its age.

## Saved Search Counts

Updated 2026-09-16:

- The sidebar and Saved Searches page count eligible, unacknowledged matches,
  including listings already found through Gear Scanner or another search.
  They do not count only IDs discovered during the latest request.
- Counts use the same Gear Mode and feedback filtering as results. Repeat
  scans retain unread matches; acknowledging a card or expiry clears them.
- Opening a saved search does not acknowledge its entire result set. Card
  visibility and explicit listing interactions retain their acknowledgement
  behavior. Background refreshes never acknowledge cards.
- Opening the drawer or Saved Searches page refreshes stale searches one at a
  time, with a five-minute retry interval while the surface remains open.
  Foreground searches take priority. Refreshes use each saved search's own
  region and source selection.
- Failed/partial sources retain their previous matches until a successful
  response replaces them. A successful empty response clears those matches.
- Late responses cannot update a deleted search or a search whose criteria
  changed. Scans update scan metadata without advancing the timestamp of the
  user's saved-search edits.

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

`bumpers.savedSearchScans` is a local, disposable index containing each saved
search's criteria signature, matching listing IDs, check time, and per-source
baseline times. Full listing objects stay in `bumpers.listingLedger`; none are
added to saved-search records or cloud payloads. The saved-search record schema
is unchanged. Existing browsers acquire the index on their next scan.

Local reads, imports, and cloud merges collapse duplicate saved-search
identities using IDs, remote-ID aliases, and the existing normalized-name
fallback. The newest user edit wins, with newer scan counters merged separately
only when search criteria agree. Delayed cloud push responses merge with current
local records so they cannot discard saves made while the request was running.

Regression verification: `npm run qa:saved-searches` against the local server.
This uses isolated browser storage and mocked API responses, including desktop
and mobile light/dark checks, without touching real accounts or marketplaces.

## Future Upgrade

For a multi-user public beta, move the listing ledger into cloud storage so newness can be consistent across devices and browsers. The current local ledger is enough for beta UX validation, but cross-device "new-to-user" will get more precise once listing observations are server-side.
