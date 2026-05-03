import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = fileURLToPath(new URL(".", import.meta.url));
const DIGIMART_BASE_URL = "https://www.digimart.net";
const OFFMALL_BASE_URL = "https://netmall.hardoff.co.jp";
const USER_AGENT = "Bumpers/0.1 local personal gear search";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (url.pathname === "/api/search") {
      await handleSearch(url, response);
      return;
    }

    await serveStatic(url.pathname, response);
  } catch (error) {
    sendJson(response, 500, {
      error: "server_error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}).listen(PORT, HOST, () => {
  console.log(`Bumpers running at http://${HOST}:${PORT}`);
});

async function handleSearch(url, response) {
  const terms = splitParam(url.searchParams.get("terms"));
  const excludes = splitParam(url.searchParams.get("excludes")).map(normalizeText);
  const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
  const sources = splitParam(url.searchParams.get("sources"));
  const wantsDigimart = sources.length === 0 || sources.includes("digimart");
  const wantsOffmall = sources.length === 0 || sources.includes("offmall") || sources.includes("hardoff");
  const startedAt = new Date();

  if ((!wantsDigimart && !wantsOffmall) || terms.length === 0) {
    sendJson(response, 200, { listings: [], meta: createSearchMeta(startedAt, [], [], terms) });
    return;
  }

  const listingsById = new Map();
  const sourceStats = [];
  const errors = [];

  if (wantsDigimart) {
    const sourceResult = await searchSourceTerms("digimart", terms, searchDigimart);
    sourceStats.push(sourceResult.stats);
    errors.push(...sourceResult.errors);
    collectFilteredListings(sourceResult.listings, listingsById, excludes, maxPrice);
  }

  if (wantsOffmall) {
    const sourceResult = await searchSourceTerms("offmall", terms, searchOffmall);
    sourceStats.push(sourceResult.stats);
    errors.push(...sourceResult.errors);
    collectFilteredListings(sourceResult.listings, listingsById, excludes, maxPrice);
  }

  sendJson(response, 200, {
    listings: [...listingsById.values()].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt)),
    meta: createSearchMeta(startedAt, sourceStats, errors, terms),
  });
}

function collectFilteredListings(listings, listingsById, excludes, maxPrice) {
  for (const listing of listings) {
    const title = normalizeText(listing.title);
    const excluded = excludes.some((exclude) => title.includes(exclude));
    const tooExpensive = maxPrice > 0 && listing.price > maxPrice;

    if (!excluded && !tooExpensive) {
      listingsById.set(listing.id, listing);
    }
  }
}

async function searchSourceTerms(source, terms, searchFn) {
  const listingsById = new Map();
  const errors = [];
  const searchedTerms = terms.slice(0, 5);

  for (const term of searchedTerms) {
    try {
      const listings = await searchFn(term);
      listings.forEach((listing) => listingsById.set(listing.id, listing));
    } catch (error) {
      errors.push({
        source,
        term,
        message: error instanceof Error ? error.message : "Unknown connector error",
      });
    }

    await wait(700);
  }

  return {
    listings: [...listingsById.values()],
    errors,
    stats: {
      source,
      status: errors.length === searchedTerms.length ? "error" : errors.length > 0 ? "partial" : "ok",
      searchedTerms,
      rawCount: listingsById.size,
    },
  };
}

function createSearchMeta(startedAt, sourceStats, errors, terms) {
  return {
    searchedAt: new Date().toISOString(),
    durationMs: Date.now() - startedAt.getTime(),
    liveSources: sourceStats.map((item) => item.source),
    sourceStats,
    errors,
    searchedTerms: terms.slice(0, 5),
  };
}

async function searchDigimart(term) {
  const url = new URL("/search", DIGIMART_BASE_URL);
  url.searchParams.set("keywordAnd", term);
  url.searchParams.set("sortKey", "INITIAL_PUBLIC_DATE_DESC");
  url.searchParams.set("nosoldoutp", "true");
  url.searchParams.set("readCount", "20");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Digimart responded with ${response.status}`);
  }

  return parseDigimart(await response.text());
}

async function searchOffmall(term) {
  const url = new URL("/search/", OFFMALL_BASE_URL);
  url.searchParams.set("q", term);
  url.searchParams.set("s", "1");
  url.searchParams.set("pl", "30");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  const html = await response.text();

  if (!response.ok && response.status !== 404) {
    throw new Error(`OFFMALL responded with ${response.status}`);
  }

  return parseOffmall(html);
}

function parseDigimart(html) {
  const blocks = html.match(/<div class="itemSearchBlock itemSearchListItem[\s\S]*?<!-- \/.itemSearchBlock --><\/div>/g) || [];

  return blocks.map((block) => {
    const rawId = matchOne(block, /data-instrument-cd="([^"]+)"/);
    const href = matchOne(block, /<p class="ttl"><a href="([^"]+)">/);
    const title = cleanText(matchOne(block, /<p class="ttl"><a href="[^"]+">([\s\S]*?)<\/a><\/p>/));
    const image = normalizeUrl(matchOne(block, /<div class="pic">[\s\S]*?<img src="([^"]+)"/));
    const price = Number(cleanText(matchOne(block, /<p class="price">([\s\S]*?)<\/p>/)).replace(/[^\d]/g, ""));
    const registeredDate = matchOne(block, /登録：(\d{4}\/\d{2}\/\d{2})/);
    const condition = cleanText(matchOne(block, /状態：<span class="tooltip">([\s\S]*?)<\/span>/)) || "Listed";
    const shop = cleanText(matchOne(block, /<p class="itemShopInfo"><a href="[^"]+">([\s\S]*?)<\/a><\/p>/));

    return {
      id: `digimart-${rawId}`,
      source: "digimart",
      title,
      price,
      condition,
      shop,
      listedAt: registeredDate ? `${registeredDate.replaceAll("/", "-")}T00:00:00+09:00` : new Date().toISOString(),
      url: normalizeUrl(href),
      image,
    };
  }).filter((listing) => listing.id !== "digimart-" && listing.title && listing.url);
}

function parseOffmall(html) {
  const blocks = html.match(/<div class="itemcolmn_item[\s\S]*?<button class="item-fav-button[\s\S]*?<\/button>\s*<\/div>/g) || [];

  return blocks.map((block) => {
    const href = matchOne(block, /<a href="([^"]*\/product\/(\d+)\/)"[\s\S]*?>/);
    const rawId = href.match(/\/product\/(\d+)\//)?.[1] || matchOne(block, /data-goodsno="([^"]+)"/);
    const image = normalizeUrl(matchOne(block, /<img[^>]+src="([^"]+)"[^>]+data-object-fit="contain"/), OFFMALL_BASE_URL);
    const brand = cleanText(matchOne(block, /<div class="item-brand-name">([\s\S]*?)<\/div>/));
    const name = cleanText(matchOne(block, /<div class="item-name">([\s\S]*?)<\/div>/));
    const code = cleanText(matchOne(block, /<div class="item-code">([\s\S]*?)<\/div>/));
    const rank = matchOne(block, /<span class="item-price-icon">[\s\S]*?<img[^>]+alt="([^"]*)"/i).toUpperCase();
    const price = Number(cleanText(matchOne(block, /<span class="font-en item-price-en">([\s\S]*?)<\/span>/)).replace(/[^\d]/g, ""));
    const isFresh = block.includes("入荷ホヤホヤ");

    return {
      id: `offmall-${rawId}`,
      source: "offmall",
      title: [brand, name, code].filter(Boolean).join(" "),
      price,
      condition: rank || (isFresh ? "New arrival" : "Listed"),
      shop: "OFFMALL / Hard Off",
      listedAt: new Date().toISOString(),
      url: normalizeUrl(href, OFFMALL_BASE_URL),
      image,
    };
  }).filter((listing) => listing.id !== "offmall-" && listing.title && listing.url);
}

async function serveStatic(pathname, response) {
  const safePath = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(ROOT, safePath);

  if (!filePath.startsWith(ROOT)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const contents = await readFile(filePath);
  response.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
  });
  response.end(contents);
}

function sendJson(response, status, payload) {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function splitParam(value) {
  return (value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchOne(value, pattern) {
  return value.match(pattern)?.[1] || "";
}

function cleanText(value) {
  return decodeHtml(value.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(value) {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&yen;/g, "¥")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function normalizeUrl(value, baseUrl = DIGIMART_BASE_URL) {
  if (!value) return "";
  if (value.startsWith("//")) return `https:${value}`;
  if (value.startsWith("/")) return `${baseUrl}${value}`;
  return value;
}

function normalizeText(value) {
  return value.toLocaleLowerCase("ja-JP").normalize("NFKC");
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
