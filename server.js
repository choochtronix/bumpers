import { createServer } from "node:http";
import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { attachNormalizedListings } from "./src/agents/listingNormalizerAgent.js";
import { runSourceHealthAgent } from "./src/agents/sourceHealthAgent.js";
import { appendSourceHealthLogs, readSourceHealthState } from "./src/lib/sourceHealthStore.js";
import { getCheckableSources, SOURCE_REGISTRY } from "./src/sources/sourceRegistry.js";

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = fileURLToPath(new URL(".", import.meta.url));
loadLocalEnvFiles([".env.local", ".env"]);
const CLOUD_DATA_FILE = join(ROOT, "data", "cloud-saved-searches.json");
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const CLOUD_PROVIDER = process.env.BUMPERS_CLOUD_PROVIDER || (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "file");
const CLOUD_PROFILE_USER_ID = process.env.BUMPERS_CLOUD_USER_ID || "local";
const CLOUD_PROFILE_EMAIL = process.env.BUMPERS_CLOUD_USER_EMAIL || "local@bumpers.dev";
const CLOUD_PROFILE_NAME = process.env.BUMPERS_CLOUD_USER_NAME || "Local Brrtz User";
const REQUIRE_INVITE = process.env.BUMPERS_REQUIRE_INVITE === "true";
const JOB_TOKEN = process.env.BUMPERS_JOB_TOKEN || "";
const SOURCE_HEALTH_FILE = join(ROOT, "data", "agent-source-health.json");
const DIGIMART_BASE_URL = "https://www.digimart.net";
const FIVE_G_BASE_URL = "https://fiveg.net";
const IMPLANT4_BASE_URL = "https://shop.implant4.com";
const JIMOTY_BASE_URL = "https://jmty.jp";
const MERCARI_BASE_URL = "https://jp.mercari.com";
const OFFMALL_BASE_URL = "https://netmall.hardoff.co.jp";
const RAKUMA_BASE_URL = "https://fril.jp";
const REVERB_API_BASE_URL = "https://api.reverb.com";
const REVERB_BASE_URL = "https://reverb.com";
const EBAY_API_BASE_URL = "https://api.ebay.com";
const EBAY_CLIENT_ID = process.env.EBAY_CLIENT_ID || "";
const EBAY_CLIENT_SECRET = process.env.EBAY_CLIENT_SECRET || "";
const EBAY_MARKETPLACE_ID = process.env.EBAY_MARKETPLACE_ID || "EBAY_US";
const DEFAULT_EBAY_CATEGORY_IDS = ["619"]; // Musical Instruments & Gear
const CONFIGURED_EBAY_CATEGORY_IDS = splitParam(process.env.EBAY_CATEGORY_IDS || "");
const EBAY_CATEGORY_IDS = CONFIGURED_EBAY_CATEGORY_IDS.length
  ? CONFIGURED_EBAY_CATEGORY_IDS
  : DEFAULT_EBAY_CATEGORY_IDS;
const EBAY_PENDING_MESSAGE = "eBay connector is waiting for API approval. Add EBAY_CLIENT_ID and EBAY_CLIENT_SECRET when production keys are available.";
const CRAIGSLIST_SFBAY_BASE_URL = "https://sfbay.craigslist.org";
const CRAIGSLIST_LA_BASE_URL = "https://losangeles.craigslist.org";
const JINA_READER_BASE_URL = "https://r.jina.ai/http://";
const YAHOO_AUCTIONS_BASE_URL = "https://auctions.yahoo.co.jp";
const YAHOO_FLEAMARKET_BASE_URL = "https://paypayfleamarket.yahoo.co.jp";
const MERCARI_CACHE_TTL_MS = 5 * 60 * 1000;
const MERCARI_CONNECTOR_TIMEOUT_MS = 12000;
const MERCARI_RESULT_LIMIT = 40;
const MERCARI_TERM_LIMIT = 2;
const REVERB_RESULT_LIMIT = 32;
const REVERB_TERM_LIMIT = 3;
const EBAY_RESULT_LIMIT = 100;
const EBAY_TERM_LIMIT = 3;
const CRAIGSLIST_DETAIL_VERIFY_LIMIT = 12;
const CRAIGSLIST_DETAIL_VERIFY_CONCURRENCY = 6;
const CRAIGSLIST_MODE = normalizeMode(process.env.BRRTZ_CRAIGSLIST_MODE || process.env.BUMPERS_CRAIGSLIST_MODE || "parked", ["parked", "live"], "parked");
const CRAIGSLIST_PARKED_MESSAGE = "Craigslist Assist is active. Brrtz is not querying Craigslist automatically; open the prepared Craigslist search instead.";
const RAKUMA_THUMBNAIL_BATCH_SIZE = 4;
const RAKUMA_THUMBNAIL_LIMIT = 32;
const RAKUMA_IMAGE_PROXY_CACHE_TTL_MS = 15 * 60 * 1000;
const YAHOO_AUCTIONS_PAGE_SIZE = 100;
const YAHOO_AUCTIONS_DEFAULT_CATEGORY_SWEEPS = [
  "",
  "22436", // Musical instruments
  "2084019003", // Keyboards and synthesizers
];
const DEFAULT_CATEGORY_INTENT = "synthesizers";
const CATEGORY_INTENT_CONFIG = {
  all: {
    label: "All Synth Gear",
    yahooAuctionsBrowseCategoryIntents: ["synthesizers", "drum-machines"],
    yahooAuctionsCategorySweeps: ["", "22436", "2084019003", "2084019005"],
  },
  synthesizers: {
    label: "Synthesizers",
    yahooAuctionsBrowseCategoryId: "2084019003",
    yahooAuctionsCategorySweeps: YAHOO_AUCTIONS_DEFAULT_CATEGORY_SWEEPS,
  },
  "drum-machines": {
    label: "Drum Machines",
    yahooAuctionsBrowseCategoryId: "2084019005",
    yahooAuctionsCategorySweeps: ["", "22436", "2084019005"],
  },
  samplers: {
    label: "Samplers",
    yahooAuctionsBrowseTerms: ["sampler", "サンプラー", "akai mpc", "sp-404"],
    yahooAuctionsCategorySweeps: ["", "22436"],
  },
  sequencers: {
    label: "Sequencers",
    yahooAuctionsBrowseTerms: ["sequencer", "シーケンサー", "step sequencer"],
    yahooAuctionsCategorySweeps: ["", "22436"],
  },
  modular: {
    label: "Eurorack / Modular",
    yahooAuctionsBrowseTerms: ["eurorack", "modular synth", "モジュラーシンセ", "ユーロラック"],
    yahooAuctionsCategorySweeps: ["", "22436"],
  },
  "effects-pedals": {
    label: "Effects / Pedals",
    yahooAuctionsBrowseTerms: ["effects pedal", "delay pedal", "reverb pedal", "エフェクター", "ディレイ"],
    yahooAuctionsCategorySweeps: ["", "22436"],
  },
  "pro-audio": {
    label: "Pro Audio",
    yahooAuctionsBrowseCategoryId: "2084019010",
    yahooAuctionsBrowseTerms: ["audio interface", "mixer", "compressor", "preamp", "オーディオインターフェイス", "ミキサー"],
    yahooAuctionsCategorySweeps: ["", "22436", "2084019010"],
  },
};
const YAHOO_AUCTIONS_RHYTHM_CATEGORY = "2084019005";
const YAHOO_AUCTIONS_RHYTHM_TERMS = [
  "drum machine",
  "drum machines",
  "rhythm machine",
  "ドラムマシン",
  "リズムマシン",
  "リズムボックス",
];
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Brrtz/0.1 local personal gear search";
const CRAIGSLIST_USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15";
const mercariCache = new Map();
const rakumaThumbnailCache = new Map();
const rakumaImageProxyCache = new Map();
let ebayTokenCache = null;
let mercariBrowserPromise;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (url.pathname === "/api/health") {
      handleHealthCheck(request, response);
      return;
    }

    if (url.pathname === "/api/search") {
      await handleSearch(url, response);
      return;
    }

    if (url.pathname === "/api/browse") {
      await handleBrowse(url, response);
      return;
    }

    if (url.pathname === "/api/auth/config") {
      handleAuthConfig(request, response);
      return;
    }

    if (url.pathname === "/api/cloud/saved-searches") {
      await handleCloudSavedSearches(request, response);
      return;
    }

    if (url.pathname === "/api/cloud/profile") {
      await handleCloudProfile(request, response);
      return;
    }

    if (url.pathname === "/api/admin/sources") {
      await handleAdminSources(request, response);
      return;
    }

    if (url.pathname === "/api/admin/sources/health") {
      await handleAdminSourceHealth(request, response);
      return;
    }

    if (url.pathname === "/api/jobs/source-health") {
      await handleSourceHealthJob(request, url, response);
      return;
    }

    if (url.pathname === "/api/rakuma-image") {
      await handleRakumaImageProxy(url, response);
      return;
    }

    if (url.pathname === "/api/rakuma-thumbnail") {
      await handleRakumaThumbnail(url, response);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, {
      error: "server_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}).listen(PORT, HOST, () => {
  console.log(`Brrtz running locally at http://127.0.0.1:${PORT}`);
  for (const url of getLanUrls(PORT)) {
    console.log(`Brrtz available on your Wi-Fi at ${url}`);
  }
});

function getLanUrls(port) {
  return Object.values(networkInterfaces())
    .flat()
    .filter((details) => details && details.family === "IPv4" && !details.internal)
    .map((details) => `http://${details.address}:${port}`);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await closeMercariBrowser();
    process.exit(0);
  });
}

function loadLocalEnvFiles(fileNames) {
  for (const fileName of fileNames) {
    const filePath = join(ROOT, fileName);
    if (!existsSync(filePath)) continue;

    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      const rawValue = trimmed.slice(separatorIndex + 1).trim();
      if (!key || process.env[key] !== undefined) continue;

      process.env[key] = rawValue.replace(/^["']|["']$/g, "");
    }
  }
}

function handleAuthConfig(request, response) {
  if (request.method !== "GET") {
    response.writeHead(405, {
      "allow": "GET",
      "content-type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify({ error: "method_not_allowed" }));
    return;
  }

  sendJson(response, 200, {
    provider: "supabase",
    enabled: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
    supabaseUrl: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    redirectTo: getRequestOrigin(request),
  });
}

function handleHealthCheck(request, response) {
  if (request.method !== "GET") {
    response.writeHead(405, {
      "allow": "GET",
      "content-type": "application/json; charset=utf-8",
    });
    response.end(JSON.stringify({ error: "method_not_allowed" }));
    return;
  }

  sendJson(response, 200, {
    ok: true,
    app: "brrtz",
    cloudProvider: CLOUD_PROVIDER,
    inviteRequired: REQUIRE_INVITE,
    supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY),
    ebayConfigured: hasEbayCredentials(),
    craigslistMode: CRAIGSLIST_MODE,
    checkedAt: new Date().toISOString(),
  });
}

function getRequestOrigin(request) {
  const protocol = request.headers["x-forwarded-proto"] || "http";
  const host = request.headers["x-forwarded-host"] || request.headers.host || `127.0.0.1:${PORT}`;
  return `${protocol}://${host}`;
}

async function handleCloudSavedSearches(request, response) {
  let cloudUser;
  try {
    cloudUser = await getRequestCloudUser(request);
  } catch (error) {
    if (error instanceof AuthVerificationError) {
      sendJson(response, 401, {
        error: "auth_verification_failed",
        message: error.message,
      });
      return;
    }

    throw error;
  }

  if (request.method === "GET") {
    sendJson(response, 200, await readCloudSavedSearches(cloudUser));
    return;
  }

  if (request.method === "PUT") {
    const payload = await readJsonBody(request);
    const nextCloudState = createCloudSavedSearchState(payload, cloudUser);
    const savedCloudState = await writeCloudSavedSearches(nextCloudState, cloudUser);
    sendJson(response, 200, savedCloudState);
    return;
  }

  response.writeHead(405, {
    "allow": "GET, PUT",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify({ error: "method_not_allowed" }));
}

async function handleCloudProfile(request, response) {
  let cloudUser;
  try {
    cloudUser = await getRequestCloudUser(request);
  } catch (error) {
    if (error instanceof AuthVerificationError) {
      sendJson(response, 401, {
        error: "auth_verification_failed",
        message: error.message,
      });
      return;
    }

    throw error;
  }

  if (request.method === "GET") {
    try {
      sendJson(response, 200, await readCloudProfile(cloudUser));
    } catch (error) {
      sendCloudSetupError(response, error);
    }
    return;
  }

  if (request.method === "PUT") {
    try {
      const payload = await readJsonBody(request);
      sendJson(response, 200, await writeCloudProfile(cloudUser, payload));
    } catch (error) {
      sendCloudSetupError(response, error);
    }
    return;
  }

  response.writeHead(405, {
    "allow": "GET, PUT",
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify({ error: "method_not_allowed" }));
}

async function handleAdminSources(request, response) {
  if (!isAuthorizedOpsRequest(request)) {
    sendJson(response, 403, { error: "forbidden" });
    return;
  }

  sendJson(response, 200, {
    sources: SOURCE_REGISTRY,
    count: SOURCE_REGISTRY.length,
  });
}

async function handleAdminSourceHealth(request, response) {
  if (!isAuthorizedOpsRequest(request)) {
    sendJson(response, 403, { error: "forbidden" });
    return;
  }

  sendJson(response, 200, await readSourceHealthState(SOURCE_HEALTH_FILE));
}

async function handleSourceHealthJob(request, url, response) {
  if (!isAuthorizedOpsRequest(request)) {
    sendJson(response, 403, { error: "forbidden" });
    return;
  }

  const regionId = url.searchParams.get("region") || "japan";
  const sourceIds = splitParam(url.searchParams.get("sources"));
  const checkableSources = getHealthSourcesForRegion(regionId)
    .filter((source) => sourceIds.length === 0 || sourceIds.includes(source.id))
    .filter((source) => Boolean(getSourceHealthSearchFn(source.id)));

  const result = await runSourceHealthAgent({
    sources: checkableSources,
    checkSource: checkSourceHealthSource,
  });
  const state = await appendSourceHealthLogs(SOURCE_HEALTH_FILE, result.logs);

  sendJson(response, 200, {
    ...result,
    persisted: true,
    sourceCount: checkableSources.length,
    latestState: state.sources,
  });
}

const SHARED_SOURCE_HEALTH_REGION_IDS = {
  "bay-area": ["craigslist-sfbay", "reverb-us", "ebay-us"],
  "los-angeles": ["craigslist-la", "reverb-us", "ebay-us"],
};

function getHealthSourcesForRegion(regionId) {
  const checkableSources = getCheckableSources();
  const sharedSourceIds = SHARED_SOURCE_HEALTH_REGION_IDS[regionId];

  if (!sharedSourceIds) {
    return checkableSources.filter((source) => source.regionId === regionId);
  }

  const allowedSourceIds = new Set(sharedSourceIds);
  return checkableSources.filter((source) => allowedSourceIds.has(source.id));
}

async function checkSourceHealthSource(source) {
  const searchFn = getSourceHealthSearchFn(source.id);
  if (!searchFn) {
    return {
      listingsFound: 0,
      errorMessage: `No health adapter wired for ${source.id}`,
    };
  }

  const term = source.testQuery || "synth";
  const listings = await searchFn(term);
  return { listingsFound: Array.isArray(listings) ? listings.length : 0 };
}

function getSourceHealthSearchFn(sourceId) {
  if (!isCraigslistLiveEnabled() && sourceId.startsWith("craigslist-")) return null;
  if (sourceId === "ebay-us" && !hasEbayCredentials()) return null;

  return {
    digimart: searchDigimart,
    "ebay-us": searchEbayUs,
    "five-g": searchFiveG,
    implant4: searchImplant4,
    jimoty: searchJimoty,
    mercari: searchMercari,
    offmall: searchOffmall,
    "craigslist-la": searchCraigslistLa,
    "craigslist-sfbay": searchCraigslistSfbay,
    rakuma: searchRakuma,
    reverb: searchReverb,
    "reverb-us": searchReverbUs,
    "yahoo-auctions": searchYahooAuctions,
    "yahoo-fleamarket": searchYahooFleamarket,
  }[sourceId] || null;
}

function hasEbayCredentials() {
  return Boolean(EBAY_CLIENT_ID && EBAY_CLIENT_SECRET);
}

function isAuthorizedOpsRequest(request) {
  if (JOB_TOKEN) {
    const authorization = request.headers.authorization || "";
    return authorization === `Bearer ${JOB_TOKEN}`;
  }

  const address = request.socket?.remoteAddress || "";
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address);
}

function sendCloudSetupError(response, error) {
  const message = error instanceof Error ? error.message : String(error);
  const isMissingProfileTable = message.includes("user_profiles") && message.includes("PGRST205");

  if (isMissingProfileTable) {
    sendJson(response, 424, {
      error: "cloud_profile_setup_required",
      message: "Run the user_profiles SQL from docs/supabase-alpha-cloud-sync.md, then restart Brrtz.",
    });
    return;
  }

  throw error;
}

async function readCloudProfile(cloudUser = getCloudUser()) {
  if (isSupabaseCloudEnabled()) {
    return readSupabaseUserProfile(cloudUser);
  }

  return createCloudProfileState({ user: cloudUser });
}

async function writeCloudProfile(cloudUser = getCloudUser(), payload = {}) {
  const nextProfile = createCloudProfileState({
    ...payload,
    user: cloudUser,
  });

  if (isSupabaseCloudEnabled()) {
    return writeSupabaseUserProfile(nextProfile);
  }

  return nextProfile;
}

async function readCloudSavedSearches(cloudUser = getCloudUser()) {
  if (isSupabaseCloudEnabled()) {
    return readSupabaseSavedSearches(cloudUser);
  }

  try {
    const cloudState = JSON.parse(await readFile(CLOUD_DATA_FILE, "utf8"));
    return createCloudSavedSearchState(cloudState, cloudUser);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
    const emptyState = createCloudSavedSearchState({}, cloudUser);
    await writeCloudSavedSearches(emptyState, cloudUser);
    return emptyState;
  }
}

async function writeCloudSavedSearches(payload, cloudUser = getCloudUser()) {
  if (isSupabaseCloudEnabled()) {
    return writeSupabaseSavedSearches(payload, cloudUser);
  }

  await mkdir(join(ROOT, "data"), { recursive: true });
  await writeFile(CLOUD_DATA_FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return payload;
}

async function readJsonBody(request) {
  let body = "";

  for await (const chunk of request) {
    body += chunk;
    if (body.length > 1_000_000) {
      throw new Error("Cloud saved-search payload is too large.");
    }
  }

  if (!body.trim()) return {};
  return JSON.parse(body);
}

function createCloudSavedSearchState(payload = {}, cloudUser = getCloudUser()) {
  const now = new Date().toISOString();
  const user = normalizeCloudUser(payload.user || cloudUser);
  const profiles = Array.isArray(payload.profiles)
    ? payload.profiles
      .filter((profile) => profile && typeof profile === "object")
      .map((profile) => ({
        ...profile,
        userId: user.id,
      }))
    : [];

  return {
    app: "Brrtz",
    type: "saved-searches",
    schemaVersion: Number(payload.schemaVersion) || 1,
    storage: isSupabaseCloudEnabled() ? "supabase" : "cloud-emulator",
    user,
    updatedAt: now,
    profiles,
  };
}

function isSupabaseCloudEnabled() {
  return CLOUD_PROVIDER === "supabase" && Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY);
}

function createCloudProfileState(payload = {}) {
  const now = new Date().toISOString();
  const user = normalizeCloudUser(payload.user);

  return {
    app: "Brrtz",
    type: "user-profile",
    schemaVersion: Number(payload.schemaVersion) || 1,
    storage: isSupabaseCloudEnabled() ? "supabase" : "cloud-emulator",
    user,
    invite: {
      required: REQUIRE_INVITE,
      status: payload.invite?.status || "not_required",
    },
    preferences: normalizePreferences(payload.preferences),
    updatedAt: normalizeIsoField(payload.updatedAt || now),
  };
}

async function readSupabaseSavedSearches(cloudUser = getCloudUser()) {
  const rows = await fetchSupabaseSavedSearchRows(cloudUser.id);
  return createCloudSavedSearchState({
    storage: "supabase",
    user: cloudUser,
    profiles: rows.map(rowToSavedSearchProfile),
  }, cloudUser);
}

async function writeSupabaseSavedSearches(payload = {}, cloudUser = getCloudUser()) {
  const state = createCloudSavedSearchState({
    ...payload,
    storage: "supabase",
    user: cloudUser,
  }, cloudUser);
  const userId = state.user.id;
  const rows = state.profiles.map((profile) => savedSearchProfileToRow(profile, userId));

  await supabaseRequest(`/rest/v1/saved_searches?user_id=eq.${encodeURIComponent(userId)}`, {
    method: "DELETE",
    headers: {
      prefer: "return=minimal",
    },
  });

  if (rows.length === 0) {
    return createCloudSavedSearchState({ storage: "supabase", user: state.user, profiles: [] }, state.user);
  }

  const insertedRows = await supabaseRequest("/rest/v1/saved_searches?on_conflict=id", {
    method: "POST",
    headers: {
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(rows),
  });

  return createCloudSavedSearchState({
    storage: "supabase",
    user: state.user,
    profiles: Array.isArray(insertedRows) ? insertedRows.map(rowToSavedSearchProfile) : state.profiles,
  }, state.user);
}

async function fetchSupabaseSavedSearchRows(userId = CLOUD_PROFILE_USER_ID) {
  const encodedUserId = encodeURIComponent(userId);
  const query = `/rest/v1/saved_searches?user_id=eq.${encodedUserId}&deleted_at=is.null&order=updated_at.desc`;
  const rows = await supabaseRequest(query);
  return Array.isArray(rows) ? rows : [];
}

async function getRequestCloudUser(request) {
  const token = getBearerToken(request);
  if (!token) {
    if (REQUIRE_INVITE && isSupabaseCloudEnabled()) {
      throw new AuthVerificationError("Sign in is required to use Brrtz cloud sync.");
    }
    return getCloudUser();
  }

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (REQUIRE_INVITE && isSupabaseCloudEnabled()) {
      throw new AuthVerificationError("Brrtz cloud auth is not configured for invite-only sync.");
    }
    return getCloudUser();
  }

  try {
    const cloudUser = await fetchSupabaseAuthUser(token);
    await assertUserInvite(cloudUser);
    return cloudUser;
  } catch (error) {
    if (error instanceof AuthVerificationError) throw error;
    console.warn("Supabase auth verification failed.", error);
    throw new AuthVerificationError("Your cloud session could not be verified. Sign out and sign in again.");
  }
}

class AuthVerificationError extends Error {}

function getBearerToken(request) {
  const authorization = request.headers.authorization || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match ? match[1].trim() : "";
}

async function fetchSupabaseAuthUser(accessToken) {
  const baseUrl = SUPABASE_URL.replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}/auth/v1/user`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase auth verification responded with ${response.status}: ${message || response.statusText}`);
  }

  const user = await response.json();
  return normalizeCloudUser({
    id: user.id,
    email: user.email,
    name: user.user_metadata?.name || user.email || CLOUD_PROFILE_NAME,
  });
}

async function assertUserInvite(cloudUser) {
  if (!REQUIRE_INVITE || !isSupabaseCloudEnabled()) return;

  const invitedEmail = normalizeEmail(cloudUser.email);
  const rows = await supabaseRequest("/rest/v1/alpha_invites?status=eq.active&select=email&limit=1000");
  const isInvited = Array.isArray(rows)
    && rows.some((row) => normalizeEmail(row.email) === invitedEmail);

  if (isInvited) return;

  throw new AuthVerificationError("This Brrtz alpha is invite-only. Ask Craig to add your email to the invite list.");
}

async function readSupabaseUserProfile(cloudUser = getCloudUser()) {
  const rows = await supabaseRequest(`/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(cloudUser.id)}&limit=1`);
  if (Array.isArray(rows) && rows[0]) {
    return rowToCloudProfile(rows[0], cloudUser);
  }

  return writeSupabaseUserProfile(createCloudProfileState({
    user: cloudUser,
    invite: {
      required: REQUIRE_INVITE,
      status: REQUIRE_INVITE ? "active" : "not_required",
    },
    preferences: {},
  }));
}

async function writeSupabaseUserProfile(profileState) {
  const state = createCloudProfileState(profileState);
  const rows = await supabaseRequest("/rest/v1/user_profiles?on_conflict=user_id", {
    method: "POST",
    headers: {
      prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify([{
      user_id: state.user.id,
      email: state.user.email,
      name: state.user.name,
      preferences: state.preferences,
      invite_status: state.invite.status,
      updated_at: state.updatedAt,
    }]),
  });

  return Array.isArray(rows) && rows[0] ? rowToCloudProfile(rows[0], state.user) : state;
}

function rowToCloudProfile(row, fallbackUser = getCloudUser()) {
  const user = normalizeCloudUser({
    id: row.user_id || fallbackUser.id,
    email: row.email || fallbackUser.email,
    name: row.name || fallbackUser.name,
  });

  return createCloudProfileState({
    user,
    invite: {
      required: REQUIRE_INVITE,
      status: row.invite_status || (REQUIRE_INVITE ? "active" : "not_required"),
    },
    preferences: row.preferences || {},
    updatedAt: row.updated_at,
  });
}

async function supabaseRequest(path, options = {}) {
  const baseUrl = SUPABASE_URL.replace(/\/+$/, "");
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Supabase cloud sync responded with ${response.status}: ${message || response.statusText}`);
  }

  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

function getCloudUser() {
  return normalizeCloudUser({
    id: CLOUD_PROFILE_USER_ID,
    email: CLOUD_PROFILE_EMAIL,
    name: CLOUD_PROFILE_NAME,
  });
}

function normalizeCloudUser(user = {}) {
  return {
    id: typeof user.id === "string" && user.id.trim() ? user.id.trim() : CLOUD_PROFILE_USER_ID,
    email: normalizeEmail(user.email) || CLOUD_PROFILE_EMAIL,
    name: typeof user.name === "string" && user.name.trim() ? user.name.trim() : CLOUD_PROFILE_NAME,
  };
}

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizePreferences(preferences = {}) {
  const currency = preferences.currency === "USD" ? "USD" : preferences.currency === "JPY" ? "JPY" : undefined;
  const jpyPerUsd = Number(preferences.jpyPerUsd);
  const theme = ["light", "dark"].includes(preferences.theme) ? preferences.theme : undefined;
  const watchedListingIds = Array.isArray(preferences.watchedListingIds)
    ? { watchedListingIds: normalizeArrayField(preferences.watchedListingIds) }
    : {};
  const watchedListingLedger = preferences.watchedListingLedger && typeof preferences.watchedListingLedger === "object" && !Array.isArray(preferences.watchedListingLedger)
    ? { watchedListingLedger: preferences.watchedListingLedger }
    : {};
  const feedbackRules = preferences.feedbackRules && typeof preferences.feedbackRules === "object" && !Array.isArray(preferences.feedbackRules)
    ? { feedbackRules: preferences.feedbackRules }
    : {};

  return {
    ...(typeof preferences.regionId === "string" && preferences.regionId.trim() ? { regionId: preferences.regionId.trim() } : {}),
    ...(currency ? { currency } : {}),
    ...(Number.isFinite(jpyPerUsd) && jpyPerUsd > 0 ? { jpyPerUsd } : {}),
    ...(theme ? { theme } : {}),
    ...(Array.isArray(preferences.defaultSources) ? { defaultSources: normalizeArrayField(preferences.defaultSources) } : {}),
    ...watchedListingIds,
    ...watchedListingLedger,
    ...feedbackRules,
  };
}

function savedSearchProfileToRow(profile, userId = CLOUD_PROFILE_USER_ID) {
  return {
    id: createSupabaseSavedSearchRowId(profile, userId),
    user_id: userId,
    schema_version: Number(profile.schemaVersion) || 1,
    name: String(profile.name || "Untitled Search"),
    terms: normalizeArrayField(profile.terms),
    excludes: normalizeArrayField(profile.excludes),
    noise_terms: normalizeArrayField(profile.noiseTerms),
    sources: normalizeArrayField(profile.sources),
    max_price: Number(profile.maxPrice || 0),
    alert_mode: String(profile.alertMode || "immediate"),
    created_at: normalizeIsoField(profile.createdAt),
    updated_at: normalizeIsoField(profile.updatedAt),
    deleted_at: normalizeNullableIsoField(profile.deletedAt),
    last_scanned_at: normalizeNullableIsoField(profile.lastScannedAt),
    last_match_count: Number(profile.lastMatchCount || 0),
    last_new_count: Number(profile.lastNewCount || 0),
    last_source_count: Number(profile.lastSourceCount || 0),
    last_scan_status: profile.lastScanStatus ? String(profile.lastScanStatus) : null,
  };
}

function rowToSavedSearchProfile(row) {
  const syncedAt = normalizeIsoField(row.updated_at);
  const userId = String(row.user_id || CLOUD_PROFILE_USER_ID);

  return {
    id: stripSupabaseSavedSearchRowId(row.id, userId) || createServerSearchId(row.name),
    schemaVersion: Number(row.schema_version) || 1,
    userId,
    name: String(row.name || "Untitled Search"),
    terms: normalizeArrayField(row.terms),
    excludes: normalizeArrayField(row.excludes),
    noiseTerms: normalizeArrayField(row.noise_terms),
    sources: normalizeArrayField(row.sources),
    maxPrice: Number(row.max_price || 0),
    alertMode: String(row.alert_mode || "immediate"),
    createdAt: normalizeIsoField(row.created_at),
    updatedAt: syncedAt,
    deletedAt: row.deleted_at || null,
    sync: {
      provider: "supabase",
      remoteId: String(row.id || ""),
      status: "synced",
      lastSyncedAt: syncedAt,
      lastLocalChangeAt: syncedAt,
    },
    lastScannedAt: row.last_scanned_at || null,
    lastMatchCount: Number(row.last_match_count || 0),
    lastNewCount: Number(row.last_new_count || 0),
    lastSourceCount: Number(row.last_source_count || 0),
    lastScanStatus: row.last_scan_status || null,
  };
}

function createSupabaseSavedSearchRowId(profile, userId) {
  const profileId = String(profile.id || profile.sync?.remoteId || createServerSearchId(profile.name));
  if (profileId.startsWith(`${userId}:`)) return profileId;
  return `${userId}:${profileId}`;
}

function stripSupabaseSavedSearchRowId(rowId, userId) {
  const value = String(rowId || "");
  const prefix = `${userId}:`;
  return value.startsWith(prefix) ? value.slice(prefix.length) : value;
}

function normalizeArrayField(value) {
  return Array.isArray(value)
    ? value.map((item) => String(item).trim()).filter(Boolean)
    : [];
}

function normalizeIsoField(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function normalizeNullableIsoField(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function createServerSearchId(name = "search") {
  const slug = String(name).toLocaleLowerCase("ja-JP").normalize("NFKC")
    .replace(/[^a-z0-9ぁ-んァ-ン一-龯]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42) || "search";
  return `search_${slug}_${Date.now().toString(36)}`;
}

async function handleSearch(url, response) {
  const terms = createSourceSearchTerms(splitParam(url.searchParams.get("terms")));
  const excludes = splitParam(url.searchParams.get("excludes"));
  const categoryIntent = sanitizeCategoryIntent(url.searchParams.get("categoryIntent"));
  const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
  const sources = splitParam(url.searchParams.get("sources"));
  const requestedRegionId = url.searchParams.get("region");
  const regionId = sanitizeRegionId(requestedRegionId);
  const regionCurrency = getRegionCurrency(regionId);
  const wantsDigimart = sources.length === 0 || sources.includes("digimart");
  const wantsFiveG = sources.length === 0 || sources.includes("five-g");
  const wantsImplant4 = sources.length === 0 || sources.includes("implant4");
  const wantsCraigslistSfbay = sources.length === 0 || sources.includes("craigslist-sfbay");
  const wantsCraigslistLa = sources.length === 0 || sources.includes("craigslist-la");
  const wantsEbayUs = sources.length === 0 || sources.includes("ebay-us");
  const wantsJimoty = sources.length === 0 || sources.includes("jimoty");
  const wantsMercari = sources.length === 0 || sources.includes("mercari");
  const wantsOffmall = sources.length === 0 || sources.includes("offmall") || sources.includes("hardoff");
  const wantsRakuma = sources.length === 0 || sources.includes("rakuma");
  const wantsReverb = sources.length === 0 || sources.includes("reverb");
  const wantsReverbUs = sources.length === 0 || sources.includes("reverb-us");
  const wantsYahooAuctions = sources.length === 0 || sources.includes("yahoo-auctions");
  const wantsYahooFleamarket = sources.length === 0 || sources.includes("yahoo-fleamarket");
  const startedAt = new Date();

  if ((!wantsDigimart && !wantsFiveG && !wantsImplant4 && !wantsCraigslistSfbay && !wantsCraigslistLa && !wantsEbayUs && !wantsJimoty && !wantsMercari && !wantsOffmall && !wantsRakuma && !wantsReverb && !wantsReverbUs && !wantsYahooAuctions && !wantsYahooFleamarket) || terms.length === 0) {
    sendJson(response, 200, { listings: [], meta: createSearchMeta(startedAt, [], [], terms, { categoryIntent }) });
    return;
  }

  const listingsById = new Map();
  const sourceStats = [];
  const errors = [];
  const sourceTasks = [];

  if (wantsDigimart) {
    sourceTasks.push(searchSourceTerms("digimart", terms, searchDigimart));
  }

  if (wantsFiveG) {
    sourceTasks.push(searchSourceTerms("five-g", terms, searchFiveG, {
      maxTerms: 3,
    }));
  }

  if (wantsImplant4) {
    sourceTasks.push(searchSourceTerms("implant4", terms, searchImplant4, {
      maxTerms: 3,
    }));
  }

  if (wantsCraigslistSfbay && isCraigslistLiveEnabled()) {
    sourceTasks.push(searchSourceTerms("craigslist-sfbay", terms, searchCraigslistSfbay, {
      maxTerms: 1,
      termDelayMs: 250,
    }));
  } else if (wantsCraigslistSfbay) {
    sourceTasks.push(Promise.resolve(createParkedCraigslistSourceResult("craigslist-sfbay", terms, CRAIGSLIST_SFBAY_BASE_URL, { maxPrice })));
  }

  if (wantsCraigslistLa && isCraigslistLiveEnabled()) {
    sourceTasks.push(searchSourceTerms("craigslist-la", terms, searchCraigslistLa, {
      maxTerms: 1,
      termDelayMs: 250,
    }));
  } else if (wantsCraigslistLa) {
    sourceTasks.push(Promise.resolve(createParkedCraigslistSourceResult("craigslist-la", terms, CRAIGSLIST_LA_BASE_URL, { maxPrice })));
  }

  if (wantsEbayUs && hasEbayCredentials()) {
    sourceTasks.push(searchSourceTerms("ebay-us", terms, searchEbayUs, {
      maxTerms: EBAY_TERM_LIMIT,
      termDelayMs: 0,
    }));
  } else if (wantsEbayUs) {
    sourceTasks.push(Promise.resolve(createPendingSourceResult("ebay-us", terms, EBAY_PENDING_MESSAGE)));
  }

  if (wantsJimoty) {
    sourceTasks.push(searchSourceTerms("jimoty", terms, searchJimoty, {
      maxTerms: 3,
    }));
  }

  if (wantsOffmall) {
    sourceTasks.push(searchSourceTerms("offmall", terms, searchOffmall));
  }

  if (wantsRakuma) {
    sourceTasks.push(searchSourceTerms("rakuma", terms, searchRakuma));
  }

  if (wantsReverb) {
    sourceTasks.push(searchSourceTerms("reverb", terms, searchReverb, {
      maxTerms: REVERB_TERM_LIMIT,
    }));
  }

  if (wantsReverbUs) {
    sourceTasks.push(searchSourceTerms("reverb-us", terms, searchReverbUs, {
      maxTerms: REVERB_TERM_LIMIT,
    }));
  }

  if (wantsYahooAuctions) {
    sourceTasks.push(searchSourceTerms("yahoo-auctions", terms, searchYahooAuctions, {
      context: { categoryIntent },
    }));
  }

  if (wantsYahooFleamarket) {
    sourceTasks.push(searchSourceTerms("yahoo-fleamarket", terms, searchYahooFleamarket));
  }

  if (wantsMercari) {
    sourceTasks.push(searchSourceTerms("mercari", terms, searchMercari, {
      maxTerms: MERCARI_TERM_LIMIT,
      termDelayMs: 0,
    }));
  }

  const sourceResults = await Promise.all(sourceTasks);
  for (const sourceResult of sourceResults) {
    sourceStats.push(sourceResult.stats);
    errors.push(...sourceResult.errors);
    collectFilteredListings(sourceResult.listings, listingsById, excludes, maxPrice);
  }

  const listings = [...listingsById.values()].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
  await hydrateRakumaThumbnails(listings.filter((listing) => listing.source === "rakuma"));
  const normalizedListings = attachNormalizedListings(listings, {
    regionId,
    currency: regionCurrency,
  });

  sendJson(response, 200, {
    listings: normalizedListings,
    meta: createSearchMeta(startedAt, sourceStats, errors, terms, { categoryIntent }),
  });
}

async function handleBrowse(url, response) {
  const startedAt = new Date();
  const categoryIntent = sanitizeCategoryIntent(url.searchParams.get("categoryIntent"));
  const excludes = splitParam(url.searchParams.get("excludes"));
  const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
  const regionId = sanitizeRegionId(url.searchParams.get("region"));
  const regionCurrency = getRegionCurrency(regionId);
  const sourceStats = [];
  const errors = [];
  const listingsById = new Map();

  if (regionId === "japan") {
    const browseIntents = getYahooAuctionsBrowseCategoryIntents(categoryIntent);
    const categoryIntents = browseIntents.length > 0 ? browseIntents : [categoryIntent];
    const browseResults = await Promise.all(categoryIntents.map(async (browseIntent) => {
      const categoryId = getYahooAuctionsBrowseCategoryId(browseIntent);
      const browseTerms = getYahooAuctionsBrowseTerms(browseIntent);

      try {
        const listings = categoryId
          ? await browseYahooAuctionsCategory(browseIntent)
          : await browseYahooAuctionsCategoryTerms(browseIntent);
        return {
          listings,
          stat: {
            source: "yahoo-auctions",
            status: "ok",
            searchedTerms: browseTerms,
            categoryIntent: browseIntent,
            categoryId,
            rawCount: listings.length,
          },
        };
      } catch (error) {
        return {
          error: {
            source: "yahoo-auctions",
            term: "",
            message: error instanceof Error ? error.message : "Unknown browse connector error",
          },
          stat: {
            source: "yahoo-auctions",
            status: "error",
            searchedTerms: browseTerms,
            categoryIntent: browseIntent,
            categoryId,
            rawCount: 0,
          },
        };
      }
    }));

    for (const result of browseResults) {
      sourceStats.push(result.stat);
      if (result.error) {
        errors.push(result.error);
      } else {
        collectFilteredListings(result.listings, listingsById, excludes, maxPrice);
      }
    }
  } else {
    errors.push({
      source: "browse",
      term: "",
      message: `Category browse is not wired for ${regionId} yet.`,
    });
  }

  const listings = [...listingsById.values()].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
  const normalizedListings = attachNormalizedListings(listings, {
    regionId,
    currency: regionCurrency,
  });
  const meta = createSearchMeta(startedAt, sourceStats, errors, [], { categoryIntent });

  sendJson(response, 200, {
    listings: normalizedListings,
    meta: {
      ...meta,
      mode: "browse",
      region: regionId,
    },
  });
}

function getSourceConfig(sourceId) {
  return getRegionConfigs()
    .flatMap((region) => region.sources || [])
    .find((source) => source.id === sourceId);
}

function collectFilteredListings(listings, listingsById, excludes, maxPrice) {
  for (const listing of listings) {
    const title = normalizeText(listing.title);
    const excluded = excludes.some((exclude) => termMatches(title, exclude));
    const tooExpensive = maxPrice > 0 && listing.price > maxPrice;
    const unavailable = isUnavailableListing(listing);

    if (!excluded && !tooExpensive && !unavailable) {
      listingsById.set(listing.id, listing);
    }
  }
}

async function handleRakumaImageProxy(url, response) {
  const imageUrl = url.searchParams.get("url") || "";

  if (!isAllowedRakumaImageUrl(imageUrl)) {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    response.end("Unsupported image URL");
    return;
  }

  const cached = rakumaImageProxyCache.get(imageUrl);
  if (cached && Date.now() - cached.createdAt < RAKUMA_IMAGE_PROXY_CACHE_TTL_MS) {
    sendImage(response, cached);
    return;
  }

  const upstream = await fetch(imageUrl, {
    headers: {
      "user-agent": USER_AGENT,
      "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      "referer": RAKUMA_BASE_URL,
    },
  });

  if (!upstream.ok) {
    response.writeHead(upstream.status, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Image request failed with ${upstream.status}`);
    return;
  }

  const image = {
    body: Buffer.from(await upstream.arrayBuffer()),
    contentType: upstream.headers.get("content-type") || "image/jpeg",
    createdAt: Date.now(),
  };
  rakumaImageProxyCache.set(imageUrl, image);
  sendImage(response, image);
}

async function handleRakumaThumbnail(url, response) {
  const itemUrl = url.searchParams.get("url") || "";

  if (!isAllowedRakumaItemUrl(itemUrl)) {
    sendJson(response, 400, { error: "unsupported_item_url" });
    return;
  }

  sendJson(response, 200, { image: await fetchRakumaThumbnail(itemUrl) });
}

function sendImage(response, image) {
  response.writeHead(200, {
    "content-type": image.contentType,
    "cache-control": "private, max-age=900",
  });
  response.end(image.body);
}

function isAllowedRakumaImageUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === "img.fril.jp";
  } catch {
    return false;
  }
}

function isAllowedRakumaItemUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === "item.fril.jp";
  } catch {
    return false;
  }
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
    "受付終了",
    "closed",
    "wanted",
  ].some((token) => status.includes(normalizeText(token)));
}

function normalizeMode(value, allowedModes, fallback) {
  const normalized = String(value || "").trim().toLowerCase();
  return allowedModes.includes(normalized) ? normalized : fallback;
}

function sanitizeRegionId(regionId) {
  return ["bay-area", "los-angeles"].includes(regionId) ? regionId : "japan";
}

function getRegionCurrency(regionId) {
  return regionId === "japan" ? "JPY" : "USD";
}

function sanitizeCategoryIntent(value) {
  const normalized = String(value || "").trim();
  return CATEGORY_INTENT_CONFIG[normalized] ? normalized : DEFAULT_CATEGORY_INTENT;
}

function getCategoryIntentLabel(categoryIntent) {
  return CATEGORY_INTENT_CONFIG[categoryIntent]?.label || CATEGORY_INTENT_CONFIG[DEFAULT_CATEGORY_INTENT].label;
}

function getYahooAuctionsBrowseCategoryId(categoryIntent) {
  return CATEGORY_INTENT_CONFIG[sanitizeCategoryIntent(categoryIntent)]?.yahooAuctionsBrowseCategoryId || "";
}

function getYahooAuctionsBrowseCategoryIntents(categoryIntent) {
  return CATEGORY_INTENT_CONFIG[sanitizeCategoryIntent(categoryIntent)]?.yahooAuctionsBrowseCategoryIntents || [];
}

function getYahooAuctionsBrowseTerms(categoryIntent) {
  return CATEGORY_INTENT_CONFIG[sanitizeCategoryIntent(categoryIntent)]?.yahooAuctionsBrowseTerms || [];
}

function isCraigslistLiveEnabled() {
  return CRAIGSLIST_MODE === "live";
}

function createParkedCraigslistSourceResult(source, terms, baseUrl, options = {}) {
  const manualUrl = createCraigslistManualSearchUrl(baseUrl, terms[0] || "", options);
  return {
    listings: [],
    errors: [],
    stats: {
      source,
      status: "manual",
      searchedTerms: terms.slice(0, 1),
      rawCount: 0,
      message: CRAIGSLIST_PARKED_MESSAGE,
      manualUrl,
    },
  };
}

function createPendingSourceResult(source, terms, message) {
  return {
    listings: [],
    errors: [],
    stats: {
      source,
      status: "pending",
      searchedTerms: terms.slice(0, 1),
      rawCount: 0,
      message,
    },
  };
}

function createCraigslistManualSearchUrl(baseUrl, term, options = {}) {
  const url = new URL("/search/msa", baseUrl);
  if (term) url.searchParams.set("query", term);
  url.searchParams.set("sort", "date");
  if (Number(options.maxPrice) > 0) {
    url.searchParams.set("max_price", String(Math.round(Number(options.maxPrice))));
  }
  return url.toString();
}

async function searchSourceTerms(source, terms, searchFn, options = {}) {
  const listingsById = new Map();
  const errors = [];
  const searchedTerms = terms.slice(0, options.maxTerms ?? 5);
  const termDelayMs = options.termDelayMs ?? 700;

  for (const [index, term] of searchedTerms.entries()) {
    try {
      const listings = await searchFn(term, options.context || {});
      listings.forEach((listing) => {
        const existing = listingsById.get(listing.id);
        const image = existing && isPlaceholderImage(listing.image) && !isPlaceholderImage(existing.image)
          ? existing.image
          : listing.image;

        listingsById.set(listing.id, { ...listing, image });
      });
    } catch (error) {
      errors.push({
        source,
        term,
        message: error instanceof Error ? error.message : "Unknown connector error",
      });
    }

    if (termDelayMs > 0 && index < searchedTerms.length - 1) {
      await wait(termDelayMs);
    }
  }

  return {
    listings: [...listingsById.values()],
    errors,
    stats: {
      source,
      status: errors.length === searchedTerms.length ? "error" : errors.length > 0 ? "partial" : "ok",
      searchedTerms,
      rawCount: listingsById.size,
    },
  };
}

function createSearchMeta(startedAt, sourceStats, errors, terms, options = {}) {
  const categoryIntent = sanitizeCategoryIntent(options.categoryIntent);
  return {
    searchedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    liveSources: sourceStats.map((item) => item.source),
    sourceStats,
    errors,
    searchedTerms: terms.slice(0, 5),
    categoryIntent,
    categoryLabel: getCategoryIntentLabel(categoryIntent),
  };
}

async function searchDigimart(term) {
  const url = new URL("/search", DIGIMART_BASE_URL);
  url.searchParams.set("keywordAnd", term);
  url.searchParams.set("sortKey", "INITIAL_PUBLIC_DATE_DESC");
  url.searchParams.set("nosoldoutp", "true");
  url.searchParams.set("readCount", "20");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Digimart responded with ${response.status}`);
  }

  return parseDigimart(await response.text());
}

async function searchFiveG(term) {
  const url = new URL("/", FIVE_G_BASE_URL);
  url.searchParams.set("mode", "srh");
  url.searchParams.set("field", "product_name");
  url.searchParams.set("keyword", term);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Five G responded with ${response.status}`);
  }

  return parseFiveG(await decodeResponseBody(response));
}

async function searchImplant4(term) {
  const url = new URL("/search", IMPLANT4_BASE_URL);
  url.searchParams.set("type", "product");
  url.searchParams.set("options[prefix]", "last");
  url.searchParams.set("options[unavailable_products]", "last");
  url.searchParams.set("q", term);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`implant4 responded with ${response.status}`);
  }

  return parseImplant4(await response.text());
}

async function searchJimoty(term) {
  const url = new URL("/all/sale-inc", JIMOTY_BASE_URL);
  url.searchParams.set("keyword", term);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Jimoty responded with ${response.status}`);
  }

  return parseJimoty(await decodeResponseBody(response));
}

async function searchMercari(term) {
  const cacheKey = normalizeText(term);
  const cached = mercariCache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < MERCARI_CACHE_TTL_MS) {
    return cloneListings(cached.listings);
  }

  const browser = await getMercariBrowser();
  let page;

  try {
    page = await browser.newPage({
      userAgent: USER_AGENT,
      locale: "ja-JP",
    });
    page.setDefaultTimeout(MERCARI_CONNECTOR_TIMEOUT_MS);

    const url = new URL("/en/search", MERCARI_BASE_URL);
    url.searchParams.set("keyword", term);
    url.searchParams.set("sort", "created_time");
    url.searchParams.set("order", "desc");
    url.searchParams.set("status", "on_sale");

    await page.goto(url.toString(), {
      waitUntil: "domcontentloaded",
      timeout: MERCARI_CONNECTOR_TIMEOUT_MS,
    });

    try {
      await page.waitForSelector("a[data-testid='thumbnail-link'][href*='/item/']", {
        timeout: MERCARI_CONNECTOR_TIMEOUT_MS,
      });
    } catch {
      return [];
    }

    const cards = await page.$$eval(
      "a[data-testid='thumbnail-link'][href*='/item/']",
      (links, limit) => links.slice(0, limit).map((link) => {
        const imageNode = link.querySelector("img");
        const itemNode = link.querySelector("[id^='m']");
        const labelNode = link.querySelector("[aria-label^='Image of ']");

        return {
          href: link.getAttribute("href") || "",
          itemId: itemNode?.id || "",
          image: imageNode?.getAttribute("src") || "",
          label: labelNode?.getAttribute("aria-label") || "",
          text: link.textContent || "",
        };
      }),
      MERCARI_RESULT_LIMIT,
    );

    const listings = parseMercari(cards);
    mercariCache.set(cacheKey, {
      createdAt: Date.now(),
      listings: cloneListings(listings),
    });
    pruneMercariCache();
    return listings;
  } finally {
    if (page) await page.close();
  }
}

async function getMercariBrowser() {
  if (!mercariBrowserPromise) {
    mercariBrowserPromise = import("playwright")
      .then(({ chromium }) => chromium.launch({ headless: true }))
      .catch((error) => {
        mercariBrowserPromise = undefined;
        throw error;
      });
  }

  return mercariBrowserPromise;
}

async function closeMercariBrowser() {
  if (!mercariBrowserPromise) return;

  try {
    const browser = await mercariBrowserPromise;
    await browser.close();
  } finally {
    mercariBrowserPromise = undefined;
  }
}

async function searchOffmall(term) {
  const url = new URL("/search/", OFFMALL_BASE_URL);
  url.searchParams.set("q", term);
  url.searchParams.set("s", "1");
  url.searchParams.set("pl", "30");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  const html = await response.text();

  if (!response.ok && response.status !== 404) {
    throw new Error(`OFFMALL responded with ${response.status}`);
  }

  return parseOffmall(html);
}

async function searchRakuma(term) {
  const url = new URL(`/search/${encodeURIComponent(term)}`, RAKUMA_BASE_URL);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Rakuma responded with ${response.status}`);
  }

  return parseRakuma(await response.text());
}

async function searchReverb(term) {
  return searchReverbListings(term, {
    sourceId: "reverb",
    countryFilter: "country:jp",
    displayCurrency: "JPY",
    acceptLanguage: "ja,en-US;q=0.9,en;q=0.8",
  });
}

async function searchReverbUs(term) {
  return searchReverbListings(term, {
    sourceId: "reverb-us",
    countryFilter: "country:us",
    displayCurrency: "USD",
    acceptLanguage: "en-US,en;q=0.9",
  });
}

async function searchEbayUs(term) {
  if (!hasEbayCredentials()) {
    throw new Error("eBay API credentials are not configured. Add EBAY_CLIENT_ID and EBAY_CLIENT_SECRET.");
  }

  const token = await getEbayAccessToken();
  const url = new URL("/buy/browse/v1/item_summary/search", EBAY_API_BASE_URL);
  url.searchParams.set("q", term);
  url.searchParams.set("limit", String(EBAY_RESULT_LIMIT));
  url.searchParams.set("sort", "newlyListed");
  if (EBAY_CATEGORY_IDS.length) {
    url.searchParams.set("category_ids", EBAY_CATEGORY_IDS.join(","));
  }
  url.searchParams.set("filter", [
    "buyingOptions:{FIXED_PRICE|AUCTION}",
    "itemLocationCountry:US",
  ].join(","));

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "authorization": `Bearer ${token}`,
      "accept": "application/json",
      "accept-language": "en-US,en;q=0.9",
      "x-ebay-c-marketplace-id": EBAY_MARKETPLACE_ID,
    },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`eBay responded with ${response.status}${message ? `: ${message.slice(0, 180)}` : ""}`);
  }

  return parseEbayBrowse(await response.json());
}

async function getEbayAccessToken() {
  const now = Date.now();
  if (ebayTokenCache?.token && ebayTokenCache.expiresAt > now + 60_000) {
    return ebayTokenCache.token;
  }

  const credentials = Buffer.from(`${EBAY_CLIENT_ID}:${EBAY_CLIENT_SECRET}`).toString("base64");
  const response = await fetch(`${EBAY_API_BASE_URL}/identity/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "user-agent": USER_AGENT,
      "authorization": `Basic ${credentials}`,
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      scope: "https://api.ebay.com/oauth/api_scope",
    }),
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`eBay auth responded with ${response.status}${message ? `: ${message.slice(0, 180)}` : ""}`);
  }

  const payload = await response.json();
  const token = String(payload.access_token || "");
  if (!token) throw new Error("eBay auth did not return an access token.");

  ebayTokenCache = {
    token,
    expiresAt: now + Math.max(60, Number(payload.expires_in || 0) - 120) * 1000,
  };

  return token;
}

async function searchReverbListings(term, options = {}) {
  const url = new URL("/api/listings", REVERB_API_BASE_URL);
  url.searchParams.set("query", [options.countryFilter, term].filter(Boolean).join(" "));
  url.searchParams.set("per_page", String(REVERB_RESULT_LIMIT));
  url.searchParams.set("display_currency", options.displayCurrency || "JPY");
  url.searchParams.set("sort", "published_at|desc");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept": "application/hal+json",
      "accept-version": "3.0",
      "accept-language": options.acceptLanguage || "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Reverb responded with ${response.status}`);
  }

  return parseReverb(await response.json(), { sourceId: options.sourceId || "reverb" });
}

async function searchCraigslistSfbay(term) {
  return searchCraigslistRegion(term, {
    sourceId: "craigslist-sfbay",
    baseUrl: CRAIGSLIST_SFBAY_BASE_URL,
    label: "Craigslist SF Bay",
  });
}

async function searchCraigslistLa(term) {
  return searchCraigslistRegion(term, {
    sourceId: "craigslist-la",
    baseUrl: CRAIGSLIST_LA_BASE_URL,
    label: "Craigslist LA",
  });
}

async function searchCraigslistRegion(term, options) {
  const url = new URL("/search/msa", options.baseUrl);
  url.searchParams.set("query", term);
  url.searchParams.set("sort", "date");

  const response = await fetchCraigslistUrl(url, options, { allowError: true });
  const usedReaderFallback = !response.ok;
  const listings = usedReaderFallback
    ? parseCraigslistMarkdown(await fetchCraigslistMarkdown(url, options), options)
    : parseCraigslistRegion(await response.text(), options);
  return verifyCraigslistSearchMatches(listings, term, {
    ...options,
    skipDetailVerification: usedReaderFallback,
  });
}

async function verifyCraigslistSearchMatches(listings, term, options) {
  const verifiedListingsByIndex = new Map();
  const detailCandidates = [];

  for (const [index, listing] of listings.entries()) {
    if (craigslistListingMatchesTerm(listing, term)) {
      verifiedListingsByIndex.set(index, { ...listing, searchContextVerified: true });
      continue;
    }

    if (options.skipDetailVerification) continue;
    if (!listing.url) continue;
    detailCandidates.push({ index, listing });
  }

  const limitedCandidates = detailCandidates.slice(0, options.detailVerifyLimit ?? CRAIGSLIST_DETAIL_VERIFY_LIMIT);
  const detailMatches = await mapWithConcurrency(
    limitedCandidates,
    options.detailVerifyConcurrency ?? CRAIGSLIST_DETAIL_VERIFY_CONCURRENCY,
    async ({ index, listing }) => {
      try {
        const detail = await fetchCraigslistListingSearchText(listing.url, options);
        if (craigslistListingMatchesTerm(listing, term, detail)) {
          return { index, listing: { ...listing, searchContextVerified: true } };
        }
      } catch {
        // If a detail page cannot be checked, keep Craigslist search strict instead of broad.
      }

      return null;
    },
  );

  for (const result of detailMatches) {
    if (result) verifiedListingsByIndex.set(result.index, result.listing);
  }

  return [...verifiedListingsByIndex.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, listing]) => listing);
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workerCount = Math.max(1, Math.min(Number(concurrency) || 1, items.length));

  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (nextIndex < items.length) {
      const currentIndex = nextIndex;
      nextIndex += 1;

      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }));

  return results;
}

async function fetchCraigslistListingSearchText(url, options) {
  const response = await fetchCraigslistUrl(url, options, { allowError: true });

  if (!response.ok) {
    try {
      const markdown = await fetchCraigslistMarkdown(url, options);
      return {
        bodyText: cleanText(markdown),
        bodyLines: markdown.split(/\n+/).map((line) => cleanMarkdownText(line)).filter(Boolean),
        metaText: "",
      };
    } catch {
      return "";
    }
  }

  const html = await response.text();
  const bodyHtml = matchOne(html, /<section[^>]+id="postingbody"[^>]*>([\s\S]*?)<\/section>/i);
  const bodyLines = craigslistBodyLines(bodyHtml);
  const metaText = [
    matchOne(html, /<meta[^>]+name="description"[^>]+content="([^"]+)"/i),
    matchOne(html, /<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i),
  ].map(cleanText).filter(Boolean).join(" ");

  return {
    bodyText: cleanText(bodyHtml),
    bodyLines,
    metaText,
  };
}

async function fetchCraigslistUrl(url, options, fetchOptions = {}) {
  const requestUrl = url instanceof URL ? url : new URL(url);
  const headers = {
    "user-agent": CRAIGSLIST_USER_AGENT,
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    "referer": options.baseUrl || CRAIGSLIST_SFBAY_BASE_URL,
  };

  let response = await fetch(requestUrl, { headers });
  if ([403, 429, 503].includes(response.status)) {
    await wait(650);
    response = await fetch(requestUrl, { headers });
  }

  if (!fetchOptions.allowError && !response.ok) {
    throw new Error(`${options.label} responded with ${response.status}`);
  }

  return response;
}

async function fetchCraigslistMarkdown(url, options) {
  const requestUrl = url instanceof URL ? url : new URL(url);
  const readerUrl = `${JINA_READER_BASE_URL}${requestUrl.toString()}`;
  const response = await fetch(readerUrl, {
    headers: {
      "user-agent": USER_AGENT,
      "accept": "text/plain, text/markdown, */*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
    },
  });

  if (!response.ok) {
    throw new Error(`${options.label} reader responded with ${response.status}`);
  }

  return response.text();
}

function craigslistListingMatchesTerm(listing, term, detail = null) {
  const termVariants = createSourceSearchTermVariants(term);
  const titleSearchable = normalizeText([
    listing.title,
    listing.shop,
  ].filter(Boolean).join(" "));

  if (termVariants.some((variant) => termMatches(titleSearchable, variant))) {
    return true;
  }

  if (!detail) return false;

  return termVariants.some((variant) => craigslistDetailHasProductMatch(detail, variant));
}

function craigslistBodyLines(bodyHtml) {
  return String(bodyHtml || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|section|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line && !/^qr code link to this post$/i.test(line));
}

function craigslistDetailHasProductMatch(detail, term) {
  const lines = Array.isArray(detail.bodyLines) ? detail.bodyLines : [];
  return lines.some((line) => craigslistBodyLineHasProductMatch(line, term));
}

function craigslistBodyLineHasProductMatch(line, term) {
  const searchableLine = normalizeText(line);
  if (!termMatches(searchableLine, term)) return false;

  const spamContext = [
    "used these with",
    "used with",
    "suitable for",
    "keyword",
    "keywords",
    "tags:",
  ].some((token) => searchableLine.includes(token));
  if (spamContext) return false;

  if (isUnavailableLine(searchableLine)) return false;

  const commaCount = (line.match(/,/g) || []).length;
  if (commaCount >= 4) return false;
  if (commaCount > 0 && (searchableLine.includes(" like ") || searchableLine.includes("-like"))) return false;

  const looksLikeLineItem = /^[*\-•・]/.test(line)
    || /(?:^|\s)(?:\$|¥|￥)\s?[\d,]+/.test(line)
    || line.length <= 140;

  return looksLikeLineItem;
}

function isUnavailableLine(searchableLine) {
  return [
    "sold",
    "$old",
    "soldout",
    "sold out",
    "売り切れ",
    "売切れ",
    "売約済",
    "売却済",
    "販売済",
    "成約済",
  ].some((token) => searchableLine.includes(normalizeText(token)));
}

async function searchYahooAuctions(term, options = {}) {
  const listingsById = new Map();
  const categorySweeps = getYahooAuctionsCategorySweeps(term, options.categoryIntent);

  for (const categoryId of categorySweeps) {
    const html = await fetchYahooAuctionsSearch(term, categoryId);
    parseYahooAuctions(html).forEach((listing) => listingsById.set(listing.id, listing));

    if (categoryId !== categorySweeps.at(-1)) {
      await wait(400);
    }
  }

  return [...listingsById.values()];
}

async function browseYahooAuctionsCategory(categoryIntent = DEFAULT_CATEGORY_INTENT) {
  const categoryId = getYahooAuctionsBrowseCategoryId(categoryIntent);
  if (!categoryId) return [];

  const html = await fetchYahooAuctionsSearch("", categoryId);
  return parseYahooAuctions(html).map((listing) => ({
    ...listing,
    categoryIntent: sanitizeCategoryIntent(categoryIntent),
  }));
}

async function browseYahooAuctionsCategoryTerms(categoryIntent = DEFAULT_CATEGORY_INTENT) {
  const listingsById = new Map();
  const browseTerms = getYahooAuctionsBrowseTerms(categoryIntent);

  for (const [index, term] of browseTerms.entries()) {
    const listings = await searchYahooAuctions(term, { categoryIntent });
    listings.forEach((listing) => listingsById.set(listing.id, {
      ...listing,
      categoryIntent: sanitizeCategoryIntent(categoryIntent),
    }));

    if (index < browseTerms.length - 1) {
      await wait(400);
    }
  }

  return [...listingsById.values()];
}

async function searchYahooFleamarket(term) {
  const url = new URL(`/search/${encodeURIComponent(term)}`, YAHOO_FLEAMARKET_BASE_URL);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Yahoo Fleamarket responded with ${response.status}`);
  }

  return parseYahooFleamarket(await response.text());
}

function getYahooAuctionsCategorySweeps(term, categoryIntent = DEFAULT_CATEGORY_INTENT) {
  const normalized = normalizeText(term);
  const intentConfig = CATEGORY_INTENT_CONFIG[sanitizeCategoryIntent(categoryIntent)];
  const defaultCategorySweeps = intentConfig?.yahooAuctionsCategorySweeps || YAHOO_AUCTIONS_DEFAULT_CATEGORY_SWEEPS;
  const shouldSearchRhythmCategory = YAHOO_AUCTIONS_RHYTHM_TERMS.some((item) => normalized.includes(normalizeText(item)));
  const categorySweeps = shouldSearchRhythmCategory
    ? [...defaultCategorySweeps, YAHOO_AUCTIONS_RHYTHM_CATEGORY]
    : defaultCategorySweeps;

  return [...new Set(categorySweeps)];
}

async function fetchYahooAuctionsSearch(term, categoryId = "") {
  const url = new URL("/search/search", YAHOO_AUCTIONS_BASE_URL);
  if (term) {
    url.searchParams.set("p", term);
    url.searchParams.set("va", term);
  }
  url.searchParams.set("exflg", "1");
  if (categoryId) url.searchParams.set("auccat", categoryId);
  url.searchParams.set("b", "1");
  url.searchParams.set("n", String(YAHOO_AUCTIONS_PAGE_SIZE));
  url.searchParams.set("s1", "new");
  url.searchParams.set("o1", "d");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (response.status === 404) {
    return "";
  }

  if (!response.ok) {
    throw new Error(`Yahoo Auctions responded with ${response.status}`);
  }

  return response.text();
}

function parseDigimart(html) {
  const blocks = html.match(/<div class="itemSearchBlock itemSearchListItem[\s\S]*?<!-- \/.itemSearchBlock --><\/div>/g) || [];

  return blocks.map((block) => {
    const rawId = matchOne(block, /data-instrument-cd="([^"]+)"/);
    const href = matchOne(block, /<p class="ttl"><a href="([^"]+)">/);
    const title = cleanText(matchOne(block, /<p class="ttl"><a href="[^"]+">([\s\S]*?)<\/a><\/p>/));
    const image = normalizeUrl(matchOne(block, /<div class="pic">[\s\S]*?<img src="([^"]+)"/));
    const price = Number(cleanText(matchOne(block, /<p class="price">([\s\S]*?)<\/p>/)).replace(/[^\d]/g, ""));
    const registeredDate = matchOne(block, /登録：(\d{4}\/\d{2}\/\d{2})/);
    const condition = cleanText(matchOne(block, /状態：<span class="tooltip">([\s\S]*?)<\/span>/)) || "Listed";
    const shop = cleanText(matchOne(block, /<p class="itemShopInfo"><a href="[^"]+">([\s\S]*?)<\/a><\/p>/));

    return {
      id: `digimart-${rawId}`,
      source: "digimart",
      title,
      price,
      condition,
      shop,
      listedAt: registeredDate ? `${registeredDate.replaceAll("/", "-")}T00:00:00+09:00` : new Date().toISOString(),
      url: normalizeUrl(href),
      image,
    };
  }).filter((listing) => listing.id !== "digimart-" && listing.title && listing.url);
}

function parseFiveG(html) {
  const searchResultList = matchOne(html, /<ul class="product-list productlist-list row">([\s\S]*?)<\/ul>/) || "";
  const blocks = searchResultList.match(/<li class="product-list__unit productlist-list__unit[\s\S]*?<\/li>/g) || [];
  const listedAt = new Date().toISOString();

  return blocks.map((block) => {
    const href = readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]+class="product-list__link"/i)
      || readAttributeFromPattern(block, /<a[^>]+class="product-list__link"[^>]+href="([^"]+)"/i);
    const url = normalizeRelativeUrl(href, FIVE_G_BASE_URL);
    const rawId = url.match(/[?&]pid=(\d+)/)?.[1] || href;
    const title = cleanText(matchOne(block, /<a[^>]+class="product-list__name[^"]*"[^>]*>([\s\S]*?)<\/a>/i));
    const description = cleanText(matchOne(block, /<p class="product-list__expl[^"]*"[^>]*>([\s\S]*?)<\/p>/i));
    const image = normalizeRelativeUrl(readAttributeFromPattern(block, /<img[^>]+src="([^"]+)"/i), FIVE_G_BASE_URL);
    const price = parseYenPrice(matchOne(block, /<span class="product-list__price[^"]*"[^>]*>([\s\S]*?)<\/span>/i));
    const condition = title.includes("中古") || description.includes("中古") ? "Used" : "Listed";

    return {
      id: `five-g-${rawId}`,
      source: "five-g",
      title,
      price,
      condition,
      shop: "Five G",
      listedAt,
      url,
      image,
    };
  }).filter((listing) => listing.id !== "five-g-" && listing.title && listing.url && listing.price > 0);
}

function parseImplant4(html) {
  const collectionStart = html.indexOf('<div class="product-list product-list--collection">');
  const collectionHtml = collectionStart >= 0 ? html.slice(collectionStart) : html;
  const blocks = splitHtmlBlocks(collectionHtml, /<div class="product-item product-item--vertical\b/g);
  const listedAt = new Date().toISOString();

  return blocks.map((block) => {
    const href = readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]+class="product-item__title/i)
      || readAttributeFromPattern(block, /<a[^>]+class="product-item__title[^"]*"[^>]+href="([^"]+)"/i)
      || readAttributeFromPattern(block, /data-product-url="([^"]+)"/i);
    const url = normalizeRelativeUrl(href, IMPLANT4_BASE_URL);
    const rawId = url.match(/\/products\/([^/?#]+)/)?.[1] || readAttributeFromPattern(block, /data-product-url="\/products\/([^"?]+)[^"]*"/i) || href;
    const title = cleanText(matchOne(block, /<a[^>]+class="product-item__title[^"]*"[^>]*>([\s\S]*?)<\/a>/i));
    const vendor = cleanText(matchOne(block, /<a[^>]+class="product-item__vendor[^"]*"[^>]*>([\s\S]*?)<\/a>/i));
    const image = normalizeRelativeUrl(
      normalizeShopifyImage(
        readAttributeFromPattern(block, /<img[^>]+class="product-item__primary-image[^"]*"[^>]+data-src="([^"]+)"/i)
          || readAttributeFromPattern(block, /<img[^>]+data-src="([^"]+)"[^>]+class="product-item__primary-image/i)
          || readAttributeFromPattern(block, /<img[^>]+src="([^"]+)"/i),
      ),
      IMPLANT4_BASE_URL,
    );
    const priceList = matchOne(block, /<div class="product-item__price-list price-list">([\s\S]*?)<\/div>/i);
    const price = parseYenPrice(priceList);
    const inventory = cleanText(matchOne(block, /<span class="product-item__inventory[^"]*"[^>]*>([\s\S]*?)<\/span>/i)) || "Listed";

    return {
      id: `implant4-${rawId}`,
      source: "implant4",
      title,
      price,
      condition: inventory,
      shop: vendor ? `implant4 · ${vendor}` : "implant4",
      listedAt,
      url,
      image,
    };
  }).filter((listing) => listing.id !== "implant4-" && listing.title && listing.url && listing.price > 0);
}

function parseJimoty(html) {
  const blocks = splitHtmlBlocks(html, /<li class='p-articles-list-item'>/g);

  return blocks.map((block) => {
    const href = readAttributeFromPattern(block, /<a[^>]+class="p-item-image-link"[^>]+href="([^"]+)"/i)
      || readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<\/a>/i);
    const url = normalizeRelativeUrl(href, JIMOTY_BASE_URL);
    const rawId = url.match(/\/article-([^/?#]+)/)?.[1] || href;
    const title = cleanText(matchOne(block, /<div class='p-item-title'>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i))
      || cleanText(readAttributeFromPattern(block, /<img[^>]+alt="([^"]+)"/i));
    const price = parseYenPrice(matchOne(block, /<div class='p-item-most-important'>[\s\S]*?<b>([\s\S]*?)<\/b>/i));
    const image = normalizeRelativeUrl(readAttributeFromPattern(block, /<img[^>]+class="p-item-image"[^>]+src="([^"]+)"/i), JIMOTY_BASE_URL);
    const closeLabel = cleanText(matchOne(block, /<div class='p-item-close-text'>[\s\S]*?([\s\S]*?)<\/div>/i));
    const area = cleanText(matchOne(block, /<div class='p-item-secondary-important'>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i));
    const category = cleanText(matchOne(block, /<a href="\/all\/sale-inc\/g-[^"]+">([\s\S]*?)<\/a>/i));
    const createdAt = cleanText(matchOne(block, /<div class='u-color-gray'>[\s\S]*?作成(\d{1,2}月\d{1,2}日)[\s\S]*?<\/div>/i));

    return {
      id: `jimoty-${rawId}`,
      source: "jimoty",
      title,
      price,
      condition: closeLabel || "Listed",
      shop: ["Jimoty", area, category].filter(Boolean).join(" · "),
      listedAt: parseJapaneseMonthDay(createdAt) || new Date().toISOString(),
      url,
      image,
      categoryPath: category ? [category] : [],
    };
  }).filter((listing) => listing.id !== "jimoty-" && listing.title && listing.url);
}

function parseOffmall(html) {
  const blocks = html.match(/<div class="itemcolmn_item[\s\S]*?<button class="item-fav-button[\s\S]*?<\/button>\s*<\/div>/g) || [];

  return blocks.map((block) => {
    const href = matchOne(block, /<a href="([^"]*\/product\/(\d+)\/)"[\s\S]*?>/);
    const rawId = href.match(/\/product\/(\d+)\//)?.[1] || matchOne(block, /data-goodsno="([^"]+)"/);
    const image = normalizeUrl(matchOne(block, /<img[^>]+src="([^"]+)"[^>]+data-object-fit="contain"/), OFFMALL_BASE_URL);
    const brand = cleanText(matchOne(block, /<div class="item-brand-name">([\s\S]*?)<\/div>/));
    const name = cleanText(matchOne(block, /<div class="item-name">([\s\S]*?)<\/div>/));
    const code = cleanText(matchOne(block, /<div class="item-code">([\s\S]*?)<\/div>/));
    const rank = matchOne(block, /<span class="item-price-icon">[\s\S]*?<img[^>]+alt="([^"]*)"/i).toUpperCase();
    const price = Number(cleanText(matchOne(block, /<span class="font-en item-price-en">([\s\S]*?)<\/span>/)).replace(/[^\d]/g, ""));
    const isFresh = block.includes("入荷ホヤホヤ");

    return {
      id: `offmall-${rawId}`,
      source: "offmall",
      title: [brand, name, code].filter(Boolean).join(" "),
      price,
      condition: rank || (isFresh ? "New arrival" : "Listed"),
      shop: "OFFMALL / Hard Off",
      listedAt: new Date().toISOString(),
      url: normalizeUrl(href, OFFMALL_BASE_URL),
      image,
    };
  }).filter((listing) => listing.id !== "offmall-" && listing.title && listing.url);
}

function parseRakuma(html) {
  const blocks = html.match(/<div class="item">\s*<div class="item-box">[\s\S]*?(?=<div class="item">\s*<div class="item-box">|<\/section>)/g) || [];
  const listedAt = new Date().toISOString();

  return blocks.map((block) => {
    const href = normalizeUrl(
      readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]+class="link_search_title"/)
        || readAttributeFromPattern(block, /<a[^>]+class="link_search_title"[^>]+href="([^"]+)"/),
      RAKUMA_BASE_URL,
    );
    const rawId = readAttributeFromPattern(block, /data-rat-itemid="([^"]+)"/).split("/").at(-1) || href.match(/item\.fril\.jp\/([^/?#]+)/)?.[1] || "";
    const title = cleanText(readAttributeFromPattern(block, /data-rat-item_name="([^"]+)"/))
      || cleanText(matchOne(block, /<p class="item-box__item-name">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/));
    const price = Number(readAttributeFromPattern(block, /data-rat-price="([^"]+)"/) || readAttributeFromPattern(block, /data-content="(\d+)"/));
    const brand = cleanText(matchOne(block, /<a[^>]+class="brand-name"[^>]*>([\s\S]*?)<\/a>/));
    const categoryId = readAttributeFromPattern(block, /data-rat-igenre="([^"]+)"/);
    const image = createSourcePlaceholderImage("Rakuma", "#12a05c");

    return {
      id: `rakuma-${rawId}`,
      source: "rakuma",
      title,
      price,
      condition: block.includes("soldout") || block.includes("売り切れ") ? "Sold" : "Listed",
      shop: brand ? `Rakuma · ${brand}` : "Rakuma",
      listedAt,
      url: href,
      image,
      categoryId,
    };
  }).filter((listing) => listing.id !== "rakuma-" && listing.title && listing.url);
}

async function hydrateRakumaThumbnails(listings) {
  const targets = listings
    .filter((listing) => listing.image.startsWith("data:image/svg+xml"))
    .slice(0, RAKUMA_THUMBNAIL_LIMIT);

  for (let index = 0; index < targets.length; index += RAKUMA_THUMBNAIL_BATCH_SIZE) {
    const batch = targets.slice(index, index + RAKUMA_THUMBNAIL_BATCH_SIZE);
    const images = await Promise.all(batch.map((listing) => fetchRakumaThumbnail(listing.url)));

    images.forEach((image, imageIndex) => {
      if (image) {
        batch[imageIndex].image = image;
      }
    });

    if (index + RAKUMA_THUMBNAIL_BATCH_SIZE < targets.length) {
      await wait(250);
    }
  }
}

async function fetchRakumaThumbnail(url) {
  if (!url) return "";
  if (rakumaThumbnailCache.has(url)) return rakumaThumbnailCache.get(url);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      rakumaThumbnailCache.set(url, "");
      return "";
    }

    const image = extractRakumaThumbnail(await response.text());
    rakumaThumbnailCache.set(url, image);
    return image;
  } catch {
    rakumaThumbnailCache.set(url, "");
    return "";
  }
}

function extractRakumaThumbnail(html) {
  const image = normalizeUrl(
    readAttributeFromPattern(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
      || readAttributeFromPattern(html, /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)
      || matchOne(html, /<img[^>]+src="([^"]*img\.fril\.jp[^"]+)"/i),
    RAKUMA_BASE_URL,
  );
  return createRakumaImageProxyUrl(image);
}

function createRakumaImageProxyUrl(image) {
  if (!isAllowedRakumaImageUrl(image)) return image;
  return `/api/rakuma-image?url=${encodeURIComponent(image)}`;
}

function parseMercari(cards) {
  return cards.map((card) => {
    const href = normalizeUrl(card.href, MERCARI_BASE_URL);
    const rawId = card.itemId || href.match(/\/item\/(m\d+)/)?.[1] || "";
    const label = cleanMercariText(card.label).replace(/^Image of\s+/i, "");
    const price = parseMercariPrice(label) || parseMercariPrice(card.text);
    const title = cleanMercariTitle(label, price) || cleanMercariTitle(card.text, price);
    const isAuction = /Bid\s*¥/i.test(card.text);

    return {
      id: `mercari-${rawId}`,
      source: "mercari",
      title,
      price,
      condition: isAuction ? "Mercari auction" : "Listed",
      shop: "Mercari",
      listedAt: new Date().toISOString(),
      url: href,
      image: normalizeUrl(card.image, MERCARI_BASE_URL),
    };
  }).filter((listing) => listing.id !== "mercari-" && listing.title && listing.url);
}

function parseCraigslistRegion(html, options) {
  const sourceId = options.sourceId || "craigslist";
  const label = options.label || "Craigslist";
  const baseUrl = options.baseUrl || CRAIGSLIST_SFBAY_BASE_URL;
  const structuredListings = parseCraigslistStructuredListings(html, baseUrl);
  const blocks = splitHtmlBlocks(html, /<li class="cl-static-search-result"(?=[\s>])/g);
  const listedAt = new Date().toISOString();

  return blocks.map((block, index) => {
    const href = normalizeUrl(readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"/i), baseUrl);
    const rawId = href.match(/\/(\d+)\.html(?:$|\?)/)?.[1] || `${Date.now()}-${index}`;
    const structured = structuredListings.get(index) || {};
    const title = cleanText(matchOne(block, /class="title">([\s\S]*?)<\/div>/i)) || structured.title || "";
    const price = parseUsdPrice(matchOne(block, /class="price">([\s\S]*?)<\/div>/i)) || structured.price || 0;
    const location = cleanText(matchOne(block, /class="location">([\s\S]*?)<\/div>/i)) || structured.location || "";

    return {
      id: `${sourceId}-${rawId}`,
      source: sourceId,
      title,
      price,
      condition: isWantedListingTitle(title) ? "Wanted" : "Listed",
      shop: location ? `${label} · ${location}` : label,
      listedAt,
      url: href,
      image: structured.image || "",
      categoryPath: ["For Sale", "Musical Instruments"],
    };
  }).filter((listing) => listing.id !== `${sourceId}-` && listing.title && listing.url);
}

function parseCraigslistMarkdown(markdown, options) {
  const sourceId = options.sourceId || "craigslist";
  const label = options.label || "Craigslist";
  const baseUrl = options.baseUrl || CRAIGSLIST_SFBAY_BASE_URL;
  const listedAt = new Date().toISOString();
  const imageByListingUrl = new Map();
  const imagePattern = /\[!\[[^\]]*]\((https:\/\/images\.craigslist\.org\/[^)\s]+)\)]\((https:\/\/[^)\s]+\/(\d+)\.html)\)/g;
  const titlePattern = /\[([^\]\n]+)]\((https:\/\/[^)\s]+\/(\d+)\.html)\)/g;
  const titleMatches = [];
  let imageMatch;

  while ((imageMatch = imagePattern.exec(markdown)) !== null) {
    imageByListingUrl.set(imageMatch[2], imageMatch[1]);
  }

  let titleMatch;
  while ((titleMatch = titlePattern.exec(markdown)) !== null) {
    const title = cleanMarkdownText(titleMatch[1]);
    if (!title || title.includes("![") || /^no image/i.test(title)) continue;
    titleMatches.push({
      index: titleMatch.index,
      endIndex: titleMatch.index + titleMatch[0].length,
      title,
      url: normalizeUrl(titleMatch[2], baseUrl),
      rawId: titleMatch[3],
    });
  }

  return titleMatches.map((match, index) => {
    const nextIndex = titleMatches[index + 1]?.index ?? markdown.length;
    const detail = markdown.slice(match.endIndex, nextIndex);
    const lines = detail.split(/\n+/).map((line) => cleanMarkdownText(line)).filter(Boolean);
    const priceLine = lines.find((line) => /^\$[\d,.]+/.test(line));
    const locationLine = lines.find((line) => /\b(?:min|mins|h|hr|hrs|d|day|days)\s+ago\b/i.test(line));
    const location = locationLine
      ? cleanMarkdownText(locationLine.replace(/^.*?\bago\b/i, ""))
      : "";

    return {
      id: `${sourceId}-${match.rawId}`,
      source: sourceId,
      title: match.title,
      price: parseUsdPrice(priceLine),
      condition: isWantedListingTitle(match.title) ? "Wanted" : "Listed",
      shop: location ? `${label} · ${location}` : label,
      listedAt,
      url: match.url,
      image: imageByListingUrl.get(match.url) || "",
      categoryPath: ["For Sale", "Musical Instruments"],
    };
  }).filter((listing) => listing.id !== `${sourceId}-` && listing.title && listing.url);
}

function isWantedListingTitle(title) {
  return /^(?:looking\s+for|wanted|i\s+buy)\b/i.test(cleanMarkdownText(title));
}

function parseCraigslistStructuredListings(html, baseUrl = CRAIGSLIST_SFBAY_BASE_URL) {
  const json = matchOne(html, /<script[^>]+id="ld_searchpage_results"[^>]*>([\s\S]*?)<\/script>/i);
  const listingsByIndex = new Map();
  if (!json.trim()) return listingsByIndex;

  try {
    const payload = JSON.parse(json.trim());
    (payload.itemListElement || []).forEach((entry, index) => {
      const item = entry?.item || {};
      const offer = item.offers || {};
      const place = offer.availableAtOrFrom || {};
      const address = place.address || {};
      const image = Array.isArray(item.image) ? item.image[0] : item.image;
      const position = Number(entry.position);

      listingsByIndex.set(Number.isFinite(position) ? position : index, {
        title: cleanText(String(item.name || "")),
        price: parseUsdPrice(offer.price),
        image: normalizeUrl(String(image || ""), baseUrl),
        location: cleanText(String(address.addressLocality || "")),
      });
    });
  } catch {
    return listingsByIndex;
  }

  return listingsByIndex;
}

function parseUsdPrice(value) {
  const rawPrice = String(value || "").match(/([\d,.]+)/)?.[1] || "";
  return rawPrice ? Number(rawPrice.replace(/[^\d.]/g, "")) : 0;
}

function parseReverb(data, options = {}) {
  const sourceId = options.sourceId || "reverb";
  return (data?.listings || []).map((item) => {
    const rawId = String(item.id || "");
    const categories = Array.isArray(item.categories)
      ? item.categories.map((category) => cleanText(String(category.full_name || ""))).filter(Boolean)
      : [];
    const condition = [
      cleanText(String(item.condition?.display_name || "")),
      item.state?.description && item.state?.slug !== "live" ? cleanText(String(item.state.description)) : "",
      ...categories,
    ].filter(Boolean).join(" · ") || "Listed";

    return {
      id: `${sourceId}-${rawId}`,
      source: sourceId,
      title: cleanText(String(item.title || [item.make, item.model].filter(Boolean).join(" "))),
      price: parseReverbPrice(item.price),
      condition,
      shop: cleanText(String(item.shop_name || "")),
      listedAt: item.published_at || item.created_at || new Date().toISOString(),
      url: normalizeUrl(item._links?.web?.href || `/item/${rawId}`, REVERB_BASE_URL),
      image: normalizeUrl(
        item.photos?.[0]?._links?.large_crop?.href
          || item.photos?.[0]?._links?.small_crop?.href
          || item._links?.photo?.href
          || "",
        REVERB_BASE_URL,
      ),
      categoryPath: categories,
      availability: item.state?.slug || "",
    };
  }).filter((listing) => listing.id !== `${sourceId}-` && listing.title && listing.url && listing.price > 0);
}

function parseEbayBrowse(data) {
  return (data?.itemSummaries || []).map((item) => {
    const rawId = String(item.itemId || item.legacyItemId || "");
    const categories = Array.isArray(item.categories)
      ? item.categories.map((category) => cleanText(String(category.categoryName || ""))).filter(Boolean)
      : [];
    const location = [
      cleanText(String(item.itemLocation?.city || "")),
      cleanText(String(item.itemLocation?.stateOrProvince || "")),
    ].filter(Boolean).join(", ");
    const condition = [
      cleanText(String(item.condition || "")),
      item.buyingOptions?.includes("AUCTION") ? "Auction" : "",
      location,
    ].filter(Boolean).join(" · ") || "Listed";

    return {
      id: `ebay-us-${rawId}`,
      source: "ebay-us",
      title: cleanText(String(item.title || "")),
      price: parseEbayPrice(item.price),
      condition,
      shop: cleanText(String(item.seller?.username || "")),
      listedAt: item.itemCreationDate || item.itemOriginDate || new Date().toISOString(),
      url: normalizeUrl(item.itemWebUrl || "", "https://www.ebay.com"),
      image: normalizeUrl(
        item.image?.imageUrl
          || item.thumbnailImages?.[0]?.imageUrl
          || item.additionalImages?.[0]?.imageUrl
          || "",
        "https://www.ebay.com",
      ),
      categoryPath: categories.length ? categories : [cleanText(String(item.categoryPath || ""))].filter(Boolean),
      availability: item.itemEndDate ? `Ends ${item.itemEndDate}` : "",
    };
  }).filter((listing) => listing.id !== "ebay-us-" && listing.title && listing.url && listing.price > 0);
}

function parseReverbPrice(price) {
  if (!price) return 0;
  if (price.currency === "JPY") return Number(String(price.amount || "").replace(/[^\d]/g, ""));
  return Number(String(price.amount_cents || "0").replace(/[^\d]/g, "")) / 100;
}

function parseEbayPrice(price) {
  if (!price) return 0;
  return Number(String(price.value || price.convertedFromValue || "0").replace(/[^\d.]/g, ""));
}

function parseMercariPrice(value) {
  const text = cleanMercariText(value);
  const yenMarkMatch = text.match(/(?:Bid\s*)?¥\s*([\d,]+)/i);
  if (yenMarkMatch) return Number(yenMarkMatch[1].replace(/[^\d]/g, ""));

  const yenMatches = [...text.matchAll(/([\d,]+)\s*yen\b/gi)];
  const lastYenMatch = yenMatches.at(-1);
  return lastYenMatch ? Number(lastYenMatch[1].replace(/[^\d]/g, "")) : 0;
}

function cleanMercariTitle(value, price) {
  const pricePattern = price ? String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

  return cleanMercariText(value)
    .replace(/^Image of\s+/i, "")
    .replace(/^Bid\s*¥\s*[\d,]+\s*/i, "")
    .replace(/^¥\s*[\d,]+\s*/i, "")
    .replace(pricePattern ? new RegExp(`\\s*${pricePattern}\\s*yen\\s*$`, "i") : /$/g, "")
    .replace(/\s*yen\s*$/i, "")
    .trim();
}

function cleanMercariText(value) {
  return (value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function cloneListings(listings) {
  return listings.map((listing) => ({ ...listing }));
}

function isPlaceholderImage(image) {
  return !image || image.startsWith("data:image/svg+xml");
}

function pruneMercariCache() {
  const now = Date.now();
  for (const [key, cached] of mercariCache) {
    if (now - cached.createdAt >= MERCARI_CACHE_TTL_MS) {
      mercariCache.delete(key);
    }
  }
}

function parseYahooFleamarket(html) {
  const script = matchOne(html, /<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
  if (!script) return [];

  const data = JSON.parse(script);
  const items = data?.props?.initialState?.searchState?.search?.result?.items || [];

  return items.map((item) => {
    const rawId = String(item.id || "");
    const categoryPath = Array.isArray(item.category?.path)
      ? item.category.path.map((category) => String(category.id)).filter(Boolean)
      : [];

    return {
      id: `yahoo-fleamarket-${rawId}`,
      source: "yahoo-fleamarket",
      title: cleanText(String(item.title || "")),
      price: Number(item.price || 0),
      condition: formatYahooFleamarketCondition(item),
      shop: "Yahoo Fleamarket",
      listedAt: item.openTime || new Date().toISOString(),
      url: normalizeUrl(`/item/${rawId}`, YAHOO_FLEAMARKET_BASE_URL),
      image: normalizeUrl(item.thumbnailImageUrl || "", YAHOO_FLEAMARKET_BASE_URL),
      categoryId: item.category?.id ? String(item.category.id) : "",
      categoryPath,
    };
  }).filter((listing) => listing.id !== "yahoo-fleamarket-" && listing.title && listing.url);
}

function formatYahooFleamarketCondition(item) {
  const parts = [];
  if (item.itemStatus === "SOLD") parts.push("Sold");
  if (String(item.condition || "").startsWith("used")) parts.push("Used");
  if (String(item.condition || "").startsWith("new")) parts.push("New/unused");
  if (item.isPriceDown) parts.push("Price down");
  return parts.join(" · ") || "Listed";
}

function parseYahooAuctions(html) {
  const blocks = html.match(/<li class="Product">[\s\S]*?<\/li>/g) || [];

  return blocks.map((block) => {
    const rawId = matchOne(block, /data-auction-id="([^"]+)"/);
    const title = cleanText(readAttribute(block, "data-auction-title"));
    const image = normalizeUrl(readAttribute(block, "data-auction-img"), YAHOO_AUCTIONS_BASE_URL);
    const price = Number(readAttribute(block, "data-auction-price") || "0");
    const href = normalizeUrl(matchOne(block, /href="([^"]*\/jp\/auction\/[^"]+)"/), YAHOO_AUCTIONS_BASE_URL);
    const categoryId = readAttribute(block, "data-auction-category");
    const categoryPath = splitCategoryPath(readAttribute(block, "data-auction-categoryidpath"));
    const startTime = Number(matchOne(block, /st:(\d+)/)) || Number(matchOne(block, /stm=(\d+)/));
    const endTime = Number(matchOne(block, /data-auction-endtime="(\d+)"/)) || Number(matchOne(block, /end:(\d+)/)) || Number(matchOne(block, /etm=(\d+)/));
    const bidCount = cleanText(matchOne(block, /<dd class="Product__bid">([\s\S]*?)<\/dd>/));
    const remainingTime = cleanText(matchOne(block, /<dd class="Product__time[^"]*"[^>]*>([\s\S]*?)<\/dd>/));

    return {
      id: `yahoo-auctions-${rawId}`,
      source: "yahoo-auctions",
      title,
      price,
      condition: createYahooAuctionCondition(bidCount, remainingTime, endTime),
      shop: "Yahoo Auctions",
      listedAt: unixTimestampToIso(startTime) || new Date().toISOString(),
      url: href,
      image,
      categoryId,
      categoryPath,
    };
  }).filter((listing) => listing.id !== "yahoo-auctions-" && listing.title && listing.url);
}

function createYahooAuctionCondition(bidCount, remainingTime, endTime) {
  const parts = ["Auction"];
  if (bidCount) parts.push(`${bidCount} bids`);
  if (remainingTime) parts.push(`ends in ${remainingTime}`);
  if (!remainingTime && endTime) parts.push(`ends ${formatYahooEndDate(endTime)}`);
  return parts.join(" · ");
}

function formatYahooEndDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
}

async function serveStatic(pathname, response) {
  const safePath = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const contents = await readFile(filePath);
  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": "no-store",
  });
  response.end(contents);
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function splitParam(value) {
  return (value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createSourceSearchTerms(terms) {
  const seen = new Set();
  return terms
    .flatMap((term) => createSourceSearchTermVariants(parseMatchTerm(term).value))
    .filter((term) => {
      const normalized = normalizeText(term);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
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

function termMatches(searchable, term) {
  const matchTerm = parseMatchTerm(term);
  const normalized = normalizeText(matchTerm.value);
  if (!normalized) return false;

  if (matchTerm.exact) {
    return exactPhraseMatches(searchable, normalized);
  }

  if (/^[a-z0-9]+$/.test(normalized) && normalized.length <= 3) {
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

function splitCategoryPath(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function decodeResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  const charset = contentType.match(/charset=([^;]+)/i)?.[1]?.trim().toLowerCase() || "utf-8";
  const body = Buffer.from(await response.arrayBuffer());

  try {
    return new TextDecoder(charset).decode(body);
  } catch {
    return body.toString("utf8");
  }
}

function splitHtmlBlocks(html, markerPattern) {
  const starts = [...html.matchAll(markerPattern)].map((match) => match.index).filter((index) => typeof index === "number");
  return starts.map((start, index) => html.slice(start, starts[index + 1] || html.length));
}

function parseYenPrice(value) {
  const text = cleanText(String(value || ""));
  const yenMatch = text.match(/(?:¥|￥)?\s*([\d,]+)\s*(?:円|¥|￥)/);
  const rawPrice = yenMatch?.[1] || text.match(/(?:¥|￥)\s*([\d,]+)/)?.[1] || "";
  return rawPrice ? Number(rawPrice.replace(/[^\d]/g, "")) : 0;
}

function normalizeRelativeUrl(value, baseUrl) {
  if (!value) return "";
  if (value.startsWith("//")) return `https:${value}`;

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function normalizeShopifyImage(value) {
  return String(value || "").replace("{width}", "600");
}

function matchOne(value, pattern) {
  return value.match(pattern)?.[1] || "";
}

function readAttribute(value, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return decodeHtml(matchOne(value, new RegExp(`${escapedName}="([^"]*)"`, "i")));
}

function readAttributeFromPattern(value, pattern) {
  return decodeHtml(matchOne(value, pattern));
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function cleanMarkdownText(value) {
  return decodeHtml(String(value || ""))
    .replace(/!\[[^\]]*]\([^)]+\)/g, "")
    .replace(/\[([^\]]+)]\([^)]+\)/g, "$1")
    .replace(/[*_`]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&yen;/g, "¥")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeUrl(value, baseUrl = DIGIMART_BASE_URL) {
  if (!value) return "";
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${baseUrl}${value}`;
  return value;
}

function normalizeText(value) {
  return value.toLocaleLowerCase("ja-JP").normalize("NFKC");
}

function unixTimestampToIso(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toISOString();
}

function parseJapaneseMonthDay(value) {
  const match = String(value || "").match(/(\d{1,2})月(\d{1,2})日/);
  if (!match) return "";

  const now = new Date();
  const year = now.getFullYear();
  const month = Number(match[1]);
  const day = Number(match[2]);
  if (!month || !day) return "";

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function createSourcePlaceholderImage(label, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540"><rect width="720" height="540" fill="${color}"/><rect x="28" y="28" width="664" height="484" rx="34" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" stroke-width="3"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" letter-spacing="0">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
