// Fast fixture check for the Gear Scanner classifier. Runs the exact same
// assertions as scripts/gear-scanner-curation-check.js but in plain Node —
// no dev server or Playwright needed. Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import "../gear-scanner-curation.js";

const { classifyGearScannerListing } = globalThis.BrrtzGearScannerCuration;
const fixtures = JSON.parse(
  fs.readFileSync(new URL("./fixtures/gear-scanner-curation.json", import.meta.url), "utf8")
);

// Same listing shape the browser check script builds: fresh, priced, with image.
function makeListing(title, index) {
  return {
    id: `fixture-${index}`,
    source: "yahoo-auctions",
    region: "japan",
    currency: "JPY",
    title,
    price: 120000,
    condition: "Used",
    listedAt: new Date().toISOString(),
    url: `https://example.com/listing/${index}`,
    image: "https://example.com/image.jpg",
  };
}

test("unwanted listings are hard-excluded from Gear Scanner", () => {
  fixtures.excluded.forEach((title, index) => {
    const result = classifyGearScannerListing(makeListing(title, index));
    assert.equal(result.hardExcluded, true, `Expected hard exclude: ${title} :: ${result.reasons.join("; ")}`);
    assert.equal(result.include, false, `Expected not included: ${title} :: ${result.reasons.join("; ")}`);
  });
});

test("real gear listings stay included", () => {
  fixtures.included.forEach((title, index) => {
    const result = classifyGearScannerListing(makeListing(title, index + fixtures.excluded.length));
    assert.equal(result.hardExcluded, false, `Expected no hard exclude: ${title} :: ${result.reasons.join("; ")}`);
    assert.equal(result.include, true, `Expected included (score ${result.score}): ${title} :: ${result.reasons.join("; ")}`);
  });
});
