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
- Live Yahoo Auctions, Digimart, and OFFMALL connector support when run through the local server
- Local listing discovery tracking for future alert workflows
- Gear confidence scoring to keep Yahoo records, books, clothing, and other marketplace noise out of Clean Gear results
- Local feedback buttons for teaching Bumpers which listings are gear, noise, or similar noise to hide

## Open The App

Open `index.html` in a browser.

For live connector data, run the local server:

```sh
npm start
```

Then open:

```text
http://localhost:5173
```

Live runs store discovered listing IDs in local browser storage. This lets Bumpers tell the difference between listings it has already found before and listings discovered on the current scan, which is the base layer for saved-search alerts.

The Daily Radar panel shows fresh discoveries from the current scan. Saved searches also keep their latest scan time, match count, and new-find count so the sidebar can act as a quick daily checklist.

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
3. Yahoo Auctions
4. Five G
5. implant4
6. Mercari
7. Yahoo Fleamarket
8. Rakuma

Start with gear-specific shops before the larger marketplaces because they are more relevant and usually easier to validate.
