// Shared listing freshness primitives for the browser app, server, and tests.
// Keep this file free of DOM and storage access.

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
  createListingContentSignature,
  evolveListingFreshnessState,
};
