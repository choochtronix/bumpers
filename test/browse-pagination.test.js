import test from "node:test";
import assert from "node:assert/strict";

import {
  BROWSE_MAX_SOURCE_PAGE,
  createBrowseCursor,
  getBrowsePageStart,
  getNextBrowsePageState,
  parseBrowseCursor,
} from "../src/browse/browsePagination.js";

test("browse cursors roundtrip only for the requested region and category", () => {
  const cursor = createBrowseCursor({
    regionId: "japan",
    categoryIntent: "synthesizers",
    page: 2,
  });

  assert.deepEqual(
    parseBrowseCursor(cursor, {
      regionId: "japan",
      categoryIntent: "synthesizers",
    }),
    {
      ok: true,
      state: {
        regionId: "japan",
        categoryIntent: "synthesizers",
        page: 2,
      },
    },
  );
  assert.equal(
    parseBrowseCursor(cursor, {
      regionId: "uk",
      categoryIntent: "synthesizers",
    }).ok,
    false,
  );
});

test("malformed and first-page cursors are rejected", () => {
  assert.equal(
    parseBrowseCursor("not-a-cursor", {
      regionId: "japan",
      categoryIntent: "synthesizers",
    }).ok,
    false,
  );

  const firstPageCursor = createBrowseCursor({
    regionId: "japan",
    categoryIntent: "synthesizers",
    page: 1,
  });
  assert.equal(
    parseBrowseCursor(firstPageCursor, {
      regionId: "japan",
      categoryIntent: "synthesizers",
    }).ok,
    false,
  );
});

test("Yahoo-style page starts advance without overlap", () => {
  assert.equal(getBrowsePageStart(1, 100), 1);
  assert.equal(getBrowsePageStart(2, 100), 101);
  assert.equal(getBrowsePageStart(3, 100), 201);
});

test("short pages end pagination and the safety ceiling is enforced", () => {
  assert.deepEqual(
    getNextBrowsePageState({ page: 2, resultCount: 99, pageSize: 100 }),
    { hasMore: false, nextPage: null },
  );
  assert.deepEqual(
    getNextBrowsePageState({
      page: BROWSE_MAX_SOURCE_PAGE,
      resultCount: 100,
      pageSize: 100,
    }),
    { hasMore: false, nextPage: null },
  );
});
