const SOURCES = [
  { id: "mercari", label: "Mercari", icon: "Me", color: "rose", logo: "assets/logos/ICONS/mercari_ic.svg" },
  { id: "yahoo-auctions", label: "Yahoo Auctions", icon: "Y!", color: "amber", logo: "assets/logos/ICONS/yahoo_ic.svg" },
  { id: "yahoo-fleamarket", label: "Yahoo Fleamarket", icon: "Yf", color: "blue", logo: "assets/logos/ICONS/yahoo_flea_ic.svg" },
  { id: "rakuma", label: "Rakuma", icon: "Ra", color: "green", logo: "assets/logos/ICONS/rakuma_ic.svg" },
  { id: "digimart", label: "Digimart", icon: "D", color: "blue" },
  { id: "reverb", label: "Reverb", icon: "Rv", color: "orange" },
  { id: "offmall", label: "OFFMALL", icon: "O", color: "green", logo: "assets/logos/ICONS/hardoff-ic.svg" },
  { id: "five-g", label: "Five G", icon: "5G", color: "amber" },
  { id: "implant4", label: "implant4", icon: "i4", color: "rose" },
  { id: "hardoff", label: "Hard Off", icon: "H", color: "green", logo: "assets/logos/ICONS/hardoff-ic.svg" },
];

const LEGACY_DEFAULT_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "offmall", "five-g", "implant4", "hardoff"];
const LIVE_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "reverb", "offmall", "hardoff"];
const LIVE_SOURCE_DISPLAY_ORDER = ["yahoo-auctions", "yahoo-fleamarket", "digimart", "reverb", "offmall", "hardoff", "mercari", "rakuma"];
const RESULTS_PER_PAGE = 48;
const FEATURED_HOME_LIMIT = 12;
const FEATURED_HOME_ALERT_LIMIT = 6;
const SOURCE_ACCENTS = {
  mercari: "#e53935",
  "yahoo-auctions": "#d60000",
  "yahoo-fleamarket": "#1f73e8",
  rakuma: "#12a05c",
  digimart: "#0a62b7",
  reverb: "#f47a20",
  offmall: "#f2a900",
  hardoff: "#f2a900",
};

const SOURCE_METADATA_ALIASES = {
  mercari: ["Mercari", "メルカリ"],
  "yahoo-auctions": ["Yahoo Auctions", "Yahoo Auction", "ヤフオク"],
  "yahoo-fleamarket": ["Yahoo Fleamarket", "Yahooフリマ", "PayPayフリマ"],
  rakuma: ["Rakuma", "ラクマ"],
  digimart: ["Digimart", "デジマート"],
  reverb: ["Reverb", "Reverb.com"],
  offmall: ["OFFMALL", "Off Mall", "Hard Off", "ハードオフ"],
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
  "dr rhythm",
  "dr. rhythm",
  "eurorack",
  "groove box",
  "groovebox",
  "keyboard",
  "midi",
  "module",
  "rack",
  "sampler",
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

const STORAGE_KEYS = {
  profiles: "bumpers.profiles",
  seen: "bumpers.seen",
  watching: "bumpers.watching",
  theme: "bumpers.theme",
  settings: "bumpers.settings",
  listingLedger: "bumpers.listingLedger",
  feedbackRules: "bumpers.feedbackRules",
};

const defaultSettings = {
  currency: "JPY",
  jpyPerUsd: 155,
};

const defaultProfile = {
  name: "Waldorf",
  terms: ["Waldorf", "ワルドルフ", "WALDORF"],
  excludes: ["manual", "magnet", "power cord", "doll", "Fashionist", "shirt", "CD", "Moments to Remember", "record", "shoes"],
  noiseTerms: [...ACCESSORY_TERMS],
  maxPrice: 2000000,
  alertMode: "immediate",
  sources: SOURCES.map((source) => source.id),
};

let currentProfile = createFreshProfile();
let currentResults = [];
let currentDiscoveryIds = new Set();
let filterMode = "all";
let qualityFilter = "clean";
let sortMode = "newest";
let activeViewSources = new Set();
let currentPage = 1;
let appSettings = loadSettings();
let isSearching = false;
let pendingSourceIds = new Set();
let sourceSearchStatuses = new Map();
let searchRunId = 0;
let loadingCardId = 0;
let backToTopFrame = 0;
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
const termsInput = document.querySelector("#terms");
const refineTermsInput = document.querySelector("#refineTerms");
const termDropdown = document.querySelector("#termDropdown");
const searchSummaryButton = document.querySelector("#openSearchTerms");
const searchSummaryText = document.querySelector("#searchSummaryText");
const searchSummaryCount = document.querySelector("#searchSummaryCount");
const resultGrid = document.querySelector("#resultGrid");
const paginationControls = document.querySelector("#paginationControls");
const paginationSummary = document.querySelector("#paginationSummary");
const paginationPage = document.querySelector("#paginationPage");
const template = document.querySelector("#listingTemplate");
const alertTemplate = document.querySelector("#alertTemplate");
const alertList = document.querySelector("#alertList");
const alertCount = document.querySelector("#alertCount");
const alertDetail = document.querySelector("#alertDetail");
const alertTitle = document.querySelector("#alertTitle");
const sourceFilterList = document.querySelector("#sourceFilterList");
const themeToggle = document.querySelector("#themeToggle");
const liveStatus = document.querySelector("#liveStatus");
const qualityModeButtons = document.querySelectorAll("[data-quality]");
const sortModeSelect = document.querySelector("#sortMode");
const openSavedSearchesButton = document.querySelector("#openSavedSearches");
const savedSearchPopover = document.querySelector("#savedSearchPopover");
const topWatchingFilter = document.querySelector("#topWatchingFilter");
const refineSearchModal = document.querySelector("#refineSearchModal");
const refineSummary = document.querySelector("#refineSummary");
const saveSearchModal = document.querySelector("#saveSearchModal");
const saveSearchForm = document.querySelector("#saveSearchForm");
const saveSearchName = document.querySelector("#saveSearchName");
const saveSearchAlert = document.querySelector("#saveSearchAlert");
const settingsModal = document.querySelector("#settingsModal");
const settingsForm = document.querySelector("#settingsForm");
const currencyToggle = document.querySelector("#currencyToggle");
const jpyPerUsdInput = document.querySelector("#jpyPerUsd");
const backToTopButton = document.querySelector("#backToTop");
let refineSearchReturnFocus = null;
let saveSearchReturnFocus = null;
let settingsReturnFocus = null;

function initialize() {
  applyStoredTheme();
  renderSources();
  fillForm(currentProfile);
  setActiveTitle(currentProfile.name);
  renderSavedSearches();
  updateSearchStatus();
  renderResults();
  bindEvents();
  updateBackToTopVisibility();
}

function bindEvents() {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (refineSearchModal.hidden) {
      syncPrimaryTermsToRefine();
    } else {
      syncRefineTermsToPrimary();
    }
    currentProfile = readProfileFromForm();
    renderRefineSummary();
    closeRefineSearchModal({ restoreFocus: false });
    runSearch();
  });
  termsInput.addEventListener("input", syncPrimaryTermsToRefine);
  termsInput.addEventListener("keydown", handleQuickSearchKeydown);
  refineTermsInput.addEventListener("input", syncRefineTermsToPrimary);
  termDropdown.addEventListener("click", handleTermDropdownClick);
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

  topWatchingFilter.addEventListener("click", toggleWatchingFilter);

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
    toggleViewSource(button.dataset.source || "");
    resetPagination();
    renderResults();
  });

  qualityModeButtons.forEach((button) => {
    button.addEventListener("click", () => setQualityMode(button.dataset.quality));
  });

  sortModeSelect.addEventListener("change", () => {
    sortMode = sortModeSelect.value;
    resetPagination();
    renderResults();
  });

  paginationControls.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page-action]");
    if (!button || button.disabled) return;
    changePage(button.dataset.pageAction);
  });

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });

  backToTopButton.addEventListener("click", scrollPageTop);
  window.addEventListener("scroll", requestBackToTopVisibilityUpdate, { passive: true });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeSavedSearchPopover();
    if (!refineSearchModal.hidden) closeRefineSearchModal();
    if (!saveSearchModal.hidden) closeSaveSearchModal();
    if (!settingsModal.hidden) closeSettingsModal();
  });
}

function renderSources() {
  sourceList.innerHTML = SOURCES.map((source) => `
    <label class="source-toggle">
      <input type="checkbox" name="sources" value="${source.id}" form="searchForm" checked />
      <span>${source.label}</span>
    </label>
  `).join("");
}

function fillForm(profile) {
  const hydratedProfile = hydrateProfile(profile);
  termsInput.value = hydratedProfile.terms.join("\n");
  syncPrimaryTermsToRefine();
  document.querySelector("#excludes").value = hydratedProfile.excludes.join("\n");
  document.querySelector("#noiseTerms").value = hydratedProfile.noiseTerms.join("\n");
  document.querySelector("#maxPrice").value = hydratedProfile.maxPrice;
  document.querySelector("#alertMode").value = hydratedProfile.alertMode;
  document.querySelectorAll("input[name='sources']").forEach((input) => {
    input.checked = hydratedProfile.sources.includes(input.value);
  });
  renderRefineSummary();
}

function readProfileFromForm() {
  const terms = splitLines(termsInput.value);

  return {
    name: getFormProfileName(terms),
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
  if (event.key !== "Enter" || event.shiftKey) return;
  event.preventDefault();
  searchForm.requestSubmit();
}

function openRefineSearchModal(event) {
  refineSearchReturnFocus = event?.currentTarget || document.activeElement;
  syncPrimaryTermsToRefine();
  renderRefineSummary();
  refineSearchModal.hidden = false;
  document.body.classList.add("modal-open");
  refineTermsInput.focus();
}

function closeRefineSearchModal(options = {}) {
  const { restoreFocus = true } = options;
  if (refineSearchModal.hidden) return;
  refineSearchModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (restoreFocus) refineSearchReturnFocus?.focus();
}

function applyRefineSearchOnly() {
  syncRefineTermsToPrimary();
  currentProfile = readProfileFromForm();
  renderRefineSummary();
  closeRefineSearchModal();
}

function syncPrimaryTermsToRefine() {
  if (refineTermsInput.value === termsInput.value) return;
  refineTermsInput.value = termsInput.value;
  renderSearchTermsSummary();
  renderRefineTermDropdown();
}

function syncRefineTermsToPrimary() {
  if (termsInput.value === refineTermsInput.value) return;
  termsInput.value = refineTermsInput.value;
  renderSearchTermsSummary();
  renderRefineTermDropdown();
}

function renderRefineSummary() {
  if (!refineSummary) return;
  renderSearchTermsSummary();
  renderRefineTermDropdown();
  const profile = readProfileFromForm();
  const sourceCount = profile.sources.length;
  const sourceText = `${sourceCount} ${sourceCount === 1 ? "source" : "sources"}`;
  const priceText = profile.maxPrice > 0 ? `${formatPrice(profile.maxPrice)} max` : "No price cap";
  const excludeText = `${profile.excludes.length} excluded`;
  refineSummary.textContent = `${sourceText} · ${priceText} · ${profile.alertMode} · ${excludeText}`;
}

function renderSearchTermsSummary() {
  if (!searchSummaryButton || !searchSummaryText || !searchSummaryCount) return;

  const terms = splitLines(termsInput.value);
  const primaryTerm = terms[0] || "Search terms";
  const extraCount = Math.max(0, terms.length - 1);

  searchSummaryText.textContent = primaryTerm;
  searchSummaryCount.hidden = extraCount === 0;
  searchSummaryCount.textContent = `+${extraCount} ${extraCount === 1 ? "term" : "terms"}`;
  searchSummaryButton.setAttribute("aria-label", `Edit search terms: ${primaryTerm}${extraCount > 0 ? `, plus ${extraCount} more` : ""}`);
}

function renderRefineTermDropdown() {
  const terms = splitLines(refineTermsInput.value);
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

function openSaveSearchModal(event) {
  saveSearchReturnFocus = event?.currentTarget || document.activeElement;
  closeSavedSearchPopover();
  const draftProfile = readProfileFromForm();
  saveSearchName.value = draftProfile.name;
  saveSearchAlert.value = draftProfile.alertMode;
  saveSearchModal.hidden = false;
  document.body.classList.add("modal-open");
  saveSearchName.focus();
  saveSearchName.select();
}

function closeSaveSearchModal() {
  saveSearchModal.hidden = true;
  document.body.classList.remove("modal-open");
  saveSearchReturnFocus?.focus?.();
  saveSearchReturnFocus = null;
}

function saveCurrentSearchFromModal() {
  const savedName = saveSearchName.value.trim() || suggestSearchName(splitLines(document.querySelector("#terms").value));
  currentProfile = {
    ...readProfileFromForm(),
    name: savedName,
    alertMode: saveSearchAlert.value,
  };
  document.querySelector("#alertMode").value = currentProfile.alertMode;
  saveProfile(currentProfile);
  renderSavedSearches();
  setActiveTitle(currentProfile.name);
  closeSaveSearchModal();
}

function openSettingsModal(event) {
  settingsReturnFocus = event?.currentTarget || document.activeElement;
  fillSettingsForm();
  settingsModal.hidden = false;
  document.body.classList.add("modal-open");
  currencyToggle.focus();
}

function closeSettingsModal() {
  if (settingsModal.hidden) return;
  settingsModal.hidden = true;
  document.body.classList.remove("modal-open");
  settingsReturnFocus?.focus?.();
  settingsReturnFocus = null;
}

function fillSettingsForm() {
  currencyToggle.checked = appSettings.currency === "USD";
  jpyPerUsdInput.value = appSettings.jpyPerUsd;
}

function saveSettingsFromModal() {
  const nextRate = Number(jpyPerUsdInput.value);
  appSettings = {
    currency: currencyToggle.checked ? "USD" : "JPY",
    jpyPerUsd: Number.isFinite(nextRate) && nextRate > 0 ? nextRate : defaultSettings.jpyPerUsd,
  };
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(appSettings));
  renderRefineSummary();
  renderResults();
  closeSettingsModal();
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

  resetPagination();
  isSearching = true;
  pendingSourceIds = new Set(searchGroups.filter((group) => group.id !== "mock").map((group) => group.id));
  sourceSearchStatuses = createInitialSourceStatuses(searchGroups);
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

  if (selectedSources.has("reverb")) {
    groups.push({ id: "reverb", sources: ["reverb"] });
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
    message: errors.length > 0 ? "Partial live" : `Live ${meta.liveSources.map(labelForSource).join(", ") || "live sources"}`,
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
  const state = result.mode === "error" ? "error" : "complete";
  group.sources.forEach((sourceId) => {
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
  const featuredHomeResults = searchState.mode === "idle" ? getFeaturedHomeListings(watching) : [];
  const isShowingFeaturedHome = featuredHomeResults.length > 0;
  const resultSource = isShowingFeaturedHome ? featuredHomeResults : currentResults;
  const visibleResults = getVisibleResults(watching, resultSource);
  const totalPages = getTotalPages(visibleResults.length);
  currentPage = Math.min(currentPage, totalPages);
  const pageResults = paginateResults(visibleResults);

  resultGrid.innerHTML = "";
  renderSourceFilters(resultSource);
  renderAlertPanel(featuredHomeResults);

  if (visibleResults.length > 0) {
    if (isShowingFeaturedHome) {
      resultGrid.appendChild(createFeaturedHomeHeader(visibleResults.length));
    }
    pageResults.forEach((listing) => resultGrid.appendChild(renderListing(listing)));
    renderPendingSourceCards();
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
    resultGrid.innerHTML = `<div class="empty-state"><strong>No matching listings in this view.</strong><span>${searchState.detail || "Try another term or source."}</span></div>`;
  }

  const newListings = isShowingFeaturedHome
    ? visibleResults.filter((listing) => !isSeen(listing.id))
    : visibleResults.filter((listing) => currentDiscoveryIds.has(listing.id));
  document.querySelector("#totalCount").textContent = visibleResults.length;
  document.querySelector("#newCount").textContent = newListings.length;
  document.querySelector("#sourceCount").textContent = new Set(visibleResults.map((listing) => listing.source)).size;
  renderPagination(visibleResults.length, totalPages);
  renderQualityModeControls();
  renderTopWatchingControl();
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
  return SOURCE_ACCENTS[sourceId] || "#4b83d8";
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
  const availableSources = SOURCES.filter((source) => shouldShowSourceFilter(source, counts));
  sourceFilterList.innerHTML = "";

  if (availableSources.length === 0) {
    sourceFilterList.innerHTML = `<button class="source-filter-button is-active" type="button" disabled>All</button>`;
    return;
  }

  sourceFilterList.appendChild(createAllSourceFilterButton(baseResults));

  availableSources.forEach((source) => {
    const status = sourceSearchStatuses.get(source.id);
    const count = counts.get(source.id) || 0;
    const button = document.createElement("button");
    button.className = "source-filter-button";
    button.type = "button";
    button.dataset.source = source.id;
    button.dataset.status = status || "ready";
    button.classList.toggle("is-active", activeViewSources.has(source.id));
    button.classList.toggle("is-loading", status === "loading");
    button.classList.toggle("is-error", status === "error");
    button.classList.toggle("is-zero", status === "complete" && count === 0);
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

function createAllSourceFilterButton(baseResults = currentResults) {
  const button = document.createElement("button");
  button.className = "source-filter-button source-filter-all";
  button.type = "button";
  button.dataset.source = "all";
  button.classList.toggle("is-active", activeViewSources.size === 0);
  button.setAttribute("aria-pressed", String(activeViewSources.size === 0));
  button.textContent = `All ${getSourceFilteredBaseResults(baseResults).length}`;
  return button;
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
  if (status === "error") return "!";
  return count;
}

function getSourceFilterTitle(source, count, status) {
  if (status === "loading") return `${source.label} is still searching`;
  if (status === "error") return `${source.label} search needs attention`;
  if (count === 0) return `${source.label} returned no matches`;
  return `${source.label} results`;
}

function getSourceFilterLabel(source, count, status) {
  if (status === "loading") return `${source.label} search loading`;
  if (status === "error") return `${source.label} search error`;
  return `Filter to ${source.label} results, ${count} ${count === 1 ? "match" : "matches"}`;
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
      message: errors.length > 0 ? "Partial live" : `Live ${sourceLabel}`,
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

function renderListing(listing) {
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

  card.classList.toggle("is-new", isListingMarkedNew(listing));
  card.classList.toggle("is-feedback-gear", feedbackStatus === "gear");
  card.classList.toggle("is-feedback-noise", feedbackStatus === "noise");
  imageLink.href = listing.url;
  image.src = listing.image;
  image.alt = listing.title;
  hydrateRenderedRakumaImage(listing, image);
  renderSourceAvatar(fragment.querySelector(".source-avatar"), source, listing.source);
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector("h3").textContent = listing.title;
  renderShopName(fragment.querySelector(".shop-name"), listing);
  fragment.querySelector(".price-row strong").textContent = formatPrice(listing.price);
  fragment.querySelector(".price-row span").textContent = relativeDate(listing.listedAt);
  openLink.href = listing.url;
  sourceOpenLink.href = listing.url;
  sourceOpenLink.textContent = `Open ${source?.label || "listing"}`;
  configureBuyeeLink(buyeeOpenLink, listing);
  watchButton.classList.toggle("is-watching", watching.has(listing.id));
  watchButton.textContent = watching.has(listing.id) ? "★" : "☆";
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

  watchButton.addEventListener("click", () => {
    const next = new Set(loadSet(STORAGE_KEYS.watching));
    if (next.has(listing.id)) {
      next.delete(listing.id);
    } else {
      next.add(listing.id);
      recordListingSnapshot(listing);
    }
    saveSet(STORAGE_KEYS.watching, next);
    renderResults();
  });

  hideSimilarButton.addEventListener("click", () => {
    saveListingFeedback(listing, "hide-similar");
    renderResults();
  });

  gearButton.addEventListener("click", () => {
    saveListingFeedback(listing, "gear");
    renderResults();
  });

  noiseButton.addEventListener("click", () => {
    saveListingFeedback(listing, "noise");
    renderResults();
  });

  return fragment;
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
  if (searchState.mode === "idle" && featuredHomeResults.length > 0) {
    alertTitle.textContent = "Featured New Finds";
    alertList.innerHTML = "";
    alertCount.textContent = featuredHomeResults.length;
    alertDetail.textContent = `${featuredHomeResults.length === 1 ? "1 watched item" : `${featuredHomeResults.length} watched items`}`;
    featuredHomeResults.slice(0, FEATURED_HOME_ALERT_LIMIT).forEach((listing) => {
      alertList.appendChild(renderAlertItem(listing));
    });
    return;
  }

  alertTitle.textContent = "New Finds";
  const alertListings = getCurrentAlertListings().filter((listing) => qualityFilter === "all" || isCleanGearListing(listing));
  alertList.innerHTML = "";
  alertCount.textContent = alertListings.length;
  alertDetail.textContent = createAlertDetail(alertListings.length);

  if (isSearching) {
    alertList.innerHTML = `<div class="alert-empty">Scanning saved search sources...</div>`;
    return;
  }

  if (searchState.mode === "idle") {
    alertList.innerHTML = `<div class="alert-empty">Fresh finds will appear after a scan.</div>`;
    return;
  }

  if (alertListings.length === 0) {
    alertList.innerHTML = `<div class="alert-empty">No fresh finds from this scan.</div>`;
    return;
  }

  alertListings.slice(0, 6).forEach((listing) => {
    alertList.appendChild(renderAlertItem(listing));
  });
}

function renderAlertItem(listing) {
  const fragment = alertTemplate.content.cloneNode(true);
  const source = SOURCES.find((item) => item.id === listing.source);
  const imageLink = fragment.querySelector(".alert-thumb");
  const image = fragment.querySelector("img");
  const openLink = fragment.querySelector(".alert-open");

  imageLink.href = listing.url;
  image.src = listing.image;
  image.alt = listing.title;
  hydrateRenderedRakumaImage(listing, image);
  renderSourceAvatar(fragment.querySelector(".source-avatar"), source, listing.source);
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector(".alert-price").textContent = formatPrice(listing.price);
  fragment.querySelector("h4").textContent = listing.title;
  openLink.href = listing.url;

  return fragment;
}

function createAlertDetail(count) {
  if (isSearching) return "Scanning now";
  if (searchState.mode === "idle") return "No scan yet";
  if (searchState.mode !== "live") return searchState.message;
  if (count === 1) return "1 fresh listing";
  return `${count} fresh listings`;
}

function createFeaturedHomeHeader(count) {
  const header = document.createElement("div");
  header.className = "featured-home-header";
  header.innerHTML = `
    <p class="eyebrow">Home View</p>
    <h3>Featured New Finds</h3>
    <span>${count} ${count === 1 ? "watched listing" : "watched listings"} from your saved items</span>
  `;
  return header;
}

function getFeaturedHomeListings(watchingIds = loadSet(STORAGE_KEYS.watching)) {
  const ledger = loadLedger();
  return watchingIds
    .map((id) => ledger[id])
    .filter(Boolean)
    .map(createListingFromLedgerEntry)
    .filter((listing) => listing.title && listing.url)
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing))
    .sort((a, b) => new Date(b.lastFoundAt || b.listedAt) - new Date(a.lastFoundAt || a.listedAt))
    .slice(0, FEATURED_HOME_LIMIT);
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

function saveFeedbackRules(value) {
  localStorage.setItem(STORAGE_KEYS.feedbackRules, JSON.stringify(value));
}

function hydrateFeedback(feedback = {}) {
  return {
    gearListingIds: Array.isArray(feedback.gearListingIds) ? feedback.gearListingIds : [],
    noiseListingIds: Array.isArray(feedback.noiseListingIds) ? feedback.noiseListingIds : [],
    hiddenCategories: Array.isArray(feedback.hiddenCategories) ? feedback.hiddenCategories : [],
    hiddenTerms: Array.isArray(feedback.hiddenTerms) ? feedback.hiddenTerms : [],
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

  return searchable.includes(normalized);
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

  const phrasePattern = phrase.split(/\s+/).map(escapeRegExp).join("\\s+");
  const startBoundary = /^[a-z0-9]/.test(phrase) ? "(^|[^a-z0-9])" : "";
  const endBoundary = /[a-z0-9]$/.test(phrase) ? "($|[^a-z0-9])" : "";
  return new RegExp(`${startBoundary}${phrasePattern}${endBoundary}`).test(searchable);
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

  const parts = sourceStats.map((item) => `${labelForSource(item.source)} ${item.rawCount}`);
  return ` from ${parts.join(", ")}`;
}

function renderSavedSearches() {
  const profiles = loadProfiles();
  if (profiles.length === 0) {
    savedSearches.innerHTML = `<div class="empty-state">Save your current search to pin it here.</div>`;
    return;
  }

  savedSearches.innerHTML = "";
  profiles.forEach((profile) => {
    const item = document.createElement("div");
    item.className = "saved-search-row";

    const button = document.createElement("button");
    button.className = "saved-search";
    button.type = "button";
    const newCount = profile.lastNewCount || 0;
    button.innerHTML = `
      <strong class="saved-search-title">${profile.name}</strong>
      <span class="saved-search-matches">${profile.lastMatchCount || 0} matches</span>
      <span class="saved-search-new${newCount === 0 ? " is-empty" : ""}">${newCount} new</span>
    `;
    button.addEventListener("click", () => {
      closeSavedSearchPopover();
      currentProfile = profile;
      fillForm(profile);
      setActiveTitle(profile.name);
      runSearch();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "saved-search-delete";
    deleteButton.type = "button";
    deleteButton.title = `Delete ${profile.name}`;
    deleteButton.setAttribute("aria-label", `Delete saved search ${profile.name}`);
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", () => deleteSavedSearch(profile.name));

    item.append(button, deleteButton);
    savedSearches.appendChild(item);
  });
}

function saveProfile(profile) {
  const hydratedProfile = hydrateProfile(profile);
  const profiles = loadProfiles().filter((item) => item.name !== hydratedProfile.name);
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify([hydratedProfile, ...profiles]));
}

function deleteSavedSearch(profileName) {
  const confirmed = window.confirm(`Delete saved search "${profileName}"?`);
  if (!confirmed) return;

  const nextProfiles = loadProfiles().filter((item) => item.name !== profileName);
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(nextProfiles));
  deleteSavedSearchArtifacts(profileName);
  renderSavedSearches();
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
  const profiles = loadProfiles();
  const nextProfiles = profiles.map((item) => {
    if (item.name !== profile.name) return item;
    return hydrateProfile({ ...item, ...scanSummary });
  });

  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify(nextProfiles));
}

function loadProfiles() {
  const raw = localStorage.getItem(STORAGE_KEYS.profiles);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw).map(hydrateProfile);
  } catch {
    return [];
  }
}

function createFreshProfile() {
  return hydrateProfile({
    ...defaultProfile,
    name: "New Search",
    terms: [],
  });
}

function hydrateProfile(profile) {
  return {
    ...defaultProfile,
    ...profile,
    terms: Array.isArray(profile.terms) ? profile.terms : defaultProfile.terms,
    excludes: Array.isArray(profile.excludes) ? profile.excludes : defaultProfile.excludes,
    noiseTerms: Array.isArray(profile.noiseTerms) ? profile.noiseTerms : [...ACCESSORY_TERMS],
    sources: hydrateSourceSelection(profile.sources),
  };
}

function hydrateSourceSelection(sources) {
  if (!Array.isArray(sources)) return defaultProfile.sources;

  const knownSourceIds = SOURCES.map((source) => source.id);
  const selectedSources = sources.filter((source) => knownSourceIds.includes(source));
  const hadEveryLegacyDefault = LEGACY_DEFAULT_SOURCE_IDS.every((source) => selectedSources.includes(source));

  if (hadEveryLegacyDefault && !selectedSources.includes("reverb")) {
    selectedSources.push("reverb");
  }

  return [...new Set(selectedSources)];
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
  return {
    currency: settings.currency === "USD" ? "USD" : "JPY",
    jpyPerUsd: Number.isFinite(rate) && rate > 0 ? rate : defaultSettings.jpyPerUsd,
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

  const title = normalizeText(listing.title);
  const matchesPrimary = searchContext.primaryTerms.some((term) => termMatches(title, term));
  const matchesRefinement = searchContext.refinementTerms.length === 0
    || searchContext.refinementTerms.some((term) => termMatches(title, term));

  return matchesPrimary && matchesRefinement;
}

function createSourceSearchTerms(terms) {
  return uniqueTerms(terms.map((term) => parseMatchTerm(term).value));
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
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function saveSet(key, values) {
  localStorage.setItem(key, JSON.stringify([...values]));
}

function loadLedger() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.listingLedger) || "{}");
  } catch {
    return {};
  }
}

function saveLedger(ledger) {
  localStorage.setItem(STORAGE_KEYS.listingLedger, JSON.stringify(ledger));
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
  const profileNames = new Set(previous.profileNames || []);
  if (options.profileName) profileNames.add(options.profileName);

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
    lastFoundAt: options.lastFoundAt || previous.lastFoundAt || now,
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
  themeToggle.querySelector(".theme-icon").textContent = isDark ? "☀" : "◐";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

function isSeen(listingId) {
  return loadSet(STORAGE_KEYS.seen).includes(listingId);
}

function normalizeText(value) {
  return value.toLocaleLowerCase("ja-JP").normalize("NFKC");
}

function formatPrice(value) {
  if (appSettings.currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value / appSettings.jpyPerUsd);
  }

  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
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
    return `Bumpers: ${profile.name}\n\nNo new listings.`;
  }

  const lines = listings.map((listing) => {
    const source = SOURCES.find((item) => item.id === listing.source)?.label || listing.source;
    return `${listing.title}\n${formatPrice(listing.price)} · ${source}\n${listing.url}`;
  });

  return `Bumpers: ${profile.name}\nAlert mode: ${profile.alertMode}\n\n${lines.join("\n\n")}`;
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
