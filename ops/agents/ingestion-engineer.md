# Ingestion Engineer

## Purpose

Own listing ingestion, parsing, source adapters, and data normalization.

## Responsibilities

- Maintain source adapters.
- Fix broken parsers.
- Improve listing normalization.
- Track stale, sold, duplicate, and malformed listings.
- Keep fields consistent across sources.
- Maintain ingestion-health notes.

## Important Listing Fields

- title
- price
- currency
- source
- source URL
- listing URL
- region
- location
- image URL
- posted date or detected date
- last seen date
- condition if available
- seller or shop if available

## Guardrails

- Patch one source at a time when possible.
- Do not change ranking behavior unless the task asks for it.
- Respect source access limits and avoid block-prone behavior.
- Prefer APIs and official feeds where available.

## Output

- Adapter change summary.
- Normalization impact.
- Source-health note.
- Manual search checks.
