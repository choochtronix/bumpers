# Saved Search Cloud Schema

Bumpers saved searches now use a cloud-ready record shape while still storing data locally in `localStorage` under `bumpers.profiles`.

## Current Storage Mode

- Active store: browser `localStorage`
- Local key: `bumpers.profiles`
- Sync provider: `local`
- App boundary: `savedSearchRepository` in `app.js`
- Future provider target: Supabase, Firebase, Cloudflare, or a custom API
- Import/export: JSON files using the same record shape

## Repository Contract

The UI should read and write saved searches through `savedSearchRepository`, not direct `localStorage` calls. Today it is backed by local storage, but the method shape is intentionally cloud-friendly:

- `list()` returns hydrated saved searches.
- `save(profile)` creates or updates a search and marks it as locally changed.
- `deleteByName(name)` removes a local saved search.
- `updateScan(profile, scanSummary)` stores daily radar scan metadata.
- `previewMerge(importedProfiles)` checks import conflicts and builds a merged list.
- `replaceAll(profiles)` writes a hydrated list.
- `createExportPayload()` returns the backup JSON payload.

The repository persists only the saved-search fields listed in this document plus small scan counters. It intentionally drops bulky runtime fields such as listing arrays, thumbnails, source payloads, or cache objects. If browser storage is full, saved-search writes reclaim disposable result-cache space before retrying.

## Record Shape

```json
{
  "id": "search_...",
  "schemaVersion": 1,
  "userId": "local",
  "name": "Oberheim",
  "terms": ["Oberheim"],
  "excludes": ["manual", "record"],
  "noiseTerms": ["adapter", "book", "cable"],
  "sources": ["mercari", "yahoo-auctions", "digimart"],
  "maxPrice": 2000000,
  "alertMode": "immediate",
  "createdAt": "2026-06-01T00:00:00.000Z",
  "updatedAt": "2026-06-01T00:00:00.000Z",
  "deletedAt": null,
  "sync": {
    "provider": "local",
    "remoteId": null,
    "status": "local",
    "lastSyncedAt": null,
    "lastLocalChangeAt": "2026-06-01T00:00:00.000Z"
  },
  "lastScannedAt": "2026-06-01T00:00:00.000Z",
  "lastMatchCount": 42,
  "lastNewCount": 3,
  "lastSourceCount": 5,
  "lastScanStatus": "ok"
}
```

## Future Cloud Table

Recommended table name: `saved_searches`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | text / uuid | Stable saved-search id |
| `user_id` | text / uuid | Owner account id |
| `schema_version` | integer | Starts at `1` |
| `name` | text | User-facing saved-search name |
| `terms` | json | Primary and refinement search terms |
| `excludes` | json | User exclusions |
| `noise_terms` | json | Clean Gear noise terms |
| `sources` | json | Enabled source ids |
| `max_price` | integer | JPY cap |
| `alert_mode` | text | `immediate`, `hourly`, or `daily` |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last local or cloud mutation |
| `deleted_at` | timestamp nullable | Soft-delete for cross-device sync |
| `last_scanned_at` | timestamp nullable | Latest radar scan time |
| `last_match_count` | integer | Latest scan result count |
| `last_new_count` | integer | Latest new listing count |
| `last_source_count` | integer | Latest source count |
| `last_scan_status` | text nullable | `ok`, `partial`, or error status |

## Fallback Rule

Until login/cloud sync exists, the app treats `localStorage` as the source of truth. Cloud sync can later be added by reading/writing this same record shape through a repository layer:

1. Load local records immediately.
2. If a user is logged in, fetch cloud records.
3. Merge by `id`, falling back to `name` for older imports.
4. Prefer the record with the newest `updatedAt`.
5. Write merged records back to local storage.

Current import/export already hydrates older local records into this schema. Imports replace matching saved searches by `id` first, then by normalized `name`.
