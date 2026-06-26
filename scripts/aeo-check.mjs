const DEFAULT_BASE_URL = "http://127.0.0.1:5173";
const baseUrl = normalizeBaseUrl(process.env.AEO_BASE_URL || process.argv[2] || DEFAULT_BASE_URL);

const bannedStrings = [
  ["Drum Machine, no ", "cat pee smell"].join(""),
  ["Mock ", "data"].join(""),
  ["alpha@bumpers", ".local"].join(""),
  ["local@bumpers", ".dev"].join(""),
  ["Â®", "ion"].join(""),
];

const requiredSitemapUrls = [
  "https://brrtz.com/",
  "https://brrtz.com/about",
  "https://brrtz.com/regions",
  "https://brrtz.com/regions/japan",
  "https://brrtz.com/regions/bay-area",
  "https://brrtz.com/regions/los-angeles",
  "https://brrtz.com/regions/east-coast",
  "https://brrtz.com/sources",
  "https://brrtz.com/for-agents",
  "https://brrtz.com/gear",
  "https://brrtz.com/gear/moog-minimoog",
  "https://brrtz.com/gear/arp-2600",
  "https://brrtz.com/gear/roland-tr-808",
  "https://brrtz.com/agent-connector",
];

const gearPages = [
  ["/gear", ["Model-aware searches for", "classic gear"]],
  ["/gear/moog-minimoog", ["Used", "Moog Minimoog", "listings"]],
  ["/gear/arp-2600", ["Used", "ARP 2600", "listings"]],
  ["/gear/roland-tr-808", ["Used", "Roland TR-808", "listings"]],
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
  assertAgentTools(JSON.parse(agentTools.body));
  assertNoBannedStrings(agentTools.body, "/agent-tools.json");

  const sitemap = await fetchText("/sitemap.xml");
  assertStatus(sitemap, 200, "/sitemap.xml");
  assertXmlContentType(sitemap, "/sitemap.xml");
  assertXmlSitemap(sitemap.body);

  for (const path of ["/", "/search?region=bay-area&category=synthesizers&q=moog%20voyager"]) {
    const page = await fetchText(path);
    assertStatus(page, 200, path);
    assertNoBannedStrings(page.body, path);
  }

  const home = await fetchText("/");
  assert(home.body.includes("Brrtz beta gear radar"), "/ should use region-neutral beta gear radar branding");
  assert(!home.body.includes("Japan gear radar"), "/ should not imply Brrtz is Japan-only");
  assert(!home.body.includes("View via Buyee"), "/ should not expose generic Buyee copy in the crawler-visible shell");

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
  assert(body.includes("User-agent: *\n"), "/robots.txt should contain line-oriented User-agent directive");
  assert(body.includes("Allow: /\n\nDisallow: /api/"), "/robots.txt should separate Allow and Disallow directives with newlines");
  assert(body.includes("\nSitemap: https://brrtz.com/sitemap.xml"), "/robots.txt should include sitemap on its own line");
  assert(!body.includes("User-agent: * Allow:"), "/robots.txt should not flatten User-agent and Allow directives");
  assert(!body.includes("Allow: / Disallow:"), "/robots.txt should not flatten Allow and Disallow directives");
  assert(!body.includes("Disallow: /.env.local Sitemap:"), "/robots.txt should not flatten final Disallow and Sitemap directives");
  const lines = body.split(/\r?\n/).filter(Boolean);
  for (const line of lines) {
    const directiveCount = ["User-agent:", "Allow:", "Disallow:", "Sitemap:"].filter((directive) => line.includes(directive)).length;
    assert(directiveCount <= 1, `/robots.txt has concatenated directives on one line: ${line}`);
  }
}

function assertMarkdownLlms(body) {
  const normalizedBody = body.replace(/\r\n/g, "\n");
  assert(normalizedBody.startsWith("# Brrtz\n\n> "), "/llms.txt should start with H1 and blockquote summary");
  assert(normalizedBody.includes("- [Home and app]"), "/llms.txt should include Markdown public URL links");
  for (const section of ["## Boundaries and Safety", "## Public URLs", "## Supported Region IDs", "## Supported Category IDs", "## Search URL Pattern", "## Planned Connector Direction"]) {
    assert(normalizedBody.includes(`\n${section}\n`), `/llms.txt missing separate H2 section ${section}`);
  }
  for (const url of ["https://brrtz.com/", "https://brrtz.com/about", "https://brrtz.com/regions", "https://brrtz.com/sources", "https://brrtz.com/for-agents", "https://brrtz.com/gear", "https://brrtz.com/agent-connector", "https://brrtz.com/agent-tools.json"]) {
    assert(normalizedBody.includes(url), `/llms.txt missing ${url}`);
  }
  assert(!normalizedBody.includes("Â®ion"), "/llms.txt should not contain malformed region text");
}

function assertAgentTools(payload) {
  assert(payload.schemaVersion, "/agent-tools.json missing schemaVersion");
  assert(payload.lastUpdated, "/agent-tools.json missing lastUpdated");
  assert(payload.isLiveConnector === false, "/agent-tools.json should mark isLiveConnector false");
  assert(payload.currentSearchUrlPattern === "https://brrtz.com/search?region={region}&category={category}&q={query}", "/agent-tools.json must use exact region-first currentSearchUrlPattern");
  assert(Array.isArray(payload.currentCapabilities), "/agent-tools.json missing currentCapabilities");
  assert(Array.isArray(payload.plannedCapabilities), "/agent-tools.json missing plannedCapabilities");
  assert(Array.isArray(payload.boundaries), "/agent-tools.json missing boundaries");

  const expectedTools = ["search_gear", "get_regions", "get_sources", "save_search", "watch_listing", "get_new_matches"];
  const tools = new Map((payload.tools || []).map((tool) => [tool.name, tool]));
  for (const toolName of expectedTools) {
    const tool = tools.get(toolName);
    assert(tool, `/agent-tools.json missing planned tool ${toolName}`);
    for (const field of ["name", "status", "permission", "description", "inputSchema", "outputSchema"]) {
      assert(tool[field], `/agent-tools.json ${toolName} missing ${field}`);
    }
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
