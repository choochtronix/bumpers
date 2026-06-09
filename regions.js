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
        maxResults: 80,
        maxPrice: 2000000,
      },
    },
    {
      id: "bay-area",
      label: "Bay Area",
      currency: "USD",
      defaultLocale: "en-US",
      status: "future",
      sources: ["craigslist-sfbay", "reverb-us", "ebay-us"],
      searchDefaults: {
        cleanGear: true,
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
