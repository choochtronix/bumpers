import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.addInitScript(() => localStorage.setItem("bumpers.welcomeDismissed", "true"));
  // Isolate fixtures from real accounts, marketplace traffic, and browser data.
  await page.route("**/api/**", (route) => route.fulfill({
    json: { enabled: false, listings: [], meta: { liveSources: [], errors: [] } },
  }));
  await page.goto(`${baseUrl}/settings`, { waitUntil: "load" });
  const results = await page.evaluate(async () => {
    const checks = [];
    const check = (name, actual, expected) => checks.push({ name, actual, expected });
    const now = new Date().toISOString();
    const profile = hydrateProfile({
      id: "saved-moog", name: "Moog", terms: ["Moog"], regionId: "japan",
      sources: ["yahoo-auctions"], excludes: [], noiseTerms: [],
    });
    const listing = {
      id: "yahoo-auctions-moog", source: "yahoo-auctions", region: "japan", currency: "JPY",
      title: "Moog Voyager synthesizer", price: 100000, condition: "Used",
      listedAt: now, url: "https://example.com/moog", image: "",
    };
    const result = (listings, extra = {}) => ({ mode: "live", listings, errors: [], detail: "", ...extra });
    const reset = (saved = profile) => {
      clearTimeout(savedSearchDwellTimer);
      clearTimeout(savedSearchSeenJustNowTimer);
      savedSearchDwellTimer = 0;
      savedSearchSeenJustNowTimer = 0;
      savedSearchSeenJustNowId = "";
      [STORAGE_KEYS.listingLedger, STORAGE_KEYS.savedSearchScans, STORAGE_KEYS.savedSearchSeen, STORAGE_KEYS.seen,
        STORAGE_KEYS.feedbackRules, STORAGE_KEYS.savedSearchDeletionTombstones].forEach((key) => localStorage.removeItem(key));
      savedSearchRepository.replaceAll([saved]);
      currentProfile = saved;
    };
    localStorage.setItem(STORAGE_KEYS.profiles, JSON.stringify([
      profile,
      { ...profile, id: "duplicate-moog", name: " moog ", updatedAt: "2020-01-01T00:00:00.000Z" },
    ]));
    check("legacy duplicate records appear once", loadProfiles().length, 1);
    savedSearchRepository.replaceAll([profile]);
    currentProfile = profile;
    recordListingDiscoveries({ name: "Fresh Finds" }, [listing]);
    applySearchResult(profile, { mode: "live", listings: [listing], errors: [], detail: "" }, true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    check("previous Gear Scanner discovery counts for the saved search", loadProfiles()[0].lastNewCount, 1);
    applySearchResult(profile, { mode: "live", listings: [listing], errors: [], detail: "" }, true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    check("unread listing survives a repeated scan", loadProfiles()[0].lastNewCount, 1);
    acknowledgeListings([listing], { viewed: true });
    check("viewing the listing clears the saved unread count", loadProfiles()[0].lastNewCount, 0);
    const selected = createProfileForRegion(profile, "japan");
    check("opening a saved search preserves its selected sources", selected.sources, profile.sources);

    reset();
    const datedMoog = { ...listing, listedAt: now };
    applySearchResult(profile, result([datedMoog]), true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    check("new-since surfaces a fresh match before opening", getSavedSearchNewSinceCount(loadProfiles()[0]), 1);
    markSavedSearchSeen(loadProfiles()[0]);
    await new Promise((resolve) => setTimeout(resolve, 25));
    check("opening a saved search clears its new-since badge", getSavedSearchNewSinceCount(loadProfiles()[0]), 0);
    const laterMoog = { ...listing, id: "yahoo-auctions-moog-later", title: "Moog Grandmother", listedAt: new Date().toISOString() };
    applySearchResult(profile, result([datedMoog, laterMoog]), true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    check("a genuinely new arrival re-lights the badge after opening", getSavedSearchNewSinceCount(loadProfiles()[0]), 1);
    const seenAtBeforeAccountChange = getSavedSearchSeenAt(loadProfiles()[0]);
    scheduleSavedSearchSeen(loadProfiles()[0]);
    authSessionRevision += 1;
    await new Promise((resolve) => setTimeout(resolve, SAVED_SEARCH_SEEN_DWELL_MS + 50));
    check("an account change cancels delayed saved-search acknowledgement", getSavedSearchSeenAt(loadProfiles()[0]), seenAtBeforeAccountChange);

    const merged = savedSearchRepository.previewMerge([
      { ...profile, updatedAt: "2020-01-01T00:00:00.000Z", lastScannedAt: now, lastMatchCount: 12 },
      { ...profile, id: "duplicate-moog", name: "moog", updatedAt: "2020-01-01T00:00:00.000Z" },
    ], { preferNewest: true });
    check("duplicate cloud records merge into one", merged.mergedProfiles.length, 1);
    check("newest preferences survive independently of scan summaries", merged.mergedProfiles[0].updatedAt, profile.updatedAt);
    check("remote-ID aliases match a renamed local search", deduplicateSavedSearches([
      { ...profile, name: "Local Moog", sync: { remoteId: "account:cloud-moog" }, userId: "account" },
      { ...profile, id: "cloud-moog", name: "Cloud Moog" },
    ]).length, 1);
    check("bridged legacy identities collapse transitively", deduplicateSavedSearches([
      { ...profile, id: "a", name: "A" },
      { ...profile, id: "b", name: "B" },
      { ...profile, id: "a", name: "B" },
    ]).length, 1);

    reset();
    const undated = { ...listing, listedAt: "" };
    applySearchResult(profile, result([undated]), true);
    check("initial undated backlog is not new", loadProfiles()[0].lastNewCount, 0);
    check("initial undated backlog has no card badge", getListingNewness(undated).showsNewBadge, false);
    reset();
    applySearchResult(profile, result([]), true);
    applySearchResult(profile, result([undated, undated]), true);
    check("empty successful scan establishes a discovery baseline", loadProfiles()[0].lastNewCount, 1);
    check("repeated listing IDs render once", currentResults.length, 1);
    check("undated arrival badge agrees with the saved count", getListingNewness(undated).showsNewBadge, true);
    applySearchResult(profile, result([], {
      errors: [{ source: "yahoo-auctions", message: "Fixture failure" }],
      meta: { sourceStats: [{ source: "yahoo-auctions", status: "error" }] },
    }), true);
    check("failed source retains previously unread results", loadProfiles()[0].lastNewCount, 1);
    applySearchResult(profile, result([]), true);
    check("successful empty scan removes listings no longer returned", loadProfiles()[0].lastNewCount, 0);

    const multiSource = hydrateProfile({ ...profile, sources: ["yahoo-auctions", "digimart"] });
    reset(multiSource);
    applySearchResult(multiSource, result([], {
      errors: [{ source: "digimart", message: "Fixture failure" }],
      meta: { sourceStats: [{ source: "yahoo-auctions", status: "ok" }, { source: "digimart", status: "error" }] },
    }), true);
    const firstDigimart = { ...undated, id: "digimart-first", source: "digimart" };
    applySearchResult(multiSource, result([firstDigimart]), true);
    check("a failed source's first backlog is not marked new", loadProfiles()[0].lastNewCount, 0);
    check("card badge respects the source-specific baseline", getListingNewness(firstDigimart).showsNewBadge, false);

    reset();
    applySearchResult(profile, result([{ ...listing, listedAt: "2020-01-01T00:00:00.000Z" }]), true);
    check("old marketplace listing does not count as new", loadProfiles()[0].lastNewCount, 0);
    reset();
    applySearchResult(profile, result([listing]), true);
    const ledger = loadLedger();
    ledger[listing.id].firstDiscoveredAt = "2020-01-01T00:00:00.000Z";
    saveLedger(ledger);
    check("expired unread counts age out without another search", loadProfiles()[0].lastNewCount, 0);
    reset();
    saveFeedbackRules({ moog: { noiseListingIds: [listing.id] } }, { skipSync: true });
    applySearchResult(profile, result([listing]), true);
    check("hidden noise does not inflate the saved count", loadProfiles()[0].lastNewCount, 0);

    reset();
    const beforeScanUpdatedAt = loadProfiles()[0].updatedAt;
    applySearchResult(profile, result([listing]), true);
    check("scanning does not timestamp old preferences as a new edit", loadProfiles()[0].updatedAt, beforeScanUpdatedAt);
    savedSearchRepository.save({ ...profile, terms: ["Waldorf"] });
    check("editing criteria clears stale scan counts", loadProfiles()[0].lastNewCount, 0);
    check("late response cannot update an edited search", recordSavedSearchScan(profile, [listing], result([listing])), null);
    savedSearchRepository.deleteById(profile.id);
    check("late response cannot recreate a deleted search", recordSavedSearchScan(profile, [listing], result([listing])), null);

    reset();
    const originalPut = putCloudSavedSearches;
    let finishPush;
    putCloudSavedSearches = () => new Promise((resolve) => { finishPush = resolve; });
    const push = pushCloudSavedSearches({ silent: true, rethrow: true });
    savedSearchRepository.save({ ...profile, id: "saved-waldorf", name: "Waldorf", terms: ["Waldorf"] });
    finishPush({ profiles: [profile], updatedAt: now, storage: "cloud" });
    await push;
    putCloudSavedSearches = originalPut;
    check("delayed push response preserves a newly saved search", loadProfiles().length, 2);

    reset();
    let refreshCalls = 0;
    const originalFetch = fetchLiveListings;
    fetchLiveListings = async () => { refreshCalls++; return result([listing]); };
    openSavedResultsDrawer();
    window.clearTimeout(savedSearchRefreshTimer);
    const originalProfileId = currentProfile.id;
    await Promise.all([refreshSavedSearches(), refreshSavedSearches()]);
    check("concurrent sidebar refresh requests share one scan", refreshCalls, 1);
    check("sidebar refresh finds new listings without opening the search", loadProfiles()[0].lastNewCount, 1);
    check("background scan does not acknowledge unseen cards", Boolean(loadLedger()[listing.id].acknowledgedAt), false);
    check("background scan preserves the active search", currentProfile.id, originalProfileId);
    await refreshSavedSearches();
    check("reopening fresh saved searches does not rescan", refreshCalls, 1);
    fetchLiveListings = originalFetch;
    closeSavedResultsDrawer();
    window.clearTimeout(savedSearchRefreshTimer);
    return checks;
  });
  const failures = results.filter(({ actual, expected }) => {
    try { assert.deepEqual(actual, expected); return false; } catch { return true; }
  });
  for (const result of results) console.log(JSON.stringify(result));
  assert.equal(failures.length, 0, `${failures.length} saved-search regression checks failed`);

  await mkdir(new URL("../card-snapshots/", import.meta.url), { recursive: true });
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const theme of ["light", "dark"]) {
      await page.evaluate((theme) => {
        setTheme(theme);
        openSavedResultsDrawer();
        window.clearTimeout(savedSearchRefreshTimer);
      }, theme);
      await page.waitForFunction(() => savedResultsDrawer.getBoundingClientRect().left >= 0);
      const layout = await page.evaluate(() => {
        const rows = [...savedResultsDrawerList.querySelectorAll("[data-saved-results-id]")];
        const bounds = savedResultsDrawer.getBoundingClientRect();
        const titleBounds = document.querySelector("#savedResultsDrawerTitle").getBoundingClientRect();
        return {
          rows: rows.length,
          unique: new Set(rows.map((row) => row.dataset.savedResultsId)).size,
          bounds: bounds.toJSON(),
          withinViewport: bounds.left >= 0 && bounds.right <= innerWidth && bounds.bottom <= innerHeight,
          overflow: savedResultsDrawer.scrollWidth > savedResultsDrawer.clientWidth,
          titleUnobstructed: savedResultsDrawer.contains(document.elementFromPoint(titleBounds.x + titleBounds.width / 2, titleBounds.y + titleBounds.height / 2)),
        };
      });
      console.log(JSON.stringify({ viewport, theme, layout }));
      await page.screenshot({ path: new URL(`../card-snapshots/saved-search-${viewport.width}-${theme}.png`, import.meta.url).pathname, animations: "disabled" });
      assert.equal(layout.rows, layout.unique);
      assert.equal(layout.withinViewport, true);
      assert.equal(layout.overflow, false);
      assert.equal(layout.titleUnobstructed, true);
    }
  }
  let releaseSearch;
  const searchGate = new Promise((resolve) => { releaseSearch = resolve; });
  await page.route("**/api/search?**", async (route) => {
    await searchGate;
    await route.fulfill({ json: { listings: [], meta: { errors: [], sourceStats: [{ source: "yahoo-auctions", status: "ok" }] } } });
  });
  const searchRequest = page.waitForRequest((request) => request.url().includes("/api/search?"));
  await page.locator('[data-saved-results-id="saved-moog"]').click();
  const request = await searchRequest;
  assert.equal(new URL(request.url()).searchParams.get("sources"), "yahoo-auctions");
  assert.equal(await page.evaluate(() => loadProfiles()[0].lastNewCount), 1, "opening the saved search must not clear unread counts");
  releaseSearch();
  await page.waitForFunction(() => !isSearching);
  console.log("Saved-search desktop/mobile light/dark checks passed.");
} finally {
  await browser.close();
}
