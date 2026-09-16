import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, symlink, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { servePublicFile, setSecurityHeaders } from "../src/http/publicFiles.js";

test("public files deny repository/runtime secrets and symlinks; assets revalidate and compress", async (t) => {
  const root = await mkdtemp(join(tmpdir(), "brrtz-public-"));
  await mkdir(join(root, "assets"));
  await writeFile(join(root, "index.html"), "<h1>Brrtz</h1>".repeat(500));
  await writeFile(join(root, ".env.local"), "FAKE_SECRET=test-only");
  await writeFile(join(root, "server.js"), "private source");
  await symlink(join(root, ".env.local"), join(root, "assets", "leak.svg"));
  const server = createServer((request, response) => {
    setSecurityHeaders(request, response);
    void servePublicFile({ root, pathname: request.url, request, response });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => { await new Promise((resolve) => server.close(resolve)); await rm(root, { recursive: true }); });
  const url = `http://127.0.0.1:${server.address().port}`;
  for (const path of ["/.env.local", "/%2eenv.local", "/.git/config", "/server.js", "/data/test.json", "/ops/test.svg", "/node_modules/test.js", "/assets/leak.svg"]) {
    assert.equal((await fetch(url + path)).status, 404, path);
  }
  const response = await fetch(url + "/index.html");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-encoding"), "gzip");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal((await fetch(url + "/index.html", { headers: { "If-None-Match": response.headers.get("etag") } })).status, 304);
  assert.equal((await fetch(url + "/index.html", { method: "HEAD" })).status, 200);
  assert.equal((await fetch(url + "/index.html", { method: "POST" })).status, 405);
});
