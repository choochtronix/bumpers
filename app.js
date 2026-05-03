const SOURCES = [
  { id: "mercari", label: "Mercari", color: "rose" },
  { id: "yahoo-auctions", label: "Yahoo Auctions", color: "amber" },
  { id: "yahoo-fleamarket", label: "Yahoo Fleamarket", color: "blue" },
  { id: "rakuma", label: "Rakuma", color: "green" },
  { id: "digimart", label: "Digimart", color: "blue" },
  { id: "offmall", label: "OFFMALL", color: "green" },
  { id: "five-g", label: "Five G", color: "amber" },
  { id: "implant4", label: "implant4", color: "rose" },
  { id: "hardoff", label: "Hard Off", color: "green" },
];

const LIVE_SOURCE_IDS = ["digimart", "offmall", "hardoff"];
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
  "マニュアル",
  "取扱説明書",
  "教則",
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
};

const defaultProfile = {
  name: "Waldorf",
  terms: ["Waldorf", "ワルドルフ", "WALDORF"],
  excludes: ["manual", "magnet", "power cord", "doll", "Fashionist", "shirt", "CD", "Moments to Remember", "record", "shoes"],
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
let isSearching = false;
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
const template = document.querySelector("#listingTemplate");
const themeToggle = document.querySelector("#themeToggle");
const liveStatus = document.querySelector("#liveStatus");
const qualityFilterSelect = document.querySelector("#qualityFilter");
const sortModeSelect = document.querySelector("#sortMode");

function initialize() {
  applyStoredTheme();
  renderSources();
  fillForm(currentProfile);
  renderSavedSearches();
  runSearch();
  bindEvents();
}

function bindEvents() {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    currentProfile = readProfileFromForm();
    runSearch();
  });

  document.querySelector("#saveProfile").addEventListener("click", () => {
    currentProfile = readProfileFromForm();
    saveProfile(currentProfile);
    renderSavedSearches();
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
    document.querySelectorAll("#urgencyFilter button").forEach((item) => item.classList.toggle("active", item === button));
    renderResults();
  });

  qualityFilterSelect.addEventListener("change", () => {
    qualityFilter = qualityFilterSelect.value;
    renderResults();
  });

  sortModeSelect.addEventListener("change", () => {
    sortMode = sortModeSelect.value;
    renderResults();
  });

  themeToggle.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

function renderSources() {
  sourceList.innerHTML = SOURCES.map((source) => `
    <label class="source-toggle">
      <input type="checkbox" name="sources" value="${source.id}" checked />
      <span>${source.label}</span>
    </label>
  `).join("");
}

function fillForm(profile) {
  document.querySelector("#profileName").value = profile.name;
  document.querySelector("#terms").value = profile.terms.join("\n");
  document.querySelector("#excludes").value = profile.excludes.join("\n");
  document.querySelector("#maxPrice").value = profile.maxPrice;
  document.querySelector("#alertMode").value = profile.alertMode;
  document.querySelectorAll("input[name='sources']").forEach((input) => {
    input.checked = profile.sources.includes(input.value);
  });
}

function readProfileFromForm() {
  return {
    name: document.querySelector("#profileName").value.trim() || "Untitled Search",
    terms: splitLines(document.querySelector("#terms").value),
    excludes: splitLines(document.querySelector("#excludes").value),
    maxPrice: Number(document.querySelector("#maxPrice").value || 0),
    alertMode: document.querySelector("#alertMode").value,
    sources: [...document.querySelectorAll("input[name='sources']:checked")].map((input) => input.value),
  };
}

function splitLines(value) {
  return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean);
}

async function runSearch() {
  isSearching = true;
  searchState = { mode: "searching", message: "Searching", detail: "Checking live sources.", errors: [] };
  updateSearchStatus();
  renderResults();

  const liveResult = await fetchLiveListings(currentProfile);
  const normalizedTerms = currentProfile.terms.map(normalizeText);
  const normalizedExcludes = currentProfile.excludes.map(normalizeText);
  const useMockListings = liveResult.mode === "mock" || liveResult.mode === "error";
  const listings = useMockListings ? MOCK_LISTINGS : liveResult.listings;

  currentResults = listings
    .filter((listing) => sourceMatchesProfile(listing.source, currentProfile.sources))
    .filter((listing) => currentProfile.maxPrice <= 0 || listing.price <= currentProfile.maxPrice)
    .filter((listing) => normalizedTerms.some((term) => normalizeText(listing.title).includes(term)))
    .filter((listing) => !normalizedExcludes.some((term) => normalizeText(listing.title).includes(term)))
    .sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));

  currentDiscoveryIds = liveResult.mode === "live" ? getNewDiscoveryIds(currentResults) : new Set();
  if (liveResult.mode === "live") {
    recordListingDiscoveries(currentProfile, currentResults);
    liveResult.detail = appendDiscoveryDetail(liveResult.detail, currentDiscoveryIds.size);
  }

  document.querySelector("#activeTitle").textContent = currentProfile.name;
  isSearching = false;
  searchState = liveResult;
  updateSearchStatus();
  renderResults();
}

function getCurrentAlertListings() {
  return currentResults.filter((listing) => currentDiscoveryIds.has(listing.id));
}

function renderResults() {
  const watching = loadSet(STORAGE_KEYS.watching);
  const visibleResults = getVisibleResults(watching);

  resultGrid.innerHTML = "";

  if (isSearching) {
    resultGrid.innerHTML = `<div class="empty-state">Searching live sources...</div>`;
  } else if (searchState.mode === "error" && visibleResults.length === 0) {
    resultGrid.innerHTML = `<div class="empty-state"><strong>Live search failed.</strong><span>${searchState.detail}</span></div>`;
  } else if (visibleResults.length === 0) {
    resultGrid.innerHTML = `<div class="empty-state"><strong>No matching listings in this view.</strong><span>${searchState.detail || "Try another term or source."}</span></div>`;
  } else {
    visibleResults.forEach((listing) => resultGrid.appendChild(renderListing(listing)));
  }

  const newListings = visibleResults.filter((listing) => !isSeen(listing.id));
  document.querySelector("#totalCount").textContent = visibleResults.length;
  document.querySelector("#newCount").textContent = newListings.length;
  document.querySelector("#sourceCount").textContent = new Set(visibleResults.map((listing) => listing.source)).size;
}

function getVisibleResults(watching) {
  return currentResults
    .filter((listing) => {
      if (filterMode === "new") return !isSeen(listing.id);
      if (filterMode === "watching") return watching.includes(listing.id);
      return true;
    })
    .filter((listing) => qualityFilter === "all" || isCleanGearListing(listing))
    .sort(compareListings);
}

async function fetchLiveListings(profile) {
  const hasLiveSource = profile.sources.some((source) => LIVE_SOURCE_IDS.includes(source));

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
    const params = new URLSearchParams({
      terms: profile.terms.join("|"),
      excludes: profile.excludes.join("|"),
      maxPrice: String(profile.maxPrice || 0),
      sources: profile.sources.join("|"),
    });
    const response = await fetch(`/api/search?${params.toString()}`);

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
  const watching = new Set(loadSet(STORAGE_KEYS.watching));

  card.classList.toggle("is-new", !isSeen(listing.id));
  imageLink.href = listing.url;
  image.src = listing.image;
  image.alt = listing.title;
  fragment.querySelector(".source-chip").textContent = source?.label || listing.source;
  fragment.querySelector(".condition").textContent = listing.condition;
  fragment.querySelector("h3").textContent = listing.title;
  fragment.querySelector(".shop-name").textContent = listing.shop || source?.label || "";
  fragment.querySelector(".price-row strong").textContent = formatYen(listing.price);
  fragment.querySelector(".price-row span").textContent = relativeDate(listing.listedAt);
  fragment.querySelector(".open-link").href = listing.url;
  watchButton.classList.toggle("is-watching", watching.has(listing.id));
  watchButton.textContent = watching.has(listing.id) ? "★" : "☆";

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

  return fragment;
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

function sourceMatchesProfile(sourceId, selectedSources) {
  if (selectedSources.includes(sourceId)) return true;
  return sourceId === "offmall" && selectedSources.includes("hardoff");
}

function isCleanGearListing(listing) {
  const searchable = normalizeText(`${listing.title} ${listing.condition || ""} ${listing.shop || ""}`);
  return !ACCESSORY_TERMS.some((term) => searchable.includes(normalizeText(term)));
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
    const button = document.createElement("button");
    button.className = "saved-search";
    button.type = "button";
    button.innerHTML = `
      <strong>${profile.name}</strong>
      <span>${profile.alertMode}</span>
      <span>${profile.terms.slice(0, 3).join(", ")}</span>
      <span>${formatYen(profile.maxPrice)}</span>
    `;
    button.addEventListener("click", () => {
      currentProfile = profile;
      fillForm(profile);
      runSearch();
    });
    savedSearches.appendChild(button);
  });
}

function saveProfile(profile) {
  const profiles = loadProfiles().filter((item) => item.name !== profile.name);
  localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify([profile, ...profiles]));
}

function loadProfiles() {
  const raw = localStorage.getItem(STORAGE_KEYS.profiles);
  if (!raw) {
    localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify([defaultProfile]));
    return [defaultProfile];
  }

  try {
    return JSON.parse(raw);
  } catch {
    return [defaultProfile];
  }
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
