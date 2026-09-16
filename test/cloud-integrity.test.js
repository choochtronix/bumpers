import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";
import { serverFunctions } from "./helpers/server-functions.js";
import { mergeSavedSearchMutation } from "../src/cloud/fileStore.js";
import "../account-storage.js";

const server = serverFunctions(["savedSearchProfileToRow", "rowToSavedSearchProfile", "normalizeArrayField", "normalizeIsoField",
  "normalizeNullableIsoField", "createSupabaseSavedSearchRowId", "stripSupabaseSavedSearchRowId", "normalizePreferences", "sanitizeRegionId"], {
  CLOUD_PROFILE_USER_ID: "fixture", sanitizeCategoryIntent: (value) => value || "synthesizers",
});
const fixture = { id: "search-one", userId: "fixture", name: "LA pedals", terms: ["Moog"], regionId: "los-angeles", categoryIntent: "effects-pedals" };

test("saved search and preference serialization preserve supported criteria", () => {
  const copy = server.rowToSavedSearchProfile(server.savedSearchProfileToRow(fixture));
  assert.equal(copy.regionId, "los-angeles"); assert.equal(copy.categoryIntent, "effects-pedals");
  assert.deepEqual(JSON.parse(JSON.stringify(server.normalizePreferences({ currency: "GBP", resultView: "gallery", gearMode: false }))),
    { currency: "GBP", resultView: "gallery", gearMode: false });
});

test("account migration isolates records and preserves the legacy recovery copy", () => {
  const values = new Map();
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: (key) => values.delete(key) };
  const keys = { profiles: "profiles", watching: "watching", authSession: "auth", cloudSyncMeta: "sync" };
  storage.setItem("profiles", JSON.stringify([{ id: "a", userId: "alice" }, { id: "b", userId: "bob" }]));
  storage.setItem("auth", JSON.stringify({ user: { id: "alice" } }));
  storage.setItem("watching", '["private-alice-watch"]');
  let owner = "alice";
  const scoped = BrrtzAccountStorage.createAccountStorage(storage, keys, () => owner);
  assert.equal(JSON.parse(scoped.getItem("profiles"))[0].id, "a");
  assert.equal(scoped.getItem("watching"), null, "mixed-owner legacy data must not leak to the current session");
  owner = "bob";
  assert.equal(JSON.parse(scoped.getItem("profiles"))[0].id, "b");
  assert.equal(scoped.getItem("watching"), null);
  owner = "guest"; assert.equal(scoped.getItem("profiles"), null);
  assert.equal(JSON.parse(storage.getItem("profiles")).length, 2);
  assert.equal(JSON.parse(storage.getItem("brrtz.accountStorage.v1")).aliases.watching, "legacy-quarantine");
});

test("account migration tolerates malformed profiles and keeps unowned saves in guest storage", () => {
  for (const profiles of [{ broken: true }, [null, { id: "guest-save", userId: "local" }]]) {
    const values = new Map([["profiles", JSON.stringify(profiles)], ["auth", JSON.stringify({ user: { id: "alice" } })]]);
    const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)) };
    let owner = "alice";
    const scoped = BrrtzAccountStorage.createAccountStorage(storage, { profiles: "profiles", authSession: "auth" }, () => owner);
    assert.equal(scoped.getItem("profiles"), null);
    owner = "guest";
    assert.equal(JSON.parse(scoped.getItem("profiles"))?.[0]?.id ?? null, Array.isArray(profiles) ? "guest-save" : null);
    assert.equal(storage.getItem("profiles"), JSON.stringify(profiles));
  }
});

test("file sync rejects stale revisions and never revives deleted IDs", () => {
  const saved = mergeSavedSearchMutation({}, { revision: 0, profiles: [fixture], deletedIds: [] });
  const deleted = mergeSavedSearchMutation(saved, { revision: 1, profiles: [], deletedIds: [fixture.id] });
  assert.equal(mergeSavedSearchMutation(deleted, { revision: 1, profiles: [fixture] }).conflict, true);
  assert.ok(mergeSavedSearchMutation(deleted, { revision: 2, profiles: [fixture] }).profiles[0].deletedAt);
  const repeated = mergeSavedSearchMutation(deleted, { revision: 2, profiles: [], deletedIds: [fixture.id] });
  assert.equal(repeated.profiles[0].deletedAt, deleted.profiles[0].deletedAt);
});

test("JSON body parsing preserves Japanese terms split across network chunks and counts bytes", async () => {
  const server = serverFunctions(["readJsonBody"], { Buffer });
  const text = JSON.stringify({ terms: ["\u30ef\u30eb\u30c9\u30eb\u30d5"] });
  const request = async function* () { for (const byte of Buffer.from(text)) yield Buffer.from([byte]); };
  assert.equal(JSON.stringify(await server.readJsonBody(request())), text);
  await assert.rejects(server.readJsonBody(request(), { maxBytes: text.length }), /too large/);
});

test("account migration binds a large legacy cache without copying it or exposing it after account changes", () => {
  const values = new Map([["profiles", '[{"id":"a","userId":"alice"}]'], ["ledger", "large-cache-fixture"]]);
  const storage = { getItem: (key) => values.get(key) ?? null, setItem: (key, value) => {
    if (value.length > 1000) throw new Error("QuotaExceededError");
    values.set(key, String(value));
  }, removeItem: (key) => values.delete(key) };
  let owner = "alice";
  const keys = { profiles: "profiles", listingLedger: "ledger" };
  const scoped = BrrtzAccountStorage.createAccountStorage(storage, keys, () => owner);
  assert.equal(scoped.getItem("ledger"), "large-cache-fixture");
  assert.equal(storage.getItem("ledger.owner.alice"), null);
  scoped.setItem("ledger", "updated-alice-cache");
  scoped.removeItem("profiles"); assert.equal(scoped.getItem("profiles"), "[]");
  owner = "bob";
  const reloaded = BrrtzAccountStorage.createAccountStorage(storage, keys, () => owner);
  assert.equal(reloaded.getItem("ledger"), null);
  assert.equal(reloaded.getItem("profiles"), null);
  owner = "alice"; assert.equal(reloaded.getItem("ledger"), "updated-alice-cache");
});

test("actual PostgreSQL migration is atomic, owner checked, revision checked and tombstone preserving", async (t) => {
  const db = new PGlite(); t.after(() => db.close());
  const doc = await readFile(new URL("../docs/supabase-alpha-cloud-sync.md", import.meta.url), "utf8");
  const schema = doc.match(/create table if not exists public.saved_searches \([\s\S]*?\n\);/)[0];
  await db.exec(`create role service_role bypassrls; create role anon; create role authenticated; ${schema}
    alter table saved_searches enable row level security; grant all on saved_searches to service_role;`);
  await db.exec(await readFile(new URL("../docs/sql/2026-09-16-saved-search-integrity.sql", import.meta.url), "utf8"));
  await db.exec("set role service_role");
  const sync = async (revision, rows, ids = []) => (await db.query("select brrtz_sync_saved_searches($1, $2, $3::jsonb, $4::text[]) as state",
    ["fixture", revision, rows === null ? null : JSON.stringify(rows), ids])).rows[0].state;
  const row = server.savedSearchProfileToRow(fixture);
  assert.equal((await sync(0, [row])).revision, 1);
  await assert.rejects(sync(1, [{ ...row, name: null }]), /not-null/);
  const afterFailure = await sync(null, null);
  assert.equal(afterFailure.rows.length, 1); assert.equal(afterFailure.revision, 1);
  assert.equal((await sync(0, [])).conflict, true);
  await assert.rejects(sync(1, [{ ...row, user_id: "someone-else" }]), /invalid_owner/);
  const deleted = await sync(1, [], [row.id]); assert.ok(deleted.rows[0].deleted_at);
  const stale = await sync(2, [row]); assert.ok(stale.rows[0].deleted_at);
  const recreated = await sync(3, [{ ...row, id: "fixture:new-id" }]);
  assert.equal(recreated.rows.filter((item) => !item.deleted_at).length, 1);
  await db.exec("set role anon");
  await assert.rejects(sync(null, null), /permission denied/);
});
