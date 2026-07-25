import assert from "node:assert/strict";
import { createServer } from "node:http";
import { after, before, test } from "node:test";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { createBrrtzMcpHandler } from "../src/mcp/brrtzMcpServer.js";

let baseUrl;
let httpServer;
let client;

before(async () => {
  const handler = createBrrtzMcpHandler({
    searchGear: async (input) => ({
      listings: [{
        id: "test-minimoog",
        source: input.sources[0],
        title: "Moog Minimoog Model D",
        price: 750000,
        condition: "Used",
        listedAt: "2026-07-25T00:00:00.000Z",
        url: "https://example.com/minimoog",
        image: "https://example.com/minimoog.jpg",
        normalized: {
          regionId: input.region,
          priceCurrency: input.region === "japan" ? "JPY" : "USD",
          brand: "Moog",
          model: "Minimoog Model D",
          category: "synth",
          qualityScore: 94,
          noiseScore: 4,
        },
      }],
      meta: {
        searchedAt: "2026-07-25T00:00:01.000Z",
        errors: [],
      },
    }),
  });

  httpServer = createServer(async (request, response) => {
    if (new URL(request.url, "http://localhost").pathname !== "/mcp") {
      response.writeHead(404).end();
      return;
    }
    await handler(request, response);
  });
  await new Promise((resolve) => httpServer.listen(0, "127.0.0.1", resolve));
  const address = httpServer.address();
  baseUrl = `http://127.0.0.1:${address.port}/mcp`;

  client = new Client({ name: "brrtz-mcp-test", version: "1.0.0" });
  await client.connect(new StreamableHTTPClientTransport(new URL(baseUrl)));
});

after(async () => {
  await client?.close();
  await new Promise((resolve) => httpServer?.close(resolve));
});

test("MCP advertises only the public read-only beta tools", async () => {
  const result = await client.listTools();
  assert.deepEqual(
    result.tools.map((tool) => tool.name).sort(),
    ["get_regions", "get_sources", "search_gear"],
  );
  for (const tool of result.tools) {
    assert.equal(tool.annotations?.readOnlyHint, true);
    assert.equal(tool.annotations?.destructiveHint, false);
  }
});

test("get_regions returns public region metadata", async () => {
  const result = await client.callTool({ name: "get_regions", arguments: {} });
  assert.equal(result.isError, undefined);
  assert.equal(result.structuredContent.regions.length, 5);
  assert(result.structuredContent.regions.some((region) => region.id === "uk" && region.currency === "GBP"));
});

test("get_sources filters source coverage by region", async () => {
  const result = await client.callTool({
    name: "get_sources",
    arguments: { region: "uk" },
  });
  assert.equal(result.isError, undefined);
  assert.deepEqual(
    result.structuredContent.sources.map((source) => source.id).sort(),
    ["ebay-uk", "reverb-uk"],
  );
});

test("search_gear returns normalized listings and an openable Brrtz URL", async () => {
  const result = await client.callTool({
    name: "search_gear",
    arguments: {
      terms: ["Moog", "Minimoog"],
      region: "japan",
      category: "synthesizers",
      sources: ["yahoo-auctions"],
      limit: 10,
    },
  });
  assert.equal(result.isError, undefined);
  assert.equal(result.structuredContent.resultCount, 1);
  assert.equal(result.structuredContent.listings[0].currency, "JPY");
  assert.equal(result.structuredContent.listings[0].url, "https://example.com/minimoog");
  assert.match(result.structuredContent.searchUrl, /^https:\/\/brrtz\.com\/search\?/);
});

test("search_gear rejects sources outside the selected region", async () => {
  const result = await client.callTool({
    name: "search_gear",
    arguments: {
      terms: ["Moog"],
      region: "uk",
      sources: ["yahoo-auctions"],
    },
  });
  assert.equal(result.isError, true);
  assert.match(result.content[0].text, /not available in UK/);
});
