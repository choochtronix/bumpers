const SOURCES = [
  { id: "mercari", label: "Mercari", icon: "Me", color: "rose", logo: "assets/logos/ICONS/mercari_ic.svg" },
  { id: "yahoo-auctions", label: "Yahoo Auctions", icon: "Y!", color: "amber", logo: "assets/logos/ICONS/yahoo_ic.svg" },
  { id: "yahoo-fleamarket", label: "Yahoo Fleamarket", icon: "Yf", color: "blue", logo: "assets/logos/ICONS/yahoo_flea_ic.svg" },
  { id: "rakuma", label: "Rakuma", icon: "Ra", color: "green", logo: "assets/logos/ICONS/rakuma_ic.svg" },
  { id: "digimart", label: "Digimart", icon: "D", color: "blue" },
  { id: "reverb", label: "Reverb", icon: "Rv", color: "orange" },
  { id: "reverb-us", label: "Reverb US", icon: "Rv", color: "orange" },
  { id: "ebay-us", label: "eBay US", icon: "eB", color: "blue" },
  { id: "craigslist-sfbay", label: "Craigslist SF", icon: "SF", color: "purple" },
  { id: "craigslist-la", label: "Craigslist LA", icon: "LA", color: "purple" },
  { id: "jimoty", label: "Jimoty", icon: "Jm", color: "orange" },
  { id: "offmall", label: "OFFMALL", icon: "O", color: "green", logo: "assets/logos/ICONS/hardoff-ic.svg" },
  { id: "five-g", label: "Five G", icon: "5G", color: "amber" },
  { id: "implant4", label: "implant4", icon: "i4", color: "rose" },
  { id: "hardoff", label: "Hard Off", icon: "H", color: "green", logo: "assets/logos/ICONS/hardoff-ic.svg" },
];

const LEGACY_DEFAULT_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "offmall", "five-g", "implant4", "hardoff"];
const LIVE_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "reverb", "reverb-us", "ebay-us", "craigslist-sfbay", "craigslist-la", "jimoty", "offmall", "five-g", "implant4", "hardoff"];
const LIVE_SOURCE_DISPLAY_ORDER = ["craigslist-sfbay", "craigslist-la", "reverb-us", "ebay-us", "yahoo-auctions", "yahoo-fleamarket", "digimart", "reverb", "jimoty", "offmall", "five-g", "implant4", "hardoff", "mercari", "rakuma"];
const SOURCE_SEARCH_CONTEXT_TRUST_IDS = new Set(["craigslist-sfbay", "craigslist-la"]);
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
const FEATURED_HOME_ALERT_LIMIT = 6;
const FRESH_FIND_LOADING_CARD_COUNT = 6;
const FRESH_FIND_STALE_HOURS = 72;
const FRESH_FIND_STALE_MS = FRESH_FIND_STALE_HOURS * 60 * 60 * 1000;
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
  "craigslist-sfbay": "--source-craigslist",
  "craigslist-la": "--source-craigslist",
  jimoty: "--source-jimoty",
  offmall: "--source-offmall",
  "five-g": "--source-five-g",
  implant4: "--source-implant4",
  hardoff: "--source-hardoff",
};

const SOURCE_METADATA_ALIASES = {
  mercari: ["Mercari", "メルカリ"],
  "yahoo-auctions": ["Yahoo Auctions", "Yahoo Auction", "ヤフオク"],
  "yahoo-fleamarket": ["Yahoo Fleamarket", "Yahooフリマ", "PayPayフリマ"],
  rakuma: ["Rakuma", "ラクマ"],
  digimart: ["Digimart", "デジマート"],
  reverb: ["Reverb", "Reverb.com"],
  "reverb-us": ["Reverb US", "Reverb", "Reverb.com"],
  "ebay-us": ["eBay US", "eBay", "ebay.com"],
  "craigslist-sfbay": ["Craigslist SF", "Craigslist", "SF Bay Craigslist"],
  "craigslist-la": ["Craigslist LA", "Craigslist Los Angeles", "LA Craigslist"],
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
  "audio interface",
  "desktop",
  "digital",
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
  "module",
  "mpc",
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
  email: "local@bumpers.dev",
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

const defaultSettings = {
  regionId: ACTIVE_REGION.id || "japan",
  currency: ACTIVE_REGION.currency || "JPY",
  jpyPerUsd: 155,
  resultView: "grid",
};

const defaultProfile = {
  name: "Waldorf",
  terms: ["Waldorf", "ワルドルフ", "WALDORF"],
  excludes: ["manual", "magnet", "power cord", "doll", "Fashionist", "shirt", "CD", "Moments to Remember", "record", "shoes"],
  noiseTerms: [...ACCESSORY_TERMS],
  maxPrice: ACTIVE_REGION.searchDefaults?.maxPrice || 2000000,
  alertMode: "immediate",
  sources: hydrateRegionSources(ACTIVE_REGION.sources),
};

let appSettings = loadSettings();
let currentProfile = createFreshProfile();
let currentResults = [];
let currentDiscoveryIds = new Set();
let filterMode = "all";
let qualityFilter = getActiveRegion().searchDefaults?.cleanGear === false ? "all" : "clean";
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
let starterFreshFindStatus = "idle";
let starterFreshFindListings = [];
let starterFreshFindTerms = [];
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
const termsInput = document.querySelector("#terms");
const mobileSearchOverlay = document.querySelector("#mobileSearchOverlay");
const mobileSearchForm = document.querySelector("#mobileSearchForm");
const mobileSearchInput = document.querySelector("#mobileSearchInput");
const refineTermsInput = document.querySelector("#refineTerms");
const termDropdown = document.querySelector("#termDropdown");
const quickSearchExtraTermsButton = document.querySelector("#quickSearchExtraTerms");
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
const refineSearchModal = document.querySelector("#refineSearchModal");
const refineSummary = document.querySelector("#refineSummary");
const saveSearchModal = document.querySelector("#saveSearchModal");
const saveSearchForm = document.querySelector("#saveSearchForm");
const saveSearchName = document.querySelector("#saveSearchName");
const saveSearchAlert = document.querySelector("#saveSearchAlert");
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
const jpyPerUsdInput = document.querySelector("#jpyPerUsd");
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
let savedSearchAutoSyncTimer = 0;
let profileAutoSyncTimer = 0;
let isSavedSearchAutoSyncing = false;
let isProfileAutoSyncing = false;
let eventsBound = false;

function initialize() {
  bindEvents();
  runStartupStep("stored theme", applyStoredTheme);
  runStartupStep("brand wave", initializeBrandWave);
  runStartupStep("sources", renderSources);
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
}

function runStartupStep(label, action) {
  try {
    action();
  } catch (error) {
    console.error(`Brrtz startup step failed: ${label}`, error);
  }
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
  let osc2FadeScheduled = false;

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
    requestAnimationFrame(render);
  }

  function isWaveControlEvent(event) {
    const target = event?.target;
    if (!(target instanceof Element)) return false;
    const interactive = target.closest("button, input, textarea, select, summary, a[href], [role='button'], .saved-popover");
    return Boolean(interactive && !target.closest("#brandHomeLink"));
  }

  async function wake(event) {
    if (isWaveControlEvent(event)) {
      sleep();
      return;
    }

    const clientX = getPointerClientX(event);
    const freshEntry = clientX !== null && hoverStart === null;

    if (clientX !== null) {
      pointerActive = true;
      pointerX = svgX(event);
      if (hoverStart === null) hoverStart = performance.now();
    }

    await initAudio();
    await resumeAudio();
    if (freshEntry) fadeInGain();
    engageAudio();
  }

  function sleep() {
    pointerActive = false;
    hoverStart = null;
    arpMode = false;
    arpSeq = [];
    osc2ArpSeq = [];
    arpIdx = 0;
    releaseAudio();
  }

  const interactionSurface = waveSurface || svg;
  interactionSurface.addEventListener("pointerenter", wake, { passive: true });
  interactionSurface.addEventListener("pointermove", wake, { passive: true });
  interactionSurface.addEventListener("pointerdown", wake, { passive: true });
  interactionSurface.addEventListener("touchstart", wake, { passive: true });
  interactionSurface.addEventListener("pointerleave", sleep);

  document.addEventListener("visibilitychange", async () => {
    if (!audioCtx) return;
    if (document.hidden) {
      await audioCtx.suspend();
      audioReady = false;
    } else {
      await resumeAudio();
    }
  });

  requestAnimationFrame(render);
}

function bindEvents() {
  if (eventsBound) return;

  brandHomeLink.addEventListener("click", resetHomeView);
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!refineSearchModal.hidden) {
      syncRefineTermsToPrimary();
    }
    currentProfile = readProfileFromForm();
    renderRefineSummary();
    closeRefineSearchModal({ restoreFocus: false });
    runSearch();
  });
  termsInput.addEventListener("input", handlePrimaryTermsInput);
  termsInput.addEventListener("keydown", handleQuickSearchKeydown);
  mobileSearchInput?.addEventListener("input", handleMobileSearchInput);
  mobileSearchForm?.addEventListener("submit", handleMobileSearchSubmit);
  refineTermsInput.addEventListener("input", syncRefineTermsToPrimary);
  quickSearchExtraTermsButton?.addEventListener("click", openRefineSearchModal);
  termDropdown.addEventListener("click", handleTermDropdownClick);
  resultGrid.addEventListener("click", handleResultGridAction);
  document.addEventListener("click", closeListingActionMenus);

  document.querySelector("#openRefineSearch").addEventListener("click", openRefineSearchModal);
  document.querySelector("#openResultRefineSearch")?.addEventListener("click", openRefineSearchModal);
  document.querySelector("#closeRefineSearch").addEventListener("click", closeRefineSearchModal);
  document.querySelector("#cancelRefineSearch").addEventListener("click", closeRefineSearchModal);
  document.querySelector("#applyRefineSearch").addEventListener("click", applyRefineSearchOnly);
  refineSearchModal.addEventListener("click", (event) => {
    if (event.target === refineSearchModal) closeRefineSearchModal();
  });
  refineSearchModal.addEventListener("input", renderRefineSummary);
  refineSearchModal.addEventListener("change", renderRefineSummary);

  openSavedSearchesButton.addEventListener("click", toggleSavedSearchPopover);
  document.addEventListener("click", handleSavedPopoverOutsideClick);
  quickSaveSearchButton.addEventListener("click", openSaveSearchModal);
  document.querySelector("#openSaveSearch").addEventListener("click", openSaveSearchModal);
  document.querySelector("#saveProfile").addEventListener("click", openSaveSearchModal);
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
  sendSignInLinkButton?.addEventListener("click", handleAccountSignInShell);
  syncAccountSavedSearchesButton?.addEventListener("click", syncAccountCloudData);
  signOutAccountButton?.addEventListener("click", handleAccountSignOutShell);
  exportSavedSearchesButton.addEventListener("click", exportSavedSearches);
  importSavedSearchesButton.addEventListener("click", () => savedSearchImportFile.click());
  savedSearchImportFile.addEventListener("change", importSavedSearchesFromFile);

  topWatchingFilter.addEventListener("click", toggleWatchingFilter);
  savedWatchingFilter?.addEventListener("click", () => {
    toggleWatchingFilter();
    closeSavedSearchPopover();
  });

  document.querySelector("#markAllSeen").addEventListener("click", () => {
    const seen = new Set(loadSet(STORAGE_KEYS.seen));
    currentResults.forEach((listing) => seen.add(listing.id));
    saveSet(STORAGE_KEYS.seen, seen);
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
    filterMode = button.dataset.filter;
    resetPagination();
    document.querySelectorAll("#urgencyFilter button").forEach((item) => item.classList.toggle("active", item === button));
    renderResults();
  });

  sourceFilterList.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.dataset.source === "all") {
      if (activeViewSources.size > 0) {
        activeViewSources.clear();
      } else {
        isSourceRowExpanded = !isSourceRowExpanded;
      }
      resetPagination();
      renderResults();
      return;
    }
    const sourceId = button.dataset.source || "";
    if (isManualSourceStatus(sourceId)) {
      openManualSourceSearch(sourceId);
      return;
    }
    toggleViewSource(sourceId);
    resetPagination();
    renderResults();
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
    renderResults();
  });

  resultViewButtons.forEach((button) => {
    button.addEventListener("click", () => setResultView(button.dataset.resultView));
  });

  paginationControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page-action]");
    if (!button || button.disabled) return;
    changePage(button.dataset.pageAction);
  });

  themeToggle.addEventListener("click", toggleTheme, { capture: true });

  backToTopButton.addEventListener("click", scrollPageTop);
  window.addEventListener("scroll", requestBackToTopVisibilityUpdate, { passive: true });
  window.addEventListener("scroll", requestMobileSearchOverlayUpdate, { passive: true });
  window.addEventListener("resize", requestMobileSearchOverlayUpdate);

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeSavedSearchPopover();
    if (!refineSearchModal.hidden) closeRefineSearchModal();
    if (!saveSearchModal.hidden) closeSaveSearchModal();
    if (!settingsModal.hidden) closeSettingsModal();
  });

  eventsBound = true;
  window.__brrtzAppReady = true;
}

function resetHomeView(event) {
  event?.preventDefault?.();
  searchRunId += 1;
  currentProfile = createFreshProfile();
  fillForm(currentProfile);
  activeViewSources.clear();
  filterMode = "all";
  document.querySelectorAll("#urgencyFilter button").forEach((item) => item.classList.toggle("active", item.dataset.filter === filterMode));
  currentResults = [];
  currentDiscoveryIds = new Set();
  closeSavedSearchPopover();
  closeRefineSearchModal({ restoreFocus: false });
  closeSaveSearchModal({ restoreFocus: false });
  closeSettingsModal({ restoreFocus: false });
  resetToIdleSearch();
  scrollPageTop();
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

function fillForm(profile) {
  const hydratedProfile = hydrateProfile(profile);
  refineTermsInput.value = hydratedProfile.terms.join("\n");
  renderPrimarySearchTerm();
  document.querySelector("#excludes").value = hydratedProfile.excludes.join("\n");
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
    excludes: splitLines(document.querySelector("#excludes").value),
    noiseTerms: splitLines(document.querySelector("#noiseTerms").value),
    maxPrice: Number(document.querySelector("#maxPrice").value || 0),
    alertMode: document.querySelector("#alertMode").value,
    sources: [...document.querySelectorAll("input[name='sources']:checked")].map((input) => input.value),
  };
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

  const excludesInput = document.querySelector("#excludes");
  if (!excludesInput.value.trim()) return;

  excludesInput.value = "";
}

function openRefineSearchModal(event) {
  refineSearchReturnFocus = event?.currentTarget || document.activeElement;
  if (!refineTermsInput.value.trim()) {
    syncPrimaryTermsToRefine();
  }
  renderRefineSummary();
  refineSearchModal.hidden = false;
  document.body.classList.add("modal-open");
  updateMobileSearchOverlayVisibility();
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

function applyRefineSearchOnly() {
  syncRefineTermsToPrimary();
  currentProfile = readProfileFromForm();
  renderRefineSummary();
  closeRefineSearchModal();
}

function syncPrimaryTermsToRefine() {
  const primaryTerms = splitLines(termsInput.value);
  const nextValue = primaryTerms.join("\n");
  if (refineTermsInput.value === nextValue) return;
  refineTermsInput.value = nextValue;
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  updateQuickSaveSearchButton();
}

function syncRefineTermsToPrimary() {
  renderPrimarySearchTerm();
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  updateQuickSaveSearchButton();
}

function getSearchTermsFromForm() {
  return splitLines(refineTermsInput.value || termsInput.value);
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
  const priceText = profile.maxPrice > 0 ? `${formatPrice(profile.maxPrice)} max` : "No price cap";
  const excludeText = `${profile.excludes.length} excluded`;
  refineSummary.textContent = `${sourceText} · ${priceText} · ${profile.alertMode} · ${excludeText}`;
}

function renderSearchTermsSummary() {
  if (!quickSearchExtraTermsButton) return;

  const terms = getSearchTermsFromForm();
  const primaryTerm = terms[0] || "Search terms";
  const extraCount = Math.max(0, terms.length - 1);

  termsInput.closest(".search-terms-field")?.classList.toggle("has-extra-terms", extraCount > 0);
  quickSearchExtraTermsButton.hidden = extraCount === 0;
  quickSearchExtraTermsButton.textContent = `+${extraCount} ${extraCount === 1 ? "term" : "terms"}`;
  quickSearchExtraTermsButton.setAttribute("aria-label", `Edit ${extraCount} additional search ${extraCount === 1 ? "term" : "terms"} for ${primaryTerm}`);
  quickSearchExtraTermsButton.title = "Edit additional terms";
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

function openSavedSearchPopover() {
  renderSavedSearches();
  savedSearchPopover.hidden = false;
  openSavedSearchesButton.setAttribute("aria-expanded", "true");
}

function closeSavedSearchPopover() {
  if (savedSearchPopover.hidden) return;
  savedSearchPopover.hidden = true;
  openSavedSearchesButton.setAttribute("aria-expanded", "false");
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
  const isSaved = hasSearchTerms && loadProfiles().some((profile) => profilesMatchSearch(profile, draftProfile));

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
    && first.alertMode === second.alertMode;
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
}

function openSettingsModal(event) {
  settingsReturnFocus = event?.currentTarget || document.activeElement;
  fillSettingsForm();
  setSavedSearchTransferStatus("");
  setActiveSettingsTab("general", { focus: false });
  settingsModal.hidden = false;
  document.body.classList.add("modal-open");
  updateMobileSearchOverlayVisibility();
  currencyToggle.focus();
}

function closeSettingsModal(options = {}) {
  const { restoreFocus = true } = options;
  if (settingsModal.hidden) return;
  settingsModal.hidden = true;
  document.body.classList.remove("modal-open");
  updateMobileSearchOverlayVisibility();
  if (restoreFocus) settingsReturnFocus?.focus?.();
  settingsReturnFocus = null;
}

function fillSettingsForm() {
  renderRegionOptions();
  if (regionSelect) regionSelect.value = sanitizeRegionId(appSettings.regionId);
  currencyToggle.checked = appSettings.currency === "USD";
  if (themeSettingsToggle) themeSettingsToggle.checked = document.body.dataset.theme === "dark";
  jpyPerUsdInput.value = appSettings.jpyPerUsd;
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
  appSettings = {
    ...appSettings,
    regionId: nextRegionId,
    currency: regionChanged ? nextRegion.currency : (currencyToggle.checked ? "USD" : "JPY"),
    jpyPerUsd: Number.isFinite(nextRate) && nextRate > 0 ? nextRate : defaultSettings.jpyPerUsd,
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));

  if (regionChanged) {
    qualityFilter = nextRegion.searchDefaults?.cleanGear === false ? "all" : "clean";
    activeViewSources.clear();
    pendingSourceIds = new Set();
    sourceSearchStatuses = new Map();
    sourceSearchMeta = new Map();
    currentProfile = createFreshProfile();
    renderSources();
    fillForm(currentProfile);
    resetToIdleSearch();
  } else {
    renderRefineSummary();
    renderResults();
  }

  await pushCloudProfilePreferences({ silent: true });
  closeSettingsModal();
}

async function syncAccountCloudData() {
  setAccountStatus("Syncing account profile and saved searches...");
  setCloudSyncButtonsDisabled(true);
  let syncStep = "starting account sync";

  try {
    syncStep = "pushing profile preferences";
    await pushCloudProfilePreferences({ silent: true, surfaceErrors: true });
    syncStep = "pulling profile preferences";
    await pullCloudProfilePreferences({ silent: true, surfaceErrors: true });
    syncStep = "pushing saved searches";
    await pushCloudSavedSearches({
      allowEmpty: true,
      checkConflicts: true,
      rethrow: true,
    });
    syncStep = "pulling saved searches";
    await pullCloudSavedSearches({ rethrow: true });
    authState.accountNotice = "";
    markCloudSynced();
    setAccountStatus("Account profile and saved searches are synced.");
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
    });
    appSettings = nextSettings;
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

    applyStep = "refreshing settings form";
    fillSettingsForm();
    if (regionChanged) {
      applyStep = "refreshing region view";
      qualityFilter = getActiveRegion().searchDefaults?.cleanGear === false ? "all" : "clean";
      activeViewSources.clear();
      pendingSourceIds = new Set();
      sourceSearchStatuses = new Map();
      sourceSearchMeta = new Map();
      currentProfile = createFreshProfile();
      renderSources();
      fillForm(currentProfile);
      resetToIdleSearch();
    } else {
      applyStep = "refreshing current results";
      renderRefineSummary();
      renderResults();
    }
  } catch (error) {
    throw new Error(`Could not apply cloud profile preferences while ${applyStep}. ${getErrorMessage(error)}`);
  }
}

function getLocalPreferencePayload() {
  const watchedListingIds = loadSet(STORAGE_KEYS.watching);
  return {
    regionId: appSettings.regionId,
    currency: appSettings.currency,
    jpyPerUsd: appSettings.jpyPerUsd,
    resultView: appSettings.resultView,
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
    throw new Error("Cloud has saved searches for this account. Pull from cloud before pushing local changes.");
  }

  if (isTimestampAfter(latestCloudUpdatedAt, lastSyncedAt, 1000)) {
    throw new Error("Cloud has newer saved-search changes. Use Pull from cloud before pushing local changes.");
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
  setSavedSearchTransferStatus("Pulling saved searches from cloud sync...");
  setCloudSyncButtonsDisabled(true);

  try {
    const payload = await fetchCloudSavedSearches();
    const cloudProfiles = parseSavedSearchProfilesFromPayload(payload)
      .map((profile) => prepareCloudProfileForLocal(profile, payload.updatedAt, payload.storage));

    if (cloudProfiles.length === 0) {
      authState.accountNotice = "";
      markCloudSynced(payload.updatedAt);
      setSavedSearchTransferStatus("Cloud sync has no saved searches yet.");
      return;
    }

    const importPreview = savedSearchRepository.previewMerge(cloudProfiles);
    if (importPreview.duplicateCount > 0) {
      const confirmed = window.confirm(`Cloud pull will replace ${importPreview.duplicateCount} local saved ${importPreview.duplicateCount === 1 ? "search" : "searches"} with matching cloud versions. Continue?`);
      if (!confirmed) {
        setSavedSearchTransferStatus("Cloud pull canceled.");
        return;
      }
    }

    savedSearchRepository.replaceAll(importPreview.mergedProfiles);
    authState.accountNotice = "";
    markCloudSynced(payload.updatedAt);
    renderAccountShell(authState.user);
    renderSavedSearches();
    updateQuickSaveSearchButton();
    setSavedSearchTransferStatus(`Pulled ${cloudProfiles.length} saved ${cloudProfiles.length === 1 ? "search" : "searches"} from cloud sync.`);
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

  setSavedSearchTransferStatus(options.auto ? "Auto-syncing saved searches..." : "Pushing saved searches to cloud sync...");
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

    setSavedSearchTransferStatus(options.auto
      ? `Auto-synced ${profiles.length} saved ${profiles.length === 1 ? "search" : "searches"}.`
      : `Pushed ${profiles.length} saved ${profiles.length === 1 ? "search" : "searches"} to cloud sync.`);
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
  isSearching = true;
  pendingSourceIds = new Set(searchGroups.filter((group) => group.id !== "mock").map((group) => group.id));
  sourceSearchStatuses = createInitialSourceStatuses(searchGroups);
  sourceSearchMeta = new Map();
  currentResults = [];
  currentDiscoveryIds = new Set();
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
        applySearchResult(profileSnapshot, combineLiveResults(completedResults), false);
      }

      return result;
    });

    const liveResults = await Promise.all(searchPromises);
    if (runId !== searchRunId) return;
    pendingSourceIds.clear();
    applySearchResult(profileSnapshot, combineLiveResults(liveResults), true);
    return;
  }

  const liveResult = await fetchLiveListings(profileSnapshot, searchGroups[0]?.sources || profileSnapshot.sources);
  if (runId !== searchRunId) return;
  pendingSourceIds.clear();
  searchGroups.forEach((group) => {
    if (group.id !== "mock") updateSourceSearchStatus(group, liveResult);
  });
  applySearchResult(profileSnapshot, liveResult, true);
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

  currentDiscoveryIds = isFinal && liveResult.mode === "live" ? getNewDiscoveryIds(currentResults) : new Set();
  if (isFinal && liveResult.mode === "live") {
    recordListingDiscoveries(currentProfile, currentResults);
    liveResult.detail = appendDiscoveryDetail(liveResult.detail, currentDiscoveryIds.size);
    const scanSummary = {
      lastScannedAt: new Date().toISOString(),
      lastMatchCount: currentResults.length,
      lastNewCount: currentDiscoveryIds.size,
      lastSourceCount: new Set(currentResults.map((listing) => listing.source)).size,
      lastScanStatus: liveResult.errors.length > 0 ? "partial" : "ok",
    };
    currentProfile = hydrateProfile({ ...currentProfile, ...scanSummary });
    updateStoredProfileScan(currentProfile, scanSummary);
    renderSavedSearches();
    queueSavedSearchAutoSync("scan-summary", { delay: 4500 });
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
  currentResults = [];
  currentDiscoveryIds = new Set();
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

  if (selectedSources.has("craigslist-sfbay")) {
    groups.push({ id: "craigslist-sfbay", sources: ["craigslist-sfbay"] });
  }

  if (selectedSources.has("craigslist-la")) {
    groups.push({ id: "craigslist-la", sources: ["craigslist-la"] });
  }

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
  document.querySelector(".content").scrollIntoView({ block: "start" });
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

function getCurrentAlertListings() {
  return currentResults.filter((listing) => currentDiscoveryIds.has(listing.id));
}

function renderResults() {
  const watching = loadSet(STORAGE_KEYS.watching);
  if (searchState.mode === "idle") {
    ensureStarterFreshFindListings();
    renderHomeView(watching);
    return;
  }

  const featuredHomeResults = [];
  const isShowingFeaturedHome = featuredHomeResults.length > 0;
  const resultSource = isShowingFeaturedHome ? featuredHomeResults : currentResults;
  const visibleResults = getVisibleResults(watching, resultSource);
  const totalPages = getTotalPages(visibleResults.length);
  currentPage = Math.min(currentPage, totalPages);
  const pageResults = paginateResults(visibleResults);

  resultGrid.innerHTML = "";
  resultGrid.classList.toggle("is-featured-home", isShowingFeaturedHome);
  resultGrid.classList.toggle("is-list-view", !isShowingFeaturedHome && appSettings.resultView === "list");
  renderSourceFilters(resultSource);
  renderAlertPanel(featuredHomeResults);

  if (visibleResults.length > 0) {
    if (isShowingFeaturedHome) {
      const featuredSection = createFeaturedHomeSection(visibleResults);
      resultGrid.appendChild(featuredSection);
    } else {
      pageResults.forEach((listing) => resultGrid.appendChild(renderListing(listing)));
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

function renderHomeView(watching) {
  const freshFindResults = filterMode === "watching" ? [] : getFreshFindHomeListings();
  const watchedHomeResults = getWatchedHomeListings(watching);
  const homeResults = [...freshFindResults, ...watchedHomeResults];
  const isShowingFeaturedHome = homeResults.length > 0;

  resultGrid.innerHTML = "";
  resultGrid.classList.toggle("is-featured-home", isShowingFeaturedHome);
  resultGrid.classList.toggle("is-list-view", false);
  renderSourceFilters(homeResults);
  renderAlertPanel([]);

  if (freshFindResults.length > 0) {
    resultGrid.appendChild(createFeaturedHomeSection(freshFindResults, { variant: "fresh" }));
  }

  if (watchedHomeResults.length > 0) {
    resultGrid.appendChild(createFeaturedHomeSection(watchedHomeResults, { variant: "watched" }));
  }

  if (homeResults.length === 0) {
    resultGrid.innerHTML = filterMode === "watching"
      ? `<div class="empty-state"><strong>No watched gear yet.</strong><span>Tap a heart on any listing to save it here.</span></div>`
      : `<div class="empty-state"><strong>Start a fresh search.</strong><span>${searchState.detail}</span></div>`;
  }

  renderPagination(homeResults.length, 1);
  renderQualityModeControls();
  renderResultViewControls(isShowingFeaturedHome);
  renderTopWatchingControl();
}

function handleResultGridAction(event) {
  const button = event.target.closest("[data-result-action]");
  if (!button) return;

  if (button.dataset.resultAction === "clear-view-filters") {
    clearResultViewFilters();
  }
}

function clearResultViewFilters() {
  filterMode = "all";
  qualityFilter = "all";
  activeViewSources.clear();
  resetPagination();
  document.querySelectorAll("#urgencyFilter button").forEach((item) => item.classList.toggle("active", item.dataset.filter === filterMode));
  renderResults();
}

function createNoResultsMessage(baseResults = currentResults) {
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
  if (filterMode !== "all") labels.push(`${capitalize(filterMode)} view`);
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
    parts.push(`${capitalize(filterMode)} view`);
  }

  return parts.length > 0 ? `This browser is using: ${parts.join(" · ")}.` : "";
}

function capitalize(value) {
  const text = String(value || "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function toggleWatchingFilter() {
  filterMode = filterMode === "watching" ? "all" : "watching";
  resetPagination();
  document.querySelectorAll("#urgencyFilter button").forEach((item) => item.classList.toggle("active", item.dataset.filter === filterMode));
  renderResults();
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
}

function setQualityMode(mode) {
  qualityFilter = mode === "all" ? "all" : "clean";
  resetPagination();
  renderResults();
}

function renderQualityModeControls() {
  qualityModeButtons.forEach((button) => {
    const isActive = button.dataset.quality === qualityFilter;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
    if (button.dataset.quality === "clean") button.setAttribute("aria-checked", String(isActive));
  });
}

function setResultView(mode = "grid") {
  const resultView = mode === "list" ? "list" : "grid";
  if (appSettings.resultView === resultView) return;

  appSettings = {
    ...appSettings,
    resultView,
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  renderResults();
  queueProfileAutoSync("result-view");
}

function renderResultViewControls(isShowingFeaturedHome = false) {
  resultViewButtons.forEach((button) => {
    const isActive = button.dataset.resultView === appSettings.resultView;
    button.classList.toggle("is-active", isActive);
    button.disabled = isShowingFeaturedHome;
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
  const watching = loadSet(STORAGE_KEYS.watching);
  const totalPages = getTotalPages(getVisibleResults(watching).length);
  const nextPage = action === "next" ? currentPage + 1 : currentPage - 1;
  currentPage = Math.max(1, Math.min(nextPage, totalPages));
  renderResults();
  scrollResultsTop();
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
  const token = SOURCE_ACCENT_TOKENS[sourceId] || "--source-default";
  return getComputedStyle(document.documentElement).getPropertyValue(token).trim() || "#4b83d8";
}

function getVisibleResults(watching, baseResults = currentResults) {
  return baseResults
    .filter((listing) => {
      if (filterMode === "new") return isListingMarkedNew(listing);
      if (filterMode === "maybe") return formatGearConfidence(listing).level === "maybe-gear";
      if (filterMode === "watching") return watching.includes(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => activeViewSources.size === 0 || activeViewSources.has(listing.source))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing))
    .sort(compareListings);
}

function renderSourceFilters(baseResults = currentResults) {
  const counts = getSourceCountsForCurrentView(baseResults);
  const availableSources = getVisibleSources().filter((source) => shouldShowSourceFilter(source, counts));
  sourceFilterList.innerHTML = "";
  sourceFilterList.classList.toggle("is-expanded", isSourceRowExpanded);
  sourceFilterList.classList.toggle("is-collapsed", !isSourceRowExpanded);

  if (availableSources.length === 0) {
    sourceFilterList.innerHTML = `<button class="source-filter-button source-filter-all is-active" type="button" disabled>0 Matches</button>`;
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
    button.classList.toggle("is-error", status === "error");
    button.classList.toggle("is-zero", status === "complete" && count === 0);
    button.classList.toggle("has-single-digit-count", isSingleDigitSourceCount(count, status));
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
  const activeSources = [...activeViewSources].filter((sourceId) => counts.has(sourceId) || sourceSearchStatuses.has(sourceId));

  if (activeSources.length === 1) {
    const sourceId = activeSources[0];
    const source = SOURCES.find((item) => item.id === sourceId);
    const count = counts.get(sourceId) || 0;
    return {
      count,
      label: `${formatMatchTotal(count)} ${source?.label || "Source"} ${matchLabel(count)}`,
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

function getSourceCountsForCurrentView(baseResults = currentResults) {
  const counts = new Map();
  getSourceFilteredBaseResults(baseResults).forEach((listing) => {
    counts.set(listing.source, (counts.get(listing.source) || 0) + 1);
  });
  return counts;
}

function shouldShowSourceFilter(source, counts) {
  return counts.get(source.id) > 0 || sourceSearchStatuses.has(source.id);
}

function formatSourceFilterCount(count, status) {
  if (status === "loading") return "…";
  if (status === "manual") return "↗";
  if (status === "parked") return "⏸";
  if (status === "error") return "!";
  return count;
}

function isSingleDigitSourceCount(count, status) {
  if (["loading", "manual", "parked", "error"].includes(status)) return false;
  return Number.isFinite(count) && count >= 0 && count < 10;
}

function getSourceFilterTitle(source, count, status) {
  if (status === "loading") return `${source.label} is still searching`;
  if (status === "manual") return `Open ${source.label} search on Craigslist`;
  if (status === "parked") return `${source.label} is parked for beta safety`;
  if (status === "error") return `${source.label} search needs attention`;
  if (count === 0) return `${source.label} returned no matches`;
  return `${source.label} results`;
}

function getSourceFilterLabel(source, count, status) {
  if (status === "loading") return `${source.label} search loading`;
  if (status === "manual") return `Open prepared ${source.label} search in a new tab`;
  if (status === "parked") return `${source.label} search parked for beta safety`;
  if (status === "error") return `${source.label} search error`;
  return `Filter to ${source.label} results, ${count} ${count === 1 ? "match" : "matches"}`;
}

function isManualSourceStatus(sourceId) {
  return sourceSearchStatuses.get(sourceId) === "manual";
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
    return url.protocol === "https:" && url.hostname.endsWith(".craigslist.org") && url.pathname.startsWith("/search/");
  } catch {
    return false;
  }
}

function getSourceFilteredBaseResults(baseResults = currentResults) {
  const watching = loadSet(STORAGE_KEYS.watching);
  return baseResults
    .filter((listing) => {
      if (filterMode === "new") return isListingMarkedNew(listing);
      if (filterMode === "maybe") return formatGearConfidence(listing).level === "maybe-gear";
      if (filterMode === "watching") return watching.includes(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing));
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
      message: "Mock data",
      detail: location.protocol === "file:" ? "Live search needs http://127.0.0.1:5173." : "No live source selected yet.",
      errors: [],
    };
  }

  try {
    const liveSearchTerms = createSearchContext(profile.terms).sourceTerms;
    const params = new URLSearchParams({
      terms: createSourceSearchTerms(liveSearchTerms).join("|"),
      excludes: profile.excludes.join("|"),
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
  const watching = new Set(loadSet(STORAGE_KEYS.watching));
  const feedback = getProfileFeedback();
  const feedbackStatus = getListingFeedbackStatus(listing, feedback);
  const isFeaturedHome = Boolean(options.isFeaturedHome);

  card.classList.toggle("is-featured-home-card", isFeaturedHome);
  card.classList.toggle("is-new", isListingMarkedNew(listing));
  card.classList.toggle("is-feedback-gear", feedbackStatus === "gear");
  card.classList.toggle("is-feedback-noise", feedbackStatus === "noise");
  if (isFeaturedHome) {
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `Open ${listing.title}`);
  }
  imageLink.href = listing.url;
  image.src = listing.image;
  image.alt = listing.title;
  hydrateRenderedRakumaImage(listing, image);
  renderSourceAvatar(fragment.querySelector(".source-avatar"), source, listing.source);
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector("h3").textContent = listing.title;
  renderShopName(fragment.querySelector(".shop-name"), listing);
  fragment.querySelector(".price-row strong").textContent = listing.priceLabel || formatPrice(listing.price);
  fragment.querySelector(".price-row span").textContent = relativeDate(listing.listedAt);
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
    openMenu.hidden = !isOpening;
    moreActionButton.setAttribute("aria-expanded", String(isOpening));
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
    }
    saveSet(STORAGE_KEYS.watching, next);
    queueProfileAutoSync("watch-listing");
    renderResults();
  });

  hideSimilarButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveListingFeedback(listing, "hide-similar");
    renderResults();
  });

  gearButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveListingFeedback(listing, "gear");
    renderResults();
  });

  noiseButton.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    saveListingFeedback(listing, "noise");
    renderResults();
  });

  if (isFeaturedHome) {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openExternalListing(listing.url);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openExternalListing(listing.url);
    });
  }

  return fragment;
}

function openExternalListing(url) {
  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");
  if (openedWindow) openedWindow.opener = null;
}

function handlePrimaryListingOpen(event, url) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  openExternalListing(url);
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
}

function createBuyeeUrl(listing) {
  if (listing.source !== "yahoo-auctions") return "";

  const auctionId = listing.url.match(/\/jp\/auction\/([^/?#]+)/)?.[1]
    || String(listing.id || "").replace(/^yahoo-auctions-/, "");

  return auctionId ? `https://buyee.jp/item/jdirectitems/auction/${encodeURIComponent(auctionId)}` : "";
}

function closeListingActionMenus() {
  document.querySelectorAll(".open-menu:not([hidden])").forEach((menu) => {
    menu.hidden = true;
    menu.closest(".listing-action-menu")?.querySelector(".more-action-button")?.setAttribute("aria-expanded", "false");
  });
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

function renderAlertPanel(featuredHomeResults = []) {
  if (searchState.mode === "idle") {
    alertPanel.hidden = true;
    alertPanel.classList.remove("is-featured-home");
    alertList.innerHTML = "";
    alertCount.textContent = "0";
    alertDetail.textContent = "No scan yet";
    return;
  }

  alertPanel.classList.remove("is-featured-home");
  alertTitle.textContent = "New Finds";
  const alertListings = getCurrentAlertListings().filter((listing) => qualityFilter === "all" || isCleanGearListing(listing));
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

  if (isFeaturedHome) {
    item.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openExternalListing(listing.url);
    });
    item.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openExternalListing(listing.url);
    });
  }

  return fragment;
}

function createAlertDetail(count) {
  if (isSearching) return "Scanning now";
  if (searchState.mode === "idle") return "No scan yet";
  if (searchState.mode !== "live") return searchState.message;
  if (count === 1) return "1 fresh listing";
  return `${count} fresh listings`;
}

function createFeaturedHomeHeader(count, options = {}) {
  const header = document.createElement("div");
  header.className = "featured-home-header";
  const isStarter = Boolean(options.isStarter);
  const isStarterLive = Boolean(options.isStarterLive);
  const isStarterLoading = Boolean(options.isStarterLoading);
  const isWatched = options.variant === "watched";
  const isCached = Boolean(options.isCached);
  const seedLabel = starterFreshFindTerms.length > 0 ? starterFreshFindTerms.join(" + ") : "vintage synths";
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

function createFeaturedHomeSection(listings, options = {}) {
  const isStarter = listings.some((listing) => listing.isStarterFreshFind);
  const isStarterLive = listings.some((listing) => listing.isStarterLiveFreshFind);
  const isStarterLoading = isStarter && starterFreshFindStatus === "loading";
  const isCached = listings.some((listing) => listing.isFreshFindCached);
  const variant = options.variant || "fresh";
  const section = document.createElement("section");
  section.className = [
    "featured-home-section",
    variant === "watched" ? "is-watched-gear" : "",
    isStarter ? "is-starter-fresh-finds" : "",
    isStarterLive ? "is-live-starter-fresh-finds" : "",
    isStarterLoading ? "is-loading-starter-fresh-finds" : "",
  ].filter(Boolean).join(" ");
  section.setAttribute("aria-label", variant === "watched" ? "Watched Gear" : "Fresh Finds");
  section.appendChild(createFeaturedHomeHeader(listings.length, { isStarter, isStarterLive, isStarterLoading, isCached, variant }));

  const carousel = document.createElement("div");
  carousel.className = "featured-home-carousel";

  const previousButton = document.createElement("button");
  previousButton.className = "featured-carousel-control featured-carousel-control-prev";
  previousButton.type = "button";
  previousButton.setAttribute("aria-label", variant === "watched" ? "Show previous Watched Gear" : "Show previous Fresh Finds");
  previousButton.textContent = "‹";

  const rail = document.createElement("div");
  rail.className = "featured-home-rail";
  listings.forEach((listing) => {
    if (listing.isFreshFindLoading) {
      rail.appendChild(createFeaturedHomeLoadingCard(listing));
      return;
    }

    const card = renderListing(listing, { isFeaturedHome: true });
    if (variant === "watched") card.classList.add("is-watched-home-card");
    rail.appendChild(card);
  });

  const nextButton = document.createElement("button");
  nextButton.className = "featured-carousel-control featured-carousel-control-next";
  nextButton.type = "button";
  nextButton.setAttribute("aria-label", variant === "watched" ? "Show more Watched Gear" : "Show more Fresh Finds");
  nextButton.textContent = "›";

  carousel.append(previousButton, rail, nextButton);
  section.appendChild(carousel);
  setupFeaturedHomeCarousel(rail, previousButton, nextButton);

  return section;
}

function createFeaturedHomeLoadingCard(listing) {
  const card = document.createElement("article");
  card.className = "listing-card loading-card featured-home-loading-card is-featured-home-card";
  card.style.setProperty("--loading-accent", "#0072ff");
  card.setAttribute("aria-label", listing.title || "Fresh Finds loading");
  card.innerHTML = `
    <div class="image-stage" aria-hidden="true">
      <div class="image-link loading-image featured-home-loading-image">
        <span class="featured-home-loading-sweep"></span>
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
    previousButton.hidden = !hasOverflow;
    nextButton.hidden = !hasOverflow;
    previousButton.disabled = rail.scrollLeft <= 8;
    nextButton.disabled = rail.scrollLeft >= maxScroll - 8;
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
  return STARTER_FRESH_FIND_LISTINGS;
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
  cache[regionId] = {
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

function serializeFreshFindCacheListing(listing) {
  return {
    id: listing.id,
    source: listing.source,
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

function getWatchedHomeListings(watchingIds = loadSet(STORAGE_KEYS.watching)) {
  const ledger = loadLedger();
  return normalizeStoredList(watchingIds)
    .map((id) => ledger[id])
    .filter(Boolean)
    .map(createListingFromLedgerEntry)
    .filter((listing) => listing.title && listing.url)
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing))
    .filter((listing) => !isStaleFreshFind(listing, ledger))
    .sort((a, b) => scoreFreshFindListing(b, ledger) - scoreFreshFindListing(a, ledger))
    .slice(0, FEATURED_HOME_LIMIT)
    .map((listing) => decorateFreshFindListing(listing, ledger));
}

function createFreshFindLoadingPlaceholders() {
  return Array.from({ length: FRESH_FIND_LOADING_CARD_COUNT }, (_, index) => ({
    id: `fresh-find-loading-${index}`,
    source: STARTER_FRESH_FIND_SOURCE_IDS[index % STARTER_FRESH_FIND_SOURCE_IDS.length],
    title: "Scanning Fresh Finds",
    isStarterFreshFind: true,
    isFreshFindLoading: true,
  }));
}

function ensureStarterFreshFindListings() {
  if (starterFreshFindStatus !== "idle") return;
  if (location.protocol === "file:") return;

  starterFreshFindStatus = "loading";
  starterFreshFindTerms = pickStarterFreshFindTerms();

  fetchStarterFreshFindListings()
    .then((listings) => {
      starterFreshFindListings = listings;
      starterFreshFindStatus = listings.length > 0 ? "live" : "fallback";
      if (searchState.mode === "idle") renderResults();
    })
    .catch((error) => {
      console.warn("Starter Fresh Finds unavailable; keeping portal cards.", error);
      starterFreshFindStatus = "fallback";
      if (searchState.mode === "idle") renderResults();
    });
}

function pickStarterFreshFindTerms() {
  const shuffled = [...STARTER_FRESH_FIND_TERMS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2);
}

async function fetchStarterFreshFindListings() {
  const params = new URLSearchParams({
    terms: starterFreshFindTerms.join("|"),
    excludes: STARTER_FRESH_FIND_EXCLUDES.join("|"),
    maxPrice: "0",
    sources: STARTER_FRESH_FIND_SOURCE_IDS.join("|"),
  });
  const response = await fetch(`/api/search?${params.toString()}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`Starter Fresh Finds failed with ${response.status}`);

  const payload = await response.json();
  const listings = Array.isArray(payload.listings) ? payload.listings : [];
  const freshListings = listings
    .filter((listing) => STARTER_FRESH_FIND_SOURCE_IDS.includes(listing.source))
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => isCleanGearListing(listing))
    .filter((listing) => !hasStarterFreshFindNoise(listing))
    .filter((listing) => matchesStarterFreshFindTerm(listing) || hasStarterGearSignal(listing))
    .map((listing) => ({
      ...listing,
      isStarterLiveFreshFind: true,
    }));

  const curatedListings = curateFreshFindListings(freshListings);
  if (curatedListings.length > 0) {
    recordListingDiscoveries({ name: "Fresh Finds" }, curatedListings);
    saveFreshFindCache(curatedListings);
  }
  return curatedListings;
}

function curateFreshFindListings(listings, options = {}) {
  const limit = options.limit || FEATURED_HOME_LIMIT;
  const ledger = loadLedger();
  const seenIds = new Set();

  return listings
    .filter((listing) => {
      if (!listing?.id || seenIds.has(listing.id)) return false;
      seenIds.add(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => !isStaleFreshFind(listing, ledger))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing))
    .sort((a, b) => {
      const scoreDelta = scoreFreshFindListing(b, ledger) - scoreFreshFindListing(a, ledger);
      if (scoreDelta !== 0) return scoreDelta;
      return getFreshFindTime(b, ledger) - getFreshFindTime(a, ledger);
    })
    .slice(0, limit)
    .map((listing) => decorateFreshFindListing(listing, ledger));
}

function scoreFreshFindListing(listing, ledger = loadLedger()) {
  if (listing.isStarterFreshFind) return 0;

  const searchable = normalizeText(`${listing.title || ""} ${listing.condition || ""} ${listing.shop || ""}`);
  const confidence = scoreGearConfidence(listing);
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

function decorateFreshFindListing(listing, ledger = loadLedger()) {
  const entry = ledger[listing.id] || {};
  return {
    ...listing,
    firstSeenAt: entry.firstSeenAt || entry.firstDiscoveredAt || listing.firstSeenAt || listing.listedAt || "",
    lastVerifiedAt: entry.lastVerifiedAt || entry.lastSeenAt || entry.lastFoundAt || listing.lastVerifiedAt || "",
    freshnessStatus: entry.freshnessStatus || "active",
    curationScore: scoreFreshFindListing(listing, ledger),
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

function isListingMarkedNew(listing) {
  if (currentDiscoveryIds.has(listing.id)) return true;
  return searchState.mode === "idle" && !isSeen(listing.id);
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
  const noun = discoveryCount === 1 ? "new discovery" : "new discoveries";
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

function isCleanGearListing(listing) {
  return formatGearConfidence(listing).level !== "likely-noise";
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

function formatGearConfidence(listing) {
  const confidence = scoreGearConfidence(listing);
  if (confidence.level === "likely-gear") return { ...confidence, label: "Likely gear" };
  if (confidence.level === "likely-noise") return { ...confidence, label: "Likely noise" };
  return { ...confidence, label: "Maybe gear" };
}

function scoreGearConfidence(listing) {
  const searchable = normalizeText(`${listing.title} ${listing.condition || ""} ${listing.shop || ""}`);
  const categoryIds = getListingCategoryIds(listing);
  const feedback = getProfileFeedback();
  const feedbackStatus = getListingFeedbackStatus(listing, feedback);

  if (feedbackStatus === "gear") return { level: "likely-gear", score: 99 };
  if (feedbackStatus === "noise") return { level: "likely-noise", score: -99 };

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
    return { level: "likely-noise", score: -12 };
  }

  if (hasAmbiguousBrand && !hasGearSignal) {
    return { level: "likely-noise", score: -8 };
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

  if (score >= 3) return { level: "likely-gear", score };
  if (score <= -3) return { level: "likely-noise", score };
  return { level: "maybe-gear", score };
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
    return `${labelForSource(item.source)} ${item.rawCount}`;
  });
  return ` from ${parts.join(", ")}`;
}

function createLiveSourceLabel(meta = {}, fallback = "") {
  const sourceStats = Array.isArray(meta.sourceStats) ? meta.sourceStats : [];
  if (sourceStats.length > 0) {
    const labels = sourceStats.map((item) => item.status === "manual" ? `${labelForSource(item.source)} Assist` : labelForSource(item.source));
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
  qualityFilter = nextRegion.searchDefaults?.cleanGear === false ? "all" : "clean";
  activeViewSources.clear();
  pendingSourceIds = new Set();
  sourceSearchStatuses = new Map();
  sourceSearchMeta = new Map();
  renderSources();
  renderSourceFilters();
  renderRefineSummary();
  renderSavedSearches();
  pushCloudProfilePreferences({ silent: true });
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

  function previewMerge(importedProfiles) {
    const existingProfiles = list();
    const duplicateCount = importedProfiles.filter((profile) => findMatchingSavedSearch(existingProfiles, profile)).length;
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
  return {
    regionId,
    currency: requestedCurrency || region.currency || defaultSettings.currency,
    jpyPerUsd: Number.isFinite(rate) && rate > 0 ? rate : defaultSettings.jpyPerUsd,
    resultView: settings.resultView === "list" ? "list" : "grid",
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

function getNewDiscoveryIds(listings) {
  const ledger = loadLedger();
  return new Set(listings.filter((listing) => !ledger[listing.id]).map((listing) => listing.id));
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

function acknowledgeListings(listings) {
  const ledger = loadLedger();
  const now = new Date().toISOString();

  listings.forEach((listing) => {
    if (ledger[listing.id]) {
      ledger[listing.id].acknowledgedAt = now;
    }
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
