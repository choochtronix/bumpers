import assert from "node:assert/strict";
import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable", args: ["--no-sandbox"] });
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => window.localStorage.setItem("bumpers.welcomeDismissed", "true"));
  await page.route("**/api/**", (route) => route.fulfill({ json: { enabled: false, listings: [], meta: { liveSources: [], errors: [] } } }));
  await page.goto(`${process.argv[2] || "http://127.0.0.1:5173"}/settings`);
  const result = await page.evaluate(async () => {
    authState.config = { enabled: false };
    authState.user = { id: "fixture-A" }; renderAccountShell(authState.user);
    const profile = hydrateProfile({ id: "owned-A", userId: "fixture-A", name: "Moog", terms: ["Moog"], sources: ["yahoo-auctions"] });
    savedSearchRepository.replaceAll([profile]);
    saveSet(STORAGE_KEYS.watching, ["a-watch"]);
    await signOutAccount();
    const signedOut = { profiles: loadProfiles().length, watches: loadSet(STORAGE_KEYS.watching).length };
    authState.user = { id: "fixture-B" }; renderAccountShell(authState.user);
    const accountB = { profiles: loadProfiles().length, watches: loadSet(STORAGE_KEYS.watching).length };
    authState.user = { id: "fixture-A" }; renderAccountShell(authState.user);
    const accountARestored = loadProfiles().length;
    const originalFetch = fetchCloudSavedSearches; const originalPut = putCloudSavedSearches;
    let uploaded;
    fetchCloudSavedSearches = async () => ({ revision: 2, profiles: [{ ...profile, deletedAt: new Date().toISOString() }] });
    putCloudSavedSearches = async (payload) => { uploaded = payload; return { ...payload, revision: 3 }; };
    await reconcileCloudSavedSearches({ allowEmpty: true, silent: true });
    const deleted = { localCount: loadProfiles().length, uploadedCount: uploaded.profiles.length, deletedIds: uploaded.deletedIds };
    let release;
    fetchCloudSavedSearches = () => new Promise((resolve) => { release = resolve; });
    const pull = pullCloudSavedSearches({ silent: true, rethrow: true }).then(() => false, () => true);
    authState.user = { id: "fixture-B" }; renderAccountShell(authState.user);
    release({ revision: 3, profiles: [profile] });
    const staleResponseRejected = await pull;
    const accountBUnchanged = loadProfiles().length;
    fetchCloudSavedSearches = originalFetch; putCloudSavedSearches = originalPut;
    const originalRefresh = refreshAuthSessionIfNeeded;
    authState.config = { enabled: true }; authState.session = { access_token: "fixture-token-B" };
    refreshAuthSessionIfNeeded = () => new Promise((resolve) => { release = resolve; });
    const headers = getCloudSyncHeaders().then(() => false, () => true);
    authState.user = { id: "fixture-C" }; authState.session = { access_token: "fixture-token-C" }; renderAccountShell(authState.user);
    release({ access_token: "fixture-stale-token-B" });
    const staleHeadersRejected = await headers;
    const nextSessionPreserved = authState.session.access_token === "fixture-token-C";
    refreshAuthSessionIfNeeded = originalRefresh; authState.config = { enabled: false }; authState.session = null;
    authState.user = { id: "fixture-A" }; renderAccountShell(authState.user);
    currentProfile = hydrateProfile({ name: "Private A search", terms: ["Moog"], sources: ["yahoo-auctions"] });
    const originalSearch = fetchLiveListings;
    fetchLiveListings = () => new Promise((resolve) => { release = resolve; });
    const search = runSearch();
    authState.user = { id: "fixture-B" }; renderAccountShell(authState.user);
    release({ mode: "live", listings: [{ id: "private-A-result", title: "Moog synthesizer", source: "yahoo-auctions" }], errors: [], detail: "" });
    await search;
    const staleSearchRejected = !currentResults.some((listing) => listing.id === "private-A-result") && !loadLedger()["private-A-result"];
    fetchLiveListings = originalSearch;
    const laSearch = hydrateProfile({ ...profile, id: "legacy-la", userId: "fixture-B", name: "LA pedals",
      regionId: "los-angeles", categoryIntent: "effects-pedals", sources: ["reverb-us", "ebay-us"] });
    savedSearchRepository.replaceAll([laSearch]);
    const legacyCloud = { ...laSearch }; delete legacyCloud.regionId; delete legacyCloud.categoryIntent;
    const repairedLegacy = prepareCloudProfileForLocal(parseSavedSearchProfilesFromPayload([legacyCloud])[0]);
    const legacyCriteria = { region: repairedLegacy.regionId, category: repairedLegacy.categoryIntent };
    const duplicate = hydrateProfile({ ...profile, id: "duplicate-one", userId: "fixture-B", name: "Duplicate",
      createdAt: "2026-01-01T00:00:00.000Z" });
    savedSearchRepository.replaceAll([duplicate, { ...duplicate, id: "duplicate-two" }]);
    const visibleDuplicate = savedSearchRepository.list()[0];
    recordSavedSearchDeletion(visibleDuplicate); savedSearchRepository.deleteMatching(visibleDuplicate);
    const duplicateDeletedIds = readSavedSearchDeletionTombstones().flatMap((item) => item.ids).sort();
    const recreated = savedSearchRepository.save(visibleDuplicate);
    const recreation = { newId: !duplicateDeletedIds.includes(recreated.id), visible: !isSavedSearchDeletedLocally(recreated) };
    recordSavedSearchDeletion(recreated); savedSearchRepository.deleteMatching(recreated);
    const repeatDeletionRetainedIds = readSavedSearchDeletionTombstones().flatMap((item) => item.ids);
    appSettings.regionId = "bay-area"; appSettings.currency = "USD"; appSettings.jpyPerUsd = 155;
    const restored = createListingFromLedgerEntry({ id: "jp-watch", source: "yahoo-auctions", price: 155000 });
    const watchPrice = formatPrice(restored.price, restored.currency);

    appSettings.gearMode = true;
    const now = new Date().toISOString();
    const profiles = Array.from({ length: 30 }, (_, i) => hydrateProfile({ id: `perf-${i}`, name: `Moog ${i}`, terms: ["Moog"], sources: ["yahoo-auctions"], regionId: "japan" }));
    savedSearchRepository.replaceAll(profiles);
    const listings = Array.from({ length: 250 }, (_, i) => ({ id: `perf-listing-${i}`, source: "yahoo-auctions", region: "japan", currency: "JPY", title: `Moog synthesizer ${i}`, price: 10000, listedAt: now, url: `https://example.invalid/${i}` }));
    recordListingDiscoveries({ name: "Fixture" }, listings, { presented: false });
    localStorage.setItem(STORAGE_KEYS.savedSearchScans, JSON.stringify(Object.fromEntries(profiles.map((p) => [getProfileDiscoveryKey(p), {
      signature: getSavedSearchScanSignature(p), checkedAt: now, sourceScannedAt: { "yahoo-auctions": now }, listingIds: listings.map((listing) => listing.id),
    }]))));
    const times = [];
    for (let i = 0; i < 5; i++) { const start = performance.now(); loadProfiles(); times.push(Math.round(performance.now() - start)); }
    const start = performance.now(); renderSavedSearches(); const renderMs = Math.round(performance.now() - start);
    clearTimeout(savedSearchRefreshTimer); clearTimeout(savedSearchAutoSyncTimer); clearTimeout(profileAutoSyncTimer);
    return { signedOut, accountB, accountARestored, deleted, staleResponseRejected, accountBUnchanged,
      staleHeadersRejected, nextSessionPreserved, staleSearchRejected, legacyCriteria,
      duplicateDeletedIds, recreation, repeatDeletionRetained: [...duplicateDeletedIds, recreated.id].every((id) => repeatDeletionRetainedIds.includes(id)),
      watchPrice, times, renderMs };
  });
  console.log(JSON.stringify(result, null, 2));
  assert.deepEqual(result.signedOut, { profiles: 0, watches: 0 });
  assert.deepEqual(result.accountB, { profiles: 0, watches: 0 });
  assert.equal(result.accountARestored, 1); assert.equal(result.deleted.localCount, 0); assert.equal(result.deleted.uploadedCount, 0);
  assert.deepEqual(result.deleted.deletedIds, ["owned-A"]);
  assert.equal(result.staleResponseRejected, true); assert.equal(result.accountBUnchanged, 0);
  assert.equal(result.staleHeadersRejected, true); assert.equal(result.nextSessionPreserved, true); assert.equal(result.staleSearchRejected, true);
  assert.deepEqual(result.legacyCriteria, { region: "los-angeles", category: "effects-pedals" });
  assert.deepEqual(result.duplicateDeletedIds, ["duplicate-one", "duplicate-two"]);
  assert.deepEqual(result.recreation, { newId: true, visible: true });
  assert.equal(result.repeatDeletionRetained, true);
  assert.equal(result.watchPrice, "$1,000");
  assert.ok(Math.max(...result.times.slice(1)) < 100, "warm repository read exceeded 100ms");
  assert.ok(result.times[0] < 1000, "cold repository read exceeded 1s");
  assert.ok(result.renderMs < 250, "saved-search rendering exceeded 250ms");
  assert.deepEqual(errors, []);
  const startup = await browser.newPage();
  await startup.addInitScript(() => {
    localStorage.setItem("bumpers.welcomeDismissed", "true");
    localStorage.setItem("bumpers.authSession", JSON.stringify({ access_token: "fixture-access", refresh_token: "fixture-refresh",
      expires_at: 9999999999, user: { id: "fixture-startup", email: "fixture@example.invalid" } }));
  });
  await startup.route("**/api/**", (route) => route.fulfill({ json: { enabled: false, listings: [], meta: { liveSources: [], errors: [] } } }));
  await startup.goto(`${process.argv[2] || "http://127.0.0.1:5173"}/?q=Moog&region=japan`);
  await startup.waitForFunction(() => authState.config !== null && !isSearching);
  assert.deepEqual(await startup.evaluate(() => ({ owner: authState.user?.id, terms: currentProfile.terms })),
    { owner: "fixture-startup", terms: ["Moog"] });
  await startup.close();
  console.log("Account isolation, durable deletion, stale-session, watch currency and performance checks passed.");
} finally { await browser.close(); }
