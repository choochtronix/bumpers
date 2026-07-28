// Shared Supabase session helpers for the browser app and tests.
// Cached JWT claims are display-only; server authorization still validates the token.

function normalizeAuthUser(rawUser = {}) {
  const id = String(rawUser?.id || rawUser?.sub || "").trim();
  const email = String(rawUser?.email || "").trim();
  if (!id && !email) return null;
  return { id, email };
}

function readAuthUserFromAccessToken(accessToken = "") {
  try {
    const payloadPart = String(accessToken).split(".")[1];
    if (!payloadPart) return null;
    const normalized = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(globalThis.atob(padded));
    return normalizeAuthUser(payload);
  } catch {
    return null;
  }
}

function normalizeAuthSession(rawSession, options = {}) {
  const session = rawSession?.session || rawSession;
  if (!session?.access_token) return null;
  const now = Number(options.now || Date.now());
  const expiresAt = Number(session.expires_at)
    || Math.floor(now / 1000) + Number(session.expires_in || 3600);

  return {
    access_token: session.access_token,
    refresh_token: session.refresh_token || "",
    expires_at: expiresAt,
    token_type: session.token_type || "bearer",
    user: normalizeAuthUser(session.user) || readAuthUserFromAccessToken(session.access_token),
  };
}

function shouldRefreshAuthSession(session, options = {}) {
  if (!session?.refresh_token) return false;
  if (options.force) return true;
  const now = Number(options.now || Date.now());
  const leewayMs = Number(options.leewayMs || 120_000);
  return Number(session.expires_at || 0) * 1000 <= now + leewayMs;
}

function getAuthRefreshDelay(session, options = {}) {
  if (!session?.refresh_token) return -1;
  const now = Number(options.now || Date.now());
  const leewayMs = Number(options.leewayMs || 120_000);
  const minimumMs = Number(options.minimumMs || 5_000);
  const maximumMs = Number(options.maximumMs || 2_147_000_000);
  const desiredDelay = Number(session.expires_at || 0) * 1000 - now - leewayMs;
  return Math.min(maximumMs, Math.max(minimumMs, desiredDelay));
}

function isPermanentAuthFailure(status, payload = {}) {
  if (Number(status) === 401) return true;
  if (Number(status) !== 400) return false;
  const code = String(payload?.error_code || payload?.code || payload?.error || "").toLowerCase();
  const message = String(payload?.msg || payload?.message || payload?.error_description || "").toLowerCase();
  return /invalid.?grant|invalid.?token|refresh.?token|session.?not.?found|bad.?jwt/.test(`${code} ${message}`);
}

function shouldDiscardAuthSession(source = "", options = {}) {
  return source === "supabase-auth" && Boolean(options.permanent);
}

globalThis.BrrtzAuthSession = {
  getAuthRefreshDelay,
  isPermanentAuthFailure,
  normalizeAuthSession,
  normalizeAuthUser,
  readAuthUserFromAccessToken,
  shouldDiscardAuthSession,
  shouldRefreshAuthSession,
};
