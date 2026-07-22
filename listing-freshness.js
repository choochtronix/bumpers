// Shared listing freshness primitives for the browser app, server, and tests.
// Keep this file free of DOM and storage access.

const DEFAULT_NEW_SOURCE_WINDOW_MS = 72 * 60 * 60 * 1000;
const DEFAULT_NEW_DISCOVERY_FALLBACK_MS = 24 * 60 * 60 * 1000;
const DEFAULT_SOURCE_CLOCK_SKEW_MS = 6 * 60 * 60 * 1000;

function normalizeSourceListedAt(value) {
  const timestamp = String(value || "").trim();
  if (!timestamp || !Number.isFinite(Date.parse(timestamp))) return "";
  return timestamp;
}

function getSourceListedAtTime(listing = {}) {
  const timestamp = normalizeSourceListedAt(listing.listedAt);
  return timestamp ? Date.parse(timestamp) : 0;
}

function compareListingsBySourceDate(first = {}, second = {}) {
  const firstTime = getSourceListedAtTime(first);
  const secondTime = getSourceListedAtTime(second);
  if (firstTime === secondTime) return 0;
  if (!firstTime) return 1;
  if (!secondTime) return -1;
  return secondTime - firstTime;
}

function getTimestampTime(value) {
  const timestamp = normalizeSourceListedAt(value);
  return timestamp ? Date.parse(timestamp) : 0;
}

function isWithinAgeWindow(timestampMs, nowMs, windowMs, futureToleranceMs = 0) {
  if (!timestampMs || !Number.isFinite(nowMs) || !Number.isFinite(windowMs)) return false;
  const ageMs = nowMs - timestampMs;
  return ageMs >= -futureToleranceMs && ageMs <= windowMs;
}

function getListingNewBadgeEligibility(listing = {}, previous = {}, options = {}) {
  const nowMs = getTimestampTime(options.now) || Date.now();
  const sourceWindowMs = Number(options.sourceWindowMs || DEFAULT_NEW_SOURCE_WINDOW_MS);
  const fallbackWindowMs = Number(options.fallbackWindowMs || DEFAULT_NEW_DISCOVERY_FALLBACK_MS);
  const sourceClockSkewMs = Number(options.sourceClockSkewMs || DEFAULT_SOURCE_CLOCK_SKEW_MS);
  const sourceListedAtMs = getSourceListedAtTime(listing) || getTimestampTime(previous.listedAt);
  const isNewDiscovery = Boolean(options.isNewDiscovery);
  const firstDiscoveredAtMs = getTimestampTime(previous.firstDiscoveredAt || previous.firstSeenAt)
    || (isNewDiscovery ? nowMs : 0);
  const isSourceFresh = isWithinAgeWindow(
    sourceListedAtMs,
    nowMs,
    sourceWindowMs,
    sourceClockSkewMs,
  );
  const isRecentDiscovery = isWithinAgeWindow(
    firstDiscoveredAtMs,
    nowMs,
    sourceListedAtMs ? sourceWindowMs : fallbackWindowMs,
  );
  const discoveredAfterBaseline = previous.discoveredAfterBaseline === true
    || options.discoveredAfterBaseline === true;
  const usesDiscoveryFallback = !sourceListedAtMs
    && discoveredAfterBaseline
    && isRecentDiscovery;
  const showsNewBadge = !options.isSeen
    && isRecentDiscovery
    && (isSourceFresh || usesDiscoveryFallback);

  return {
    showsNewBadge,
    isSourceFresh,
    isRecentDiscovery,
    usesDiscoveryFallback,
    hasTrustedSourceDate: Boolean(sourceListedAtMs),
    reason: isSourceFresh
      ? "recent-source"
      : usesDiscoveryFallback
        ? "recent-discovery"
        : "",
  };
}

function normalizeSignatureValue(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function createListingContentSignature(listing = {}) {
  const auction = listing.auction && typeof listing.auction === "object"
    ? listing.auction
    : {};
  return [
    normalizeSignatureValue(listing.title),
    Number(listing.price || 0),
    normalizeSignatureValue(listing.priceLabel),
    normalizeSignatureValue(listing.condition),
    normalizeSignatureValue(listing.availability),
    normalizeSignatureValue(listing.itemStatus),
    Number(auction.currentPrice || 0),
    Number(auction.buyoutPrice || 0),
    Number(auction.bidCount || 0),
    normalizeSignatureValue(auction.endAt),
  ].join("|");
}

function normalizePriceHistory(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((entry) => entry && typeof entry === "object")
    .map((entry) => ({
      price: Number(entry.price || 0),
      observedAt: normalizeSourceListedAt(entry.observedAt),
    }))
    .filter((entry) => entry.observedAt)
    .slice(-8);
}

function evolveListingFreshnessState(listing = {}, previous = {}, options = {}) {
  const now = normalizeSourceListedAt(options.now) || new Date().toISOString();
  const tracksObservation = options.observed !== false;
  const observedAt = tracksObservation
    ? normalizeSourceListedAt(options.observedAt) || now
    : normalizeSourceListedAt(previous.lastSeenAt)
      || normalizeSourceListedAt(previous.lastFoundAt)
      || now;
  const hasPrevious = Boolean(previous && Object.keys(previous).length > 0);
  const listedAt = normalizeSourceListedAt(listing.listedAt)
    || normalizeSourceListedAt(previous.listedAt);
  const contentSignature = createListingContentSignature(listing);
  const previousSignature = previous.contentSignature
    || (hasPrevious ? createListingContentSignature(previous) : "");
  const changed = hasPrevious && previousSignature !== contentSignature;
  const currentPrice = Number(listing.price || 0);
  const previousPrice = Number(previous.price || 0);
  const priceHistory = normalizePriceHistory(previous.priceHistory);

  if (!hasPrevious || currentPrice !== previousPrice) {
    const lastPrice = priceHistory.at(-1);
    if (!lastPrice || lastPrice.price !== currentPrice) {
      priceHistory.push({ price: currentPrice, observedAt });
    }
  }

  return {
    listedAt,
    sourceDateStatus: listedAt ? "verified" : "unknown",
    firstDiscoveredAt: previous.firstDiscoveredAt || now,
    firstSeenAt: previous.firstSeenAt || previous.firstDiscoveredAt || now,
    lastFoundAt: tracksObservation ? observedAt : previous.lastFoundAt || "",
    lastSeenAt: tracksObservation ? observedAt : previous.lastSeenAt || "",
    lastVerifiedAt: tracksObservation ? observedAt : previous.lastVerifiedAt || "",
    lastChangedAt: changed
      ? observedAt
      : previous.lastChangedAt || previous.firstSeenAt || previous.firstDiscoveredAt || now,
    contentSignature,
    changeCount: Number(previous.changeCount || 0) + (changed ? 1 : 0),
    scanCount: Number(previous.scanCount || 0) + (tracksObservation ? 1 : 0),
    unchangedScanCount: tracksObservation && hasPrevious && !changed
      ? Number(previous.unchangedScanCount || 0) + 1
      : changed
        ? 0
        : Number(previous.unchangedScanCount || 0),
    lastPresentedAt: options.presented
      ? observedAt
      : previous.lastPresentedAt || "",
    presentationCount: Number(previous.presentationCount || 0) + (options.presented ? 1 : 0),
    priceHistory: priceHistory.slice(-8),
  };
}

globalThis.BrrtzListingFreshness = {
  normalizeSourceListedAt,
  getSourceListedAtTime,
  compareListingsBySourceDate,
  getListingNewBadgeEligibility,
  createListingContentSignature,
  evolveListingFreshnessState,
};
