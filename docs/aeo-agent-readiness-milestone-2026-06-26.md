# AEO and Agent Readiness Milestone

Date: 2026-06-26

## Goal

Position Brrtz as more than a regular scraper or search engine. The product should become a trusted gear-finding layer that answer engines can understand and that agents can eventually connect to directly through ChatGPT, Claude, or other MCP-capable clients.

## Strategic Frame

Brrtz needs two kinds of optimization:

1. Answer Engine Optimization: help Google, AI search systems, and LLM crawlers understand what Brrtz is, what it covers, and why it is trustworthy.
2. Agent Experience Optimization: make Brrtz callable by agents so users can ask for gear searches, saved search monitoring, watchlist actions, and new-match alerts from chat.

## Beta AEO Work That Can Be Done Now

- Add a crawlable About page explaining Brrtz as a free beta gear radar for used synth and pro-audio search.
- Add crawlable region pages for Japan, Bay Area, Los Angeles, and East Coast.
- Add a crawlable sources page explaining the source posture and beta coverage.
- Add a For Agents page that explains search URL patterns, supported regions, supported categories, boundaries, and future connector plans.
- Add `/llms.txt` as a low-cost LLM-readable site guide.
- Add `robots.txt` and `sitemap.xml`.
- Add structured data to the homepage for Organization, WebSite, and WebApplication.
- Add shareable search URLs such as `/search?region=bay-area&category=synthesizers&q=moog%20voyager`.
- Keep source provenance explicit: source, region, currency, original listing URL, and freshness context should remain visible in the product.

## Post-Beta Agent Features

- Build a Brrtz Model Context Protocol server.
- Start with tools such as `search_gear`, `get_regions`, `get_sources`, `save_search`, `watch_listing`, and `get_new_matches`.
- Add OpenAI Apps SDK support once the MCP tool layer is stable.
- Add Claude connector support through the same MCP foundation.
- Publish public API or connector documentation for listing shape, source IDs, region IDs, category IDs, and query parameters.
- Create entity pages for important synth and drum machine models such as Moog Minimoog, ARP 2600, Roland TR-808, Roland Juno-106, Ensoniq Fizmo, and Yamaha CS-80.
- Add RSS or JSON feeds for saved searches and public search URLs.
- Add user preference profiles that agents can use with permission: preferred regions, budget, makers, categories, condition tolerance, excluded terms, and watched gear.
- Add alert workflows such as "tell me when a clean Juno-60 appears under $2,000 in the Bay Area."

## Product Posture

- Brrtz is a search and discovery layer, not the merchant of record.
- Brrtz should link users back to original listing sources.
- Brrtz should not store or republish full source listing databases.
- Brrtz should expose clear source, region, currency, and freshness metadata.
- Brrtz should favor user permission and transparent connector behavior for any future agent integration.

## Implementation Notes From This Milestone

- Public AEO pages were added for About, Regions, Sources, and For Agents.
- `llms.txt`, `robots.txt`, and `sitemap.xml` were added.
- Homepage metadata and JSON-LD were added.
- The server now resolves clean URLs for `/about`, `/for-agents`, `/regions`, `/sources`, and `/search`.
- Startup URL parsing now supports search prefill for `q`, `region`, and `category`.

## Follow-Up AEO Work

- Added model-intent pages for Moog Minimoog, ARP 2600, and Roland TR-808.
- Added a draft `/agent-connector` page to describe future MCP-style tools and permission boundaries.
- Added `/agent-tools.json` as a machine-readable draft of planned agent tools.
- Added `docs/brrtz-agent-connector-spec-2026-06-26.md` as the durable implementation planning spec.
