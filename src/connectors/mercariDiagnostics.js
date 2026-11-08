const ATTEMPT_MODES = new Set(["direct-api", "browser-fallback", "browser-only"]);

function createAttemptState() {
  return {
    attempts: 0,
    successes: 0,
    failures: 0,
    lastAttemptAt: null,
    lastSuccessAt: null,
    lastFailureAt: null,
    lastDurationMs: null,
    lastFailureType: null,
  };
}

export function classifyMercariConnectorFailure(error) {
  const message = String(error instanceof Error ? error.message : error || "").toLowerCase();
  if (/abort|timeout|timed out/.test(message)) return "timeout";
  if (/401|403|unauthor|forbidden|security verification|cloudflare/.test(message)) return "blocked";
  if (/429|rate limit|too many requests/.test(message)) return "rate_limited";
  if (/\b5\d\d\b|bad gateway|service unavailable/.test(message)) return "upstream_error";
  if (/unexpected response|could not parse|invalid json/.test(message)) return "invalid_response";
  return "network_error";
}

export function createMercariDiagnostics({ directApiEnabled = true, now = Date.now } = {}) {
  const direct = createAttemptState();
  const browser = createAttemptState();
  const state = {
    preferredMode: directApiEnabled ? "direct-api" : "browser-only",
    activeMode: "idle",
    degraded: false,
    lastActivityAt: null,
    cacheHits: 0,
    lastCacheOriginMode: null,
  };

  function recordAttempt({ mode, startedAt, ok, failureType = null }) {
    if (!ATTEMPT_MODES.has(mode)) throw new TypeError(`Unknown Mercari connector mode: ${mode}`);

    const finishedAt = now();
    const group = mode === "direct-api" ? direct : browser;
    const timestamp = new Date(finishedAt).toISOString();
    group.attempts += 1;
    group.lastAttemptAt = timestamp;
    group.lastDurationMs = Math.max(0, Math.round(finishedAt - startedAt));
    state.activeMode = mode;
    state.lastActivityAt = timestamp;

    if (ok) {
      group.successes += 1;
      group.lastSuccessAt = timestamp;
      if (mode === "direct-api" || mode === "browser-only") state.degraded = false;
    } else {
      group.failures += 1;
      group.lastFailureAt = timestamp;
      group.lastFailureType = failureType || "unknown_error";
      if (mode === "direct-api" || mode === "browser-only") state.degraded = true;
    }
  }

  function recordCacheHit(originMode = null) {
    const timestamp = new Date(now()).toISOString();
    state.activeMode = "cache";
    state.lastActivityAt = timestamp;
    state.cacheHits += 1;
    state.lastCacheOriginMode = originMode || null;
  }

  function snapshot() {
    return {
      ...state,
      direct: { ...direct },
      browser: { ...browser },
    };
  }

  return { recordAttempt, recordCacheHit, snapshot };
}
