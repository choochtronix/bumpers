# Gear Scanner Pagination

Gear Scanner uses progressive client rendering plus server-owned source
pagination.

## Current Contract

- The first browse request returns the newest source page.
- The response includes `meta.pagination.nextCursor` when an older page exists.
- The browser requests one older page only when the rendered pool is nearly
  exhausted.
- New pages are deduplicated by stable listing ID, globally sorted by source
  listing time, filtered through Gear Mode, and appended in 24-card batches.
- Grid, List, and Gallery reuse the same accumulated pool.
- Rescan, region changes, category changes, and brand changes cancel pending
  page requests and discard their cursors.

## Source Coverage

Yahoo Auctions category browsing supports deep pagination in Japan. Its
source offset advances in 100-listing pages while the public cursor remains
opaque to the browser.

Brand Browser searches and sources without a reliable paging contract remain
finite. Add future sources behind the same server cursor response rather than
putting marketplace-specific page parameters in `app.js`.

## Safety

- Cursors are tied to their region and category.
- Invalid or mismatched cursors return HTTP 400.
- A scan is capped at 100 source pages.
- Full listing databases are not persisted; pages are fetched on demand and
  continue linking users to the original marketplace.
