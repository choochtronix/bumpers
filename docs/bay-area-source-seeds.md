# Bay Area / US Source Seeds

This document captures candidate sources for the future Bay Area and broader US region buildout. The goal is to keep Brrtz region-driven: Japan, Bay Area, LA, and future metros should be configs and connector capability sets, not separate app forks.

## Build Strategy

For beta, prioritize sources that can be useful without fragile or risky automation:

- `api`: Preferred. Stable, production-friendly, easier to monitor.
- `scrape`: Use only when public pages are stable and terms allow respectful access.
- `browser-assisted`: Useful for local/private workflows, but slower and harder to host publicly.
- `manual-link`: Safe fallback for restricted sites. Brrtz can generate the right search link and open it, but does not ingest cards yet.
- `requires-login`: Keep out of unattended public scraping until there is a clear user-assisted flow.

## Priority Source List

| Priority | Source key | Source name | Region | Type | Beta path | Seed URL | Notes |
|---|---|---|---|---|---|---|---|
| P0 | `reverb` / `reverb-us` | Reverb | US/global | Marketplace | API/live cards | https://reverb.com/marketplace?query=synth | Best broad source for used, new, and vintage synths, samplers, drum machines. Existing Japan Reverb connector can likely be adapted. |
| P0 | `craigslist-sfbay` | Craigslist SF Bay Area | Bay Area | Classifieds | Manual-link first | https://sfbay.craigslist.org/search/msa?query=synth | Essential local used gear source. Add live connector only after reviewing safe access path. |
| P0 | `craigslist-la` | Craigslist Los Angeles | Los Angeles | Classifieds | Manual-link first | https://losangeles.craigslist.org/search/msa?query=synth | Very strong synth market. |
| P0 | `craigslist-oc` | Craigslist Orange County | Orange County | Classifieds | Manual-link first | https://orangecounty.craigslist.org/search/msa?query=synth | Good spillover from LA and SoCal. |
| P0 | `craigslist-sd` | Craigslist San Diego | San Diego | Classifieds | Manual-link first | https://sandiego.craigslist.org/search/msa?query=synth | Good SoCal coverage. |
| P0 | `facebook-marketplace` | Facebook Marketplace Musical Instruments | Local/social | Marketplace | Manual-link / user-assisted | https://www.facebook.com/marketplace/category/instruments/ | High signal but difficult to crawl cleanly. Likely requires a user-assisted strategy. |
| P0 | `offerup` | OfferUp | Local/social | Marketplace | Manual-link / user-assisted | https://offerup.com/search?q=synth | High local signal; app-first and crawl-friction likely. |
| P1 | `guitar-center-used-synths` | Guitar Center Used Synths | US/store network | Retailer-used | Research connector | https://www.guitarcenter.com/Used/Synthesizers-Sound-Modules.gc | High inventory; useful filters. |
| P1 | `sweetwater-gear-exchange` | Sweetwater Gear Exchange | US | Marketplace-used | Research connector | https://www.sweetwater.com/used/listings | Used peer-to-peer music gear. |
| P0 | `ebay-us` | eBay Synthesizers | US/global | Marketplace | API/live cards | https://www.ebay.com/sch/i.html?_nkw=synthesizer | Official API connector now in beta. Useful for rare/vintage; noisy, so Gear Mode will matter. |
| P1 | `shopgoodwill` | ShopGoodwill Musical Instruments | US/auction | Auction | Research connector | https://shopgoodwill.com/categories/listing?st=synth&sg=&c=&s=&lp=0&hp=999999&sbn=false | Hidden gems; noisy/untested gear. |
| P1 | `robotspeak` | Robot Speak | San Francisco | Shop-used-new | Research connector | https://robotspeak.com/collections/used-gear | Key SF synth shop; used gear page. |
| P1 | `mission-synths` | Mission Synths | San Francisco | Shop-consignment-new | Research connector | https://www.missionsynths.com/ | SF electronic hardware and modular shop; consignment angle. |
| P1 | `perfect-circuit` | Perfect Circuit | Burbank / LA | Shop-used-new | Research connector | https://www.perfectcircuit.com/synthesizers-keyboards | Major CA synth/modular/pro-audio retailer. |
| P1 | `noisebug` | Noisebug | Pomona / SoCal | Shop-used-new | Research connector | https://www.noisebug.net/ | Strong modular/synth specialty shop. |
| P1 | `analogue-haven` | Analogue Haven | Los Angeles / online | Shop-used-new | Research connector | https://www.analoguehaven.com/used/ | Used modular/synth consignments. |
| P2 | `bananas-at-large` | Bananas at Large | San Rafael / Santa Rosa | Shop-used-new | Research connector | https://www.bananas.com/collections/pre-owned-keyboard | Bay Area music shop; pre-owned keyboard/synth path. |
| P2 | `starving-musician` | The Starving Musician | Santa Clara / Bay Area | Shop-used-new | Reverb storefront first | https://reverb.com/shop/thestarvingmusician | Independent Bay Area used/new music shop. |
| P2 | `music-go-round-elk-grove` | Music Go Round Elk Grove | Sacramento area | Shop-used | Research connector | https://www.musicgoround.com/locations/elk-grove-ca | Used instruments; worth checking for keyboards/synths. |
| P2 | `modwiggler-bst` | Mod Wiggler For Sale/Trade | Forum/global | Forum-classifieds | Manual-link / community review | https://www.modwiggler.com/forum/viewforum.php?f=74 | Very high signal for Eurorack/modular; login/community restrictions. |
| P2 | `reddit-synths4sale` | Reddit r/Synths4Sale | Forum/social | Forum-classifieds | Research connector | https://www.reddit.com/r/Synths4Sale/ | Synth/pro-audio marketplace; location often appears in title. |
| P2 | `elektronauts` | Elektronauts | Forum/global | Forum-classifieds | Manual-link / community review | https://www.elektronauts.com/ | Good for Elektron gear; marketplace access may vary. |

## Recommended Bay Area Beta Source Set

For a first Bay Area beta, use a hybrid set:

- Live cards: `reverb-us`
- Parked/manual-link sources: `craigslist-sfbay`, `craigslist-la`
- Manual/search-link sources: `facebook-marketplace`, `offerup`
- Optional research target: `guitar-center-used-synths`

This gives testers real utility while avoiding a fragile launch dependency on Facebook, OfferUp, or Craigslist scraping.

June 10 update: Craigslist is intentionally parked for beta safety after local testing triggered Craigslist blocking. Keep Craigslist visible as a region source, but do not query it automatically unless `BRRTZ_CRAIGSLIST_MODE=live` is set for a controlled test window.

June 11 update: Craigslist now behaves as a manual assist source in parked mode. Brrtz generates a precise Craigslist musical-instruments search URL for the active region and query, including mapped max-price filtering where available, then opens that URL from the Craigslist source pill. Brrtz does not fetch Craigslist pages in this mode.

## Region Config Direction

Bay Area should start as a region config like this:

```js
{
  id: "bay-area",
  label: "Bay Area",
  currency: "USD",
  defaultLocale: "en-US",
  sources: [
    "reverb-us",
    "ebay-us",
    "craigslist-sfbay",
    "facebook-marketplace",
    "offerup"
  ],
  searchDefaults: {
    cleanGear: true,
    maxDistanceMiles: 75,
    maxResults: 80
  }
}
```

LA is now a sibling beta region using `craigslist-la` and `reverb-us`. SoCal can later expand with Orange County and San Diego metro presets under a broader US/California region once the first testers clarify how they browse.
