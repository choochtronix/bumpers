import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { serverFunctions } from "./helpers/server-functions.js";

function browserHeaders(key) {
  const source = readFileSync(new URL("../app.js", import.meta.url), "utf8");
  const context = vm.createContext({ authState: { config: { anonKey: key } } });
  for (const name of ["getSupabaseAnonHeaders", "getSupabaseAuthHeaders"]) {
    const match = source.match(new RegExp(`^function ${name}\\([^]*?^\\}`, "m"));
    assert.ok(match, name);
    vm.runInContext(match[0], context);
  }
  return context;
}

for (const key of ["sb_secret_fixture_only", "legacy.fixture.jwt"]) {
  test(`backend API key compatibility: ${key.startsWith("sb_") ? "opaque" : "legacy"}`, async () => {
    const calls = [];
    const context = serverFunctions(["supabaseRequest"], {
      SUPABASE_URL: "https://fixture.invalid/", SUPABASE_SERVICE_ROLE_KEY: key,
      fetch: async (url, options) => {
        calls.push({ url, options });
        return { ok: true, status: 200, text: async () => '[{"id":1}]' };
      },
    });
    const result = await context.supabaseRequest("/rest/v1/rpc/brrtz_sync_saved_searches", {
      method: "POST", headers: { prefer: "return=representation" }, body: "{}",
    });
    assert.equal(result[0].id, 1);
    assert.equal(calls[0].url, "https://fixture.invalid/rest/v1/rpc/brrtz_sync_saved_searches");
    assert.equal(calls[0].options.headers.apikey, key);
    assert.equal(calls[0].options.headers.authorization, key.startsWith("sb_") ? undefined : `Bearer ${key}`);
    assert.equal(calls[0].options.headers.prefer, "return=representation");
    assert.equal(calls[0].options.body, "{}");
    context.fetch = async () => ({ ok: true, status: 204 });
    assert.equal(await context.supabaseRequest("/rest/v1/saved_searches"), null);
    context.fetch = async () => ({ ok: false, status: 401, text: async () => "fixture denied" });
    await assert.rejects(context.supabaseRequest("/rest/v1/user_profiles"), /401: fixture denied/);
  });
}

for (const key of ["sb_publishable_fixture_only", "legacy.fixture.jwt"]) {
  test(`browser key and session headers: ${key.startsWith("sb_") ? "publishable" : "legacy"}`, () => {
    const context = browserHeaders(key);
    assert.equal(context.getSupabaseAnonHeaders().apikey, key);
    assert.equal(context.getSupabaseAnonHeaders().authorization, key.startsWith("sb_") ? undefined : `Bearer ${key}`);
    assert.equal(context.getSupabaseAuthHeaders("fixture.user.jwt").authorization, "Bearer fixture.user.jwt");
    assert.equal(context.getSupabaseAuthHeaders("fixture.user.jwt").apikey, key);
  });
}

test("server verifies genuine user JWT with public API key", async () => {
  let headers;
  const context = serverFunctions(["fetchSupabaseAuthUser"], {
    SUPABASE_URL: "https://fixture.invalid", SUPABASE_ANON_KEY: "sb_publishable_fixture_only",
    CLOUD_PROFILE_NAME: "Fixture", normalizeCloudUser: (user) => user,
    fetch: async (_url, options) => {
      headers = options.headers;
      return { ok: true, json: async () => ({ id: "fixture-user", email: "user@example.invalid" }) };
    },
  });
  assert.equal((await context.fetchSupabaseAuthUser("fixture.user.jwt")).id, "fixture-user");
  assert.equal(headers.apikey, "sb_publishable_fixture_only");
  assert.equal(headers.authorization, "Bearer fixture.user.jwt");
});
