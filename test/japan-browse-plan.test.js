import test from "node:test";
import assert from "node:assert/strict";

import {
  JAPAN_BROWSE_SOURCE_IDS,
  getJapanBrowseSourceIds,
  getJapanBrowseTerms,
} from "../src/browse/japanBrowsePlan.js";

test("Japan Gear Scanner first page includes every non-Yahoo category source", () => {
  assert.deepEqual(getJapanBrowseSourceIds(), JAPAN_BROWSE_SOURCE_IDS);
  assert.ok(getJapanBrowseSourceIds().includes("mercari"));
  assert.ok(getJapanBrowseSourceIds().includes("yahoo-fleamarket"));
  assert.ok(getJapanBrowseSourceIds().includes("digimart"));
  assert.ok(!getJapanBrowseSourceIds().includes("yahoo-auctions"));
});

test("Japan Gear Scanner does not repeat multi-source sweeps on deep pages or brand browse", () => {
  assert.deepEqual(getJapanBrowseSourceIds({ page: 2 }), []);
  assert.deepEqual(getJapanBrowseSourceIds({ hasBrandTerms: true }), []);
});

test("Japan Gear Scanner uses localized discovery terms for each category", () => {
  assert.deepEqual(getJapanBrowseTerms("synthesizers"), ["シンセサイザー"]);
  assert.deepEqual(getJapanBrowseTerms("drum-machines"), ["リズムマシン"]);
  assert.deepEqual(getJapanBrowseTerms("all"), ["シンセサイザー", "リズムマシン"]);
  assert.deepEqual(getJapanBrowseTerms("unknown"), ["シンセサイザー"]);
});
