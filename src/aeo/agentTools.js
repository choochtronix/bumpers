export const agentToolsObject = {
  "schemaVersion": "0.3.0",
  "lastUpdated": "2026-07-25",
  "name": "Brrtz Agent Tools",
  "summary": "Brrtz is a free beta gear radar for finding used synthesizers, drum machines, samplers, modular, effects, and pro audio across regional marketplaces — with particular strength in Japanese sources like Yahoo Auctions and Mercari — always linking buyers back to the original listing.",
  "status": "live_beta",
  "isLiveConnector": true,
  "homepage": "https://brrtz.com/",
  "mcpEndpoint": "https://brrtz.com/mcp",
  "humanAgentGuide": "https://brrtz.com/for-agents",
  "connectorSpec": "https://brrtz.com/agent-connector",
  "currentSearchUrlPattern": "https://brrtz.com/search?region={region}&category={category}&q={query}",
  "supportedRegions": ["japan", "bay-area", "los-angeles", "east-coast", "uk"],
  "supportedCategories": ["all", "synthesizers", "drum-machines", "samplers", "modular", "effects-pedals", "pro-audio"],
  "currentCapabilities": [
    "Search current public used-gear listings through the read-only search_gear MCP tool.",
    "Read supported regions and public source coverage through the get_regions and get_sources MCP tools.",
    "Open shareable Brrtz search URLs with region, category, and query parameters.",
    "Read crawlable region, source, gear model, and agent guide pages.",
    "Use llms.txt for public Brrtz context and boundaries."
  ],
  "plannedCapabilities": [
    "Save searches and watch listings with explicit user authorization.",
    "Fetch new matches for a user's saved search with explicit user authorization."
  ],
  "tools": [
    {
      "name": "search_gear",
      "status": "live_beta",
      "permission": "read_only",
      "description": "Search Brrtz for used gear by terms, region, category, source selection, max price, and exclude terms. This tool does not modify user data.",
      "inputSchema": {
        "type": "object",
        "required": ["terms"],
        "properties": {
          "terms": { "type": "array", "items": { "type": "string" } },
          "region": { "type": "string", "enum": ["japan", "bay-area", "los-angeles", "east-coast", "uk"] },
          "category": { "type": "string", "enum": ["all", "synthesizers", "drum-machines", "samplers", "modular", "effects-pedals", "pro-audio"] },
          "sources": { "type": "array", "items": { "type": "string" } },
          "maxPrice": { "type": "number" },
          "excludes": { "type": "array", "items": { "type": "string" } }
        }
      },
      "outputSchema": {
        "type": "object",
        "required": ["listings", "sourceWarnings", "searchUrl", "searchedAt", "resultCount"],
        "properties": {
          "listings": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "source", "region", "currency", "title", "url"],
              "properties": {
                "id": { "type": "string" },
                "source": { "type": "string" },
                "region": { "type": "string" },
                "currency": { "type": "string" },
                "title": { "type": "string" },
                "price": { "type": "number" },
                "url": { "type": "string" },
                "image": { "type": "string" },
                "freshness": { "type": "string" }
              }
            }
          },
          "sourceWarnings": { "type": "array", "items": { "type": "string" } },
          "searchUrl": { "type": "string" },
          "searchedAt": { "type": "string" },
          "resultCount": { "type": "number" }
        }
      }
    },
    {
      "name": "get_regions",
      "status": "live_beta",
      "permission": "read_only",
      "description": "Return supported Brrtz regions, currency, status, and source coverage. This tool does not modify user data.",
      "inputSchema": { "type": "object", "properties": {} },
      "outputSchema": {
        "type": "object",
        "required": ["regions"],
        "properties": {
          "regions": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "label", "currency", "status"],
              "properties": {
                "id": { "type": "string" },
                "label": { "type": "string" },
                "currency": { "type": "string" },
                "status": { "type": "string" },
                "sources": { "type": "array", "items": { "type": "string" } }
              }
            }
          }
        }
      }
    },
    {
      "name": "get_sources",
      "status": "live_beta",
      "permission": "read_only",
      "description": "Return source IDs, labels, regions, source type, and live or assist-style access posture. This tool does not modify user data.",
      "inputSchema": {
        "type": "object",
        "properties": {
          "region": { "type": "string", "enum": ["japan", "bay-area", "los-angeles", "east-coast", "uk"] }
        }
      },
      "outputSchema": {
        "type": "object",
        "required": ["sources"],
        "properties": {
          "sources": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "label", "region", "access"],
              "properties": {
                "id": { "type": "string" },
                "label": { "type": "string" },
                "region": { "type": "string" },
                "access": { "type": "string" },
                "status": { "type": "string" }
              }
            }
          }
        }
      }
    },
    {
      "name": "save_search",
      "status": "planned",
      "permission": "user_authorized_write",
      "description": "Create or update a saved search intent for an authorized user. This tool requires explicit user authorization and must not expose private saved searches across users.",
      "inputSchema": {
        "type": "object",
        "required": ["name", "terms", "region"],
        "properties": {
          "name": { "type": "string" },
          "terms": { "type": "array", "items": { "type": "string" } },
          "region": { "type": "string", "enum": ["japan", "bay-area", "los-angeles", "east-coast"] },
          "category": { "type": "string", "enum": ["all", "synthesizers", "drum-machines", "samplers", "modular", "effects-pedals", "pro-audio"] },
          "sources": { "type": "array", "items": { "type": "string" } },
          "maxPrice": { "type": "number" },
          "excludes": { "type": "array", "items": { "type": "string" } },
          "alertMode": { "type": "string", "enum": ["immediate", "hourly", "daily"] }
        }
      },
      "outputSchema": {
        "type": "object",
        "required": ["savedSearchId", "status"],
        "properties": {
          "savedSearchId": { "type": "string" },
          "status": { "type": "string" },
          "updatedAt": { "type": "string" }
        }
      }
    },
    {
      "name": "watch_listing",
      "status": "planned",
      "permission": "user_authorized_write",
      "description": "Add a listing URL or normalized listing ID to the authorized user's watchlist. This tool requires explicit user authorization and must not expose private watchlists across users.",
      "inputSchema": {
        "type": "object",
        "required": ["listingUrl"],
        "properties": {
          "listingUrl": { "type": "string" },
          "listingId": { "type": "string" },
          "source": { "type": "string" },
          "region": { "type": "string" }
        }
      },
      "outputSchema": {
        "type": "object",
        "required": ["watchId", "status"],
        "properties": {
          "watchId": { "type": "string" },
          "status": { "type": "string" },
          "updatedAt": { "type": "string" }
        }
      }
    },
    {
      "name": "get_new_matches",
      "status": "planned",
      "permission": "user_authorized_read",
      "description": "Return new or fresh matches for an authorized user's saved search since the last user-visible scan. Private saved search data must not be exposed across users.",
      "inputSchema": {
        "type": "object",
        "required": ["savedSearchId"],
        "properties": {
          "savedSearchId": { "type": "string" },
          "since": { "type": "string" },
          "limit": { "type": "number" }
        }
      },
      "outputSchema": {
        "type": "object",
        "required": ["matches"],
        "properties": {
          "matches": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["id", "source", "region", "currency", "title", "url"],
              "properties": {
                "id": { "type": "string" },
                "source": { "type": "string" },
                "region": { "type": "string" },
                "currency": { "type": "string" },
                "title": { "type": "string" },
                "price": { "type": "number" },
                "url": { "type": "string" },
                "freshness": { "type": "string" }
              }
            }
          }
        }
      }
    }
  ],
  "boundaries": [
    "Brrtz is not the merchant of record.",
    "Brrtz links users back to original listing sources.",
    "The connector should not republish full source listing databases.",
    "Read-only tools must not modify user data.",
    "save_search and watch_listing require explicit user authorization.",
    "Private saved searches and watchlists must not be exposed across users."
  ]
};
