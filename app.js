const SOURCES = [
  { id: "mercari", label: "Mercari", icon: "Me", color: "rose" },
  { id: "yahoo-auctions", label: "Yahoo Auctions", icon: "Y!", color: "amber" },
  { id: "yahoo-fleamarket", label: "Yahoo Fleamarket", icon: "Yf", color: "blue" },
  { id: "rakuma", label: "Rakuma", icon: "Ra", color: "green" },
  { id: "digimart", label: "Digimart", icon: "D", color: "blue" },
  { id: "offmall", label: "OFFMALL", icon: "O", color: "green" },
  { id: "five-g", label: "Five G", icon: "5G", color: "amber" },
  { id: "implant4", label: "implant4", icon: "i4", color: "rose" },
  { id: "hardoff", label: "Hard Off", icon: "H", color: "green" },
];

const LIVE_SOURCE_IDS = ["mercari", "yahoo-auctions", "yahoo-fleamarket", "rakuma", "digimart", "offmall", "hardoff"];
const LIVE_SOURCE_DISPLAY_ORDER = ["yahoo-auctions", "yahoo-fleamarket", "digimart", "offmall", "hardoff", "mercari", "rakuma"];
const RESULTS_PER_PAGE = 48;
const SOURCE_ACCENTS = {
  mercari: "#e53935",
  "yahoo-auctions": "#d60000",
  "yahoo-fleamarket": "#1f73e8",
  rakuma: "#12a05c",
  digimart: "#0a62b7",
  offmall: "#f2a900",
  hardoff: "#f2a900",
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
  listingLedger: "bumpers.listingLedger",
  feedbackRules: "bumpers.feedbackRules",
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

let currentProfile = loadProfiles()[0] || defaultProfile;
let currentResults = [];
let currentDiscoveryIds = new Set();
let filterMode = "all";
let qualityFilter = "clean";
let sortMode = "newest";
let activeViewSources = new Set();
let currentPage = 1;
let isSearching = false;
let pendingSourceIds = new Set();
let searchRunId = 0;
let loadingCardId = 0;
let backToTopFrame = 0;
const rakumaClientThumbnailCache = new Map();
let searchState = {
  mode: "mock",
  message: "Mock data",
  detail: "Open through the local server for live search.",
  errors: [],
};

const sourceList = document.querySelector("#sourceList");
const savedSearches = document.querySelector("#savedSearches");
const searchForm = document.querySelector("#searchForm");
const resultGrid = document.querySelector("#resultGrid");
const paginationControls = document.querySelector("#paginationControls");
const paginationSummary = document.querySelector("#paginationSummary");
const paginationPage = document.querySelector("#paginationPage");
const template = document.querySelector("#listingTemplate");
const alertTemplate = document.querySelector("#alertTemplate");
const alertList = document.querySelector("#alertList");
const alertCount = document.querySelector("#alertCount");
const alertDetail = document.querySelector("#alertDetail");
const sourceFilterList = document.querySelector("#sourceFilterList");
const themeToggle = document.querySelector("#themeToggle");
const liveStatus = document.querySelector("#liveStatus");
const qualityFilterSelect = document.querySelector("#qualityFilter");
const sortModeSelect = document.querySelector("#sortMode");
const refineSearchModal = document.querySelector("#refineSearchModal");
const refineSummary = document.querySelector("#refineSummary");
const saveSearchModal = document.querySelector("#saveSearchModal");
const saveSearchForm = document.querySelector("#saveSearchForm");
const saveSearchName = document.querySelector("#saveSearchName");
const saveSearchAlert = document.querySelector("#saveSearchAlert");
const backToTopButton = document.querySelector("#backToTop");
let refineSearchReturnFocus = null;
let saveSearchReturnFocus = null;

function initialize() {
  applyStoredTheme();
  renderSources();
  fillForm(currentProfile);
  renderSavedSearches();
  runSearch();
  bindEvents();
  updateBackToTopVisibility();
}

function bindEvents() {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentProfile = readProfileFromForm();
    renderRefineSummary();
    closeRefineSearchModal({ restoreFocus: false });
    runSearch();
  });

  document.querySelector("#openRefineSearch").addEventListener("click", openRefineSearchModal);
  document.querySelector("#openResultRefineSearch").addEventListener("click", openRefineSearchModal);
  document.querySelector("#closeRefineSearch").addEventListener("click", closeRefineSearchModal);
  document.querySelector("#cancelRefineSearch").addEventListener("click", closeRefineSearchModal);
  document.querySelector("#applyRefineSearch").addEventListener("click", applyRefineSearchOnly);
  refineSearchModal.addEventListener("click", (event) => {
    if (event.target === refineSearchModal) closeRefineSearchModal();
  });
  refineSearchModal.addEventListener("input", renderRefineSummary);
  refineSearchModal.addEventListener("change", renderRefineSummary);

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

  qualityFilterSelect.addEventListener("change", () => {
    qualityFilter = qualityFilterSelect.value;
    resetPagination();
    renderResults();
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
    if (!refineSearchModal.hidden) closeRefineSearchModal();
    if (!saveSearchModal.hidden) closeSaveSearchModal();
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
  document.querySelector("#terms").value = hydratedProfile.terms.join("\n");
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
  const terms = splitLines(document.querySelector("#terms").value);

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

function openRefineSearchModal(event) {
  refineSearchReturnFocus = event?.currentTarget || document.activeElement;
  renderRefineSummary();
  refineSearchModal.hidden = false;
  document.body.classList.add("modal-open");
  document.querySelector("#excludes").focus();
}

function closeRefineSearchModal(options = {}) {
  const { restoreFocus = true } = options;
  if (refineSearchModal.hidden) return;
  refineSearchModal.hidden = true;
  document.body.classList.remove("modal-open");
  if (restoreFocus) refineSearchReturnFocus?.focus();
}

function applyRefineSearchOnly() {
  currentProfile = readProfileFromForm();
  renderRefineSummary();
  closeRefineSearchModal();
}

function renderRefineSummary() {
  if (!refineSummary) return;
  const profile = readProfileFromForm();
  const sourceCount = profile.sources.length;
  const sourceText = `${sourceCount} ${sourceCount === 1 ? "source" : "sources"}`;
  const priceText = profile.maxPrice > 0 ? `${formatYen(profile.maxPrice)} max` : "No price cap";
  const excludeText = `${profile.excludes.length} excluded`;
  refineSummary.textContent = `${sourceText} · ${priceText} · ${profile.alertMode} · ${excludeText}`;
}

function openSaveSearchModal(event) {
  saveSearchReturnFocus = event?.currentTarget || document.activeElement;
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

function splitLines(value) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

async function runSearch() {
  const runId = ++searchRunId;
  const profileSnapshot = cloneProfile(currentProfile);
  const searchGroups = createLiveSearchGroups(profileSnapshot);

  resetPagination();
  isSearching = true;
  pendingSourceIds = new Set(searchGroups.filter((group) => group.id !== "mock").map((group) => group.id));
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
  applySearchResult(profileSnapshot, liveResult, true);
}

function applySearchResult(profile, liveResult, isFinal) {
  const expandedTerms = expandSearchTerms(profile.terms);
  const useMockListings = liveResult.mode === "mock" || liveResult.mode === "error";
  const listings = useMockListings ? MOCK_LISTINGS : liveResult.listings;

  currentResults = listings
    .filter((listing) => sourceMatchesProfile(listing.source, profile.sources))
    .filter((listing) => profile.maxPrice <= 0 || listing.price <= profile.maxPrice)
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => expandedTerms.some((term) => termMatches(normalizeText(listing.title), term)))
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
  const visibleResults = getVisibleResults(watching);
  const totalPages = getTotalPages(visibleResults.length);
  currentPage = Math.min(currentPage, totalPages);
  const pageResults = paginateResults(visibleResults);

  resultGrid.innerHTML = "";
  renderSourceFilters();
  renderAlertPanel();

  if (visibleResults.length > 0) {
    pageResults.forEach((listing) => resultGrid.appendChild(renderListing(listing)));
    renderPendingSourceCards();
  } else if (isSearching) {
    renderPendingSourceCards();
    if (resultGrid.childElementCount === 0) {
      resultGrid.innerHTML = `<div class="empty-state">Searching live sources...</div>`;
    }
  } else if (searchState.mode === "error" && visibleResults.length === 0) {
    resultGrid.innerHTML = `<div class="empty-state"><strong>Live search failed.</strong><span>${searchState.detail}</span></div>`;
  } else if (visibleResults.length === 0) {
    resultGrid.innerHTML = `<div class="empty-state"><strong>No matching listings in this view.</strong><span>${searchState.detail || "Try another term or source."}</span></div>`;
  }

  const newListings = visibleResults.filter((listing) => currentDiscoveryIds.has(listing.id));
  document.querySelector("#totalCount").textContent = visibleResults.length;
  document.querySelector("#newCount").textContent = newListings.length;
  document.querySelector("#sourceCount").textContent = new Set(visibleResults.map((listing) => listing.source)).size;
  renderPagination(visibleResults.length, totalPages);
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

  return card;
}

function getSourceAccent(sourceId) {
  return SOURCE_ACCENTS[sourceId] || "#4b83d8";
}

function getVisibleResults(watching) {
  return currentResults
    .filter((listing) => {
      if (filterMode === "new") return currentDiscoveryIds.has(listing.id);
      if (filterMode === "maybe") return formatGearConfidence(listing).level === "maybe-gear";
      if (filterMode === "watching") return watching.includes(listing.id);
      return true;
    })
    .filter((listing) => !isUnavailableListing(listing))
    .filter((listing) => activeViewSources.size === 0 || activeViewSources.has(listing.source))
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing))
    .sort(compareListings);
}

function renderSourceFilters() {
  const counts = getSourceCountsForCurrentView();
  const availableSources = SOURCES.filter((source) => counts.get(source.id) > 0);
  sourceFilterList.innerHTML = "";

  if (availableSources.length === 0) {
    sourceFilterList.innerHTML = `<button class="source-filter-button is-active" type="button" disabled>All</button>`;
    return;
  }

  sourceFilterList.appendChild(createAllSourceFilterButton());

  availableSources.forEach((source) => {
    const button = document.createElement("button");
    button.className = "source-filter-button";
    button.type = "button";
    button.dataset.source = source.id;
    button.classList.toggle("is-active", activeViewSources.has(source.id));
    button.title = `${source.label} results`;
    button.setAttribute("aria-label", `Filter to ${source.label} results`);
    button.setAttribute("aria-pressed", String(activeViewSources.has(source.id)));
    button.innerHTML = `
      <span class="source-avatar source-filter-avatar" data-source="${source.id}">${source.icon}</span>
      <span>${counts.get(source.id)}</span>
    `;
    sourceFilterList.appendChild(button);
  });
}

function createAllSourceFilterButton() {
  const button = document.createElement("button");
  button.className = "source-filter-button source-filter-all";
  button.type = "button";
  button.dataset.source = "all";
  button.classList.toggle("is-active", activeViewSources.size === 0);
  button.setAttribute("aria-pressed", String(activeViewSources.size === 0));
  button.textContent = `All ${getSourceFilteredBaseResults().length}`;
  return button;
}

function getSourceCountsForCurrentView() {
  const counts = new Map();
  getSourceFilteredBaseResults().forEach((listing) => {
    counts.set(listing.source, (counts.get(listing.source) || 0) + 1);
  });
  return counts;
}

function getSourceFilteredBaseResults() {
  const watching = loadSet(STORAGE_KEYS.watching);
  return currentResults
    .filter((listing) => {
      if (filterMode === "new") return currentDiscoveryIds.has(listing.id);
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
    if (!availableSources.has(sourceId)) activeViewSources.delete(sourceId);
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
    const liveSearchTerms = expandSearchTerms(profile.terms);
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
  const watching = new Set(loadSet(STORAGE_KEYS.watching));
  const feedback = getProfileFeedback();
  const feedbackStatus = getListingFeedbackStatus(listing, feedback);

  card.classList.toggle("is-new", currentDiscoveryIds.has(listing.id));
  card.classList.toggle("is-feedback-gear", feedbackStatus === "gear");
  card.classList.toggle("is-feedback-noise", feedbackStatus === "noise");
  imageLink.href = listing.url;
  image.src = listing.image;
  image.alt = listing.title;
  hydrateRenderedRakumaImage(listing, image);
  renderSourceAvatar(fragment.querySelector(".source-avatar"), source, listing.source);
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector(".condition").textContent = formatCondition(listing);
  fragment.querySelector("h3").textContent = listing.title;
  fragment.querySelector(".shop-name").textContent = listing.shop || source?.label || "";
  fragment.querySelector(".price-row strong").textContent = formatYen(listing.price);
  fragment.querySelector(".price-row span").textContent = relativeDate(listing.listedAt);
  fragment.querySelector(".open-link").href = listing.url;
  watchButton.classList.toggle("is-watching", watching.has(listing.id));
  watchButton.textContent = watching.has(listing.id) ? "★" : "☆";
  gearButton.classList.toggle("is-active", feedbackStatus === "gear");
  noiseButton.classList.toggle("is-active", feedbackStatus === "noise");

  watchButton.addEventListener("click", () => {
    const next = new Set(loadSet(STORAGE_KEYS.watching));
    if (next.has(listing.id)) {
      next.delete(listing.id);
    } else {
      next.add(listing.id);
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

function renderAlertPanel() {
  const alertListings = getCurrentAlertListings().filter((listing) => qualityFilter === "all" || isCleanGearListing(listing));
  alertList.innerHTML = "";
  alertCount.textContent = alertListings.length;
  alertDetail.textContent = createAlertDetail(alertListings.length);

  if (isSearching) {
    alertList.innerHTML = `<div class="alert-empty">Scanning saved search sources...</div>`;
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
  fragment.querySelector(".alert-price").textContent = formatYen(listing.price);
  fragment.querySelector("h4").textContent = listing.title;
  fragment.querySelector("p").textContent = `${formatGearConfidence(listing).label} · ${listing.shop || listing.condition || ""}`;
  openLink.href = listing.url;

  return fragment;
}

function createAlertDetail(count) {
  if (isSearching) return "Scanning now";
  if (searchState.mode !== "live") return searchState.message;
  if (count === 1) return "1 fresh listing";
  return `${count} fresh listings`;
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
  avatar.textContent = source?.icon || fallbackId.slice(0, 2).toUpperCase();
  avatar.dataset.source = source?.id || fallbackId;
  avatar.setAttribute("aria-label", `${label} listing`);
  avatar.setAttribute("title", label);
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

function formatCondition(listing) {
  const confidence = formatGearConfidence(listing);
  return [confidence.label, listing.condition].filter(Boolean).join(" · ");
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
    button.innerHTML = `
      <strong>${profile.name}</strong>
      <span>${profile.alertMode}</span>
      <span>${profile.terms.slice(0, 3).join(", ")}</span>
      <span>${formatYen(profile.maxPrice)}</span>
      <span class="scan-meta">${formatScanMeta(profile)}</span>
      <span class="scan-new">${profile.lastNewCount || 0} new</span>
    `;
    button.addEventListener("click", () => {
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
    localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify([defaultProfile]));
    return [defaultProfile];
  }

  try {
    return JSON.parse(raw).map(hydrateProfile);
  } catch {
    return [defaultProfile];
  }
}

function hydrateProfile(profile) {
  return {
    ...defaultProfile,
    ...profile,
    terms: Array.isArray(profile.terms) ? profile.terms : defaultProfile.terms,
    excludes: Array.isArray(profile.excludes) ? profile.excludes : defaultProfile.excludes,
    noiseTerms: Array.isArray(profile.noiseTerms) ? profile.noiseTerms : [...ACCESSORY_TERMS],
    sources: Array.isArray(profile.sources) ? profile.sources : defaultProfile.sources,
  };
}

function formatScanMeta(profile) {
  if (!profile.lastScannedAt) return "Not scanned yet";

  const status = profile.lastScanStatus === "partial" ? "partial" : "scanned";
  return `${status} ${formatShortDate(profile.lastScannedAt)} · ${profile.lastMatchCount || 0} matches`;
}

function getActiveNoiseTerms() {
  const savedNoise = currentProfile.noiseTerms || [];
  return uniqueTerms([...ACCESSORY_TERMS, ...savedNoise]);
}

function expandSearchTerms(terms) {
  const expanded = [];

  terms.forEach((term) => {
    expanded.push(term);

    const matchTerm = parseMatchTerm(term);
    if (!matchTerm.exact) {
      const normalized = normalizeText(matchTerm.value);
      const aliases = SEARCH_TERM_ALIASES[normalized] || [];
      expanded.push(...aliases);
    }
  });

  return uniqueTerms(expanded);
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
    const previous = ledger[listing.id] || {};
    const profileNames = new Set(previous.profileNames || []);
    profileNames.add(profile.name);

    ledger[listing.id] = {
      ...previous,
      id: listing.id,
      source: listing.source,
      title: listing.title,
      price: listing.price,
      url: listing.url,
      image: listing.image,
      firstDiscoveredAt: previous.firstDiscoveredAt || now,
      lastFoundAt: now,
      profileNames: [...profileNames],
    };
  });

  saveLedger(ledger);
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

function formatYen(value) {
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
    return `${listing.title}\n${formatYen(listing.price)} · ${source}\n${listing.url}`;
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
