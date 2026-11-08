import test from "node:test";
import assert from "node:assert/strict";

import {
  classifyMercariConnectorFailure,
  createMercariDiagnostics,
} from "../src/connectors/mercariDiagnostics.js";

test("Mercari diagnostics reveal a direct failure followed by browser recovery", () => {
  let currentTime = 1_800_000_000_000;
  const diagnostics = createMercariDiagnostics({ now: () => currentTime });

  diagnostics.recordAttempt({
    mode: "direct-api",
    startedAt: currentTime - 6000,
    ok: false,
    failureType: "timeout",
  });
  currentTime += 10_500;
  diagnostics.recordAttempt({
    mode: "browser-fallback",
    startedAt: currentTime - 10_500,
    ok: true,
  });

  const snapshot = diagnostics.snapshot();
  assert.equal(snapshot.preferredMode, "direct-api");
  assert.equal(snapshot.activeMode, "browser-fallback");
  assert.equal(snapshot.degraded, true);
  assert.equal(snapshot.direct.failures, 1);
  assert.equal(snapshot.direct.lastFailureType, "timeout");
  assert.equal(snapshot.browser.successes, 1);
  assert.equal(snapshot.browser.lastDurationMs, 10_500);
});

test("Mercari diagnostics preserve cache origin and recover after direct success", () => {
  let currentTime = 1_800_000_000_000;
  const diagnostics = createMercariDiagnostics({ now: () => currentTime });

  diagnostics.recordAttempt({
    mode: "direct-api",
    startedAt: currentTime - 850,
    ok: true,
  });
  currentTime += 25;
  diagnostics.recordCacheHit("direct-api");

  const snapshot = diagnostics.snapshot();
  assert.equal(snapshot.activeMode, "cache");
  assert.equal(snapshot.lastCacheOriginMode, "direct-api");
  assert.equal(snapshot.cacheHits, 1);
  assert.equal(snapshot.degraded, false);
  assert.equal(snapshot.direct.successes, 1);
  assert.equal(snapshot.direct.lastDurationMs, 850);
});

test("Mercari browser-only mode reports failures as degraded", () => {
  const currentTime = 1_800_000_000_000;
  const diagnostics = createMercariDiagnostics({
    directApiEnabled: false,
    now: () => currentTime,
  });

  diagnostics.recordAttempt({
    mode: "browser-only",
    startedAt: currentTime - 20_000,
    ok: false,
    failureType: "blocked",
  });

  const snapshot = diagnostics.snapshot();
  assert.equal(snapshot.preferredMode, "browser-only");
  assert.equal(snapshot.activeMode, "browser-only");
  assert.equal(snapshot.degraded, true);
  assert.equal(snapshot.browser.failures, 1);
  assert.equal(snapshot.browser.lastFailureType, "blocked");
});

test("Mercari failure classification is sanitized for health output", () => {
  assert.equal(classifyMercariConnectorFailure(new Error("request timed out after 6000ms")), "timeout");
  assert.equal(classifyMercariConnectorFailure(new Error("Mercari responded with 403")), "blocked");
  assert.equal(classifyMercariConnectorFailure(new Error("Mercari responded with 429")), "rate_limited");
  assert.equal(classifyMercariConnectorFailure(new Error("Mercari responded with 503")), "upstream_error");
  assert.equal(classifyMercariConnectorFailure(new Error("unexpected response shape")), "invalid_response");
  assert.equal(classifyMercariConnectorFailure(new Error("socket closed")), "network_error");
});
