export async function runSourceHealthAgent({ sources, checkSource }) {
  const logs = [];

  for (const source of sources) {
    const startedAt = Date.now();
    try {
      const result = await checkSource(source);
      const responseTimeMs = Date.now() - startedAt;
      const listingsFound = Number(result?.listingsFound || 0);
      const status = deriveHealthStatus({
        listingsFound,
        errorMessage: result?.errorMessage,
        sourceStatus: source.status,
      });

      logs.push(createHealthLog({
        source,
        status,
        responseTimeMs,
        listingsFound,
        errorMessage: result?.errorMessage || null,
      }));
    } catch (error) {
      logs.push(createHealthLog({
        source,
        status: "broken",
        responseTimeMs: Date.now() - startedAt,
        listingsFound: 0,
        errorMessage: error instanceof Error ? error.message : "Unknown source health error",
      }));
    }
  }

  return {
    checkedAt: new Date().toISOString(),
    logs,
    summary: summarizeHealthLogs(logs),
  };
}

export function deriveHealthStatus({ listingsFound, errorMessage, sourceStatus }) {
  if (sourceStatus === "paused") return "paused";
  if (errorMessage) return "broken";
  if (listingsFound > 0) return "healthy";
  return "stale";
}

export function summarizeHealthLogs(logs) {
  return logs.reduce((summary, log) => {
    summary.total += 1;
    summary[log.status] = (summary[log.status] || 0) + 1;
    return summary;
  }, { total: 0 });
}

function createHealthLog({ source, status, responseTimeMs, listingsFound, errorMessage }) {
  return {
    id: `health_${source.id}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
    sourceId: source.id,
    regionId: source.regionId,
    status,
    responseTimeMs,
    listingsFound,
    errorMessage,
    checkedAt: new Date().toISOString(),
  };
}
