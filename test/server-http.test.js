import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

test("real HTTP routing blocks private files, rejects old cloud writes and validates alert limits", async (t) => {
  const reservation = createServer();
  await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const data = await mkdtemp(join(tmpdir(), "brrtz-http-"));
  const child = spawn(process.execPath, ["server.js"], {
    cwd: fileURLToPath(new URL("..", import.meta.url)), stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, HOST: "127.0.0.1", PORT: String(port), BRRTZ_DATA_DIR: data,
      BUMPERS_CLOUD_PROVIDER: "file", SUPABASE_URL: "", SUPABASE_ANON_KEY: "", SUPABASE_SERVICE_ROLE_KEY: "",
      BUMPERS_JOB_TOKEN: "fixture-job-only", BRRTZ_INDEX_SCHEDULER: "false", RESEND_API_KEY: "" },
  });
  t.after(async () => {
    const stopped = child.exitCode !== null ? Promise.resolve() : new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM"); await stopped; await rm(data, { recursive: true });
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Fixture server did not start")), 10_000);
    child.stdout.on("data", (chunk) => { if (chunk.toString().includes("Brrtz running")) { clearTimeout(timer); resolve(); } });
    child.once("exit", () => { clearTimeout(timer); reject(new Error("Fixture server exited")); });
  });
  const url = `http://127.0.0.1:${port}`;
  for (const path of ["/.env.local", "/.git/config", "/server.js", "/package.json", "/data/cloud-saved-searches.json", "/ops/curation/noise-inbox.jsonl"]) {
    assert.equal((await fetch(url + path, { method: "HEAD" })).status, 404, path);
  }
  for (const path of ["/", "/settings", "/gear", "/gear/moog-minimoog", "/sources", "/regions/uk", "/account-storage.js"]) assert.equal((await fetch(url + path)).status, 200, path);
  assert.equal((await fetch(url + "/api/search?region=uk&sources=mercari&terms=Moog")).status, 400);
  assert.equal((await fetch(url + "/api/cloud/saved-searches", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ profiles: [] }) })).status, 409);
  const write = (revision, profiles, deletedIds = []) => fetch(url + "/api/cloud/saved-searches", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify({ syncProtocol: 1, revision, profiles, deletedIds }) });
  const profile = { id: "fixture", name: "Moog", terms: ["Moog"] };
  assert.equal((await write(0, [profile])).status, 200);
  assert.equal((await write(0, [])).status, 409);
  assert.equal((await write(1, [], [profile.id])).status, 200);
  const after = await (await write(2, [profile])).json(); assert.ok(after.profiles[0].deletedAt);
  const headers = { authorization: "Bearer fixture-job-only" };
  assert.equal((await fetch(url + "/api/jobs/saved-search-alerts?limit=-1", { headers })).status, 400);
  const job = await (await fetch(url + "/api/jobs/saved-search-alerts?dryRun=true", { headers })).json();
  assert.equal(job.ok, true); assert.equal(job.dryRun, true);
  const asset = await fetch(url + "/app.js"); assert.equal(asset.headers.get("content-encoding"), "gzip");
  assert.equal(asset.headers.get("x-frame-options"), "DENY"); assert.ok(asset.headers.get("etag"));
});
