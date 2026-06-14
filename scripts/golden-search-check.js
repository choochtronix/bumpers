const DEFAULT_BASE_URL = "http://127.0.0.1:5173";

const GOLDEN_SEARCHES = [
  { region: "japan", terms: ["Waldorf"], sources: ["yahoo-auctions", "digimart", "reverb"] },
  { region: "japan", terms: ["Roland Juno 106"], sources: ["yahoo-auctions", "mercari", "digimart"] },
  { region: "japan", terms: ["drum machine"], sources: ["yahoo-auctions", "digimart", "offmall"] },
  { region: "bay-area", terms: ["synthesizer"], sources: ["reverb-us", "ebay-us"] },
  { region: "los-angeles", terms: ["Waldorf"], sources: ["reverb-us", "ebay-us"] },
];

const baseUrl = normalizeBaseUrl(process.env.BRRTZ_QA_BASE_URL || DEFAULT_BASE_URL);
const minResults = Number(process.env.BRRTZ_QA_MIN_RESULTS || 0);
const requestedRegion = process.env.BRRTZ_QA_REGION || "";
const requestedSources = splitEnvList(process.env.BRRTZ_QA_SOURCES || "");
const onlyQuery = process.env.BRRTZ_QA_QUERY || "";

const checks = GOLDEN_SEARCHES
  .filter((check) => !requestedRegion || check.region === requestedRegion)
  .filter((check) => !onlyQuery || check.terms.join(" ").toLocaleLowerCase().includes(onlyQuery.toLocaleLowerCase()))
  .map((check) => ({
    ...check,
    sources: requestedSources.length ? requestedSources : check.sources,
  }));

if (!checks.length) {
  console.error("No golden checks matched the current filters.");
  process.exit(1);
}

let failures = 0;

for (const check of checks) {
  const url = new URL("/api/search", baseUrl);
  url.searchParams.set("region", check.region);
  url.searchParams.set("terms", check.terms.join("\n"));
  url.searchParams.set("sources", check.sources.join(","));
  url.searchParams.set("categoryIntent", "synthesizers");

  const startedAt = Date.now();
  try {
    const response = await fetch(url);
    const elapsedMs = Date.now() - startedAt;
    if (!response.ok) {
      failures += 1;
      console.error(`FAIL ${labelCheck(check)} -> HTTP ${response.status} (${elapsedMs}ms)`);
      continue;
    }

    const payload = await response.json();
    const listings = Array.isArray(payload.listings) ? payload.listings : [];
    const sourceSummary = summarizeSources(payload.meta?.sourceStats || []);
    const status = listings.length >= minResults ? "PASS" : "WARN";
    if (status === "WARN" && minResults > 0) failures += 1;

    console.log(`${status} ${labelCheck(check)} -> ${listings.length} listings (${elapsedMs}ms) ${sourceSummary}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${labelCheck(check)} -> ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

if (failures > 0) {
  console.error(`${failures} golden search check(s) failed.`);
  process.exit(1);
}

function labelCheck(check) {
  return `${check.region} / ${check.terms.join(" + ")} / ${check.sources.join(",")}`;
}

function summarizeSources(sourceStats) {
  if (!sourceStats.length) return "";
  return sourceStats
    .map((stat) => {
      const count = Number(stat.count || 0);
      const suffix = stat.error ? "!" : "";
      return `${stat.source}:${count}${suffix}`;
    })
    .join(" ");
}

function splitEnvList(value) {
  return String(value)
    .split(/[,\n]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeBaseUrl(value) {
  return String(value).replace(/\/+$/, "");
}
