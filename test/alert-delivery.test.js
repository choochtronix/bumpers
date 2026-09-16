import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { deliverAlertProfile, parseAlertLimit, alertInterval } from "../src/alerts/delivery.js";
import { serverFunctions } from "./helpers/server-functions.js";

test("alert limits distinguish omitted, zero, configured and invalid values", () => {
  assert.equal(parseAlertLimit(null, 25), 25); assert.equal(parseAlertLimit("0"), 0);
  assert.equal(parseAlertLimit(undefined, 12), 12); assert.equal(parseAlertLimit("2"), 2);
  for (const input of ["no", "-1", "2.3", "101"]) assert.throws(() => parseAlertLimit(input));
  assert.equal(alertInterval("daily"), 86_400_000); assert.equal(alertInterval("hourly"), 3_600_000);
});

test("alert baseline, dry-run, failure persistence and delivery retry use one durable idempotency key", async () => {
  const profile = { id: "s", userId: "u", sources: ["yahoo-auctions"], alertMode: "hourly" };
  let state = {}; let listings = [{ id: "old", source: "yahoo-auctions" }];
  const events = new Map(); const delivered = new Set(); const calls = [];
  let fail = false;
  const deps = {
    search: async () => ({ listings, meta: { sourceStats: [{ source: "yahoo-auctions", status: "ok" }] } }),
    events: async () => [...events.values()], event: (_profile, listing) => ({ eventKey: listing.id }),
    recipient: async () => ({ email: "fixture@example.invalid" }), emailConfigured: () => true,
    appendEvents: async (items) => { if (fail && items.length) throw new Error("event write failed"); items.forEach((item) => events.set(item.eventKey, item)); },
    save: async (next) => { state = structuredClone(next); },
    send: async (message) => { calls.push(message.idempotencyKey); delivered.add(message.idempotencyKey); },
  };
  await deliverAlertProfile(profile, state, deps, { dryRun: true });
  assert.deepEqual(state, {}); assert.equal(events.size, 0);
  await deliverAlertProfile(profile, state, deps);
  assert.equal(delivered.size, 0); assert.equal(events.size, 1);
  listings = [...listings, { id: "new", source: "yahoo-auctions" }];
  fail = true;
  await assert.rejects(deliverAlertProfile(profile, state, deps), /event write failed/);
  assert.ok(state.pending); assert.equal(delivered.size, 1);
  fail = false;
  await deliverAlertProfile(profile, state, deps);
  assert.equal(calls.length, 2); assert.equal(calls[0], calls[1]); assert.equal(delivered.size, 1);
  assert.equal(state.pending, null); assert.equal(events.size, 2);
  await assert.rejects(deliverAlertProfile(profile, { pending: { createdAt: "2020-01-01", events: [] } }, deps), /delivery_review_required/);
});

test("PostgreSQL alert claims exclude concurrent workers and schedule fair due batches", async (t) => {
  const db = new PGlite(); t.after(() => db.close());
  const doc = await readFile(new URL("../docs/supabase-alpha-cloud-sync.md", import.meta.url), "utf8");
  await db.exec(`create role service_role bypassrls; create role anon; create role authenticated; ${doc.match(/create table if not exists public.saved_searches \([\s\S]*?\n\);/)[0]}
    alter table saved_searches enable row level security; grant all on saved_searches to service_role;`);
  await db.exec(await readFile(new URL("../docs/sql/2026-09-16-alert-delivery.sql", import.meta.url), "utf8"));
  await db.exec("insert into saved_searches(id,user_id,name,alerts_enabled) values('a','user','A',true),('b','user','B',true)");
  await db.exec("set role service_role");
  const query = async (sql, params = []) => (await db.query(sql, params)).rows[0].value;
  assert.equal((await query("select brrtz_due_alert_searches(1) as value"))[0].profile.id, "a");
  assert.deepEqual(await query("select brrtz_claim_alert_search('a','worker-1') as value"), {});
  assert.equal(await query("select brrtz_claim_alert_search('a','worker-2') as value"), null);
  assert.equal((await query("select brrtz_due_alert_searches(1) as value"))[0].profile.id, "b");
  await assert.rejects(query("select brrtz_save_alert_state('a','wrong','{}',true) as value"), /alert_claim_lost/);
  await query("select brrtz_save_alert_state('a','worker-1',$1::jsonb,true) as value", [JSON.stringify({ nextDueAt: new Date(Date.now() + 86_400_000).toISOString() })]);
  assert.equal(await query("select brrtz_claim_alert_search('a','worker-3') as value"), null);
  await db.exec("set role anon");
  await assert.rejects(query("select brrtz_due_alert_searches(1) as value"), /permission denied/);
});

test("actual digest isolates a failed search and persists successful deliveries before continuing", async () => {
  const candidates = ["first", "broken", "third"].map((id) => ({ profile: { id, userId: "fixture", sources: ["yahoo-auctions"] }, state: {} }));
  const stored = new Map(candidates.map(({ profile }) => [profile.id, { baselines: ["yahoo-auctions"] }]));
  const sent = []; const events = [];
  const server = serverFunctions(["runSavedSearchAlertDigest"], {
    parseAlertLimit, deliverAlertProfile, ALERT_SEARCH_LIMIT: 25, ALERT_LISTING_LIMIT: 8,
    randomUUID: () => "fixture-claim", isSupabaseCloudEnabled: () => true,
    rowToSavedSearchProfile: (profile) => profile, getSavedSearchAlertSearchId: (profile) => profile.id,
    getPositiveInteger: (value) => value, isAlertEmailConfigured: () => true,
    supabaseRequest: async (path, options) => {
      const payload = JSON.parse(options.body);
      if (path.endsWith("brrtz_due_alert_searches")) return candidates;
      if (path.endsWith("brrtz_claim_alert_search")) return stored.get(payload.p_id);
      stored.set(payload.p_id, structuredClone(payload.p_state)); return true;
    },
    fetchSavedSearchAlertResults: async (profile) => {
      if (profile.id === "broken") { assert.equal(events.length, 1); throw new Error("fixture source failed"); }
      return { listings: [{ id: profile.id, source: "yahoo-auctions" }] };
    },
    readSavedSearchAlertEvents: async () => [],
    createSavedSearchAlertEvent: ({ listing }) => ({ eventKey: listing.id }),
    getAlertRecipientForUser: async () => ({ email: "fixture@example.invalid" }),
    appendSavedSearchAlertEvents: async (items) => events.push(...items),
    sendSavedSearchAlertEmail: async (message) => sent.push(message.profile.id),
  });
  const result = await server.runSavedSearchAlertDigest();
  assert.equal(result.ok, false); assert.equal(result.processedSearchCount, 3);
  assert.equal(result.emailedSearchCount, 2); assert.deepEqual(sent, ["first", "third"]);
  assert.equal(stored.get("first").pending, null); assert.equal(events.length, 2);
});
