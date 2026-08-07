const DEFAULT_BASE_URL = "http://127.0.0.1:5173";
const baseUrl = normalizeBaseUrl(process.env.AEO_BASE_URL || process.argv[2] || DEFAULT_BASE_URL);

const bannedStrings = [
  ["Drum Machine, no ", "cat pee smell"].join(""),
  ["Mock ", "data"].join(""),
  ["alpha@bumpers", ".local"].join(""),
  ["local@bumpers", ".dev"].join(""),
  "Brrtz Japan gear radar",
  "My WordPress Site",
  "Welcome to WordPress",
  ["Â®", "ion"].join(""),
];

const expectedRobotsTxt = [
  "User-agent: *",
  "Allow: /",
  "",
  "Disallow: /api/",
  "Disallow: /data/",
  "Disallow: /.env",
  "Disallow: /.env.local",
  "",
  "Sitemap: https://brrtz.com/sitemap.xml",
  "",
].join("\n");

const requiredSitemapUrls = [
  "https://brrtz.com/",
  "https://brrtz.com/about",
  "https://brrtz.com/regions",
  "https://brrtz.com/regions/japan",
  "https://brrtz.com/regions/bay-area",
  "https://brrtz.com/regions/los-angeles",
  "https://brrtz.com/regions/east-coast",
  "https://brrtz.com/regions/uk",
  "https://brrtz.com/sources",
  "https://brrtz.com/for-agents",
  "https://brrtz.com/chatgpt",
  "https://brrtz.com/gear",
  "https://brrtz.com/gear/moog-minimoog",
  "https://brrtz.com/gear/arp-2600",
  "https://brrtz.com/gear/roland-tr-808",
  "https://brrtz.com/gear/roland-juno-106",
  "https://brrtz.com/gear/roland-tb-303",
  "https://brrtz.com/gear/roland-sh-101",
  "https://brrtz.com/gear/roland-jupiter-8",
  "https://brrtz.com/gear/sequential-prophet-5",
  "https://brrtz.com/gear/yamaha-dx7",
  "https://brrtz.com/gear/korg-ms-20",
  "https://brrtz.com/gear/akai-mpc3000",
  "https://brrtz.com/gear/e-mu-sp-1200",
  "https://brrtz.com/gear/roland-sp-404",
  "https://brrtz.com/gear/roland-tr-909",
  "https://brrtz.com/gear/roland-juno-60",
  "https://brrtz.com/gear/korg-minilogue",
  "https://brrtz.com/gear/moog-voyager",
  "https://brrtz.com/gear/elektron-digitakt",
  "https://brrtz.com/gear/akai-mpc2000xl",
  "https://brrtz.com/agent-connector",
];

const gearPages = [
  ["/gear", ["Model-aware searches for", "classic gear"]],
  ["/gear/moog-minimoog", ["Used", "Moog Minimoog", "listings"]],
  ["/gear/arp-2600", ["Used", "ARP 2600", "listings"]],
  ["/gear/roland-tr-808", ["Used", "Roland TR-808", "listings"]],
  ["/gear/roland-juno-106", ["Used", "Roland Juno-106", "listings"]],
  ["/gear/roland-tb-303", ["Used", "Roland TB-303", "listings"]],
  ["/gear/roland-sh-101", ["Used", "Roland SH-101", "listings"]],
  ["/gear/roland-jupiter-8", ["Used", "Roland Jupiter-8", "listings"]],
  ["/gear/sequential-prophet-5", ["Used", "Sequential Prophet-5", "listings"]],
  ["/gear/yamaha-dx7", ["Used", "Yamaha DX7", "listings"]],
  ["/gear/korg-ms-20", ["Used", "Korg MS-20", "listings"]],
  ["/gear/akai-mpc3000", ["Used", "Akai MPC3000", "listings"]],
  ["/gear/e-mu-sp-1200", ["Used", "E-mu SP-1200", "listings"]],
  ["/gear/roland-sp-404", ["Used", "Roland SP-404", "listings"]],
  ["/gear/roland-tr-909", ["Used", "Roland TR-909", "listings"]],
  ["/gear/roland-juno-60", ["Used", "Roland Juno-60", "listings"]],
  ["/gear/korg-minilogue", ["Used", "Korg Minilogue", "listings"]],
  ["/gear/moog-voyager", ["Used", "Moog Voyager", "listings"]],
  ["/gear/elektron-digitakt", ["Used", "Elektron Digitakt", "listings"]],
  ["/gear/akai-mpc2000xl", ["Used", "Akai MPC2000XL", "listings"]],
];

const publicAeoPages = [
  "/about",
  "/regions",
  "/regions/japan",
  "/sources",
  "/for-agents",
  "/gear",
];

await main();

async function main() {
  const robots = await fetchText("/robots.txt");
  assertStatus(robots, 200, "/robots.txt");
  assertContentType(robots, "text/plain", "/robots.txt");
  assertRobotsTxt(robots.body);

  const llms = await fetchText("/llms.txt");
  assertStatus(llms, 200, "/llms.txt");
  assertContentType(llms, "text/plain", "/llms.txt");
  assertMarkdownLlms(llms.body);
  assertNoBannedStrings(llms.body, "/llms.txt");
  assert(!llms.body.includes("search?q=moog%20voyager&region="), "/llms.txt must use region-first search examples");

  const agentTools = await fetchText("/agent-tools.json");
  assertStatus(agentTools, 200, "/agent-tools.json");
  assertContentType(agentTools, "application/json", "/agent-tools.json");
  assertJsonHasNoLiteralNewlinesInStrings(agentTools.body, "/agent-tools.json");
  const agentToolsPayload = JSON.parse(agentTools.body);
  assertAgentToolsJsonRoundTrip(agentTools.body, agentToolsPayload);
  assertAgentTools(agentToolsPayload);
  assertNoBannedStrings(agentTools.body, "/agent-tools.json");

  const sitemap = await fetchText("/sitemap.xml");
  assertStatus(sitemap, 200, "/sitemap.xml");
  assertXmlContentType(sitemap, "/sitemap.xml");
  assertXmlSitemap(sitemap.body);

  const legacyWordPressCategory = await fetchText("/category/uncategorized/");
  assert([404, 410].includes(legacyWordPressCategory.status), "/category/uncategorized/ should return a real 404 or 410");
  assertNoBannedStrings(legacyWordPressCategory.body, "/category/uncategorized/");

  for (const path of ["/", "/search?region=bay-area&category=synthesizers&q=moog%20voyager"]) {
    const page = await fetchText(path);
    assertStatus(page, 200, path);
    assertNoBannedStrings(page.body, path);
  }

  const home = await fetchText("/");
  assertHomepageIdentity(home.body);
  assert(!home.body.includes("Japan gear radar"), "/ should not imply Brrtz is Japan-only");
  assert(!home.body.includes("View via Buyee"), "/ should not expose generic Buyee copy in the crawler-visible shell");

  for (const path of publicAeoPages) {
    const page = await fetchText(path);
    assertStatus(page, 200, path);
    assertContentType(page, "text/html", path);
    assertNoBannedStrings(page.body, path);
    assert(page.body.includes("<h1"), `${path} should contain a primary H1`);
    assert(page.body.includes('rel="canonical"'), `${path} should contain a canonical URL`);
  }

  const legacyWordPressPage = await fetchText("/category/uncategorized/");
  assertStatus(legacyWordPressPage, 404, "/category/uncategorized/");
  assertNoBannedStrings(legacyWordPressPage.body, "/category/uncategorized/");
  assert(!sitemap.body.includes("/category/uncategorized/"), "/sitemap.xml should not include the legacy WordPress category URL");

  const search = await fetchText("/search?region=bay-area&category=synthesizers&q=moog%20voyager");
  assert(search.body.includes("Search Brrtz for Moog Voyager in the Bay Area"), "/search should render query-aware H1 fallback");
  assert(search.body.includes("Moog Voyager used synthesizer search in Bay Area - Brrtz"), "/search should render query-aware title");
  assert(search.body.includes('content="noindex,follow"'), "/search should include noindex,follow for arbitrary parameterized search URLs");
  assert(!search.body.includes("View via Buyee"), "/search fallback should not expose generic Buyee copy");

  for (const [path, h1Parts] of gearPages) {
    const page = await fetchText(path);
    assertStatus(page, 200, path);
    for (const part of h1Parts) {
      assert(page.body.includes(part), `${path} should contain expected H1 text part: ${part}`);
    }
    assert(page.body.includes("/sources"), `${path} should link to sources`);
    assert(page.body.includes("/regions"), `${path} should link to regions`);
    assert(page.body.includes("/for-agents"), `${path} should link to for-agents`);
    for (const regionId of ["japan", "bay-area", "los-angeles", "east-coast"]) {
      assert(page.body.includes(`region=${regionId}`) || page.body.includes(`/regions/${regionId}`), `${path} should include ${regionId} region link`);
    }
  }

  console.log(`AEO checks passed for ${baseUrl}`);
}

function assertHomepageIdentity(body) {
  assert(extractTagContent(body, "title") === "Brrtz Gear Radar — Used Synth &amp; Pro Audio Search", "/ title should use the canonical Brrtz Gear Radar identity");
  assert(extractLinkHref(body, "canonical") === "https://brrtz.com/", "/ canonical should be https://brrtz.com/");
  assert(extractMetaContent(body, "property", "og:site_name") === "Brrtz", "/ og:site_name should be Brrtz");
  assert(extractMetaContent(body, "property", "og:url") === "https://brrtz.com/", "/ og:url should match the canonical homepage");

  const h1Matches = [...body.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
  assert(h1Matches.length === 1, `/ should contain exactly one H1, received ${h1Matches.length}`);
  const h1 = h1Matches[0]?.[1] || "";
  assert(/<span class="brand-descriptor">\s*Brrtz Gear Radar\s*<\/span>/.test(h1), "/ H1 should visibly identify Brrtz Gear Radar");
  assert(!/class="[^"]*sr-only[^"]*"[^>]*>\s*Brrtz Gear Radar/.test(h1), "/ H1 identity should not be screen-reader-only");
  assert(body.includes('<h2 id="activeTitle">Search used gear</h2>'), "/ should retain the Search used gear operational heading");
  assert(body.includes("Every used-gear source in one search — Clean Gear, Fresh Finds, original links."), "/ should include the compact product description");

  const nodes = extractJsonLdNodes(body);
  const websites = nodes.filter((node) => node?.["@type"] === "WebSite");
  const organizations = nodes.filter((node) => node?.["@type"] === "Organization");
  const applications = nodes.filter((node) => node?.["@type"] === "WebApplication");

  assert(websites.length === 1, `/ should contain exactly one WebSite entity, received ${websites.length}`);
  assert(organizations.length === 1, `/ should contain exactly one Organization entity, received ${organizations.length}`);
  assert(applications.length === 1, `/ should preserve exactly one WebApplication entity, received ${applications.length}`);

  const website = websites[0];
  assert(website["@id"] === "https://brrtz.com/#website", "WebSite should use the canonical #website ID");
  assert(website.name === "Brrtz", "WebSite.name should be Brrtz");
  assert(website.url === "https://brrtz.com/", "WebSite.url should be the canonical homepage");
  assert(Array.isArray(website.alternateName), "WebSite.alternateName should be an array");
  assert(website.alternateName.includes("Brrtz Gear Radar"), "WebSite.alternateName should include Brrtz Gear Radar");
  assert(website.alternateName.includes("brrtz.com"), "WebSite.alternateName should include brrtz.com");
  assert(website.publisher?.["@id"] === "https://brrtz.com/#organization", "WebSite.publisher should reference the canonical Organization");

  const organization = organizations[0];
  assert(organization["@id"] === "https://brrtz.com/#organization", "Organization should use the canonical #organization ID");
  assert(organization.name === "Brrtz", "Organization.name should be Brrtz");
  assert(organization.alternateName === "Brrtz Gear Radar", "Organization.alternateName should be Brrtz Gear Radar");
  assert(organization.url === "https://brrtz.com/", "Organization.url should be the canonical homepage");
  assert(!Object.hasOwn(organization, "sameAs"), "Organization should omit sameAs until authoritative profiles exist");

  const application = applications[0];
  assert(application.name === "Brrtz", "WebApplication.name should remain Brrtz");
  assert(application.publisher?.["@id"] === "https://brrtz.com/#organization", "WebApplication.publisher should reference the canonical Organization");

  for (const node of [...websites, ...organizations, ...applications]) {
    assert(node.name === "Brrtz", `${node["@type"]}.name should not conflict with the canonical Brrtz name`);
  }
}

function extractJsonLdNodes(body) {
  const scripts = [...body.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  return scripts.flatMap((match) => {
    const payload = JSON.parse(match[1]);
    return Array.isArray(payload?.["@graph"]) ? payload["@graph"] : [payload];
  });
}

function extractTagContent(body, tagName) {
  return body.match(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "i"))?.[1]?.trim() || "";
}

function extractMetaContent(body, attribute, value) {
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = body.match(new RegExp(`<meta\\b(?=[^>]*\\b${attribute}="${escapedValue}")[^>]*>`, "i"))?.[0] || "";
  return tag.match(/\bcontent="([^"]*)"/i)?.[1] || "";
}

function extractLinkHref(body, rel) {
  const escapedRel = rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tag = body.match(new RegExp(`<link\\b(?=[^>]*\\brel="${escapedRel}")[^>]*>`, "i"))?.[0] || "";
  return tag.match(/\bhref="([^"]*)"/i)?.[1] || "";
}

async function fetchText(path) {
  const response = await fetch(`${baseUrl}${path}`);
  return {
    path,
    status: response.status,
    contentType: response.headers.get("content-type") || "",
    body: await response.text(),
  };
}

function assertRobotsTxt(body) {
  const normalizedBody = body.replace(/\r\n/g, "\n");
  assert(normalizedBody === expectedRobotsTxt, "/robots.txt should match the exact multiline directive body");
  assert(normalizedBody.includes("User-agent: *\n"), "/robots.txt should contain line-oriented User-agent directive");
  assert(normalizedBody.includes("Allow: /\n\nDisallow: /api/"), "/robots.txt should separate Allow and Disallow directives with newlines");
  assert(normalizedBody.includes("\nSitemap: https://brrtz.com/sitemap.xml"), "/robots.txt should include sitemap on its own line");
  assert(!normalizedBody.includes("User-agent: * Allow:"), "/robots.txt should not flatten User-agent and Allow directives");
  assert(!normalizedBody.includes("Allow: / Disallow:"), "/robots.txt should not flatten Allow and Disallow directives");
  assert(!normalizedBody.includes("Disallow: /.env.local Sitemap:"), "/robots.txt should not flatten final Disallow and Sitemap directives");
  const lines = normalizedBody.split("\n").filter(Boolean);
  for (const line of lines) {
    const directiveCount = ["User-agent:", "Allow:", "Disallow:", "Sitemap:"].filter((directive) => line.includes(directive)).length;
    assert(directiveCount <= 1, `/robots.txt has concatenated directives on one line: ${line}`);
  }
}

function assertMarkdownLlms(body) {
  const normalizedBody = body.replace(/\r\n/g, "\n");
  assert(normalizedBody.startsWith("# Brrtz\n\n> Brrtz is a free beta gear radar"), "/llms.txt should start with H1, blank line, and blockquote summary");
  assert(normalizedBody.includes("\n\n>"), "/llms.txt should preserve a blank line before the blockquote");
  assert(normalizedBody.includes("\n\n## Boundaries and Safety\n\n"), "/llms.txt should preserve blank lines around Boundaries and Safety H2");
  assert(normalizedBody.includes("\n- [Home and app](https://brrtz.com/)"), "/llms.txt should include Home and app as a Markdown list item");
  assert(!normalizedBody.includes("# Brrtz >"), "/llms.txt should not flatten H1 and blockquote onto one line");
  assert(!normalizedBody.includes("## Boundaries and Safety -"), "/llms.txt should not flatten Boundaries heading and list item");
  assert(normalizedBody.includes("- [Home and app]"), "/llms.txt should include Markdown public URL links");
  for (const section of ["## Boundaries and Safety", "## Public URLs", "## Supported Region IDs", "## Supported Category IDs", "## Search URL Pattern", "## MCP Connector"]) {
    assert(normalizedBody.includes(`\n${section}\n`), `/llms.txt missing separate H2 section ${section}`);
  }
  for (const url of ["https://brrtz.com/", "https://brrtz.com/about", "https://brrtz.com/regions", "https://brrtz.com/sources", "https://brrtz.com/for-agents", "https://brrtz.com/gear", "https://brrtz.com/agent-connector", "https://brrtz.com/agent-tools.json"]) {
    assert(normalizedBody.includes(url), `/llms.txt missing ${url}`);
  }
  assert(!normalizedBody.includes("Â®ion"), "/llms.txt should not contain malformed region text");
}

function assertAgentToolsJsonRoundTrip(rawBody, payload) {
  const normalizedRaw = rawBody.replace(/\r\n/g, "\n").trimEnd();
  const normalizedRoundTrip = JSON.stringify(payload, null, 2);
  assert(normalizedRaw === normalizedRoundTrip, "/agent-tools.json should be generated by JSON.stringify(payload, null, 2)");
  for (const tool of payload.tools || []) {
    if (typeof tool.description !== "string") continue;
    const encodedDescription = JSON.stringify(tool.description);
    assert(!encodedDescription.includes("\n") && !encodedDescription.includes("\r"), `/agent-tools.json description for ${tool.name || "unknown tool"} should not contain raw literal newlines`);
  }
}

function assertAgentTools(payload) {
  assert(payload.schemaVersion, "/agent-tools.json missing schemaVersion");
  assert(payload.lastUpdated, "/agent-tools.json missing lastUpdated");
  assert(payload.isLiveConnector === true, "/agent-tools.json should mark the public read-only MCP connector live");
  assert(payload.mcpEndpoint === "https://brrtz.com/mcp", "/agent-tools.json should publish the canonical MCP endpoint");
  assert(payload.currentSearchUrlPattern === "https://brrtz.com/search?region={region}&category={category}&q={query}", "/agent-tools.json must use exact region-first currentSearchUrlPattern");
  assert(Array.isArray(payload.currentCapabilities), "/agent-tools.json missing currentCapabilities");
  assert(Array.isArray(payload.plannedCapabilities), "/agent-tools.json missing plannedCapabilities");
  assert(Array.isArray(payload.boundaries), "/agent-tools.json missing boundaries");

  const expectedTools = ["search_gear", "get_regions", "get_sources", "save_search", "watch_listing", "get_new_matches"];
  const tools = new Map((payload.tools || []).map((tool) => [tool.name, tool]));
  for (const toolName of expectedTools) {
    const tool = tools.get(toolName);
    assert(tool, `/agent-tools.json missing tool ${toolName}`);
    for (const field of ["name", "status", "permission", "description", "inputSchema", "outputSchema"]) {
      assert(tool[field], `/agent-tools.json ${toolName} missing ${field}`);
    }
  }
  for (const toolName of ["search_gear", "get_regions", "get_sources"]) {
    assert(tools.get(toolName)?.status === "live_beta", `/agent-tools.json ${toolName} should be live_beta`);
  }
}

function assertXmlSitemap(body) {
  assert(body.trim().startsWith("<?xml"), "/sitemap.xml should start with XML declaration");
  assert(body.includes("<urlset"), "/sitemap.xml missing urlset");
  assert(body.includes("</urlset>"), "/sitemap.xml missing closing urlset");
  assertSimpleXmlWellFormed(body, "/sitemap.xml");
  for (const url of requiredSitemapUrls) {
    assert(body.includes(`<loc>${url}</loc>`), `/sitemap.xml missing ${url}`);
  }
  assert(!body.includes("/category/uncategorized/"), "/sitemap.xml should not include the legacy WordPress category URL");
}

function assertHomepageBrandSignals(body) {
  assert(body.includes("<title>Brrtz Gear Radar"), "/ title should begin with Brrtz Gear Radar");
  assert(body.includes('<link rel="canonical" href="https://brrtz.com/"'), "/ should emit canonical homepage URL");
  assert(body.includes('<meta property="og:site_name" content="Brrtz"'), "/ should emit og:site_name as Brrtz");
  assert(body.includes("Brrtz Gear Radar"), "/ should include visible Brrtz Gear Radar identity copy");
  assert(body.includes("Search used gear"), "/ should retain the operational Search used gear heading");
  assert(!body.includes("meta name=\"keywords\""), "/ should not emit meta keywords");

  const h1Texts = extractTagTexts(body, "h1");
  assert(h1Texts.length === 1, `/ should contain exactly one h1, found ${h1Texts.length}`);
  assert(h1Texts[0].includes("Brrtz Gear Radar"), "/ h1 should represent Brrtz Gear Radar");

  const jsonLdBlocks = extractJsonLdBlocks(body);
  const graphNodes = jsonLdBlocks.flatMap((block) => {
    const payload = JSON.parse(block);
    return Array.isArray(payload["@graph"]) ? payload["@graph"] : [payload];
  });

  const websiteNodes = graphNodes.filter((node) => node?.["@type"] === "WebSite" && node?.["@id"] === "https://brrtz.com/#website");
  assert(websiteNodes.length === 1, `/ should contain exactly one canonical WebSite node, found ${websiteNodes.length}`);
  const website = websiteNodes[0];
  assert(website.name === "Brrtz", "/ WebSite.name should be Brrtz");
  assert(website.url === "https://brrtz.com/", "/ WebSite.url should be the canonical root URL");
  assert(Array.isArray(website.alternateName), "/ WebSite.alternateName should be an array");
  assert(website.alternateName.includes("Brrtz Gear Radar"), "/ WebSite.alternateName should include Brrtz Gear Radar");
  assert(website.alternateName.includes("brrtz.com"), "/ WebSite.alternateName should include brrtz.com");

  const organizationNodes = graphNodes.filter((node) => node?.["@type"] === "Organization" && node?.["@id"] === "https://brrtz.com/#organization");
  assert(organizationNodes.length === 1, `/ should contain exactly one canonical Organization node, found ${organizationNodes.length}`);
  const organization = organizationNodes[0];
  assert(organization.name === "Brrtz", "/ Organization.name should be Brrtz");
  assert(organization.alternateName === "Brrtz Gear Radar", "/ Organization.alternateName should be Brrtz Gear Radar");
  assert(organization.url === "https://brrtz.com/", "/ Organization.url should be the canonical root URL");
  assert(!Object.hasOwn(organization, "sameAs"), "/ Organization.sameAs should be omitted until authoritative external profiles exist");

  const conflictingIdentityNodes = graphNodes.filter((node) => {
    if (!node || node["@id"] === "https://brrtz.com/#organization" || node["@id"] === "https://brrtz.com/#website") return false;
    return node.name === "Brrtz Gear Radar" || node.name === "Brrtz Search" || node.name === "Brrtz Marketplace";
  });
  assert(conflictingIdentityNodes.length === 0, "/ should not create competing Brrtz identity nodes");
}

function extractJsonLdBlocks(body) {
  const blocks = [];
  const pattern = /<script\s+type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/gi;
  let match;
  while ((match = pattern.exec(body))) {
    blocks.push(match[1]);
  }
  assert(blocks.length > 0, "Expected at least one JSON-LD block");
  return blocks;
}

function extractTagTexts(body, tagName) {
  const pattern = new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi");
  const texts = [];
  let match;
  while ((match = pattern.exec(body))) {
    texts.push(stripHtml(match[1]).replace(/\s+/g, " ").trim());
  }
  return texts.filter(Boolean);
}

function stripHtml(value) {
  return String(value || "").replace(/<[^>]+>/g, " ");
}

function assertXmlContentType(result, label) {
  const normalized = result.contentType.toLowerCase();
  assert(normalized.includes("application/xml") || normalized.includes("text/xml"), `${label} expected XML content-type, received ${result.contentType}`);
  assert(normalized.includes("charset=utf-8"), `${label} expected charset=utf-8, received ${result.contentType}`);
}

function assertSimpleXmlWellFormed(body, label) {
  const tagPattern = /<([^!?/][^>\s/]*)(?:\s[^>]*)?>|<\/([^>\s]+)>|<([^!?/][^>\s/]*)(?:\s[^>]*)?\/>/g;
  const stack = [];
  let match;
  while ((match = tagPattern.exec(body))) {
    const [, openTag, closeTag] = match;
    if (openTag && !match[0].endsWith("/>")) {
      stack.push(openTag);
      continue;
    }
    if (!closeTag) continue;
    const expected = stack.pop();
    assert(expected === closeTag, `${label} XML tag mismatch: expected </${expected || ""}> received </${closeTag}>`);
  }
  assert(stack.length === 0, `${label} XML has unclosed tag: ${stack.at(-1) || ""}`);
}

function assertJsonHasNoLiteralNewlinesInStrings(rawBody, label) {
  let inString = false;
  let escaped = false;
  for (let index = 0; index < rawBody.length; index += 1) {
    const char = rawBody[index];
    if (!inString) {
      if (char === '"') inString = true;
      continue;
    }
    if (escaped) {
      escaped = false;
      continue;
    }
    if (char === "\\") {
      escaped = true;
      continue;
    }
    if (char === '"') {
      inString = false;
      continue;
    }
    assert(char !== "\n" && char !== "\r", `${label} contains a literal newline inside a JSON string value`);
  }
  assert(!inString, `${label} contains an unterminated JSON string`);
}

function assertNoBannedStrings(body, label) {
  for (const value of bannedStrings) {
    assert(!body.includes(value), `${label} contains banned string: ${value}`);
  }
}

function assertStatus(result, expectedStatus, label) {
  assert(result.status === expectedStatus, `${label} expected ${expectedStatus}, received ${result.status}`);
}

function assertContentType(result, expectedType, label) {
  assert(result.contentType.includes(expectedType), `${label} expected content-type including ${expectedType}, received ${result.contentType}`);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function normalizeBaseUrl(value) {
  return String(value || DEFAULT_BASE_URL).replace(/\/+$/, "");
}
