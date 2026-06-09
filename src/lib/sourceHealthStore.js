import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

export async function readSourceHealthState(filePath) {
  try {
    return JSON.parse(await readFile(filePath, "utf8"));
  } catch {
    return {
      sources: {},
      logs: [],
      updatedAt: null,
    };
  }
}

export async function writeSourceHealthState(filePath, state) {
  await mkdir(dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify({
    ...state,
    updatedAt: new Date().toISOString(),
  }, null, 2));
}

export async function appendSourceHealthLogs(filePath, logs, { maxLogs = 500 } = {}) {
  const state = await readSourceHealthState(filePath);
  const sources = { ...state.sources };

  for (const log of logs) {
    sources[log.sourceId] = {
      sourceId: log.sourceId,
      status: log.status,
      responseTimeMs: log.responseTimeMs,
      listingsFound: log.listingsFound,
      errorMessage: log.errorMessage || null,
      lastCheckedAt: log.checkedAt,
      lastSuccessfulFetchAt: log.status === "healthy" ? log.checkedAt : sources[log.sourceId]?.lastSuccessfulFetchAt || null,
    };
  }

  const nextState = {
    sources,
    logs: [...logs, ...(state.logs || [])].slice(0, maxLogs),
  };

  await writeSourceHealthState(filePath, nextState);
  return nextState;
}
