# Brrtz US Source Expansion Plan

Living document for prioritizing US-region Brrtz sources. Keep this updated as sources move from candidate to beta to active.

## Source Strategy

Brrtz should prefer official APIs and user-assisted deep links over brittle scraping for US sources. Local classifieds and social marketplaces can be extremely valuable, but they also carry higher account, rate-limit, and block risk.

## Priority Queue

| Priority | Source | Source key | Build method | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| P0 | eBay US | `ebay-us` | Official API connector | In progress | Best first US expansion source after Reverb. Broad inventory and stable API path. |
| P0 | Reverb US | `reverb-us` | API connector | Beta | Already live in Bay Area / Los Angeles regions. Continue tuning US relevance. |
| P0 | Facebook Marketplace | `facebook-marketplace` | Manual deep-link assist | Candidate | High local signal, but avoid scraping for beta. |
| P1 | Craigslist SF Bay | `craigslist-sfbay` | Manual deep-link assist | Parked | Keep as user-initiated search assist only after block risk. |
| P1 | Craigslist Los Angeles | `craigslist-la` | Manual deep-link assist | Parked | Same Craigslist safety posture as SF Bay. |
| P1 | Guitar Center Used | `guitar-center-used` | API investigation / light connector | Candidate | Strong used inventory, useful category structure. |
| P1 | Sweetwater Gear Exchange | `sweetwater-gear-exchange` | API investigation / light connector | Candidate | Music-gear-specific marketplace. |
| P1 | ShopGoodwill | `shopgoodwill` | Light connector | Candidate | Hidden gems, noisy categories, auctions. |
| P2 | OfferUp | `offerup` | Manual deep-link assist | Candidate | Local signal, app-first friction. |
| P2 | Perfect Circuit | `perfect-circuit` | Shop connector | Candidate | Strong LA / SoCal synth and modular signal. |
| P2 | Robot Speak | `robotspeak` | Shop connector | Candidate | Strong Bay Area synth shop. |
| P2 | Mission Synths | `mission-synths` | Shop connector | Candidate | Bay Area synth/modular shop candidate. |
| P2 | Noisebug | `noisebug` | Shop connector | Candidate | Strong SoCal synth/modular shop. |
| P2 | Analogue Haven | `analogue-haven` | Shop connector | Candidate | Used modular/synth consignments. |
| P2 | Bananas at Large | `bananas-at-large` | Shop connector | Candidate | Bay Area music shop with pre-owned keyboard/synth inventory. |
| P3 | Reddit r/Synths4Sale | `reddit-synths4sale` | Manual/community-aware | Candidate | High signal but requires community-sensitive handling. |
| P3 | Mod Wiggler BST | `modwiggler-bst` | Manual/community-aware | Candidate | High signal for modular, login/community boundaries. |
| P3 | Elektronauts | `elektronauts` | Manual/community-aware | Candidate | Good for Elektron gear, marketplace access varies. |

## Beta Build Order

1. Add `ebay-us` as a real API-backed source.
2. Add `facebook-marketplace` as a manual deep-link assist.
3. Tune `reverb-us` for Bay Area / Los Angeles search quality.
4. Keep Craigslist as deep-link assist only until a safe access path is confirmed.
5. Add one retailer/shop connector after the core US sources are stable.

## eBay Connector Notes

The eBay connector should use the official Buy Browse API, not scraping.

Required server environment variables:

```env
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_MARKETPLACE_ID=EBAY_US
```

Implementation notes:

- Use client-credentials OAuth on the server.
- Cache access tokens until near expiry.
- Search `item_summary/search` with newest-first sorting.
- Prefer US marketplace headers for US regions.
- Keep Gear Mode and Brrtz noise filtering in the shared normalization/filtering layer.
- If credentials are missing, the source should report a setup-needed error rather than silently failing.
- First beta pass keeps eBay API filters conservative: US item location and fixed-price/auction buying options. Avoid over-filtering by condition until live result behavior is verified.

## Facebook Marketplace Notes

For beta, Facebook Marketplace should be a manual/deep-link source only:

- Build a precise Marketplace search URL from the current search term.
- Let the user open Facebook directly.
- Do not scrape or automate login sessions.
