import { test } from "node:test";
import assert from "node:assert/strict";

import "../listing-freshness.js";

const {
  compareListingsBySourceDate,
  evolveListingFreshnessState,
  getListingNewBadgeEligibility,
  normalizeSourceListedAt,
} = globalThis.BrrtzListingFreshness;

const LISTING = {
  id: "yahoo-auctions-a1",
  source: "yahoo-auctions",
  title: "Moog Voyager",
  price: 250000,
  condition: "Used",
  availability: "active",
};

test("unknown source dates remain unknown instead of becoming scan time", () => {
  assert.equal(normalizeSourceListedAt(""), "");
  assert.equal(normalizeSourceListedAt("not-a-date"), "");

  const entry = evolveListingFreshnessState(LISTING, {}, {
    now: "2026-07-20T01:00:00.000Z",
    observedAt: "2026-07-20T01:00:00.000Z",
  });

  assert.equal(entry.listedAt, "");
  assert.equal(entry.sourceDateStatus, "unknown");
  assert.equal(entry.firstSeenAt, "2026-07-20T01:00:00.000Z");
});

test("unchanged repeat scans preserve first discovery and age the listing", () => {
  const first = evolveListingFreshnessState(LISTING, {}, {
    now: "2026-07-20T01:00:00.000Z",
    observedAt: "2026-07-20T01:00:00.000Z",
    presented: true,
  });
  const repeated = evolveListingFreshnessState(LISTING, first, {
    now: "2026-07-21T01:00:00.000Z",
    observedAt: "2026-07-21T01:00:00.000Z",
    presented: true,
  });

  assert.equal(repeated.firstSeenAt, first.firstSeenAt);
  assert.equal(repeated.lastSeenAt, "2026-07-21T01:00:00.000Z");
  assert.equal(repeated.lastChangedAt, first.lastChangedAt);
  assert.equal(repeated.unchangedScanCount, 1);
  assert.equal(repeated.presentationCount, 2);
});

test("price changes are recorded without making the listing newly discovered", () => {
  const first = evolveListingFreshnessState(LISTING, {}, {
    now: "2026-07-20T01:00:00.000Z",
    observedAt: "2026-07-20T01:00:00.000Z",
  });
  const changed = evolveListingFreshnessState({ ...LISTING, price: 225000 }, first, {
    now: "2026-07-21T01:00:00.000Z",
    observedAt: "2026-07-21T01:00:00.000Z",
  });

  assert.equal(changed.firstSeenAt, first.firstSeenAt);
  assert.equal(changed.lastChangedAt, "2026-07-21T01:00:00.000Z");
  assert.equal(changed.changeCount, 1);
  assert.equal(changed.unchangedScanCount, 0);
  assert.deepEqual(changed.priceHistory.map((entry) => entry.price), [250000, 225000]);
});

test("known source dates sort ahead of unknown dates", () => {
  const known = { listedAt: "2026-07-19T00:00:00.000Z" };
  const unknown = { listedAt: "" };
  assert.ok(compareListingsBySourceDate(known, unknown) < 0);
  assert.ok(compareListingsBySourceDate(unknown, known) > 0);
  assert.equal(compareListingsBySourceDate(unknown, unknown), 0);
});

test("UI interactions do not masquerade as another source observation", () => {
  const first = evolveListingFreshnessState(LISTING, {}, {
    now: "2026-07-20T01:00:00.000Z",
    observedAt: "2026-07-20T01:00:00.000Z",
  });
  const interacted = evolveListingFreshnessState(LISTING, first, {
    now: "2026-07-21T01:00:00.000Z",
    observed: false,
  });

  assert.equal(interacted.lastSeenAt, first.lastSeenAt);
  assert.equal(interacted.scanCount, first.scanCount);
  assert.equal(interacted.unchangedScanCount, first.unchangedScanCount);
});

test("New badge requires both a recent source date and a recent discovery", () => {
  const state = getListingNewBadgeEligibility({
    ...LISTING,
    listedAt: "2026-07-21T12:00:00.000Z",
  }, {
    firstDiscoveredAt: "2026-07-21T13:00:00.000Z",
  }, {
    now: "2026-07-22T12:00:00.000Z",
  });

  assert.equal(state.showsNewBadge, true);
  assert.equal(state.reason, "recent-source");
});

test("month-old marketplace listings cannot receive the New badge", () => {
  const state = getListingNewBadgeEligibility({
    ...LISTING,
    listedAt: "2026-06-01T12:00:00.000Z",
  }, {
    firstDiscoveredAt: "2026-07-22T11:00:00.000Z",
  }, {
    now: "2026-07-22T12:00:00.000Z",
  });

  assert.equal(state.showsNewBadge, false);
  assert.equal(state.isSourceFresh, false);
});

test("unknown-age listings are New only after a baseline and for 24 hours", () => {
  const firstBaseline = getListingNewBadgeEligibility(LISTING, {}, {
    now: "2026-07-22T12:00:00.000Z",
    isNewDiscovery: true,
    discoveredAfterBaseline: false,
  });
  const postBaseline = getListingNewBadgeEligibility(LISTING, {}, {
    now: "2026-07-22T12:00:00.000Z",
    isNewDiscovery: true,
    discoveredAfterBaseline: true,
  });
  const expired = getListingNewBadgeEligibility(LISTING, {
    firstDiscoveredAt: "2026-07-20T12:00:00.000Z",
    discoveredAfterBaseline: true,
  }, {
    now: "2026-07-22T12:00:00.000Z",
  });

  assert.equal(firstBaseline.showsNewBadge, false);
  assert.equal(postBaseline.showsNewBadge, true);
  assert.equal(postBaseline.reason, "recent-discovery");
  assert.equal(expired.showsNewBadge, false);
});

test("seen listings never retain the New badge", () => {
  const state = getListingNewBadgeEligibility({
    ...LISTING,
    listedAt: "2026-07-22T10:00:00.000Z",
  }, {
    firstDiscoveredAt: "2026-07-22T10:30:00.000Z",
  }, {
    now: "2026-07-22T12:00:00.000Z",
    isSeen: true,
  });

  assert.equal(state.showsNewBadge, false);
});
