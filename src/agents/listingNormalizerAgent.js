import { normalizeListing } from "../lib/normalization.js";
import { listingProvenance } from "../regions/config.js";

export function normalizeListings(rawListings = [], options = {}) {
  return rawListings.map((listing) => normalizeListing(listing, options));
}

export function attachNormalizedListings(rawListings = [], options = {}) {
  return rawListings.map((listing) => {
    const provenance = listingProvenance(listing, options.regionId);
    const normalized = normalizeListing({ ...listing, ...provenance }, options);
    return {
      ...listing,
      ...provenance,
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
