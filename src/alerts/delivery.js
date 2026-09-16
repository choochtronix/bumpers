import { randomUUID } from "node:crypto";

export function parseAlertLimit(value, fallback = 25) {
  if (value === null || value === undefined || value === "") return Math.floor(Math.min(100, Math.max(1, Number(fallback) || 25)));
  if (!/^\d+$/.test(String(value)) || Number(value) > 100) throw new Error("limit must be an integer between 0 and 100");
  return Number(value);
}

export function alertInterval(mode) { return mode === "daily" ? 86_400_000 : mode === "hourly" ? 3_600_000 : 300_000; }

export async function deliverAlertProfile(profile, state, deps, { dryRun = false, listingLimit = 8 } = {}) {
  let pending = state.pending;
  let nextState = { ...state };
  let baselineEvents = [];
  if (!pending) {
    const result = await deps.search(profile);
    const listings = [...new Map((result.listings || []).map((listing) => [listing.id || listing.url, listing])).values()];
    const keys = new Set((await deps.events(profile)).map((event) => event.eventKey));
    const baselines = new Set(state.baselines || []);
    const successfulSources = result.meta?.sourceStats?.filter((item) => item.status === "ok").map((item) => item.source)
      || (result.meta?.errors?.length ? [] : profile.sources);
    const newListings = listings.filter((listing) => {
      const sourceDate = Date.parse(listing.listedAt || "");
      return baselines.has(listing.source) && !keys.has(deps.event(profile, listing, null).eventKey)
        && (!Number.isFinite(sourceDate) || (sourceDate <= Date.now() + 300_000 && Date.now() - sourceDate <= 7 * 86_400_000));
    });
    baselineEvents = listings.filter((listing) => !baselines.has(listing.source)).map((listing) => deps.event(profile, listing, null));
    nextState.baselines = [...new Set([...baselines, ...successfulSources])];
    if (newListings.length) {
      const recipient = await deps.recipient(profile.userId);
      if (!recipient.email || !deps.emailConfigured()) {
        if (!dryRun) await deps.save({ ...state, nextDueAt: new Date(Date.now() + 300_000).toISOString() }, true);
        return { newCount: newListings.length, emailSent: false, emailSkippedReason: "email_not_configured" };
      }
      pending = {
        key: randomUUID(), createdAt: new Date().toISOString(),
        message: { profile, recipient, listings: newListings.slice(0, listingLimit), totalNewCount: newListings.length },
        events: newListings.map((listing) => deps.event(profile, listing, new Date().toISOString())),
      };
    }
    if (dryRun) return { newCount: newListings.length, emailSent: false, emailSkippedReason: "dry_run", state };
    await deps.appendEvents(baselineEvents);
    nextState = { ...nextState, pending: pending || null };
    await deps.save(nextState, false);
  }
  if (dryRun) return { newCount: pending?.events.length || 0, emailSent: false, emailSkippedReason: "dry_run", state };
  if (pending) {
    // Resend deduplicates for 24 hours. Never blindly re-send an ambiguous older delivery.
    if (Date.now() - Date.parse(pending.createdAt) >= 23 * 3_600_000) throw new Error("delivery_review_required");
    await deps.send({ ...pending.message, idempotencyKey: pending.key });
    await deps.appendEvents(pending.events);
  }
  await deps.save({ ...nextState, pending: null, nextDueAt: new Date(Date.now() + alertInterval(profile.alertMode)).toISOString() }, true);
  return { newCount: pending?.events.length || 0, emailSent: Boolean(pending), emailSkippedReason: pending ? "" : "no_new_listings" };
}
