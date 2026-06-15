# Guitar Center Used Source Scout

Status: ready-for-scout
Owner: Codex
Region target: Bay Area, Los Angeles, future US/global
Source key: `guitar-center-used`

## Goal

Evaluate Guitar Center Used as the next US-region Brrtz source after eBay US and Reverb US. Prefer a low-risk connector that reads public used-gear listings without account automation.

## Why This Source

- Large US used inventory.
- Music-gear-specific enough to be useful.
- Likely stronger signal than general social marketplaces.
- Lower beta risk than Facebook Marketplace or Craigslist scraping.

## First Scout Questions

1. Does Guitar Center Used expose stable public search/category URLs for synthesizers, keyboards, drum machines, and sound modules?
2. Are listing cards rendered server-side enough for respectful fetch/parse, or do they require browser rendering?
3. Are useful fields visible without product-detail navigation: title, price, image, location, URL, condition?
4. Can we filter to used inventory and relevant categories without scraping broad retail pages?
5. Does `robots.txt` or site behavior suggest this should be manual/deep-link only?

## Candidate Seed URLs

- `https://www.guitarcenter.com/Used/Synthesizers-Sound-Modules.gc`
- `https://www.guitarcenter.com/Used/Keyboards-MIDI.gc`
- `https://www.guitarcenter.com/Used/Drum-Machines-Samplers.gc`

## Acceptance For v1 Connector

- Returns at least 10 useful synth/pro-audio listings for broad terms like `synthesizer`, `drum machine`, and `Roland`.
- Does not require user login.
- Uses conservative request rates and short caching.
- Produces normalized listings compatible with Brrtz cards and list view.
- Shows a clear setup/parked status if source behavior becomes unreliable.
- Passes a golden search entry before being enabled in a beta region.

## Implementation Loop

1. Scout page structure and access safety.
2. Decide connector mode: direct fetch, browser-assisted, or manual deep-link.
3. Add source registry entry as `candidate` or `testing`.
4. Add connector behind a source flag.
5. Add golden searches for Bay Area and Los Angeles.
6. Promote to beta only after source-health checks are stable.

## Notes

Do not add Facebook Marketplace scraping as a shortcut for this task. Facebook can remain a manual/deep-link assist until there is a clear compliant path.
