# Brrtz Agent Connector Spec

Date: 2026-06-26
Status: Draft

## Purpose

Define the first useful Brrtz agent connector before implementation. This should guide a future MCP server that lets users connect ChatGPT, Claude, or another agent to Brrtz with explicit permission.

## Current Beta Capability

Brrtz currently supports shareable search URLs:

```txt
https://brrtz.com/search?q=moog%20voyager&region=bay-area&category=synthesizers
```

This is the safe public bridge for agents during beta.

## Candidate Tools

| Tool | Purpose | Permission |
|---|---|---|
| `search_gear` | Search by terms, region, category, source selection, max price, and excludes. | Read-only |
| `get_regions` | Return region IDs, labels, currencies, statuses, and source coverage. | Read-only |
| `get_sources` | Return source IDs, labels, regions, access posture, and live/assist status. | Read-only |
| `save_search` | Create or update a saved search intent for a signed-in user. | User-authorized write |
| `watch_listing` | Add a listing URL or normalized listing ID to a user's watchlist. | User-authorized write |
| `get_new_matches` | Return new or fresh matches for a saved search since the last scan. | User-authorized read |

## Tool Shape

### `search_gear`

Required input:

- `terms`: array of strings

Optional input:

- `region`: one of `japan`, `bay-area`, `los-angeles`, `east-coast`
- `category`: one of `all`, `synthesizers`, `drum-machines`, `samplers`, `modular`, `effects-pedals`, `pro-audio`
- `sources`: array of source IDs
- `maxPrice`: number
- `excludes`: array of strings

Expected output:

- normalized listing summaries
- original source URLs
- source ID and label
- region
- currency
- freshness context
- warnings for assist-style or unavailable sources

## Permission Posture

- Read-only discovery can be public or anonymous.
- Saved searches, watched items, alerts, and profile preferences require explicit user authorization.
- Private saved-search data must never be exposed to other users.
- Agents should be able to explain what they changed and why.

## Listing Boundaries

- Brrtz is not the merchant of record.
- Brrtz should link users back to original listing sources.
- Brrtz should avoid storing or republishing full source listing databases.
- Every listing returned by an agent tool should preserve source, region, currency, original URL, and freshness context.

## Public AEO Surfaces Added

- `/agent-connector`
- `/agent-tools.json`
- `/for-agents`
- `/llms.txt`

## Implementation Notes

- Start with read-only tools before write tools.
- Use existing region and source registries as the canonical source of IDs.
- Keep connector output close to the existing normalized listing shape.
- Add tests around permissions before enabling write tools.
