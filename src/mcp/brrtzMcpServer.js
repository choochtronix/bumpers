import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import * as z from "zod/v4";
import { SOURCE_REGISTRY } from "../sources/sourceRegistry.js";

const REGION_CONFIG = [
  {
    id: "japan",
    label: "Japan",
    currency: "JPY",
    status: "active",
    sources: [
      "mercari",
      "yahoo-auctions",
      "yahoo-fleamarket",
      "rakuma",
      "digimart",
      "qsic",
      "reverb",
      "jimoty",
      "offmall",
      "five-g",
      "implant4",
    ],
  },
  {
    id: "bay-area",
    label: "Bay Area",
    currency: "USD",
    status: "beta",
    sources: [
      "robotspeak",
      "mission-synths",
      "starving-musician",
      "bananas-at-large",
      "gelb-music",
      "craigslist-sfbay",
      "reverb-us",
      "ebay-us",
      "sweetwater-used",
      "guitar-center-used",
    ],
  },
  {
    id: "los-angeles",
    label: "Los Angeles",
    currency: "USD",
    status: "beta",
    sources: [
      "craigslist-la",
      "reverb-us",
      "ebay-us",
      "sweetwater-used",
      "guitar-center-used",
    ],
  },
  {
    id: "east-coast",
    label: "East Coast",
    currency: "USD",
    status: "beta",
    sources: [
      "craigslist-east",
      "main-drag",
      "rogue-music",
      "three-wave",
      "alto-music",
      "tone-tweakers",
      "pro-audio-star",
      "reverb-us",
      "ebay-us",
    ],
  },
  {
    id: "uk",
    label: "UK",
    currency: "GBP",
    status: "beta",
    sources: ["reverb-uk", "ebay-uk"],
  },
];

const REGION_IDS = REGION_CONFIG.map((region) => region.id);
const CATEGORY_IDS = [
  "all",
  "synthesizers",
  "drum-machines",
  "samplers",
  "modular",
  "effects-pedals",
  "pro-audio",
];
const sourceById = new Map(SOURCE_REGISTRY.map((source) => [source.id, source]));

const listingSchema = z.object({
  id: z.string(),
  source: z.string(),
  region: z.string(),
  currency: z.string(),
  title: z.string(),
  price: z.number().nullable(),
  condition: z.string(),
  listedAt: z.string().nullable(),
  url: z.string(),
  image: z.string(),
  brand: z.string().nullable(),
  model: z.string().nullable(),
  category: z.string().nullable(),
  qualityScore: z.number().nullable(),
  noiseScore: z.number().nullable(),
});

const catalogReadOnlyAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: false,
};

const searchReadOnlyAnnotations = {
  ...catalogReadOnlyAnnotations,
  openWorldHint: true,
};

export function createBrrtzMcpHandler({ searchGear, requestsPerMinute = 60 }) {
  if (typeof searchGear !== "function") {
    throw new TypeError("createBrrtzMcpHandler requires a searchGear function.");
  }
  const requestWindows = new Map();

  return async function handleBrrtzMcpRequest(request, response) {
    const rateLimit = consumeRequestWindow(requestWindows, request, requestsPerMinute);
    if (!rateLimit.allowed) {
      response.writeHead(429, {
        "content-type": "application/json; charset=utf-8",
        "cache-control": "no-store",
        "retry-after": String(rateLimit.retryAfterSeconds),
      });
      response.end(JSON.stringify({
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Brrtz MCP request limit reached. Please retry shortly.",
        },
        id: null,
      }));
      return;
    }

    const server = createBrrtzMcpServer({ searchGear });
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    try {
      await server.connect(transport);
      await transport.handleRequest(request, response);
    } catch (error) {
      if (!response.headersSent) {
        response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
        response.end(JSON.stringify({
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : "Internal MCP server error",
          },
          id: null,
        }));
      }
    } finally {
      await transport.close().catch(() => {});
      await server.close().catch(() => {});
    }
  };
}

export function createBrrtzMcpServer({ searchGear }) {
  const server = new McpServer(
    {
      name: "brrtz-gear-radar",
      version: "0.1.0",
      websiteUrl: "https://brrtz.com",
    },
    {
      instructions:
        "Use Brrtz to discover used synthesizers and pro-audio gear. Return original listing URLs and make clear that Brrtz is a discovery layer, not the seller. These beta tools are public and read-only.",
    },
  );

  server.registerTool(
    "search_gear",
    {
      title: "Search used gear",
      description:
        "Search Brrtz for current used synthesizer and pro-audio listings across supported regional sources. Use this for listing discovery; it does not read or modify a user's private Brrtz account.",
      inputSchema: {
        terms: z.array(z.string().trim().min(1).max(120)).min(1).max(10),
        region: z.enum(REGION_IDS).default("japan"),
        category: z.enum(CATEGORY_IDS).default("synthesizers"),
        sources: z.array(z.string().trim().min(1).max(80)).max(20).optional(),
        maxPrice: z.number().nonnegative().optional(),
        excludes: z.array(z.string().trim().min(1).max(120)).max(30).optional(),
        limit: z.number().int().min(1).max(50).default(20),
      },
      outputSchema: {
        listings: z.array(listingSchema),
        sourceWarnings: z.array(z.string()),
        searchUrl: z.string(),
        searchedAt: z.string(),
        resultCount: z.number().int().nonnegative(),
      },
      annotations: searchReadOnlyAnnotations,
    },
    async (input) => {
      try {
        const region = findRegion(input.region);
        const sources = normalizeRequestedSources(input.sources, region);
        const payload = await searchGear({
          terms: input.terms,
          region: region.id,
          category: input.category,
          sources,
          maxPrice: input.maxPrice,
          excludes: input.excludes || [],
        });
        const listings = (Array.isArray(payload?.listings) ? payload.listings : [])
          .slice(0, input.limit)
          .map((listing) => normalizeMcpListing(listing, region));
        const sourceWarnings = normalizeSourceWarnings(payload?.meta?.errors);
        const searchUrl = createPublicSearchUrl(input);
        const searchedAt = String(payload?.meta?.searchedAt || new Date().toISOString());

        return {
          structuredContent: {
            listings,
            sourceWarnings,
            searchUrl,
            searchedAt,
            resultCount: listings.length,
          },
          content: [{
            type: "text",
            text: createSearchSummary(listings, sourceWarnings, searchUrl),
          }],
        };
      } catch (error) {
        return createToolError(error);
      }
    },
  );

  server.registerTool(
    "get_regions",
    {
      title: "Get Brrtz regions",
      description:
        "List the public Brrtz search regions, display currencies, beta status, and available source IDs.",
      inputSchema: {},
      outputSchema: {
        regions: z.array(z.object({
          id: z.string(),
          label: z.string(),
          currency: z.string(),
          status: z.string(),
          sources: z.array(z.string()),
        })),
      },
      annotations: catalogReadOnlyAnnotations,
    },
    async () => {
      const regions = REGION_CONFIG.map((region) => ({ ...region, sources: [...region.sources] }));
      return {
        structuredContent: { regions },
        content: [{
          type: "text",
          text: `Brrtz currently supports ${regions.length} regions: ${regions.map((region) => region.label).join(", ")}.`,
        }],
      };
    },
  );

  server.registerTool(
    "get_sources",
    {
      title: "Get Brrtz sources",
      description:
        "List public marketplace and shop sources available to Brrtz, optionally filtered to one supported region.",
      inputSchema: {
        region: z.enum(REGION_IDS).optional(),
      },
      outputSchema: {
        sources: z.array(z.object({
          id: z.string(),
          label: z.string(),
          region: z.string(),
          access: z.string(),
          status: z.string(),
          type: z.string(),
          url: z.string(),
        })),
      },
      annotations: catalogReadOnlyAnnotations,
    },
    async ({ region: regionId }) => {
      const regions = regionId ? [findRegion(regionId)] : REGION_CONFIG;
      const sources = regions.flatMap((region) => region.sources.map((sourceId) => {
        const source = sourceById.get(sourceId);
        if (!source) return null;
        return {
          id: source.id,
          label: source.name,
          region: region.id,
          access: source.accessType,
          status: source.status,
          type: source.type,
          url: source.url,
        };
      })).filter(Boolean);
      const uniqueSources = [...new Map(sources.map((source) => [`${source.region}:${source.id}`, source])).values()];

      return {
        structuredContent: { sources: uniqueSources },
        content: [{
          type: "text",
          text: `Found ${uniqueSources.length} Brrtz sources${regionId ? ` for ${findRegion(regionId).label}` : ""}.`,
        }],
      };
    },
  );

  return server;
}

function findRegion(regionId) {
  return REGION_CONFIG.find((region) => region.id === regionId) || REGION_CONFIG[0];
}

function normalizeRequestedSources(requestedSources, region) {
  if (!Array.isArray(requestedSources) || requestedSources.length === 0) {
    return [...region.sources];
  }

  const allowedSources = new Set(region.sources);
  const invalidSources = requestedSources.filter((sourceId) => !allowedSources.has(sourceId));
  if (invalidSources.length > 0) {
    throw new Error(`Sources are not available in ${region.label}: ${invalidSources.join(", ")}`);
  }
  return [...new Set(requestedSources)];
}

function normalizeMcpListing(listing, region) {
  const normalized = listing?.normalized || {};
  return {
    id: String(listing?.id || normalized.id || ""),
    source: String(listing?.source || normalized.sourceId || ""),
    region: String(listing?.region || listing?.regionId || normalized.regionId || region.id),
    currency: String(listing?.currency || normalized.priceCurrency || region.currency),
    title: String(listing?.title || normalized.title || ""),
    price: toNullableNumber(listing?.price ?? normalized.priceAmount),
    condition: String(listing?.condition || normalized.condition || ""),
    listedAt: toNullableString(listing?.listedAt || normalized.postedAt),
    url: String(listing?.url || normalized.sourceUrl || ""),
    image: String(listing?.image || normalized.imageUrls?.[0] || ""),
    brand: toNullableString(listing?.brand || normalized.brand),
    model: toNullableString(listing?.model || normalized.model),
    category: toNullableString(listing?.category || normalized.category),
    qualityScore: toNullableNumber(listing?.qualityScore ?? normalized.qualityScore),
    noiseScore: toNullableNumber(listing?.noiseScore ?? normalized.noiseScore),
  };
}

function normalizeSourceWarnings(errors) {
  if (!Array.isArray(errors)) return [];
  return errors.map((error) => {
    if (typeof error === "string") return error;
    return [error?.source, error?.message].filter(Boolean).join(": ") || "A source could not be searched.";
  });
}

function createPublicSearchUrl(input) {
  const url = new URL("/search", "https://brrtz.com");
  url.searchParams.set("region", input.region);
  url.searchParams.set("category", input.category);
  url.searchParams.set("q", input.terms.join(" "));
  return url.toString();
}

function createSearchSummary(listings, warnings, searchUrl) {
  const warningText = warnings.length > 0 ? ` ${warnings.length} source warning${warnings.length === 1 ? "" : "s"} occurred.` : "";
  return `Found ${listings.length} used-gear listing${listings.length === 1 ? "" : "s"}.${warningText} Open the Brrtz search: ${searchUrl}`;
}

function createToolError(error) {
  return {
    isError: true,
    content: [{
      type: "text",
      text: error instanceof Error ? error.message : "The Brrtz tool could not complete the request.",
    }],
  };
}

function toNullableString(value) {
  return value ? String(value) : null;
}

function toNullableNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function consumeRequestWindow(requestWindows, request, requestsPerMinute) {
  const now = Date.now();
  const windowMs = 60_000;
  const clientId = getClientId(request);
  const current = requestWindows.get(clientId);

  if (!current || current.expiresAt <= now) {
    requestWindows.set(clientId, { count: 1, expiresAt: now + windowMs });
    pruneExpiredRequestWindows(requestWindows, now);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= requestsPerMinute) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.expiresAt - now) / 1000)),
    };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function getClientId(request) {
  const forwardedFor = String(request.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwardedFor || String(request.socket?.remoteAddress || "unknown");
}

function pruneExpiredRequestWindows(requestWindows, now) {
  if (requestWindows.size < 500) return;
  for (const [clientId, requestWindow] of requestWindows) {
    if (requestWindow.expiresAt <= now) requestWindows.delete(clientId);
  }
}
