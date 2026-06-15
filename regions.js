window.BRRTZ_REGION_CONFIG = (() => {
  const regions = [
    {
      id: "japan",
      label: "Japan",
      currency: "JPY",
      defaultLocale: "ja-JP",
      status: "active",
      sources: [
        "mercari",
        "yahoo-auctions",
        "yahoo-fleamarket",
        "rakuma",
        "digimart",
        "reverb",
        "jimoty",
        "offmall",
        "five-g",
        "implant4",
        "hardoff",
      ],
      searchDefaults: {
        cleanGear: true,
        categoryIntent: "synthesizers",
        maxResults: 80,
        maxPrice: 2000000,
      },
    },
    {
      id: "bay-area",
      label: "Bay Area",
      currency: "USD",
      defaultLocale: "en-US",
      status: "beta",
      sources: ["craigslist-sfbay", "reverb-us", "ebay-us", "guitar-center-used"],
      searchDefaults: {
        cleanGear: true,
        categoryIntent: "synthesizers",
        maxResults: 80,
        maxPrice: 10000,
        maxDistanceMiles: 75,
      },
    },
    {
      id: "los-angeles",
      label: "Los Angeles",
      currency: "USD",
      defaultLocale: "en-US",
      status: "beta",
      sources: ["craigslist-la", "reverb-us", "ebay-us", "guitar-center-used"],
      searchDefaults: {
        cleanGear: true,
        categoryIntent: "synthesizers",
        maxResults: 80,
        maxPrice: 10000,
        maxDistanceMiles: 75,
      },
    },
  ];

  const activeRegionId = "japan";

  return {
    activeRegionId,
    regions,
    activeRegion: regions.find((region) => region.id === activeRegionId),
  };
})();
