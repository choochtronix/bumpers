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
      sources: [
        "robotspeak",
        "mission-synths",
        "starving-musician",
        "bananas-at-large",
        "gelb-music",
        "craigslist-sfbay",
        "reverb-us",
        "ebay-us",
        "sweetwater-used",
        "guitar-center-used",
      ],
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
      sources: ["craigslist-la", "reverb-us", "ebay-us", "sweetwater-used", "guitar-center-used"],
      searchDefaults: {
        cleanGear: true,
        categoryIntent: "synthesizers",
        maxResults: 80,
        maxPrice: 10000,
        maxDistanceMiles: 75,
      },
    },
    {
      id: "east-coast",
      label: "East Coast",
      currency: "USD",
      defaultLocale: "en-US",
      status: "beta",
      sources: [
        "craigslist-east",
        "main-drag",
        "rogue-music",
        "three-wave",
        "alto-music",
        "tone-tweakers",
        "pro-audio-star",
        "reverb-us",
        "ebay-us",
      ],
      searchDefaults: {
        cleanGear: true,
        categoryIntent: "synthesizers",
        maxResults: 80,
        maxPrice: 10000,
        maxDistanceMiles: 150,
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
