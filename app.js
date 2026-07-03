const SOURCES = [
  { id: "mercari", label: "Mercari", icon: "Me", color: "rose", logo: "assets/logos/ICONS/mercari_ic.svg" },
  { id: "yahoo-auctions", label: "Yahoo Auctions", icon: "Y!", color: "amber", logo: "assets/logos/ICONS/yahoo_ic.svg" },
  { id: "yahoo-fleamarket", label: "Yahoo Fleamarket", icon: "Yf", color: "blue", logo: "assets/logos/ICONS/yahoo_flea_ic.svg" },
  { id: "rakuma", label: "Rakuma", icon: "Ra", color: "green", logo: "assets/logos/ICONS/rakuma_ic.svg" },
  { id: "digimart", label: "Digimart", icon: "D", color: "blue" },
  { id: "reverb", label: "Reverb", icon: "Rv", color: "orange" },
  { id: "reverb-us", label: "Reverb US", icon: "Rv", color: "orange" },
  { id: "ebay-us", label: "eBay US", icon: "eB", color: "blue" },
  { id: "sweetwater-used", label: "Sweetwater Used", icon: "SW", color: "blue" },
  { id: "guitar-center-used", label: "Guitar Center", icon: "GC", color: "black" },
  { id: "craigslist-sfbay", label: "Craigslist SF", icon: "SF", color: "purple" },
  { id: "robotspeak", label: "Robot Speak", icon: "RS", color: "blue" },
  { id: "mission-synths", label: "Mission Synths", icon: "MS", color: "rose" },
  { id: "starving-musician", label: "Starving Musician", icon: "SM", color: "amber" },
  { id: "bananas-at-large", label: "Bananas", icon: "Ba", color: "green" },
  { id: "gelb-music", label: "Gelb Music", icon: "Gb", color: "blue" },
  { id: "craigslist-la", label: "Craigslist LA", icon: "LA", color: "purple" },
  { id: "craigslist-east", label: "Craigslist East", icon: "EC", color: "purple" },
  { id: "main-drag", label: "Main Drag", icon: "MD", color: "black" },
  { id: "rogue-music", label: "Rogue Music", icon: "Rg", color: "black" },
  { id: "three-wave", label: "Three Wave", icon: "3W", color: "blue" },
  { id: "alto-music", label: "Alto Music", icon: "AM", color: "blue" },
  { id: "tone-tweakers", label: "Tone Tweakers", icon: "TT", color: "amber" },
  { id: "pro-audio-star", label: "ProAudioStar", icon: "PS", color: "blue" },
  { id: "jimoty", label: "Jimoty", icon: "Jm", color: "orange" },
  { id: "offmall", label: "OFFMALL", icon: "O", color: "green", logo: "assets/logos/ICONS/hardoff-ic.svg" },
  { id: "five-g", label: "Five G", icon: "5G", color: "amber" },
  { id: "implant4", label: "implant4", icon: "i4", color: "rose" },
  { id: "hardoff", label: "Hard Off", icon: "H", color: "green", logo: "assets/logos/ICONS/hardoff-ic.svg" },
];

const LEGACY_DEFAULT_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "offmall", "five-g", "implant4", "hardoff"];
const LIVE_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "reverb", "reverb-us", "ebay-us", "sweetwater-used", "guitar-center-used", "craigslist-sfbay", "robotspeak", "mission-synths", "starving-musician", "bananas-at-large", "gelb-music", "craigslist-la", "craigslist-east", "main-drag", "rogue-music", "three-wave", "alto-music", "tone-tweakers", "pro-audio-star", "jimoty", "offmall", "five-g", "implant4", "hardoff"];
const LIVE_SOURCE_DISPLAY_ORDER = ["robotspeak", "mission-synths", "starving-musician", "bananas-at-large", "gelb-music", "craigslist-sfbay", "craigslist-la", "craigslist-east", "main-drag", "rogue-music", "three-wave", "alto-music", "tone-tweakers", "pro-audio-star", "reverb-us", "ebay-us", "sweetwater-used", "guitar-center-used", "yahoo-auctions", "yahoo-fleamarket", "digimart", "reverb", "jimoty", "offmall", "five-g", "implant4", "hardoff", "mercari", "rakuma"];
const SOURCE_SEARCH_CONTEXT_TRUST_IDS = new Set(["craigslist-sfbay", "craigslist-la", "craigslist-east"]);
const CATEGORY_SEARCH_CONTEXT_IDS = new Set(["reverb", "reverb-us"]);
const REGION_CONFIG = typeof window !== "undefined" ? window.BRRTZ_REGION_CONFIG : null;
const ACTIVE_REGION = REGION_CONFIG?.activeRegion || {
  id: "japan",
  label: "Japan",
  currency: "JPY",
  defaultLocale: "ja-JP",
  sources: LIVE_SOURCE_IDS,
  searchDefaults: {
    cleanGear: true,
    maxResults: 80,
    maxPrice: 2000000,
  },
};
const RESULTS_PER_PAGE = 48;
const FEATURED_HOME_LIMIT = 12;
const BROWSE_HOME_LIMIT = 18;
const BROWSE_EXPANDED_LIMIT = 240;
const BROWSE_CARD_RENDER_CHUNK_SIZE = 6;
const BROWSE_HOME_CURATION_CANDIDATE_LIMIT = 24;
const APP_VIEW_PARAM = "view";
const APP_VIEW_SYNTH_BROWSER = "synth-browser";
const APP_VIEW_WATCHLIST = "watchlist";
const APP_BRAND_PARAM = "brand";
const POPULAR_BRANDS = [
  {
    name: "Moog",
    slug: "moog",
    searchTerms: [
      "Moog",
      "Moog Music",
      "モーグ",
      "ムーグ",
      "ミニモーグ",
      "Bob Moog",
      "Minimoog",
      "Mini Moog",
      "Minimoog Model D",
      "Moog Model D",
      "Model D",
      "Minimoog Voyager",
      "Voyager XL",
      "Voyager RME",
      "Voyager Old School",
      "Memorymoog",
      "Memory Moog",
      "Polymoog",
      "Micromoog",
      "Multimoog",
      "Moog Source",
      "\"The Source\"",
      "Moog Prodigy",
      "Moog Rogue",
      "Moog Liberation",
      "Moog Opus 3",
      "Moog Satellite",
      "Moog Sonic Six",
      "Sonic Six",
      "Sonic V",
      "Moog Taurus",
      "Taurus I",
      "Taurus II",
      "Taurus III",
      "Moog Minitaur",
      "Minitaur",
      "Moog Sirin",
      "Sirin",
      "Little Phatty",
      "Slim Phatty",
      "Sub Phatty",
      "Sub 37",
      "Subsequent 25",
      "Subsequent 37",
      "Moog Grandmother",
      "Grandmother",
      "Moog Matriarch",
      "Matriarch",
      "Mother-32",
      "DFAM",
      "Subharmonicon",
      "Mavis",
      "Werkstatt-01",
      "Werkstatt",
      "Moog Labyrinth",
      "Labyrinth",
      "Moog Spectravox",
      "Spectravox",
      "Moog Muse",
      "Moog One",
      "Moog Modular",
      "Moog Model 10",
      "Moog Model 12",
      "Moog Model 15",
      "Moog System 35",
      "Moog System 55",
      "Moog IIIc",
      "Moog IIIp",
      "Moog IIc",
      "Moog IIp",
      "Moog Ic",
      "Moog Ip",
      "Realistic MG-1",
      "Concertmate MG-1",
    ],
    image: "assets/brand/minimoog_brand.jpg",
  },
  {
    name: "ARP",
    slug: "arp",
    searchTerms: [
      "ARP",
      "ARP 2600",
      "ARP Odyssey",
      "ARP Axxe",
      "ARP Solus",
      "ARP Omni",
      "ARP Quadra",
      "ARP Pro Soloist",
      "ARP String Ensemble",
      "Solina",
      "Odyssey MK1",
      "Odyssey MK2",
      "Odyssey MK3",
      "ARP2600",
      "ARP-2600",
      "KORG ARP Odyssey",
      "KORG ARP 2600",
      "KORG 2600M",
      "KORG Odyssey",
    ],
    image: "assets/brand/arp_brand.jpg",
  },
  {
    name: "Oberheim",
    slug: "oberheim",
    searchTerms: [
      "Oberheim",
      "オーバーハイム",
      "Tom Oberheim",
      "Oberheim SEM",
      "Oberheim Synthesizer Expander Module",
      "Oberheim Two Voice",
      "Oberheim Two-Voice",
      "Oberheim TVS",
      "Oberheim Four Voice",
      "Oberheim Four-Voice",
      "Oberheim Eight Voice",
      "Oberheim Eight-Voice",
      "Oberheim OB-1",
      "Oberheim OB-X",
      "Oberheim OB-Xa",
      "Oberheim OB-SX",
      "Oberheim OB-8",
      "Oberheim Xpander",
      "Oberheim Matrix 12",
      "Oberheim Matrix 6",
      "Oberheim Matrix 6R",
      "Oberheim Matrix 1000",
      "Oberheim OB-Mx",
      "Oberheim OB-12",
      "Oberheim OB-6",
      "Oberheim OB-X8",
      "Oberheim TEO-5",
      "Oberheim Two Voice Pro",
      "Oberheim TVS Pro",
      "Oberheim Son of 4 Voice",
      "SEM Pro",
      "SEM-PRO",
      "SEM Patch Panel",
      "Synthesizer Expander Module",
      "Two Voice",
      "Two-Voice",
      "2 Voice",
      "TVS",
      "TVS-1",
      "TVS Pro",
      "Two Voice Pro",
      "Four Voice",
      "Four-Voice",
      "4 Voice",
      "FVS",
      "FVS-1",
      "Son of 4 Voice",
      "SO4V",
      "Eight Voice",
      "Eight-Voice",
      "8 Voice",
      "OB1",
      "OB-1",
      "OBX",
      "OB-X",
      "OBXa",
      "OB-Xa",
      "OB SX",
      "OB-SX",
      "OBSX",
      "OB8",
      "OB-8",
      "OB6",
      "OB-6",
      "OBX8",
      "OB-X8",
      "OB X8",
      "TEO5",
      "TEO-5",
      "Xpander",
      "X-Pander",
      "Matrix12",
      "Matrix 12",
      "Matrix-12",
      "Matrix6",
      "Matrix 6",
      "Matrix-6",
      "Matrix6R",
      "Matrix 6R",
      "Matrix-6R",
      "Matrix1000",
      "Matrix 1000",
      "Matrix-1000",
      "OBMx",
      "OB-Mx",
      "OB MX",
      "OB12",
      "OB-12",
    ],
    image: "assets/brand/oberheim_brand.jpg",
  },
  {
    name: "Sequential Circuits",
    slug: "sequential-circuits",
    searchTerms: [
      "Sequential Circuits",
      "Sequential",
      "Sequential LLC",
      "Dave Smith Instruments",
      "Dave Smith",
      "DSI",
      "SCI Prophet",
      "Sequential Prophet",
      "Sequential synthesizer",
      "シーケンシャル",
      "デイブスミス",
      "プロフェット",
      "Sequential Prophet-5",
      "Sequential Prophet 5",
      "Sequential Prophet-10",
      "Sequential Prophet 10",
      "Sequential Pro-One",
      "Sequential Pro One",
      "Sequential Prophet-600",
      "Sequential Prophet 600",
      "Sequential Prophet-T8",
      "Sequential Prophet T8",
      "Sequential Prophet VS",
      "Sequential Six-Trak",
      "Sequential Six Track",
      "Sequential Multi-Trak",
      "Sequential Multi Track",
      "Sequential MAX",
      "Sequential Split-Eight",
      "Sequential Split 8",
      "Sequential DrumTraks",
      "Sequential Drum Tracks",
      "Sequential TOM",
      "Sequential Studio 440",
      "Sequential Prophet 2000",
      "Sequential Prophet 2002",
      "Sequential Prophet 3000",
      "Sequential Prophet 3002",
      "DSI Evolver",
      "Dave Smith Evolver",
      "DSI Poly Evolver",
      "DSI Mopho",
      "DSI Mopho x4",
      "DSI Tetra",
      "DSI Tempest",
      "Dave Smith Tempest",
      "DSI Prophet 08",
      "DSI Prophet '08",
      "Dave Smith Prophet 08",
      "Sequential Prophet Rev2",
      "Sequential Prophet-6",
      "Sequential Prophet 6",
      "Sequential OB-6",
      "Sequential OB 6",
      "Sequential Prophet 12",
      "Sequential Prophet X",
      "Sequential Prophet XL",
      "Sequential Pro 2",
      "Sequential Pro 3",
      "Sequential Pro 3 SE",
      "Sequential Take 5",
      "Sequential Trigon-6",
      "Sequential Trigon 6",
      "Sequential Fourm",
      "Prophet-5",
      "Prophet 5",
      "Prophet5",
      "P5",
      "Prophet-10",
      "Prophet 10",
      "Prophet10",
      "P10",
      "Pro-One",
      "Pro One",
      "ProOne",
      "Prophet-600",
      "Prophet 600",
      "Prophet600",
      "P600",
      "Prophet-T8",
      "Prophet T8",
      "ProphetT8",
      "T8",
      "Prophet VS",
      "Prophet-VS",
      "Six-Trak",
      "Six Trak",
      "Six-Track",
      "Six Track",
      "Multi-Trak",
      "Multi Trak",
      "Multi-Track",
      "Multi Track",
      "Split-Eight",
      "Split 8",
      "Split-8",
      "DrumTraks",
      "Drum Tracks",
      "Studio 440",
      "Prophet 2000",
      "Prophet-2000",
      "Prophet 2002",
      "Prophet-2002",
      "Prophet 3000",
      "Prophet-3000",
      "Prophet 3002",
      "Prophet-3002",
      "Evolver",
      "Mono Evolver",
      "Poly Evolver",
      "Mopho",
      "Mopho x4",
      "Mopho Keyboard",
      "Tetra",
      "Tempest",
      "Prophet 08",
      "Prophet '08",
      "Prophet-08",
      "Prophet Rev2",
      "Rev2",
      "Prophet-6",
      "Prophet 6",
      "Prophet6",
      "OB-6",
      "OB 6",
      "OB6",
      "Prophet 12",
      "Prophet-12",
      "Prophet12",
      "Prophet X",
      "Prophet-X",
      "Prophet XL",
      "Prophet-XL",
      "Pro 2",
      "Pro-2",
      "Pro2",
      "Pro 3",
      "Pro-3",
      "Pro3",
      "Pro 3 SE",
      "Take 5",
      "Take-5",
      "Take5",
      "Trigon-6",
      "Trigon 6",
      "Trigon6",
      "Fourm",
    ],
    image: "assets/brand/sequential_brand.jpg",
  },
  { name: "Waldorf", slug: "waldorf", searchTerms: ["Waldorf"], image: "assets/brand/waldorf_brand.jpg" },
  { name: "Ensoniq", slug: "ensoniq", searchTerms: ["Ensoniq", "エンソニック"], image: "" },
];
const BRAND_RECIPE_TEMPLATE = {
  source: "saved-search:moog",
  maxPrice: 2000000,
  excludes: [
    "ALEMBIC",
    "M4167",
    "ENIX",
    "GALLERIA",
    "nanoloop",
    "Behringer",
    "Shino Shinobaz Doujinshi",
    "Ｃ ＴＬＳ",
    "Ｂ－Ｆ",
    "Ｃ Ｂ－Ｆ",
    "Piero Umiliani",
    "C・",
    "TAKARA",
    "MOGLEA",
    "腕時計女性向き　個性的なデザイン レディース 腕時計 ゴールド ブラウン ファッション小物 ブラウン",
    "腕時計 稼働未確認",
    "Ichiban Kuji Moguri King",
    "Plush Toy",
    "TAITO",
    "未開封 一番くじ モーグリ ぬいぐるみ王様",
    "MOGE",
    "Mogulair",
    "新品",
    "MOOG COMICS",
    "Moog C",
    "ムーグＣ",
    "\"Cocoon Moog\"",
    "Zamoog",
    "ザムーグ",
    "モーグ３",
    "\"MOOG COMICS\"",
    "\"Moog C\"",
    "\"ムーグ C\"",
    "MOOGLE",
    "MTG",
    "\"SOUND OF MOOG”",
    "\"Dick Hyman\"",
    "腕時計",
    "\"FINAL FANTASY\"",
    "モーグリ",
    "プレイボーダー",
    "\"THE SOUND OF MOOG\"",
    "\"ムーグコミックス フューチャーシリーズ\"",
    "\"ムーグコミックス ピーチシリーズ\"",
    "モーグ",
    "ブーツ",
    "カントリ",
    "Mooguka",
  ],
  noiseTerms: [
    "adapter",
    "book",
    "cable",
    "case",
    "cd",
    "cover",
    "decksaver",
    "manual",
    "patch book",
    "power supply",
    "stand",
    "アダプター",
    "カタログ",
    "カバー",
    "ケース",
    "ケーブル",
    "スタンド",
    "デッキセーバー",
    "マニュアル",
    "取扱説明書",
    "教則",
  ],
  sources: [
    "mercari",
    "yahoo-auctions",
    "yahoo-fleamarket",
    "rakuma",
    "digimart",
    "reverb",
    "offmall",
    "five-g",
    "implant4",
    "hardoff",
    "jimoty",
  ],
};
const BRAND_RECIPES = {
  moog: {
    source: "brand-search:moog",
    maxPrice: 0,
    termLimit: 28,
    sourceTerms: [
      "Moog",
      "モーグ",
      "ムーグ",
      "Minimoog",
      "Moog Model D",
      "Moog Voyager",
      "Memorymoog",
      "Polymoog",
      "Micromoog",
      "Multimoog",
      "Moog Source",
      "Moog Prodigy",
      "Moog Rogue",
      "Moog Liberation",
      "Moog Taurus",
      "Moog One",
      "Moog Muse",
      "Moog Grandmother",
      "Moog Matriarch",
      "Moog Mother-32",
      "Moog Sub 37",
      "Moog Subsequent",
      "Moog Little Phatty",
      "Moog Slim Phatty",
      "Moog DFAM",
      "Moog Minitaur",
      "Moog Subharmonicon",
      "Moog Modular",
      "Realistic MG-1",
    ],
    excludes: [
      "ALEMBIC",
      "M4167",
      "ENIX",
      "GALLERIA",
      "nanoloop",
      "Behringer",
      "Shino Shinobaz Doujinshi",
      "Ｃ ＴＬＳ",
      "Ｂ－Ｆ",
      "Ｃ Ｂ－Ｆ",
      "Piero Umiliani",
      "C・",
      "TAKARA",
      "MOGLEA",
      "腕時計女性向き　個性的なデザイン レディース 腕時計 ゴールド ブラウン ファッション小物 ブラウン",
      "腕時計 稼働未確認",
      "Ichiban Kuji Moguri King",
      "Plush Toy",
      "TAITO",
      "未開封 一番くじ モーグリ ぬいぐるみ王様",
      "MOGE",
      "Mogulair",
      "MOOG COMICS",
      "Moog C",
      "ムーグＣ",
      "\"Cocoon Moog\"",
      "Zamoog",
      "ザムーグ",
      "モーグ３",
      "\"MOOG COMICS\"",
      "\"Moog C\"",
      "\"ムーグ C\"",
      "MOOGLE",
      "Moogle",
      "Moguri",
      "MTG",
      "\"SOUND OF MOOG\"",
      "\"THE SOUND OF MOOG\"",
      "\"Dick Hyman\"",
      "腕時計",
      "\"FINAL FANTASY\"",
      "Final Fantasy",
      "モーグリ",
      "プレイボーダー",
      "\"ムーグコミックス フューチャーシリーズ\"",
      "\"ムーグコミックス ピーチシリーズ\"",
      "ブーツ",
      "カントリ",
      "Mooguka",
      "moog.79",
      "moog．",
      "Moogah",
      "Doepfer",
      "A-120",
      "A-120V",
      "Snow Peak",
      "スノーピーク",
      "MORG Pro",
      "モーグpro.air",
      "Pro.air",
      "シューズ",
      "シャークソール",
      "靴",
      "スニーカー",
      "MOOGEE",
      "GEL-MOOGEE",
      "asics",
      "アシックス",
      "モーグル",
      "mogul",
      "ski",
      "スキー",
      "K2 244",
      "スタジャン",
      "ワッペン",
      "ナイロンスタジャン",
      "デュエルマスターズ",
      "地底探検モーグ",
      "DM24RP",
      "\"Bach to Moog\"",
      "バッハ・トゥ・モーグ",
      "HANS WURMAN",
      "ハンス・ウールマン",
      "digireco",
      "追悼モーグ博士",
      "DVD",
      "Blu-ray",
      "movie",
      "映画",
      "デラックスDVD",
      "くみたてモルカー",
      "モルカー",
      "MODEROID",
      "模型",
      "モックアップ",
      "MOOK",
      "HOBBYJAPAN",
      "ホビージャパン",
      "戦車模型",
      "MAP-01",
      "Mode Machines",
      "error instruments",
      "Animoog",
      "software",
      "plugin",
      "plug-in",
      "preset",
      "sample pack",
      "book",
      "magazine",
      "comic",
      "poster",
      "shirt",
      "sticker",
      "toy",
      "miniature",
      "manual only",
      "patch book",
      "catalog only",
      "cd",
      "lp",
      "record",
      "vinyl",
    ],
    noiseTerms: [
      "adapter",
      "AC adapter",
      "power supply",
      "power cord",
      "book",
      "brochure",
      "button cap",
      "cable",
      "case",
      "catalog",
      "cover",
      "decksaver",
      "dust cover",
      "gig bag",
      "key only",
      "keybed only",
      "knob only",
      "manual",
      "overlay",
      "panel overlay",
      "parts only",
      "patch book",
      "rack ears",
      "schematic",
      "service manual",
      "spares",
      "stand",
      "voice card only",
      "アダプター",
      "カタログ",
      "カバー",
      "ケース",
      "ケーブル",
      "スタンド",
      "デッキセーバー",
      "ハードケース",
      "マニュアル",
      "取扱説明書",
      "説明書",
      "教則",
      "電源",
      "電源アダプター",
      "部品",
    ],
    sources: [...BRAND_RECIPE_TEMPLATE.sources],
  },
  arp: {
    source: "brand-search:arp",
    maxPrice: 0,
    termLimit: 12,
    sourceTerms: [
      "ARP",
      "KORG 2600M",
      "KORG Odyssey",
      "Solina String Ensemble",
      "ARP 2600",
      "ARP Odyssey",
      "ARP Axxe",
      "ARP Solus",
      "ARP Omni",
      "ARP Quadra",
      "ARP Pro Soloist",
      "ARP String Ensemble",
    ],
    excludes: [
      "\"Arp Alive\"",
      "ARP: ALIVE",
      "\"mini アクリルスタンド\"",
      "\"AR performers\"",
      "\"ＡＲＰ：Ａ’ＬＩＶＥ\"",
      "\"Ｂｕｒｎ　ｉｔ　ｕｐ\"",
      "\"人気商品\"",
      "\"ARP-02\"",
      "\"ARP-0\"",
      "\"ARP-03\"",
      "\"Jean Arp\"",
      "\"All of You\"",
      "\"Ａ’ＬＩＶＥ\"",
      "\"A'Live\"",
      "\"ARP-1\"",
      "\"ARP-2B\"",
      "\"Kiss My Arp\"",
      "\"サヴァレス\"",
      "\"SAVAREZ\"",
      "\"フレグランス ダイヤ\"",
      "\"KICK A’LIVE\"",
      "\"レイジ アクリルスタンド アクスタ\"",
      "\"SHIKIZAKURA’\"",
      "\"SIERRA DESIGNS\"",
      "\"G&G\"",
      "ARMAMENT",
      "A’LIVE3",
      "A’LIVE2",
      "A'Live2",
      "REWINDⅣ",
      "ローバーミニ",
      "ワッシャー",
      "ヘッドボルト",
      "ドットサイト",
      "Headway",
      "歯槽堤保存",
      "ARTY PRO",
      "M-LOK",
      "\"Backstage Pass\"",
      "ぬいぐるみ",
      "肌掛け布団",
      "アスファ",
      "スカート",
      "POLABOSS",
      "2hp",
      "HONDA",
      "ホンダ",
      "MUGEN",
      "無限",
      "LAILE",
      "レイル",
      "ヤリス",
      "ランサー",
      "GR86",
      "ARP-87",
      "DC-2",
      "Electric Circus",
      "Ian Gillan",
      "KURZWEIL MEI-1",
      "J.J.ジョンソン",
      "Mobile Suit Gundam",
      "POODLE",
      "PCM 3348",
      "Richard Franecki",
      "SONY ARP-2",
      "SPV - 355",
      "SUNSHINE CLUB",
      "Sunshine Avenue",
      "TRANCER-2600",
      "WALRUS AUDIO",
      "Yoshiaki Masuo",
      "スマイルキッズ",
      "アナログ●",
      "ガンダム",
      "イアン・ギラン",
      "オープナー",
      "サンシャイン",
      "ソノシート",
      "チャー",
      "ルーペ付",
      "レコード",
      "効果音集",
      "増尾好秋",
      "廉価盤",
      "紙ジャケット",
      "sharp",
      "carp",
      "harp",
      "arpeggio",
      "guitar pedal",
      "book",
      "manual only",
      "patch book",
      "poster",
      "shirt",
      "sticker",
      "toy",
      "miniature",
    ],
    noiseTerms: [
      "case",
      "cover",
      "power cord",
      "stand",
      "power supply",
      "adapter",
      "manual",
      "brochure",
      "AC power cord",
      "ACアダプター",
      "アダプター",
      "カバー",
      "ケース",
      "ケーブル",
      "スタンド",
      "ハードケース",
      "マニュアル",
      "取扱説明書",
      "純正ケース",
    ],
    sources: [...BRAND_RECIPE_TEMPLATE.sources],
  },
  oberheim: {
    source: "brand-search:oberheim",
    maxPrice: 0,
    termLimit: 14,
    sourceTerms: [
      "Oberheim",
      "オーバーハイム",
      "Tom Oberheim",
      "Oberheim SEM",
      "Oberheim OB-X",
      "Oberheim OB-Xa",
      "Oberheim OB-8",
      "Oberheim Xpander",
      "Oberheim Matrix",
      "Oberheim Matrix 1000",
      "Oberheim OB-6",
      "Oberheim OB-X8",
      "Oberheim TEO-5",
      "Oberheim Two Voice",
    ],
    excludes: [
      "\"The Matrix\"",
      "\"Matrix Reloaded\"",
      "\"Matrix Revolutions\"",
      "\"Matrix Resurrections\"",
      "\"Matrix printer\"",
      "\"matrix switch\"",
      "\"matrix mixer\"",
      "OBD",
      "OBD2",
      "OBD-II",
      "OB-GYN",
      "obstetrics",
      "OB会",
      "OB訪問",
      "\"search engine marketing\"",
      "\"SEM marketing\"",
      "\"SEM book\"",
      "\"SEM textbook\"",
      "\"scanning electron microscope\"",
      "\"SEM image\"",
      "SEM写真",
      "\"Xpander rack\"",
      "\"Xpander luggage\"",
      "\"Xpander bag\"",
      "\"Matrix hair\"",
      "\"Matrix shampoo\"",
      "\"Matrix color\"",
      "\"Matrix Biolage\"",
      "Doepfer",
      "A-106-6",
      "manual only",
      "service manual",
      "schematic",
      "poster",
      "shirt",
      "sticker",
      "toy",
      "miniature",
      "book",
      "magazine",
      "catalog only",
    ],
    noiseTerms: [
      "case",
      "cover",
      "dust cover",
      "stand",
      "power supply",
      "adapter",
      "AC adapter",
      "power cord",
      "AC power cord",
      "manual",
      "service manual",
      "schematic",
      "brochure",
      "catalog",
      "patch book",
      "rack ears",
      "button cap",
      "knob only",
      "voice card only",
      "parts only",
      "ジャンク基板",
      "アダプター",
      "カタログ",
      "カバー",
      "ケース",
      "ケーブル",
      "スタンド",
      "マニュアル",
      "説明書",
      "取扱説明書",
      "雑誌",
      "楽譜",
    ],
    sources: [...BRAND_RECIPE_TEMPLATE.sources],
  },
  "sequential-circuits": {
    source: "brand-search:sequential-circuits",
    maxPrice: 0,
    termLimit: 24,
    sourceTerms: [
      "Sequential",
      "Sequential Prophet",
      "Dave Smith",
      "DSI Prophet",
      "Sequential Circuits",
      "Prophet-5",
      "Prophet 5",
      "Prophet-10",
      "Pro-One",
      "Prophet-600",
      "Prophet VS",
      "Six-Trak",
      "Multi-Trak",
      "Prophet T8",
      "Prophet Rev2",
      "Prophet-6",
      "Prophet 12",
      "Pro 2",
      "Pro 3",
      "Take 5",
      "Trigon-6",
      "Fourm",
      "Mopho",
      "Evolver",
      "Tempest",
      "Tetra",
      "Studio 440",
      "DrumTraks",
    ],
    excludes: [
      "\"Kahlil Gibran\"",
      "\"The Prophet book\"",
      "\"Prophet Muhammad\"",
      "\"Prophet Mohammed\"",
      "Islam",
      "Islamic",
      "Quran",
      "Koran",
      "Bible",
      "Biblical",
      "prophecy",
      "religion",
      "\"Joseph Smith\"",
      "\"sequential logic\"",
      "\"digital logic\"",
      "\"logic circuit\"",
      "\"logic circuits\"",
      "\"electronic circuits textbook\"",
      "\"circuit analysis\"",
      "\"sequential turn signal\"",
      "\"sequential indicator\"",
      "\"sequential LED\"",
      "シーケンシャル LED",
      "シーケンシャルLED",
      "シーケンシャル ウィンカー",
      "シーケンシャルウィンカー",
      "シーケンシャル ウインカー",
      "シーケンシャルウインカー",
      "ウインカー",
      "LEDテール",
      "LED テール",
      "テールランプ",
      "流れるウィンカー",
      "ミラーウィンカー",
      "ヘッドライト",
      "ブルーミラー",
      "シルクブレイズ",
      "加工テール",
      "ハイエース",
      "プリウス",
      "カローラ",
      "モコ",
      "MG22S",
      "RAV4",
      "BMW",
      "Dazz Fellows",
      "ふそう",
      "スーパーグレート",
      "トラック 24v",
      "\"sequential tail light\"",
      "\"sequential shifter\"",
      "\"sequential gearbox\"",
      "\"sequential transmission\"",
      "\"Sequential Voltage Source\"",
      "\"Sequential Switch\"",
      "A-151V",
      "Buchla & Tiptop",
      "Buchla | 251e",
      "Doepfer",
      "VALENTi",
      "スーパーキャリー",
      "\"Take Five\"",
      "\"Dave Brubeck\"",
      "\"Take 5 candy\"",
      "\"Take5 candy\"",
      "\"Take 5 magazine\"",
      "\"Tetra aquarium\"",
      "\"Tetra fish\"",
      "\"Tetra filter\"",
      "\"Tetra food\"",
      "\"Tetra Pak\"",
      "\"Tempest Shakespeare\"",
      "\"The Tempest\"",
      "\"Atari Tempest\"",
      "\"Tempest arcade\"",
      "\"Tempest game\"",
      "\"weather tempest\"",
      "\"Pokemon Evolver\"",
      "\"Evolver game\"",
      "\"Mighty Prophet\"",
      "\"Michael Prophet\"",
      "\"90s アンビエント\"",
      "\"Praise You Jah Jah\"",
      "\"Praising Jah\"",
      "\"Jah Jah People\"",
      "\"Universal Skank\"",
      "\"Dave Smith, The Astronauts\"",
      "\"Dave Smith & The Astronauts\"",
      "\"Androidプログラミング\"",
      "\"プログラミングレシピ\"",
      "\"Jeff Friesen\"",
      "\"吉川 邦夫\"",
      "\"Prophet manual only\"",
      "\"Sequential manual only\"",
      "\"Dave Smith manual only\"",
      "overlay only",
      "panel overlay",
      "poster",
      "shirt",
      "sticker",
      "toy",
      "miniature",
      "book",
      "magazine",
      "catalog only",
    ],
    noiseTerms: [
      "case",
      "cover",
      "dust cover",
      "gig bag",
      "stand",
      "power supply",
      "adapter",
      "AC adapter",
      "power cord",
      "AC power cord",
      "manual",
      "service manual",
      "schematic",
      "brochure",
      "catalog",
      "patch book",
      "7”",
      "10”",
      "12”",
      "7 inch",
      "10 inch",
      "12 inch",
      "vinyl",
      "record",
      "レコード",
      "アナログ●",
      "overlay",
      "panel overlay",
      "rack ears",
      "button cap",
      "knob only",
      "key only",
      "keybed only",
      "voice card only",
      "CEM chip only",
      "parts only",
      "spares",
      "ジャンク基板",
      "アダプター",
      "カタログ",
      "カバー",
      "ケース",
      "ケーブル",
      "スタンド",
      "マニュアル",
      "取扱説明書",
      "説明書",
      "雑誌",
      "楽譜",
    ],
    sources: [...BRAND_RECIPE_TEMPLATE.sources],
  },
};
const FEATURED_HOME_ALERT_LIMIT = 6;
const FRESH_FIND_LOADING_CARD_COUNT = 6;
const SHOW_FRESH_FINDS_HOME_SECTION = false;
const FRESH_FIND_STALE_HOURS = 72;
const FRESH_FIND_STALE_MS = FRESH_FIND_STALE_HOURS * 60 * 60 * 1000;
const FRESH_LISTING_HOURS = 72;
const FRESH_LISTING_MS = FRESH_LISTING_HOURS * 60 * 60 * 1000;
const SAVE_CONFIRMATION_DURATION_MS = 3500;
const SAVE_CONFIRMATION_TRANSITION_MS = 220;
const FRESH_FIND_CURATOR_TERMS = [
  "arp",
  "cs-",
  "drum machine",
  "dx7",
  "eurorack",
  "juno",
  "jupiter",
  "korg",
  "moog",
  "oberheim",
  "prophet",
  "roland",
  "sampler",
  "sequential",
  "sequential circuits",
  "sh-",
  "synth",
  "synthesizer",
  "tb-",
  "tr-",
  "vintage",
  "waldorf",
];
const SOURCE_ACCENT_TOKENS = {
  mercari: "--source-mercari",
  "yahoo-auctions": "--source-yahoo-auctions",
  "yahoo-fleamarket": "--source-yahoo-fleamarket",
  rakuma: "--source-rakuma",
  digimart: "--source-digimart",
  reverb: "--source-reverb",
  "reverb-us": "--source-reverb",
  "ebay-us": "--source-ebay",
  "sweetwater-used": "--source-sweetwater",
  "guitar-center-used": "--source-guitar-center",
  "craigslist-sfbay": "--source-craigslist",
  robotspeak: "--source-reverb",
  "mission-synths": "--source-implant4",
  "starving-musician": "--source-five-g",
  "bananas-at-large": "--source-offmall",
  "gelb-music": "--source-digimart",
  "craigslist-la": "--source-craigslist",
  "craigslist-east": "--source-craigslist",
  "main-drag": "--source-guitar-center",
  "rogue-music": "--source-guitar-center",
  "three-wave": "--source-ebay",
  "alto-music": "--source-ebay",
  "tone-tweakers": "--source-five-g",
  "pro-audio-star": "--source-ebay",
  jimoty: "--source-jimoty",
  offmall: "--source-offmall",
  "five-g": "--source-five-g",
  implant4: "--source-implant4",
  hardoff: "--source-hardoff",
};

const RANDOMIZED_BAY_AREA_SOURCE_IDS = ["robotspeak", "mission-synths", "starving-musician", "bananas-at-large", "gelb-music"];
const RANDOMIZED_BAY_AREA_SOURCE_COLORS = [
  { solid: "#ff00ff", ink: "#ffffff", mark: "#ff00ff" },
  { solid: "#0072ff", ink: "#ffffff", mark: "#0072ff" },
  { solid: "#00a36c", ink: "#ffffff", mark: "#00a36c" },
  { solid: "#ff7a00", ink: "#ffffff", mark: "#ff7a00" },
  { solid: "#8a5cff", ink: "#ffffff", mark: "#8a5cff" },
];
const RANDOMIZED_BAY_AREA_SOURCE_COLOR_MAP = createRandomizedSourceColorMap(
  RANDOMIZED_BAY_AREA_SOURCE_IDS,
  RANDOMIZED_BAY_AREA_SOURCE_COLORS,
);

const SOURCE_METADATA_ALIASES = {
  mercari: ["Mercari", "メルカリ"],
  "yahoo-auctions": ["Yahoo Auctions", "Yahoo Auction", "ヤフオク"],
  "yahoo-fleamarket": ["Yahoo Fleamarket", "Yahooフリマ", "PayPayフリマ"],
  rakuma: ["Rakuma", "ラクマ"],
  digimart: ["Digimart", "デジマート"],
  reverb: ["Reverb", "Reverb.com"],
  "reverb-us": ["Reverb US", "Reverb", "Reverb.com"],
  "ebay-us": ["eBay US", "eBay", "ebay.com"],
  "sweetwater-used": ["Sweetwater Used", "Sweetwater", "Sweetwater Gear Exchange"],
  "guitar-center-used": ["Guitar Center", "Guitar Center Used", "GC Used"],
  "craigslist-sfbay": ["Craigslist SF", "Craigslist", "SF Bay Craigslist"],
  robotspeak: ["Robot Speak", "ROBOTSPEAk", "Robotspeak"],
  "mission-synths": ["Mission Synths", "Mission Synths SF"],
  "starving-musician": ["Starving Musician", "The Starving Musician"],
  "bananas-at-large": ["Bananas", "Bananas at Large", "Bananas At Large"],
  "gelb-music": ["Gelb Music", "Gelb"],
  "craigslist-la": ["Craigslist LA", "Craigslist Los Angeles", "LA Craigslist"],
  "craigslist-east": ["Craigslist East", "Craigslist East Coast", "NYC Craigslist", "Boston Craigslist", "Philly Craigslist", "DC Craigslist"],
  "main-drag": ["Main Drag", "Main Drag Music"],
  "rogue-music": ["Rogue Music", "Rogue Music Store"],
  "three-wave": ["Three Wave", "Three Wave Music"],
  "alto-music": ["Alto Music"],
  "tone-tweakers": ["Tone Tweakers", "Tone Tweakers Inc."],
  "pro-audio-star": ["ProAudioStar", "Pro Audio Star"],
  jimoty: ["Jimoty", "ジモティー", "ジモティ"],
  offmall: ["OFFMALL", "Off Mall", "Hard Off", "ハードオフ"],
  "five-g": ["Five G", "FIVE G", "Five G music technology"],
  implant4: ["implant4", "Implant4"],
  hardoff: ["Hard Off", "ハードオフ", "OFFMALL", "Off Mall"],
};
const SEARCH_TERM_ALIASES = {
  oberheim: ["オーバーハイム"],
  moog: ["モーグ", "ムーグ"],
  waldorf: ["ワルドルフ"],
  sequential: ["シーケンシャル"],
  roland: ["ローランド"],
  korg: ["コルグ"],
  yamaha: ["ヤマハ"],
  akai: ["アカイ"],
  elektron: ["エレクトロン"],
  arturia: ["アートリア"],
  novation: ["ノベーション"],
  ensoniq: ["エンソニック"],
  behringer: ["ベリンガー"],
  clavia: ["クラビア"],
  nord: ["ノード", "clavia"],
  "drum machine": ["ドラムマシン", "リズムマシン", "リズムボックス", "rhythm machine"],
  "drum machines": ["drum machine", "ドラムマシン", "リズムマシン", "リズムボックス"],
  "rhythm machine": ["リズムマシン", "ドラムマシン", "リズムボックス"],
  groovebox: ["グルーブボックス", "グルーヴボックス", "groove box"],
  "groove box": ["groovebox", "グルーブボックス", "グルーヴボックス"],
};
const STRICT_LATIN_TERMS = [
  "roli",
];
const AMBIGUOUS_GEAR_BRANDS = [
  "roli",
  "waldorf",
  "ワルドルフ",
];
const BRAND_MODEL_SIGNAL_TERMS = {
  mackie: [
    "1202",
    "1402",
    "1604",
    "1642",
    "8 bus",
    "8-bus",
    "cr1604",
    "cr-1604",
    "d8b",
    "mix8",
    "mix12",
    "onyx",
    "pro fx",
    "profx",
    "vlz",
    "vlz3",
    "vlz4",
  ],
  roli: [
    "airwave",
    "blocks",
    "lumi",
    "lightpad",
    "piano m",
    "rise",
    "seaboard",
    "songmaker",
  ],
  waldorf: [
    "blofeld",
    "iridium",
    "kyra",
    "largo",
    "micro q",
    "microwave",
    "m",
    "nw1",
    "pulse",
    "q",
    "quantum",
    "rocket",
    "streichfett",
    "stromberg",
    "zarenbourg",
    "xt",
    "xtk",
  ],
  "ワルドルフ": [
    "blofeld",
    "iridium",
    "kyra",
    "largo",
    "micro q",
    "microwave",
    "nw1",
    "pulse",
    "q",
    "quantum",
    "rocket",
    "streichfett",
    "stromberg",
    "zarenbourg",
    "xt",
    "xtk",
    "ブロフェルド",
    "イリジウム",
    "マイクロウェーブ",
    "マイクロ q",
    "パルス",
    "クォンタム",
    "ストライヒフェット",
  ],
};
const ACCESSORY_TERMS = [
  "adapter",
  "book",
  "cable",
  "case",
  "cd",
  "cover",
  "decksaver",
  "manual",
  "patch book",
  "power supply",
  "stand",
  "アダプター",
  "カタログ",
  "カバー",
  "ケース",
  "ケーブル",
  "スタンド",
  "デッキセーバー",
  "シャツ",
  "ジャケット",
  "スニーカー",
  "ブーツ",
  "靴",
  "マニュアル",
  "取扱説明書",
  "教則",
];
const GEAR_SIGNAL_TERMS = [
  "analog",
  "analog mixer",
  "audio interface",
  "audio mixer",
  "compact mixer",
  "desktop",
  "digital",
  "digital mixer",
  "drum machine",
  "drum machines",
  "drum module",
  "drum modules",
  "dr rhythm",
  "dr. rhythm",
  "eurorack",
  "groove box",
  "groovebox",
  "keyboard",
  "midi",
  "mixer",
  "mixers",
  "mixing board",
  "mixing console",
  "mixing desk",
  "module",
  "mpc",
  "powered mixer",
  "rack mixer",
  "rack",
  "rhythm composer",
  "rhythm machine",
  "sampler",
  "samplers",
  "sequencer",
  "synth",
  "synthesizer",
  "vco",
  "vca",
  "vcf",
  "vlz",
  "アナログ",
  "インターフェース",
  "オーディオ",
  "キーボード",
  "グルーブボックス",
  "サンプラー",
  "シーケンサー",
  "シンセ",
  "シンセサイザー",
  "ドラムマシン",
  "リズムボックス",
  "リズムマシン",
  "ミキサー",
  "ミキシング",
  "モジュール",
];
const MEDIA_NOISE_TERMS = [
  "12\"",
  "7\"",
  "album",
  "blu-ray",
  "bluray",
  "cassette",
  "cd",
  "dvd",
  "ep",
  "first press",
  "jacket",
  "laserdisc",
  "lp",
  "model kit",
  "record",
  "sample cd",
  "sampling cd",
  "single",
  "soundtrack",
  "vinyl",
  "アナログ盤",
  "アルバム",
  "カセット",
  "フィギュア",
  "プラモデル",
  "ピンバッジ",
  "マグネット",
  "サントラ",
  "サンプリングcd",
  "ジャズ",
  "レコード",
  "7インチ",
  "帯付",
  "帯付き",
  "歌謡",
  "紙ジャケ",
  "輸入盤",
];
const NEGATIVE_CATEGORY_IDS = [
  "20060", // comics and anime goods
  "21600", // books and magazines
  "21964", // movies and video
  "22152", // music media
  "23000", // fashion
  "23140", // accessories and watches
  "23976", // food and drink
  "24198", // home and interior
  "24202", // baby goods
  "24698", // sports and leisure
  "25464", // toys and games
  "26086", // garden
  "26318", // cars and motorbikes
  "42177", // beauty and health
  "2084032594", // celebrity goods
  "2084019007", // sampling CDs
  "2084214619", // DVDs
  "2084216603", // DVDs
  "2084055844", // pets
  "416", // Rakuma toys
  "770", // Rakuma CDs and music media
  "1622", // Rakuma character goods
];
const HARD_NEGATIVE_CATEGORY_IDS = [
  "21600", // books and magazines
  "21964", // movies and video
  "22152", // music media
  "23000", // fashion
  "2084019007", // sampling CDs
  "416", // Rakuma toys
  "770", // Rakuma CDs and music media
  "1622", // Rakuma character goods
];
const POSITIVE_GEAR_CATEGORY_IDS = [
  "22436",
  "22532",
  "2084019003",
  "2084019005",
  "2084240145",
  "46914",
  "1459",
  "1473",
  "1616",
];

const MOCK_LISTINGS = [
  {
    id: "mercari-waldorf-m-20260503",
    source: "mercari",
    title: "Waldorf Microwave XT シンセサイザー 動作品",
    price: 188000,
    condition: "動作品",
    listedAt: "2026-05-03T09:30:00+09:00",
    url: "https://jp.mercari.com/search?keyword=Waldorf",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "yahoo-auctions-waldorf-blofeld-20260503",
    source: "yahoo-auctions",
    title: "Waldorf Blofeld Desktop ホワイト 音出し確認済み",
    price: 62000,
    condition: "確認済み",
    listedAt: "2026-05-03T08:12:00+09:00",
    url: "https://auctions.yahoo.co.jp/search/search?p=Waldorf",
    image: "https://images.unsplash.com/photo-1616663395403-2e00509b8e43?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "digimart-waldorf-iridium-20260502",
    source: "digimart",
    title: "Waldorf Iridium Keyboard 中古美品",
    price: 318000,
    condition: "美品",
    listedAt: "2026-05-02T18:45:00+09:00",
    url: "https://www.digimart.net/search?keywordAnd=Waldorf",
    image: "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "offmall-waldorf-streichfett-20260502",
    source: "offmall",
    title: "Waldorf STREICHFETT ストリングシンセ 箱付き",
    price: 44800,
    condition: "中古",
    listedAt: "2026-05-02T15:02:00+09:00",
    url: "https://netmall.hardoff.co.jp/search/?q=Waldorf",
    image: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "five-g-waldorf-q-20260501",
    source: "five-g",
    title: "Waldorf Q Rack Vintage Digital Synthesizer",
    price: 248000,
    condition: "Vintage",
    listedAt: "2026-05-01T12:15:00+09:00",
    url: "https://fiveg.net/",
    image: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "implant4-waldorf-pulse-20260501",
    source: "implant4",
    title: "Waldorf Pulse 2 Analog Synth Module",
    price: 72000,
    condition: "Used",
    listedAt: "2026-05-01T10:11:00+09:00",
    url: "https://shop.implant4.com/",
    image: "https://images.unsplash.com/photo-1461784180009-21121b2f204c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "rakuma-waldorf-manual-filtered",
    source: "rakuma",
    title: "Waldorf Blofeld manual CD set",
    price: 3000,
    condition: "Accessory",
    listedAt: "2026-05-01T09:00:00+09:00",
    url: "https://fril.jp/search/Waldorf",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80",
  },
];

const STARTER_FRESH_FIND_LISTINGS = [
  {
    id: "starter-moog-vintage-synths",
    source: "mercari",
    title: "Moog vintage synths in Japan",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T09:00:00+09:00",
    url: "https://jp.mercari.com/en/search?keyword=Moog%20synthesizer&sort=created_time&order=desc&status=on_sale",
    image: createStarterSynthArtwork("Moog", "#d8e6f7", "#171a1d"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-oberheim-japan",
    source: "yahoo-auctions",
    title: "Oberheim auctions and modules",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T08:00:00+09:00",
    url: "https://auctions.yahoo.co.jp/search/search?p=Oberheim%20synthesizer&exflg=1&s1=new&o1=d",
    image: createStarterSynthArtwork("Oberheim", "#ead8c8", "#1f2023"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-roland-classics",
    source: "yahoo-fleamarket",
    title: "Roland Juno, Jupiter and drum machines",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T07:00:00+09:00",
    url: "https://paypayfleamarket.yahoo.co.jp/search/Roland%20synthesizer",
    image: createStarterSynthArtwork("Roland", "#d7cec1", "#12171a"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-sequential-circuits",
    source: "digimart",
    title: "Sequential Circuits and Prophet gear",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T06:00:00+09:00",
    url: "https://www.digimart.net/search?keywordAnd=Sequential%20Circuits",
    image: createStarterSynthArtwork("Sequential", "#dae6dd", "#181b1c"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-arp-vintage",
    source: "reverb",
    title: "Vintage synth listings shipping from Japan",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T05:00:00+09:00",
    url: "https://reverb.com/marketplace?query=country%3Ajp%20vintage%20synthesizer",
    image: createStarterSynthArtwork("Vintage", "#e6e0ec", "#151515"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-hardoff-synths",
    source: "offmall",
    title: "Hard Off synths, samplers and modules",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T04:00:00+09:00",
    url: "https://netmall.hardoff.co.jp/search/?q=%E3%82%B7%E3%83%B3%E3%82%BB%E3%82%B5%E3%82%A4%E3%82%B6%E3%83%BC",
    image: createStarterSynthArtwork("Hard Off", "#e9e4d6", "#1a1f22"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-five-g-vintage",
    source: "five-g",
    title: "Five G vintage synthesizer inventory",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T03:00:00+09:00",
    url: "https://fiveg.net/",
    image: createStarterSynthArtwork("Five G", "#d3e0e4", "#111416"),
    isStarterFreshFind: true,
  },
  {
    id: "starter-implant4-rare-synths",
    source: "implant4",
    title: "Rare synths and boutique used gear",
    priceLabel: "Explore",
    condition: "Starter search",
    listedAt: "2026-06-04T02:00:00+09:00",
    url: "https://shop.implant4.com/search?type=product&options%5Bprefix%5D=last&options%5Bunavailable_products%5D=last&q=synthesizer",
    image: createStarterSynthArtwork("implant4", "#e7d7da", "#171a1d"),
    isStarterFreshFind: true,
  },
];
const STARTER_FRESH_FIND_TERMS = [
  "Moog synthesizer",
  "Oberheim",
  "Roland Juno",
  "Roland Jupiter",
  "Sequential Prophet",
  "Sequential Circuits",
  "ARP synthesizer",
  "Korg MS-20",
  "Yamaha CS",
  "vintage synthesizer",
];
const STARTER_FRESH_FIND_SOURCE_IDS = ["yahoo-auctions", "digimart", "offmall", "mercari", "reverb"];
const REGIONAL_FRESH_FIND_SOURCE_IDS = {
  japan: STARTER_FRESH_FIND_SOURCE_IDS,
  "bay-area": ["robotspeak", "mission-synths", "starving-musician", "bananas-at-large", "gelb-music", "craigslist-sfbay", "reverb-us", "ebay-us"],
  "los-angeles": ["craigslist-la", "reverb-us", "ebay-us", "sweetwater-used", "guitar-center-used"],
  "east-coast": ["main-drag", "rogue-music", "three-wave", "alto-music", "tone-tweakers", "reverb-us", "ebay-us"],
};
const STARTER_FRESH_FIND_EXCLUDES = [
  "CD",
  "LP",
  "record",
  "book",
  "brochure",
  "magazine",
  "manual",
  "miniature",
  "pamphlet",
  "poster",
  "score",
  "shirt",
  "songbook",
  "sticker",
  "t shirt",
  "t-shirt",
  "tee",
  "video",
  "vhs",
  "patch book",
  "Tシャツ",
  "カタログ",
  "キーボード・マガジン",
  "マガジン",
  "パンフレット",
  "マニュアル",
  "ムック",
  "楽譜",
  "映像",
  "雑誌",
  "ミニチュア",
  "取扱説明書",
];
const GEAR_SCANNER_EXCLUDE_TERMS = [
  "replacement",
  "spare part",
  "spare parts",
  "repair part",
  "parts only",
  "case only",
  "manual only",
  "cable only",
  "power supply only",
  "screen",
  "display",
  "lcd",
  "oled",
  "led screen",
  "rom",
  "eprom",
  "firmware",
  "chip",
  "panel",
  "sheet music",
  "music stand",
  "newspaper",
  "piano sticker",
  "keyboard sticker",
  "note sticker",
  "finger guard",
  "sustain pedal",
  "damper pedal",
  "keyboard stand",
  "soft case",
  "carry bag",
  "carrying bag",
  "keyboard cover",
  "hard case",
  "travel case",
  "keyboard case",
  "mouse case",
  "computer keyboard",
  "monsgeek",
  "kitcut",
  "吹奏楽",
  "野外演奏",
  "野外ライブ",
  "風対策",
  "新聞",
  "創刊号",
  "音符シール",
  "五線譜",
  "ステッカー",
  "鍵盤シール",
  "ピアノシール",
  "ドレミ",
  "音階",
  "初心者",
  "練習用",
  "フィンガーガード",
  "譜面",
  "譜面ファイル",
  "液晶",
  "液晶パネル",
  "有機el",
  "ディスプレイ",
  "パネル",
  "交換",
  "交換用",
  "修理",
  "部品",
  "パーツ",
  "ケース",
  "ハードケース",
  "トラベルケース",
  "キーボードケース",
  "マウスケース",
  "キーボードスタンド",
  "ソフトケース",
  "キャリーバッグ",
  "キーボードカバー",
  "収納",
  "バッグ",
  "リュック",
  "サステインペダル",
  "サスティーンペダル",
  "ダンパーペダル",
  "コンピューター",
  "ケーブル",
  "コード",
  "アダプター",
  "電源のみ",
];
const GEAR_SCANNER_HARD_EXCLUDE_TERMS = [
  "replacement lcd",
  "replacement oled",
  "replacement screen",
  "lcd panel",
  "oled display",
  "display module",
  "display replacement",
  "firmware chip",
  "expansion rom",
  "special edition rom",
  "upgrade rom",
  "rom chip",
  "ser-7",
  "hard travel case",
  "keyboard case",
  "mouse case",
  "computer keyboard",
  "piano sticker",
  "keyboard sticker",
  "note sticker",
  "finger guard",
  "monsgeek",
  "kitcut",
  "cable only",
  "manual only",
  "case only",
  "power supply only",
  "液晶パネル",
  "有機el",
  "譜面ファイル",
  "吹奏楽",
  "野外演奏",
  "野外ライブ",
  "風対策",
  "新聞",
  "創刊号",
  "音符シール",
  "五線譜",
  "鍵盤シール",
  "ピアノシール",
  "フィンガーガード",
  "交換用",
  "キーボードケース",
  "マウスケース",
];
const GEAR_SCANNER_MIN_INCLUDE_SCORE = 70;
// Below-threshold listings may only backfill up to this many cards, and never
// below the fallback floor — fewer strong cards beats filling with junk.
const GEAR_SCANNER_MIN_FALLBACK_CARDS = 3;
const GEAR_SCANNER_FALLBACK_MIN_SCORE = 40;
const GEAR_SCANNER_POSITIVE_TERMS = [
  "synth",
  "synthesizer",
  "synthesiser",
  "analog synth",
  "analogue synth",
  "keyboard",
  "module",
  "desktop module",
  "sound module",
  "rack",
  "rackmount",
  "drum machine",
  "groovebox",
  "sampler",
  "sequencer",
  "eurorack",
  "modular",
  "semi-modular",
  "vco",
  "vcf",
  "vca",
  "moog",
  "arp",
  "oberheim",
  "sequential",
  "sequential circuits",
  "roland",
  "yamaha",
  "waldorf",
  "ensoniq",
  "korg",
  "akai",
  "elektron",
  "novation",
  "behringer",
  "arturia",
  "dave smith",
  "prophet",
  "juno",
  "jupiter",
  "sh-101",
  "tb-303",
  "tr-808",
  "tr-909",
  "volca",
  "volca sample",
  "volca bass",
  "volca fm",
  "dx7",
  "minimoog",
  "odyssey",
  "シンセ",
  "シンセサイザー",
  "アナログシンセ",
  "キーボード",
  "音源モジュール",
  "ドラムマシン",
  "サンプラー",
  "シーケンサー",
  "モジュラー",
  "ユーロラック",
];
const GEAR_SCANNER_KNOWN_BRANDS = [
  "moog",
  "arp",
  "oberheim",
  "sequential circuits",
  "sequential",
  "roland",
  "yamaha",
  "waldorf",
  "ensoniq",
  "korg",
  "akai",
  "elektron",
  "arturia",
  "novation",
  "behringer",
  "dave smith",
  "dsi",
  "alesis",
  "casio",
  "teenage engineering",
  "make noise",
  "mutable instruments",
  "erica synths",
  "doepfer",
  "intellijel",
];
const GEAR_SCANNER_KNOWN_MODELS = [
  "dx7",
  "juno",
  "juno-106",
  "jupiter",
  "sh-101",
  "tb-303",
  "tr-808",
  "tr-909",
  "minimoog",
  "grandmother",
  "matriarch",
  "odyssey",
  "prophet",
  "ob-x",
  "ob-xa",
  "sem",
  "microwave",
  "sq-80",
  "mirage",
  "volca",
  "ms-20",
  "monologue",
  "minilogue",
  "mpc",
  "octatrack",
  "digitakt",
  "digitone",
  "op-1",
];

function createStarterSynthArtwork(label, background, panel) {
  const safeLabel = String(label).replace(/[<>&"]/g, "");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 900">
      <rect width="900" height="900" fill="${background}"/>
      <circle cx="720" cy="170" r="150" fill="rgba(255,255,255,0.24)"/>
      <g transform="translate(80 255) rotate(-8 370 170)">
        <rect x="0" y="0" width="740" height="252" rx="34" fill="${panel}"/>
        <rect x="52" y="118" width="640" height="112" rx="14" fill="#fafaf5"/>
        <g fill="#101416">
          ${Array.from({ length: 18 }, (_, index) => `<rect x="${82 + index * 34}" y="118" width="17" height="72"/>`).join("")}
        </g>
        <g fill="#d64b64">
          ${Array.from({ length: 6 }, (_, index) => `<circle cx="${156 + index * 86}" cy="54" r="17"/>`).join("")}
        </g>
        <g fill="#55b982">
          ${Array.from({ length: 6 }, (_, index) => `<circle cx="${184 + index * 86}" cy="88" r="11"/>`).join("")}
        </g>
        <rect x="560" y="34" width="88" height="48" rx="8" fill="#94e0ff"/>
      </g>
      <text x="70" y="800" fill="#111416" font-family="Arial, Helvetica, sans-serif" font-size="76" font-weight="900">${safeLabel}</text>
    </svg>
  `;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const STORAGE_KEYS = {
  profiles: "bumpers.profiles",
  seen: "bumpers.seen",
  watching: "bumpers.watching",
  theme: "bumpers.theme",
  settings: "bumpers.settings",
  authSession: "bumpers.authSession",
  cloudSyncMeta: "bumpers.cloudSyncMeta",
  listingLedger: "bumpers.listingLedger",
  freshFindCache: "bumpers.freshFindCache",
  feedbackRules: "bumpers.feedbackRules",
};

const SAVED_SEARCH_SCHEMA_VERSION = 1;
const LOCAL_PROFILE_USER_ID = "local";
const CLOUD_EMULATOR_USER = {
  id: LOCAL_PROFILE_USER_ID,
  email: "local-user@brrtz.com",
  name: "Local Brrtz User",
};
const savedSearchRepository = createSavedSearchRepository({
  storageKey: STORAGE_KEYS.profiles,
});

let authState = {
  config: null,
  session: null,
  user: null,
  callbackError: null,
  accountNotice: "",
  lastSyncedAt: "",
};

const DEFAULT_BRAND_GRADIENT = Object.freeze({
  start: "#ff00ff",
  end: "#0072ff",
});
const RESULT_VIEW_MODES = new Set(["grid", "list", "gallery"]);

const defaultSettings = {
  regionId: ACTIVE_REGION.id || "japan",
  currency: ACTIVE_REGION.currency || "JPY",
  jpyPerUsd: 155,
  resultView: "grid",
  gearMode: true,
  brandGradient: { ...DEFAULT_BRAND_GRADIENT },
};

const CATEGORY_INTENTS = [
  { id: "all", label: "All Gear" },
  { id: "synthesizers", label: "Synthesizers" },
  { id: "drum-machines", label: "Drum Machines" },
  { id: "samplers", label: "Samplers" },
  { id: "sequencers", label: "Sequencers" },
  { id: "modular", label: "Eurorack / Modular" },
  { id: "effects-pedals", label: "Effects" },
  { id: "pro-audio", label: "Pro Audio" },
];
const BROWSE_CATEGORY_INTENTS = CATEGORY_INTENTS.filter((intent) => intent.id !== "sequencers");
const DEFAULT_CATEGORY_INTENT = "synthesizers";
const DEFAULT_BROWSE_CATEGORY_INTENT = "all";
const CATEGORY_INTENT_IDS = new Set(CATEGORY_INTENTS.map((intent) => intent.id));
const R2D2_SEARCH_TARGET = "Arp 2600";
// Add more makers here to expand quick model autosuggest.
const SYNTH_MODEL_SUGGESTIONS = [
  {
    maker: "Moog",
    aliases: ["moog"],
    models: ["Voyager", "Source", "Minimoog", "One", "MemoryMoog"],
  },
  {
    maker: "ARP",
    aliases: ["arp", "apr"],
    models: ["2600", "Odyssey", "Axxe", "Solus", "Solina", "Odyssey MK1"],
  },
  {
    maker: "TR",
    aliases: ["tr"],
    termJoiner: "",
    models: ["-909", "-808", "-606", "-707", "-727", "-505"],
  },
];

const defaultProfile = {
  name: "New Search",
  terms: [],
  excludes: ["manual", "magnet", "power cord", "doll", "Fashionist", "shirt", "CD", "Moments to Remember", "record", "shoes"],
  noiseTerms: [...ACCESSORY_TERMS],
  categoryIntent: ACTIVE_REGION.searchDefaults?.categoryIntent || DEFAULT_CATEGORY_INTENT,
  maxPrice: ACTIVE_REGION.searchDefaults?.maxPrice || 2000000,
  alertMode: "immediate",
  sources: hydrateRegionSources(ACTIVE_REGION.sources),
};

let appSettings = loadSettings();
let currentProfile = createFreshProfile();
let currentResults = [];
let currentDiscoveryIds = new Set();
let currentNewForSearchIds = new Set();
let filterMode = "all";
let qualityFilter = appSettings.gearMode ? "clean" : "all";
let sortMode = "newest";
let activeViewSources = new Set();
let currentPage = 1;
let isSearching = false;
let pendingSourceIds = new Set();
let sourceSearchStatuses = new Map();
let sourceSearchMeta = new Map();
let searchRunId = 0;
let loadingCardId = 0;
let backToTopFrame = 0;
let mobileSearchOverlayFrame = 0;
let selectInteractionActive = false;
let lastSelectInteractionAt = 0;
let deferredResultsRender = false;
let selectInteractionReleaseTimer = 0;
let deferredSearchApply = null;
let searchResultApplyTimer = 0;
let starterFreshFindStatus = "idle";
let starterFreshFindListings = [];
let starterFreshFindTerms = [];
let starterFreshFindRequestId = 0;
let starterFreshFindAbortController = null;
let browseCategoryIntent = DEFAULT_BROWSE_CATEGORY_INTENT;
let browseCategoryStatus = "idle";
let browseCategoryListings = [];
let browseCategoryError = "";
let browseCategoryCacheSignature = "";
let browseCategoryUpdatedAt = "";
let browseCategoryRequestId = 0;
let browseCategorySelectionTimer = 0;
let browseCategoryAbortController = null;
let browseCategoryPostLoadTaskId = 0;
let browseCardRenderId = 0;
let browsePreparedListingsCache = null;
let browseCategoryBrandSlug = "";
let browseBrandResultView = "gallery";
let gearBrowserScenePreviousStatus = browseCategoryStatus;
let gearBrowserSceneFadeUntil = 0;
let isBrowseExpanded = false;
let activeBrowseBrandSlug = "";
let isSourceRowExpanded = true;
const rakumaClientThumbnailCache = new Map();
let searchState = {
  mode: "idle",
  message: "Ready",
  detail: "Enter a search term to start a fresh scan.",
  errors: [],
};

const sourceList = document.querySelector("#sourceList");
const savedSearches = document.querySelector("#savedSearches");
const searchForm = document.querySelector("#searchForm");
const brandHomeLink = document.querySelector("#brandHomeLink");
const regionQuickSelect = document.querySelector("#regionQuickSelect");
const regionSelector = document.querySelector("#regionSelector");
const termsInput = document.querySelector("#terms");
const mobileSearchOverlay = document.querySelector("#mobileSearchOverlay");
const mobileSearchForm = document.querySelector("#mobileSearchForm");
const mobileSearchInput = document.querySelector("#mobileSearchInput");
const refineTermsInput = document.querySelector("#refineTerms");
const excludesInput = document.querySelector("#excludes");
const excludeTagField = document.querySelector("#excludeTagField");
const excludeTagList = document.querySelector("#excludeTagList");
const excludeTagInput = document.querySelector("#excludeTagInput");
const categoryIntentSelect = document.querySelector("#categoryIntent");
const termDropdown = document.querySelector("#termDropdown");
const quickSearchExtraTermsButton = document.querySelector("#quickSearchExtraTerms");
const quickSearchClearButton = document.querySelector("#quickSearchClear");
const quickSearchSuggestions = document.querySelector("#quickSearchSuggestions");
const resultGrid = document.querySelector("#resultGrid");
const paginationControls = document.querySelector("#paginationControls");
const paginationSummary = document.querySelector("#paginationSummary");
const paginationPage = document.querySelector("#paginationPage");
const template = document.querySelector("#listingTemplate");
const alertTemplate = document.querySelector("#alertTemplate");
const alertPanel = document.querySelector(".alert-panel");
const alertList = document.querySelector("#alertList");
const alertCount = document.querySelector("#alertCount");
const alertDetail = document.querySelector("#alertDetail");
const alertTitle = document.querySelector("#alertTitle");
const sourceFilterList = document.querySelector("#sourceFilterList");
const sourceQualityStatus = document.querySelector("#sourceQualityStatus");
const openSourceQualitySettingsButton = document.querySelector("#openSourceQualitySettings");
const sourceAssistPanel = document.querySelector("#sourceAssistPanel");
const sourceAssistList = document.querySelector("#sourceAssistList");
const themeToggle = document.querySelector("#themeToggle");
const liveStatus = document.querySelector("#liveStatus");
const qualityModeButtons = document.querySelectorAll("[data-quality]");
const sortModeSelect = document.querySelector("#sortMode");
const resultViewButtons = document.querySelectorAll("[data-result-view]");
const openSavedSearchesButton = document.querySelector("#openSavedSearches");
const savedSearchPopover = document.querySelector("#savedSearchPopover");
const savedWatchingFilter = document.querySelector("#savedWatchingFilter");
const quickSaveSearchButton = document.querySelector("#quickSaveSearch");
const topWatchingFilter = document.querySelector("#topWatchingFilter");
const mobileBottomNav = document.querySelector("#mobileBottomNav");
const mobileBottomNavItems = [...document.querySelectorAll("[data-mobile-nav]")];
const refineSearchModal = document.querySelector("#refineSearchModal");
const refineSummary = document.querySelector("#refineSummary");
const refineSourceOptions = document.querySelector("#refineSourceOptions");
const refineNoiseOptions = document.querySelector("#refineNoiseOptions");
const refineSourceCount = document.querySelector("#refineSourceCount");
const refineNoiseCount = document.querySelector("#refineNoiseCount");
const saveRefineSearchButton = document.querySelector("#saveRefineSearch");
const saveSearchModal = document.querySelector("#saveSearchModal");
const saveSearchForm = document.querySelector("#saveSearchForm");
const saveSearchName = document.querySelector("#saveSearchName");
const saveSearchAlert = document.querySelector("#saveSearchAlert");
const saveConfirmationToast = document.querySelector("#saveConfirmationToast");
const closeSaveConfirmationToastButton = document.querySelector("#closeSaveConfirmationToast");
const viewSavedSearchToastButton = document.querySelector("#viewSavedSearchToast");
const savedRegionChoiceModal = document.querySelector("#savedRegionChoiceModal");
const savedRegionChoiceDescription = document.querySelector("#savedRegionChoiceDescription");
const runSavedHomeRegionButton = document.querySelector("#runSavedHomeRegion");
const runSavedCurrentRegionButton = document.querySelector("#runSavedCurrentRegion");
const duplicateSavedCurrentRegionButton = document.querySelector("#duplicateSavedCurrentRegion");
const settingsModal = document.querySelector("#settingsModal");
const settingsForm = document.querySelector("#settingsForm");
const settingsTabs = [...document.querySelectorAll("[data-settings-tab]")];
const settingsPanels = [...document.querySelectorAll("[data-settings-panel]")];
const currencyToggle = document.querySelector("#currencyToggle");
const themeSettingsToggle = document.querySelector("#themeSettingsToggle");
const gearModeSettingsToggle = document.querySelector("#gearModeSettingsToggle");
const jpyPerUsdInput = document.querySelector("#jpyPerUsd");
const brandGradientStartInput = document.querySelector("#brandGradientStart");
const brandGradientEndInput = document.querySelector("#brandGradientEnd");
const brandGradientStartColorInput = document.querySelector("#brandGradientStartColor");
const brandGradientEndColorInput = document.querySelector("#brandGradientEndColor");
const brandGradientStartRgbInputs = {
  r: document.querySelector("#brandGradientStartR"),
  g: document.querySelector("#brandGradientStartG"),
  b: document.querySelector("#brandGradientStartB"),
};
const brandGradientEndRgbInputs = {
  r: document.querySelector("#brandGradientEndR"),
  g: document.querySelector("#brandGradientEndG"),
  b: document.querySelector("#brandGradientEndB"),
};
const brandGradientStopControls = {
  start: {
    hex: brandGradientStartInput,
    color: brandGradientStartColorInput,
    rgb: brandGradientStartRgbInputs,
  },
  end: {
    hex: brandGradientEndInput,
    color: brandGradientEndColorInput,
    rgb: brandGradientEndRgbInputs,
  },
};
const brandGradientPreview = document.querySelector("#brandGradientPreview");
const applyBrandGradientButton = document.querySelector("#applyBrandGradient");
const resetBrandGradientButton = document.querySelector("#resetBrandGradient");
const regionSelect = document.querySelector("#regionSelect");
const signedOutAccountPanel = document.querySelector("#signedOutAccountPanel");
const signedInAccountPanel = document.querySelector("#signedInAccountPanel");
const accountEmailInput = document.querySelector("#accountEmailInput");
const accountEmailDisplay = document.querySelector("#accountEmailDisplay");
const accountStatus = document.querySelector("#accountStatus");
const accountSyncDetail = document.querySelector("#accountSyncDetail");
const sendSignInLinkButton = document.querySelector("#sendSignInLink");
const syncAccountSavedSearchesButton = document.querySelector("#syncAccountSavedSearches");
const signOutAccountButton = document.querySelector("#signOutAccount");
const cloudProfileEmail = document.querySelector("#cloudProfileEmail");
const pullCloudSavedSearchesButton = document.querySelector("#pullCloudSavedSearches");
const pushCloudSavedSearchesButton = document.querySelector("#pushCloudSavedSearches");
const exportSavedSearchesButton = document.querySelector("#exportSavedSearches");
const importSavedSearchesButton = document.querySelector("#importSavedSearches");
const savedSearchImportFile = document.querySelector("#savedSearchImportFile");
const savedSearchTransferStatus = document.querySelector("#savedSearchTransferStatus");
const backToTopButton = document.querySelector("#backToTop");
let refineSearchReturnFocus = null;
let saveSearchReturnFocus = null;
let savedRegionChoiceReturnFocus = null;
let pendingSavedRegionProfile = null;
let settingsReturnFocus = null;
let savedPopoverAnchorElement = null;
let savedPopoverAnchorMode = "header";
let savedSearchAutoSyncTimer = 0;
let profileAutoSyncTimer = 0;
let saveConfirmationTimer = 0;
let isSavedSearchAutoSyncing = false;
let isProfileAutoSyncing = false;
let eventsBound = false;
let searchChirpAudioCtx = null;

function initialize() {
  const startupAppView = getCurrentAppView();
  isBrowseExpanded = startupAppView === APP_VIEW_SYNTH_BROWSER;
  if (startupAppView === APP_VIEW_WATCHLIST) filterMode = "watching";
  activeBrowseBrandSlug = getCurrentBrowseBrandSlug();
  runStartupStep("startup brand gradient url", applyStartupBrandGradientUrlParams);
  runStartupStep("brand gradient", () => applyBrandGradient(appSettings.brandGradient));
  bindEvents();
  const shouldRunStartupSearch = applyStartupSearchUrlParams();
  runStartupStep("stored theme", applyStoredTheme);
  runStartupStep("brand wave", initializeBrandWave);
  runStartupStep("sources", renderSources);
  runStartupStep("region badge", updateRegionBadge);
  runStartupStep("active profile", () => {
    fillForm(currentProfile);
    setActiveTitle(currentProfile.name);
  });
  runStartupStep("saved searches", renderSavedSearches);
  runStartupStep("search status", updateSearchStatus);
  runStartupStep("results", renderResults);
  runStartupStep("back to top", updateBackToTopVisibility);
  runStartupStep("mobile search overlay", updateMobileSearchOverlayVisibility);
  runStartupStep("auth", initializeAuth);
  if (shouldRunStartupSearch) runStartupStep("startup search url", runSearch);
}

function runStartupStep(label, action) {
  try {
    return action();
  } catch (error) {
    console.error(`Brrtz startup step failed: ${label}`, error);
    return undefined;
  }
}

function applyStartupSearchUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || params.get("terms") || "";
  const terms = splitLines(query);
  if (terms.length === 0) return false;

  const regionParam = params.get("region") || params.get("regionId") || "";
  const nextRegionId = regionParam ? sanitizeRegionId(regionParam) : appSettings.regionId;
  if (nextRegionId !== appSettings.regionId) {
    appSettings = hydrateSettings({ ...appSettings, regionId: nextRegionId });
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
    resetRegionRuntimeState();
  }

  const categoryParam = params.get("category") || params.get("categoryIntent") || "";
  currentProfile = hydrateProfile({
    ...createFreshProfile(),
    name: getFormProfileName(terms),
    regionId: appSettings.regionId,
    terms,
    categoryIntent: sanitizeCategoryIntent(categoryParam, appSettings.regionId),
    sources: getRegionSourceIds(appSettings.regionId),
  });
  return true;
}

function applyStartupBrandGradientUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const gradient = readBrandGradientFromUrlParams(params);
  if (!gradient) return false;

  appSettings = hydrateSettings({ ...appSettings, brandGradient: gradient });
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  applyBrandGradient(appSettings.brandGradient);
  return true;
}

function initializeBrandWave() {
  const waveSurface = document.querySelector(".app-header");
  const svg = document.querySelector(".brand-wave-svg");
  const sinePath = document.querySelector("#sinePath");
  if (!svg || !sinePath) return;

  const W = 1200;
  const MID = 70;
  const STEP_SIN = 10;
  const RADIUS = 170;
  const CLEAN_AMP = 24;
  const COLOR_S = 8;
  const LOW_C = [
    65.41, 73.42, 82.41, 87.31, 98.00, 110.00, 123.47,
    130.81, 146.83, 164.81, 174.61, 196.00, 220.00, 246.94,
  ];
  const CHORDS = [
    [261.63, 329.63, 392.00, 523.25],
    [293.66, 349.23, 440.00, 587.33],
    [329.63, 392.00, 493.88, 659.25],
    [349.23, 440.00, 523.25, 698.46],
    [392.00, 493.88, 587.33, 783.99],
    [220.00, 261.63, 329.63, 440.00],
  ];
  const PATTERNS = [
    [0, 1, 2, 3, 2, 1, 2, 1],
    [0, 2, 1, 3, 2, 1, 0, 2],
    [0, 1, 2, 1, 3, 2, 1, 0],
    [0, 2, 3, 2, 1, 2, 0, 1],
    [0, 1, 3, 2, 1, 0, 2, 3],
  ];
  const IDLE_NOTE = 130.81;
  const IDLE_FIFTH = 196.00;
  const IDLE_GAIN = 0.025;
  const ACTIVE_GAIN = 0.08;
  const RELEASE_GAIN = 0.0001;
  const HOVER_AUDIO_DELAY_MS = 3000;
  const ARP_MS = 5000;
  const pageStart = Date.now();

  let wt = 0;
  let phase = 0;
  let lastTime = performance.now();
  let pointerX = W / 2;
  let pointerActive = false;
  let hoverMix = 0;
  let hoverStart = null;
  let hasRolledOut = false;
  let lastNoteAt = 0;
  let lastNote = IDLE_NOTE;
  let arpMode = false;
  let arpSeq = [];
  let arpIdx = 0;
  let nextArpAt = 0;
  let osc2LastNote = IDLE_FIFTH;
  let osc2ArpSeq = [];
  let audioCtx = null;
  let osc1 = null;
  let osc2 = null;
  let osc2Mix = null;
  let masterGain = null;
  let filt = null;
  let audioInit = false;
  let audioReady = false;
  let audioHoverTimer = 0;
  let audioArmed = false;
  let osc2FadeScheduled = false;
  let controlInteractionActive = false;
  let waveAnimationFrame = 0;
  let waveAnimationActive = false;

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

  function noise(x, now) {
    return Math.sin(x * 0.19 + now * 0.006) * 0.9
      + Math.sin(x * 0.47 - now * 0.009) * 0.55
      + Math.sin(x * 0.83 + now * 0.014) * 0.25;
  }

  function getPointerClientX(event) {
    if (typeof event?.clientX === "number") return event.clientX;
    const touch = event?.touches?.[0] || event?.changedTouches?.[0];
    return typeof touch?.clientX === "number" ? touch.clientX : null;
  }

  function svgX(event) {
    const rect = svg.getBoundingClientRect();
    const clientX = getPointerClientX(event) ?? rect.left + rect.width / 2;
    return (clientX - rect.left) * (W / rect.width);
  }

  function buildBezier(points) {
    if (!points.length) return "";
    let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
    for (let i = 1; i < points.length; i += 1) {
      const previous = points[i - 1];
      const current = points[i];
      const mx = ((previous.x + current.x) / 2).toFixed(2);
      const my = ((previous.y + current.y) / 2).toFixed(2);
      d += ` Q ${previous.x.toFixed(2)} ${previous.y.toFixed(2)} ${mx} ${my}`;
    }
    const last = points[points.length - 1];
    d += ` T ${last.x.toFixed(2)} ${last.y.toFixed(2)}`;
    return d;
  }

  function renderStaticWave() {
    const sinePoints = [];
    for (let x = -40; x <= W + 40; x += STEP_SIN) {
      sinePoints.push({
        x,
        y: MID + CLEAN_AMP * Math.sin(0.022 * x),
      });
    }
    sinePath.setAttribute("d", buildBezier(sinePoints));
  }

  function pickNote(pool, avoid) {
    let note = avoid;
    while (note === avoid) {
      note = pool[Math.floor(Math.random() * pool.length)];
    }
    return note;
  }

  function buildArp(chord) {
    const selectedChord = chord || CHORDS[Math.floor(Math.random() * CHORDS.length)];
    const pattern = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
    return pattern.map((index) => selectedChord[index]);
  }

  function newArpPair() {
    const chord = CHORDS[Math.floor(Math.random() * CHORDS.length)];
    arpSeq = buildArp(chord);
    osc2ArpSeq = buildArp(chord);
    arpIdx = 0;
  }

  async function resumeAudio() {
    if (!audioCtx) return;
    try {
      if (audioCtx.state !== "running") await audioCtx.resume();
      audioReady = audioCtx.state === "running";
    } catch {
      audioReady = false;
    }
  }

  async function initAudio() {
    if (audioInit) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    audioCtx = new AudioContext();
    const t0 = audioCtx.currentTime;

    osc1 = audioCtx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(IDLE_NOTE, t0);

    osc2 = audioCtx.createOscillator();
    osc2.type = "sawtooth";
    osc2.frequency.setValueAtTime(IDLE_FIFTH, t0);

    osc2Mix = audioCtx.createGain();
    osc2Mix.gain.setValueAtTime(0, t0);

    filt = audioCtx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.setValueAtTime(800, t0);
    filt.Q.setValueAtTime(8, t0);

    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(IDLE_GAIN, t0);

    osc1.connect(filt);
    osc2.connect(osc2Mix);
    osc2Mix.connect(filt);
    filt.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    osc1.start();
    osc2.start();

    audioInit = true;
    await resumeAudio();
  }

  function fadeInGain() {
    if (!audioReady) return;
    const time = audioCtx.currentTime;
    masterGain.gain.cancelScheduledValues(time);
    masterGain.gain.setValueAtTime(0, time);
    masterGain.gain.linearRampToValueAtTime(ACTIVE_GAIN, time + 0.2);
    hasRolledOut = false;
  }

  function engageAudio() {
    if (!audioReady) return;
    const time = audioCtx.currentTime;
    filt.frequency.cancelScheduledValues(time);
    filt.frequency.setTargetAtTime(300 + (pointerX / W) * 2200, time, 0.05);
    hasRolledOut = false;
  }

  function releaseAudio() {
    if (!audioReady) return;
    const time = audioCtx.currentTime;
    const currentOne = Math.max(lastNote, 20);
    const currentTwo = Math.max(osc2LastNote, 20);

    osc1.frequency.cancelScheduledValues(time);
    osc1.frequency.setValueAtTime(currentOne, time);
    osc1.frequency.exponentialRampToValueAtTime(Math.max(currentOne / 4, 20), time + 0.7);

    osc2.frequency.cancelScheduledValues(time);
    osc2.frequency.setValueAtTime(currentTwo, time);
    osc2.frequency.exponentialRampToValueAtTime(Math.max(currentTwo / 4, 20), time + 0.7);

    masterGain.gain.cancelScheduledValues(time);
    masterGain.gain.setValueAtTime(Math.max(masterGain.gain.value, 0.0001), time);
    masterGain.gain.exponentialRampToValueAtTime(RELEASE_GAIN, time + 0.7);

    filt.frequency.cancelScheduledValues(time);
    filt.frequency.setTargetAtTime(200, time, 0.09);
    hasRolledOut = true;
  }

  function playOsc1Note(frequency, glide = 0.035) {
    if (!osc1) return;
    lastNote = frequency;
    const time = audioCtx.currentTime;
    osc1.frequency.cancelScheduledValues(time);
    osc1.frequency.setTargetAtTime(frequency, time, glide);
    filt.frequency.cancelScheduledValues(time);
    filt.frequency.setTargetAtTime(300 + (pointerX / W) * 2200 + Math.random() * 180, time, 0.04);
  }

  function playOsc2Note(frequency, glide = 0.04) {
    if (!osc2) return;
    osc2LastNote = frequency;
    const time = audioCtx.currentTime;
    osc2.frequency.cancelScheduledValues(time);
    osc2.frequency.setTargetAtTime(frequency, time, glide);
  }

  function updateAudio(now) {
    if (!audioReady) return;

    const elapsed = (Date.now() - pageStart) / 1000;
    if (elapsed >= COLOR_S && !osc2FadeScheduled && osc2Mix) {
      osc2FadeScheduled = true;
      const time = audioCtx.currentTime;
      osc2Mix.gain.cancelScheduledValues(time);
      osc2Mix.gain.setValueAtTime(osc2Mix.gain.value, time);
      osc2Mix.gain.linearRampToValueAtTime(0.55, time + 2);
    }

    if (pointerActive) {
      engageAudio();

      if (!arpMode && hoverStart !== null && now - hoverStart >= ARP_MS) {
        arpMode = true;
        nextArpAt = now;
        newArpPair();
      }

      if (arpMode) {
        if (now >= nextArpAt) {
          if (arpIdx >= arpSeq.length) newArpPair();
          playOsc1Note(arpSeq[arpIdx], 0.02);
          if (osc2FadeScheduled) playOsc2Note(osc2ArpSeq[arpIdx], 0.025);
          arpIdx += 1;
          nextArpAt = now + 145 + Math.random() * 45;
        }
      } else if (now - lastNoteAt > 135) {
        lastNoteAt = now;
        lastNote = pickNote(LOW_C, lastNote);
        playOsc1Note(lastNote, 0.045);
        if (osc2FadeScheduled) {
          osc2LastNote = pickNote(LOW_C, osc2LastNote);
          playOsc2Note(osc2LastNote, 0.05);
        }
      }
    } else if (!hasRolledOut) {
      const time = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(time);
      masterGain.gain.setTargetAtTime(IDLE_GAIN, time, 0.18);
      osc1.frequency.cancelScheduledValues(time);
      osc1.frequency.setTargetAtTime(IDLE_NOTE, time, 0.08);
      osc2.frequency.cancelScheduledValues(time);
      osc2.frequency.setTargetAtTime(IDLE_FIFTH, time, 0.08);
      filt.frequency.cancelScheduledValues(time);
      filt.frequency.setTargetAtTime(800, time, 0.08);
    }
  }

  function render(now) {
    const dt = now - lastTime;
    lastTime = now;

    if (!waveAnimationActive || controlInteractionActive) {
      waveAnimationFrame = 0;
      return;
    }

    phase += dt * 0.16;
    wt += 0.025;
    hoverMix += ((pointerActive ? 1 : 0) - hoverMix) * 0.085;

    const p1 = Math.pow(Math.abs(Math.sin(wt * 2.1)), 1.6);
    const p2 = Math.pow(Math.abs(Math.sin(wt * 0.75 + 1.1)), 1.6);
    const reactiveAmp = 28 * Math.max(0.13, p1 * 0.65 + p2 * 0.35);

    const sinePoints = [];
    for (let x = -40; x <= W + 40; x += STEP_SIN) {
      const cleanY = CLEAN_AMP * Math.sin(0.022 * x - wt * 2.8);
      const reactiveY = reactiveAmp * Math.sin(0.022 * x - wt * 2.8)
        + reactiveAmp * 0.3 * Math.sin(0.047 * x + wt * 1.7)
        + reactiveAmp * 0.12 * Math.sin(0.095 * x - wt * 3.6)
        + reactiveAmp * 0.06 * Math.sin(0.19 * x + wt * 5.3)
        + reactiveAmp * 0.03 * Math.sin(0.38 * x - wt * 8.1);

      const distance = Math.abs(x - pointerX);
      const influence = clamp(1 - distance / RADIUS, 0, 1);
      const falloff = influence * influence * (3 - 2 * influence);
      const scramble = noise(x, now) * 13 + Math.sin(x * 1.4 - now * 0.045) * 3.5;
      const lift = Math.sin((x + phase * 1.3) / 52) * 5;
      const disruption = (scramble + lift) * falloff * hoverMix;
      sinePoints.push({
        x,
        y: MID + cleanY + (reactiveY - cleanY) * hoverMix + disruption,
      });
    }
    sinePath.setAttribute("d", buildBezier(sinePoints));

    updateAudio(now);
    waveAnimationFrame = requestAnimationFrame(render);
  }

  function startWaveAnimation() {
    if (waveAnimationActive) return;
    waveAnimationActive = true;
    lastTime = performance.now();
    waveAnimationFrame = requestAnimationFrame(render);
  }

  function stopWaveAnimation() {
    waveAnimationActive = false;
    if (waveAnimationFrame) {
      window.cancelAnimationFrame(waveAnimationFrame);
      waveAnimationFrame = 0;
    }
  }

  function isWaveControlEvent(event) {
    const target = event?.target;
    if (!(target instanceof Element)) return false;
    const interactive = target.closest("button, input, textarea, select, summary, a[href], [role='button'], .saved-popover");
    return Boolean(interactive && !target.closest("#brandHomeLink"));
  }

  function armHoverAudio() {
    if (audioHoverTimer || audioArmed) return;
    audioHoverTimer = window.setTimeout(() => {
      audioHoverTimer = 0;
      startHoverAudio();
    }, HOVER_AUDIO_DELAY_MS);
  }

  async function startHoverAudio() {
    if (hoverStart === null) return;
    if (performance.now() - hoverStart < HOVER_AUDIO_DELAY_MS) {
      armHoverAudio();
      return;
    }

    pointerActive = true;
    audioArmed = true;
    startWaveAnimation();

    await initAudio();
    await resumeAudio();
    if (!audioReady) return;

    fadeInGain();
    engageAudio();
  }

  async function wake(event) {
    if (isWaveControlEvent(event)) {
      sleep();
      return;
    }

    const clientX = getPointerClientX(event);

    if (clientX !== null) {
      pointerX = svgX(event);
      if (hoverStart === null) {
        hoverStart = performance.now();
        audioArmed = false;
        armHoverAudio();
      } else if (!audioArmed && performance.now() - hoverStart >= HOVER_AUDIO_DELAY_MS) {
        await startHoverAudio();
      } else if (audioArmed) {
        engageAudio();
      }
    }
  }

  function sleep() {
    pointerActive = false;
    hoverStart = null;
    audioArmed = false;
    stopWaveAnimation();
    if (audioHoverTimer) {
      window.clearTimeout(audioHoverTimer);
      audioHoverTimer = 0;
    }
    arpMode = false;
    arpSeq = [];
    osc2ArpSeq = [];
    arpIdx = 0;
    releaseAudio();
  }

  const interactionSurface = waveSurface || svg;
  renderStaticWave();
  interactionSurface.addEventListener("pointerenter", wake, { passive: true });
  interactionSurface.addEventListener("pointermove", wake, { passive: true });
  interactionSurface.addEventListener("pointerdown", wake, { passive: true });
  interactionSurface.addEventListener("touchstart", wake, { passive: true });
  interactionSurface.addEventListener("pointerleave", sleep);

  document.addEventListener("pointerover", (event) => {
    controlInteractionActive = isWaveControlEvent(event);
    if (controlInteractionActive) sleep();
  }, { passive: true });
  document.addEventListener("pointerout", (event) => {
    if (!controlInteractionActive || isWaveControlEvent(event)) return;
    controlInteractionActive = false;
  }, { passive: true });
  document.addEventListener("mouseover", (event) => {
    controlInteractionActive = isWaveControlEvent(event);
    if (controlInteractionActive) sleep();
  }, { passive: true });
  document.addEventListener("mouseout", (event) => {
    if (!controlInteractionActive || isWaveControlEvent(event)) return;
    controlInteractionActive = false;
  }, { passive: true });
  document.addEventListener("focusin", (event) => {
    controlInteractionActive = isWaveControlEvent(event);
    if (controlInteractionActive) sleep();
  });
  document.addEventListener("focusout", () => {
    controlInteractionActive = false;
  });

  document.addEventListener("visibilitychange", async () => {
    if (!audioCtx) return;
    if (document.hidden) {
      await audioCtx.suspend();
      audioReady = false;
    } else {
      await resumeAudio();
    }
  });

}

function bindEvents() {
  if (eventsBound) return;

  brandHomeLink.addEventListener("click", resetHomeView);
  regionQuickSelect?.addEventListener("change", handleRegionQuickSelectChange);
  document.addEventListener("pointerdown", primeSearchChirpAudio, { capture: true, passive: true });
  document.addEventListener("keydown", primeSearchChirpAudio, { capture: true });
  document.addEventListener("touchstart", primeSearchChirpAudio, { capture: true, passive: true });
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!refineSearchModal.hidden) {
      syncRefineTermsToPrimary();
    }
    currentProfile = applySearchEasterEggs(readProfileFromForm(), { syncForm: true, playSound: true });
    renderRefineSummary();
    closeRefineSearchModal({ restoreFocus: false });
    runSearch();
  });
  termsInput.addEventListener("input", handlePrimaryTermsInput);
  termsInput.addEventListener("keydown", handleQuickSearchKeydown);
  mobileSearchInput?.addEventListener("input", handleMobileSearchInput);
  mobileSearchForm?.addEventListener("submit", handleMobileSearchSubmit);
  refineTermsInput.addEventListener("input", syncRefineTermsToPrimary);
  window.addEventListener("resize", autoSizeRefineTermsInput);
  excludeTagField?.addEventListener("click", handleExcludeTagFieldClick);
  excludeTagInput?.addEventListener("keydown", handleExcludeTagInputKeydown);
  excludeTagInput?.addEventListener("input", handleExcludeTagInput);
  excludeTagInput?.addEventListener("paste", handleExcludeTagInputPaste);
  excludeTagInput?.addEventListener("blur", commitExcludeTagInput);
  excludeTagList?.addEventListener("click", handleExcludeTagRemoveClick);
  quickSearchExtraTermsButton?.addEventListener("click", openRefineSearchModal);
  quickSearchClearButton?.addEventListener("click", clearQuickSearchTerms);
  quickSearchSuggestions?.addEventListener("click", handleQuickSearchSuggestionClick);
  termDropdown.addEventListener("click", handleTermDropdownClick);
  document.addEventListener("pointerover", handleSelectInteractionStart, { capture: true, passive: true });
  document.addEventListener("mouseover", handleSelectInteractionStart, { capture: true, passive: true });
  document.addEventListener("pointerdown", handleSelectInteractionStart, { capture: true, passive: true });
  document.addEventListener("pointerout", handleSelectInteractionEnd, { capture: true, passive: true });
  document.addEventListener("mouseout", handleSelectInteractionEnd, { capture: true, passive: true });
  document.addEventListener("focusin", handleSelectInteractionStart);
  document.addEventListener("focusout", handleSelectInteractionEnd);
  document.addEventListener("change", handleSelectInteractionCommit, { capture: true });
  resultGrid.addEventListener("click", handleResultGridAction);
  resultGrid.addEventListener("input", handleResultGridAction);
  resultGrid.addEventListener("change", handleResultGridAction);
  document.addEventListener("click", closeListingActionMenus);

  document.querySelector("#openRefineSearch").addEventListener("click", openRefineSearchModal);
  document.querySelector("#openResultRefineSearch")?.addEventListener("click", openRefineSearchModal);
  document.querySelector("#closeRefineSearch").addEventListener("click", closeRefineSearchModal);
  document.querySelector("#cancelRefineSearch").addEventListener("click", closeRefineSearchModal);
  saveRefineSearchButton?.addEventListener("click", saveSearchFromRefineModal);
  refineSearchModal.addEventListener("click", (event) => {
    if (event.target === refineSearchModal) closeRefineSearchModal();
  });
  refineSearchModal.addEventListener("input", handleRefineSearchModalEdit);
  refineSearchModal.addEventListener("change", handleRefineSearchModalEdit);

  openSavedSearchesButton.addEventListener("click", toggleSavedSearchPopover);
  document.addEventListener("click", handleSavedPopoverOutsideClick);
  quickSaveSearchButton?.addEventListener("click", saveCurrentSearchQuick);
  document.querySelector("#openSaveSearch").addEventListener("click", openSaveSearchModal);
  document.querySelector("#saveProfile").addEventListener("click", openSaveSearchModal);
  closeSaveConfirmationToastButton?.addEventListener("click", hideSaveConfirmationToast);
  viewSavedSearchToastButton?.addEventListener("click", viewSavedSearchFromToast);
  document.querySelector("#closeSaveSearch").addEventListener("click", closeSaveSearchModal);
  document.querySelector("#cancelSaveSearch").addEventListener("click", closeSaveSearchModal);
  saveSearchModal.addEventListener("click", (event) => {
    if (event.target === saveSearchModal) closeSaveSearchModal();
  });
  saveSearchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveCurrentSearchFromModal();
  });
  document.querySelector("#closeSavedRegionChoice")?.addEventListener("click", closeSavedRegionChoiceModal);
  savedRegionChoiceModal?.addEventListener("click", (event) => {
    if (event.target === savedRegionChoiceModal) closeSavedRegionChoiceModal();
  });
  runSavedHomeRegionButton?.addEventListener("click", () => {
    if (!pendingSavedRegionProfile) return;
    activateSavedSearch(pendingSavedRegionProfile, {
      regionId: getProfileHomeRegionId(pendingSavedRegionProfile),
    });
  });
  runSavedCurrentRegionButton?.addEventListener("click", () => {
    if (!pendingSavedRegionProfile) return;
    activateSavedSearch(pendingSavedRegionProfile, {
      regionId: appSettings.regionId,
    });
  });
  duplicateSavedCurrentRegionButton?.addEventListener("click", () => {
    if (!pendingSavedRegionProfile) return;
    activateSavedSearch(pendingSavedRegionProfile, {
      regionId: appSettings.regionId,
      duplicate: true,
    });
  });

  document.querySelector("#openSettings").addEventListener("click", openSettingsModal);
  document.querySelector("#closeSettings").addEventListener("click", closeSettingsModal);
  document.querySelector("#cancelSettings").addEventListener("click", closeSettingsModal);
  settingsModal.addEventListener("click", (event) => {
    if (event.target === settingsModal) closeSettingsModal();
  });
  settingsForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSettingsFromModal();
  });
  settingsTabs.forEach((tab) => {
    tab.addEventListener("click", () => setActiveSettingsTab(tab.dataset.settingsTab));
    tab.addEventListener("keydown", handleSettingsTabKeydown);
  });
  pullCloudSavedSearchesButton.addEventListener("click", pullCloudSavedSearches);
  pushCloudSavedSearchesButton.addEventListener("click", pushCloudSavedSearches);
  themeSettingsToggle?.addEventListener("change", handleSettingsThemeToggle);
  bindBrandGradientControlEvents();
  applyBrandGradientButton?.addEventListener("click", applyBrandGradientFromControls);
  resetBrandGradientButton?.addEventListener("click", resetBrandGradient);
  sendSignInLinkButton?.addEventListener("click", handleAccountSignInShell);
  syncAccountSavedSearchesButton?.addEventListener("click", syncAccountCloudData);
  signOutAccountButton?.addEventListener("click", handleAccountSignOutShell);
  exportSavedSearchesButton.addEventListener("click", exportSavedSearches);
  importSavedSearchesButton.addEventListener("click", () => savedSearchImportFile.click());
  savedSearchImportFile.addEventListener("change", importSavedSearchesFromFile);
  gearModeSettingsToggle?.addEventListener("change", handleSettingsGearModeToggle);
  openSourceQualitySettingsButton?.addEventListener("click", openSearchQualitySettings);

  topWatchingFilter.addEventListener("click", openWatchlistView);
  mobileBottomNav?.addEventListener("click", handleMobileBottomNavClick);
  savedWatchingFilter?.addEventListener("click", () => {
    toggleWatchingFilter();
    closeSavedSearchPopover();
  });

  document.querySelector("#markAllSeen").addEventListener("click", () => {
    acknowledgeListings(currentResults);
    renderResults();
  });

  document.querySelector("#copyDigest").addEventListener("click", async () => {
    const digest = createEmailDigest(currentProfile, getCurrentAlertListings());
    await copyText(digest);
  });

  document.querySelector("#urgencyFilter").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.filter === "watching") {
      openWatchlistView();
      return;
    }
    filterMode = button.dataset.filter;
    if (getCurrentAppView() === APP_VIEW_WATCHLIST) setAppView(null);
    resetPagination();
    syncFilterModeButtons();
    renderResults();
  });

  sourceFilterList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    selectInteractionActive = false;
    flushDeferredSearchApplyNow();
    if (button.dataset.source === "all") {
      if (activeViewSources.size > 0) {
        activeViewSources.clear();
      } else {
        isSourceRowExpanded = !isSourceRowExpanded;
      }
      resetPagination();
      renderResults({ force: true });
      return;
    }
    const sourceId = button.dataset.source || "";
    if (isManualSourceStatus(sourceId)) {
      openManualSourceSearch(sourceId);
      return;
    }
    if (isNonFilterableSourceStatus(sourceId)) {
      activeViewSources.delete(sourceId);
      resetPagination();
      renderResults({ force: true });
      return;
    }
    toggleViewSource(sourceId);
    resetPagination();
    renderResults({ force: true });
  });

  sourceAssistList?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    openManualSourceSearch(button.dataset.source || "");
  });

  qualityModeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.quality === "clean") {
        setQualityMode(qualityFilter === "clean" ? "all" : "clean");
        return;
      }
      setQualityMode(button.dataset.quality);
    });
  });

  sortModeSelect.addEventListener("change", () => {
    sortMode = sortModeSelect.value;
    resetPagination();
    renderResults({ force: true });
  });

  resultViewButtons.forEach((button) => {
    button.addEventListener("click", () => setResultView(button.dataset.resultView));
  });

  paginationControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page-action]");
    if (!button || button.disabled) return;
    changePage(button.dataset.pageAction);
  });

  themeToggle?.addEventListener("click", toggleTheme, { capture: true });

  backToTopButton.addEventListener("click", scrollPageTop);
  window.addEventListener("scroll", requestBackToTopVisibilityUpdate, { passive: true });
  window.addEventListener("scroll", requestMobileSearchOverlayUpdate, { passive: true });
  window.addEventListener("scroll", refreshSavedSearchPopoverPosition, { passive: true });
  window.addEventListener("resize", requestMobileSearchOverlayUpdate);
  window.addEventListener("resize", refreshSavedSearchPopoverPosition);
  window.addEventListener("popstate", handleAppViewPopState);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeRegionPopover();
    closeSavedSearchPopover();
    if (!refineSearchModal.hidden) closeRefineSearchModal();
    if (!saveSearchModal.hidden) closeSaveSearchModal();
    if (!settingsModal.hidden) closeSettingsModal();
  });

  eventsBound = true;
  window.__brrtzAppReady = true;
}

function isSelectInteractionEvent(event) {
  if (!(event?.target instanceof Element)) return false;
  return Boolean(event.target.closest([
    "select",
    "#regionSelector",
    "#brandHomeLink",
    "#sourceFilterList",
    ".source-filter-button",
  ].join(",")));
}

function handleSelectInteractionStart(event) {
  if (!isSelectInteractionEvent(event)) return;
  lastSelectInteractionAt = Date.now();
  if (selectInteractionReleaseTimer) {
    window.clearTimeout(selectInteractionReleaseTimer);
    selectInteractionReleaseTimer = 0;
  }
  selectInteractionActive = true;
}

function handleSelectInteractionEnd(event) {
  if (!isSelectInteractionEvent(event)) return;
  lastSelectInteractionAt = Date.now();
  scheduleSelectInteractionRelease();
}

function handleSelectInteractionCommit(event) {
  if (!isSelectInteractionEvent(event)) return;
  lastSelectInteractionAt = Date.now();
  scheduleSelectInteractionRelease(220);
}

function scheduleSelectInteractionRelease(delay = 80) {
  if (selectInteractionReleaseTimer) window.clearTimeout(selectInteractionReleaseTimer);
  selectInteractionReleaseTimer = window.setTimeout(() => {
    selectInteractionReleaseTimer = 0;
    selectInteractionActive = false;
    flushDeferredResultsRender();
  }, delay);
}

function flushDeferredResultsRender() {
  if (deferredSearchApply) {
    flushDeferredSearchApplyNow();
    return;
  }
  if (!deferredResultsRender) return;
  deferredResultsRender = false;
  renderResults({ force: true });
}

function flushDeferredSearchApplyNow() {
  if (!deferredSearchApply) return;
  if (searchResultApplyTimer) {
    window.clearTimeout(searchResultApplyTimer);
    searchResultApplyTimer = 0;
  }
  const pendingApply = deferredSearchApply;
  deferredSearchApply = null;
  deferredResultsRender = false;
  applySearchResult(pendingApply.profile, pendingApply.liveResult, pendingApply.isFinal);
}

function clearScheduledSearchResultApply() {
  if (searchResultApplyTimer) {
    window.clearTimeout(searchResultApplyTimer);
    searchResultApplyTimer = 0;
  }
  deferredSearchApply = null;
}

function resetHomeView(event) {
  event?.preventDefault?.();
  selectInteractionActive = false;
  clearScheduledSearchResultApply();
  deferredResultsRender = false;
  activeBrowseBrandSlug = "";
  setAppView(null);
  isBrowseExpanded = false;
  searchRunId += 1;
  currentProfile = createFreshProfile();
  fillForm(currentProfile);
  activeViewSources.clear();
  filterMode = "all";
  syncFilterModeButtons();
  currentResults = [];
  currentDiscoveryIds = new Set();
  currentNewForSearchIds = new Set();
  closeSavedSearchPopover();
  closeRefineSearchModal({ restoreFocus: false });
  closeSaveSearchModal({ restoreFocus: false });
  closeSettingsModal({ restoreFocus: false });
  resetToIdleSearch();
  scrollPageTop();
}

function getCurrentAppView() {
  const params = new URLSearchParams(window.location.search);
  return params.get(APP_VIEW_PARAM) || "";
}

function getCurrentBrowseBrandSlug() {
  if (getCurrentAppView() !== APP_VIEW_SYNTH_BROWSER) return "";
  const params = new URLSearchParams(window.location.search);
  return sanitizePopularBrandSlug(params.get(APP_BRAND_PARAM));
}

function setAppView(view, options = {}) {
  const url = new URL(window.location.href);
  if (view) {
    url.searchParams.set(APP_VIEW_PARAM, view);
    if (view !== APP_VIEW_SYNTH_BROWSER) url.searchParams.delete(APP_BRAND_PARAM);
  } else {
    url.searchParams.delete(APP_VIEW_PARAM);
    url.searchParams.delete(APP_BRAND_PARAM);
  }
  if (view && Object.prototype.hasOwnProperty.call(options, "brandSlug")) {
    const brandSlug = sanitizePopularBrandSlug(options.brandSlug);
    if (brandSlug) {
      url.searchParams.set(APP_BRAND_PARAM, brandSlug);
    } else {
      url.searchParams.delete(APP_BRAND_PARAM);
    }
  }
  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  if (nextUrl === `${window.location.pathname}${window.location.search}${window.location.hash}`) return;
  const method = options.replace ? "replaceState" : "pushState";
  window.history[method]({ view: view || "" }, "", nextUrl);
}

function handleAppViewPopState() {
  const nextView = getCurrentAppView();
  isBrowseExpanded = nextView === APP_VIEW_SYNTH_BROWSER;
  activeBrowseBrandSlug = nextView === APP_VIEW_SYNTH_BROWSER ? getCurrentBrowseBrandSlug() : "";
  if (nextView === APP_VIEW_WATCHLIST) {
    filterMode = "watching";
  } else if (filterMode === "watching") {
    filterMode = "all";
  }
  syncFilterModeButtons();
  resetPagination();
  renderResults();
  scrollResultsTop();
}

function toggleTheme(event) {
  event?.preventDefault?.();
  event?.stopPropagation?.();
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  pushCloudProfilePreferences({ silent: true });
}

function handleSettingsThemeToggle(event) {
  setTheme(event.target.checked ? "dark" : "light");
  pushCloudProfilePreferences({ silent: true });
}

function handleSettingsGearModeToggle(event) {
  setQualityMode(event.target.checked ? "clean" : "all");
}

function bindBrandGradientControlEvents() {
  Object.entries(brandGradientStopControls).forEach(([stop, controls]) => {
    controls.hex?.addEventListener("input", () => handleBrandGradientHexInput(stop));
    controls.hex?.addEventListener("change", () => normalizeBrandGradientHexInput(stop));
    controls.color?.addEventListener("input", () => handleBrandGradientColorInput(stop));
    Object.values(controls.rgb || {}).forEach((input) => {
      input?.addEventListener("input", () => handleBrandGradientRgbInput(stop));
      input?.addEventListener("change", () => normalizeBrandGradientRgbInput(stop));
    });
  });
}

function handleBrandGradientHexInput(stop) {
  const hex = normalizeFullHexColor(brandGradientStopControls[stop]?.hex?.value);
  if (!hex) return;
  syncBrandGradientStopControls(stop, hex, { skipHex: true });
  previewBrandGradientWithStop(stop, hex);
}

function normalizeBrandGradientHexInput(stop) {
  const hex = normalizeHexColor(brandGradientStopControls[stop]?.hex?.value);
  if (!hex) return;
  syncBrandGradientStopControls(stop, hex);
  previewBrandGradientWithStop(stop, hex);
}

function handleBrandGradientColorInput(stop) {
  const hex = normalizeHexColor(brandGradientStopControls[stop]?.color?.value);
  if (!hex) return;
  syncBrandGradientStopControls(stop, hex, { skipColor: true });
  previewBrandGradientFromControls();
}

function handleBrandGradientRgbInput(stop) {
  const hex = readBrandGradientStopFromRgbControls(stop);
  if (!hex) return;
  syncBrandGradientStopControls(stop, hex, { skipRgb: true });
  previewBrandGradientFromControls();
}

function normalizeBrandGradientRgbInput(stop) {
  const hex = readBrandGradientStopFromRgbControls(stop, { clamp: true });
  if (!hex) return;
  syncBrandGradientStopControls(stop, hex);
  previewBrandGradientFromControls();
}

function previewBrandGradientWithStop(stop, hex) {
  const gradient = normalizeBrandGradient({
    start: stop === "start" ? hex : readBrandGradientStopFromControls("start"),
    end: stop === "end" ? hex : readBrandGradientStopFromControls("end"),
  });
  if (!gradient) return;
  applyBrandGradient(gradient);
}

function readBrandGradientFromUrlParams(params) {
  const packed = params.get("gradient") || params.get("brandGradient") || "";
  if (packed) {
    const [start, end] = packed.split(/[,|:]/).map((value) => value.trim());
    const gradient = normalizeBrandGradient({ start, end });
    if (gradient) return gradient;
  }

  return normalizeBrandGradient({
    start: params.get("gradientStart") || params.get("brandStart"),
    end: params.get("gradientEnd") || params.get("brandEnd"),
  });
}

function readBrandGradientFromControls() {
  return normalizeBrandGradient({
    start: readBrandGradientStopFromControls("start"),
    end: readBrandGradientStopFromControls("end"),
  });
}

function readBrandGradientStopFromControls(stop) {
  const controls = brandGradientStopControls[stop] || {};
  return normalizeHexColor(controls.hex?.value)
    || normalizeHexColor(controls.color?.value)
    || readBrandGradientStopFromRgbControls(stop);
}

function readBrandGradientStopFromRgbControls(stop, options = {}) {
  const controls = brandGradientStopControls[stop]?.rgb;
  if (!controls) return "";

  const rgb = {};
  for (const channel of ["r", "g", "b"]) {
    const input = controls[channel];
    const value = Number(input?.value);
    if (!Number.isFinite(value)) return "";
    if (!options.clamp && (value < 0 || value > 255)) return "";
    const normalized = clampRgbChannel(value);
    rgb[channel] = normalized;
    if (options.clamp && input && String(normalized) !== input.value) input.value = normalized;
  }

  return rgbToHex(rgb);
}

function normalizeBrandGradient(gradient) {
  const start = normalizeHexColor(gradient?.start);
  const end = normalizeHexColor(gradient?.end);
  return start && end ? { start, end } : null;
}

function normalizeHexColor(value) {
  const text = String(value || "").trim().replace(/^#?/, "#").toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(text)) return text;
  if (/^#[0-9a-f]{3}$/.test(text)) {
    return `#${text.slice(1).split("").map((char) => char + char).join("")}`;
  }
  return "";
}

function normalizeFullHexColor(value) {
  const text = String(value || "").trim().replace(/^#?/, "#").toLowerCase();
  return /^#[0-9a-f]{6}$/.test(text) ? text : "";
}

function hexToRgb(hex) {
  const normalized = normalizeHexColor(hex);
  if (!normalized) return null;
  return {
    r: parseInt(normalized.slice(1, 3), 16),
    g: parseInt(normalized.slice(3, 5), 16),
    b: parseInt(normalized.slice(5, 7), 16),
  };
}

function rgbToHex(rgb) {
  const channels = ["r", "g", "b"].map((channel) => {
    const value = clampRgbChannel(rgb?.[channel]);
    return value.toString(16).padStart(2, "0");
  });
  return `#${channels.join("")}`;
}

function clampRgbChannel(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.min(255, Math.max(0, Math.round(number)));
}

function createBrandGradientValue(gradient) {
  const normalized = normalizeBrandGradient(gradient) || DEFAULT_BRAND_GRADIENT;
  return `linear-gradient(110deg, ${normalized.start} 0%, ${normalized.end} 100%)`;
}

function applyBrandGradient(gradient = appSettings.brandGradient, options = {}) {
  const normalized = normalizeBrandGradient(gradient) || { ...DEFAULT_BRAND_GRADIENT };
  document.documentElement.style.setProperty("--brand-gradient-start", normalized.start);
  document.documentElement.style.setProperty("--brand-gradient-end", normalized.end);
  document.documentElement.style.setProperty("--select-brand-chevron", createSelectBrandChevronValue(normalized.start));
  appSettings = {
    ...appSettings,
    brandGradient: normalized,
  };
  updateBrandGradientControls(normalized);
  if (options.persist) {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  }
}

function updateBrandGradientControls(gradient = appSettings.brandGradient) {
  const normalized = normalizeBrandGradient(gradient) || { ...DEFAULT_BRAND_GRADIENT };
  syncBrandGradientStopControls("start", normalized.start);
  syncBrandGradientStopControls("end", normalized.end);
  if (brandGradientPreview) brandGradientPreview.style.background = createBrandGradientValue(normalized);
}

function createSelectBrandChevronValue(color) {
  const normalized = normalizeHexColor(color) || DEFAULT_BRAND_GRADIENT.start;
  const encodedColor = encodeURIComponent(normalized);
  return `url("data:image/svg+xml,%3Csvg width='18' height='18' viewBox='0 0 18 18' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.5 7L9 11.5L13.5 7' stroke='${encodedColor}' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`;
}

function syncBrandGradientStopControls(stop, hex, options = {}) {
  const controls = brandGradientStopControls[stop];
  const normalized = normalizeHexColor(hex);
  const rgb = hexToRgb(normalized);
  if (!controls || !normalized || !rgb) return;

  if (!options.skipHex && controls.hex && controls.hex.value !== normalized) controls.hex.value = normalized;
  if (!options.skipColor && controls.color && controls.color.value !== normalized) controls.color.value = normalized;
  if (!options.skipRgb) {
    Object.entries(rgb).forEach(([channel, value]) => {
      const input = controls.rgb?.[channel];
      if (input && input.value !== String(value)) input.value = value;
    });
  }
}

function previewBrandGradientFromControls() {
  const gradient = readBrandGradientFromControls();
  if (!gradient) return;
  applyBrandGradient(gradient);
}

function applyBrandGradientFromControls() {
  const gradient = readBrandGradientFromControls();
  if (!gradient) {
    showStatusToast({
      icon: "!",
      message: "Enter two hex colors",
    });
    updateBrandGradientControls(appSettings.brandGradient);
    return;
  }

  applyBrandGradient(gradient, { persist: true });
  showStatusToast({
    icon: "✓",
    message: "Gradient applied",
  });
}

function resetBrandGradient() {
  applyBrandGradient(DEFAULT_BRAND_GRADIENT, { persist: true });
  showStatusToast({
    icon: "✓",
    message: "Gradient reset",
  });
}

function getAvailableRegions() {
  const regions = Array.isArray(REGION_CONFIG?.regions) ? REGION_CONFIG.regions : [ACTIVE_REGION];
  return regions.filter((region) => region?.id);
}

function getSelectableRegions() {
  return getAvailableRegions().filter((region) => region.status !== "future");
}

function sanitizeRegionId(regionId) {
  const availableRegions = getSelectableRegions();
  return availableRegions.some((region) => region.id === regionId)
    ? regionId
    : (defaultSettings.regionId || ACTIVE_REGION.id || "japan");
}

function getRegionById(regionId) {
  return getAvailableRegions().find((region) => region.id === sanitizeRegionId(regionId)) || ACTIVE_REGION;
}

function getActiveRegion() {
  return getRegionById(appSettings?.regionId || defaultSettings.regionId);
}

function updateRegionBadge(regionOverride = null) {
  const region = regionOverride || getActiveRegion();
  if (!regionOverride) renderRegionQuickSelectOptions(region.id);
}

function renderRegionQuickSelectOptions(activeRegionId = getActiveRegion().id) {
  if (!regionQuickSelect) return;
  const optionsMarkup = getSelectableRegions().map((region) => {
    const statusLabel = getRegionStatusLabel(region);
    const label = statusLabel ? `${region.label} (${statusLabel})` : region.label;
    return `<option value="${escapeHtml(region.id)}">${escapeHtml(label)}</option>`;
  }).join("");
  if (regionQuickSelect.innerHTML !== optionsMarkup) {
    regionQuickSelect.innerHTML = optionsMarkup;
  }
  regionQuickSelect.value = sanitizeRegionId(activeRegionId);
  const activeRegion = getRegionById(regionQuickSelect.value);
  regionQuickSelect.title = `Search region: ${activeRegion.label}`;
}

function handleRegionQuickSelectChange(event) {
  const nextRegionId = sanitizeRegionId(event.target.value);
  if (nextRegionId === appSettings.regionId) {
    renderRegionQuickSelectOptions(nextRegionId);
    return;
  }
  const profileBeforeSwitch = readProfileFromForm();
  const shouldRunSearchAfterSwitch = profileBeforeSwitch.terms.length > 0;
  selectInteractionActive = false;
  applyActiveRegion(nextRegionId);
  currentProfile = shouldRunSearchAfterSwitch
    ? createProfileForRegion(profileBeforeSwitch, nextRegionId)
    : createFreshProfile();
  fillForm(currentProfile);
  if (shouldRunSearchAfterSwitch) {
    runSearch();
  } else {
    resetToIdleSearch();
  }
}

function getRegionStatusLabel(region) {
  if (region.status === "beta") return "Beta";
  if (region.status === "future") return "Soon";
  return "";
}

function scheduleAfterNextPaint(callback) {
  if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => callback());
    });
    return;
  }
  const timer = typeof window !== "undefined" ? window.setTimeout : setTimeout;
  timer(callback, 0);
}

function isUiInteractionBusy() {
  return selectInteractionActive || Date.now() - lastSelectInteractionAt < 350;
}

function scheduleUiIdleTask(callback, options = {}) {
  const delay = options.delay ?? 500;
  const retryDelay = options.retryDelay ?? 350;
  const timeout = options.timeout ?? 8000;
  const scheduleTimer = typeof window !== "undefined" ? window.setTimeout : setTimeout;

  const scheduleAttempt = (nextDelay = delay) => {
    scheduleTimer(() => {
      if (isUiInteractionBusy()) {
        scheduleAttempt(retryDelay);
        return;
      }

      const run = () => {
        if (isUiInteractionBusy()) {
          scheduleAttempt(retryDelay);
          return;
        }
        callback();
      };

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        window.requestIdleCallback(run, { timeout });
        return;
      }

      scheduleTimer(run, 0);
    }, nextDelay);
  };

  scheduleAttempt(delay);
}

function handleRegionPopoverOutsideClick(event) {
  if (regionPopover?.hidden) return;
  if (regionSelector?.contains(event.target)) return;
  closeRegionPopover();
}

function getRegionSourceIds(regionId = appSettings?.regionId) {
  return hydrateRegionSources(getRegionById(regionId).sources);
}

function getVisibleSources(regionId = appSettings?.regionId) {
  const sourceIds = new Set(getRegionSourceIds(regionId));
  return SOURCES.filter((source) => sourceIds.has(source.id));
}

function getRegionDefaultMaxPrice(regionId = appSettings?.regionId) {
  return Number(getRegionById(regionId).searchDefaults?.maxPrice) || 2000000;
}

function renderRegionOptions() {
  if (!regionSelect) return;
  regionSelect.innerHTML = getSelectableRegions().map((region) => {
    const statusLabel = region.status === "beta" ? " Beta" : "";
    return `<option value="${region.id}">${region.label}${statusLabel}</option>`;
  }).join("");
}

function renderSources() {
  sourceList.innerHTML = getVisibleSources().map((source) => `
    <label class="source-toggle">
      <input type="checkbox" name="sources" value="${source.id}" form="searchForm" checked />
      <span>${source.label}</span>
    </label>
  `).join("");
}

function getRegionDefaultCategoryIntent(regionId = appSettings?.regionId || ACTIVE_REGION.id) {
  const regionDefault = getRegionById(regionId)?.searchDefaults?.categoryIntent
    || ACTIVE_REGION.searchDefaults?.categoryIntent
    || DEFAULT_CATEGORY_INTENT;

  return CATEGORY_INTENT_IDS.has(regionDefault) ? regionDefault : DEFAULT_CATEGORY_INTENT;
}

function sanitizeCategoryIntent(categoryIntent, regionId = appSettings?.regionId || ACTIVE_REGION.id) {
  const normalizedCategoryIntent = String(categoryIntent || "").trim();
  return CATEGORY_INTENT_IDS.has(normalizedCategoryIntent)
    ? normalizedCategoryIntent
    : getRegionDefaultCategoryIntent(regionId);
}

function getCategoryIntentLabel(categoryIntent) {
  return CATEGORY_INTENTS.find((intent) => intent.id === categoryIntent)?.label || "Synthesizers";
}

function sanitizePopularBrandSlug(slug) {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  return POPULAR_BRANDS.some((brand) => brand.slug === normalizedSlug) ? normalizedSlug : "";
}

function getPopularBrandBySlug(slug) {
  const normalizedSlug = sanitizePopularBrandSlug(slug);
  return POPULAR_BRANDS.find((brand) => brand.slug === normalizedSlug) || null;
}

function getActiveBrowseBrand() {
  return getPopularBrandBySlug(activeBrowseBrandSlug);
}

function getPopularBrandInitials(brand) {
  return brand.name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getPopularBrandSearchTerms(brand) {
  if (!brand) return [];
  const terms = Array.isArray(brand.searchTerms) ? brand.searchTerms : [brand.searchTerm];
  return terms
    .map((term) => String(term || "").trim())
    .filter(Boolean);
}

function getPopularBrandRecipe(brand) {
  if (!brand) return null;
  const customRecipe = BRAND_RECIPES[brand.slug];
  if (customRecipe) {
    return {
      source: customRecipe.source || `brand-search:${brand.slug}`,
      maxPrice: Number(customRecipe.maxPrice || 0),
      searchTerms: uniqueTerms([
        ...getPopularBrandSearchTerms(brand),
        ...(customRecipe.searchTerms || []),
      ]),
      sourceTerms: uniqueTerms(customRecipe.sourceTerms || getPopularBrandSearchTerms(brand)),
      termLimit: Number(customRecipe.termLimit || 0),
      excludes: getSafeBrandRecipeExcludes(brand, customRecipe.excludes || []),
      noiseTerms: [...(customRecipe.noiseTerms || [])],
      sources: [...(customRecipe.sources || BRAND_RECIPE_TEMPLATE.sources)],
    };
  }

  return {
    source: BRAND_RECIPE_TEMPLATE.source,
    maxPrice: BRAND_RECIPE_TEMPLATE.maxPrice,
    searchTerms: getPopularBrandSearchTerms(brand),
    sourceTerms: getPopularBrandSearchTerms(brand),
    termLimit: 0,
    excludes: getSafeBrandRecipeExcludes(brand),
    noiseTerms: [...BRAND_RECIPE_TEMPLATE.noiseTerms],
    sources: [...BRAND_RECIPE_TEMPLATE.sources],
  };
}

function getSafeBrandRecipeExcludes(brand, excludes = BRAND_RECIPE_TEMPLATE.excludes) {
  const brandTermSet = new Set(getPopularBrandSearchTerms(brand).map((term) => normalizeText(parseMatchTerm(term).value)));
  return excludes.filter((exclude) => {
    const normalizedExclude = normalizeText(parseMatchTerm(exclude).value);
    return normalizedExclude && !brandTermSet.has(normalizedExclude);
  });
}

function createBrandRecipeRequestExcludes(brand) {
  const recipe = getPopularBrandRecipe(brand);
  if (!recipe) return STARTER_FRESH_FIND_EXCLUDES;
  return uniqueTerms([
    ...STARTER_FRESH_FIND_EXCLUDES,
    ...recipe.excludes,
    ...(qualityFilter === "clean" ? recipe.noiseTerms : []),
  ]);
}

function createBrandBrowseHref(slug) {
  const url = new URL(window.location.href);
  url.searchParams.set(APP_VIEW_PARAM, APP_VIEW_SYNTH_BROWSER);
  url.searchParams.set(APP_BRAND_PARAM, sanitizePopularBrandSlug(slug));
  return `${url.pathname}${url.search}${url.hash}`;
}

function resetBrowseCategoryForBrandView(brandSlug) {
  const nextBrandSlug = sanitizePopularBrandSlug(brandSlug || activeBrowseBrandSlug);
  if (
    browseCategoryIntent === DEFAULT_BROWSE_CATEGORY_INTENT
    && browseCategoryStatus !== "error"
    && browseCategoryBrandSlug === nextBrandSlug
  ) return;

  cancelBrowseCategoryLoad();
  browseCategoryIntent = DEFAULT_BROWSE_CATEGORY_INTENT;
  browseCategoryListings = [];
  clearBrowsePreparedListingsCache();
  browseCategoryStatus = "idle";
  browseCategoryError = "";
  browseCategoryBrandSlug = nextBrandSlug;
}

function resetBrowseCategoryBrandView() {
  if (!browseCategoryBrandSlug) return;
  cancelBrowseCategoryLoad();
  browseCategoryListings = [];
  clearBrowsePreparedListingsCache();
  browseCategoryStatus = "idle";
  browseCategoryError = "";
  browseCategoryBrandSlug = "";
}

function syncBrowseCategoryBrandView() {
  const nextBrandSlug = activeBrowseBrandSlug ? sanitizePopularBrandSlug(activeBrowseBrandSlug) : "";
  if (browseCategoryBrandSlug === nextBrandSlug) return;
  cancelBrowseCategoryLoad();
  browseCategoryListings = [];
  clearBrowsePreparedListingsCache();
  browseCategoryStatus = "idle";
  browseCategoryError = "";
  browseCategoryBrandSlug = nextBrandSlug;
}

function openBrandBrowseView(slug, options = {}) {
  const brand = getPopularBrandBySlug(slug);
  if (!brand) return;
  activeBrowseBrandSlug = brand.slug;
  if (options.resetCategory || options.defaultGallery !== false) browseBrandResultView = "gallery";
  resetBrowseCategoryForBrandView(brand.slug);
  isBrowseExpanded = true;
  resetPagination();
  setAppView(APP_VIEW_SYNTH_BROWSER, { brandSlug: brand.slug, replace: Boolean(options.replace) });
  renderResults();
  scrollResultsTop();
}

function matchesPopularBrandListing(listing, brand) {
  if (!brand) return true;
  const searchable = normalizeText([
    listing.title,
    listing.condition,
    listing.shop,
    listing.description,
  ].filter(Boolean).join(" "));
  return getPopularBrandSearchTerms(brand).some((term) => termMatches(searchable, term));
}

function getBrandFilteredBrowseListings(listings) {
  const brand = getActiveBrowseBrand();
  if (!brand) return listings;
  return listings.filter((listing) => matchesPopularBrandListing(listing, brand));
}

function fillForm(profile) {
  const hydratedProfile = hydrateProfile(profile);
  refineTermsInput.value = hydratedProfile.terms.join("\n");
  autoSizeRefineTermsInput();
  renderPrimarySearchTerm();
  if (categoryIntentSelect) categoryIntentSelect.value = hydratedProfile.categoryIntent;
  excludesInput.value = hydratedProfile.excludes.join("\n");
  renderExcludeTags();
  document.querySelector("#noiseTerms").value = hydratedProfile.noiseTerms.join("\n");
  document.querySelector("#maxPrice").value = hydratedProfile.maxPrice;
  document.querySelector("#alertMode").value = hydratedProfile.alertMode;
  document.querySelectorAll("input[name='sources']").forEach((input) => {
    input.checked = hydratedProfile.sources.includes(input.value);
  });
  renderRefineSummary();
  updateQuickSaveSearchButton();
}

function readProfileFromForm() {
  const terms = getSearchTermsFromForm();

  return {
    name: getFormProfileName(terms),
    regionId: appSettings.regionId,
    terms,
    excludes: getExcludeTags(),
    noiseTerms: splitLines(document.querySelector("#noiseTerms").value),
    categoryIntent: sanitizeCategoryIntent(categoryIntentSelect?.value, appSettings.regionId),
    maxPrice: Number(document.querySelector("#maxPrice").value || 0),
    alertMode: document.querySelector("#alertMode").value,
    sources: [...document.querySelectorAll("input[name='sources']:checked")].map((input) => input.value),
  };
}

function applySearchEasterEggs(profile, options = {}) {
  if (!profile.terms.some(isR2D2SearchTerm)) return profile;

  const nextProfile = {
    ...profile,
    name: R2D2_SEARCH_TARGET,
    terms: [R2D2_SEARCH_TARGET],
  };

  if (options.syncForm) {
    refineTermsInput.value = nextProfile.terms.join("\n");
    autoSizeRefineTermsInput();
    renderPrimarySearchTerm();
  }

  if (options.playSound) {
    playSearchRobotChirp();
  }

  return nextProfile;
}

function isR2D2SearchTerm(term) {
  const compactTerm = normalizeText(term || "").replace(/[^a-z0-9]/g, "");
  return compactTerm === "r2d2" || compactTerm === "r2d2sound" || compactTerm === "r2d2sounds";
}

function getSearchChirpAudioContext() {
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) return null;

  if (!searchChirpAudioCtx || searchChirpAudioCtx.state === "closed") {
    try {
      searchChirpAudioCtx = new AudioContextConstructor();
    } catch (error) {
      searchChirpAudioCtx = null;
    }
  }

  return searchChirpAudioCtx;
}

function primeSearchChirpAudio() {
  const chirpAudioCtx = getSearchChirpAudioContext();
  if (!chirpAudioCtx || chirpAudioCtx.state !== "suspended") return;
  chirpAudioCtx.resume().catch(() => {});
}

function playSearchRobotChirp() {
  const chirpAudioCtx = getSearchChirpAudioContext();
  if (!chirpAudioCtx) return;

  const scheduleChirp = () => {
    const startTime = chirpAudioCtx.currentTime + 0.02;
    const masterGain = chirpAudioCtx.createGain();
    const chirpFilter = chirpAudioCtx.createBiquadFilter();
    const chirpNotes = [
      { at: 0, frequency: 1040, duration: 0.12 },
      { at: 0.16, frequency: 1680, duration: 0.1 },
      { at: 0.29, frequency: 740, duration: 0.13 },
      { at: 0.46, frequency: 1860, duration: 0.11 },
      { at: 0.61, frequency: 1280, duration: 0.12 },
      { at: 0.78, frequency: 920, duration: 0.15 },
      { at: 1, frequency: 1540, duration: 0.12 },
      { at: 1.18, frequency: 680, duration: 0.13 },
      { at: 1.36, frequency: 1780, duration: 0.11 },
      { at: 1.51, frequency: 1120, duration: 0.16 },
    ];

    chirpFilter.type = "bandpass";
    chirpFilter.frequency.setValueAtTime(1450, startTime);
    chirpFilter.Q.setValueAtTime(9, startTime);

    masterGain.gain.setValueAtTime(0.0001, startTime);
    masterGain.gain.exponentialRampToValueAtTime(0.24, startTime + 0.025);
    masterGain.gain.setValueAtTime(0.22, startTime + 1.52);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.84);
    chirpFilter.connect(masterGain);
    masterGain.connect(chirpAudioCtx.destination);

    chirpNotes.forEach((note, index) => {
      const oscillator = chirpAudioCtx.createOscillator();
      const noteGain = chirpAudioCtx.createGain();
      const noteStart = startTime + note.at;
      const pitchTarget = Math.max(80, note.frequency * (index % 2 ? 0.62 : 1.32));

      oscillator.type = index % 2 === 0 ? "square" : "triangle";
      oscillator.frequency.setValueAtTime(note.frequency, noteStart);
      oscillator.frequency.exponentialRampToValueAtTime(pitchTarget, noteStart + note.duration);

      noteGain.gain.setValueAtTime(0.0001, noteStart);
      noteGain.gain.exponentialRampToValueAtTime(0.36, noteStart + 0.01);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteStart + note.duration);

      oscillator.connect(noteGain);
      noteGain.connect(chirpFilter);
      oscillator.start(noteStart);
      oscillator.stop(noteStart + note.duration + 0.02);
    });

    window.setTimeout(() => {
      chirpFilter.disconnect?.();
      masterGain.disconnect?.();
    }, 2100);
  };

  scheduleChirp();
  if (chirpAudioCtx.state === "suspended") {
    chirpAudioCtx.resume().catch(() => {});
  }
}

function getFormProfileName(terms) {
  const currentTerms = currentProfile?.terms || [];
  if (arraysMatch(terms, currentTerms)) return currentProfile.name;
  return suggestSearchName(terms);
}

function suggestSearchName(terms) {
  return terms[0] || "Untitled Search";
}

function arraysMatch(first, second) {
  if (first.length !== second.length) return false;
  return first.every((item, index) => item === second[index]);
}

function handleQuickSearchKeydown(event) {
  if (event.isComposing || event.keyCode === 229) return;
  if (event.key !== "Enter") return;
  event.preventDefault();
  searchForm.requestSubmit();
}

function handlePrimaryTermsInput() {
  clearSearchSpecificExcludesForNewTerms();
  syncPrimaryTermsToRefine();
  syncMobileSearchInputFromPrimary();
}

function handleMobileSearchInput() {
  if (!mobileSearchInput) return;
  if (termsInput.value !== mobileSearchInput.value) {
    termsInput.value = mobileSearchInput.value;
    handlePrimaryTermsInput();
  }
}

function handleMobileSearchSubmit(event) {
  event.preventDefault();
  if (mobileSearchInput && termsInput.value !== mobileSearchInput.value) {
    termsInput.value = mobileSearchInput.value;
    handlePrimaryTermsInput();
  }
  searchForm.requestSubmit();
}

function handleQuickSearchSuggestionClick(event) {
  const button = event.target.closest("[data-suggested-maker][data-suggested-model]");
  if (!button) return;

  const maker = button.dataset.suggestedMaker || "";
  const model = button.dataset.suggestedModel || "";
  if (!maker || !model) return;

  const nextTerm = buildQuickSearchSuggestionTerm(maker, model, button.dataset.suggestedJoiner);
  const refineTerms = splitLines(refineTermsInput.value);
  const extraTerms = refineTerms.slice(1);
  termsInput.value = nextTerm;
  refineTermsInput.value = [nextTerm, ...extraTerms].join("\n");
  autoSizeRefineTermsInput();
  clearSearchSpecificExcludesForNewTerms();
  syncMobileSearchInputFromPrimary({ force: true });
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  updateQuickSaveSearchButton();
  termsInput.focus();
}

function clearQuickSearchTerms() {
  termsInput.value = "";
  refineTermsInput.value = "";
  autoSizeRefineTermsInput();
  if (mobileSearchInput) mobileSearchInput.value = "";
  clearSearchSpecificExcludesForNewTerms();
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  renderRefineSummary();
  updateQuickSaveSearchButton();
  updateMobileSearchOverlayVisibility();
  termsInput.focus();
}

function syncMobileSearchInputFromPrimary(options = {}) {
  if (!mobileSearchInput) return;
  const { force = false } = options;
  if (!force && document.activeElement === mobileSearchInput) return;
  if (mobileSearchInput.value !== termsInput.value) {
    mobileSearchInput.value = termsInput.value;
  }
}

function clearSearchSpecificExcludesForNewTerms() {
  const nextTerms = splitLines(termsInput.value);
  if (arraysMatch(nextTerms, currentProfile?.terms || [])) return;

  if (!excludesInput.value.trim()) return;

  setExcludeTags([]);
}

function normalizeExcludeTag(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function parseExcludeTagText(value) {
  return String(value || "")
    .split(/[\n,]+/)
    .map(normalizeExcludeTag)
    .filter(Boolean);
}

function getExcludeTags() {
  return parseExcludeTagText(excludesInput?.value || "");
}

function setExcludeTags(tags, options = {}) {
  const { notify = true } = options;
  const seen = new Set();
  const nextTags = [];

  tags.forEach((tag) => {
    const normalizedTag = normalizeExcludeTag(tag);
    if (!normalizedTag) return;
    const key = normalizeText(normalizedTag);
    if (seen.has(key)) return;
    seen.add(key);
    nextTags.push(normalizedTag);
  });

  if (excludesInput) excludesInput.value = nextTags.join("\n");
  renderExcludeTags();

  if (notify) {
    renderRefineSummary();
    updateRefineSaveSearchButton();
  }

  return nextTags;
}

function renderExcludeTags() {
  if (!excludeTagList || !excludeTagInput) return;
  const tags = getExcludeTags();
  excludeTagList.innerHTML = "";
  excludeTagField?.classList.toggle("has-tags", tags.length > 0);

  tags.forEach((tag, index) => {
    const chip = document.createElement("span");
    chip.className = "exclude-tag-chip";

    const label = document.createElement("span");
    label.className = "exclude-tag-label";
    label.textContent = tag;

    const removeButton = document.createElement("button");
    removeButton.className = "exclude-tag-remove";
    removeButton.type = "button";
    removeButton.dataset.excludeIndex = String(index);
    removeButton.setAttribute("aria-label", `Remove excluded term ${tag}`);
    removeButton.textContent = "×";

    chip.append(label, removeButton);
    excludeTagList.appendChild(chip);
  });
}

function commitExcludeTagInput(options = {}) {
  if (!excludeTagInput) return false;
  const nextTags = parseExcludeTagText(excludeTagInput.value);
  if (nextTags.length === 0) {
    excludeTagInput.value = "";
    return false;
  }

  setExcludeTags([...getExcludeTags(), ...nextTags]);
  excludeTagInput.value = "";
  if (options.focus) excludeTagInput.focus();
  return true;
}

function removeExcludeTagAt(index, options = {}) {
  const tags = getExcludeTags();
  if (!Number.isInteger(index) || index < 0 || index >= tags.length) return;
  tags.splice(index, 1);
  setExcludeTags(tags);
  if (options.focusInput !== false) excludeTagInput?.focus();
}

function handleExcludeTagFieldClick(event) {
  if (event.target.closest(".exclude-tag-remove")) return;
  excludeTagInput?.focus();
}

function handleExcludeTagInputKeydown(event) {
  if (event.isComposing || event.keyCode === 229) return;

  if (event.key === "Enter" || event.key === ",") {
    event.preventDefault();
    commitExcludeTagInput({ focus: true });
    return;
  }

  if (event.key === "Backspace" && !excludeTagInput.value) {
    event.preventDefault();
    removeExcludeTagAt(getExcludeTags().length - 1, { focusInput: true });
    return;
  }

  if (event.key === "Escape" && excludeTagInput.value) {
    event.preventDefault();
    excludeTagInput.value = "";
  }
}

function handleExcludeTagInput(event) {
  if (event.isComposing) return;
  if (/[\n,]/.test(excludeTagInput.value)) {
    commitExcludeTagInput({ focus: true });
  }
}

function handleExcludeTagInputPaste(event) {
  const pastedText = event.clipboardData?.getData("text") || "";
  if (!/[\n,]/.test(pastedText)) return;
  event.preventDefault();
  const nextTags = parseExcludeTagText(`${excludeTagInput.value}\n${pastedText}`);
  if (nextTags.length > 0) {
    setExcludeTags([...getExcludeTags(), ...nextTags]);
  }
  excludeTagInput.value = "";
  excludeTagInput.focus();
}

function handleExcludeTagRemoveClick(event) {
  const button = event.target.closest(".exclude-tag-remove");
  if (!button) return;
  removeExcludeTagAt(Number(button.dataset.excludeIndex), { focusInput: true });
}

function openRefineSearchModal(event) {
  refineSearchReturnFocus = event?.currentTarget || document.activeElement;
  if (!refineTermsInput.value.trim()) {
    syncPrimaryTermsToRefine();
  }
  if (refineSourceOptions) refineSourceOptions.open = false;
  if (refineNoiseOptions) refineNoiseOptions.open = false;
  renderRefineSummary();
  updateRefineSaveSearchButton();
  refineSearchModal.hidden = false;
  document.body.classList.add("modal-open");
  updateMobileSearchOverlayVisibility();
  autoSizeRefineTermsInput();
  refineTermsInput.focus();
}

function closeRefineSearchModal(options = {}) {
  const { restoreFocus = true } = options;
  if (refineSearchModal.hidden) return;
  refineSearchModal.hidden = true;
  document.body.classList.remove("modal-open");
  updateMobileSearchOverlayVisibility();
  if (restoreFocus) refineSearchReturnFocus?.focus();
}

function handleRefineSearchModalEdit() {
  renderRefineSummary();
  updateRefineSaveSearchButton();
}

function getDraftProfileFromRefineModal() {
  syncRefineTermsToPrimary();
  return {
    ...readProfileFromForm(),
    regionId: appSettings.regionId,
  };
}

function updateRefineSaveSearchButton() {
  if (!saveRefineSearchButton) return;
  const draftProfile = getDraftProfileFromRefineModal();
  const hasSearchTerms = draftProfile.terms.length > 0;
  const isSaved = hasSearchTerms && Boolean(findMatchingSavedSearchByProfile(draftProfile));

  saveRefineSearchButton.disabled = !hasSearchTerms;
  saveRefineSearchButton.classList.toggle("is-saved", isSaved);
  saveRefineSearchButton.innerHTML = isSaved ? 'Saved <span aria-hidden="true">✓</span>' : "Save this search";
  saveRefineSearchButton.title = isSaved ? "Current search is saved" : "Save this search";
  saveRefineSearchButton.setAttribute("aria-label", isSaved ? "Current search is saved" : "Save this search");
}

function saveSearchFromRefineModal(event) {
  event?.preventDefault?.();
  if (!saveRefineSearchButton || saveRefineSearchButton.disabled) {
    refineTermsInput.focus();
    return;
  }

  const draftProfile = getDraftProfileFromRefineModal();
  const existingProfile = findMatchingSavedSearchByProfile(draftProfile);

  if (existingProfile) {
    currentProfile = hydrateProfile(existingProfile);
    updateQuickSaveSearchButton();
    updateRefineSaveSearchButton();
    showSaveConfirmationToast(currentProfile, { alreadySaved: true });
    return;
  }

  currentProfile = saveProfile(draftProfile);
  renderSavedSearches();
  setActiveTitle(currentProfile.name);
  queueSavedSearchAutoSync("refine-save-search");
  updateQuickSaveSearchButton();
  updateRefineSaveSearchButton();
  showSaveConfirmationToast(currentProfile);
}

function autoSizeRefineTermsInput() {
  if (!refineTermsInput) return;
  refineTermsInput.style.height = "auto";
  const styles = window.getComputedStyle(refineTermsInput);
  const minHeight = Number.parseFloat(styles.minHeight) || 48;
  const maxHeight = Number.parseFloat(styles.maxHeight) || 180;
  const nextHeight = Math.min(Math.max(refineTermsInput.scrollHeight, minHeight), maxHeight);
  const entry = refineTermsInput.closest(".refine-term-entry");
  entry?.classList.toggle("is-expanded", nextHeight > minHeight + 4);
  refineTermsInput.style.height = `${nextHeight}px`;
  refineTermsInput.style.overflowY = refineTermsInput.scrollHeight > maxHeight ? "auto" : "hidden";
}

function syncPrimaryTermsToRefine() {
  const primaryTerms = splitLines(termsInput.value);
  const nextValue = primaryTerms.join("\n");
  if (refineTermsInput.value === nextValue) {
    autoSizeRefineTermsInput();
    return;
  }
  refineTermsInput.value = nextValue;
  autoSizeRefineTermsInput();
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  updateQuickSaveSearchButton();
}

function syncRefineTermsToPrimary() {
  autoSizeRefineTermsInput();
  renderPrimarySearchTerm();
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  updateQuickSaveSearchButton();
}

function getSearchTermsFromForm() {
  if (!refineSearchModal.hidden) return splitLines(refineTermsInput.value);

  const primaryTerms = splitLines(termsInput.value);
  if (!primaryTerms.length) return splitLines(refineTermsInput.value);

  const refineTerms = splitLines(refineTermsInput.value);
  if (refineTerms.length <= 1) return primaryTerms;

  const primaryTerm = primaryTerms[0] || "";
  const refinePrimaryTerm = refineTerms[0] || "";
  if (normalizeText(primaryTerm) !== normalizeText(refinePrimaryTerm)) {
    return primaryTerms;
  }

  return uniqueTerms([...primaryTerms, ...refineTerms.slice(1)]);
}

function renderPrimarySearchTerm() {
  const terms = splitLines(refineTermsInput.value);
  const primaryTerm = terms[0] || "";
  if (termsInput.value !== primaryTerm) {
    termsInput.value = primaryTerm;
  }
  syncMobileSearchInputFromPrimary({ force: true });
  renderSearchTermsSummary();
}

function renderRefineSummary() {
  if (!refineSummary) return;
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  updateQuickSaveSearchButton();
  const profile = readProfileFromForm();
  const sourceCount = profile.sources.length;
  const sourceText = `${sourceCount} ${sourceCount === 1 ? "source" : "sources"}`;
  if (refineSourceCount) refineSourceCount.textContent = sourceText;
  if (refineNoiseCount) refineNoiseCount.textContent = `${profile.noiseTerms.length} ${profile.noiseTerms.length === 1 ? "term" : "terms"}`;
  const categoryText = getCategoryIntentLabel(profile.categoryIntent);
  const priceText = profile.maxPrice > 0 ? `${formatPrice(profile.maxPrice)} max` : "No price cap";
  const excludeText = `${profile.excludes.length} excluded`;
  refineSummary.textContent = `${categoryText} · ${sourceText} · ${priceText} · ${profile.alertMode} · ${excludeText}`;
}

function renderSearchTermsSummary() {
  if (!quickSearchExtraTermsButton) return;

  const terms = getSearchTermsFromForm();
  const primaryTerm = terms[0] || "Search terms";
  const extraCount = Math.max(0, terms.length - 1);
  const hasTerms = terms.length > 0;
  const searchField = termsInput.closest(".search-terms-field");

  searchField?.classList.toggle("has-extra-terms", extraCount > 0);
  searchField?.classList.toggle("has-clear-search", hasTerms);
  quickSearchExtraTermsButton.hidden = extraCount === 0;
  if (quickSearchClearButton) quickSearchClearButton.hidden = !hasTerms;
  quickSearchExtraTermsButton.textContent = `+${extraCount} ${extraCount === 1 ? "term" : "terms"}`;
  quickSearchExtraTermsButton.setAttribute("aria-label", `Edit ${extraCount} additional search ${extraCount === 1 ? "term" : "terms"} for ${primaryTerm}`);
  quickSearchExtraTermsButton.title = "Edit additional terms";
  renderQuickSearchSuggestions();
}

function renderQuickSearchSuggestions() {
  if (!quickSearchSuggestions) return;

  const suggestionGroup = getQuickSearchSuggestionGroup(termsInput.value);
  quickSearchSuggestions.replaceChildren();
  quickSearchSuggestions.hidden = !suggestionGroup;
  termsInput.setAttribute("aria-expanded", String(Boolean(suggestionGroup)));

  if (!suggestionGroup) return;

  quickSearchSuggestions.setAttribute("aria-label", `${suggestionGroup.maker} model suggestions`);

  suggestionGroup.models.forEach((model) => {
    const button = document.createElement("button");
    button.className = "quick-search-suggestion";
    button.type = "button";
    button.dataset.suggestedMaker = suggestionGroup.maker;
    button.dataset.suggestedModel = model;
    button.dataset.suggestedJoiner = suggestionGroup.termJoiner ?? " ";
    button.textContent = model;
    button.setAttribute("aria-label", `Search for ${buildQuickSearchSuggestionTerm(suggestionGroup.maker, model, suggestionGroup.termJoiner)}`);
    quickSearchSuggestions.appendChild(button);
  });
}

function buildQuickSearchSuggestionTerm(maker, model, joiner = " ") {
  return `${maker}${joiner}${model}`;
}

function getQuickSearchSuggestionGroup(value) {
  const query = normalizeText(value);
  if (!query) return null;

  for (const group of SYNTH_MODEL_SUGGESTIONS) {
    const termJoiner = group.termJoiner ?? " ";
    const matchedAlias = [group.maker, ...(group.aliases || [])].find((alias) => {
      const normalizedAlias = normalizeText(alias);
      return query === normalizedAlias || query.startsWith(`${normalizedAlias} `) || (termJoiner === "" && query.startsWith(normalizedAlias));
    });
    if (!matchedAlias) continue;

    const normalizedMatchedAlias = normalizeText(matchedAlias);
    const selectedModel = query === normalizedMatchedAlias
      ? ""
      : query.slice(normalizedMatchedAlias.length).trim();
    const modelQuery = termJoiner === "" && selectedModel && !selectedModel.startsWith("-")
      ? `-${selectedModel}`
      : selectedModel;
    if (modelQuery && group.models.some((model) => normalizeText(model) === modelQuery)) return null;
    const models = modelQuery
      ? group.models.filter((model) => normalizeText(model).startsWith(modelQuery))
      : group.models;
    return models.length > 0 ? { ...group, models } : null;
  }

  return null;
}

function renderRefineTermDropdown() {
  const terms = getSearchTermsFromForm();
  termDropdown.hidden = terms.length < 2;
  termDropdown.innerHTML = "";

  if (termDropdown.hidden) return;

  terms.forEach((term, index) => {
    const row = document.createElement("div");
    row.className = "term-dropdown-row";

    const icon = document.createElement("span");
    icon.className = "term-row-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "◷";

    const label = document.createElement("span");
    label.className = "term-row-label";
    label.textContent = term;

    const removeButton = document.createElement("button");
    removeButton.className = "term-remove-button";
    removeButton.type = "button";
    removeButton.dataset.termIndex = String(index);
    removeButton.setAttribute("aria-label", `Remove ${term}`);
    removeButton.textContent = "×";
    removeButton.addEventListener("click", (event) => {
      event.stopPropagation();
      removeRefineTermAt(index);
    });

    row.append(icon, label, removeButton);
    termDropdown.appendChild(row);
  });
}

function handleTermDropdownClick(event) {
  const button = event.target.closest(".term-remove-button");
  if (!button) return;

  removeRefineTermAt(Number(button.dataset.termIndex));
}

function removeRefineTermAt(removeIndex) {
  const terms = splitLines(refineTermsInput.value).filter((_, index) => index !== removeIndex);
  refineTermsInput.value = terms.join("\n");
  autoSizeRefineTermsInput();
  syncRefineTermsToPrimary();
  renderRefineSummary();
  refineTermsInput.focus();
}

function toggleSavedSearchPopover(event) {
  event.stopPropagation();
  if (savedSearchPopover.hidden) {
    openSavedSearchPopover();
  } else {
    closeSavedSearchPopover();
  }
}

function openSavedSearchPopover(options = {}) {
  savedPopoverAnchorElement = options.anchorElement || openSavedSearchesButton;
  savedPopoverAnchorMode = options.anchorMode === "bottom" ? "bottom" : "header";
  renderSavedSearches();
  updateSavedSearchPopoverPosition();
  savedSearchPopover.hidden = false;
  document.body.classList.add("saved-popover-open");
  document.body.classList.toggle("saved-popover-bottom-anchor", savedPopoverAnchorMode === "bottom");
  openSavedSearchesButton.setAttribute("aria-expanded", "true");
  updateMobileBottomNavState();
}

function closeSavedSearchPopover() {
  if (savedSearchPopover.hidden) return;
  savedSearchPopover.hidden = true;
  document.body.classList.remove("saved-popover-open");
  document.body.classList.remove("saved-popover-bottom-anchor");
  openSavedSearchesButton.setAttribute("aria-expanded", "false");
  savedPopoverAnchorElement = null;
  savedPopoverAnchorMode = "header";
  updateMobileBottomNavState();
}

function updateSavedSearchPopoverPosition() {
  if (!openSavedSearchesButton || !savedSearchPopover) return;
  const anchorElement = savedPopoverAnchorElement || openSavedSearchesButton;
  const anchorRect = anchorElement.getBoundingClientRect();
  const anchorCenterX = anchorRect.left + anchorRect.width / 2;
  const viewportWidth = document.documentElement.clientWidth || window.innerWidth || 0;
  const viewportHeight = document.documentElement.clientHeight || window.innerHeight || 0;
  const panelRightInset = 12;

  savedSearchPopover.style.setProperty("--saved-popover-mobile-top", `${Math.round(anchorRect.bottom + 10)}px`);
  savedSearchPopover.style.setProperty("--saved-popover-mobile-bottom", `${Math.max(12, Math.round(viewportHeight - anchorRect.top + 12))}px`);
  savedSearchPopover.style.setProperty("--saved-popover-anchor-right", `${Math.round(viewportWidth - anchorCenterX - panelRightInset)}px`);
}

function refreshSavedSearchPopoverPosition() {
  if (!savedSearchPopover || savedSearchPopover.hidden) return;
  updateSavedSearchPopoverPosition();
}

function handleSavedPopoverOutsideClick(event) {
  if (savedSearchPopover.hidden) return;
  if (event.target.closest(".saved-menu")) return;
  closeSavedSearchPopover();
}

function updateQuickSaveSearchButton() {
  if (!quickSaveSearchButton) return;

  const draftProfile = readProfileFromForm();
  const hasSearchTerms = draftProfile.terms.length > 0;
  const isSaved = hasSearchTerms && Boolean(findMatchingSavedSearchByProfile(draftProfile));

  quickSaveSearchButton.disabled = !hasSearchTerms;
  quickSaveSearchButton.classList.toggle("is-saved", isSaved);
  quickSaveSearchButton.textContent = isSaved ? "★" : "☆";
  quickSaveSearchButton.title = isSaved ? "Current search is saved" : "Save current search";
  quickSaveSearchButton.setAttribute("aria-label", isSaved ? "Current search is saved" : "Save current search");
}

function profilesMatchSearch(firstProfile, secondProfile) {
  const first = hydrateProfile(firstProfile);
  const second = hydrateProfile(secondProfile);

  return arraysMatch(first.terms, second.terms)
    && arraysMatch(first.excludes, second.excludes)
    && arraysMatch(first.noiseTerms, second.noiseTerms)
    && arraysMatch([...first.sources].sort(), [...second.sources].sort())
    && Number(first.maxPrice || 0) === Number(second.maxPrice || 0)
    && first.categoryIntent === second.categoryIntent
    && first.alertMode === second.alertMode;
}

function findMatchingSavedSearchByProfile(candidateProfile) {
  const draftProfile = hydrateProfile(candidateProfile);
  return loadProfiles().find((profile) => profilesMatchSearch(profile, draftProfile));
}

function saveCurrentSearchQuick(event) {
  if (quickSaveSearchButton?.disabled) {
    termsInput.focus();
    return;
  }

  event?.preventDefault?.();
  closeSavedSearchPopover();
  const draftProfile = {
    ...readProfileFromForm(),
    regionId: appSettings.regionId,
  };
  const existingProfile = findMatchingSavedSearchByProfile(draftProfile);

  if (existingProfile) {
    currentProfile = hydrateProfile(existingProfile);
    updateQuickSaveSearchButton();
    showSaveConfirmationToast(currentProfile, { alreadySaved: true });
    return;
  }

  currentProfile = saveProfile(draftProfile);
  renderSavedSearches();
  setActiveTitle(currentProfile.name);
  queueSavedSearchAutoSync("quick-save-search");
  showSaveConfirmationToast(currentProfile);
}

function openSaveSearchModal(event) {
  if (quickSaveSearchButton?.disabled && event?.currentTarget === quickSaveSearchButton) {
    termsInput.focus();
    return;
  }
  saveSearchReturnFocus = event?.currentTarget || document.activeElement;
  closeSavedSearchPopover();
  const draftProfile = readProfileFromForm();
  saveSearchName.value = draftProfile.name;
  saveSearchAlert.value = draftProfile.alertMode;
  saveSearchModal.hidden = false;
  document.body.classList.add("modal-open");
  updateMobileSearchOverlayVisibility();
  saveSearchName.focus();
  saveSearchName.select();
}

function closeSaveSearchModal(options = {}) {
  const { restoreFocus = true } = options;
  saveSearchModal.hidden = true;
  document.body.classList.remove("modal-open");
  updateMobileSearchOverlayVisibility();
  if (restoreFocus) saveSearchReturnFocus?.focus?.();
  saveSearchReturnFocus = null;
}

function saveCurrentSearchFromModal() {
  const savedName = saveSearchName.value.trim() || suggestSearchName(splitLines(document.querySelector("#terms").value));
  currentProfile = {
    ...readProfileFromForm(),
    name: savedName,
    regionId: appSettings.regionId,
    alertMode: saveSearchAlert.value,
  };
  document.querySelector("#alertMode").value = currentProfile.alertMode;
  currentProfile = saveProfile(currentProfile);
  renderSavedSearches();
  setActiveTitle(currentProfile.name);
  queueSavedSearchAutoSync("save-search");
  closeSaveSearchModal();
  showSaveConfirmationToast(currentProfile);
}

function showSaveConfirmationToast(profile, options = {}) {
  const prefix = options.alreadySaved ? "Already saved" : "Saved";
  showStatusToast({
    icon: "★",
    message: `${prefix}: ${profile?.name || "Search"}`,
    showView: true,
  });
}

function showStatusToast({ icon = "★", message = "", showView = false } = {}) {
  if (!saveConfirmationToast) return;
  window.clearTimeout(saveConfirmationTimer);

  const iconNode = saveConfirmationToast.querySelector(".save-toast-icon");
  const copy = saveConfirmationToast.querySelector(".save-toast-copy");
  if (iconNode) iconNode.textContent = icon;
  if (copy) copy.textContent = message;
  if (viewSavedSearchToastButton) viewSavedSearchToastButton.hidden = !showView;

  saveConfirmationToast.hidden = false;
  window.requestAnimationFrame(() => {
    saveConfirmationToast.classList.add("is-visible");
  });

  saveConfirmationTimer = window.setTimeout(hideSaveConfirmationToast, SAVE_CONFIRMATION_DURATION_MS);
}

function hideSaveConfirmationToast() {
  if (!saveConfirmationToast) return;
  window.clearTimeout(saveConfirmationTimer);
  saveConfirmationTimer = 0;
  saveConfirmationToast.classList.remove("is-visible");
  window.setTimeout(() => {
    if (!saveConfirmationToast.classList.contains("is-visible")) {
      saveConfirmationToast.hidden = true;
    }
  }, SAVE_CONFIRMATION_TRANSITION_MS);
}

function viewSavedSearchFromToast() {
  hideSaveConfirmationToast();
  openSavedSearchPopover();
  openSavedSearchesButton?.focus();
}

function handleMobileBottomNavClick(event) {
  const button = event.target.closest("[data-mobile-nav]");
  if (!button) return;

  event.preventDefault();
  event.stopPropagation();

  const navTarget = button.dataset.mobileNav;
  if (navTarget === "home") {
    resetHomeView(event);
    updateMobileBottomNavState();
    return;
  }

  if (navTarget === "saved") {
    if (!settingsModal.hidden) closeSettingsModal({ restoreFocus: false });
    if (!savedSearchPopover.hidden && savedPopoverAnchorMode === "bottom") {
      closeSavedSearchPopover();
    } else {
      openSavedSearchPopover({ anchorElement: button, anchorMode: "bottom" });
    }
    return;
  }

  if (navTarget === "watchlist") {
    closeSavedSearchPopover();
    if (!settingsModal.hidden) closeSettingsModal({ restoreFocus: false });
    openWatchlistView({ focusTarget: button });
    return;
  }

  if (navTarget === "settings") {
    closeSavedSearchPopover();
    if (!settingsModal.hidden) {
      closeSettingsModal({ restoreFocus: false });
    } else {
      openSettingsModal({ currentTarget: button }, { focusTarget: currencyToggle });
    }
  }
}

function updateMobileBottomNavState() {
  if (!mobileBottomNavItems.length) return;

  const activeTarget = !settingsModal.hidden
    ? "settings"
    : !savedSearchPopover.hidden
      ? "saved"
      : filterMode === "watching"
        ? "watchlist"
        : "home";

  mobileBottomNavItems.forEach((item) => {
    const isActive = item.dataset.mobileNav === activeTarget;
    item.classList.toggle("is-active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
}

function openSettingsModal(event, options = {}) {
  settingsReturnFocus = event?.currentTarget || document.activeElement;
  fillSettingsForm();
  setSavedSearchTransferStatus("");
  setActiveSettingsTab("general", { focus: false });
  settingsModal.hidden = false;
  document.body.classList.add("modal-open");
  document.body.classList.add("settings-modal-open");
  updateMobileSearchOverlayVisibility();
  (options.focusTarget || currencyToggle)?.focus?.();
  updateMobileBottomNavState();
}

function openRegionSettings(event) {
  openSettingsModal(event, { focusTarget: regionSelect });
}

function openSearchQualitySettings(event) {
  openSettingsModal(event, { focusTarget: gearModeSettingsToggle });
}

function closeSettingsModal(options = {}) {
  const { restoreFocus = true } = options;
  if (settingsModal.hidden) return;
  settingsModal.hidden = true;
  document.body.classList.remove("modal-open");
  document.body.classList.remove("settings-modal-open");
  updateMobileSearchOverlayVisibility();
  if (restoreFocus) settingsReturnFocus?.focus?.();
  settingsReturnFocus = null;
  updateMobileBottomNavState();
}

function fillSettingsForm() {
  renderRegionOptions();
  if (regionSelect) regionSelect.value = sanitizeRegionId(appSettings.regionId);
  currencyToggle.checked = appSettings.currency === "USD";
  if (themeSettingsToggle) themeSettingsToggle.checked = document.body.dataset.theme === "dark";
  if (gearModeSettingsToggle) gearModeSettingsToggle.checked = appSettings.gearMode;
  jpyPerUsdInput.value = appSettings.jpyPerUsd;
  updateBrandGradientControls(appSettings.brandGradient);
  if (cloudProfileEmail) cloudProfileEmail.textContent = getCloudSyncUser().email;
  renderAccountShell(authState.user);
}

function setActiveSettingsTab(tabName = "general", options = {}) {
  const nextTabName = settingsTabs.some((tab) => tab.dataset.settingsTab === tabName) ? tabName : "general";
  settingsTabs.forEach((tab) => {
    const isActive = tab.dataset.settingsTab === nextTabName;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && options.focus) tab.focus();
  });
  settingsPanels.forEach((panel) => {
    const isActive = panel.dataset.settingsPanel === nextTabName;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

function handleSettingsTabKeydown(event) {
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();

  const currentIndex = settingsTabs.indexOf(event.currentTarget);
  if (currentIndex < 0) return;

  let nextIndex = currentIndex;
  if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + settingsTabs.length) % settingsTabs.length;
  if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % settingsTabs.length;
  if (event.key === "Home") nextIndex = 0;
  if (event.key === "End") nextIndex = settingsTabs.length - 1;

  setActiveSettingsTab(settingsTabs[nextIndex].dataset.settingsTab, { focus: true });
}

function renderAccountShell(account = null) {
  const isSignedIn = Boolean(account?.email);
  if (signedOutAccountPanel) signedOutAccountPanel.hidden = isSignedIn;
  if (signedInAccountPanel) signedInAccountPanel.hidden = !isSignedIn;
  if (accountEmailDisplay) accountEmailDisplay.textContent = account?.email || CLOUD_EMULATOR_USER.email;
  if (accountStatus) {
    accountStatus.textContent = isSignedIn
      ? authState.accountNotice || "Signed in. Saved searches now sync with this account."
      : getSignedOutAccountStatus();
  }
  renderAccountSyncDetail();
}

function renderAccountSyncDetail() {
  if (!accountSyncDetail) return;

  if (!authState.user?.id) {
    accountSyncDetail.textContent = "Last synced: sign in to sync";
    return;
  }

  accountSyncDetail.textContent = authState.lastSyncedAt
    ? `Last synced: ${formatSyncTimestamp(authState.lastSyncedAt)}`
    : "Last synced: never";
}

function formatSyncTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "unknown";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function readCloudSyncMeta() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.cloudSyncMeta) || "{}");
  } catch {
    return {};
  }
}

function writeCloudSyncMeta(nextMeta = {}) {
  localStorage.setItem(STORAGE_KEYS.cloudSyncMeta, JSON.stringify(nextMeta));
}

function markCloudSynced(syncedAt = new Date().toISOString()) {
  authState.lastSyncedAt = syncedAt;
  writeCloudSyncMeta({
    ...readCloudSyncMeta(),
    lastSyncedAt: syncedAt,
    userId: authState.user?.id || "",
    email: authState.user?.email || "",
  });
  renderAccountSyncDetail();
}

function getSignedOutAccountStatus() {
  if (authState.callbackError) return authState.callbackError;
  if (!authState.config) return "Checking account sign-in setup...";
  if (!authState.config.enabled) return "Add SUPABASE_ANON_KEY to enable email sign-in.";
  return "Enter your email and Brrtz will send a Supabase sign-in link.";
}

async function initializeAuth() {
  authState.config = await fetchAuthConfig();
  authState.lastSyncedAt = readCloudSyncMeta().lastSyncedAt || "";
  authState.session = readAuthSessionFromCallback() || readStoredAuthSession();
  authState.user = null;

  if (authState.session && authState.config?.enabled) {
    await hydrateAuthUser();
  }

  renderAccountShell(authState.user);
}

async function fetchAuthConfig() {
  try {
    const response = await fetch("/api/auth/config", { cache: "no-store" });
    if (!response.ok) throw new Error(`Auth config responded with ${response.status}.`);
    return response.json();
  } catch (error) {
    console.warn("Could not load auth config.", error);
    return {
      provider: "supabase",
      enabled: false,
      supabaseUrl: "",
      anonKey: "",
      redirectTo: window.location.origin,
    };
  }
}

async function hydrateAuthUser() {
  try {
    authState.session = await refreshAuthSessionIfNeeded(authState.session);
    authState.user = await fetchSupabaseUser(authState.session.access_token);
    authState.accountNotice = "";
  } catch (error) {
    console.warn("Could not restore auth session.", error);
    clearStoredAuthSession();
    authState.session = null;
    authState.user = null;
    authState.accountNotice = "";
    return;
  }

  try {
    await pullCloudProfilePreferences({ silent: true, surfaceErrors: true });
    authState.accountNotice = "";
  } catch (error) {
    console.warn("Could not sync profile preferences yet.", error);
    authState.accountNotice = error instanceof Error
      ? error.message
      : "Signed in, but cloud sync needs attention.";
  }
}

function readAuthSessionFromCallback() {
  if (!window.location.hash.includes("access_token") && !window.location.hash.includes("error=")) return null;

  const params = new URLSearchParams(window.location.hash.slice(1));

  if (params.has("error")) {
    authState.callbackError = formatAuthCallbackError(params);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    return null;
  }

  const session = normalizeAuthSession({
    access_token: params.get("access_token"),
    refresh_token: params.get("refresh_token"),
    expires_at: params.get("expires_at"),
    expires_in: params.get("expires_in"),
    token_type: params.get("token_type"),
  });

  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);

  if (!session) return null;
  storeAuthSession(session);
  return session;
}

function formatAuthCallbackError(params) {
  const code = params.get("error_code") || params.get("error") || "auth_error";
  const description = params.get("error_description") || "Supabase could not complete sign-in.";

  if (code === "otp_expired") {
    return "That sign-in link was already used, expired, or opened by an email privacy scanner. Send a fresh link and open only the newest email.";
  }

  return `${description} (${code})`;
}

function readStoredAuthSession() {
  try {
    return normalizeAuthSession(JSON.parse(localStorage.getItem(STORAGE_KEYS.authSession) || "null"));
  } catch (error) {
    return null;
  }
}

function storeAuthSession(session) {
  localStorage.setItem(STORAGE_KEYS.authSession, JSON.stringify(session));
}

function clearStoredAuthSession() {
  localStorage.removeItem(STORAGE_KEYS.authSession);
}

function clearInvalidCloudSession(message = "Your cloud session could not be verified. Sign out and sign in again.") {
  clearStoredAuthSession();
  authState.session = null;
  authState.user = null;
  authState.accountNotice = message;
  renderAccountShell();
}

function isCloudAuthSessionError(message = "") {
  return /cloud session could not be verified|sign-in session expired|sign in is required/i.test(message);
}

function normalizeAuthSession(rawSession) {
  if (!rawSession?.access_token) return null;

  const expiresAt = Number(rawSession.expires_at)
    || Math.floor(Date.now() / 1000) + Number(rawSession.expires_in || 3600);

  return {
    access_token: rawSession.access_token,
    refresh_token: rawSession.refresh_token || "",
    expires_at: expiresAt,
    token_type: rawSession.token_type || "bearer",
  };
}

async function refreshAuthSessionIfNeeded(session) {
  if (!session?.refresh_token) return session;

  const expiresSoon = Number(session.expires_at || 0) * 1000 < Date.now() + 60_000;
  if (!expiresSoon) return session;

  const response = await fetch(`${getSupabaseAuthBaseUrl()}/token?grant_type=refresh_token`, {
    method: "POST",
    headers: getSupabaseAnonHeaders(),
    body: JSON.stringify({ refresh_token: session.refresh_token }),
  });

  if (!response.ok) throw new Error("Your sign-in session expired. Please send a new sign-in link.");

  const nextSession = normalizeAuthSession(await response.json());
  storeAuthSession(nextSession);
  return nextSession;
}

async function fetchSupabaseUser(accessToken) {
  const response = await fetch(`${getSupabaseAuthBaseUrl()}/user`, {
    headers: getSupabaseAuthHeaders(accessToken),
  });

  if (!response.ok) throw new Error("Could not load the signed-in Supabase user.");

  const user = await response.json();
  return {
    id: user.id,
    email: user.email,
  };
}

async function sendSupabaseMagicLink(email) {
  const response = await fetch(`${getSupabaseAuthBaseUrl()}/otp`, {
    method: "POST",
    headers: getSupabaseAnonHeaders(),
    body: JSON.stringify({
      email,
      create_user: true,
      data: {
        app: "Brrtz",
      },
      options: {
        email_redirect_to: getAuthRedirectUrl(),
      },
    }),
  });

  if (!response.ok) {
    const errorPayload = await readJsonResponse(response);
    const message = errorPayload?.msg || errorPayload?.message || "Supabase could not send that sign-in link.";
    throw new Error(message);
  }
}

async function signOutAccount() {
  signOutAccountButton.disabled = true;
  syncAccountSavedSearchesButton.disabled = true;
  accountStatus.textContent = "Signing out...";

  try {
    if (authState.session?.access_token && authState.config?.enabled) {
      await fetch(`${getSupabaseAuthBaseUrl()}/logout`, {
        method: "POST",
        headers: getSupabaseAuthHeaders(authState.session.access_token),
      });
    }
  } catch (error) {
    console.warn("Supabase sign-out request failed.", error);
  } finally {
    clearStoredAuthSession();
    authState.session = null;
    authState.user = null;
    authState.accountNotice = "";
    authState.lastSyncedAt = "";
    signOutAccountButton.disabled = false;
    syncAccountSavedSearchesButton.disabled = false;
    renderAccountShell();
    accountStatus.textContent = "Signed out on this browser.";
  }
}

function getSupabaseAuthBaseUrl() {
  return `${authState.config.supabaseUrl.replace(/\/+$/, "")}/auth/v1`;
}

function getSupabaseAnonHeaders() {
  return {
    apikey: authState.config.anonKey,
    authorization: `Bearer ${authState.config.anonKey}`,
    "content-type": "application/json",
  };
}

function getSupabaseAuthHeaders(accessToken) {
  return {
    apikey: authState.config.anonKey,
    authorization: `Bearer ${accessToken}`,
    "content-type": "application/json",
  };
}

function getAuthRedirectUrl() {
  const configuredRedirect = authState.config?.redirectTo || window.location.origin;
  return `${configuredRedirect.replace(/\/+$/, "")}${window.location.pathname}`;
}

async function readJsonResponse(response) {
  try {
    return await response.json();
  } catch (error) {
    return null;
  }
}

async function handleAccountSignInShell() {
  const email = accountEmailInput?.value.trim();
  authState.accountNotice = "";
  if (!email) {
    accountStatus.textContent = "Enter an email address first.";
    accountEmailInput?.focus();
    return;
  }

  if (!authState.config?.enabled) {
    accountStatus.textContent = "Email sign-in is not configured yet. Add SUPABASE_ANON_KEY and restart Brrtz.";
    return;
  }

  sendSignInLinkButton.disabled = true;
  accountStatus.textContent = `Sending sign-in link to ${email}...`;

  try {
    await sendSupabaseMagicLink(email);
    accountStatus.textContent = `Check ${email} for a Brrtz sign-in link.`;
  } catch (error) {
    accountStatus.textContent = error instanceof Error ? error.message : "Could not send sign-in link.";
  } finally {
    sendSignInLinkButton.disabled = false;
  }
}

function handleAccountSignOutShell() {
  signOutAccount();
}

async function saveSettingsFromModal() {
  const previousRegionId = sanitizeRegionId(appSettings.regionId);
  const nextRegionId = sanitizeRegionId(regionSelect?.value || previousRegionId);
  const regionChanged = previousRegionId !== nextRegionId;
  const nextRegion = getRegionById(nextRegionId);
  const nextRate = Number(jpyPerUsdInput.value);
  const nextGearMode = gearModeSettingsToggle ? gearModeSettingsToggle.checked : appSettings.gearMode;
  const nextBrandGradient = readBrandGradientFromControls() || appSettings.brandGradient;
  appSettings = {
    ...appSettings,
    regionId: nextRegionId,
    currency: regionChanged ? nextRegion.currency : (currencyToggle.checked ? "USD" : "JPY"),
    jpyPerUsd: Number.isFinite(nextRate) && nextRate > 0 ? nextRate : defaultSettings.jpyPerUsd,
    gearMode: nextGearMode,
    brandGradient: nextBrandGradient,
  };
  applyBrandGradient(appSettings.brandGradient);
  qualityFilter = appSettings.gearMode ? "clean" : "all";
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));

  if (regionChanged) {
    resetRegionRuntimeState();
    currentProfile = createFreshProfile();
    renderSources();
    updateRegionBadge();
    fillForm(currentProfile);
    resetToIdleSearch();
  } else {
    renderRefineSummary();
    renderResults();
  }

  await pushCloudProfilePreferences({ silent: true });
  closeSettingsModal();
  showStatusToast({
    icon: "✓",
    message: "Settings saved",
  });
}

async function syncAccountCloudData() {
  setAccountStatus("Syncing this browser with Brrtz cloud...");
  setCloudSyncButtonsDisabled(true);
  let syncStep = "starting account sync";

  try {
    syncStep = "pulling profile preferences";
    await pullCloudProfilePreferences({ silent: true, surfaceErrors: true });
    syncStep = "merging saved searches";
    await pullCloudSavedSearches({
      preferNewest: true,
      rethrow: true,
      silent: true,
      skipConfirm: true,
    });
    syncStep = "saving merged saved searches";
    await pushCloudSavedSearches({
      allowEmpty: true,
      checkConflicts: false,
      rethrow: true,
      silent: true,
    });
    syncStep = "saving profile preferences";
    await pushCloudProfilePreferences({ silent: true, surfaceErrors: true });
    authState.accountNotice = "";
    markCloudSynced();
    setAccountStatus("Synced. This browser is up to date with Brrtz cloud.");
    setSavedSearchTransferStatus("Saved searches are synced with Brrtz cloud.");
  } catch (error) {
    console.error(`Account sync failed while ${syncStep}.`, error);
    const errorMessage = error instanceof Error ? error.message : "Could not sync account data.";
    authState.accountNotice = /^Cannot read properties/i.test(errorMessage)
      ? `Account sync failed while ${syncStep}. ${errorMessage}`
      : errorMessage;
    if (isCloudAuthSessionError(authState.accountNotice)) clearInvalidCloudSession(authState.accountNotice);
    setAccountStatus(authState.accountNotice);
  } finally {
    setCloudSyncButtonsDisabled(false);
  }
}

async function pullCloudProfilePreferences(options = {}) {
  if (!authState.user?.id) return null;

  try {
    const payload = await fetchCloudProfile();
    applyCloudPreferences(payload.preferences || {});
    authState.accountNotice = "";
    markCloudSynced(payload.updatedAt);
    if (!options.silent) setAccountStatus("Profile preferences pulled from cloud.");
    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not pull profile preferences.";
    if (isCloudAuthSessionError(message)) clearInvalidCloudSession(message);
    if (!options.silent) setAccountStatus(message);
    if (options.surfaceErrors) throw error instanceof Error ? error : new Error(message);
    if (options.silent) return null;
    throw error;
  }
}

async function pushCloudProfilePreferences(options = {}) {
  if (!authState.user?.id) return null;

  try {
    const payload = await putCloudProfile({
      app: "Brrtz",
      type: "user-profile",
      schemaVersion: 1,
      user: getCloudSyncUser(),
      preferences: getLocalPreferencePayload(),
    });
    authState.accountNotice = "";
    markCloudSynced(payload.updatedAt);
    if (!options.silent) setAccountStatus("Profile preferences pushed to cloud.");
    return payload;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not push profile preferences.";
    if (isCloudAuthSessionError(message)) clearInvalidCloudSession(message);
    if (!options.silent) setAccountStatus(message);
    if (options.surfaceErrors) throw new Error(message);
    if (options.silent) return null;
    throw error;
  }
}

async function fetchCloudProfile() {
  const response = await fetch("/api/cloud/profile", {
    cache: "no-store",
    headers: await getCloudSyncHeaders(),
  });
  if (!response.ok) throw new Error(await getCloudResponseError(response, "Cloud profile responded with an error."));
  return response.json();
}

async function putCloudProfile(payload) {
  const response = await fetch("/api/cloud/profile", {
    method: "PUT",
    headers: await getCloudSyncHeaders({ "content-type": "application/json" }),
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await getCloudResponseError(response, "Cloud profile responded with an error."));
  return response.json();
}

function applyCloudPreferences(preferences = {}) {
  let applyStep = "normalizing cloud settings";

  try {
    const previousRegionId = sanitizeRegionId(appSettings.regionId);
    const nextSettings = hydrateSettings({
      ...appSettings,
      regionId: preferences.regionId || appSettings.regionId,
      currency: preferences.currency || appSettings.currency,
      jpyPerUsd: preferences.jpyPerUsd || appSettings.jpyPerUsd,
      resultView: preferences.resultView || appSettings.resultView,
      gearMode: typeof preferences.gearMode === "boolean" ? preferences.gearMode : appSettings.gearMode,
    });
    appSettings = nextSettings;
    qualityFilter = appSettings.gearMode ? "clean" : "all";
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
    const regionChanged = previousRegionId !== sanitizeRegionId(appSettings.regionId);

    applyStep = "applying theme";
    if (preferences.theme === "light" || preferences.theme === "dark") {
      setTheme(preferences.theme);
    }

    applyStep = "applying watched listing IDs";
    if (Array.isArray(preferences.watchedListingIds)) {
      saveSet(STORAGE_KEYS.watching, preferences.watchedListingIds);
    }

    applyStep = "applying watched listing ledger";
    if (preferences.watchedListingLedger && typeof preferences.watchedListingLedger === "object") {
      saveLedger({
        ...loadLedger(),
        ...sanitizeListingLedger(preferences.watchedListingLedger),
      });
    }

    applyStep = "applying feedback rules";
    if (preferences.feedbackRules && typeof preferences.feedbackRules === "object") {
      saveFeedbackRules(sanitizeFeedbackRules(preferences.feedbackRules), { skipSync: true });
    }

    applyStep = "repairing runtime collections";
    ensureRuntimeCollections();

    applyStep = "refreshing settings form";
    fillSettingsForm();
    try {
      if (regionChanged) {
        applyStep = "refreshing region view";
        resetRegionRuntimeState();
        currentProfile = createFreshProfile();
        renderSources();
        updateRegionBadge();
        fillForm(currentProfile);
        resetToIdleSearch();
      } else {
        applyStep = "refreshing current results";
        renderRefineSummary();
        renderResults();
      }
    } catch (refreshError) {
      console.warn(`Cloud preferences were applied, but Brrtz could not finish ${applyStep}.`, refreshError);
    }
  } catch (error) {
    throw new Error(`Could not apply cloud profile preferences while ${applyStep}. ${getErrorMessage(error)}`);
  }
}

function ensureRuntimeCollections() {
  if (!(activeViewSources instanceof Set)) activeViewSources = new Set(normalizeStoredList(activeViewSources));
  if (!(pendingSourceIds instanceof Set)) pendingSourceIds = new Set(normalizeStoredList(pendingSourceIds));
  if (!(currentDiscoveryIds instanceof Set)) currentDiscoveryIds = new Set(normalizeStoredList(currentDiscoveryIds));
  if (!(currentNewForSearchIds instanceof Set)) currentNewForSearchIds = new Set(normalizeStoredList(currentNewForSearchIds));
  if (!(sourceSearchStatuses instanceof Map)) sourceSearchStatuses = new Map();
  if (!(sourceSearchMeta instanceof Map)) sourceSearchMeta = new Map();
}

function getLocalPreferencePayload() {
  const watchedListingIds = loadSet(STORAGE_KEYS.watching);
  return {
    regionId: appSettings.regionId,
    currency: appSettings.currency,
    jpyPerUsd: appSettings.jpyPerUsd,
    resultView: appSettings.resultView,
    gearMode: appSettings.gearMode,
    theme: document.body.dataset.theme || "light",
    watchedListingIds,
    watchedListingLedger: getWatchedListingLedger(watchedListingIds),
    feedbackRules: loadFeedbackRules(),
  };
}

function getWatchedListingLedger(watchedListingIds = loadSet(STORAGE_KEYS.watching)) {
  const ledger = loadLedger();
  return normalizeStoredList(watchedListingIds).reduce((selected, id) => {
    if (ledger[id]) selected[id] = ledger[id];
    return selected;
  }, {});
}

function setAccountStatus(message) {
  if (accountStatus) accountStatus.textContent = message;
}

async function ensureSavedSearchCloudPushIsSafe() {
  if (!authState.user?.id) return true;

  const payload = await fetchCloudSavedSearches();
  const cloudProfiles = parseSavedSearchProfilesFromPayload(payload);
  if (cloudProfiles.length === 0) return true;

  const lastSyncedAt = authState.lastSyncedAt || readCloudSyncMeta().lastSyncedAt || "";
  const latestCloudUpdatedAt = getLatestSavedSearchUpdatedAt(cloudProfiles, payload.updatedAt);

  if (!lastSyncedAt) {
    throw new Error("Cloud already has saved searches for this account. Use Sync now to merge before saving local changes.");
  }

  if (isTimestampAfter(latestCloudUpdatedAt, lastSyncedAt, 1000)) {
    throw new Error("Cloud has newer saved-search changes. Use Sync now to merge before saving local changes.");
  }

  return true;
}

function getLatestSavedSearchUpdatedAt(profiles = [], fallback = "") {
  return profiles.reduce((latest, profile) => {
    const candidate = profile.updatedAt || profile.sync?.lastSyncedAt || "";
    return isTimestampAfter(candidate, latest) ? candidate : latest;
  }, fallback || "");
}

function isTimestampAfter(candidate, reference, toleranceMs = 0) {
  const candidateTime = new Date(candidate || 0).getTime();
  const referenceTime = new Date(reference || 0).getTime();
  if (!Number.isFinite(candidateTime) || !Number.isFinite(referenceTime)) return false;
  return candidateTime > referenceTime + toleranceMs;
}

function queueSavedSearchAutoSync(reason = "saved-search-change", options = {}) {
  if (!authState.user?.id) {
    setSavedSearchTransferStatus("Saved locally. Sign in to sync across devices.");
    return;
  }

  clearTimeout(savedSearchAutoSyncTimer);
  setSavedSearchTransferStatus("Auto-sync queued.");
  savedSearchAutoSyncTimer = window.setTimeout(() => {
    runSavedSearchAutoSync(reason, options);
  }, options.delay ?? 1800);
}

async function runSavedSearchAutoSync(reason = "saved-search-change", options = {}) {
  if (isSavedSearchAutoSyncing || !authState.user?.id) return;
  isSavedSearchAutoSyncing = true;

  try {
    await pushCloudSavedSearches({
      auto: true,
      allowEmpty: Boolean(options.allowEmpty),
      checkConflicts: true,
      rethrow: true,
    });
  } catch (error) {
    console.warn(`Saved-search auto-sync failed after ${reason}.`, error);
  } finally {
    isSavedSearchAutoSyncing = false;
  }
}

function queueProfileAutoSync(reason = "profile-preference-change", options = {}) {
  if (!authState.user?.id) return;

  clearTimeout(profileAutoSyncTimer);
  profileAutoSyncTimer = window.setTimeout(() => {
    runProfileAutoSync(reason);
  }, options.delay ?? 1800);
}

async function runProfileAutoSync(reason = "profile-preference-change") {
  if (isProfileAutoSyncing || !authState.user?.id) return;
  isProfileAutoSyncing = true;

  try {
    await pushCloudProfilePreferences({ silent: true, surfaceErrors: true });
  } catch (error) {
    console.warn(`Profile auto-sync failed after ${reason}.`, error);
    authState.accountNotice = error instanceof Error ? error.message : "Cloud profile auto-sync needs attention.";
    renderAccountShell(authState.user);
  } finally {
    isProfileAutoSyncing = false;
  }
}

async function pullCloudSavedSearches(options = {}) {
  if (!options.silent) setSavedSearchTransferStatus("Pulling saved searches from cloud sync...");
  setCloudSyncButtonsDisabled(true);

  try {
    const payload = await fetchCloudSavedSearches();
    const cloudProfiles = parseSavedSearchProfilesFromPayload(payload)
      .map((profile) => prepareCloudProfileForLocal(profile, payload.updatedAt, payload.storage));

    if (cloudProfiles.length === 0) {
      authState.accountNotice = "";
      markCloudSynced(payload.updatedAt);
      if (!options.silent) setSavedSearchTransferStatus("Cloud sync has no saved searches yet.");
      return { count: 0, mergedCount: savedSearchRepository.list().length };
    }

    const importPreview = savedSearchRepository.previewMerge(cloudProfiles, {
      preferNewest: Boolean(options.preferNewest),
    });
    if (importPreview.duplicateCount > 0 && !options.skipConfirm) {
      const confirmed = window.confirm(`Cloud pull will replace ${importPreview.duplicateCount} local saved ${importPreview.duplicateCount === 1 ? "search" : "searches"} with matching cloud versions. Continue?`);
      if (!confirmed) {
        setSavedSearchTransferStatus("Cloud pull canceled.");
        return { count: 0, canceled: true, mergedCount: savedSearchRepository.list().length };
      }
    }

    savedSearchRepository.replaceAll(importPreview.mergedProfiles);
    authState.accountNotice = "";
    markCloudSynced(payload.updatedAt);
    renderAccountShell(authState.user);
    renderSavedSearches();
    updateQuickSaveSearchButton();
    if (!options.silent) {
      setSavedSearchTransferStatus(`Pulled ${cloudProfiles.length} saved ${cloudProfiles.length === 1 ? "search" : "searches"} from cloud sync.`);
    }
    return { count: cloudProfiles.length, mergedCount: importPreview.mergedProfiles.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not pull from cloud sync.";
    authState.accountNotice = message;
    if (isCloudAuthSessionError(message)) clearInvalidCloudSession(message);
    setAccountStatus(message);
    setSavedSearchTransferStatus(message);
    if (options.rethrow) throw error;
  } finally {
    setCloudSyncButtonsDisabled(false);
  }
}

async function pushCloudSavedSearches(options = {}) {
  const localProfiles = savedSearchRepository.list();
  if (localProfiles.length === 0 && !options.allowEmpty) {
    setSavedSearchTransferStatus("No saved searches to push.");
    return;
  }

  if (!options.silent) {
    setSavedSearchTransferStatus(options.auto ? "Auto-syncing saved searches..." : "Pushing saved searches to cloud sync...");
  }
  setCloudSyncButtonsDisabled(true);

  try {
    if (options.checkConflicts) {
      await ensureSavedSearchCloudPushIsSafe({ rethrow: Boolean(options.rethrow) });
    }

    const syncedAt = new Date().toISOString();
    const profiles = localProfiles.map((profile) => prepareLocalProfileForCloud(profile, syncedAt));
    const payload = await putCloudSavedSearches({
      app: "Brrtz",
      type: "saved-searches",
      schemaVersion: SAVED_SEARCH_SCHEMA_VERSION,
      storage: "cloud",
      user: getCloudSyncUser(),
      profiles,
    });
    const syncedProfiles = parseSavedSearchProfilesFromPayload(payload)
      .map((profile) => prepareCloudProfileForLocal(profile, payload.updatedAt, payload.storage));

    authState.accountNotice = "";
    markCloudSynced(payload.updatedAt);
    renderAccountShell(authState.user);

    if (syncedProfiles.length > 0) {
      savedSearchRepository.replaceAll(syncedProfiles);
      renderSavedSearches();
      updateQuickSaveSearchButton();
    }

    if (!options.silent) {
      setSavedSearchTransferStatus(options.auto
        ? `Auto-synced ${profiles.length} saved ${profiles.length === 1 ? "search" : "searches"}.`
        : `Pushed ${profiles.length} saved ${profiles.length === 1 ? "search" : "searches"} to cloud sync.`);
    }
    return { count: profiles.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not push to cloud sync.";
    authState.accountNotice = message;
    if (isCloudAuthSessionError(message)) clearInvalidCloudSession(message);
    setAccountStatus(message);
    setSavedSearchTransferStatus(message);
    if (options.rethrow) throw error;
  } finally {
    setCloudSyncButtonsDisabled(false);
  }
}

async function fetchCloudSavedSearches() {
  const response = await fetch("/api/cloud/saved-searches", {
    cache: "no-store",
    headers: await getCloudSyncHeaders(),
  });
  if (!response.ok) throw new Error(await getCloudResponseError(response, `Cloud emulator responded with ${response.status}.`));
  return response.json();
}

async function putCloudSavedSearches(payload) {
  const response = await fetch("/api/cloud/saved-searches", {
    method: "PUT",
    headers: await getCloudSyncHeaders({ "content-type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(await getCloudResponseError(response, `Cloud emulator responded with ${response.status}.`));
  return response.json();
}

async function getCloudResponseError(response, fallback) {
  try {
    const payload = await response.json();
    return payload.message || payload.error || fallback;
  } catch {
    return fallback;
  }
}

async function getCloudSyncHeaders(headers = {}) {
  if (authState.session?.access_token && authState.config?.enabled) {
    authState.session = await refreshAuthSessionIfNeeded(authState.session);
  }

  return {
    ...headers,
    ...(authState.session?.access_token ? { authorization: `Bearer ${authState.session.access_token}` } : {}),
  };
}

function getCloudSyncUser() {
  if (authState.user?.id) {
    return {
      id: authState.user.id,
      email: authState.user.email || CLOUD_EMULATOR_USER.email,
      name: authState.user.email || CLOUD_EMULATOR_USER.name,
    };
  }

  return CLOUD_EMULATOR_USER;
}

function setCloudSyncButtonsDisabled(disabled) {
  pullCloudSavedSearchesButton.disabled = disabled;
  pushCloudSavedSearchesButton.disabled = disabled;
  if (syncAccountSavedSearchesButton) syncAccountSavedSearchesButton.disabled = disabled;
}

function prepareLocalProfileForCloud(profile, syncedAt = new Date().toISOString()) {
  const cloudUser = getCloudSyncUser();
  return hydrateProfile({
    ...profile,
    userId: cloudUser.id,
    updatedAt: profile.updatedAt || syncedAt,
    sync: {
      ...profile.sync,
      provider: "cloud",
      remoteId: profile.sync?.remoteId || profile.id,
      status: "synced",
      lastSyncedAt: syncedAt,
    },
  });
}

function prepareCloudProfileForLocal(profile, syncedAt = new Date().toISOString(), provider = "cloud") {
  const cloudUser = getCloudSyncUser();
  return hydrateProfile({
    ...profile,
    userId: cloudUser.id,
    sync: {
      ...profile.sync,
      provider: provider || profile.sync?.provider || "cloud",
      remoteId: profile.sync?.remoteId || profile.id,
      status: "synced",
      lastSyncedAt: isIsoTimestamp(syncedAt) ? syncedAt : new Date().toISOString(),
    },
  });
}

function exportSavedSearches() {
  const profiles = savedSearchRepository.list();
  if (profiles.length === 0) {
    setSavedSearchTransferStatus("No saved searches to export.");
    return;
  }

  const payload = savedSearchRepository.createExportPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  const dateSlug = new Date().toISOString().slice(0, 10);
  link.href = objectUrl;
  link.download = `brrtz-saved-searches-${dateSlug}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
  setSavedSearchTransferStatus(`Exported ${profiles.length} saved ${profiles.length === 1 ? "search" : "searches"}.`);
}

async function importSavedSearchesFromFile(event) {
  const [file] = event.target.files || [];
  if (!file) return;

  try {
    const text = await file.text();
    const importedProfiles = parseSavedSearchImport(text);
    if (importedProfiles.length === 0) {
      setSavedSearchTransferStatus("That file did not include saved searches.");
      return;
    }

    const importPreview = savedSearchRepository.previewMerge(importedProfiles);
    const duplicateCount = importPreview.duplicateCount;
    if (duplicateCount > 0) {
      const confirmed = window.confirm(`Import will replace ${duplicateCount} saved ${duplicateCount === 1 ? "search" : "searches"} with the same name. Continue?`);
      if (!confirmed) {
        setSavedSearchTransferStatus("Import canceled.");
        return;
      }
    }

    savedSearchRepository.replaceAll(importPreview.mergedProfiles);
    renderSavedSearches();
    updateQuickSaveSearchButton();
    setSavedSearchTransferStatus(`Imported ${importedProfiles.length} saved ${importedProfiles.length === 1 ? "search" : "searches"}.`);
    queueSavedSearchAutoSync("import-searches", { allowEmpty: true });
  } catch (error) {
    setSavedSearchTransferStatus(error instanceof Error ? error.message : "Could not import saved searches.");
  } finally {
    event.target.value = "";
  }
}

function parseSavedSearchImport(text) {
  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error("That file is not valid JSON.");
  }

  return parseSavedSearchProfilesFromPayload(payload);
}

function parseSavedSearchProfilesFromPayload(payload) {
  const rawProfiles = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.profiles)
      ? payload.profiles
      : [];

  return rawProfiles
    .filter((profile) => profile
      && typeof profile.name === "string"
      && profile.name.trim()
      && Array.isArray(profile.terms)
      && profile.terms.some((term) => typeof term === "string" && term.trim()))
    .map((profile) => hydrateProfile({
      ...profile,
      name: profile.name.trim(),
    }))
    .filter((profile) => profile.name && profile.terms.length > 0);
}

function findMatchingSavedSearch(profiles, candidate) {
  const candidateKeys = new Set(getSavedSearchMergeKeys(candidate));
  return profiles.find((profile) => getSavedSearchMergeKeys(profile).some((key) => candidateKeys.has(key)));
}

function getSavedSearchMergeKeys(profile) {
  return [
    isNonEmptyString(profile?.id) ? `id:${profile.id}` : "",
    isNonEmptyString(profile?.name) ? `name:${normalizeText(profile.name)}` : "",
  ].filter(Boolean);
}

function setSavedSearchTransferStatus(message) {
  if (!savedSearchTransferStatus) return;
  savedSearchTransferStatus.textContent = message;
}

function splitLines(value) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

async function runSearch() {
  const runId = ++searchRunId;
  const profileSnapshot = cloneProfile(currentProfile);
  if (profileSnapshot.terms.length === 0) {
    resetToIdleSearch();
    return;
  }

  const searchGroups = createLiveSearchGroups(profileSnapshot);

  activeViewSources.clear();
  resetPagination();
  clearScheduledSearchResultApply();
  deferredResultsRender = false;
  isSearching = true;
  pendingSourceIds = new Set(searchGroups.filter((group) => group.id !== "mock").map((group) => group.id));
  sourceSearchStatuses = createInitialSourceStatuses(searchGroups);
  sourceSearchMeta = new Map();
  currentResults = [];
  currentDiscoveryIds = new Set();
  currentNewForSearchIds = new Set();
  setActiveTitle(profileSnapshot.name);
  scrollResultsTop();
  searchState = { mode: "searching", message: "Searching", detail: "Checking live sources.", errors: [] };
  updateSearchStatus();
  renderResults();

  if (searchGroups.length > 1) {
    const completedResults = [];
    const searchPromises = searchGroups.map(async (group) => {
      const result = await fetchLiveListings(profileSnapshot, group.sources);
      completedResults.push(result);

      if (runId === searchRunId) {
        pendingSourceIds.delete(group.id);
        updateSourceSearchStatus(group, result);
        scheduleSearchResultApply(profileSnapshot, combineLiveResults(completedResults), false);
      }

      return result;
    });

    const liveResults = await Promise.all(searchPromises);
    if (runId !== searchRunId) return;
    pendingSourceIds.clear();
    scheduleSearchResultApply(profileSnapshot, combineLiveResults(liveResults), true);
    return;
  }

  const liveResult = await fetchLiveListings(profileSnapshot, searchGroups[0]?.sources || profileSnapshot.sources);
  if (runId !== searchRunId) return;
  pendingSourceIds.clear();
  searchGroups.forEach((group) => {
    if (group.id !== "mock") updateSourceSearchStatus(group, liveResult);
  });
  scheduleSearchResultApply(profileSnapshot, liveResult, true);
}

function scheduleSearchResultApply(profile, liveResult, isFinal) {
  deferredSearchApply = {
    profile: cloneProfile(profile),
    liveResult,
    isFinal,
  };
  deferredResultsRender = true;

  if (selectInteractionActive) {
    return;
  }

  if (searchResultApplyTimer) window.clearTimeout(searchResultApplyTimer);
  const delay = isFinal ? 0 : 90;
  searchResultApplyTimer = window.setTimeout(() => {
    searchResultApplyTimer = 0;
    if (selectInteractionActive) return;
    flushDeferredSearchApplyNow();
  }, delay);
}

function applySearchResult(profile, liveResult, isFinal) {
  const searchContext = createSearchContext(profile.terms);
  const useMockListings = liveResult.mode === "mock" || liveResult.mode === "error";
  const listings = useMockListings ? MOCK_LISTINGS : liveResult.listings;

  currentResults = listings
    .filter((listing) => sourceMatchesProfile(listing.source, profile.sources))
    .filter((listing) => profile.maxPrice <= 0 || listing.price <= profile.maxPrice)
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => listingMatchesSearchContext(listing, searchContext))
    .filter((listing) => !profile.excludes.some((term) => termMatches(normalizeText(listing.title), term)))
    .sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
  pruneActiveViewSources();

  const isFinalLiveResult = isFinal && liveResult.mode === "live";
  const discoveryLedger = isFinalLiveResult ? loadLedger() : null;
  currentDiscoveryIds = isFinalLiveResult ? getNewDiscoveryIds(currentResults, discoveryLedger) : new Set();
  currentNewForSearchIds = isFinalLiveResult ? getNewForSearchIds(currentProfile, currentResults, discoveryLedger) : new Set();
  if (isFinalLiveResult) {
    liveResult.detail = appendDiscoveryDetail(liveResult.detail, currentDiscoveryIds.size);
    const scanSummary = {
      lastScannedAt: new Date().toISOString(),
      lastMatchCount: currentResults.length,
      lastNewCount: currentDiscoveryIds.size,
      lastSourceCount: new Set(currentResults.map((listing) => listing.source)).size,
      lastScanStatus: liveResult.errors.length > 0 ? "partial" : "ok",
    };
    currentProfile = hydrateProfile({ ...currentProfile, ...scanSummary });
    const profileForDiscovery = cloneProfile(currentProfile);
    const listingsForDiscovery = currentResults.slice();
    scheduleUiIdleTask(() => {
      recordListingDiscoveries(profileForDiscovery, listingsForDiscovery);
      updateStoredProfileScan(profileForDiscovery, scanSummary);
      renderSavedSearches();
      queueSavedSearchAutoSync("scan-summary", { delay: 4500 });
    }, {
      delay: 900,
      timeout: 10000,
    });
  }

  setActiveTitle(profile.name);
  isSearching = !isFinal;
  searchState = isFinal ? liveResult : createPartialSearchState(liveResult);
  updateSearchStatus();
  renderResults();
}

function resetToIdleSearch() {
  isSearching = false;
  pendingSourceIds = new Set();
  sourceSearchStatuses = new Map();
  sourceSearchMeta = new Map();
  clearScheduledSearchResultApply();
  deferredResultsRender = false;
  currentResults = [];
  currentDiscoveryIds = new Set();
  currentNewForSearchIds = new Set();
  resetPagination();
  setActiveTitle(currentProfile.name);
  searchState = {
    mode: "idle",
    message: "Ready",
    detail: "Enter a search term to start a fresh scan.",
    errors: [],
  };
  updateSearchStatus();
  renderResults();
}

function setActiveTitle(title) {
  document.querySelector("#activeTitle").textContent = title || "Untitled Search";
}

function createLiveSearchGroups(profile) {
  const selectedSources = new Set(profile.sources);
  const groups = [];

  if (selectedSources.has("yahoo-auctions")) {
    groups.push({ id: "yahoo-auctions", sources: ["yahoo-auctions"] });
  }

  if (selectedSources.has("yahoo-fleamarket")) {
    groups.push({ id: "yahoo-fleamarket", sources: ["yahoo-fleamarket"] });
  }

  if (selectedSources.has("digimart")) {
    groups.push({ id: "digimart", sources: ["digimart"] });
  }

  if (selectedSources.has("five-g")) {
    groups.push({ id: "five-g", sources: ["five-g"] });
  }

  if (selectedSources.has("implant4")) {
    groups.push({ id: "implant4", sources: ["implant4"] });
  }

  if (selectedSources.has("reverb")) {
    groups.push({ id: "reverb", sources: ["reverb"] });
  }

  if (selectedSources.has("reverb-us")) {
    groups.push({ id: "reverb-us", sources: ["reverb-us"] });
  }

  if (selectedSources.has("ebay-us")) {
    groups.push({ id: "ebay-us", sources: ["ebay-us"] });
  }

  if (selectedSources.has("sweetwater-used")) {
    groups.push({ id: "sweetwater-used", sources: ["sweetwater-used"] });
  }

  if (selectedSources.has("guitar-center-used")) {
    groups.push({ id: "guitar-center-used", sources: ["guitar-center-used"] });
  }

  if (selectedSources.has("craigslist-sfbay")) {
    groups.push({ id: "craigslist-sfbay", sources: ["craigslist-sfbay"] });
  }

  if (selectedSources.has("craigslist-la")) {
    groups.push({ id: "craigslist-la", sources: ["craigslist-la"] });
  }

  if (selectedSources.has("craigslist-east")) {
    groups.push({ id: "craigslist-east", sources: ["craigslist-east"] });
  }

  ["robotspeak", "mission-synths", "starving-musician", "bananas-at-large", "gelb-music", "main-drag", "rogue-music", "three-wave", "alto-music", "tone-tweakers", "pro-audio-star"].forEach((sourceId) => {
    if (selectedSources.has(sourceId)) {
      groups.push({ id: sourceId, sources: [sourceId] });
    }
  });

  if (selectedSources.has("jimoty")) {
    groups.push({ id: "jimoty", sources: ["jimoty"] });
  }

  if (selectedSources.has("offmall") || selectedSources.has("hardoff")) {
    groups.push({
      id: selectedSources.has("offmall") ? "offmall" : "hardoff",
      sources: ["offmall", "hardoff"].filter((source) => selectedSources.has(source)),
    });
  }

  if (selectedSources.has("mercari")) {
    groups.push({ id: "mercari", sources: ["mercari"] });
  }

  if (selectedSources.has("rakuma")) {
    groups.push({ id: "rakuma", sources: ["rakuma"] });
  }

  return groups.length > 0 ? groups : [{ id: "mock", sources: profile.sources }];
}

function combineLiveResults(results) {
  const listingsById = new Map();
  const errors = [];
  const sourceStats = [];
  const liveSources = [];
  let durationMs = 0;

  results.forEach((result) => {
    (result.listings || []).forEach((listing) => listingsById.set(listing.id, listing));
    errors.push(...(result.errors || []));

    if (result.meta) {
      durationMs = Math.max(durationMs, Number(result.meta.durationMs) || 0);
      sourceStats.push(...(result.meta.sourceStats || []));
      liveSources.push(...(result.meta.liveSources || []));
    }
  });

  const listings = [...listingsById.values()];
  const hasLiveResult = results.some((result) => result.mode === "live");
  const mode = hasLiveResult ? "live" : results.some((result) => result.mode === "error") ? "error" : "mock";
  const meta = {
    searchedAt: new Date().toISOString(),
    durationMs,
    liveSources: [...new Set(liveSources)],
    sourceStats,
  };

  return {
    listings,
    mode,
    message: errors.length > 0 ? "Partial live" : `Live ${createLiveSourceLabel(meta)}`,
    detail: createLiveDetail(listings, meta, errors),
    errors,
    meta,
  };
}

function createPartialSearchState(liveResult) {
  const pendingLabels = [...pendingSourceIds].map(labelForSource);
  const suffix = pendingLabels.length > 0 ? `; waiting on ${pendingLabels.join(", ")}` : "";

  return {
    ...liveResult,
    mode: "searching",
    message: pendingLabels.length > 0 ? `${liveResult.message}; ${pendingLabels.join(", ")} loading` : liveResult.message,
    detail: `${liveResult.detail || ""}${suffix}.`,
  };
}

function createInitialSourceStatuses(searchGroups) {
  const statuses = new Map();

  searchGroups.forEach((group) => {
    if (group.id === "mock") return;
    group.sources.forEach((sourceId) => {
      statuses.set(sourceId, "loading");
    });
  });

  return statuses;
}

function updateSourceSearchStatus(group, result) {
  group.sources.forEach((sourceId) => {
    const sourceStat = result.meta?.sourceStats?.find((item) => item.source === sourceId);
    if (sourceStat) sourceSearchMeta.set(sourceId, sourceStat);
    const state = sourceStat?.status === "manual"
      ? "manual"
      : sourceStat?.status === "parked"
        ? "parked"
        : sourceStat?.status === "pending"
          ? "pending"
      : result.mode === "error"
        ? "error"
        : "complete";
    sourceSearchStatuses.set(sourceId, state);
  });
}

function cloneProfile(profile) {
  return {
    ...profile,
    terms: [...profile.terms],
    excludes: [...profile.excludes],
    sources: [...profile.sources],
    feedback: {
      hiddenTerms: [...(profile.feedback?.hiddenTerms || [])],
      gearIds: [...(profile.feedback?.gearIds || [])],
      noiseIds: [...(profile.feedback?.noiseIds || [])],
    },
  };
}

function scrollResultsTop() {
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      const target = resultGrid || document.querySelector(".content");
      const targetTop = target.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: "auto",
      });
    });
  });
}

function scrollPageTop() {
  const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
  window.scrollTo({ top: 0, behavior });
}

function requestBackToTopVisibilityUpdate() {
  if (backToTopFrame) return;
  backToTopFrame = window.requestAnimationFrame(() => {
    backToTopFrame = 0;
    updateBackToTopVisibility();
  });
}

function updateBackToTopVisibility() {
  backToTopButton.hidden = window.scrollY < 520;
  updateBackToTopPlacement();
}

function requestMobileSearchOverlayUpdate() {
  if (mobileSearchOverlayFrame) return;
  mobileSearchOverlayFrame = window.requestAnimationFrame(() => {
    mobileSearchOverlayFrame = 0;
    updateMobileSearchOverlayVisibility();
  });
}

function updateMobileSearchOverlayVisibility() {
  if (!mobileSearchOverlay) return;

  const isMobile = window.matchMedia?.("(max-width: 720px)").matches ?? window.innerWidth <= 720;
  const searchField = termsInput.closest(".search-terms-field");
  const searchFieldBottom = searchField?.getBoundingClientRect().bottom ?? 0;
  const modalIsOpen = document.body.classList.contains("modal-open");
  const mainSearchIsVisible = searchFieldBottom > 0;

  mobileSearchOverlay.hidden = !isMobile || modalIsOpen || mainSearchIsVisible;

  if (!mobileSearchOverlay.hidden) {
    syncMobileSearchInputFromPrimary();
  }
}

function updateBackToTopPlacement() {
  const paginationRect = paginationControls.getBoundingClientRect();
  const paginationIsVisible = !paginationControls.hidden && paginationRect.top < window.innerHeight && paginationRect.bottom > 0;
  backToTopButton.classList.toggle("is-above-pagination", paginationIsVisible);
}

function getCurrentAlertListings(renderContext = null) {
  return currentResults.filter((listing) => isListingNewToUser(listing, renderContext));
}

function renderResults(options = {}) {
  if (selectInteractionActive && !options.allowDuringSelect) {
    deferredResultsRender = true;
    return;
  }

  browseCardRenderId += 1;
  const renderContext = options.renderContext || createListingRenderContext();
  const watching = renderContext.watching;
  if (filterMode === "watching") {
    renderWatchlistResultsView(watching, renderContext);
    return;
  }
  if (searchState.mode === "idle") {
    if (SHOW_FRESH_FINDS_HOME_SECTION) ensureStarterFreshFindListings();
    if (isBrowseExpanded) {
      renderBrowseExpandedView(watching, renderContext);
      return;
    }
    renderHomeView(watching, renderContext);
    return;
  }

  const featuredHomeResults = [];
  const isShowingFeaturedHome = featuredHomeResults.length > 0;
  const resultSource = isShowingFeaturedHome ? featuredHomeResults : currentResults;
  const visibleResults = getVisibleResults(watching, resultSource, { renderContext });
  const totalPages = getTotalPages(visibleResults.length);
  currentPage = Math.min(currentPage, totalPages);
  const pageResults = paginateResults(visibleResults);

  resultGrid.innerHTML = "";
  resultGrid.classList.toggle("is-featured-home", isShowingFeaturedHome);
  resultGrid.classList.toggle("is-list-view", !isShowingFeaturedHome && appSettings.resultView === "list");
  resultGrid.classList.toggle("is-gallery-view", !isShowingFeaturedHome && appSettings.resultView === "gallery");
  resultGrid.classList.toggle("is-browse-expanded", false);
  resultGrid.classList.toggle("is-gear-browser-frame", false);
  renderSourceFilters(resultSource, { renderContext });
  renderAlertPanel(featuredHomeResults, { renderContext });

  if (visibleResults.length > 0) {
    if (isShowingFeaturedHome) {
      const featuredSection = createFeaturedHomeSection(visibleResults);
      resultGrid.appendChild(featuredSection);
    } else {
      pageResults.forEach((listing) => resultGrid.appendChild(renderListing(listing, { renderContext })));
      renderPendingSourceCards();
    }
  } else if (isSearching) {
    renderPendingSourceCards();
    if (resultGrid.childElementCount === 0) {
      resultGrid.innerHTML = `<div class="empty-state">Searching live sources...</div>`;
    }
  } else if (searchState.mode === "error" && visibleResults.length === 0) {
    resultGrid.innerHTML = `<div class="empty-state"><strong>Live search failed.</strong><span>${searchState.detail}</span></div>`;
  } else if (searchState.mode === "idle") {
    resultGrid.innerHTML = `<div class="empty-state"><strong>Start a fresh search.</strong><span>${searchState.detail}</span></div>`;
  } else if (visibleResults.length === 0) {
    resultGrid.innerHTML = createNoResultsMessage(resultSource);
  }

  renderPagination(visibleResults.length, totalPages);
  renderQualityModeControls();
  renderResultViewControls(isShowingFeaturedHome);
  renderTopWatchingControl();
}

function renderWatchlistResultsView(watching, renderContext = createListingRenderContext()) {
  const watchedListings = getWatchedResultListings(watching, { renderContext });
  const visibleListings = getWatchlistVisibleListings(watchedListings);
  const totalPages = getTotalPages(visibleListings.length);
  currentPage = Math.min(currentPage, totalPages);
  const pageListings = paginateResults(visibleListings);

  resultGrid.innerHTML = "";
  resultGrid.classList.toggle("is-featured-home", false);
  resultGrid.classList.toggle("is-list-view", appSettings.resultView === "list");
  resultGrid.classList.toggle("is-gallery-view", appSettings.resultView === "gallery");
  resultGrid.classList.toggle("is-browse-expanded", false);
  resultGrid.classList.toggle("is-gear-browser-frame", false);
  renderSourceFilters(watchedListings, { renderContext, ignoreQuality: true });
  renderAlertPanel([], { renderContext });

  resultGrid.appendChild(createWatchlistResultsHeader(visibleListings.length, watchedListings.length));

  if (visibleListings.length > 0) {
    pageListings.forEach((listing) => resultGrid.appendChild(renderListing(listing, { renderContext })));
  } else if (watchedListings.length > 0) {
    resultGrid.insertAdjacentHTML("beforeend", `
      <div class="empty-state">
        <strong>Watchlist hidden by source filters.</strong>
        <span>${watchedListings.length} watched ${watchedListings.length === 1 ? "listing is" : "listings are"} saved. Clear the source filter to see the full watchlist.</span>
        <button class="bumpers-secondary-button empty-state-action" type="button" data-result-action="clear-watchlist-source-filters">Show all watched gear</button>
      </div>
    `);
  } else {
    resultGrid.innerHTML = `
      <div class="empty-state">
        <strong>No watched gear yet.</strong>
        <span>Tap a heart on any listing to save it here.</span>
      </div>
    `;
  }

  renderPagination(visibleListings.length, totalPages);
  renderQualityModeControls();
  renderResultViewControls(false);
  renderTopWatchingControl();
}

function createWatchlistResultsHeader(visibleCount, totalCount) {
  const header = document.createElement("section");
  header.className = "browse-expanded-header featured-home-header is-watchlist-header";
  const hiddenCount = Math.max(0, totalCount - visibleCount);
  const detail = hiddenCount > 0
    ? `${visibleCount} of ${totalCount} watched ${totalCount === 1 ? "listing" : "listings"} visible`
    : `${totalCount} watched ${totalCount === 1 ? "listing" : "listings"}`;
  header.innerHTML = `
    <div class="browse-header-copy">
      <div class="browse-title-row">
        <h3><span class="feature-headline-button browse-expanded-headline">Watchlist</span></h3>
      </div>
      <span><span class="browse-category-label">saved gear</span><span class="browse-detail-rest"> has ${escapeHtml(detail)}</span></span>
    </div>
  `;
  return header;
}

function createListingRenderContext() {
  return {
    watching: new Set(loadSet(STORAGE_KEYS.watching)),
    seen: new Set(loadSet(STORAGE_KEYS.seen)),
    feedback: getProfileFeedback(),
    ledger: loadLedger(),
    gearConfidenceCache: new Map(),
  };
}

function createGearQualityContext() {
  return {
    feedback: getProfileFeedback(),
    gearConfidenceCache: new Map(),
  };
}

function getListingCacheKey(listing) {
  return listing?.id || listing?.url || `${listing?.source || "source"}:${listing?.title || ""}:${listing?.price || ""}`;
}

function collectionHas(collection, value) {
  if (!collection) return false;
  if (collection instanceof Set) return collection.has(value);
  if (Array.isArray(collection)) return collection.includes(value);
  return false;
}

function renderHomeView(watching, renderContext = createListingRenderContext()) {
  isBrowseExpanded = false;
  resetBrowseCategoryBrandView();
  const freshFindResults = SHOW_FRESH_FINDS_HOME_SECTION && filterMode !== "watching" ? getFreshFindHomeListings() : [];
  const browseResults = filterMode === "watching" ? [] : getBrowseCategoryHomeListings({ renderContext });
  const watchedHomeResults = getWatchedHomeListings(watching, { renderContext });
  const homeResults = [...browseResults, ...freshFindResults, ...watchedHomeResults];
  const isBrowseLoading = filterMode !== "watching" && browseCategoryStatus === "loading";
  const isShowingFeaturedHome = homeResults.length > 0 || isBrowseLoading;

  resultGrid.innerHTML = "";
  resultGrid.classList.toggle("is-featured-home", isShowingFeaturedHome);
  resultGrid.classList.toggle("is-list-view", false);
  resultGrid.classList.toggle("is-gallery-view", false);
  resultGrid.classList.toggle("is-browse-expanded", false);
  resultGrid.classList.toggle("is-gear-browser-frame", false);
  renderSourceFilters(homeResults, { renderContext });
  renderAlertPanel([], { renderContext });

  if (browseResults.length > 0 || browseCategoryStatus === "loading" || browseCategoryStatus === "error") {
    resultGrid.appendChild(createFeaturedHomeSection(browseResults, { variant: "browse", renderContext }));
    if (filterMode !== "watching") resultGrid.appendChild(createBrandBrowserSection());
  }

  if (SHOW_FRESH_FINDS_HOME_SECTION && freshFindResults.length > 0) {
    resultGrid.appendChild(createFeaturedHomeSection(freshFindResults, { variant: "fresh", renderContext }));
  }

  if (watchedHomeResults.length > 0) {
    resultGrid.appendChild(createFeaturedHomeSection(watchedHomeResults, { variant: "watched", renderContext }));
  }

  if (homeResults.length === 0 && !isBrowseLoading) {
    resultGrid.innerHTML = filterMode === "watching"
      ? `<div class="empty-state"><strong>No watched gear yet.</strong><span>Tap a heart on any listing to save it here.</span></div>`
      : `<div class="empty-state"><strong>Start a fresh search.</strong><span>${searchState.detail}</span></div>`;
  }

  renderPagination(homeResults.length, 1);
  renderQualityModeControls();
  renderResultViewControls(isShowingFeaturedHome);
  renderTopWatchingControl();
}

function createBrandBrowserSection() {
  const section = document.createElement("section");
  section.className = "brand-browser-section";
  section.setAttribute("aria-labelledby", "brandBrowserTitle");

  const cardsMarkup = POPULAR_BRANDS.map((brand) => {
    const imageMarkup = brand.image
      ? `<img src="${escapeHtml(brand.image)}" alt="" loading="lazy" decoding="async" />`
      : `<span>${escapeHtml(getPopularBrandInitials(brand))}</span>`;
    return `
      <a class="brand-browser-card" href="${escapeHtml(createBrandBrowseHref(brand.slug))}" data-result-action="open-brand-browser" data-brand-slug="${escapeHtml(brand.slug)}">
        <span class="brand-browser-avatar" aria-hidden="true">${imageMarkup}</span>
        <span class="brand-browser-name">${escapeHtml(brand.name)}</span>
      </a>
    `;
  }).join("");

  section.innerHTML = `
    <div class="brand-browser-header">
      <h3 id="brandBrowserTitle">Browse by Brand</h3>
      <p>Jump straight into legendary synth makers.</p>
    </div>
    <div class="brand-browser-grid">
      ${cardsMarkup}
    </div>
  `;
  return section;
}

function renderBrowseExpandedView(watching, renderContext = createListingRenderContext()) {
  syncBrowseCategoryBrandView();
  ensureBrowseCategoryListings();
  const allBrowseListings = getBrowseCategoryExpandedListings({ renderContext });
  const activeBrand = getActiveBrowseBrand();
  const browseListings = getBrandFilteredBrowseListings(allBrowseListings);
  const visibleListings = getVisibleResults(watching, browseListings, { renderContext });
  const totalPages = getTotalPages(visibleListings.length);
  currentPage = Math.min(currentPage, totalPages);
  const pageListings = paginateResults(visibleListings);
  const renderId = ++browseCardRenderId;
  const effectiveResultView = activeBrand ? sanitizeResultView(browseBrandResultView) : appSettings.resultView;

  resultGrid.innerHTML = "";
  resultGrid.classList.toggle("is-featured-home", false);
  resultGrid.classList.toggle("is-list-view", effectiveResultView === "list");
  resultGrid.classList.toggle("is-gallery-view", effectiveResultView === "gallery");
  resultGrid.classList.toggle("is-browse-expanded", true);
  resultGrid.classList.toggle("is-gear-browser-frame", true);
  renderSourceFilters(browseListings, { renderContext });
  renderAlertPanel([], { renderContext });

  resultGrid.appendChild(createGearBrowserScene());
  resultGrid.appendChild(createBrowseExpandedHeader(visibleListings.length, browseListings.length));

  if (browseCategoryStatus === "loading") {
    resultGrid.appendChild(createBrowseExpandedLoadingState({ compact: visibleListings.length > 0 }));
  }

  if (visibleListings.length > 0) {
    const preparingLoader = browseCategoryStatus === "loading"
      ? null
      : createBrowseExpandedLoadingState({ compact: true, detail: "Preparing latest cards." });
    if (preparingLoader) resultGrid.appendChild(preparingLoader);
    appendBrowseListingCardsInChunks(pageListings, renderId, { loaderToRemove: preparingLoader, renderContext });
  } else if (browseCategoryStatus !== "loading" && activeBrand) {
    resultGrid.insertAdjacentHTML("beforeend", `
      <div class="empty-state browse-expanded-empty">
        <strong>No listings found for this brand right now.</strong>
        <span>Brrtz is still scanning.</span>
      </div>
    `);
  } else if (browseCategoryStatus !== "loading" && browseListings.length > 0) {
    resultGrid.insertAdjacentHTML("beforeend", createNoResultsMessage(browseListings));
  } else if (browseCategoryStatus !== "loading") {
    resultGrid.insertAdjacentHTML("beforeend", `
      <div class="empty-state browse-expanded-empty">
        <strong>No latest ${escapeHtml(getCategoryIntentLabel(browseCategoryIntent).toLowerCase())} yet.</strong>
        <span>${escapeHtml(browseCategoryError || "Try another category or region.")}</span>
      </div>
    `);
  }

  renderPagination(visibleListings.length, totalPages);
  renderQualityModeControls();
  renderResultViewControls(false, activeBrand ? effectiveResultView : "");
  renderTopWatchingControl();
}

function createBrowseExpandedLoadingState(options = {}) {
  const loadingState = document.createElement("div");
  loadingState.className = "browse-expanded-loader";
  if (options.compact) loadingState.classList.add("browse-refresh-loader");
  loadingState.setAttribute("role", "status");
  loadingState.setAttribute("aria-live", "polite");
  loadingState.innerHTML = `
    <img class="browse-expanded-loader-svg" src="assets/animations/perspective-line-graph-loading-groundplane-wide-v01.svg" alt="" loading="eager" decoding="async" />
    <div class="browse-expanded-loader-copy">
      <strong>${escapeHtml(createBrowseCategoryLoadingLabel())}</strong>
    </div>
  `;
  return loadingState;
}

function createGearBrowserScene() {
  updateGearBrowserSceneAnimationState();
  const isAnimating = browseCategoryStatus === "loading";
  const isFading = !isAnimating && Date.now() < gearBrowserSceneFadeUntil;
  const scene = document.createElement("div");
  scene.className = [
    "gear-browser-scene",
    isAnimating ? "is-animating" : "",
    isFading ? "is-fading" : "",
  ].filter(Boolean).join(" ");
  scene.setAttribute("aria-hidden", "true");
  scene.innerHTML = `
    <img class="gear-browser-scene-static" src="assets/animations/perspective-line-graph-gear-browser-scene-static-v01.svg" alt="" loading="eager" decoding="async" />
    ${isAnimating || isFading ? `<img class="gear-browser-scene-active" src="assets/animations/perspective-line-graph-gear-browser-scene-v01.svg" alt="" loading="eager" decoding="async" />` : ""}
  `;
  return scene;
}

function updateGearBrowserSceneAnimationState() {
  const wasLoading = gearBrowserScenePreviousStatus === "loading";
  const isLoading = browseCategoryStatus === "loading";
  if (wasLoading && !isLoading) {
    gearBrowserSceneFadeUntil = Date.now() + 420;
  }
  if (isLoading) {
    gearBrowserSceneFadeUntil = 0;
  }
  gearBrowserScenePreviousStatus = browseCategoryStatus;
}

function createBrowseCategoryLoadingLabel() {
  const activeBrand = getActiveBrowseBrand();
  if (activeBrand) return `Loading ${activeBrand.name}`;
  return `Loading ${getCategoryIntentLabel(browseCategoryIntent)}`;
}

function appendBrowseListingCardsInChunks(listings, renderId, options = {}) {
  let index = 0;
  const loaderToRemove = options.loaderToRemove || null;
  const renderContext = options.renderContext || createListingRenderContext();

  const appendNextChunk = () => {
    if (renderId !== browseCardRenderId) return;
    if (selectInteractionActive) {
      requestAnimationFrame(appendNextChunk);
      return;
    }
    const fragment = document.createDocumentFragment();
    const end = Math.min(index + BROWSE_CARD_RENDER_CHUNK_SIZE, listings.length);
    for (; index < end; index += 1) {
      fragment.appendChild(renderListing(listings[index], { renderContext }));
    }
    resultGrid.appendChild(fragment);
    loaderToRemove?.remove();
    if (index < listings.length) requestAnimationFrame(appendNextChunk);
  };

  requestAnimationFrame(appendNextChunk);
}

function createBrowseHomeLoadingState() {
  const loadingState = createBrowseExpandedLoadingState();
  loadingState.classList.add("browse-home-loader");
  return loadingState;
}

function createBrowseHomeRefreshLoadingState() {
  const loadingState = createBrowseExpandedLoadingState({ compact: true });
  loadingState.classList.add("browse-home-loader", "browse-home-refresh-loader");
  return loadingState;
}

function handleResultGridAction(event) {
  if (event.type === "change" || event.type === "input") {
    if (event.type === "input" && event.target.closest("select")) return;

    const browseSelect = event.target.closest("#homeBrowseCategory");
    if (browseSelect) {
      scheduleHomeBrowseCategoryChange(browseSelect.value);
    }
    const expandedBrowseSelect = event.target.closest("#expandedBrowseCategory");
    if (expandedBrowseSelect) {
      scheduleHomeBrowseCategoryChange(expandedBrowseSelect.value, { expanded: true });
    }
    const expandedBrandSelect = event.target.closest("#expandedBrowseBrand");
    if (expandedBrandSelect) {
      openBrandBrowseView(expandedBrandSelect.value);
    }
    return;
  }

  const button = event.target.closest("[data-result-action]");
  if (!button) return;

  if (button.dataset.resultAction === "clear-view-filters") {
    clearResultViewFilters();
  }

  if (button.dataset.resultAction === "clear-watchlist-source-filters") {
    activeViewSources.clear();
    resetPagination();
    renderResults({ force: true });
  }

  if (button.dataset.resultAction === "open-browse-expanded") {
    activeBrowseBrandSlug = "";
    browseBrandResultView = "gallery";
    resetBrowseCategoryBrandView();
    isBrowseExpanded = true;
    setAppView(APP_VIEW_SYNTH_BROWSER, { brandSlug: "" });
    resetPagination();
    renderResults();
    scrollResultsTop();
  }

  if (button.dataset.resultAction === "open-brand-browser") {
    event.preventDefault?.();
    openBrandBrowseView(button.dataset.brandSlug, { resetCategory: true });
  }

  if (button.dataset.resultAction === "close-browse-expanded") {
    activeBrowseBrandSlug = "";
    browseBrandResultView = "gallery";
    resetBrowseCategoryBrandView();
    isBrowseExpanded = false;
    setAppView(null);
    resetPagination();
    renderResults();
    scrollResultsTop();
  }
}

function clearResultViewFilters() {
  filterMode = "all";
  qualityFilter = appSettings.gearMode ? "clean" : "all";
  activeViewSources.clear();
  resetPagination();
  if (getCurrentAppView() === APP_VIEW_WATCHLIST) setAppView(null);
  syncFilterModeButtons();
  renderResults();
}

function createNoResultsMessage(baseResults = currentResults) {
  if (filterMode === "watching" && !hasWatchedListings()) {
    return `
      <div class="empty-state">
        <strong>No watched gear yet.</strong>
        <span>Tap a heart on any listing to save it here.</span>
      </div>
    `;
  }

  if (baseResults.length === 0) {
    const constraintSummary = getSearchConstraintSummary();
    return `
      <div class="empty-state">
        <strong>No matching live listings.</strong>
        <span>${searchState.detail || "Try another term or source."}</span>
        ${constraintSummary ? `<span>${constraintSummary}</span>` : ""}
      </div>
    `;
  }

  const blockers = getActiveResultFilterLabels();
  const hiddenDetail = `${baseResults.length} ${baseResults.length === 1 ? "listing was" : "listings were"} returned, but ${blockers.length > 0 ? blockers.join(", ") : "view filters"} hid them in this browser.`;
  return `
    <div class="empty-state">
      <strong>Results hidden by this browser’s view filters.</strong>
      <span>${hiddenDetail}</span>
      <button class="bumpers-secondary-button empty-state-action" type="button" data-result-action="clear-view-filters">Show all returned listings</button>
    </div>
  `;
}

function getActiveResultFilterLabels() {
  const labels = [];
  if (filterMode !== "all") labels.push(`${getResultFilterLabel(filterMode)} view`);
  if (qualityFilter === "clean") labels.push("Gear Mode");
  if (activeViewSources.size > 0) labels.push("source filter");
  return labels;
}

function getSearchConstraintSummary() {
  const parts = [];
  const selectedSources = currentProfile.sources || [];
  if (selectedSources.length > 0 && selectedSources.length < SOURCES.length) {
    parts.push(`${selectedSources.length} selected sources`);
  }
  if ((currentProfile.excludes || []).length > 0) {
    parts.push(`${currentProfile.excludes.length} exclude terms`);
  }
  if (currentProfile.maxPrice > 0) {
    parts.push(`max ${formatPrice(currentProfile.maxPrice)}`);
  }
  if (qualityFilter === "clean") parts.push("Gear Mode");
  if (filterMode !== "all") {
    parts.push(`${getResultFilterLabel(filterMode)} view`);
  }

  return parts.length > 0 ? `This browser is using: ${parts.join(" · ")}.` : "";
}

function capitalize(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function getResultFilterLabel(mode) {
  return {
    new: "New to me",
    fresh: "Fresh",
    maybe: "Maybe",
    watching: "Watching",
  }[mode] || capitalize(mode);
}

function syncFilterModeButtons() {
  document.querySelectorAll("#urgencyFilter button").forEach((item) => {
    item.classList.toggle("active", item.dataset.filter === filterMode);
  });
}

function openWatchlistView(eventOrOptions = {}) {
  const options = eventOrOptions?.currentTarget ? {} : eventOrOptions;
  eventOrOptions?.preventDefault?.();
  eventOrOptions?.stopPropagation?.();
  selectInteractionActive = false;
  clearScheduledSearchResultApply();
  deferredResultsRender = false;
  pendingSourceIds.clear();
  sourceSearchStatuses.clear();
  sourceSearchMeta.clear();
  activeBrowseBrandSlug = "";
  cancelBrowseCategoryLoad();
  resetBrowseCategoryBrandView();
  isBrowseExpanded = false;
  activeViewSources.clear();
  filterMode = "watching";
  resetPagination();
  syncFilterModeButtons();
  setAppView(APP_VIEW_WATCHLIST, { replace: Boolean(options.replace) });
  renderResults({ force: true });
  scrollResultsTop();
  if (!hasWatchedListings()) {
    showStatusToast({
      icon: "♡",
      message: "Tap a heart on any listing to save it to Watching.",
    });
  }
  options.focusTarget?.focus?.();
}

function closeWatchlistView() {
  if (filterMode !== "watching") return;
  filterMode = "all";
  resetPagination();
  syncFilterModeButtons();
  if (getCurrentAppView() === APP_VIEW_WATCHLIST) setAppView(null);
  renderResults();
}

function toggleWatchingFilter() {
  if (filterMode === "watching") {
    closeWatchlistView();
    return;
  }
  openWatchlistView();
}

function renderTopWatchingControl() {
  const isWatching = filterMode === "watching";
  topWatchingFilter.classList.toggle("is-active", isWatching);
  topWatchingFilter.setAttribute("aria-pressed", String(isWatching));
  if (savedWatchingFilter) {
    savedWatchingFilter.classList.toggle("is-active", isWatching);
    savedWatchingFilter.setAttribute("aria-pressed", String(isWatching));
    savedWatchingFilter.textContent = isWatching ? "Show all gear" : "Show watched gear";
  }
  updateMobileBottomNavState();
}

function setQualityMode(mode) {
  qualityFilter = mode === "all" ? "all" : "clean";
  const nextGearMode = qualityFilter === "clean";
  const settingsChanged = appSettings.gearMode !== nextGearMode;
  appSettings = {
    ...appSettings,
    gearMode: nextGearMode,
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  if (gearModeSettingsToggle) gearModeSettingsToggle.checked = nextGearMode;
  clearBrowsePreparedListingsCache();
  resetPagination();
  renderRefineSummary();
  renderResults();
  if (settingsChanged) pushCloudProfilePreferences({ silent: true });
}

function renderQualityModeControls() {
  const isGearMode = qualityFilter === "clean";
  if (gearModeSettingsToggle) gearModeSettingsToggle.checked = isGearMode;
  if (sourceQualityStatus) sourceQualityStatus.hidden = !isGearMode;
  openSourceQualitySettingsButton?.setAttribute("aria-pressed", String(isGearMode));
  qualityModeButtons.forEach((button) => {
    const isActive = button.dataset.quality === qualityFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    if (button.dataset.quality === "clean") button.setAttribute("aria-checked", String(isActive));
  });
}

function setResultView(mode = "grid") {
  const resultView = sanitizeResultView(mode);
  if (isBrowseExpanded && getActiveBrowseBrand()) {
    if (browseBrandResultView === resultView) return;
    browseBrandResultView = resultView;
    renderResults();
    return;
  }

  if (appSettings.resultView === resultView) return;

  appSettings = {
    ...appSettings,
    resultView,
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  renderResults();
  queueProfileAutoSync("result-view");
}

function sanitizeResultView(mode) {
  return RESULT_VIEW_MODES.has(mode) ? mode : "grid";
}

function renderResultViewControls(isShowingFeaturedHome = false, forcedView = "") {
  resultViewButtons.forEach((button) => {
    const activeView = forcedView || appSettings.resultView;
    const isActive = button.dataset.resultView === activeView;
    button.classList.toggle("is-active", isActive);
    button.disabled = isShowingFeaturedHome && !isSearching;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getTotalPages(resultCount) {
  return Math.max(1, Math.ceil(resultCount / RESULTS_PER_PAGE));
}

function paginateResults(results) {
  const start = (currentPage - 1) * RESULTS_PER_PAGE;
  return results.slice(start, start + RESULTS_PER_PAGE);
}

function renderPagination(resultCount, totalPages) {
  paginationControls.hidden = resultCount <= RESULTS_PER_PAGE;

  if (paginationControls.hidden) {
    paginationSummary.textContent = "";
    paginationPage.textContent = "";
    backToTopButton.classList.remove("is-above-pagination");
    return;
  }

  const start = (currentPage - 1) * RESULTS_PER_PAGE + 1;
  const end = Math.min(currentPage * RESULTS_PER_PAGE, resultCount);
  paginationSummary.textContent = `Showing ${start}-${end} of ${resultCount} results`;
  paginationPage.textContent = `Page ${currentPage} of ${totalPages}`;

  const previousButton = paginationControls.querySelector('[data-page-action="prev"]');
  const nextButton = paginationControls.querySelector('[data-page-action="next"]');
  previousButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
  updateBackToTopPlacement();
}

function changePage(action) {
  const renderContext = createListingRenderContext();
  const totalPages = getTotalPages(getPaginationResults(renderContext.watching, { renderContext }).length);
  const nextPage = action === "next" ? currentPage + 1 : currentPage - 1;
  currentPage = Math.max(1, Math.min(nextPage, totalPages));
  renderResults();
  scrollResultsTop();
}

function getPaginationResults(watching = loadSet(STORAGE_KEYS.watching), options = {}) {
  if (filterMode === "watching") {
    return getWatchlistVisibleListings(getWatchedResultListings(watching, options));
  }
  if (searchState.mode === "idle" && isBrowseExpanded) {
    return getVisibleResults(watching, getBrandFilteredBrowseListings(getBrowseCategoryExpandedListings()), options);
  }
  return getVisibleResults(watching, currentResults, options);
}

function resetPagination() {
  currentPage = 1;
}

function renderPendingSourceCards() {
  if (qualityFilter !== "all" && qualityFilter !== "clean") return;

  getPendingSourceIdsForDisplay().forEach((sourceId) => {
    resultGrid.appendChild(createSourceLoadingCard(sourceId));
  });
}

function getPendingSourceIdsForDisplay() {
  return [...pendingSourceIds]
    .filter((sourceId) => activeViewSources.size === 0 || activeViewSources.has(sourceId))
    .sort((a, b) => LIVE_SOURCE_DISPLAY_ORDER.indexOf(a) - LIVE_SOURCE_DISPLAY_ORDER.indexOf(b));
}

function createSourceLoadingCard(sourceId) {
  const source = SOURCES.find((item) => item.id === sourceId) || SOURCES.find((item) => item.id === "offmall");
  const card = document.createElement("article");
  const gradientId = `sourceGradient${loadingCardId}`;
  const maskId = `sourceMask${loadingCardId}`;
  loadingCardId += 1;
  card.className = "listing-card loading-card source-loading-card";
  card.dataset.source = sourceId;
  card.style.setProperty("--loading-accent", getSourceAccent(sourceId));
  card.setAttribute("aria-label", `${source?.label || sourceId} results loading`);
  card.innerHTML = `
    <div class="image-link loading-image" aria-hidden="true">
      <svg class="source-loading-svg" viewBox="0 0 360 270" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradientId}" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stop-color="var(--loading-accent)" stop-opacity="0" />
            <stop offset="48%" stop-color="var(--loading-accent)" stop-opacity="0.28" />
            <stop offset="100%" stop-color="var(--loading-accent)" stop-opacity="0" />
          </linearGradient>
          <mask id="${maskId}">
            <rect x="0" y="0" width="360" height="270" rx="8" fill="white" />
          </mask>
        </defs>
        <g mask="url(#${maskId})">
          <rect width="360" height="270" fill="currentColor" />
          <rect class="source-loading-sweep" x="-220" y="0" width="220" height="270" fill="url(#${gradientId})" />
        </g>
      </svg>
      <span class="source-avatar" data-source="${sourceId}">${source?.icon || sourceId.slice(0, 2).toUpperCase()}</span>
    </div>
    <div class="listing-body loading-body" aria-hidden="true">
      <div class="listing-meta">
        <span class="source-chip">${source?.label || sourceId}</span>
        <span class="loading-line loading-line-short"></span>
      </div>
      <span class="loading-line loading-line-title"></span>
      <span class="loading-line loading-line-title loading-line-title-alt"></span>
      <span class="loading-line loading-line-shop"></span>
      <div class="price-row">
        <span class="loading-line loading-line-price"></span>
        <span class="loading-line loading-line-date"></span>
      </div>
      <div class="card-actions">
        <span class="loading-button"></span>
        <span class="loading-button"></span>
        <span class="loading-button"></span>
        <span class="loading-button"></span>
        <span class="loading-button loading-button-wide"></span>
      </div>
    </div>
  `;
  renderSourceAvatar(card.querySelector(".source-avatar"), source, sourceId);

  return card;
}

function getSourceAccent(sourceId) {
  const randomizedColor = getRandomizedSourceColor(sourceId);
  if (randomizedColor) return randomizedColor.solid;

  const token = SOURCE_ACCENT_TOKENS[sourceId] || "--source-default";
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || "#4b83d8";
}

function createRandomizedSourceColorMap(sourceIds, colors) {
  const shuffledColors = [...colors].sort(() => Math.random() - 0.5);
  return new Map(sourceIds.map((sourceId, index) => [sourceId, shuffledColors[index % shuffledColors.length]]));
}

function getRandomizedSourceColor(sourceId) {
  return RANDOMIZED_BAY_AREA_SOURCE_COLOR_MAP.get(sourceId) || null;
}

function applyRandomizedSourceColor(element, sourceId, options = {}) {
  if (!element) return;
  const color = getRandomizedSourceColor(sourceId);
  if (!color) return;

  element.style.setProperty("--source-solid", color.solid);
  element.style.setProperty("--source-solid-ink", color.ink);
  element.style.setProperty("--source-solid-mark", color.mark);

  if (options.paintAvatar) {
    element.style.background = color.solid;
    element.style.color = color.ink;
  }
}

function getVisibleResults(watching, baseResults = currentResults, options = {}) {
  const renderContext = options.renderContext || null;
  return baseResults
    .filter((listing) => {
      if (filterMode === "new") return isListingMarkedNew(listing, renderContext);
      if (filterMode === "fresh") return isListingFresh(listing, renderContext);
      if (filterMode === "maybe") return formatGearConfidence(listing, renderContext).level === "maybe-gear";
      if (filterMode === "watching") return collectionHas(watching, listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => activeViewSources.size === 0 || activeViewSources.has(listing.source))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, renderContext))
    .sort(compareListings);
}

function renderSourceFilters(baseResults = currentResults, options = {}) {
  const renderContext = options.renderContext || null;
  const counts = getSourceCountsForCurrentView(baseResults, { renderContext });
  const visibleSources = getVisibleSources();
  const sourceOrder = new Map(visibleSources.map((source, index) => [source.id, index]));
  const availableSources = visibleSources
    .filter((source) => !isManualSourceStatus(source.id) && shouldShowSourceFilter(source, counts))
    .sort((first, second) => compareSourceFilterDisplayOrder(first, second, counts, sourceOrder));
  sourceFilterList.innerHTML = "";
  sourceFilterList.classList.toggle("is-expanded", isSourceRowExpanded);
  sourceFilterList.classList.toggle("is-collapsed", !isSourceRowExpanded);
  renderSourceAssistFilters();

  if (availableSources.length === 0) {
    const emptyButton = document.createElement("button");
    emptyButton.className = "source-filter-button source-filter-all is-active";
    emptyButton.type = "button";
    emptyButton.disabled = true;
    emptyButton.textContent = "0 Matches";
    sourceFilterList.appendChild(emptyButton);
    return;
  }

  sourceFilterList.appendChild(createAllSourceFilterButton(createSourceFilterSummary(counts)));

  availableSources.forEach((source) => {
    const status = sourceSearchStatuses.get(source.id);
    const count = counts.get(source.id) || 0;
    const button = document.createElement("button");
    button.className = "source-filter-button source-filter-source";
    button.type = "button";
    button.dataset.source = source.id;
    button.dataset.status = status || "ready";
    button.classList.toggle("is-active", activeViewSources.has(source.id));
    button.classList.toggle("is-loading", status === "loading");
    button.classList.toggle("is-manual", status === "manual");
    button.classList.toggle("is-parked", status === "parked");
    button.classList.toggle("is-pending", status === "pending");
    button.classList.toggle("is-error", status === "error");
    button.classList.toggle("is-zero", status === "complete" && count === 0);
    button.classList.toggle("has-single-digit-count", isSingleDigitSourceCount(count, status));
    applyRandomizedSourceColor(button, source.id);
    button.title = getSourceFilterTitle(source, count, status);
    button.setAttribute("aria-label", getSourceFilterLabel(source, count, status));
    button.setAttribute("aria-pressed", String(activeViewSources.has(source.id)));
    button.innerHTML = `
      <span class="source-avatar source-filter-avatar" data-source="${source.id}"></span>
      <span class="source-count">${formatSourceFilterCount(count, status)}</span>
    `;
    renderSourceAvatar(button.querySelector(".source-filter-avatar"), source, source.id);
    sourceFilterList.appendChild(button);
  });
}

function renderSourceAssistFilters() {
  if (!sourceAssistPanel || !sourceAssistList) return;

  const assistSources = getVisibleSources().filter((source) => isManualSourceStatus(source.id) && getManualSourceUrl(source.id));
  sourceAssistPanel.hidden = assistSources.length === 0;
  sourceAssistList.innerHTML = "";

  assistSources.forEach((source) => {
    const button = document.createElement("button");
    button.className = "source-assist-button";
    button.type = "button";
    button.dataset.source = source.id;
    applyRandomizedSourceColor(button, source.id);
    button.title = `Open prepared ${source.label} search`;
    button.setAttribute("aria-label", `Open prepared ${source.label} search in a new tab`);
    button.innerHTML = `
      <span class="source-avatar source-assist-avatar" data-source="${source.id}"></span>
      <span class="source-assist-label">${source.label}</span>
      <span class="source-assist-arrow" aria-hidden="true">↗</span>
    `;
    renderSourceAvatar(button.querySelector(".source-assist-avatar"), source, source.id);
    sourceAssistList.appendChild(button);
  });
}

function createAllSourceFilterButton(summary) {
  const button = document.createElement("button");
  button.className = "source-filter-button source-filter-all";
  button.type = "button";
  button.dataset.source = "all";
  button.classList.toggle("is-active", activeViewSources.size === 0);
  button.classList.toggle("is-filter-reset", activeViewSources.size > 0);
  button.classList.toggle("is-expanded", isSourceRowExpanded);
  button.setAttribute("aria-pressed", String(activeViewSources.size === 0));
  button.setAttribute("aria-expanded", String(isSourceRowExpanded));
  button.setAttribute("aria-label", getSourceFilterSummaryLabel(summary));
  button.dataset.tooltip = getSourceFilterSummaryTooltip();
  button.title = "";
  button.innerHTML = `
    <span class="source-filter-all-label">${summary.label}</span>
    <span class="source-filter-disclosure" aria-hidden="true"></span>
  `;
  return button;
}

function createSourceFilterSummary(counts) {
  const activeSources = [...activeViewSources].filter((sourceId) => !isManualSourceStatus(sourceId) && (counts.has(sourceId) || sourceSearchStatuses.has(sourceId)));

  if (activeSources.length === 1) {
    const sourceId = activeSources[0];
    const source = SOURCES.find((item) => item.id === sourceId);
    const status = sourceSearchStatuses.get(sourceId);
    const count = counts.get(sourceId) || 0;
    return {
      count,
      label: createSingleSourceSummaryLabel(source, count, status),
      activeSources,
    };
  }

  if (activeSources.length > 1) {
    const count = activeSources.reduce((total, sourceId) => total + (counts.get(sourceId) || 0), 0);
    return {
      count,
      label: `${formatMatchTotal(count)} ${matchLabel(count)}`,
      activeSources,
    };
  }

  const count = [...counts.values()].reduce((total, value) => total + value, 0);
  return {
    count,
    label: `${formatMatchTotal(count)} ${matchLabel(count)}`,
    activeSources: [],
  };
}

function createSingleSourceSummaryLabel(source, count, status) {
  const label = source?.label || "Source";
  if (status === "loading") return `${label} loading`;
  if (status === "manual") return `${label} Assist`;
  if (status === "parked") return `${label} parked`;
  if (status === "pending") return `${label} pending setup`;
  if (status === "error") return `${label} needs attention`;
  return `${formatMatchTotal(count)} ${label} ${matchLabel(count)}`;
}

function formatMatchTotal(count) {
  return String(Math.max(0, count));
}

function matchLabel(count) {
  return count === 1 ? "Match" : "Matches";
}

function getSourceFilterSummaryLabel(summary) {
  if (summary.activeSources.length > 0) {
    return `Show all sources. ${summary.label} currently visible.`;
  }

  return `${isSourceRowExpanded ? "Hide sources" : "See sources"}. ${summary.label}.`;
}

function getSourceFilterSummaryTooltip() {
  if (activeViewSources.size > 0) return "Show all sources";
  return isSourceRowExpanded ? "Hide sources" : "Show sources";
}

function getSourceCountsForCurrentView(baseResults = currentResults, options = {}) {
  const counts = new Map();
  getSourceFilteredBaseResults(baseResults, options).forEach((listing) => {
    counts.set(listing.source, (counts.get(listing.source) || 0) + 1);
  });
  return counts;
}

function shouldShowSourceFilter(source, counts) {
  return counts.get(source.id) > 0 || sourceSearchStatuses.has(source.id);
}

function compareSourceFilterDisplayOrder(first, second, counts, sourceOrder) {
  const firstIsZero = isZeroResultSourceFilter(first.id, counts);
  const secondIsZero = isZeroResultSourceFilter(second.id, counts);
  if (firstIsZero !== secondIsZero) return firstIsZero ? 1 : -1;
  return (sourceOrder.get(first.id) ?? 0) - (sourceOrder.get(second.id) ?? 0);
}

function isZeroResultSourceFilter(sourceId, counts) {
  return sourceSearchStatuses.get(sourceId) === "complete" && (counts.get(sourceId) || 0) === 0;
}

function formatSourceFilterCount(count, status) {
  if (status === "loading") return "…";
  if (status === "manual") return "↗";
  if (status === "parked") return "⏸";
  if (status === "pending") return "…";
  if (status === "error") return "!";
  return count;
}

function isSingleDigitSourceCount(count, status) {
  if (["loading", "manual", "parked", "pending", "error"].includes(status)) return false;
  return Number.isFinite(count) && count > 0 && count < 10;
}

function getSourceFilterTitle(source, count, status) {
  if (status === "loading") return `${source.label} is still searching`;
  if (status === "manual") return `Open ${source.label} search assist`;
  if (status === "parked") return `${source.label} is parked for beta safety`;
  if (status === "pending") return `${source.label} is waiting for API approval`;
  if (status === "error") return `${source.label} search needs attention`;
  if (count === 0) return `${source.label} returned no matches`;
  return `${source.label} results`;
}

function getSourceFilterLabel(source, count, status) {
  if (status === "loading") return `${source.label} search loading`;
  if (status === "manual") return `Open prepared ${source.label} search assist in a new tab`;
  if (status === "parked") return `${source.label} search parked for beta safety`;
  if (status === "pending") return `${source.label} connector waiting for API approval`;
  if (status === "error") return `${source.label} search error`;
  return `Filter to ${source.label} results, ${count} ${count === 1 ? "match" : "matches"}`;
}

function isManualSourceStatus(sourceId) {
  return sourceSearchStatuses.get(sourceId) === "manual";
}

function isNonFilterableSourceStatus(sourceId) {
  return ["pending", "parked"].includes(sourceSearchStatuses.get(sourceId));
}

function openManualSourceSearch(sourceId) {
  const url = getManualSourceUrl(sourceId);
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

function getManualSourceUrl(sourceId) {
  const value = sourceSearchMeta.get(sourceId)?.manualUrl || "";
  return isSafeManualSourceUrl(value) ? value : "";
}

function isSafeManualSourceUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;
    if (url.hostname.endsWith(".craigslist.org") && url.pathname.startsWith("/search/")) return true;
    if (url.hostname === "www.guitarcenter.com" && url.pathname.startsWith("/Used/")) return true;
    if (url.hostname === "www.sweetwater.com" && url.pathname.startsWith("/used/")) return true;
    if (url.hostname === "maindragmusic.com" && (url.pathname.startsWith("/search") || url.pathname.startsWith("/collections/"))) return true;
    if (url.hostname === "www.roguemusic.com") return true;
    if (url.hostname === "threewavemusic.com" && (url.pathname.startsWith("/search") || url.pathname === "/")) return true;
    if (url.hostname === "www.altomusic.com" && url.pathname.startsWith("/search")) return true;
    if (url.hostname === "tonetweakers.com" && (url.pathname.startsWith("/search") || url.pathname.startsWith("/collections/"))) return true;
    if (url.hostname === "www.proaudiostar.com" && url.pathname.startsWith("/catalogsearch/result/")) return true;
    return false;
  } catch {
    return false;
  }
}

function getSourceFilteredBaseResults(baseResults = currentResults, options = {}) {
  const renderContext = options.renderContext || null;
  const watching = renderContext?.watching || loadSet(STORAGE_KEYS.watching);
  const ignoreQuality = options.ignoreQuality === true;
  return baseResults
    .filter((listing) => {
      if (filterMode === "new") return isListingMarkedNew(listing, renderContext);
      if (filterMode === "fresh") return isListingFresh(listing, renderContext);
      if (filterMode === "maybe") return formatGearConfidence(listing, renderContext).level === "maybe-gear";
      if (filterMode === "watching") return collectionHas(watching, listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => ignoreQuality || qualityFilter === "all" || isCleanGearListing(listing, renderContext));
}

function toggleViewSource(sourceId) {
  if (sourceId === "all") {
    activeViewSources.clear();
    return;
  }

  if (activeViewSources.has(sourceId)) {
    activeViewSources.delete(sourceId);
  } else {
    activeViewSources.add(sourceId);
  }
}

function pruneActiveViewSources() {
  const availableSources = new Set(currentResults.map((listing) => listing.source));
  activeViewSources.forEach((sourceId) => {
    if (isManualSourceStatus(sourceId) || isNonFilterableSourceStatus(sourceId)) {
      activeViewSources.delete(sourceId);
      return;
    }
    if (!availableSources.has(sourceId) && !sourceSearchStatuses.has(sourceId)) activeViewSources.delete(sourceId);
  });
}

async function fetchLiveListings(profile, sourceOverride = profile.sources) {
  const sources = sourceOverride.filter((source) => profile.sources.includes(source));
  const hasLiveSource = sources.some((source) => LIVE_SOURCE_IDS.includes(source));

  if (location.protocol === "file:" || !hasLiveSource) {
    return {
      listings: [],
      mode: "mock",
      message: "Ready",
      detail: location.protocol === "file:" ? "Live search needs http://127.0.0.1:5173." : "No live source selected yet.",
      errors: [],
    };
  }

  try {
    const liveSearchTerms = createSearchContext(profile.terms).sourceTerms;
    const params = new URLSearchParams({
      terms: createSourceSearchTerms(liveSearchTerms).join("|"),
      excludes: profile.excludes.join("|"),
      categoryIntent: profile.categoryIntent || getRegionDefaultCategoryIntent(profile.regionId),
      maxPrice: String(profile.maxPrice || 0),
      sources: sources.join("|"),
      region: getActiveRegion().id,
    });
    const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`Search failed with ${response.status}`);
    }

    const payload = await response.json();
    const listings = Array.isArray(payload.listings) ? payload.listings : [];
    const meta = payload.meta || {};
    const liveSources = meta.liveSources || [];
    const sourceLabel = liveSources.map(labelForSource).join(", ") || "live sources";
    const errors = Array.isArray(meta.errors) ? meta.errors : [];

    return {
      listings,
      mode: "live",
      message: errors.length > 0 ? "Partial live" : `Live ${createLiveSourceLabel(meta, sourceLabel)}`,
      detail: createLiveDetail(listings, meta, errors),
      errors,
      meta,
    };
  } catch (error) {
    console.warn("Live search unavailable; falling back to mock listings.", error);
    return {
      listings: [],
      mode: "error",
      message: "Live unavailable",
      detail: error instanceof Error ? error.message : "Unknown live search error",
      errors: [error],
    };
  }
}

function renderListing(listing, options = {}) {
  const fragment = template.content.cloneNode(true);
  const card = fragment.querySelector(".listing-card");
  const imageStage = fragment.querySelector(".image-stage");
  const imageLink = fragment.querySelector(".image-link");
  const image = fragment.querySelector("img");
  const source = SOURCES.find((item) => item.id === listing.source);
  const watchButton = fragment.querySelector(".watch-button");
  const hideSimilarButton = fragment.querySelector(".hide-similar-button");
  const gearButton = fragment.querySelector(".gear-button");
  const noiseButton = fragment.querySelector(".noise-button");
  const openLink = fragment.querySelector(".open-link");
  const moreActionButton = fragment.querySelector(".more-action-button");
  const openMenu = fragment.querySelector(".open-menu");
  const sourceOpenLink = fragment.querySelector(".source-open-link");
  const buyeeOpenLink = fragment.querySelector(".buyee-open-link");
  const copyListingLink = fragment.querySelector(".copy-listing-link");
  const renderContext = options.renderContext || createListingRenderContext();
  const watching = renderContext.watching;
  const feedback = renderContext.feedback;
  const feedbackStatus = getListingFeedbackStatus(listing, feedback);
  const isFeaturedHome = Boolean(options.isFeaturedHome);
  const newness = getListingNewness(listing, renderContext);
  const sourceAvatar = fragment.querySelector(".source-avatar");
  const listSourceAvatar = document.createElement("span");
  listSourceAvatar.className = "source-avatar list-source-avatar";
  card.appendChild(listSourceAvatar);

  if (imageStage && moreActionButton?.parentElement) {
    imageStage.appendChild(moreActionButton.parentElement);
  }

  card.classList.toggle("is-featured-home-card", isFeaturedHome);
  card.classList.toggle("is-new", newness.isNewToUser || newness.isNewForSearch);
  card.classList.toggle("is-new-for-search", newness.isNewForSearch);
  card.classList.toggle("is-feedback-gear", feedbackStatus === "gear");
  card.classList.toggle("is-feedback-noise", feedbackStatus === "noise");
  if (isFeaturedHome) {
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${listing.title}`);
  }
  imageLink.href = listing.url;
  prepareBrandFallbackImage(image, listing, getActiveBrowseBrand());
  image.src = getDisplayListingImage(listing);
  image.alt = listing.title;
  hydrateRenderedRakumaImage(listing, image);
  renderSourceAvatar(sourceAvatar, source, listing.source);
  renderSourceAvatar(listSourceAvatar, source, listing.source);
  renderListingNewnessBadges(fragment, newness);
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector("h3").textContent = listing.title;
  renderShopName(fragment.querySelector(".shop-name"), listing);
  fragment.querySelector(".price-row strong").textContent = listing.priceLabel || formatPrice(listing.price);
  fragment.querySelector(".price-row span").textContent = "";
  openLink.href = listing.url;
  imageLink.addEventListener("click", (event) => handlePrimaryListingOpen(event, listing.url));
  openLink.addEventListener("click", (event) => handlePrimaryListingOpen(event, listing.url));
  sourceOpenLink.href = listing.url;
  sourceOpenLink.textContent = `Open ${source?.label || "listing"}`;
  configureBuyeeLink(buyeeOpenLink, listing);
  watchButton.classList.toggle("is-watching", watching.has(listing.id));
  watchButton.textContent = watching.has(listing.id) ? "♥" : "♡";
  watchButton.setAttribute("aria-label", watching.has(listing.id) ? "Remove from watching" : "Watch listing");
  watchButton.title = watching.has(listing.id) ? "Remove from watching" : "Watch listing";
  gearButton.classList.toggle("is-active", feedbackStatus === "gear");
  noiseButton.classList.toggle("is-active", feedbackStatus === "noise");

  moreActionButton.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpening = openMenu.hidden;
    closeListingActionMenus();
    if (isOpening) {
      openListingActionMenu(openMenu, moreActionButton);
    } else {
      closeListingActionMenu(openMenu);
    }
  });

  openMenu.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  copyListingLink.addEventListener("click", async () => {
    await copyText(listing.url);
    copyListingLink.textContent = "Copied";
    setTimeout(() => {
      copyListingLink.textContent = "Copy URL";
    }, 1200);
  });

  watchButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const next = new Set(loadSet(STORAGE_KEYS.watching));
    if (next.has(listing.id)) {
      next.delete(listing.id);
    } else {
      next.add(listing.id);
      recordListingSnapshot(listing);
      acknowledgeListings([listing], { watched: true });
    }
    saveSet(STORAGE_KEYS.watching, next);
    queueProfileAutoSync("watch-listing");
    renderResults();
  });

  hideSimilarButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveListingFeedback(listing, "hide-similar");
    acknowledgeListings([listing], { dismissed: true });
    renderResults();
  });

  gearButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveListingFeedback(listing, "gear");
    acknowledgeListings([listing]);
    renderResults();
  });

  noiseButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveListingFeedback(listing, "noise");
    acknowledgeListings([listing], { dismissed: true });
    renderResults();
  });

  if (isFeaturedHome) {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      acknowledgeListings([listing], { viewed: true });
      openExternalListing(listing.url);
      renderResults();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      acknowledgeListings([listing], { viewed: true });
      openExternalListing(listing.url);
      renderResults();
    });
  }

  return fragment;
}

function getDisplayListingImage(listing) {
  return normalizeImageFluxListingImage(listing?.image) || listing?.image || "";
}

function prepareBrandFallbackImage(image, listing, brand) {
  if (!image || !brand?.image) return;

  image.addEventListener("load", () => {
    if (image.dataset.brandFallbackApplied === "true") return;
    if (!isWeakListingThumbnail(image)) return;

    image.dataset.brandFallbackApplied = "true";
    image.src = brand.image;
    image.alt = `${brand.name} reference image for ${listing?.title || "listing"}`;
  });
}

function isWeakListingThumbnail(image) {
  const width = image?.naturalWidth || 0;
  const height = image?.naturalHeight || 0;
  if (!width || !height) return false;

  const shortestSide = Math.min(width, height);
  const aspectRatio = width / height;
  return shortestSide < 180 || aspectRatio > 1.75 || aspectRatio < 0.62;
}

function normalizeImageFluxListingImage(imageUrl = "") {
  const url = String(imageUrl || "").trim();
  if (!url.includes(".imageflux.jp/c!/")) return "";

  try {
    const parsed = new URL(url);
    const normalizedPath = parsed.pathname.replace(/^\/c!\/[^/]+/, "");
    return normalizedPath && normalizedPath !== parsed.pathname
      ? `${parsed.origin}${normalizedPath}`
      : "";
  } catch {
    return "";
  }
}

function openExternalListing(url) {
  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (openedWindow) openedWindow.opener = null;
}

function handlePrimaryListingOpen(event, url) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  const listing = currentResults.find((item) => item.url === url);
  if (listing) acknowledgeListings([listing], { viewed: true });
  openExternalListing(url);
  if (listing) renderResults();
}

function renderListingNewnessBadges(fragment, newness) {
  const newPill = fragment.querySelector(".new-pill");

  if (newPill) {
    newPill.textContent = "New";
    newPill.title = getListingNewnessTitle(newness);
  }
}

function configureBuyeeLink(link, listing) {
  const buyeeUrl = createBuyeeUrl(listing);
  if (!buyeeUrl) {
    link.hidden = true;
    link.removeAttribute("href");
    return;
  }

  link.hidden = false;
  link.href = buyeeUrl;
  link.textContent = "View via Buyee";
}

function createBuyeeUrl(listing) {
  if (listing.source !== "yahoo-auctions") return "";

  const auctionId = listing.url.match(/\/jp\/auction\/([^/?#]+)/)?.[1]
    || String(listing.id || "").replace(/^yahoo-auctions-/, "");

  return auctionId ? `https://buyee.jp/item/jdirectitems/auction/${encodeURIComponent(auctionId)}` : "";
}

function closeListingActionMenus() {
  document.querySelectorAll(".open-menu:not([hidden])").forEach((menu) => {
    closeListingActionMenu(menu);
  });
}

function openListingActionMenu(menu, trigger) {
  const host = trigger.closest(".listing-action-menu");
  if (!host) return;

  menu.__brrtzMenuHost = host;
  menu.__brrtzMenuTrigger = trigger;
  document.body.appendChild(menu);
  menu.classList.add("is-floating");
  menu.hidden = false;
  trigger.setAttribute("aria-expanded", "true");
  positionListingActionMenu(menu, trigger);
}

function closeListingActionMenu(menu) {
  menu.hidden = true;
  menu.classList.remove("is-floating");
  menu.style.removeProperty("top");
  menu.style.removeProperty("right");
  menu.style.removeProperty("bottom");
  menu.style.removeProperty("left");
  menu.__brrtzMenuTrigger?.setAttribute("aria-expanded", "false");
  if (menu.__brrtzMenuHost && menu.parentElement !== menu.__brrtzMenuHost) {
    menu.__brrtzMenuHost.appendChild(menu);
  }
}

function positionListingActionMenu(menu, trigger) {
  const spacing = 8;
  const viewportPadding = 12;
  const triggerRect = trigger.getBoundingClientRect();
  const menuRect = menu.getBoundingClientRect();
  const maxLeft = window.innerWidth - menuRect.width - viewportPadding;
  const preferredLeft = triggerRect.left;
  const left = Math.max(viewportPadding, Math.min(preferredLeft, maxLeft));
  const preferredTop = triggerRect.top - menuRect.height - spacing;
  const fallbackTop = triggerRect.bottom + spacing;
  const top = preferredTop >= viewportPadding
    ? preferredTop
    : Math.min(fallbackTop, window.innerHeight - menuRect.height - viewportPadding);

  menu.style.left = `${Math.round(left)}px`;
  menu.style.top = `${Math.round(Math.max(viewportPadding, top))}px`;
}

async function hydrateRenderedRakumaImage(listing, imageElement) {
  if (listing.source !== "rakuma" || !isPlaceholderImage(listing.image) || !listing.url) return;

  try {
    const image = await fetchRakumaThumbnailForListing(listing.url);
    if (!image) return;
    listing.image = image;
    imageElement.src = image;
  } catch {
    // Keep the source placeholder when Rakuma does not provide a usable thumbnail.
  }
}

async function fetchRakumaThumbnailForListing(url) {
  if (rakumaClientThumbnailCache.has(url)) return rakumaClientThumbnailCache.get(url);

  const params = new URLSearchParams({ url });
  const response = await fetch(`/api/rakuma-thumbnail?${params.toString()}`, { cache: "no-store" });
  if (!response.ok) return "";

  const payload = await response.json();
  const image = typeof payload.image === "string" ? payload.image : "";
  rakumaClientThumbnailCache.set(url, image);
  return image;
}

function isPlaceholderImage(image) {
  return !image || image.startsWith("data:image/svg+xml");
}

function renderAlertPanel(featuredHomeResults = [], options = {}) {
  if (searchState.mode === "idle") {
    alertPanel.hidden = true;
    alertPanel.classList.remove("is-featured-home");
    alertList.innerHTML = "";
    alertCount.textContent = "0";
    alertDetail.textContent = "No scan yet";
    return;
  }

  alertPanel.classList.remove("is-featured-home");
  alertTitle.textContent = "New to You";
  const renderContext = options.renderContext || createListingRenderContext();
  const alertListings = getCurrentAlertListings(renderContext).filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, renderContext));
  alertList.innerHTML = "";
  alertCount.textContent = alertListings.length;
  alertDetail.textContent = createAlertDetail(alertListings.length);

  if (isSearching || searchState.mode === "idle" || alertListings.length === 0) {
    alertPanel.hidden = true;
    return;
  }

  alertPanel.hidden = false;
  alertListings.slice(0, 6).forEach((listing) => {
    alertList.appendChild(renderAlertItem(listing));
  });
}

function renderAlertItem(listing, options = {}) {
  const fragment = alertTemplate.content.cloneNode(true);
  const item = fragment.querySelector(".alert-item");
  const source = SOURCES.find((item) => item.id === listing.source);
  const imageLink = fragment.querySelector(".alert-thumb");
  const image = fragment.querySelector("img");
  const openLink = fragment.querySelector(".alert-open");
  const isFeaturedHome = Boolean(options.isFeaturedHome);

  item.classList.toggle("is-featured-home-item", isFeaturedHome);
  if (isFeaturedHome) {
    item.tabIndex = 0;
    item.setAttribute("role", "link");
    item.setAttribute("aria-label", `Open ${listing.title}`);
  }
  imageLink.href = listing.url;
  image.src = listing.image;
  image.alt = listing.title;
  hydrateRenderedRakumaImage(listing, image);
  renderSourceAvatar(fragment.querySelector(".source-avatar"), source, listing.source);
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector(".alert-price").textContent = formatPrice(listing.price);
  fragment.querySelector("h4").textContent = listing.title;
  openLink.href = listing.url;
  imageLink.addEventListener("click", (event) => handlePrimaryListingOpen(event, listing.url));
  openLink.addEventListener("click", (event) => handlePrimaryListingOpen(event, listing.url));

  if (isFeaturedHome) {
    item.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      acknowledgeListings([listing], { viewed: true });
      openExternalListing(listing.url);
      renderResults();
    });
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      acknowledgeListings([listing], { viewed: true });
      openExternalListing(listing.url);
      renderResults();
    });
  }

  return fragment;
}

function createAlertDetail(count) {
  if (isSearching) return "Scanning now";
  if (searchState.mode === "idle") return "No scan yet";
  if (searchState.mode !== "live") return searchState.message;
  if (count === 1) return "1 unseen listing";
  return `${count} unseen listings`;
}

function createBrowseCategoryDetailMarkup(options = {}) {
  const {
    count = 0,
    freshness = "",
    loading = false,
    error = "",
  } = options;
  const categoryLabel = getCategoryIntentLabel(browseCategoryIntent).toLowerCase();
  const categoryTitle = getCategoryIntentLabel(browseCategoryIntent);

  if (loading) {
    return `<span class="browse-detail-rest browse-loading-detail">Searching the expanse for ${escapeHtml(categoryTitle)}</span>`;
  }

  if (error) {
    return escapeHtml(error);
  }

  return `<span class="browse-category-label">${escapeHtml(categoryLabel)}</span><span class="browse-detail-rest"> has ${escapeHtml(`${count} new ${count === 1 ? "listing" : "listings"}`)}</span>`;
}

function createBrowseHeadlineLoadingMarkup() {
  return "";
}

function createFeaturedHomeHeader(count, options = {}) {
  const header = document.createElement("div");
  header.className = "featured-home-header";
  const isStarter = Boolean(options.isStarter);
  const isStarterLive = Boolean(options.isStarterLive);
  const isStarterLoading = Boolean(options.isStarterLoading);
  const variant = options.variant || "fresh";
  const isWatched = variant === "watched";
  const isBrowse = variant === "browse";
  const isCached = Boolean(options.isCached);
  const isBrowseCached = Boolean(options.isBrowseCached);
  const browseCacheUpdatedAt = options.browseCacheUpdatedAt || "";
  const seedLabel = starterFreshFindTerms.length > 0 ? starterFreshFindTerms.join(" + ") : "vintage synths";
  if (isBrowse) {
    header.classList.add("is-browse-header");
    const optionsMarkup = BROWSE_CATEGORY_INTENTS.map((intent) => `
      <option value="${escapeHtml(intent.id)}" ${intent.id === browseCategoryIntent ? "selected" : ""}>${escapeHtml(intent.label)}</option>
    `).join("");
    const browseFreshness = formatBrowseFreshnessDetail(browseCacheUpdatedAt);
    const browseDetailMarkup = createBrowseCategoryDetailMarkup({
      count,
      freshness: browseFreshness,
      loading: browseCategoryStatus === "loading",
      error: browseCategoryStatus === "error" ? browseCategoryError || "Browse mode is warming up" : "",
    });
    const browseHeadlineLoadingMarkup = createBrowseHeadlineLoadingMarkup();
    header.innerHTML = `
      <div class="browse-header-copy">
        <div class="browse-title-row">
          <h3><button class="feature-headline-button" type="button" data-result-action="open-browse-expanded">Gear <span class="browse-title-mobile-break">Scanner</span></button>${browseHeadlineLoadingMarkup}</h3>
          <div class="browse-header-actions">
            <label class="browse-category-control">
              <span>Browse</span>
              <select id="homeBrowseCategory" aria-label="Browse category">${optionsMarkup}</select>
            </label>
            <button class="browse-view-all-button" type="button" data-result-action="open-browse-expanded">See All</button>
          </div>
        </div>
        <span>${browseDetailMarkup}</span>
      </div>
    `;
    return header;
  }

  header.innerHTML = `
    <h3>${isWatched ? "Watched Gear" : "Fresh Finds"}</h3>
    <span>${isWatched
      ? `${count} watched ${count === 1 ? "listing" : "listings"} saved to your profile`
      : isCached && starterFreshFindStatus === "loading"
        ? "Fresh picks are updating now"
      : isCached
        ? "Recently spotted synth finds"
      : isStarterLive
      ? `${count} live ${count === 1 ? "listing" : "listings"} from ${seedLabel}`
      : isStarterLoading
        ? `Scanning latest vintage synth listings for ${seedLabel}`
        : isStarter
          ? "Vintage synth portals to get you digging right away"
          : `${count} curated ${count === 1 ? "listing" : "listings"} from the latest scans`
    }</span>
  `;
  return header;
}

function createBrowseExpandedHeader(visibleCount, totalCount) {
  const header = document.createElement("section");
  header.className = "browse-expanded-header featured-home-header is-browse-header";
  const activeBrand = getActiveBrowseBrand();
  if (activeBrand) {
    header.classList.add("is-brand-browse-header");
    const brandOptionsMarkup = POPULAR_BRANDS.map((brand) => `
      <option value="${escapeHtml(brand.slug)}" ${brand.slug === activeBrand.slug ? "selected" : ""}>${escapeHtml(brand.name)}</option>
    `).join("");
    const brandDetailMarkup = browseCategoryStatus === "loading"
      ? `<span class="browse-detail-rest browse-loading-detail">Searching the expanse for ${escapeHtml(activeBrand.name)}</span>`
      : browseCategoryStatus === "error"
        ? escapeHtml(browseCategoryError || "Brand browser is warming up")
        : `<span class="browse-category-label">${escapeHtml(activeBrand.name)}</span><span class="browse-detail-rest"> has ${escapeHtml(`${visibleCount} curated ${visibleCount === 1 ? "listing" : "listings"}`)}</span>`;

    header.innerHTML = `
      <div class="browse-header-copy">
        <div class="browse-title-row">
          <h3><span class="feature-headline-button browse-expanded-headline">${escapeHtml(activeBrand.name)}</span></h3>
          <div class="browse-header-actions">
            <label class="browse-category-control browse-brand-control">
              <span>Brand</span>
              <select id="expandedBrowseBrand" aria-label="Browse brand">${brandOptionsMarkup}</select>
            </label>
          </div>
        </div>
        <span>${brandDetailMarkup}</span>
      </div>
    `;
    return header;
  }

  const optionsMarkup = BROWSE_CATEGORY_INTENTS.map((intent) => `
    <option value="${escapeHtml(intent.id)}" ${intent.id === browseCategoryIntent ? "selected" : ""}>${escapeHtml(intent.label)}</option>
  `).join("");
  const freshness = formatBrowseFreshnessDetail(getBrowseCategoryFreshness());
  const browseDetailMarkup = createBrowseCategoryDetailMarkup({
    count: visibleCount,
    freshness,
    loading: browseCategoryStatus === "loading",
    error: browseCategoryStatus === "error" ? browseCategoryError || "Browse mode is warming up" : "",
  });
  const browseHeadlineLoadingMarkup = createBrowseHeadlineLoadingMarkup();

  header.innerHTML = `
    <div class="browse-header-copy">
      <div class="browse-title-row">
        <h3><span class="feature-headline-button browse-expanded-headline">Gear <span class="browse-title-mobile-break">Scanner</span></span>${browseHeadlineLoadingMarkup}</h3>
        <div class="browse-header-actions">
          <label class="browse-category-control">
            <span>Browse</span>
            <select id="expandedBrowseCategory" aria-label="Browse category">${optionsMarkup}</select>
          </label>
        </div>
      </div>
      <span>${browseDetailMarkup}</span>
    </div>
  `;
  return header;
}

function createFeaturedHomeSection(listings, options = {}) {
  const isStarter = listings.some((listing) => listing.isStarterFreshFind);
  const isStarterLive = listings.some((listing) => listing.isStarterLiveFreshFind);
  const isStarterLoading = isStarter && starterFreshFindStatus === "loading";
  const isCached = listings.some((listing) => listing.isFreshFindCached);
  const variant = options.variant || "fresh";
  const renderContext = options.renderContext || createListingRenderContext();
  const isBrowseCached = listings.some((listing) => listing.isBrowseCategoryCached);
  const browseCacheUpdatedAt = listings.find((listing) => listing.browseCategoryCachedAt)?.browseCategoryCachedAt || (variant === "browse" ? browseCategoryUpdatedAt : "");
  const section = document.createElement("section");
  section.className = [
    "featured-home-section",
    variant === "browse" ? "is-gear-browser-frame" : "",
    variant === "watched" ? "is-watched-gear" : "",
    isStarter ? "is-starter-fresh-finds" : "",
    isStarterLive ? "is-live-starter-fresh-finds" : "",
    isStarterLoading ? "is-loading-starter-fresh-finds" : "",
  ].filter(Boolean).join(" ");
  section.setAttribute("aria-label", variant === "watched" ? "Watched Gear" : variant === "browse" ? "Gear Scanner" : "Fresh Finds");
  if (variant === "browse") section.appendChild(createGearBrowserScene());
  section.appendChild(createFeaturedHomeHeader(listings.length, { isStarter, isStarterLive, isStarterLoading, isCached, isBrowseCached, browseCacheUpdatedAt, variant }));

  if (variant === "browse" && browseCategoryStatus === "loading") {
    section.appendChild(listings.length > 0 ? createBrowseHomeRefreshLoadingState() : createBrowseHomeLoadingState());
    if (listings.length === 0) return section;
  }

  if (variant === "browse") {
    const preview = document.createElement("div");
    preview.className = "gear-browser-preview";

    const carousel = document.createElement("div");
    carousel.className = "featured-home-carousel gear-browser-double-carousel";

    const previousButton = document.createElement("button");
    previousButton.className = "featured-carousel-control featured-carousel-control-prev";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Show previous Gear Scanner listings");

    const rail = document.createElement("div");
    rail.className = "featured-home-rail gear-browser-double-rail";
    listings.slice(0, BROWSE_HOME_LIMIT).forEach((listing) => {
      if (listing.isFreshFindLoading) {
        rail.appendChild(createFeaturedHomeLoadingCard(listing));
        return;
      }

      const listingFragment = renderListing(listing, { isFeaturedHome: false, renderContext });
      const card = listingFragment.querySelector(".listing-card");
      card?.classList.add("is-browse-home-card");
      rail.appendChild(listingFragment);
    });

    const nextButton = document.createElement("button");
    nextButton.className = "featured-carousel-control featured-carousel-control-next";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Show more Gear Scanner listings");

    carousel.append(previousButton, rail, nextButton);

    const seeAllLink = document.createElement("button");
    seeAllLink.className = "gear-browser-see-all-link";
    seeAllLink.type = "button";
    seeAllLink.dataset.resultAction = "open-browse-expanded";
    seeAllLink.textContent = "See All";

    preview.append(carousel, seeAllLink);
    section.appendChild(preview);
    setupFeaturedHomeCarousel(rail, previousButton, nextButton);
    return section;
  }

  const carousel = document.createElement("div");
  carousel.className = "featured-home-carousel";
  const previousButton = document.createElement("button");
  previousButton.className = "featured-carousel-control featured-carousel-control-prev";
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", variant === "watched" ? "Show previous Watched Gear" : variant === "browse" ? "Show previous Gear Scanner listings" : "Show previous Fresh Finds");

  const rail = document.createElement("div");
  rail.className = "featured-home-rail";
  listings.forEach((listing) => {
    if (listing.isFreshFindLoading) {
      rail.appendChild(createFeaturedHomeLoadingCard(listing));
      return;
    }

    const listingFragment = renderListing(listing, { isFeaturedHome: variant !== "browse", renderContext });
    const card = listingFragment.querySelector(".listing-card");
    if (variant === "watched") card?.classList.add("is-watched-home-card");
    if (variant === "browse") card?.classList.add("is-browse-home-card");
    rail.appendChild(listingFragment);
  });
  if (variant === "browse") {
    const endcap = document.createElement("span");
    endcap.className = "featured-home-rail-endcap";
    endcap.setAttribute("aria-hidden", "true");
    rail.appendChild(endcap);
  }

  const nextButton = document.createElement("button");
  nextButton.className = "featured-carousel-control featured-carousel-control-next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", variant === "watched" ? "Show more Watched Gear" : variant === "browse" ? "Show more Gear Scanner listings" : "Show more Fresh Finds");

  carousel.append(previousButton, rail, nextButton);
  section.appendChild(carousel);
  setupFeaturedHomeCarousel(rail, previousButton, nextButton);

  return section;
}

function createFeaturedHomeLoadingCard(listing) {
  const isBrowseLoading = Boolean(listing.isBrowseCategoryLoading);
  const card = document.createElement("article");
  card.className = [
    "listing-card",
    "loading-card",
    "featured-home-loading-card",
    "is-featured-home-card",
    isBrowseLoading ? "is-browse-home-card is-browse-loading-card" : "",
  ].filter(Boolean).join(" ");
  card.style.setProperty("--loading-accent", "#0072ff");
  card.setAttribute("aria-label", listing.title || (isBrowseLoading ? "Gear Scanner loading" : "Fresh Finds loading"));
  const loadingImageMarkup = isBrowseLoading
    ? `<img class="gear-browser-loader-svg" src="assets/animations/perspective-line-graph-loading-groundplane-wide-v01.svg" alt="" loading="eager" decoding="async" />`
    : `<span class="featured-home-loading-sweep"></span>`;
  const loadingCopyMarkup = isBrowseLoading
    ? `
        <div class="gear-browser-loader-copy">
          <strong>${escapeHtml(createBrowseCategoryLoadingLabel())}</strong>
        </div>
      `
    : "";
  card.innerHTML = `
    <div class="image-stage" aria-hidden="true">
      <div class="image-link loading-image featured-home-loading-image">
        ${loadingImageMarkup}
        ${loadingCopyMarkup}
      </div>
    </div>
    <span class="new-pill">New</span>
    <div class="listing-body loading-body" aria-hidden="true">
      <span class="loading-line loading-line-title"></span>
      <span class="loading-line loading-line-title loading-line-title-alt"></span>
      <span class="loading-line loading-line-price"></span>
    </div>
  `;
  return card;
}

function setupFeaturedHomeCarousel(rail, previousButton, nextButton) {
  const scrollByPage = (direction) => {
    const distance = Math.max(rail.clientWidth * 0.82, 260);
    rail.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  const updateControls = () => {
    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const hasOverflow = maxScroll > 8;
    const isAtEnd = hasOverflow && rail.scrollLeft >= maxScroll - 8;
    previousButton.hidden = !hasOverflow;
    nextButton.hidden = !hasOverflow;
    previousButton.disabled = rail.scrollLeft <= 8;
    nextButton.disabled = isAtEnd;
  };

  previousButton.addEventListener("click", () => scrollByPage(-1));
  nextButton.addEventListener("click", () => scrollByPage(1));
  rail.addEventListener("scroll", updateControls, { passive: true });
  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateControls);
    resizeObserver.observe(rail);
  }
  requestAnimationFrame(updateControls);
}

function getFreshFindHomeListings() {
  if (starterFreshFindListings.length > 0) return curateFreshFindListings(starterFreshFindListings);
  const cachedListings = getCachedFreshFindListings();
  if (cachedListings.length > 0) return cachedListings;
  if (starterFreshFindStatus === "loading") return createFreshFindLoadingPlaceholders();
  return getStarterFreshFindFallbackListings();
}

function getBrowseCategoryHomeListings(options = {}) {
  const renderContext = options.renderContext || null;
  ensureBrowseCategoryListings();
  if (browseCategoryListings.length > 0) {
    const preparedCache = getBrowsePreparedListingsCache(browseCategoryListings, renderContext);
    if (!preparedCache.home) {
      preparedCache.home = getActiveBrowseBrand()
        ? prepareBrandBrowseListings(browseCategoryListings, { limit: BROWSE_HOME_LIMIT, renderContext })
        : getCuratedGearScannerListings(browseCategoryListings, {
          limit: BROWSE_HOME_LIMIT,
          candidateLimit: BROWSE_HOME_CURATION_CANDIDATE_LIMIT,
          renderContext,
        });
    }
    return preparedCache.home;
  }
  const cachedListings = getCachedBrowseCategoryListings(browseCategoryIntent, { limit: BROWSE_HOME_LIMIT, renderContext });
  if (cachedListings.length > 0) return cachedListings;
  return [];
}

function getBrowseCategoryExpandedListings(options = {}) {
  const renderContext = options.renderContext || null;
  ensureBrowseCategoryListings();
  if (browseCategoryListings.length > 0) {
    const preparedCache = getBrowsePreparedListingsCache(browseCategoryListings, renderContext);
    if (!preparedCache.expanded) {
      preparedCache.expanded = getActiveBrowseBrand()
        ? prepareBrandBrowseListings(browseCategoryListings, { limit: BROWSE_EXPANDED_LIMIT, renderContext })
        : prepareLatestBrowseListings(browseCategoryListings, { limit: BROWSE_EXPANDED_LIMIT, renderContext });
    }
    return preparedCache.expanded;
  }

  const cachedListings = getCachedBrowseCategoryListings(browseCategoryIntent, { limit: BROWSE_EXPANDED_LIMIT, latest: true, renderContext });
  if (cachedListings.length > 0) return cachedListings;
  return [];
}

function getBrowsePreparedListingsCache(listings, renderContext = null) {
  const signature = [
    appSettings.regionId,
    browseCategoryIntent,
    browseCategoryBrandSlug,
    qualityFilter,
    listings.length,
    listings[0]?.id || listings[0]?.url || "",
    listings.at(-1)?.id || listings.at(-1)?.url || "",
  ].join("|");

  if (!browsePreparedListingsCache || browsePreparedListingsCache.signature !== signature) {
    browsePreparedListingsCache = {
      signature,
      home: null,
      expanded: null,
      renderContext,
    };
  }

  return browsePreparedListingsCache;
}

function clearBrowsePreparedListingsCache() {
  browsePreparedListingsCache = null;
}

function ensureBrowseCategoryListings() {
  if (browseCategoryStatus !== "idle") return;
  if (location.protocol === "file:") return;

  const requestedCategoryIntent = browseCategoryIntent;
  const requestId = browseCategoryRequestId + 1;
  const abortController = new AbortController();
  if (browseCategoryAbortController) browseCategoryAbortController.abort();
  browseCategoryAbortController = abortController;
  browseCategoryRequestId = requestId;
  browseCategoryStatus = "loading";
  browseCategoryError = "";
  browseCategoryBrandSlug = activeBrowseBrandSlug ? sanitizePopularBrandSlug(activeBrowseBrandSlug) : "";

  fetchBrowseCategoryListings(requestedCategoryIntent, { signal: abortController.signal })
    .then((listings) => {
      if (requestId !== browseCategoryRequestId || requestedCategoryIntent !== browseCategoryIntent) return;
      browseCategoryListings = listings;
      clearBrowsePreparedListingsCache();
      browseCategoryStatus = listings.length > 0 ? "live" : "empty";
      if (searchState.mode === "idle") {
        requestAnimationFrame(() => {
          if (requestId !== browseCategoryRequestId || requestedCategoryIntent !== browseCategoryIntent) return;
          renderResults({ force: true });
          scheduleBrowseCategoryPostLoadWork(requestedCategoryIntent, listings);
        });
      } else {
        scheduleBrowseCategoryPostLoadWork(requestedCategoryIntent, listings);
      }
    })
    .catch((error) => {
      if (requestId !== browseCategoryRequestId || requestedCategoryIntent !== browseCategoryIntent) return;
      if (error?.name === "AbortError") return;
      console.warn("Gear Browser unavailable.", error);
      browseCategoryError = error instanceof Error ? error.message : "Browse category unavailable";
      browseCategoryStatus = "error";
      if (searchState.mode === "idle") renderResults();
    })
    .finally(() => {
      if (requestId === browseCategoryRequestId && browseCategoryAbortController === abortController) {
        browseCategoryAbortController = null;
      }
    });
}

async function fetchBrowseCategoryListings(categoryIntent, options = {}) {
  const activeBrand = getActiveBrowseBrand();
  const brandRecipe = getPopularBrandRecipe(activeBrand);
  if (activeBrand && brandRecipe) {
    return fetchBrandBrowseListings(activeBrand, brandRecipe, categoryIntent, options);
  }

  const params = new URLSearchParams({
    categoryIntent: sanitizeCategoryIntent(categoryIntent, appSettings.regionId),
    region: getActiveRegion().id,
    excludes: STARTER_FRESH_FIND_EXCLUDES.join("|"),
    maxPrice: "0",
  });
  const response = await fetch(`/api/browse?${params.toString()}`, { cache: "no-store", signal: options.signal });
  if (!response.ok) throw new Error(`Browse failed with ${response.status}`);

  const payload = await response.json();
  const listings = Array.isArray(payload.listings) ? payload.listings : [];
  const qualityContext = createGearQualityContext();
  return listings
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext))
    .filter((listing) => !hasStarterFreshFindNoise(listing))
    .map((listing) => ({
      ...listing,
      isBrowseCategoryListing: true,
    }));
}

async function fetchBrandBrowseListings(brand, brandRecipe, categoryIntent, options = {}) {
  const region = getActiveRegion();
  const sourceTerms = brandRecipe.sourceTerms || brandRecipe.searchTerms;
  const params = new URLSearchParams({
    terms: createSourceSearchTerms(sourceTerms).join("|"),
    excludes: createBrandRecipeRequestExcludes(brand).join("|"),
    categoryIntent: sanitizeCategoryIntent(categoryIntent, appSettings.regionId),
    maxPrice: String(brandRecipe.maxPrice || 0),
    sources: getBrandRecipeSourcesForRegion(brandRecipe, region.id).join("|"),
    region: region.id,
  });
  const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store", signal: options.signal });
  if (!response.ok) throw new Error(`Brand browse failed with ${response.status}`);

  const payload = await response.json();
  const listings = Array.isArray(payload.listings) ? payload.listings : [];
  const qualityContext = createGearQualityContext();
  return listings
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => matchesPopularBrandListing(listing, brand))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext))
    .filter((listing) => !hasStarterFreshFindNoise(listing))
    .map((listing) => ({
      ...listing,
      isBrowseCategoryListing: true,
      isBrandBrowseListing: true,
    }));
}

function getBrandRecipeSourcesForRegion(brandRecipe, regionId = appSettings.regionId) {
  const regionSourceIds = getRegionSourceIds(regionId);
  const regionSourceSet = new Set(regionSourceIds);
  const recipeSources = Array.isArray(brandRecipe?.sources) ? brandRecipe.sources : [];
  const matchedSources = recipeSources.filter((sourceId) => regionSourceSet.has(sourceId));
  return matchedSources.length > 0 ? matchedSources : regionSourceIds;
}

function createBrowseCategoryLoadingPlaceholders() {
  return Array.from({ length: FRESH_FIND_LOADING_CARD_COUNT }, (_, index) => ({
    id: `browse-category-loading-${index}`,
    source: "yahoo-auctions",
    title: `Browsing ${getCategoryIntentLabel(browseCategoryIntent)}`,
    isFreshFindLoading: true,
    isBrowseCategoryLoading: true,
  }));
}

function cancelBrowseCategoryLoad() {
  if (browseCategoryAbortController) {
    browseCategoryAbortController.abort();
    browseCategoryAbortController = null;
  }
  browseCategoryRequestId += 1;
  browseCategoryPostLoadTaskId += 1;
  browseCardRenderId += 1;
  clearBrowsePreparedListingsCache();
}

function scheduleBrowseCategoryPostLoadWork(categoryIntent, listings) {
  if (!Array.isArray(listings) || listings.length === 0) return;
  if (browseCategoryBrandSlug) return;
  const normalizedCategoryIntent = sanitizeCategoryIntent(categoryIntent, appSettings.regionId);
  const taskId = ++browseCategoryPostLoadTaskId;
  const runDiscoveryUpdate = () => {
    if (taskId !== browseCategoryPostLoadTaskId || normalizedCategoryIntent !== browseCategoryIntent) return;
    const renderContext = createListingRenderContext();
    const curatedListings = getCuratedGearScannerListings(listings, {
      limit: BROWSE_HOME_LIMIT,
      candidateLimit: BROWSE_HOME_CURATION_CANDIDATE_LIMIT,
      renderContext,
      ledger: renderContext.ledger,
    });
    if (curatedListings.length > 0) {
      recordListingDiscoveries({ name: `${getCategoryIntentLabel(normalizedCategoryIntent)} Browser` }, curatedListings);
      clearBrowsePreparedListingsCache();
    }
  };

  const runCacheUpdate = () => {
    if (taskId !== browseCategoryPostLoadTaskId || normalizedCategoryIntent !== browseCategoryIntent) return;
    const renderContext = createListingRenderContext();
    maybeSaveBrowseCategoryCache(normalizedCategoryIntent, listings, {
      renderContext,
      ledger: renderContext.ledger,
    });
  };

  scheduleUiIdleTask(runDiscoveryUpdate, {
    delay: 4000,
    timeout: 15000,
  });
  scheduleUiIdleTask(runCacheUpdate, {
    delay: 9000,
    timeout: 20000,
  });
}

function scheduleHomeBrowseCategoryChange(categoryIntent, options = {}) {
  const nextCategoryIntent = sanitizeCategoryIntent(categoryIntent, appSettings.regionId);
  if (browseCategorySelectionTimer) window.clearTimeout(browseCategorySelectionTimer);

  cancelBrowseCategoryLoad();
  browseCategoryIntent = nextCategoryIntent;
  browseCategoryListings = [];
  clearBrowsePreparedListingsCache();
  browseCategoryStatus = "idle";
  browseCategoryError = "";
  browseCategoryBrandSlug = "";
  resetPagination();

  if (options.expanded) {
    activeBrowseBrandSlug = "";
    isBrowseExpanded = true;
    setAppView(APP_VIEW_SYNTH_BROWSER, { brandSlug: "", replace: true });
  }

  const selectionRequestId = browseCategoryRequestId;
  browseCategorySelectionTimer = window.setTimeout(() => {
    browseCategorySelectionTimer = 0;
    selectInteractionActive = false;
    if (selectInteractionReleaseTimer) {
      window.clearTimeout(selectInteractionReleaseTimer);
      selectInteractionReleaseTimer = 0;
    }
    scheduleAfterNextPaint(() => {
      if (selectionRequestId !== browseCategoryRequestId) return;
      if (searchState.mode === "idle") renderResults({ force: true });
    });
  }, 0);
}

function setHomeBrowseCategory(categoryIntent, options = {}) {
  const nextCategoryIntent = sanitizeCategoryIntent(categoryIntent, appSettings.regionId);
  if (nextCategoryIntent === browseCategoryIntent && browseCategoryStatus !== "error") return;
  cancelBrowseCategoryLoad();
  browseCategoryIntent = nextCategoryIntent;
  browseCategoryListings = [];
  clearBrowsePreparedListingsCache();
  browseCategoryStatus = "idle";
  browseCategoryError = "";
  browseCategoryBrandSlug = "";
  if (searchState.mode === "idle") renderResults({ force: Boolean(options.forceRender) });
}

function getCachedBrowseCategoryListings(categoryIntent = browseCategoryIntent, options = {}) {
  if (browseCategoryBrandSlug) return [];
  const cache = loadFreshFindCache();
  const regionCache = cache[getActiveRegion().id];
  const categoryCache = regionCache?.browseCategories?.[sanitizeCategoryIntent(categoryIntent, appSettings.regionId)];
  const listings = Array.isArray(categoryCache?.listings) ? categoryCache.listings : [];
  const limit = options.limit || FEATURED_HOME_LIMIT;
  const preparedListings = options.latest
    ? prepareLatestBrowseListings(listings, { limit, renderContext: options.renderContext })
    : getCuratedGearScannerListings(listings, {
      limit,
      candidateLimit: limit <= BROWSE_HOME_LIMIT ? BROWSE_HOME_CURATION_CANDIDATE_LIMIT : 0,
      renderContext: options.renderContext,
    });

  return preparedListings.map((listing) => ({
    ...listing,
    isBrowseCategoryCached: true,
    browseCategoryCachedAt: categoryCache?.generatedAt || "",
  }));
}

function getBrowseCategoryFreshness(categoryIntent = browseCategoryIntent) {
  const cache = loadFreshFindCache();
  const regionCache = cache[getActiveRegion().id];
  const categoryCache = regionCache?.browseCategories?.[sanitizeCategoryIntent(categoryIntent, appSettings.regionId)];
  return browseCategoryUpdatedAt || categoryCache?.generatedAt || "";
}

function prepareBrandBrowseListings(listings, options = {}) {
  const limit = options.limit || BROWSE_EXPANDED_LIMIT;
  const ledger = options.ledger || options.renderContext?.ledger || loadLedger();
  const qualityContext = options.renderContext || createGearQualityContext();
  const seenIds = new Set();
  return listings
    .filter((listing) => {
      if (!listing?.id || seenIds.has(listing.id)) return false;
      seenIds.add(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext))
    .sort(compareListings)
    .slice(0, limit)
    .map((listing) => decorateFreshFindListing(listing, ledger, qualityContext));
}

function prepareLatestBrowseListings(listings, options = {}) {
  const limit = options.limit || BROWSE_EXPANDED_LIMIT;
  const ledger = options.ledger || options.renderContext?.ledger || loadLedger();
  const qualityContext = options.renderContext || createGearQualityContext();
  const seenIds = new Set();
  return listings
    .filter((listing) => {
      if (!listing?.id || seenIds.has(listing.id)) return false;
      seenIds.add(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => !isStaleFreshFind(listing, ledger))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext))
    .sort((a, b) => getLatestBrowseTime(b, ledger) - getLatestBrowseTime(a, ledger))
    .slice(0, limit)
    .map((listing) => decorateFreshFindListing(listing, ledger, qualityContext));
}

function getLatestBrowseTime(listing, ledger = loadLedger()) {
  const entry = ledger[listing.id] || {};
  const candidates = [
    listing.listedAt,
    listing.firstSeenAt,
    entry.firstSeenAt,
    entry.firstDiscoveredAt,
    listing.lastVerifiedAt,
    entry.lastVerifiedAt,
    entry.lastSeenAt,
    entry.lastFoundAt,
  ];
  for (const value of candidates) {
    const time = Date.parse(value || "");
    if (Number.isFinite(time)) return time;
  }
  return 0;
}

function formatBrowseFreshnessDetail(value) {
  if (!value) return "";
  const date = new Date(value);
  const timestamp = date.getTime();
  if (Number.isNaN(timestamp)) return "";

  const ageMs = Date.now() - timestamp;
  if (ageMs < 0 || ageMs < 60 * 1000) return " · Updated just now";
  if (ageMs < 60 * 60 * 1000) {
    const minutes = Math.max(1, Math.floor(ageMs / (60 * 1000)));
    return ` · Updated ${minutes} min ago`;
  }

  return ` · Updated ${formatShortDate(value)}`;
}

function getCachedFreshFindListings() {
  const cache = loadFreshFindCache();
  const regionCache = cache[getActiveRegion().id];
  const listings = Array.isArray(regionCache?.listings) ? regionCache.listings : [];

  return curateFreshFindListings(listings)
    .map((listing) => ({
      ...listing,
      isFreshFindCached: true,
      freshFindCachedAt: regionCache?.generatedAt || "",
    }));
}

function loadFreshFindCache() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.freshFindCache) || "{}");
  } catch {
    return {};
  }
}

function saveFreshFindCache(listings) {
  if (!Array.isArray(listings) || listings.length === 0) return;

  const cache = loadFreshFindCache();
  const regionId = getActiveRegion().id;
  const regionCache = cache[regionId] || { regionId };
  cache[regionId] = {
    ...regionCache,
    regionId,
    generatedAt: new Date().toISOString(),
    terms: [...starterFreshFindTerms],
    listings: listings.slice(0, FEATURED_HOME_LIMIT).map(serializeFreshFindCacheListing),
  };

  try {
    localStorage.setItem(STORAGE_KEYS.freshFindCache, JSON.stringify(cache));
  } catch (error) {
    if (!isStorageQuotaError(error)) throw error;
    cache[regionId].listings = cache[regionId].listings.slice(0, Math.ceil(FEATURED_HOME_LIMIT / 2));
    try {
      localStorage.setItem(STORAGE_KEYS.freshFindCache, JSON.stringify(cache));
    } catch (retryError) {
      if (!isStorageQuotaError(retryError)) throw retryError;
      console.warn("Fresh Finds cache skipped because browser storage is full.", retryError);
    }
  }
}

function saveBrowseCategoryCache(categoryIntent, listings, options = {}) {
  if (!Array.isArray(listings) || listings.length === 0) return;

  const cache = loadFreshFindCache();
  const regionId = getActiveRegion().id;
  const normalizedCategoryIntent = sanitizeCategoryIntent(categoryIntent, appSettings.regionId);
  const regionCache = cache[regionId] || { regionId };
  const generatedAt = new Date().toISOString();
  const renderContext = options.renderContext || createGearQualityContext();
  const ledger = options.ledger || loadLedger();
  const browseCategories = {
    ...(regionCache.browseCategories || {}),
    [normalizedCategoryIntent]: {
      categoryIntent: normalizedCategoryIntent,
      generatedAt,
      listings: prepareLatestBrowseListings(listings, { limit: BROWSE_EXPANDED_LIMIT, renderContext, ledger }).map(serializeFreshFindCacheListing),
    },
  };

  cache[regionId] = {
    ...regionCache,
    regionId,
    browseCategories,
  };

  try {
    localStorage.setItem(STORAGE_KEYS.freshFindCache, JSON.stringify(cache));
    browseCategoryUpdatedAt = generatedAt;
  } catch (error) {
    if (!isStorageQuotaError(error)) throw error;
    cache[regionId].browseCategories[normalizedCategoryIntent].listings = cache[regionId].browseCategories[normalizedCategoryIntent].listings.slice(0, Math.ceil(BROWSE_EXPANDED_LIMIT / 2));
    try {
      localStorage.setItem(STORAGE_KEYS.freshFindCache, JSON.stringify(cache));
      browseCategoryUpdatedAt = generatedAt;
    } catch (retryError) {
      if (!isStorageQuotaError(retryError)) throw retryError;
      console.warn("Gear Browser cache skipped because browser storage is full.", retryError);
    }
  }
}

function maybeSaveBrowseCategoryCache(categoryIntent, listings, options = {}) {
  if (!Array.isArray(listings) || listings.length === 0) return;
  const normalizedCategoryIntent = sanitizeCategoryIntent(categoryIntent, appSettings.regionId);
  const signature = [
    getActiveRegion().id,
    normalizedCategoryIntent,
    listings.map((listing) => listing.id || listing.url || listing.title).join("|"),
  ].join(":");
  if (signature === browseCategoryCacheSignature) return;
  browseCategoryCacheSignature = signature;
  saveBrowseCategoryCache(normalizedCategoryIntent, listings, options);
}

function serializeFreshFindCacheListing(listing) {
  return {
    id: listing.id,
    source: listing.source,
    region: listing.region || getActiveRegion().id,
    currency: listing.currency || getActiveRegion().currency,
    title: listing.title,
    price: listing.price,
    priceLabel: listing.priceLabel || "",
    url: listing.url,
    image: listing.image,
    shop: listing.shop || "",
    condition: listing.condition || "",
    availability: listing.availability || "",
    itemStatus: listing.itemStatus || "",
    categoryId: listing.categoryId || "",
    categoryPath: Array.isArray(listing.categoryPath) ? listing.categoryPath : [],
    listedAt: listing.listedAt || "",
    firstSeenAt: listing.firstSeenAt || "",
    lastVerifiedAt: listing.lastVerifiedAt || "",
    isStarterLiveFreshFind: true,
  };
}

function getWatchedHomeListings(watchingIds = loadSet(STORAGE_KEYS.watching), options = {}) {
  const ledger = options.renderContext?.ledger || loadLedger();
  const qualityContext = options.renderContext || createGearQualityContext();
  return normalizeStoredList(watchingIds)
    .map((id) => ledger[id])
    .filter(Boolean)
    .map(createListingFromLedgerEntry)
    .filter((listing) => listing.title && listing.url)
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext))
    .filter((listing) => !isStaleFreshFind(listing, ledger))
    .sort((a, b) => scoreFreshFindListing(b, ledger, qualityContext) - scoreFreshFindListing(a, ledger, qualityContext))
    .slice(0, FEATURED_HOME_LIMIT)
    .map((listing) => decorateFreshFindListing(listing, ledger, qualityContext));
}

function getWatchedResultListings(watchingIds = loadSet(STORAGE_KEYS.watching), options = {}) {
  const ledger = options.renderContext?.ledger || loadLedger();
  return normalizeStoredList(watchingIds)
    .map((id, index) => ({ id, index, entry: ledger[id] }))
    .filter((item) => item.entry)
    .map((item) => ({
      ...createListingFromLedgerEntry(item.entry),
      watchlistIndex: item.index,
      isWatchlistListing: true,
    }))
    .filter((listing) => listing.title && listing.url)
    .filter((listing) => !isUnavailableListing(listing))
    .sort((first, second) => second.watchlistIndex - first.watchlistIndex);
}

function getWatchlistVisibleListings(listings) {
  return listings.filter((listing) => activeViewSources.size === 0 || activeViewSources.has(listing.source));
}

function createFreshFindLoadingPlaceholders() {
  const sourceIds = getStarterFreshFindSourceIds();
  return Array.from({ length: FRESH_FIND_LOADING_CARD_COUNT }, (_, index) => ({
    id: `fresh-find-loading-${index}`,
    source: sourceIds[index % sourceIds.length],
    title: "Scanning Fresh Finds",
    isStarterFreshFind: true,
    isFreshFindLoading: true,
  }));
}

function resetFreshFindRegionState() {
  if (starterFreshFindAbortController) {
    starterFreshFindAbortController.abort();
    starterFreshFindAbortController = null;
  }
  starterFreshFindRequestId += 1;
  starterFreshFindStatus = "idle";
  starterFreshFindListings = [];
  starterFreshFindTerms = [];
}

function ensureStarterFreshFindListings() {
  if (starterFreshFindStatus !== "idle") return;
  if (location.protocol === "file:") return;

  const requestRegionId = getActiveRegion().id;
  const requestId = ++starterFreshFindRequestId;
  const abortController = new AbortController();
  if (starterFreshFindAbortController) starterFreshFindAbortController.abort();
  starterFreshFindAbortController = abortController;
  starterFreshFindStatus = "loading";
  starterFreshFindTerms = pickStarterFreshFindTerms();

  fetchStarterFreshFindListings({ signal: abortController.signal })
    .then((listings) => {
      if (requestId !== starterFreshFindRequestId || requestRegionId !== getActiveRegion().id) return;
      starterFreshFindListings = listings;
      starterFreshFindStatus = listings.length > 0 ? "live" : "fallback";
      if (searchState.mode === "idle") renderResults();
    })
    .catch((error) => {
      if (requestId !== starterFreshFindRequestId || error?.name === "AbortError") return;
      console.warn("Starter Fresh Finds unavailable; keeping portal cards.", error);
      starterFreshFindStatus = "fallback";
      if (searchState.mode === "idle") renderResults();
    })
    .finally(() => {
      if (requestId === starterFreshFindRequestId && starterFreshFindAbortController === abortController) {
        starterFreshFindAbortController = null;
      }
    });
}

function pickStarterFreshFindTerms() {
  const shuffled = [...STARTER_FRESH_FIND_TERMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

function getStarterFreshFindSourceIds(regionId = getActiveRegion().id) {
  const configuredSourceIds = REGIONAL_FRESH_FIND_SOURCE_IDS[regionId] || getRegionById(regionId).sources || STARTER_FRESH_FIND_SOURCE_IDS;
  const regionSources = new Set(getRegionById(regionId).sources || []);
  const sourceIds = configuredSourceIds.filter((sourceId) => regionSources.has(sourceId));
  return sourceIds.length > 0 ? sourceIds : STARTER_FRESH_FIND_SOURCE_IDS;
}

function getStarterFreshFindFallbackListings() {
  const region = getActiveRegion();
  if (region.id === "japan") return STARTER_FRESH_FIND_LISTINGS;

  const sourceIds = getStarterFreshFindSourceIds(region.id);
  const fallbackTerms = STARTER_FRESH_FIND_TERMS.slice(0, FEATURED_HOME_LIMIT);
  return sourceIds.slice(0, FEATURED_HOME_LIMIT).map((sourceId, index) => {
    const label = labelForSource(sourceId);
    const term = fallbackTerms[index % fallbackTerms.length] || "vintage synthesizer";
    return {
      id: `starter-${region.id}-${sourceId}`,
      source: sourceId,
      region: region.id,
      currency: region.currency,
      title: `${label} fresh ${term}`,
      priceLabel: "Explore",
      condition: "Starter search",
      listedAt: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
      url: createStarterFreshFindUrl(sourceId, term),
      image: createStarterSynthArtwork(label, index % 2 === 0 ? "#d8e6f7" : "#e6e0ec", "#171a1d"),
      isStarterFreshFind: true,
    };
  });
}

function createStarterFreshFindUrl(sourceId, term) {
  const encodedTerm = encodeURIComponent(term);
  if (sourceId === "craigslist-sfbay") return `https://sfbay.craigslist.org/search/msa?query=${encodedTerm}&sort=date`;
  if (sourceId === "craigslist-la") return `https://losangeles.craigslist.org/search/msa?query=${encodedTerm}&sort=date`;
  if (sourceId === "craigslist-east") return `https://newyork.craigslist.org/search/msa?query=${encodedTerm}&sort=date`;
  if (sourceId === "reverb-us") return `https://reverb.com/marketplace?query=${encodedTerm}`;
  if (sourceId === "ebay-us") return `https://www.ebay.com/sch/i.html?_nkw=${encodedTerm}`;
  if (sourceId === "sweetwater-used") return `https://www.sweetwater.com/used/listings?query=${encodedTerm}`;
  if (sourceId === "guitar-center-used") return `https://www.guitarcenter.com/Used/?Ntt=${encodedTerm}`;
  if (sourceId === "robotspeak") return `https://robotspeak.com/search?q=${encodedTerm}`;
  if (sourceId === "mission-synths") return `https://www.missionsynths.com/search?q=${encodedTerm}`;
  if (sourceId === "starving-musician") return `https://starvingmusician.com/search?q=${encodedTerm}`;
  if (sourceId === "bananas-at-large") return `https://www.bananas.com/search?q=${encodedTerm}`;
  if (sourceId === "gelb-music") return `https://gelbmusic.com/search.php?search_query=${encodedTerm}&section=product`;
  if (sourceId === "main-drag") return `https://maindragmusic.com/search?q=${encodedTerm}`;
  if (sourceId === "rogue-music") return "https://www.roguemusic.com/golink5.php";
  if (sourceId === "three-wave") return `https://threewavemusic.com/search.php?search_query=${encodedTerm}&section=product`;
  if (sourceId === "alto-music") return `https://www.altomusic.com/search?q=${encodedTerm}`;
  if (sourceId === "tone-tweakers") return `https://tonetweakers.com/search?q=${encodedTerm}`;
  if (sourceId === "pro-audio-star") return `https://www.proaudiostar.com/catalogsearch/result/?q=${encodedTerm}`;
  return "#";
}

async function fetchStarterFreshFindListings(options = {}) {
  const region = getActiveRegion();
  const sourceIds = getStarterFreshFindSourceIds(region.id);
  const params = new URLSearchParams({
    terms: starterFreshFindTerms.join("|"),
    excludes: STARTER_FRESH_FIND_EXCLUDES.join("|"),
    categoryIntent: getRegionCategoryIntent(region.id),
    region: region.id,
    maxPrice: "0",
    sources: sourceIds.join("|"),
  });
  const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store", signal: options.signal });
  if (!response.ok) throw new Error(`Starter Fresh Finds failed with ${response.status}`);

  const payload = await response.json();
  const listings = Array.isArray(payload.listings) ? payload.listings : [];
  const qualityContext = createGearQualityContext();
  const freshListings = listings
    .filter((listing) => sourceIds.includes(listing.source))
    .filter((listing) => !listing.region || listing.region === region.id)
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => isCleanGearListing(listing, qualityContext))
    .filter((listing) => !hasStarterFreshFindNoise(listing))
    .filter((listing) => matchesStarterFreshFindTerm(listing) || hasStarterGearSignal(listing))
    .map((listing) => ({
      ...listing,
      isStarterLiveFreshFind: true,
    }));

  const curatedListings = curateFreshFindListings(freshListings, { renderContext: qualityContext });
  if (curatedListings.length > 0) {
    recordListingDiscoveries({ name: "Fresh Finds" }, curatedListings);
    saveFreshFindCache(curatedListings);
  }
  return curatedListings;
}

function curateFreshFindListings(listings, options = {}) {
  const limit = options.limit || FEATURED_HOME_LIMIT;
  const candidateLimit = Number(options.candidateLimit || 0);
  const ledger = options.ledger || options.renderContext?.ledger || loadLedger();
  const qualityContext = options.renderContext || createGearQualityContext();
  const seenIds = new Set();

  let candidates = listings
    .filter((listing) => {
      if (!listing?.id || seenIds.has(listing.id)) return false;
      seenIds.add(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing));

  if (candidateLimit > 0) {
    candidates = candidates.slice(0, candidateLimit);
  }

  return candidates
    .filter((listing) => !isStaleFreshFind(listing, ledger))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext))
    .sort((a, b) => {
      const scoreDelta = scoreFreshFindListing(b, ledger, qualityContext) - scoreFreshFindListing(a, ledger, qualityContext);
      if (scoreDelta !== 0) return scoreDelta;
      return getFreshFindTime(b, ledger) - getFreshFindTime(a, ledger);
    })
    .slice(0, limit)
    .map((listing) => decorateFreshFindListing(listing, ledger, qualityContext));
}

function getCuratedGearScannerListings(listings, options = {}) {
  const limit = options.limit || BROWSE_HOME_LIMIT;
  const candidateLimit = Number(options.candidateLimit || 0);
  const ledger = options.ledger || options.renderContext?.ledger || loadLedger();
  const qualityContext = options.renderContext || createGearQualityContext();
  const seenIds = new Set();

  let candidates = listings
    .filter((listing) => {
      if (!listing?.id || seenIds.has(listing.id)) return false;
      seenIds.add(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => !isStaleFreshFind(listing, ledger))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing, qualityContext));

  if (candidateLimit > 0) {
    candidates = candidates.slice(0, Math.max(candidateLimit, limit));
  }

  // Gear Scanner is a discovery surface, so obvious parts/accessories are removed
  // before freshness sorting can promote them above complete instruments.
  const classifiedCandidates = candidates
    .map((listing) => ({
      listing,
      classification: classifyGearScannerListing(listing, { ledger, renderContext: qualityContext }),
    }))
    .filter((item) => item.classification.include || !item.classification.hardExcluded);
  const curated = classifiedCandidates
    .filter((item) => item.classification.include)
    .sort((a, b) => {
      const scoreDelta = b.classification.score - a.classification.score;
      if (scoreDelta !== 0) return scoreDelta;
      return getFreshFindTime(b.listing, ledger) - getFreshFindTime(a.listing, ledger);
    });

  const fallback = classifiedCandidates
    .filter((item) => !item.classification.include)
    .sort((a, b) => {
      const scoreDelta = b.classification.score - a.classification.score;
      if (scoreDelta !== 0) return scoreDelta;
      return getFreshFindTime(b.listing, ledger) - getFreshFindTime(a.listing, ledger);
    });

  const minCount = Number.isFinite(options.minCount) ? options.minCount : Math.min(GEAR_SCANNER_MIN_FALLBACK_CARDS, limit);
  const results = curated.slice(0, limit);
  if (results.length < minCount) {
    const fill = fallback
      .filter((item) => item.classification.score >= GEAR_SCANNER_FALLBACK_MIN_SCORE)
      .slice(0, minCount - results.length);
    results.push(...fill);
  }

  return results
    .map(({ listing, classification }) => decorateGearScannerListing(listing, ledger, qualityContext, classification));
}

function decorateGearScannerListing(listing, ledger = loadLedger(), context = null, classification = null) {
  const gearScannerClassification = classification || classifyGearScannerListing(listing, { ledger, renderContext: context });
  return {
    ...decorateFreshFindListing(listing, ledger, context),
    gearScannerScore: gearScannerClassification.score,
    gearScannerCategory: gearScannerClassification.category,
    gearScannerReasons: gearScannerClassification.reasons,
  };
}

function scoreGearScannerListing(listing, ledger = loadLedger(), context = null) {
  return classifyGearScannerListing(listing, { ledger, renderContext: context }).score;
}

function classifyGearScannerListing(listing, options = {}) {
  const ledger = options.ledger || options.renderContext?.ledger || loadLedger();
  const qualityContext = options.renderContext || createGearQualityContext();
  const searchable = normalizeListingText(listing);
  const confidence = scoreGearConfidence(listing, qualityContext);
  const reasons = [];
  const hardExcludeReasons = getGearScannerHardExcludeReasons(searchable);
  const positiveTerms = getMatchingTerms(searchable, GEAR_SCANNER_POSITIVE_TERMS);
  const brandMatches = getMatchingTerms(searchable, GEAR_SCANNER_KNOWN_BRANDS);
  const modelMatches = getMatchingTerms(searchable, GEAR_SCANNER_KNOWN_MODELS);
  const accessoryTerms = getMatchingTerms(searchable, GEAR_SCANNER_EXCLUDE_TERMS);
  let score = scoreFreshFindListing(listing, ledger, qualityContext);

  positiveTerms.forEach((term) => reasons.push(`positive term: ${term}`));
  brandMatches.forEach((term) => reasons.push(`brand match: ${term}`));
  modelMatches.forEach((term) => reasons.push(`model match: ${term}`));
  accessoryTerms.forEach((term) => reasons.push(`accessory term: ${term}`));
  hardExcludeReasons.forEach((reason) => reasons.push(`hard exclude: ${reason}`));

  score += Math.min(positiveTerms.length * 6, 48);
  score += Math.min(brandMatches.length * 5, 24);
  score += Math.min(modelMatches.length * 14, 42);
  score += Math.min(countBrandModelSignals(searchable) * 8, 32);
  score -= accessoryTerms.length * 10;
  if (confidence.level === "likely-gear") score += 18;
  if (confidence.level === "maybe-gear") score += 4;
  if (confidence.level === "likely-noise") score -= 50;
  if (listing.image) score += 4;

  if (confidence.level) reasons.push(`gear confidence: ${confidence.level}`);
  if (listing.image) reasons.push("has image");

  const hardExcluded = hardExcludeReasons.length > 0;
  const category = getGearScannerClassificationCategory({ searchable, hardExcluded, hardExcludeReasons, positiveTerms, brandMatches, modelMatches });
  const include = !hardExcluded && score >= GEAR_SCANNER_MIN_INCLUDE_SCORE;
  const classification = { include, hardExcluded, score, category, reasons };
  logGearScannerCurationDecision(listing, classification);
  return classification;
}

function isLikelyAccessoryOrPartOnly(listing) {
  return classifyGearScannerListing(listing).hardExcluded;
}

function isHardExcludedGearScannerListing(listing) {
  return classifyGearScannerListing(listing).hardExcluded;
}

function normalizeListingText(listing) {
  return normalizeText([
    listing?.title,
    listing?.description,
    listing?.brand,
    listing?.category,
    listing?.condition,
    listing?.shop,
    listing?.source,
    Array.isArray(listing?.categoryPath) ? listing.categoryPath.join(" ") : "",
  ].filter(Boolean).join(" "));
}

function getGearScannerSearchableText(listing) {
  return normalizeListingText(listing);
}

function getGearScannerHardExcludeReasons(searchable) {
  const reasons = [];
  const hasStrongInstrumentSignal = countMatchingTerms(searchable, GEAR_SCANNER_POSITIVE_TERMS) >= 2 || countMatchingTerms(searchable, GEAR_SCANNER_KNOWN_MODELS) > 0;
  // Instrument-category words only — model/brand names are deliberately not
  // counted here because accessories cite them constantly ("DX7用...").
  const hasInstrumentWord = /(synth|synthesizer|synthesiser|シンセ|シンセサイザー|アナログシンセ|drum machine|ドラムマシン|sampler|サンプラー|sequencer|シーケンサー|modular|モジュラー|eurorack|ユーロラック|groovebox|グルーヴボックス|音源モジュール)/i.test(searchable);
  const hasSynthSpecificSignal = hasInstrumentWord || countMatchingTerms(searchable, GEAR_SCANNER_KNOWN_MODELS) > 0;
  const accessoryForPattern = /(?:dx7|juno|jupiter|motif|montage|kross|ms-20|tr-808|tr-909|tb-303|rx5|r-8|qy70|qy300|yamaha|roland|korg|akai|casio|moog|シンセサイザー|シンセ|キーボード|ピアノ|鍵盤)[\w\s/-]{0,12}用.*(oled|lcd|led|rom|eprom|firmware|chip|display|screen|panel|case|cover|sticker|seal|cable|adapter|有機el|液晶|ディスプレイ|スクリーン|画面|パネル|ケース|カバー|シール|ステッカー|ケーブル|アダプター|機能アップ|簡単装着)/i.test(searchable);
  const electronicPartPattern = /(^|[^a-z0-9])(lcd|oled|led screen|display|screen|rom|eprom|firmware|chip|ser-7)([^a-z0-9]|$)/i.test(searchable);
  const computerAccessoryPattern = /(hard travel case|keyboard case|mouse case|computer keyboard|60% keyboard|monsgeek|kitcut|キーボードケース|マウスケース)/i.test(searchable);
  const computerContextPattern = /コンピューター/i.test(searchable);
  const caseOnlyPattern = /(case only|hard case|travel case|soft case|carry bag|carrying bag|keyboard cover|^キーボードハードケース|^ハードケース|^ケース|ケースのみ|ハードケースのみ|トラベルケースのみ|ソフトケース|キャリーバッグ|キーボードカバー|収納 バッグ|リュック)/i.test(searchable);
  const sheetMusicPattern = /(sheet music|music stand|piano sticker|keyboard sticker|note sticker|譜面|譜面ファイル|吹奏楽|野外演奏|野外ライブ|風対策|音符シール|五線譜|鍵盤シール|ピアノシール)/i.test(searchable);
  const weakSheetMusicPattern = /(ステッカー|ドレミ|音階|初心者|練習用)/i.test(searchable);
  const repairPartPattern = /(^|[^a-z0-9])(replacement|spare parts?|parts only|manual only|cable only|adapter only|power supply only|knobs? only|buttons? only|sliders? only|panel only)([^a-z0-9]|$)|交換用|修理|部品|パーツ/i.test(searchable);
  const utilityAccessoryPattern = /(keyboard stand|sustain pedal|damper pedal|finger guard|キーボードスタンド|サステインペダル|サスティーンペダル|ダンパーペダル|フィンガーガード)/i.test(searchable);
  const mediaAccessoryPattern = /(newspaper|新聞|創刊号|book only|manual only|取扱説明書のみ)/i.test(searchable);
  const digitalPianoOnlyPattern = /(digital piano|デジタルピアノ|電子ピアノ|ピアノタッチ)/i.test(searchable) && !hasSynthSpecificSignal;

  getMatchingTerms(searchable, GEAR_SCANNER_HARD_EXCLUDE_TERMS).forEach((term) => reasons.push(term));
  if (accessoryForPattern) reasons.push("Japanese 用 accessory grammar");
  if (electronicPartPattern && !hasInstrumentWord) reasons.push("electronic part/display/ROM");
  if (computerAccessoryPattern) reasons.push("computer keyboard accessory");
  if (computerContextPattern && !hasInstrumentWord) reasons.push("computer accessory context");
  if (caseOnlyPattern && !hasStrongInstrumentSignal) reasons.push("case-only accessory");
  if (sheetMusicPattern) reasons.push("sheet music or band accessory");
  if (weakSheetMusicPattern && !hasInstrumentWord) reasons.push("sticker or lesson accessory");
  if (repairPartPattern && !hasStrongInstrumentSignal) reasons.push("repair part or accessory-only phrase");
  if (utilityAccessoryPattern && !hasInstrumentWord) reasons.push("utility accessory");
  if (mediaAccessoryPattern) reasons.push("media accessory");
  if (digitalPianoOnlyPattern) reasons.push("digital piano / lesson keyboard");

  return [...new Set(reasons)];
}

function getGearScannerClassificationCategory(details) {
  const searchable = details.searchable || "";
  if (details.hardExcluded) {
    const reasonText = details.hardExcludeReasons.join(" ");
    if (/computer keyboard|case/.test(reasonText)) return "computer-accessory";
    if (/sheet music|band/.test(reasonText)) return "sheet-music-accessory";
    if (/display|rom|part|repair|utility|media/.test(reasonText)) return "replacement-part";
    return "accessory-only";
  }

  if (/drum machine|ドラムマシン|tr-808|tr-909|drumatix|rhythm machine|リズムマシン/.test(searchable)) return "drum-machine";
  if (/sampler|サンプラー|mpc|digitakt|mirage|sk-8/.test(searchable)) return "sampler";
  if (/sequencer|シーケンサー|qy100|qy70|qy300/.test(searchable)) return "sequencer";
  if (/modular|eurorack|ユーロラック|モジュラー|vco|vcf|vca/.test(searchable)) return "modular";
  if (/sound module|音源モジュール|rack|rackmount/.test(searchable)) return "sound-module";
  if (details.positiveTerms.length > 0 || details.brandMatches.length > 0 || details.modelMatches.length > 0) return "hardware-synth";
  return "unknown-low-confidence";
}

function getMatchingTerms(searchable, terms) {
  return terms.filter((term) => termMatches(searchable, term));
}

function logGearScannerCurationDecision(listing, classification) {
  if (!window.BRRTZ_DEBUG_GEAR_SCANNER) return;
  console.debug("[Gear Scanner curation]", {
    title: listing?.title || "",
    include: classification.include,
    score: classification.score,
    category: classification.category,
    reasons: classification.reasons,
  });
}

function scoreFreshFindListing(listing, ledger = loadLedger(), context = null) {
  if (listing.isStarterFreshFind) return 0;

  const searchable = normalizeText(`${listing.title || ""} ${listing.condition || ""} ${listing.shop || ""}`);
  const confidence = scoreGearConfidence(listing, context);
  const entry = ledger[listing.id] || {};
  let score = 0;

  if (listing.image) score += 8;
  if (confidence.level === "likely-gear") score += 28;
  if (confidence.level === "maybe-gear") score += 10;
  if (confidence.level === "likely-noise") score -= 40;
  score += Math.min(countMatchingTerms(searchable, FRESH_FIND_CURATOR_TERMS) * 5, 30);
  score += Math.min(countBrandModelSignals(searchable) * 6, 24);
  score -= countMatchingTerms(searchable, STARTER_FRESH_FIND_EXCLUDES) * 8;
  if (listing.price > 0) score += 3;

  const ageHours = getFreshFindAgeHours(listing, entry);
  if (Number.isFinite(ageHours)) {
    score += Math.max(0, 18 - ageHours / 2);
  }

  return score;
}

function decorateFreshFindListing(listing, ledger = loadLedger(), context = null) {
  const entry = ledger[listing.id] || {};
  return {
    ...listing,
    firstSeenAt: entry.firstSeenAt || entry.firstDiscoveredAt || listing.firstSeenAt || listing.listedAt || "",
    lastVerifiedAt: entry.lastVerifiedAt || entry.lastSeenAt || entry.lastFoundAt || listing.lastVerifiedAt || "",
    freshnessStatus: entry.freshnessStatus || "active",
    curationScore: scoreFreshFindListing(listing, ledger, context),
  };
}

function isStaleFreshFind(listing, ledger = loadLedger()) {
  const entry = ledger[listing.id] || {};
  if (["stale", "unavailable"].includes(entry.freshnessStatus)) return true;
  if (isUnavailableListing(listing)) return true;

  const lastSeenAt = entry.lastVerifiedAt || entry.lastSeenAt || entry.lastFoundAt || listing.lastVerifiedAt || "";
  const lastSeenTime = Date.parse(lastSeenAt);
  if (!Number.isFinite(lastSeenTime)) return false;

  return Date.now() - lastSeenTime > FRESH_FIND_STALE_MS;
}

function getFreshFindAgeHours(listing, entry = {}) {
  const firstSeenAt = entry.firstSeenAt || entry.firstDiscoveredAt || listing.firstSeenAt || listing.listedAt || "";
  const firstSeenTime = Date.parse(firstSeenAt);
  if (!Number.isFinite(firstSeenTime)) return Infinity;
  return (Date.now() - firstSeenTime) / (60 * 60 * 1000);
}

function getFreshFindTime(listing, ledger = loadLedger()) {
  const entry = ledger[listing.id] || {};
  const value = entry.firstSeenAt || entry.firstDiscoveredAt || listing.firstSeenAt || listing.listedAt || "";
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : 0;
}

function matchesStarterFreshFindTerm(listing) {
  const title = normalizeText(listing.title);
  return starterFreshFindTerms.some((term) => {
    const expandedTerms = expandSearchTerm(term);
    return expandedTerms.some((expandedTerm) => termMatches(title, expandedTerm));
  });
}

function hasStarterGearSignal(listing) {
  const searchable = normalizeText(`${listing.title} ${listing.condition || ""} ${listing.shop || ""}`);
  return countMatchingTerms(searchable, GEAR_SIGNAL_TERMS) > 0 || countBrandModelSignals(searchable) > 0;
}

function hasStarterFreshFindNoise(listing) {
  const searchable = normalizeText(`${listing.title} ${listing.condition || ""} ${listing.shop || ""}`);
  return STARTER_FRESH_FIND_EXCLUDES.some((term) => searchable.includes(normalizeText(term)));
}

function createListingFromLedgerEntry(entry) {
  return {
    id: entry.id,
    source: entry.source,
    title: entry.title,
    price: Number(entry.price || 0),
    url: entry.url,
    image: entry.image,
    shop: entry.shop || "",
    condition: entry.condition || "Watched",
    availability: entry.availability || "",
    itemStatus: entry.itemStatus || "",
    categoryId: entry.categoryId,
    categoryPath: Array.isArray(entry.categoryPath) ? entry.categoryPath : [],
    listedAt: entry.listedAt || entry.lastFoundAt || entry.firstDiscoveredAt || new Date().toISOString(),
    lastFoundAt: entry.lastFoundAt || entry.listedAt || entry.firstDiscoveredAt || "",
  };
}

function isListingMarkedNew(listing, renderContext = null) {
  return getListingNewness(listing, renderContext).showsNewBadge;
}

function isListingNewToUser(listing, renderContext = null) {
  return getListingNewness(listing, renderContext).isNewToUser;
}

function isListingNewForSearch(listing, renderContext = null) {
  return getListingNewness(listing, renderContext).isNewForSearch;
}

function isListingFresh(listing, renderContext = null) {
  return getListingNewness(listing, renderContext).isSourceFresh;
}

function getListingNewness(listing, renderContext = null) {
  if (!listing?.id) {
    return createListingNewnessState({ isSeen: true });
  }

  const ledger = renderContext?.ledger || loadLedger();
  const entry = ledger[listing.id];
  const seen = isListingAcknowledged(entry) || (renderContext?.seen ? renderContext.seen.has(listing.id) : isSeen(listing.id));
  const isNewToBrrtz = currentDiscoveryIds.has(listing.id) || !entry;
  const isNewToSearch = Boolean(entry) && currentNewForSearchIds.has(listing.id);
  const isNewToUser = !seen && isNewToBrrtz;
  const isNewForSearch = !seen && isNewToSearch;
  const isSourceFresh = isFreshBySourceDate(listing, entry);
  const reason = isNewToUser ? "new-to-brrtz" : isNewForSearch ? "new-to-search" : isSourceFresh ? "latest-source" : "";

  return createListingNewnessState({
    isNewToBrrtz,
    isNewToSearch,
    isNewToUser,
    isNewForSearch,
    isSourceFresh,
    isSeen: seen,
    reason,
  });
}

function createListingNewnessState(overrides = {}) {
  const state = {
    isNewToBrrtz: false,
    isNewToSearch: false,
    isNewToUser: false,
    isNewForSearch: false,
    isSourceFresh: false,
    isFresh: false,
    isSeen: false,
    showsNewBadge: false,
    reason: "",
    ...overrides,
  };

  state.isFresh = state.isSourceFresh;
  state.showsNewBadge = Boolean(state.isNewToUser || state.isNewForSearch);
  return state;
}

function getListingNewnessTitle(newness = {}) {
  if (newness.reason === "new-to-brrtz") return "New to Brrtz: first seen during this scan.";
  if (newness.reason === "new-to-search") return "New to this saved search since you last saw it.";
  if (newness.reason === "latest-source") return "Recently listed by the source.";
  return "New to you in Brrtz.";
}

function isListingAcknowledged(entry) {
  return Boolean(entry?.acknowledgedAt || entry?.viewedAt || entry?.dismissedAt || entry?.watchedAt);
}

function isFreshBySourceDate(listing, entry = {}) {
  const candidate = listing?.listedAt || entry?.listedAt || entry?.firstDiscoveredAt || "";
  const listedAtMs = new Date(candidate).getTime();
  if (!Number.isFinite(listedAtMs)) return false;
  return Date.now() - listedAtMs <= FRESH_LISTING_MS;
}

function updateSearchStatus() {
  liveStatus.textContent = searchState.message;
  liveStatus.dataset.state = searchState.mode;
  liveStatus.title = searchState.detail || searchState.message;
}

function createLiveDetail(listings, meta, errors) {
  const count = `${listings.length} live ${listings.length === 1 ? "listing" : "listings"}`;
  const duration = typeof meta.durationMs === "number" ? ` in ${(meta.durationMs / 1000).toFixed(1)}s` : "";
  const sourceText = createSourceBreakdown(meta.sourceStats || []);
  const errorText = errors.length > 0 ? `; ${errors.length} connector ${errors.length === 1 ? "warning" : "warnings"}` : "";
  return `${count}${duration}${sourceText}${errorText}.`;
}

function appendDiscoveryDetail(detail, discoveryCount) {
  const noun = discoveryCount === 1 ? "first-seen Brrtz discovery" : "first-seen Brrtz discoveries";
  return `${detail} ${discoveryCount} ${noun} this scan.`;
}

function labelForSource(sourceId) {
  return SOURCES.find((source) => source.id === sourceId)?.label || sourceId;
}

function renderSourceAvatar(avatar, source, fallbackId) {
  if (!avatar) return;

  const label = source?.label || fallbackId;
  avatar.replaceChildren();
  avatar.dataset.source = source?.id || fallbackId;
  avatar.setAttribute("aria-label", `${label} listing`);
  avatar.setAttribute("title", label);
  avatar.classList.toggle("has-logo", Boolean(source?.logo));
  applyRandomizedSourceColor(avatar, source?.id || fallbackId, { paintAvatar: true });

  if (source?.logo) {
    const image = document.createElement("img");
    image.src = source.logo;
    image.alt = "";
    image.loading = "lazy";
    avatar.appendChild(image);
    return;
  }

  avatar.textContent = source?.icon || fallbackId.slice(0, 2).toUpperCase();
}

function sourceMatchesProfile(sourceId, selectedSources) {
  if (selectedSources.includes(sourceId)) return true;
  return sourceId === "offmall" && selectedSources.includes("hardoff");
}

function isCleanGearListing(listing, context = null) {
  return formatGearConfidence(listing, context).level !== "likely-noise";
}

function isUnavailableListing(listing) {
  const status = normalizeText([
    listing.condition,
    listing.availability,
    listing.itemStatus,
  ].filter(Boolean).join(" "));

  return [
    "sold",
    "soldout",
    "sold out",
    "売り切れ",
    "売切れ",
    "売約済",
    "売却済",
    "販売済",
    "成約済",
    "ended",
    "終了",
    "wanted",
  ].some((token) => status.includes(normalizeText(token)));
}

function renderShopName(element, listing) {
  const shopName = cleanSourceMetadata(listing.shop, listing.source);
  element.textContent = shopName;
  element.hidden = !shopName;
}

function cleanSourceMetadata(value, sourceId) {
  if (!value) return "";

  const sourceAliases = SOURCE_METADATA_ALIASES[sourceId] || [labelForSource(sourceId)];
  const cleaned = sourceAliases.reduce((text, alias) => {
    return text.replace(new RegExp(escapeRegExp(alias), "gi"), "");
  }, String(value));

  return cleaned
    .replace(/\s*·\s*/g, " · ")
    .replace(/^[\s·:|/,-]+|[\s·:|/,-]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function formatGearConfidence(listing, context = null) {
  const confidence = scoreGearConfidence(listing, context);
  if (confidence.level === "likely-gear") return { ...confidence, label: "Likely gear" };
  if (confidence.level === "likely-noise") return { ...confidence, label: "Likely noise" };
  return { ...confidence, label: "Maybe gear" };
}

function scoreGearConfidence(listing, context = null) {
  const cache = context?.gearConfidenceCache;
  const cacheKey = cache ? getListingCacheKey(listing) : "";
  if (cacheKey && cache.has(cacheKey)) return cache.get(cacheKey);

  const finish = (confidence) => {
    if (cacheKey) cache.set(cacheKey, confidence);
    return confidence;
  };

  const searchable = normalizeText(`${listing.title} ${listing.condition || ""} ${listing.shop || ""}`);
  const categoryIds = getListingCategoryIds(listing);
  const feedback = context?.feedback || getProfileFeedback();
  const feedbackStatus = getListingFeedbackStatus(listing, feedback);

  if (feedbackStatus === "gear") return finish({ level: "likely-gear", score: 99 });
  if (feedbackStatus === "noise") return finish({ level: "likely-noise", score: -99 });

  const positiveTermCount = countMatchingTerms(searchable, GEAR_SIGNAL_TERMS);
  const brandModelSignalCount = countBrandModelSignals(searchable);
  const profileNoiseCount = countMatchingTerms(searchable, getActiveNoiseTerms());
  const mediaNoiseCount = countMatchingTerms(searchable, MEDIA_NOISE_TERMS);
  const feedbackNoiseCount = countMatchingTerms(searchable, feedback.hiddenTerms || []);
  const hasPositiveCategory = categoryIds.some((id) => POSITIVE_GEAR_CATEGORY_IDS.includes(id));
  const hasNegativeCategory = categoryIds.some((id) => NEGATIVE_CATEGORY_IDS.includes(id));
  const hasHardNegativeCategory = categoryIds.some((id) => HARD_NEGATIVE_CATEGORY_IDS.includes(id));
  const hasAmbiguousBrand = AMBIGUOUS_GEAR_BRANDS.some((brand) => termMatches(searchable, brand));
  const hasGearSignal = positiveTermCount > 0 || brandModelSignalCount > 0 || hasPositiveCategory;
  const hasMediaCatalogMarker = hasRecordCatalogMarker(searchable);
  const hasFeedbackHiddenCategory = categoryIds.some((id) => (feedback.hiddenCategories || []).includes(id));
  let score = 0;

  if (hasHardNegativeCategory && !hasPositiveCategory) {
    return finish({ level: "likely-noise", score: -12 });
  }

  if (hasAmbiguousBrand && !hasGearSignal) {
    return finish({ level: "likely-noise", score: -8 });
  }

  score += positiveTermCount * 3;
  score += brandModelSignalCount * 5;
  if (hasPositiveCategory) score += 4;
  if (hasNegativeCategory) score -= 5;
  if (hasHardNegativeCategory && !hasPositiveCategory && positiveTermCount < 2) score -= 4;
  if (hasMediaCatalogMarker) score -= 4;
  if (hasFeedbackHiddenCategory) score -= 8;
  score -= mediaNoiseCount * 4;
  score -= profileNoiseCount * 2;
  score -= feedbackNoiseCount * 6;

  if (positiveTermCount > 0 && !hasNegativeCategory) score += 2;
  if (mediaNoiseCount > 0 && positiveTermCount === 0) score -= 3;
  if (hasNegativeCategory && positiveTermCount === 0) score -= 2;

  if (score >= 3) return finish({ level: "likely-gear", score });
  if (score <= -3) return finish({ level: "likely-noise", score });
  return finish({ level: "maybe-gear", score });
}

function getListingCategoryIds(listing) {
  const ids = [];
  if (listing.categoryId) ids.push(String(listing.categoryId));
  if (Array.isArray(listing.categoryPath)) ids.push(...listing.categoryPath.map(String));
  return [...new Set(ids.filter(Boolean))];
}

function getListingFeedbackStatus(listing, feedback = getProfileFeedback()) {
  if ((feedback.gearListingIds || []).includes(listing.id)) return "gear";
  if ((feedback.noiseListingIds || []).includes(listing.id)) return "noise";
  return "";
}

function saveListingFeedback(listing, action) {
  const allFeedback = loadFeedbackRules();
  const key = getProfileKey(currentProfile);
  const feedback = hydrateFeedback(allFeedback[key]);

  if (action === "gear") {
    addUnique(feedback.gearListingIds, listing.id);
    removeValue(feedback.noiseListingIds, listing.id);
  }

  if (action === "noise") {
    addUnique(feedback.noiseListingIds, listing.id);
    removeValue(feedback.gearListingIds, listing.id);
  }

  if (action === "hide-similar") {
    addHideSimilarSignals(feedback, listing);
    addUnique(feedback.noiseListingIds, listing.id);
    removeValue(feedback.gearListingIds, listing.id);
  }

  allFeedback[key] = feedback;
  saveFeedbackRules(allFeedback);
}

function addHideSimilarSignals(feedback, listing) {
  const categoryIds = getListingCategoryIds(listing);
  const leafCategory = categoryIds.at(-1);
  const noiseTerm = deriveNoiseTerm(listing);

  if (leafCategory) addUnique(feedback.hiddenCategories, leafCategory);
  if (noiseTerm) addUnique(feedback.hiddenTerms, noiseTerm);
}

function deriveNoiseTerm(listing) {
  const title = normalizeText(listing.title);
  const mediaTerm = MEDIA_NOISE_TERMS.find((term) => termMatches(title, term));
  if (mediaTerm) return mediaTerm;

  const recordCode = title.match(/(^|[^a-z0-9])((lp|ep)[\s-]?\d{2,})/);
  if (recordCode?.[2]) return recordCode[2];

  const categoryTerm = getListingCategoryIds(listing).some((id) => HARD_NEGATIVE_CATEGORY_IDS.includes(id));
  if (categoryTerm) return listing.source === "yahoo-auctions" ? "yahoo media category" : listing.source;

  return "";
}

function getProfileFeedback() {
  return hydrateFeedback(loadFeedbackRules()[getProfileKey(currentProfile)]);
}

function loadFeedbackRules() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.feedbackRules) || "{}");
  } catch {
    return {};
  }
}

function saveFeedbackRules(value, options = {}) {
  localStorage.setItem(STORAGE_KEYS.feedbackRules, JSON.stringify(value));
  if (!options.skipSync) queueProfileAutoSync("feedback-rules");
}

function sanitizeFeedbackRules(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([profileKey]) => typeof profileKey === "string" && profileKey.trim())
      .map(([profileKey, feedback]) => [profileKey, hydrateFeedback(feedback)])
  );
}

function hydrateFeedback(feedback = {}) {
  const value = feedback && typeof feedback === "object" && !Array.isArray(feedback) ? feedback : {};
  return {
    gearListingIds: normalizeStoredList(value.gearListingIds),
    noiseListingIds: normalizeStoredList(value.noiseListingIds),
    hiddenCategories: normalizeStoredList(value.hiddenCategories),
    hiddenTerms: normalizeStoredList(value.hiddenTerms),
  };
}

function getProfileKey(profile) {
  return normalizeText(profile.name || "default");
}

function addUnique(values, value) {
  if (value && !values.includes(value)) values.push(value);
}

function removeValue(values, value) {
  const index = values.indexOf(value);
  if (index >= 0) values.splice(index, 1);
}

function countMatchingTerms(searchable, terms) {
  return terms.reduce((count, term) => {
    return termMatches(searchable, term) ? count + 1 : count;
  }, 0);
}

function countBrandModelSignals(searchable) {
  return Object.entries(BRAND_MODEL_SIGNAL_TERMS).reduce((count, [brand, modelTerms]) => {
    if (!termMatches(searchable, brand)) return count;
    return count + countMatchingTerms(searchable, modelTerms);
  }, 0);
}

function hasRecordCatalogMarker(searchable) {
  return /(^|[^a-z0-9])lp[\s-]?\d{2,}/.test(searchable) || /(^|[^a-z0-9])ep[\s-]?\d{2,}/.test(searchable);
}

function termMatches(searchable, term) {
  const matchTerm = parseMatchTerm(term);
  const normalized = normalizeText(matchTerm.value);
  if (!normalized) return false;

  if (matchTerm.exact) {
    return exactPhraseMatches(searchable, normalized);
  }

  if (/^[a-z0-9]+$/.test(normalized) && (normalized.length <= 3 || STRICT_LATIN_TERMS.includes(normalized))) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalized)}($|[^a-z0-9])`).test(searchable);
  }

  const looseWordTerms = createLooseWordTerms(matchTerm.value);
  if (looseWordTerms.length > 1 && looseWordTerms.every((word) => termMatches(searchable, word))) {
    return true;
  }

  return searchable.includes(normalized) || flexibleSeparatorMatches(searchable, normalized);
}

function parseMatchTerm(term) {
  const value = String(term || "").trim();
  const quotePairs = [
    ['"', '"'],
    ["'", "'"],
    ["“", "”"],
    ["‘", "’"],
  ];
  const quotePair = quotePairs.find(([open, close]) => value.startsWith(open) && value.endsWith(close) && value.length >= open.length + close.length + 1);

  if (!quotePair) {
    return { exact: false, value };
  }

  return {
    exact: true,
    value: value.slice(quotePair[0].length, value.length - quotePair[1].length).trim(),
  };
}

function exactPhraseMatches(searchable, normalizedPhrase) {
  const phrase = normalizedPhrase.replace(/\s+/g, " ").trim();
  if (!phrase) return false;

  const phrasePattern = createFlexiblePhrasePattern(phrase);
  const startBoundary = /^[a-z0-9]/.test(phrase) ? "(^|[^a-z0-9])" : "";
  const endBoundary = /[a-z0-9]$/.test(phrase) ? "($|[^a-z0-9])" : "";
  return new RegExp(`${startBoundary}${phrasePattern}${endBoundary}`).test(searchable);
}

function flexibleSeparatorMatches(searchable, normalizedTerm) {
  if (!/[a-z0-9][\s._/-]+[a-z0-9]/.test(normalizedTerm) && !/[a-z]+\d|\d+[a-z]/.test(normalizedTerm)) return false;

  const startBoundary = /^[a-z0-9]/.test(normalizedTerm) ? "(^|[^a-z0-9])" : "";
  const endBoundary = /[a-z0-9]$/.test(normalizedTerm) ? "($|[^a-z0-9])" : "";
  return new RegExp(`${startBoundary}${createFlexiblePhrasePattern(normalizedTerm)}${endBoundary}`).test(searchable);
}

function createFlexiblePhrasePattern(value) {
  return value
    .split(/[\s._/-]+/)
    .filter(Boolean)
    .map(escapeRegExp)
    .join("[\\s._/-]*")
    .replace(/([a-z])(\d)/gi, "$1[\\s._/-]*$2")
    .replace(/(\d)([a-z])/gi, "$1[\\s._/-]*$2");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;",
  }[character]));
}

function compareListings(a, b) {
  if (sortMode === "price-asc") return a.price - b.price;
  if (sortMode === "price-desc") return b.price - a.price;
  if (sortMode === "source") return labelForSource(a.source).localeCompare(labelForSource(b.source)) || new Date(b.listedAt) - new Date(a.listedAt);
  return new Date(b.listedAt) - new Date(a.listedAt);
}

function createSourceBreakdown(sourceStats) {
  if (sourceStats.length === 0) return "";

  const parts = sourceStats.map((item) => {
    if (item.status === "manual") return `${labelForSource(item.source)} Assist`;
    if (item.status === "pending") return `${labelForSource(item.source)} pending setup`;
    return `${labelForSource(item.source)} ${item.rawCount}`;
  });
  return ` from ${parts.join(", ")}`;
}

function createLiveSourceLabel(meta = {}, fallback = "") {
  const sourceStats = Array.isArray(meta.sourceStats) ? meta.sourceStats : [];
  if (sourceStats.length > 0) {
    const labels = sourceStats.map((item) => {
      if (item.status === "manual") return `${labelForSource(item.source)} Assist`;
      if (item.status === "pending") return `${labelForSource(item.source)} pending setup`;
      return labelForSource(item.source);
    });
    return [...new Set(labels)].join(", ");
  }

  const liveSources = Array.isArray(meta.liveSources) ? meta.liveSources : [];
  return liveSources.map(labelForSource).join(", ") || fallback || "live sources";
}

function renderSavedSearches() {
  const profiles = loadProfiles();
  if (profiles.length === 0) {
    savedSearches.innerHTML = `<div class="empty-state">Save your current search to pin it here.</div>`;
    updateQuickSaveSearchButton();
    return;
  }

  savedSearches.innerHTML = "";
  profiles.forEach((profile) => {
    const hydratedProfile = hydrateProfile(profile);
    const homeRegionId = getProfileHomeRegionId(hydratedProfile);
    const isCurrentRegion = homeRegionId === appSettings.regionId;
    const item = document.createElement("div");
    item.className = "saved-search-row";

    const button = document.createElement("button");
    button.className = "saved-search";
    button.type = "button";
    const newCount = hydratedProfile.lastNewCount || 0;
    button.innerHTML = `
      <strong class="saved-search-title"></strong>
      <span class="saved-search-region${isCurrentRegion ? "" : " is-away"}"></span>
      <span class="saved-search-matches">${hydratedProfile.lastMatchCount || 0} matches</span>
      <span class="saved-search-new${newCount === 0 ? " is-empty" : ""}">${newCount} new</span>
    `;
    button.querySelector(".saved-search-title").textContent = hydratedProfile.name;
    button.querySelector(".saved-search-region").textContent = getSavedSearchRegionLabel(hydratedProfile, isCurrentRegion);
    button.addEventListener("click", () => {
      closeSavedSearchPopover();
      handleSavedSearchClick(hydratedProfile, button);
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "saved-search-delete";
    deleteButton.type = "button";
    deleteButton.title = `Delete ${hydratedProfile.name}`;
    deleteButton.setAttribute("aria-label", `Delete saved search ${hydratedProfile.name}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteSavedSearch(hydratedProfile.name));

    item.append(button, deleteButton);
    savedSearches.appendChild(item);
  });
  updateQuickSaveSearchButton();
}

function handleSavedSearchClick(profile, returnFocus = null) {
  const hydratedProfile = hydrateProfile(profile);
  const homeRegionId = getProfileHomeRegionId(hydratedProfile);
  if (homeRegionId !== appSettings.regionId) {
    openSavedRegionChoiceModal(hydratedProfile, returnFocus);
    return;
  }

  activateSavedSearch(hydratedProfile, { regionId: homeRegionId });
}

function openSavedRegionChoiceModal(profile, returnFocus = null) {
  if (!savedRegionChoiceModal) return;

  pendingSavedRegionProfile = hydrateProfile(profile);
  savedRegionChoiceReturnFocus = returnFocus || document.activeElement;
  const homeRegionId = getProfileHomeRegionId(pendingSavedRegionProfile);
  const homeRegion = getRegionById(homeRegionId);
  const currentRegion = getActiveRegion();
  savedRegionChoiceDescription.textContent = `"${pendingSavedRegionProfile.name}" was saved in ${homeRegion.label}. You can run it in ${homeRegion.label}, explore it in ${currentRegion.label}, or save a ${currentRegion.label} variant.`;
  runSavedHomeRegionButton.textContent = `Run in ${homeRegion.label}`;
  runSavedCurrentRegionButton.textContent = `Run in ${currentRegion.label}`;
  duplicateSavedCurrentRegionButton.textContent = `Duplicate for ${currentRegion.label}`;
  savedRegionChoiceModal.hidden = false;
  document.body.classList.add("modal-open");
  updateMobileSearchOverlayVisibility();
  runSavedCurrentRegionButton.focus();
}

function closeSavedRegionChoiceModal(options = {}) {
  const { restoreFocus = true } = options;
  if (!savedRegionChoiceModal || savedRegionChoiceModal.hidden) return;
  savedRegionChoiceModal.hidden = true;
  document.body.classList.remove("modal-open");
  updateMobileSearchOverlayVisibility();
  if (restoreFocus) savedRegionChoiceReturnFocus?.focus?.();
  savedRegionChoiceReturnFocus = null;
  pendingSavedRegionProfile = null;
}

function activateSavedSearch(profile, options = {}) {
  const targetRegionId = sanitizeRegionId(options.regionId || getProfileHomeRegionId(profile));
  const duplicate = Boolean(options.duplicate);
  const regionChanged = targetRegionId !== appSettings.regionId;
  if (regionChanged) {
    applyActiveRegion(targetRegionId);
  }

  currentProfile = createProfileForRegion(profile, targetRegionId, { duplicate });
  if (duplicate) {
    currentProfile = saveProfile(currentProfile);
    renderSavedSearches();
    queueSavedSearchAutoSync("duplicate-region-search");
  }

  fillForm(currentProfile);
  setActiveTitle(currentProfile.name);
  closeSavedRegionChoiceModal({ restoreFocus: false });
  runSearch();
}

function applyActiveRegion(regionId) {
  const nextRegion = getRegionById(regionId);
  appSettings = {
    ...appSettings,
    regionId: nextRegion.id,
    currency: nextRegion.currency || appSettings.currency,
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  if (regionSelect) regionSelect.value = nextRegion.id;
  resetRegionRuntimeState();
  renderSources();
  updateRegionBadge();
  renderSourceFilters();
  renderRefineSummary();
  renderSavedSearches();
  pushCloudProfilePreferences({ silent: true });
}

function resetRegionRuntimeState() {
  qualityFilter = appSettings.gearMode ? "clean" : "all";
  activeViewSources.clear();
  pendingSourceIds = new Set();
  sourceSearchStatuses = new Map();
  sourceSearchMeta = new Map();
  resetFreshFindRegionState();
  resetBrowseCategoryRegionState();
}

function resetBrowseCategoryRegionState() {
  if (browseCategorySelectionTimer) {
    window.clearTimeout(browseCategorySelectionTimer);
    browseCategorySelectionTimer = 0;
  }
  cancelBrowseCategoryLoad();
  browseCategoryIntent = sanitizeCategoryIntent(browseCategoryIntent, appSettings.regionId);
  browseCategoryListings = [];
  browseCategoryStatus = "idle";
  browseCategoryError = "";
  browseCategoryCacheSignature = "";
  browseCategoryUpdatedAt = "";
}

function createProfileForRegion(profile, targetRegionId, options = {}) {
  const hydratedProfile = hydrateProfile(profile);
  const homeRegionId = getProfileHomeRegionId(hydratedProfile);
  const targetSources = getRegionSourceIds(targetRegionId);
  const regionChanged = homeRegionId !== targetRegionId;
  const homeDefaultMaxPrice = getRegionDefaultMaxPrice(homeRegionId);
  const targetDefaultMaxPrice = getRegionDefaultMaxPrice(targetRegionId);
  const shouldUseTargetPrice = regionChanged || Number(hydratedProfile.maxPrice || 0) === homeDefaultMaxPrice;
  const name = options.duplicate
    ? createUniqueSavedSearchName(createRegionVariantName(hydratedProfile.name, targetRegionId))
    : hydratedProfile.name;

  return hydrateProfile({
    ...hydratedProfile,
    id: options.duplicate ? "" : hydratedProfile.id,
    name,
    regionId: targetRegionId,
    sources: targetSources,
    maxPrice: shouldUseTargetPrice ? targetDefaultMaxPrice : hydratedProfile.maxPrice,
    lastScannedAt: options.duplicate ? "" : hydratedProfile.lastScannedAt,
    lastMatchCount: options.duplicate ? 0 : hydratedProfile.lastMatchCount,
    lastNewCount: options.duplicate ? 0 : hydratedProfile.lastNewCount,
    lastSourceCount: options.duplicate ? 0 : hydratedProfile.lastSourceCount,
    lastScanStatus: options.duplicate ? "" : hydratedProfile.lastScanStatus,
    sync: options.duplicate ? { provider: "local", status: "local" } : hydratedProfile.sync,
  });
}

function createRegionVariantName(name, regionId) {
  const region = getRegionById(regionId);
  const suffix = ` · ${region.label}`;
  return name.endsWith(suffix) ? name : `${name}${suffix}`;
}

function createUniqueSavedSearchName(baseName) {
  const existingNames = new Set(loadProfiles().map((profile) => normalizeText(profile.name)));
  if (!existingNames.has(normalizeText(baseName))) return baseName;

  let index = 2;
  while (existingNames.has(normalizeText(`${baseName} ${index}`))) index += 1;
  return `${baseName} ${index}`;
}

function getProfileHomeRegionId(profile = {}) {
  const hydratedRegionId = profile.regionId || inferRegionIdFromSources(profile.sources);
  return sanitizeRegionId(hydratedRegionId || defaultSettings.regionId);
}

function getSavedSearchRegionLabel(profile, isCurrentRegion) {
  const label = getRegionById(getProfileHomeRegionId(profile)).label;
  return isCurrentRegion ? label : `Saved in ${label}`;
}

function saveProfile(profile) {
  return savedSearchRepository.save(profile);
}

function deleteSavedSearch(profileName) {
  const confirmed = window.confirm(`Delete saved search "${profileName}"?`);
  if (!confirmed) return;

  savedSearchRepository.deleteByName(profileName);
  deleteSavedSearchArtifacts(profileName);
  renderSavedSearches();
  updateQuickSaveSearchButton();
  queueSavedSearchAutoSync("delete-search", { allowEmpty: true });
}

function deleteSavedSearchArtifacts(profileName) {
  const profileKey = normalizeText(profileName);
  const feedbackRules = loadFeedbackRules();
  delete feedbackRules[profileKey];
  saveFeedbackRules(feedbackRules);

  const ledger = loadLedger();
  Object.values(ledger).forEach((entry) => {
    if (!Array.isArray(entry.profileNames)) return;
    entry.profileNames = entry.profileNames.filter((name) => name !== profileName);
  });
  saveLedger(ledger);
}

function updateStoredProfileScan(profile, scanSummary) {
  savedSearchRepository.updateScan(profile, scanSummary);
}

function loadProfiles() {
  return savedSearchRepository.list();
}

function createSavedSearchRepository({ storageKey }) {
  function list() {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return [];

    try {
      const parsedProfiles = JSON.parse(raw);
      if (!Array.isArray(parsedProfiles)) return [];

      const validProfiles = parsedProfiles.filter((profile) => profile && typeof profile === "object");
      const hydratedProfiles = validProfiles.map(hydrateProfile);
      if (shouldMigrateStoredProfiles(parsedProfiles) || validProfiles.length !== parsedProfiles.length) {
        try {
          write(hydratedProfiles);
        } catch (error) {
          if (!isStorageQuotaError(error)) throw error;
          console.warn("Saved searches loaded, but local storage quota prevented migration cleanup.", error);
        }
      }
      return hydratedProfiles;
    } catch {
      return [];
    }
  }

  function write(profiles) {
    const hydratedProfiles = profiles
      .filter((profile) => profile && typeof profile === "object")
      .map(hydrateProfile);
    writeStoredProfiles(storageKey, hydratedProfiles);
    return hydratedProfiles;
  }

  function save(profile) {
    const savedAt = new Date().toISOString();
    const existingProfiles = list();
    const existingProfile = existingProfiles.find((item) => item.name === profile.name);
    const hydratedProfile = hydrateProfile({
      ...existingProfile,
      ...profile,
      id: profile.id || existingProfile?.id,
      createdAt: profile.createdAt || existingProfile?.createdAt || savedAt,
      updatedAt: savedAt,
      sync: {
        ...existingProfile?.sync,
        ...profile.sync,
        status: "local",
        lastLocalChangeAt: savedAt,
      },
    });
    const profiles = existingProfiles.filter((item) => item.name !== hydratedProfile.name);
    write([hydratedProfile, ...profiles]);
    return hydratedProfile;
  }

  function deleteByName(profileName) {
    const nextProfiles = list().filter((item) => item.name !== profileName);
    write(nextProfiles);
    return nextProfiles;
  }

  function updateScan(profile, scanSummary) {
    const scannedAt = scanSummary.lastScannedAt || new Date().toISOString();
    const nextProfiles = list().map((item) => {
      if (item.name !== profile.name) return item;
      return hydrateProfile({
        ...item,
        ...scanSummary,
        updatedAt: scannedAt,
        sync: {
          ...item.sync,
          status: "local",
          lastLocalChangeAt: scannedAt,
        },
      });
    });

    write(nextProfiles);
    return nextProfiles;
  }

  function previewMerge(importedProfiles, options = {}) {
    const existingProfiles = list();
    const duplicateCount = importedProfiles.filter((profile) => findMatchingSavedSearch(existingProfiles, profile)).length;
    if (options.preferNewest) {
      const mergedProfiles = [];

      [...importedProfiles, ...existingProfiles].forEach((profile) => {
        const duplicateIndex = mergedProfiles.findIndex((candidate) => findMatchingSavedSearch([candidate], profile));
        if (duplicateIndex === -1) {
          mergedProfiles.push(profile);
          return;
        }

        const existingProfile = mergedProfiles[duplicateIndex];
        if (isTimestampAfter(profile.updatedAt, existingProfile.updatedAt)) {
          mergedProfiles[duplicateIndex] = profile;
        }
      });

      return {
        duplicateCount,
        mergedProfiles,
      };
    }

    const importedKeys = new Set(importedProfiles.flatMap(getSavedSearchMergeKeys));
    const mergedProfiles = [
      ...importedProfiles,
      ...existingProfiles.filter((profile) => !getSavedSearchMergeKeys(profile).some((key) => importedKeys.has(key))),
    ];

    return {
      duplicateCount,
      mergedProfiles,
    };
  }

  function createExportPayload() {
    return {
      app: "Brrtz",
      type: "saved-searches",
      schemaVersion: SAVED_SEARCH_SCHEMA_VERSION,
      storage: "local",
      exportedAt: new Date().toISOString(),
      profiles: list(),
    };
  }

  return {
    provider: "local",
    list,
    save,
    deleteByName,
    updateScan,
    replaceAll: write,
    previewMerge,
    createExportPayload,
  };
}

function shouldMigrateStoredProfiles(profiles) {
  return profiles.some((profile) => !profile
    || !profile.id
    || !profile.schemaVersion
    || !profile.userId
    || !profile.regionId
    || !profile.createdAt
    || !profile.updatedAt
    || !profile.sync);
}

function writeStoredProfiles(storageKey, profiles) {
  const payload = JSON.stringify(profiles.map(hydrateProfile));

  try {
    localStorage.setItem(storageKey, payload);
  } catch (error) {
    if (!isStorageQuotaError(error)) throw error;
    reclaimSavedSearchStorageSpace();
    try {
      localStorage.setItem(storageKey, payload);
    } catch (retryError) {
      if (!isStorageQuotaError(retryError)) throw retryError;
      throw new Error("Browser storage is full. Brrtz cleared search-result cache space, but the saved-search backup still could not fit.");
    }
  }
}

function reclaimSavedSearchStorageSpace() {
  trimListingLedger(250);
  trimStoredSet(STORAGE_KEYS.seen, 1000);
}

function trimListingLedger(maxEntries) {
  const ledger = loadLedger();
  const entries = Object.entries(ledger)
    .sort(([, first], [, second]) => new Date(second.lastFoundAt || second.listedAt || 0) - new Date(first.lastFoundAt || first.listedAt || 0))
    .slice(0, maxEntries);
  localStorage.setItem(STORAGE_KEYS.listingLedger, JSON.stringify(Object.fromEntries(entries)));
}

function trimStoredSet(storageKey, maxItems) {
  const values = loadSet(storageKey);
  if (!Array.isArray(values) || values.length <= maxItems) return;
  localStorage.setItem(storageKey, JSON.stringify(values.slice(-maxItems)));
}

function isStorageQuotaError(error) {
  const isDomException = typeof DOMException !== "undefined" && error instanceof DOMException;
  return isDomException
    && (error.name === "QuotaExceededError"
      || error.name === "NS_ERROR_DOM_QUOTA_REACHED"
      || error.code === 22
      || error.code === 1014);
}

function createFreshProfile() {
  const regionSources = getRegionSourceIds();
  return hydrateProfile({
    ...defaultProfile,
    name: "New Search",
    regionId: appSettings.regionId,
    terms: [],
    categoryIntent: getRegionDefaultCategoryIntent(appSettings.regionId),
    maxPrice: getRegionDefaultMaxPrice(),
    sources: regionSources,
  });
}

function hydrateProfile(profile = {}) {
  const fallbackTimestamp = new Date().toISOString();
  const createdAt = isIsoTimestamp(profile.createdAt) ? profile.createdAt : fallbackTimestamp;
  const updatedAt = isIsoTimestamp(profile.updatedAt) ? profile.updatedAt : createdAt;
  const scanSummary = hydrateSavedSearchScanSummary(profile);
  const regionId = sanitizeRegionId(profile.regionId || inferRegionIdFromSources(profile.sources) || defaultSettings.regionId);

  return {
    id: isNonEmptyString(profile.id) ? profile.id : createSavedSearchId(profile),
    schemaVersion: Number(profile.schemaVersion) || SAVED_SEARCH_SCHEMA_VERSION,
    userId: isNonEmptyString(profile.userId) ? profile.userId : LOCAL_PROFILE_USER_ID,
    name: isNonEmptyString(profile.name) ? profile.name.trim() : defaultProfile.name,
    regionId,
    terms: cleanStringArray(profile.terms, defaultProfile.terms),
    excludes: cleanStringArray(profile.excludes, defaultProfile.excludes),
    noiseTerms: cleanStringArray(profile.noiseTerms, ACCESSORY_TERMS),
    categoryIntent: sanitizeCategoryIntent(profile.categoryIntent, regionId),
    maxPrice: sanitizePriceCap(profile.maxPrice, defaultProfile.maxPrice),
    alertMode: ["immediate", "hourly", "daily"].includes(profile.alertMode) ? profile.alertMode : defaultProfile.alertMode,
    sources: hydrateSourceSelection(profile.sources, regionId),
    createdAt,
    updatedAt,
    deletedAt: isIsoTimestamp(profile.deletedAt) ? profile.deletedAt : null,
    sync: hydrateSavedSearchSync(profile.sync, updatedAt),
    ...scanSummary,
  };
}

function inferRegionIdFromSources(sources = []) {
  if (!Array.isArray(sources) || sources.length === 0) return "";

  const selectedSources = new Set(sources);
  const regionScores = getSelectableRegions().map((region) => {
    const regionSources = getRegionSourceIds(region.id);
    const score = regionSources.filter((sourceId) => selectedSources.has(sourceId)).length;
    return { region, score };
  }).filter((item) => item.score > 0);

  if (regionScores.length === 0) return "";
  regionScores.sort((first, second) => second.score - first.score);
  return regionScores[0].region.id;
}

function hydrateSavedSearchScanSummary(profile = {}) {
  return {
    lastScannedAt: isIsoTimestamp(profile.lastScannedAt) ? profile.lastScannedAt : "",
    lastMatchCount: sanitizeCount(profile.lastMatchCount),
    lastNewCount: sanitizeCount(profile.lastNewCount),
    lastSourceCount: sanitizeCount(profile.lastSourceCount),
    lastScanStatus: isNonEmptyString(profile.lastScanStatus) ? profile.lastScanStatus : "",
  };
}

function hydrateSavedSearchSync(sync = {}, updatedAt = new Date().toISOString()) {
  return {
    provider: isNonEmptyString(sync.provider) ? sync.provider : "local",
    remoteId: isNonEmptyString(sync.remoteId) ? sync.remoteId : null,
    status: isNonEmptyString(sync.status) ? sync.status : "local",
    lastSyncedAt: isIsoTimestamp(sync.lastSyncedAt) ? sync.lastSyncedAt : null,
    lastLocalChangeAt: isIsoTimestamp(sync.lastLocalChangeAt) ? sync.lastLocalChangeAt : updatedAt,
  };
}

function createSavedSearchId(profile = {}) {
  if (globalThis.crypto?.randomUUID) return `search_${globalThis.crypto.randomUUID()}`;

  const seed = `${profile.name || "search"}-${Date.now()}-${Math.random()}`;
  return `search_${normalizeText(seed).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
}

function cleanStringArray(values, fallback = []) {
  const sourceValues = Array.isArray(values) ? values : fallback;
  const seen = new Set();
  return sourceValues
    .filter((value) => typeof value === "string")
    .map((value) => value.trim())
    .filter((value) => {
      if (!value) return false;
      const key = normalizeText(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function sanitizePriceCap(value, fallback) {
  const price = Number(value);
  return Number.isFinite(price) && price >= 0 ? price : fallback;
}

function sanitizeCount(value) {
  const count = Number(value);
  return Number.isFinite(count) && count > 0 ? Math.round(count) : 0;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getErrorMessage(error) {
  return error instanceof Error ? error.message : String(error || "Unknown error");
}

function isIsoTimestamp(value) {
  return typeof value === "string" && !Number.isNaN(Date.parse(value));
}

function hydrateSourceSelection(sources, regionId = appSettings?.regionId) {
  const fallbackSources = getRegionSourceIds(regionId);
  if (!Array.isArray(sources)) return fallbackSources;

  const knownSourceIds = SOURCES.map((source) => source.id);
  const selectedSources = sources.filter((source) => knownSourceIds.includes(source));
  const hadEveryLegacyDefault = LEGACY_DEFAULT_SOURCE_IDS.every((source) => selectedSources.includes(source));

  if (getRegionById(regionId).id === "japan" && hadEveryLegacyDefault) {
    ["reverb", "jimoty"].forEach((source) => {
      if (!selectedSources.includes(source)) selectedSources.push(source);
    });
  }

  const dedupedSources = [...new Set(selectedSources)];
  return dedupedSources.length > 0 ? dedupedSources : fallbackSources;
}

function hydrateRegionSources(sourceIds = []) {
  const knownSourceIds = new Set(SOURCES.map((source) => source.id));
  const regionSources = Array.isArray(sourceIds)
    ? sourceIds.filter((sourceId) => knownSourceIds.has(sourceId))
    : [];

  return regionSources.length > 0 ? regionSources : ACTIVE_REGION.sources;
}

function loadSettings() {
  try {
    return hydrateSettings(JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "{}"));
  } catch {
    return { ...defaultSettings };
  }
}

function hydrateSettings(settings) {
  const rate = Number(settings.jpyPerUsd);
  const regionId = sanitizeRegionId(settings.regionId || defaultSettings.regionId);
  const region = getRegionById(regionId);
  const requestedCurrency = settings.currency === "USD" ? "USD" : settings.currency === "JPY" ? "JPY" : "";
  const brandGradient = normalizeBrandGradient(settings.brandGradient) || { ...DEFAULT_BRAND_GRADIENT };
  return {
    regionId,
    currency: requestedCurrency || region.currency || defaultSettings.currency,
    jpyPerUsd: Number.isFinite(rate) && rate > 0 ? rate : defaultSettings.jpyPerUsd,
    resultView: sanitizeResultView(settings.resultView),
    gearMode: settings.gearMode === false ? false : true,
    brandGradient,
  };
}

function getActiveNoiseTerms() {
  const savedNoise = currentProfile.noiseTerms || [];
  return uniqueTerms([...ACCESSORY_TERMS, ...savedNoise]);
}

function expandSearchTerm(term) {
  const expanded = [term];
  const matchTerm = parseMatchTerm(term);

  if (!matchTerm.exact) {
    const normalized = normalizeText(matchTerm.value);
    const aliases = SEARCH_TERM_ALIASES[normalized] || [];
    expanded.push(...aliases);
  }

  return uniqueTerms(expanded);
}

function createSearchContext(terms) {
  const cleanedTerms = uniqueTerms(terms);
  const primaryTerm = cleanedTerms[0] || "";
  if (!primaryTerm) return { primaryTerms: [], refinementTerms: [], sourceTerms: [] };

  const primaryTerms = expandSearchTerm(primaryTerm);
  const refinementTerms = [];

  cleanedTerms.slice(1).forEach((term) => {
    if (isEquivalentSearchTerm(term, primaryTerms)) {
      primaryTerms.push(...expandSearchTerm(term));
    } else {
      refinementTerms.push(...expandSearchTerm(term));
    }
  });

  const uniquePrimaryTerms = uniqueTerms(primaryTerms);
  const uniqueRefinementTerms = uniqueTerms(refinementTerms);
  const sourceTerms = uniqueRefinementTerms.length === 0
    ? uniquePrimaryTerms
    : uniquePrimaryTerms.flatMap((primary) => uniqueRefinementTerms.map((refinement) => `${parseMatchTerm(primary).value} ${parseMatchTerm(refinement).value}`));

  return {
    primaryTerms: uniquePrimaryTerms,
    refinementTerms: uniqueRefinementTerms,
    sourceTerms: uniqueTerms(sourceTerms),
  };
}

function isEquivalentSearchTerm(term, primaryTerms) {
  const normalized = normalizeText(parseMatchTerm(term).value);
  return primaryTerms.some((primaryTerm) => normalizeText(parseMatchTerm(primaryTerm).value) === normalized);
}

function listingMatchesSearchContext(listing, searchContext) {
  if (searchContext.primaryTerms.length === 0) return false;
  if (SOURCE_SEARCH_CONTEXT_TRUST_IDS.has(listing.source) && listing.searchContextVerified) return true;

  const searchable = getListingSearchContextText(listing);
  const matchesPrimary = searchContext.primaryTerms.some((term) => termMatches(searchable, term));
  const matchesRefinement = searchContext.refinementTerms.length === 0
    || searchContext.refinementTerms.some((term) => termMatches(searchable, term));

  return matchesPrimary && matchesRefinement;
}

function getListingSearchContextText(listing) {
  if (!CATEGORY_SEARCH_CONTEXT_IDS.has(listing.source)) return normalizeText(listing.title);

  return normalizeText([
    listing.title,
    listing.condition,
    ...(Array.isArray(listing.categoryPath) ? listing.categoryPath : []),
  ].filter(Boolean).join(" "));
}

function createSourceSearchTerms(terms) {
  return uniqueTerms(terms.flatMap((term) => createSourceSearchTermVariants(parseMatchTerm(term).value)));
}

function createSourceSearchTermVariants(term) {
  const value = String(term || "").trim();
  if (!value) return [];

  const variants = [value];
  const compactableSeparatorPattern = /([a-zA-Z])[\s._/-]+(\d)/g;
  if (compactableSeparatorPattern.test(value)) {
    variants.push(value.replace(/([a-zA-Z])[\s._/-]+(\d)/g, "$1-$2"));
    variants.push(value.replace(/([a-zA-Z])[\s._/-]+(\d)/g, "$1$2"));
  }
  const compactModelPattern = /([a-zA-Z]+)(\d+)/g;
  if (compactModelPattern.test(value)) {
    variants.push(value.replace(/([a-zA-Z]+)(\d+)/g, "$1-$2"));
    variants.push(value.replace(/([a-zA-Z]+)(\d+)/g, "$1 $2"));
  }
  return variants;
}

function createLooseWordTerms(value) {
  return String(value || "")
    .normalize("NFKC")
    .split(/[\s/+|・,、]+/)
    .map((term) => term.trim())
    .filter((term) => {
      const normalized = normalizeText(term);
      return normalized.length >= 2 || /^\d+$/.test(normalized);
    });
}

function uniqueTerms(terms) {
  const seen = new Set();
  return terms.filter((term) => {
    const matchTerm = parseMatchTerm(term);
    const normalizedValue = normalizeText(matchTerm.value);
    if (!normalizedValue) return false;
    const key = `${matchTerm.exact ? "exact:" : "term:"}${normalizedValue}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function loadSet(key) {
  try {
    return normalizeStoredList(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    return [];
  }
}

function hasWatchedListings() {
  return loadSet(STORAGE_KEYS.watching).length > 0;
}

function saveSet(key, values) {
  localStorage.setItem(key, JSON.stringify(normalizeStoredList(values)));
}

function normalizeStoredList(values) {
  const sourceValues = values instanceof Set
    ? [...values]
    : Array.isArray(values)
      ? values
      : values && typeof values !== "string" && typeof values[Symbol.iterator] === "function"
        ? [...values]
        : [];
  const seen = new Set();

  return sourceValues
    .map((value) => String(value || "").trim())
    .filter((value) => {
      if (!value || seen.has(value)) return false;
      seen.add(value);
      return true;
    });
}

function loadLedger() {
  try {
    return sanitizeListingLedger(JSON.parse(localStorage.getItem(STORAGE_KEYS.listingLedger) || "{}"));
  } catch {
    return {};
  }
}

function sanitizeListingLedger(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([id, entry]) => typeof id === "string" && id.trim() && entry && typeof entry === "object" && !Array.isArray(entry))
      .map(([id, entry]) => [id, sanitizeListingLedgerEntry(id, entry)])
  );
}

function sanitizeListingLedgerEntry(id, entry) {
  return {
    ...entry,
    id: typeof entry.id === "string" && entry.id.trim() ? entry.id : id,
    source: typeof entry.source === "string" ? entry.source : "",
    title: typeof entry.title === "string" ? entry.title : "",
    url: typeof entry.url === "string" ? entry.url : "",
    image: typeof entry.image === "string" ? entry.image : "",
    shop: typeof entry.shop === "string" ? entry.shop : "",
    condition: typeof entry.condition === "string" ? entry.condition : "",
    availability: typeof entry.availability === "string" ? entry.availability : "",
    itemStatus: typeof entry.itemStatus === "string" ? entry.itemStatus : "",
    categoryId: typeof entry.categoryId === "string" ? entry.categoryId : "",
    categoryPath: cleanStringArray(entry.categoryPath),
    profileNames: normalizeStoredList(entry.profileNames),
  };
}

function saveLedger(ledger) {
  try {
    localStorage.setItem(STORAGE_KEYS.listingLedger, JSON.stringify(sanitizeListingLedger(ledger)));
  } catch (error) {
    if (!isStorageQuotaError(error)) throw error;
    const entries = Object.entries(ledger)
      .sort(([, first], [, second]) => new Date(second.lastFoundAt || second.listedAt || 0) - new Date(first.lastFoundAt || first.listedAt || 0))
      .slice(0, 250);
    localStorage.setItem(STORAGE_KEYS.listingLedger, JSON.stringify(sanitizeListingLedger(Object.fromEntries(entries))));
  }
}

function getNewDiscoveryIds(listings, ledger = loadLedger()) {
  return new Set(listings.filter((listing) => !ledger[listing.id]).map((listing) => listing.id));
}

function getNewForSearchIds(profile, listings, ledger = loadLedger()) {
  const profileName = profile?.name || "";
  if (!profileName) return new Set();

  return new Set(listings
    .filter((listing) => {
      const entry = ledger[listing.id];
      if (!entry || isListingAcknowledged(entry)) return false;
      return !normalizeStoredList(entry.profileNames).includes(profileName);
    })
    .map((listing) => listing.id));
}

function recordListingDiscoveries(profile, listings) {
  const ledger = loadLedger();
  const now = new Date().toISOString();

  listings.forEach((listing) => {
    ledger[listing.id] = createLedgerEntry(listing, ledger[listing.id], {
      lastFoundAt: now,
      profileName: profile.name,
    });
  });

  saveLedger(ledger);
}

function recordListingSnapshot(listing) {
  const ledger = loadLedger();
  ledger[listing.id] = createLedgerEntry(listing, ledger[listing.id], {
    lastFoundAt: ledger[listing.id]?.lastFoundAt || new Date().toISOString(),
    profileName: currentProfile.name,
  });
  saveLedger(ledger);
}

function createLedgerEntry(listing, previous = {}, options = {}) {
  const now = new Date().toISOString();
  const profileNames = new Set(normalizeStoredList(previous.profileNames));
  if (options.profileName) profileNames.add(options.profileName);
  const lastSeenAt = options.lastFoundAt || now;
  const unavailable = isUnavailableListing(listing);

  return {
    ...previous,
    id: listing.id,
    source: listing.source,
    title: listing.title,
    price: listing.price,
    url: listing.url,
    image: listing.image,
    shop: listing.shop || previous.shop || "",
    condition: listing.condition || previous.condition || "",
    availability: listing.availability || previous.availability || "",
    itemStatus: listing.itemStatus || previous.itemStatus || "",
    categoryId: listing.categoryId || previous.categoryId || "",
    categoryPath: Array.isArray(listing.categoryPath) ? listing.categoryPath : previous.categoryPath || [],
    listedAt: listing.listedAt || previous.listedAt || "",
    firstDiscoveredAt: previous.firstDiscoveredAt || now,
    firstSeenAt: previous.firstSeenAt || previous.firstDiscoveredAt || now,
    lastFoundAt: options.lastFoundAt || previous.lastFoundAt || now,
    lastSeenAt,
    lastVerifiedAt: lastSeenAt,
    freshnessStatus: unavailable ? "unavailable" : "active",
    profileNames: [...profileNames],
  };
}

function acknowledgeListings(listings, options = {}) {
  const ledger = loadLedger();
  const now = new Date().toISOString();

  listings.forEach((listing) => {
    if (!listing?.id) return;
    ledger[listing.id] = createLedgerEntry(listing, ledger[listing.id], {
      lastFoundAt: ledger[listing.id]?.lastFoundAt || now,
      profileName: currentProfile.name,
    });
    ledger[listing.id].acknowledgedAt = ledger[listing.id].acknowledgedAt || now;
    if (options.viewed) ledger[listing.id].viewedAt = now;
    if (options.dismissed) ledger[listing.id].dismissedAt = now;
    if (options.watched) ledger[listing.id].watchedAt = now;
    currentDiscoveryIds.delete(listing.id);
    currentNewForSearchIds.delete(listing.id);
  });

  saveLedger(ledger);
}

function applyStoredTheme() {
  const storedTheme = localStorage.getItem(STORAGE_KEYS.theme);
  const systemPrefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  setTheme(storedTheme || (systemPrefersDark ? "dark" : "light"));
}

function setTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE_KEYS.theme, theme);

  const isDark = theme === "dark";
  const themeIcon = themeToggle?.querySelector(".theme-icon");
  if (themeIcon) themeIcon.textContent = isDark ? "☀" : "◐";
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle?.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
  if (themeSettingsToggle) themeSettingsToggle.checked = isDark;
}

function isSeen(listingId) {
  return loadSet(STORAGE_KEYS.seen).includes(listingId);
}

function normalizeText(value) {
  return value.toLocaleLowerCase("ja-JP").normalize("NFKC");
}

function formatPrice(value) {
  const nativeCurrency = getActiveRegion().currency === "USD" ? "USD" : "JPY";

  if (appSettings.currency === "USD") {
    const usdValue = nativeCurrency === "USD" ? value : value / appSettings.jpyPerUsd;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(usdValue);
  }

  const jpyValue = nativeCurrency === "USD" ? value * appSettings.jpyPerUsd : value;
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(jpyValue);
}

function relativeDate(value) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(new Date(value));
}

function formatShortDate(value) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return formatter.format(new Date(value));
}

function createEmailDigest(profile, listings) {
  if (listings.length === 0) {
    return `Brrtz: ${profile.name}\n\nNo new listings.`;
  }

  const lines = listings.map((listing) => {
    const source = SOURCES.find((item) => item.id === listing.source)?.label || listing.source;
    return `${listing.title}\n${formatPrice(listing.price)} · ${source}\n${listing.url}`;
  });

  return `Brrtz: ${profile.name}\nAlert mode: ${profile.alertMode}\n\n${lines.join("\n\n")}`;
}

async function copyText(value) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const field = document.createElement("textarea");
  field.value = value;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  document.execCommand("copy");
  document.body.removeChild(field);
}

initialize();
