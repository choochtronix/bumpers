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
let filterMode = "all";
let isSearching = false;

const sourceList = document.querySelector("#sourceList");
const savedSearches = document.querySelector("#savedSearches");
const searchForm = document.querySelector("#searchForm");
const resultGrid = document.querySelector("#resultGrid");
const template = document.querySelector("#listingTemplate");
const themeToggle = document.querySelector("#themeToggle");
const liveStatus = document.querySelector("#liveStatus");

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
    renderResults();
  });

  document.querySelector("#copyDigest").addEventListener("click", async () => {
    const digest = createEmailDigest(currentProfile, currentResults.filter((listing) => !isSeen(listing.id)));
    await copyText(digest);
  });

  document.querySelector("#urgencyFilter").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    filterMode = button.dataset.filter;
    document.querySelectorAll("#urgencyFilter button").forEach((item) => item.classList.toggle("active", item === button));
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
  liveStatus.textContent = "Searching";
  renderResults();

  const liveListings = await fetchLiveListings(currentProfile);
  const normalizedTerms = currentProfile.terms.map(normalizeText);
  const normalizedExcludes = currentProfile.excludes.map(normalizeText);
  const listings = liveListings.length > 0 ? liveListings : MOCK_LISTINGS;

  currentResults = listings
    .filter((listing) => currentProfile.sources.includes(listing.source))
    .filter((listing) => currentProfile.maxPrice <= 0 || listing.price <= currentProfile.maxPrice)
    .filter((listing) => normalizedTerms.some((term) => normalizeText(listing.title).includes(term)))
    .filter((listing) => !normalizedExcludes.some((term) => normalizeText(listing.title).includes(term)))
    .sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));

  document.querySelector("#activeTitle").textContent = currentProfile.name;
  isSearching = false;
  liveStatus.textContent = liveListings.length > 0 ? "Live Digimart" : "Mock data";
  renderResults();
}

function renderResults() {
  const watching = loadSet(STORAGE_KEYS.watching);
  const visibleResults = currentResults.filter((listing) => {
    if (filterMode === "new") return !isSeen(listing.id);
    if (filterMode === "watching") return watching.includes(listing.id);
    return true;
  });

  resultGrid.innerHTML = "";

  if (isSearching) {
    resultGrid.innerHTML = `<div class="empty-state">Searching live sources...</div>`;
  } else if (visibleResults.length === 0) {
    resultGrid.innerHTML = `<div class="empty-state">No matching listings in this view.</div>`;
  } else {
    visibleResults.forEach((listing) => resultGrid.appendChild(renderListing(listing)));
  }

  const newListings = currentResults.filter((listing) => !isSeen(listing.id));
  document.querySelector("#totalCount").textContent = currentResults.length;
  document.querySelector("#newCount").textContent = newListings.length;
  document.querySelector("#sourceCount").textContent = new Set(currentResults.map((listing) => listing.source)).size;
}

async function fetchLiveListings(profile) {
  if (location.protocol === "file:" || !profile.sources.includes("digimart")) {
    return [];
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
    return Array.isArray(payload.listings) ? payload.listings : [];
  } catch (error) {
    console.warn("Live search unavailable; falling back to mock listings.", error);
    return [];
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
