import { normalizeListing } from "../lib/normalization.js";

export function normalizeListings(rawListings = [], options = {}) {
  return rawListings.map((listing) => normalizeListing(listing, options));
}

export function attachNormalizedListings(rawListings = [], options = {}) {
  return rawListings.map((listing) => {
    const normalized = normalizeListing(listing, options);
    return {
      ...listing,
      normalized,
      brand: listing.brand || normalized.brand,
      model: listing.model || normalized.model,
      category: listing.category || normalized.category,
      qualityScore: listing.qualityScore ?? normalized.qualityScore,
      noiseScore: listing.noiseScore ?? normalized.noiseScore,
      trustScore: listing.trustScore ?? normalized.trustScore,
    };
  });
}
