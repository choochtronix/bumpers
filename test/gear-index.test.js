// Gear Index core checks: catalog validity, model matching (clone/reissue
// exclusion, full-width Japanese titles), robust stats, and row building.
// Run with: npm test
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  GEAR_INDEX_REGIONS,
  buildGearIndexPlan,
  buildGearIndexRow,
  computeGearIndexStats,
  filterGearIndexListings,
  matchesGearIndexModel,
  normalizeGearIndexText,
  validateGearIndexCatalog,
} from "../src/gear-index/gearIndexCore.js";

const catalog = JSON.parse(
  fs.readFileSync(new URL("../src/gear-index/catalog.json", import.meta.url), "utf8")
);
const modelBySlug = new Map(catalog.map((model) => [model.slug, model]));

function makeListing(title, price, overrides = {}) {
  return {
    id: `gear-index-${title}-${price}`,
    source: "yahoo-auctions",
    region: "japan",
    currency: "JPY",
    title,
    price,
    condition: "Used",
    listedAt: new Date().toISOString(),
    url: "https://example.com/listing",
    image: "https://example.com/image.jpg",
    ...overrides,
  };
}

test("gear index catalog is valid", () => {
  assert.deepEqual(validateGearIndexCatalog(catalog), []);
});

test("normalization folds case, width, and separators", () => {
  assert.equal(normalizeGearIndexText("ＴＲ－８０８"), "tr808");
  assert.equal(normalizeGearIndexText("Jupiter - 8"), "jupiter8");
  assert.equal(normalizeGearIndexText("cs_80 / mint"), "cs80mint");
});

test("real listings match their model", () => {
  const cases = [
    ["roland-jupiter-8", "Roland JUPITER-8 アナログシンセサイザー 動作確認済み"],
    ["roland-jupiter-8", "ローランド ジュピター8 ヴィンテージ"],
    ["roland-tr-808", "Roland ＴＲ－８０８ Rhythm Composer"],
    ["yamaha-cs-80", "YAMAHA CS-80 vintage synthesizer serviced"],
    ["moog-minimoog", "Moog Minimoog Model D 1974"],
    ["sequential-prophet-5", "Sequential Circuits Prophet-5 Rev 3.3"],
    ["oberheim-ob-xa", "Oberheim OB-Xa 8 voice"],
    ["arp-2600", "ARP 2600 with 3620 keyboard"],
  ];
  for (const [slug, title] of cases) {
    const result = matchesGearIndexModel(modelBySlug.get(slug), title);
    assert.equal(result.matched, true, `${slug} should match: ${title} (${result.reason})`);
  }
});

test("clones, reissues, and near-miss models are excluded", () => {
  const cases = [
    ["roland-jupiter-8", "Roland Jupiter-80 Synthesizer"],
    ["roland-jupiter-8", "Roland Boutique JP-08"],
    ["roland-jupiter-8", "Arturia Jupiter-8V plugin license"],
    ["yamaha-cs-80", "Peavey CS-800 power amplifier"],
    ["yamaha-cs-80", "Deckard's Dream MK2 CS-80 style synth"],
    ["roland-tr-808", "Behringer RD-8 Rhythm Designer"],
    ["roland-tr-808", "Roland TR-08 Boutique"],
    ["roland-tr-909", "Roland TR-09 Boutique"],
    ["moog-minimoog", "Moog Minimoog Voyager Electric Blue"],
    ["moog-minimoog", "Behringer Model D analog synth"],
    ["arp-2600", "Korg ARP 2600 M reissue"],
    ["arp-2600", "Behringer 2600 blue marvin"],
    ["oberheim-ob-xa", "Behringer UB-Xa polysynth"],
    ["oberheim-ob-xa", "Oberheim OB-X8 new"],
    ["sequential-prophet-5", "Sequential Prophet-5 Rev4 2021"],
    ["sequential-prophet-5", "Sequential Prophet-600 vintage"],
    ["roland-jupiter-8", "Kiev 4 キエフ フィルムカメラ Jupiter-8M 50mm F2 レンズ付"],
    ["roland-jupiter-8", "ほぼ新品の ジュピター8 Jupiter 50mm Leica L/M39 SONNAR #2503B"],
  ];
  for (const [slug, title] of cases) {
    const result = matchesGearIndexModel(modelBySlug.get(slug), title);
    assert.equal(result.matched, false, `${slug} should NOT match: ${title} (${result.reason})`);
  }
});

test("IQR trim keeps the median honest against outliers", () => {
  const stats = computeGearIndexStats([100, 110, 120, 130, 5000]);
  assert.equal(stats.sampleCount, 5);
  assert.equal(stats.trimmedCount, 4);
  assert.equal(stats.median, 115);
  assert.equal(stats.max, 130);
});

test("stats handle empty and single-price sets", () => {
  assert.equal(computeGearIndexStats([]).median, null);
  const single = computeGearIndexStats([1200]);
  assert.equal(single.median, 1200);
  assert.equal(single.sampleCount, 1);
});

test("listing filter drops unpriced, mismatched, and out-of-band listings", () => {
  const model = modelBySlug.get("roland-jupiter-8");
  const fxRates = { JPY: 150 };
  const listings = [
    makeListing("Roland Jupiter-8 動作確認済み", 8000000),
    makeListing("Roland Jupiter-8 no price", 0),
    makeListing("Roland Jupiter-80 workstation", 200000),
    makeListing("Jupiter-8 パネル用ツマミ 1個", 3000),
  ];
  const { kept, dropped } = filterGearIndexListings(model, listings, { fxRates });
  assert.equal(kept.length, 1);
  assert.equal(dropped.noPrice, 1);
  assert.equal(dropped.modelMismatch, 1);
  assert.equal(dropped.priceOutOfBand, 1);
});

test("listings without a currency field fall back to the region currency", () => {
  const model = modelBySlug.get("roland-tr-808");
  const region = GEAR_INDEX_REGIONS.find((entry) => entry.id === "japan");
  const listings = [
    makeListing("Roland TR-808 動作品", 450000, { currency: undefined }),
    makeListing("Roland TR-808 美品", 500000, { currency: undefined }),
    makeListing("Roland TR-808 整備済み", 520000, { currency: undefined }),
  ];
  const row = buildGearIndexRow({ model, region, listings, fxRates: { JPY: 150 }, day: "2026-08-08" });
  assert.equal(row.sampleCount, 3);
  assert.equal(row.medianPrice, 500000);
});

test("row builder produces a publishable snapshot", () => {
  const model = modelBySlug.get("roland-tr-808");
  const region = GEAR_INDEX_REGIONS.find((entry) => entry.id === "japan");
  const listings = [
    makeListing("Roland TR-808 動作品", 450000),
    makeListing("Roland TR-808 メンテ済み", 500000, { source: "digimart" }),
    makeListing("Roland TR-808 ジャンクではない", 550000, { source: "rakuma" }),
  ];
  const row = buildGearIndexRow({ model, region, listings, fxRates: { JPY: 150 }, day: "2026-08-08" });
  assert.equal(row.modelSlug, "roland-tr-808");
  assert.equal(row.region, "japan");
  assert.equal(row.currency, "JPY");
  assert.equal(row.sampleCount, 3);
  assert.equal(row.medianPrice, 500000);
  assert.ok(Math.abs(row.usdMedian - 500000 / 150) < 0.01);
  assert.equal(row.sourceCount, 3);
  assert.equal(row.fxRateUsd, 150);
});

test("rows below the sample floor publish counts but no prices", () => {
  const model = modelBySlug.get("yamaha-cs-80");
  const region = GEAR_INDEX_REGIONS.find((entry) => entry.id === "us");
  const listings = [makeListing("Yamaha CS-80 fully restored", 95000, { currency: "USD", region: "us" })];
  const row = buildGearIndexRow({ model, region, listings, fxRates: {}, day: "2026-08-08" });
  assert.equal(row.sampleCount, 1);
  assert.equal(row.medianPrice, null);
  assert.equal(row.usdMedian, null);
});

test("snapshot plan covers every model in every index region", () => {
  const plan = buildGearIndexPlan(catalog);
  assert.equal(plan.length, catalog.length * GEAR_INDEX_REGIONS.length);
  const uniquePairs = new Set(plan.map((pair) => `${pair.modelSlug}|${pair.regionId}`));
  assert.equal(uniquePairs.size, plan.length);
});
