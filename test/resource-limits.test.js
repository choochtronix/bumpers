import test from "node:test";
import assert from "node:assert/strict";
import { BoundedCache, Semaphore, createBoundedFetch, createCoalescer, createPublicRouteGuard } from "../src/http/resourceLimits.js";
import { publicRequestOrigin } from "../src/http/publicFiles.js";
import { attachNormalizedListings } from "../src/agents/listingNormalizerAgent.js";
import { REGIONS, selectRegionSources, groupSourcesByRegion } from "../src/regions/config.js";
import { GEAR_INDEX_REGIONS } from "../src/gear-index/gearIndexCore.js";

test("cache enforces byte/entry budgets and evicts least-recently-used content", () => {
  const cache = new BoundedCache({ maxEntries: 2, maxBytes: 10 });
  cache.set("a", { body: Buffer.alloc(4) }); cache.set("b", { body: Buffer.alloc(4) });
  cache.get("a"); cache.set("c", { body: Buffer.alloc(4) });
  assert.equal(cache.has("b"), false); assert.equal(cache.bytes, 8);
  cache.set("large", { body: Buffer.alloc(11) }); assert.equal(cache.has("large"), false);
  cache.clear(); assert.equal(cache.bytes, 0);
});

test("bounded fetch rejects oversized upstream bodies", async () => {
  const fetch = createBoundedFetch(async () => new Response("123456"), { maxBytes: 5 });
  await assert.rejects(fetch("https://fixture.invalid"), /size limit/);
});

test("queue cancellation releases waiters and cannot exceed capacity", async () => {
  const slots = new Semaphore(1, 1); const release = await slots.acquire();
  const controller = new AbortController(); const queued = slots.acquire(controller.signal);
  await assert.rejects(slots.acquire(), /capacity/);
  controller.abort(); await assert.rejects(queued);
  release(); assert.equal(slots.active, 0); assert.equal(slots.queue.length, 0);
});

test("coalescing shares work but one canceled caller cannot cancel another", async () => {
  const coalesce = createCoalescer(); let finish; let calls = 0;
  const work = () => { calls++; return new Promise((resolve) => { finish = resolve; }); };
  const controller = new AbortController();
  const first = coalesce("same", work, controller.signal); const second = coalesce("same", work);
  await Promise.resolve(); controller.abort(); await assert.rejects(first);
  finish("ok"); assert.equal(await second, "ok"); assert.equal(calls, 1);
});

test("public budgets return Retry-After and reject oversized search inputs", () => {
  const guard = createPublicRouteGuard();
  const request = { method: "POST", headers: {}, socket: { remoteAddress: "fixture" } };
  const response = { writeHead(status, headers) { this.status = status; this.headers = headers; }, end() {} };
  const url = new URL("http://fixture/api/curation/noise");
  for (let i = 0; i < 20; i++) assert.equal(guard(request, response, url), true);
  assert.equal(guard(request, response, url), false); assert.equal(response.status, 429); assert.ok(response.headers["Retry-After"]);
  request.method = "GET";
  assert.equal(guard(request, response, new URL(`http://fixture/api/search?terms=${"x".repeat(9000)}`)), false);
  assert.equal(response.status, 400);
});

test("forwarded host cannot control an authentication redirect", () => {
  assert.equal(publicRequestOrigin({ headers: { host: "brrtz.com", "x-forwarded-host": "evil.invalid" } }), "https://brrtz.com");
  assert.equal(publicRequestOrigin({ headers: { host: "127.0.0.1:5173" } }), "http://127.0.0.1:5173");
  assert.equal(publicRequestOrigin({ headers: { host: "evil.invalid" } }), "https://brrtz.com");
  for (const host of ["127.evil.invalid", "192.168.1.evil.invalid", "100.64.evil.invalid"]) {
    assert.equal(publicRequestOrigin({ headers: { host } }), "https://brrtz.com");
  }
});

test("every configured source receives top-level provenance from the shared region configuration", () => {
  for (const region of REGIONS) {
    assert.deepEqual(selectRegionSources(region.id), region.sources);
    for (const source of region.sources) {
      const [listing] = attachNormalizedListings([{ id: source, source, title: "Moog synthesizer", price: 100 }], { regionId: region.id });
      assert.equal(listing.region, region.id); assert.equal(listing.currency, region.currency);
      assert.equal(listing.normalized.priceCurrency, listing.currency);
    }
  }
  assert.throws(() => selectRegionSources("japan", ["ebay-uk"]));
  const [japan] = attachNormalizedListings([{ source: "mercari", price: 155000 }], { regionId: "bay-area", currency: "USD" });
  assert.equal(japan.currency, "JPY"); assert.equal(japan.region, "japan");
});

test("national Gear Index batches retain every configured source", () => {
  for (const index of GEAR_INDEX_REGIONS) {
    const groups = groupSourcesByRegion(index.sources, index.searchRegion);
    assert.deepEqual(groups.flatMap((group) => group.sources).sort(), [...index.sources].sort());
    groups.forEach((group) => assert.deepEqual(selectRegionSources(group.region, group.sources), group.sources));
  }
});
