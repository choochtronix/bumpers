import "../../regions.js";

export const REGIONS = globalThis.BRRTZ_REGION_CONFIG.regions;
export function listingProvenance(listing, requestedRegion = "japan") {
  const candidates = REGIONS.filter((region) => region.sources.includes(listing.source || listing.sourceId));
  const region = candidates.find((item) => item.id === (listing.region || listing.regionId))
    || candidates.find((item) => item.id === requestedRegion) || candidates[0]
    || REGIONS.find((item) => item.id === (listing.region || listing.regionId || requestedRegion)) || REGIONS[0];
  return { region: region.id, currency: ["JPY", "USD", "GBP"].includes(listing.currency) ? listing.currency : region.currency };
}

export function selectRegionSources(regionId, requested = []) {
  const region = REGIONS.find((item) => item.id === regionId);
  if (!region) throw new Error("Unsupported region.");
  if (requested.some((id) => !region.sources.includes(id))) throw new Error("Source is not available in this region.");
  return requested.length ? [...new Set(requested)] : [...region.sources];
}

export function groupSourcesByRegion(sources, preferredRegion) {
  const regions = [...REGIONS].sort((a, b) => Number(b.id === preferredRegion) - Number(a.id === preferredRegion));
  const groups = new Map();
  for (const source of sources) {
    const region = regions.find((item) => item.sources.includes(source));
    if (!region) throw new Error(`Unknown source: ${source}`);
    if (!groups.has(region.id)) groups.set(region.id, []);
    groups.get(region.id).push(source);
  }
  return [...groups].map(([region, sources]) => ({ region, sources }));
}
