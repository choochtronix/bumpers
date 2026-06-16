# Brrtz Beta Priority Tracks

This is the short-term working list for getting Brrtz ready for friend beta while keeping human decisions and agentic implementation separate.

## Current Batch Status

- [x] Document beta priority tracks.
- [x] Fix Chrome Browse dropdown stability.
- [x] Fix multi-word search fidelity for terms like `Mackie Mixer`.
- [x] Add visible Save Settings feedback.
- [x] Add a defensive cloud preference sync guard for stale browser/runtime state.
- [x] Make the search-field star quick-save with toast confirmation only.
- [x] Add Watching empty-state guidance.
- [x] Center the back-to-top button across desktop and mobile.
- [x] Add consistent top nav hover/focus states.
- [x] Expand Synth Browser into a larger newest-first browsing feed.
- [ ] Re-test cloud sync in Chrome + Safari after the next local restart.
- [ ] Continue save/search UX cleanup.
- [ ] Review expanded Synth Browser with live source data in Japan, Bay Area, and LA.

## Beta-Critical

| Priority | Item | Owner | Acceptance |
| --- | --- | --- | --- |
| P0 | Synth Browser expansion | Codex + Craig review | A "show more" path opens a larger latest-synth feed sorted newest first, using real source listings instead of random curation. |
| P0 | Newness model | Codex + Craig decision | Brrtz distinguishes latest source listings, new-to-Brrtz listings, and new-to-user listings. |
| P0 | Multi-word search fidelity | Codex | Normal phrases like `Mackie Mixer` return useful results without requiring the user to split words across lines in Refine. |
| P0 | Chrome Browse dropdown stability | Codex | Selecting a Browse category never makes the Synth Browser section disappear. |
| P0 | Cloud sync `.add` error | Codex | Settings sync no longer throws `Cannot read properties of undefined (reading 'add')`. |
| P1 | Simplify cloud sync UX | Codex + Craig copy review | Settings explains one normal sync path; pull/push only appear as advanced recovery actions if needed. |
| P1 | Save-search star flow | Codex | Clicking the search-field star saves the search and shows only a toast confirmation, no modal. |

## Quick Wins

| Priority | Item | Owner | Acceptance |
| --- | --- | --- | --- |
| P1 | Save Settings feedback | Codex | Save Settings gives a visible saved state or toast. |
| P1 | Watch empty-state feedback | Codex | If the user opens Watching with no watched items, the UI explains what the heart does. |
| P1 | Remove duplicate save modal action | Codex | The save modal no longer includes "Show Watched Gear." |
| P2 | Back-to-top placement | Codex | Back-to-top button is centered near the bottom and avoids pagination/actions. |
| P2 | Source row default | Codex | Source pills are visible on homepage load unless the user explicitly hides them. |

## Design Polish

| Priority | Item | Owner | Acceptance |
| --- | --- | --- | --- |
| P2 | Top nav hover states | Codex | Saved, Watching, theme, Settings, and related header controls have consistent hover/focus treatment. |
| P2 | Mobile saved-search prominence | Codex + Craig review | Mobile keeps Saved as an obvious pill while secondary controls remain accessible without crowding the header. |

## Future Feature Queue

| Idea | Notes |
| --- | --- |
| Shared search packs / synth collections | Let users share saved-search bundles or personal synth collections later. |
| Instrument fact ticker | When searching `ARP 2600`, Brrtz can show a subtle rotating fact or context line. |
| Predictive synth suggestions | Search assist such as `ARP` -> `Odyssey`, inspired by premium marketplace search UX. |

## Recommended Work Order

1. Fix Chrome Browse dropdown stability.
2. Fix multi-word search fidelity.
3. Guard and verify cloud sync profile application.
4. Clean up save/settings UX.
5. Finish quick UI wins.
6. Build the expanded Synth Browser latest feed.
7. Tighten the newness model.
