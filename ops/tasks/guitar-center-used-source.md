# Guitar Center Used Source Scout

Status: beta-assist-implemented
Owner: Codex
Region target: Bay Area, Los Angeles, future US/global
Source key: `guitar-center-used`

## Goal

Evaluate Guitar Center Used as the next US-region Brrtz source after eBay US and Reverb US. Prefer a low-risk path that helps beta users reach relevant used-gear inventory without account automation or scraper risk.

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

## Scout Result

- `robots.txt` disallows broad search and query/category surfaces such as `/search`, `/browse`, `/*?*N=*`, and `/*?*q=*`.
- Direct server fetch to `https://www.guitarcenter.com/Used/Synthesizers-Sound-Modules.gc` returned an access-denied response.
- Beta decision: ship Guitar Center as a manual category assist, not as an automated listing connector.

## Current v1 Behavior

- Source appears in Bay Area and Los Angeles beta regions.
- Source pill uses manual assist status and opens the best Guitar Center Used category for the current search intent.
- Category mapping:
  - Synth/default: `https://www.guitarcenter.com/Used/Synthesizers-Sound-Modules.gc`
  - Drum machines / samplers: `https://www.guitarcenter.com/Used/Drum-Machines-Samplers.gc`
  - Keyboards / MIDI: `https://www.guitarcenter.com/Used/Keyboards-MIDI.gc`
- No server-side Guitar Center fetching is performed.

## Agentic Team Tasks

- [x] Scout page access and robots posture.
- [x] Choose beta-safe manual assist mode.
- [x] Add `guitar-center-used` to the source registry.
- [x] Add source identity to Brrtz UI.
- [x] Add Bay Area and Los Angeles region availability.
- [x] Add server manual URL response with category-intent mapping.
- [ ] Promote beyond manual assist only if a compliant API or stable permissioned feed appears.

## Craig Tasks

1. In Bay Area, search `drum machine` and click the Guitar Center source pill. Confirm it opens Guitar Center Used drum machines / samplers.
2. In Bay Area, search `Waldorf` or `synthesizer` and click the Guitar Center source pill. Confirm it opens Guitar Center Used synthesizers / sound modules.
3. Switch to Los Angeles and repeat one Guitar Center source-pill click.
4. Decide whether this manual assist is useful enough for beta testers, even though it does not populate cards yet.

## Future Acceptance For Automated Connector

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
