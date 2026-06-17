# Brrtz Browse Category Verification

Last updated: 2026-06-17

This document records which Brrtz browse categories are backed by verified source category IDs and which are currently keyword-backed. It is meant to keep the Synth Browser feature honest as we add sources and regions.

## Current Beta Rule

Brrtz should prefer exact source category IDs when a source exposes a useful musical-instrument branch. When the source does not expose a clean branch, Brrtz should use carefully chosen search terms plus Gear Mode filtering rather than forcing a weak category match.

## Japan

### Yahoo Auctions

Verified live category pages:

| Brrtz category intent | Yahoo Auctions category ID | Yahoo category label | Current Brrtz behavior |
| --- | --- | --- | --- |
| `all` | Multiple verified categories | Synthesizers + rhythm machines | Aggregates the verified fast synth-centric branches for homepage browsing |
| `synthesizers` | `2084019003` | `キーボード、シンセサイザー` | Exact category browse and search sweep |
| `drum-machines` | `2084019005` | `リズムマシン` | Exact category browse and search sweep |
| `pro-audio` | `2084019010` | `レコーディング、PA機器` | Exact category browse and search sweep |
| Musical instruments root | `22436` | `楽器、器材` | Broad fallback sweep for searches |
| Keyboard instruments parent | `22532` | `鍵盤楽器` | Reference only |
| DTM/DAW parent | `22544` | `DTM、DAW` | Reference only |
| DJ equipment | `2084261081` | `DJ機器` | Reference only |

Verified URLs:

- `https://auctions.yahoo.co.jp/list5/22436-category.html`
- `https://auctions.yahoo.co.jp/list5/2084019003-category.html`
- `https://auctions.yahoo.co.jp/list5/2084019005-category.html`
- `https://auctions.yahoo.co.jp/list5/2084019010-category.html`

Keyword-backed category intents:

| Brrtz category intent | Reason | Current seed terms |
| --- | --- | --- |
| `samplers` | No clean public Yahoo category branch found in the verified parent pages. | `sampler`, `サンプラー`, `akai mpc`, `sp-404` |
| `sequencers` | No clean public Yahoo category branch found in the verified parent pages. | `sequencer`, `シーケンサー`, `step sequencer` |
| `modular` | No clean public Yahoo category branch found in the verified parent pages. | `eurorack`, `modular synth`, `モジュラーシンセ`, `ユーロラック` |
| `effects-pedals` | Yahoo exposes some instrument-specific effects branches, but no broad synth/pro-audio effects branch has been verified yet. | `effects pedal`, `delay pedal`, `reverb pedal`, `エフェクター`, `ディレイ` |

### Other Japan Sources

| Source | Category browse status |
| --- | --- |
| Mercari | Keyword search plus Gear Mode. Exact category browse not verified. |
| Rakuma | Keyword search plus Gear Mode. Exact category browse not verified. |
| Yahoo Fleamarket | Keyword search plus Gear Mode. Exact category browse not verified. |
| Digimart | Keyword search plus Gear Mode. Digimart category-specific browsing is a future candidate. |
| OFFMALL / Hard Off | Keyword search plus Gear Mode. Category-specific browsing is a future candidate. |
| Five G / implant4 | Keyword search. Inventory is sparse enough that category browse is lower priority. |
| Reverb Japan | Keyword search filtered to Japan listings. Category browse is a future candidate. |

## United States Beta Regions

Current US beta regions use keyword-backed category browse across API/search-friendly sources. They do not yet have exact category browse parity with Japan's Yahoo Auctions category IDs.

| Region | Source | Category browse status |
| --- | --- | --- |
| Bay Area | Reverb US | Keyword-backed browse terms filtered to US listings. Reverb category browse/API expansion is planned. |
| Bay Area | eBay US | Keyword-backed browse terms filtered to US item location and default category `619` (`Musical Instruments & Gear`). |
| Bay Area | Craigslist SF Bay | Parked as manual Craigslist Assist deep links. Brrtz does not query Craigslist automatically in beta. |
| Los Angeles | Reverb US | Keyword-backed browse terms filtered to US listings. Reverb category browse/API expansion is planned. |
| Los Angeles | eBay US | Keyword-backed browse terms filtered to US item location and default category `619` (`Musical Instruments & Gear`). |
| Los Angeles | Craigslist LA | Parked as manual Craigslist Assist deep links. Brrtz does not query Craigslist automatically in beta. |

Current US browse seed terms:

| Brrtz category intent | US beta seed terms |
| --- | --- |
| `all` | `synthesizer`, `drum machine`, `sampler`, `sequencer`, `eurorack` |
| `synthesizers` | `synthesizer`, `analog synth`, `vintage synth` |
| `drum-machines` | `drum machine`, `rhythm machine`, `analog drum machine` |
| `samplers` | `sampler`, `akai mpc`, `sp-404` |
| `sequencers` | `sequencer`, `step sequencer`, `midi sequencer` |
| `modular` | `eurorack`, `modular synth`, `synth module` |
| `effects-pedals` | `synth pedal`, `delay pedal`, `reverb pedal` |
| `pro-audio` | `audio interface`, `mixer`, `compressor`, `preamp` |

## Follow-Up Candidates

- Verify Digimart category URLs for synthesizers, samplers, drum machines, modular, and pro audio.
- Verify Reverb Browse/API categories once the US source layer is expanded.
- Consider more specific eBay Browse API category IDs if broad category `619` lets in too much noise.
- Keep Craigslist as manual assist unless a low-risk access path is confirmed.
