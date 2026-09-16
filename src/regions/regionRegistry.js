import { REGIONS } from "./config.js";

export const REGION_REGISTRY = REGIONS.map((region, index) => ({
  ...region, name: region.label, slug: region.id, priority: index + 1,
  country: region.id === "japan" ? "JP" : region.id === "uk" ? "GB" : "US",
}));
export function findRegion(regionId) {
  return REGION_REGISTRY.find((region) => region.id === regionId) || null;
}
