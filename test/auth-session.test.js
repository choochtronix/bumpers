import { test } from "node:test";
import assert from "node:assert/strict";

import "../auth-session.js";

const {
  getAuthRefreshDelay,
  isPermanentAuthFailure,
  normalizeAuthSession,
  readAuthUserFromAccessToken,
  shouldRefreshAuthSession,
} = globalThis.BrrtzAuthSession;

function createUnsignedToken(payload) {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.`;
}

test("normalizes and retains the refresh token and cached user", () => {
  const session = normalizeAuthSession({
    access_token: createUnsignedToken({ sub: "user-1", email: "beta@brrtz.com" }),
    refresh_token: "refresh-1",
    expires_in: 3600,
  }, { now: 1_000_000 });

  assert.equal(session.refresh_token, "refresh-1");
  assert.equal(session.expires_at, 4600);
  assert.deepEqual(session.user, { id: "user-1", email: "beta@brrtz.com" });
});

test("reads cached display identity from an access token", () => {
  const token = createUnsignedToken({ sub: "user-2", email: "saved@brrtz.com" });
  assert.deepEqual(readAuthUserFromAccessToken(token), {
    id: "user-2",
    email: "saved@brrtz.com",
  });
});

test("refreshes shortly before expiry and calculates one timer", () => {
  const session = { refresh_token: "refresh", expires_at: 500 };
  assert.equal(shouldRefreshAuthSession(session, { now: 300_000, leewayMs: 120_000 }), false);
  assert.equal(shouldRefreshAuthSession(session, { now: 390_000, leewayMs: 120_000 }), true);
  assert.equal(getAuthRefreshDelay(session, { now: 300_000, leewayMs: 120_000 }), 80_000);
});

test("distinguishes revoked sessions from temporary service failures", () => {
  assert.equal(isPermanentAuthFailure(401, {}), true);
  assert.equal(isPermanentAuthFailure(400, { error_code: "refresh_token_not_found" }), true);
  assert.equal(isPermanentAuthFailure(429, { message: "rate limited" }), false);
  assert.equal(isPermanentAuthFailure(503, { message: "temporarily unavailable" }), false);
});
