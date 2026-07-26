const BROWSE_CURSOR_VERSION = 1;
export const BROWSE_MAX_SOURCE_PAGE = 100;

export function normalizeBrowsePage(value, fallback = 1) {
  const page = Number(value);
  if (!Number.isInteger(page) || page < 1) return fallback;
  return Math.min(page, BROWSE_MAX_SOURCE_PAGE);
}

export function getBrowsePageStart(page, pageSize) {
  const normalizedPage = normalizeBrowsePage(page);
  const normalizedPageSize = Math.max(1, Number(pageSize) || 1);
  return ((normalizedPage - 1) * normalizedPageSize) + 1;
}

export function createBrowseCursor({ regionId, categoryIntent, page }) {
  const payload = {
    v: BROWSE_CURSOR_VERSION,
    region: String(regionId || ""),
    category: String(categoryIntent || ""),
    page: normalizeBrowsePage(page),
  };
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

export function parseBrowseCursor(value, expected = {}) {
  if (!value) return { ok: true, state: null };

  try {
    const payload = JSON.parse(Buffer.from(String(value), "base64url").toString("utf8"));
    const page = normalizeBrowsePage(payload?.page, 0);
    const valid = payload?.v === BROWSE_CURSOR_VERSION
      && payload?.region === String(expected.regionId || "")
      && payload?.category === String(expected.categoryIntent || "")
      && page >= 2;

    if (!valid) return { ok: false, state: null };
    return {
      ok: true,
      state: {
        regionId: payload.region,
        categoryIntent: payload.category,
        page,
      },
    };
  } catch {
    return { ok: false, state: null };
  }
}

export function getNextBrowsePageState({ page, resultCount, pageSize }) {
  const normalizedPage = normalizeBrowsePage(page);
  const normalizedPageSize = Math.max(1, Number(pageSize) || 1);
  const hasMore = Number(resultCount) >= normalizedPageSize
    && normalizedPage < BROWSE_MAX_SOURCE_PAGE;
  return {
    hasMore,
    nextPage: hasMore ? normalizedPage + 1 : null,
  };
}
