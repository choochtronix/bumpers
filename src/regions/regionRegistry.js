export const REGION_REGISTRY = [
  {
    id: "japan",
    name: "Japan",
    slug: "japan",
    country: "JP",
    currency: "JPY",
    defaultLocale: "ja-JP",
    status: "active",
    priority: 1,
    notes: "Primary invite-only beta region.",
    searchDefaults: {
      cleanGear: true,
      maxResults: 80,
      maxPrice: 2000000,
    },
  },
  {
    id: "bay-area",
    name: "Bay Area",
    slug: "bay-area",
    country: "US",
    currency: "USD",
    defaultLocale: "en-US",
    status: "testing",
    priority: 2,
    notes: "Future local US region centered on the San Francisco Bay Area.",
    searchDefaults: {
      cleanGear: true,
      maxDistanceMiles: 75,
      maxResults: 80,
    },
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    slug: "los-angeles",
    country: "US",
    currency: "USD",
    defaultLocale: "en-US",
    status: "planned",
    priority: 3,
    notes: "Future SoCal region or metro preset.",
    searchDefaults: {
      cleanGear: true,
      maxDistanceMiles: 75,
      maxResults: 80,
    },
  },
  {
    id: "california",
    name: "California",
    slug: "california",
    country: "US",
    currency: "USD",
    defaultLocale: "en-US",
    status: "planned",
    priority: 4,
    notes: "Potential parent region for Bay Area, LA, Orange County, and San Diego.",
    searchDefaults: {
      cleanGear: true,
      maxResults: 80,
    },
  },
];

export function findRegion(regionId) {
  return REGION_REGISTRY.find((region) => region.id === regionId) || null;
}
