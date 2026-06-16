# Sweetwater Used Source Task

## Status

Beta manual assist.

## Decision

Sweetwater Used / Gear Exchange is worth exposing in US beta because it is music-gear-specific and likely useful to synth/pro-audio buyers. For now, Brrtz should not ingest Sweetwater server-side.

## Scout Notes

- `robots.txt` exposes a used sitemap reference and allows some webservice paths.
- Direct server requests to the used sitemap and used listing/search pages returned PerimeterX or 403 responses during scout.
- This makes a scraper or light connector too fragile for beta.

## Current Behavior

- Source key: `sweetwater-used`
- Regions: Bay Area, Los Angeles
- Access: manual search assist
- Brrtz builds a prepared Sweetwater Used URL:
  - `https://www.sweetwater.com/used/listings?query=<term>`
- The source pill opens Sweetwater in the user browser.

## Future Work

- Revisit if Sweetwater provides an official, permitted partner/API path.
- If a stable public feed becomes available, promote through the ingestion + relevance + QA loop before making it a counted live source.
