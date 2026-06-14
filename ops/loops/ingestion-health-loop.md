# Ingestion Health Loop

## Purpose

Keep listing data fresh and reliable.

## Inputs

- Failed fetches.
- Sudden drop in listing count.
- Empty responses.
- Changed page layouts.
- Duplicate listings.
- Bad price parsing.
- Bad image parsing.
- Stale listings.

## Workflow

1. Identify the unhealthy source.
2. Compare expected vs actual listing count.
3. Determine failure type.
4. Patch the affected source adapter only.
5. Add or update tests if practical.
6. Update source-health report.

## Common Failure Types

- Source layout changed.
- Selector broke.
- Rate limit or blocked request.
- Parser error.
- Encoding issue.
- Pagination issue.
- Date parsing issue.
- Duplicate normalization issue.

## Definition Of Done

- Affected source fixed or paused.
- Cause documented.
- Health report updated.
- No unrelated sources modified.
