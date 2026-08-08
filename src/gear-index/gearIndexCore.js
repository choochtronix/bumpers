// Gear Index core — pure classification and statistics for the daily
// going-rate index. No network, storage, or scheduling here; server.js owns
// those. Tested by test/gear-index.test.js.
import "../../gear-scanner-curation.js";

const { classifyGearScannerListing } = globalThis.BrrtzGearScannerCuration;

// Index regions are coarser than search regions on purpose: reverb-us and
// ebay-us are national feeds shared by every US search region, so a per-city
// median would mostly re-measure the same national inventory. Manual/assist
// sources (Sweetwater, Guitar Center, ProAudioStar), parked Craigslist, and
// the Playwright-driven Mercari connector are deliberately left out of
// scheduled index sweeps.
export const GEAR_INDEX_REGIONS = [
  {
    id: "japan",
    label: "Japan",
    searchRegion: "japan",
    currency: "JPY",
    sources: [
      "yahoo-auctions",
      "yahoo-fleamarket",
      "rakuma",
      "digimart",
      "offmall",
      "five-g",
      "implant4",
      "jimoty",
      "reverb",
    ],
  },
  {
    id: "us",
    label: "US",
    searchRegion: "bay-area",
    currency: "USD",
    sources: [
      "reverb-us",
      "ebay-us",
      "robotspeak",
      "mission-synths",
      "starving-musician",
      "bananas-at-large",
      "gelb-music",
      "main-drag",
      "rogue-music",
      "three-wave",
      "alto-music",
      "tone-tweakers",
    ],
  },
  {
    id: "uk",
    label: "UK",
    searchRegion: "uk",
    currency: "GBP",
    sources: ["reverb-uk", "ebay-uk"],
  },
];

export const GEAR_INDEX_DEFAULT_MIN_SAMPLE = 3;

export function getGearIndexRegion(regionId) {
  return GEAR_INDEX_REGIONS.find((region) => region.id === regionId) || null;
}

// Fold case, width (full-width → ASCII via NFKC), and separators so
// "TR-808", "TR808", and "ＴＲ－８０８" all normalize to "tr808".
export function normalizeGearIndexText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[\s\-_./‐-―−]+/g, "");
}

export function matchesGearIndexModel(model, title) {
  const normalizedTitle = normalizeGearIndexText(title);
  if (!normalizedTitle) return { matched: false, reason: "empty_title" };

  for (const term of model.excludeTerms || []) {
    const normalizedTerm = normalizeGearIndexText(term);
    if (normalizedTerm && normalizedTitle.includes(normalizedTerm)) {
      return { matched: false, reason: `exclude:${term}` };
    }
  }

  for (const term of model.includeTerms || []) {
    const normalizedTerm = normalizeGearIndexText(term);
    if (normalizedTerm && normalizedTitle.includes(normalizedTerm)) {
      return { matched: true, reason: `include:${term}` };
    }
  }

  return { matched: false, reason: "no_include_match" };
}

// fxRates holds units-per-USD (e.g. { JPY: 147.2, GBP: 0.79 }); USD is 1.
export function convertGearIndexPriceToUsd(price, currency, fxRates = {}) {
  const numericPrice = Number(price);
  if (!Number.isFinite(numericPrice) || numericPrice <= 0) return null;
  if (currency === "USD") return numericPrice;
  const rate = Number(fxRates?.[currency]);
  if (!Number.isFinite(rate) || rate <= 0) return null;
  return numericPrice / rate;
}

export function filterGearIndexListings(model, listings, options = {}) {
  const fxRates = options.fxRates || {};
  // Several connectors omit currency on listings despite the common shape;
  // fall back to the index region's currency rather than dropping the data.
  const defaultCurrency = options.defaultCurrency || "";
  const kept = [];
  const dropped = {
    noPrice: 0,
    modelMismatch: 0,
    curationExcluded: 0,
    priceOutOfBand: 0,
  };

  for (const listing of Array.isArray(listings) ? listings : []) {
    const price = Number(listing?.price);
    const currency = listing?.currency || defaultCurrency;
    if (!Number.isFinite(price) || price <= 0 || !currency) {
      dropped.noPrice += 1;
      continue;
    }

    if (!matchesGearIndexModel(model, listing.title).matched) {
      dropped.modelMismatch += 1;
      continue;
    }

    if (classifyGearScannerListing(listing).hardExcluded) {
      dropped.curationExcluded += 1;
      continue;
    }

    // The USD floor/ceiling is an accessory-and-typo guard (manuals, knobs,
    // sample packs, decimal-slip prices), not a market opinion. When FX is
    // unavailable for the listing currency, skip the band check rather than
    // dropping real data.
    const usdPrice = convertGearIndexPriceToUsd(price, currency, fxRates);
    const floor = Number(model.priceFloorUsd) || 0;
    const ceiling = Number(model.priceCeilingUsd) || 0;
    if (usdPrice !== null && ((floor > 0 && usdPrice < floor) || (ceiling > 0 && usdPrice > ceiling))) {
      dropped.priceOutOfBand += 1;
      continue;
    }

    kept.push(listing);
  }

  return { kept, dropped };
}

function quantileOfSorted(sortedValues, q) {
  if (sortedValues.length === 0) return null;
  const position = (sortedValues.length - 1) * q;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  if (lowerIndex === upperIndex) return sortedValues[lowerIndex];
  const weight = position - lowerIndex;
  return sortedValues[lowerIndex] * (1 - weight) + sortedValues[upperIndex] * weight;
}

// Median with an IQR fence: prices outside [p25 - 1.5*IQR, p75 + 1.5*IQR]
// are trimmed before the published stats are computed, so one delusional
// listing cannot move the index.
export function computeGearIndexStats(prices) {
  const sorted = (Array.isArray(prices) ? prices : [])
    .map(Number)
    .filter((price) => Number.isFinite(price) && price > 0)
    .sort((a, b) => a - b);

  if (sorted.length === 0) {
    return { sampleCount: 0, trimmedCount: 0, median: null, p25: null, p75: null, min: null, max: null };
  }

  const rawP25 = quantileOfSorted(sorted, 0.25);
  const rawP75 = quantileOfSorted(sorted, 0.75);
  const iqr = rawP75 - rawP25;
  const lowerFence = rawP25 - 1.5 * iqr;
  const upperFence = rawP75 + 1.5 * iqr;
  const trimmed = sorted.filter((price) => price >= lowerFence && price <= upperFence);
  const usable = trimmed.length > 0 ? trimmed : sorted;

  return {
    sampleCount: sorted.length,
    trimmedCount: usable.length,
    median: quantileOfSorted(usable, 0.5),
    p25: quantileOfSorted(usable, 0.25),
    p75: quantileOfSorted(usable, 0.75),
    min: usable[0],
    max: usable[usable.length - 1],
  };
}

export function getGearIndexDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function buildGearIndexPlan(catalog) {
  const plan = [];
  for (const model of Array.isArray(catalog) ? catalog : []) {
    for (const region of GEAR_INDEX_REGIONS) {
      plan.push({ modelSlug: model.slug, regionId: region.id });
    }
  }
  return plan;
}

export function buildGearIndexRow({ model, region, listings, fxRates = {}, day }) {
  const { kept, dropped } = filterGearIndexListings(model, listings, {
    fxRates,
    defaultCurrency: region.currency,
  });
  const stats = computeGearIndexStats(kept.map((listing) => listing.price));
  const minSample = Number(model.minSample) || GEAR_INDEX_DEFAULT_MIN_SAMPLE;
  const hasEnoughData = stats.sampleCount >= minSample;
  const fxRate = region.currency === "USD" ? 1 : Number(fxRates?.[region.currency]) || null;
  const sourceBreakdown = {};
  for (const listing of kept) {
    sourceBreakdown[listing.source] = (sourceBreakdown[listing.source] || 0) + 1;
  }

  return {
    modelSlug: model.slug,
    region: region.id,
    day: day || getGearIndexDayKey(),
    currency: region.currency,
    sampleCount: stats.sampleCount,
    trimmedCount: hasEnoughData ? stats.trimmedCount : 0,
    medianPrice: hasEnoughData ? stats.median : null,
    p25Price: hasEnoughData ? stats.p25 : null,
    p75Price: hasEnoughData ? stats.p75 : null,
    minPrice: hasEnoughData ? stats.min : null,
    maxPrice: hasEnoughData ? stats.max : null,
    usdMedian: hasEnoughData && stats.median !== null
      ? convertGearIndexPriceToUsd(stats.median, region.currency, { ...fxRates, USD: 1 })
      : null,
    fxRateUsd: fxRate,
    sourceCount: Object.keys(sourceBreakdown).length,
    sourceBreakdown,
    dropped,
  };
}

export function validateGearIndexCatalog(catalog) {
  const errors = [];
  if (!Array.isArray(catalog) || catalog.length === 0) {
    return ["Catalog must be a non-empty array."];
  }

  const seenSlugs = new Set();
  catalog.forEach((model, index) => {
    const label = model?.slug || `entry ${index}`;
    if (!model?.slug) errors.push(`${label}: missing slug`);
    if (model?.slug && seenSlugs.has(model.slug)) errors.push(`${label}: duplicate slug`);
    if (model?.slug) seenSlugs.add(model.slug);
    if (!model?.name) errors.push(`${label}: missing name`);
    if (!Array.isArray(model?.terms) || model.terms.length === 0) errors.push(`${label}: missing search terms`);
    if (!Array.isArray(model?.includeTerms) || model.includeTerms.length === 0) errors.push(`${label}: missing includeTerms`);
    if (model?.priceFloorUsd !== undefined && !(Number(model.priceFloorUsd) > 0)) errors.push(`${label}: priceFloorUsd must be a positive number`);
    if (model?.priceCeilingUsd !== undefined && !(Number(model.priceCeilingUsd) > Number(model.priceFloorUsd || 0))) {
      errors.push(`${label}: priceCeilingUsd must exceed priceFloorUsd`);
    }
    for (const anchor of model?.valueAnchors || []) {
      if (!Number.isInteger(anchor?.year) || !(Number(anchor?.priceUsd) > 0)) {
        errors.push(`${label}: valueAnchors entries need integer year and positive priceUsd`);
      }
    }
  });

  return errors;
}
