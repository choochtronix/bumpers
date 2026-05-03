# Bumpers

Local-first search cockpit for finding synthesizers, electronic instruments, and pro audio gear across Japanese auction, flea market, and shop sources.

## Current Version

This first build is a static desktop web app prototype. It includes:

- Saved search profiles stored in local browser storage
- Source selection for the first target marketplaces
- Large thumbnail result cards
- Price filtering
- Exclusion keyword filtering
- New-listing state
- Watchlist state
- Email digest text generation
- A mock connector dataset shaped like future live connector output

## Open The App

Open `index.html` in a browser.

## Connector Model

Every live source should return normalized listing objects:

```js
{
  id: "source-stable-listing-id",
  source: "mercari",
  title: "Listing title",
  price: 120000,
  condition: "動作品",
  listedAt: "2026-05-03T09:30:00+09:00",
  url: "https://source.example/listing",
  image: "https://source.example/thumb.jpg"
}
```

## Next Live Connector Order

1. Digimart
2. OFFMALL / Hard Off Net Mall
3. Five G
4. implant4
5. Yahoo Auctions
6. Mercari
7. Yahoo Fleamarket
8. Rakuma

Start with gear-specific shops before the larger marketplaces because they are more relevant and usually easier to validate.
