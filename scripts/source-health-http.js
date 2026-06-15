const DEFAULT_BASE_URL = "http://127.0.0.1:5173";

const baseUrl = normalizeBaseUrl(process.env.BRRTZ_QA_BASE_URL || DEFAULT_BASE_URL);
const jobToken = process.env.BUMPERS_JOB_TOKEN || process.env.BRRTZ_JOB_TOKEN || "";
const requestedRegion = process.env.BRRTZ_QA_REGION || "";
const requestedSources = process.env.BRRTZ_QA_SOURCES || "";

const url = new URL("/api/jobs/source-health", baseUrl);
if (requestedRegion) url.searchParams.set("region", requestedRegion);
if (requestedSources) url.searchParams.set("sources", splitEnvList(requestedSources).join("|"));

const headers = jobToken ? { authorization: `Bearer ${jobToken}` } : {};
const response = await fetch(url, { method: "POST", headers });

if (!response.ok) {
  const body = await response.text().catch(() => "");
  console.error(`Source health check failed: HTTP ${response.status}${body ? ` ${body.slice(0, 200)}` : ""}`);
  process.exit(1);
}

const payload = await response.json();
const logs = Array.isArray(payload.logs) ? payload.logs : [];
const summary = logs.reduce((acc, log) => {
  acc[log.status] = (acc[log.status] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({
  baseUrl,
  region: requestedRegion || "japan",
  sourceCount: payload.sourceCount,
  summary,
  logs: logs.map((log) => ({
    sourceId: log.sourceId,
    status: log.status,
    listingsFound: log.listingsFound,
    responseTimeMs: log.responseTimeMs,
    errorMessage: log.errorMessage || null,
  })),
}, null, 2));

function normalizeBaseUrl(value) {
  return String(value).replace(/\/+$/, "");
}

function splitEnvList(value) {
  return String(value)
    .split(/[,\n|]/)
    .map((part) => part.trim())
    .filter(Boolean);
}
