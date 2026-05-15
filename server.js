import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = fileURLToPath(new URL(".", import.meta.url));
const DIGIMART_BASE_URL = "https://www.digimart.net";
const MERCARI_BASE_URL = "https://jp.mercari.com";
const OFFMALL_BASE_URL = "https://netmall.hardoff.co.jp";
const YAHOO_AUCTIONS_BASE_URL = "https://auctions.yahoo.co.jp";
const MERCARI_CACHE_TTL_MS = 5 * 60 * 1000;
const MERCARI_CONNECTOR_TIMEOUT_MS = 12000;
const MERCARI_RESULT_LIMIT = 40;
const MERCARI_TERM_LIMIT = 2;
const YAHOO_AUCTIONS_PAGE_SIZE = 100;
const YAHOO_AUCTIONS_CATEGORY_SWEEPS = [
  "",
  "22436", // Musical instruments
  "2084019003", // Keyboards and synthesizers
];
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Bumpers/0.1 local personal gear search";
const mercariCache = new Map();
let mercariBrowserPromise;

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

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await closeMercariBrowser();
    process.exit(0);
  });
}

async function handleSearch(url, response) {
  const terms = splitParam(url.searchParams.get("terms"));
  const excludes = splitParam(url.searchParams.get("excludes")).map(normalizeText);
  const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
  const sources = splitParam(url.searchParams.get("sources"));
  const wantsDigimart = sources.length === 0 || sources.includes("digimart");
  const wantsMercari = sources.length === 0 || sources.includes("mercari");
  const wantsOffmall = sources.length === 0 || sources.includes("offmall") || sources.includes("hardoff");
  const wantsYahooAuctions = sources.length === 0 || sources.includes("yahoo-auctions");
  const startedAt = new Date();

  if ((!wantsDigimart && !wantsMercari && !wantsOffmall && !wantsYahooAuctions) || terms.length === 0) {
    sendJson(response, 200, { listings: [], meta: createSearchMeta(startedAt, [], [], terms) });
    return;
  }

  const listingsById = new Map();
  const sourceStats = [];
  const errors = [];
  const sourceTasks = [];

  if (wantsDigimart) {
    sourceTasks.push(searchSourceTerms("digimart", terms, searchDigimart));
  }

  if (wantsOffmall) {
    sourceTasks.push(searchSourceTerms("offmall", terms, searchOffmall));
  }

  if (wantsYahooAuctions) {
    sourceTasks.push(searchSourceTerms("yahoo-auctions", terms, searchYahooAuctions));
  }

  if (wantsMercari) {
    sourceTasks.push(searchSourceTerms("mercari", terms, searchMercari, {
      maxTerms: MERCARI_TERM_LIMIT,
      termDelayMs: 0,
    }));
  }

  const sourceResults = await Promise.all(sourceTasks);
  for (const sourceResult of sourceResults) {
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

async function searchSourceTerms(source, terms, searchFn, options = {}) {
  const listingsById = new Map();
  const errors = [];
  const searchedTerms = terms.slice(0, options.maxTerms ?? 5);
  const termDelayMs = options.termDelayMs ?? 700;

  for (const [index, term] of searchedTerms.entries()) {
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

    if (termDelayMs > 0 && index < searchedTerms.length - 1) {
      await wait(termDelayMs);
    }
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

async function searchMercari(term) {
  const cacheKey = normalizeText(term);
  const cached = mercariCache.get(cacheKey);

  if (cached && Date.now() - cached.createdAt < MERCARI_CACHE_TTL_MS) {
    return cloneListings(cached.listings);
  }

  const browser = await getMercariBrowser();
  let page;

  try {
    page = await browser.newPage({
      userAgent: USER_AGENT,
      locale: "ja-JP",
    });
    page.setDefaultTimeout(MERCARI_CONNECTOR_TIMEOUT_MS);

    const url = new URL("/en/search", MERCARI_BASE_URL);
    url.searchParams.set("keyword", term);
    url.searchParams.set("sort", "created_time");
    url.searchParams.set("order", "desc");
    url.searchParams.set("status", "on_sale");

    await page.goto(url.toString(), {
      waitUntil: "domcontentloaded",
      timeout: MERCARI_CONNECTOR_TIMEOUT_MS,
    });

    try {
      await page.waitForSelector("a[data-testid='thumbnail-link'][href*='/item/']", {
        timeout: MERCARI_CONNECTOR_TIMEOUT_MS,
      });
    } catch {
      return [];
    }

    const cards = await page.$$eval(
      "a[data-testid='thumbnail-link'][href*='/item/']",
      (links, limit) => links.slice(0, limit).map((link) => {
        const imageNode = link.querySelector("img");
        const itemNode = link.querySelector("[id^='m']");
        const labelNode = link.querySelector("[aria-label^='Image of ']");

        return {
          href: link.getAttribute("href") || "",
          itemId: itemNode?.id || "",
          image: imageNode?.getAttribute("src") || "",
          label: labelNode?.getAttribute("aria-label") || "",
          text: link.textContent || "",
        };
      }),
      MERCARI_RESULT_LIMIT,
    );

    const listings = parseMercari(cards);
    mercariCache.set(cacheKey, {
      createdAt: Date.now(),
      listings: cloneListings(listings),
    });
    pruneMercariCache();
    return listings;
  } finally {
    if (page) await page.close();
  }
}

async function getMercariBrowser() {
  if (!mercariBrowserPromise) {
    mercariBrowserPromise = import("playwright")
      .then(({ chromium }) => chromium.launch({ headless: true }))
      .catch((error) => {
        mercariBrowserPromise = undefined;
        throw error;
      });
  }

  return mercariBrowserPromise;
}

async function closeMercariBrowser() {
  if (!mercariBrowserPromise) return;

  try {
    const browser = await mercariBrowserPromise;
    await browser.close();
  } finally {
    mercariBrowserPromise = undefined;
  }
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

async function searchYahooAuctions(term) {
  const listingsById = new Map();

  for (const categoryId of YAHOO_AUCTIONS_CATEGORY_SWEEPS) {
    const html = await fetchYahooAuctionsSearch(term, categoryId);
    parseYahooAuctions(html).forEach((listing) => listingsById.set(listing.id, listing));

    if (categoryId !== YAHOO_AUCTIONS_CATEGORY_SWEEPS.at(-1)) {
      await wait(400);
    }
  }

  return [...listingsById.values()];
}

async function fetchYahooAuctionsSearch(term, categoryId = "") {
  const url = new URL("/search/search", YAHOO_AUCTIONS_BASE_URL);
  url.searchParams.set("p", term);
  url.searchParams.set("va", term);
  url.searchParams.set("exflg", "1");
  if (categoryId) url.searchParams.set("auccat", categoryId);
  url.searchParams.set("b", "1");
  url.searchParams.set("n", String(YAHOO_AUCTIONS_PAGE_SIZE));
  url.searchParams.set("s1", "new");
  url.searchParams.set("o1", "d");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Yahoo Auctions responded with ${response.status}`);
  }

  return response.text();
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

function parseMercari(cards) {
  return cards.map((card) => {
    const href = normalizeUrl(card.href, MERCARI_BASE_URL);
    const rawId = card.itemId || href.match(/\/item\/(m\d+)/)?.[1] || "";
    const label = cleanMercariText(card.label).replace(/^Image of\s+/i, "");
    const price = parseMercariPrice(label) || parseMercariPrice(card.text);
    const title = cleanMercariTitle(label, price) || cleanMercariTitle(card.text, price);
    const isAuction = /Bid\s*¥/i.test(card.text);

    return {
      id: `mercari-${rawId}`,
      source: "mercari",
      title,
      price,
      condition: isAuction ? "Mercari auction" : "Listed",
      shop: "Mercari",
      listedAt: new Date().toISOString(),
      url: href,
      image: normalizeUrl(card.image, MERCARI_BASE_URL),
    };
  }).filter((listing) => listing.id !== "mercari-" && listing.title && listing.url);
}

function parseMercariPrice(value) {
  const text = cleanMercariText(value);
  const yenMarkMatch = text.match(/(?:Bid\s*)?¥\s*([\d,]+)/i);
  if (yenMarkMatch) return Number(yenMarkMatch[1].replace(/[^\d]/g, ""));

  const yenMatches = [...text.matchAll(/([\d,]+)\s*yen\b/gi)];
  const lastYenMatch = yenMatches.at(-1);
  return lastYenMatch ? Number(lastYenMatch[1].replace(/[^\d]/g, "")) : 0;
}

function cleanMercariTitle(value, price) {
  const pricePattern = price ? String(price).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

  return cleanMercariText(value)
    .replace(/^Image of\s+/i, "")
    .replace(/^Bid\s*¥\s*[\d,]+\s*/i, "")
    .replace(/^¥\s*[\d,]+\s*/i, "")
    .replace(pricePattern ? new RegExp(`\\s*${pricePattern}\\s*yen\\s*$`, "i") : /$/g, "")
    .replace(/\s*yen\s*$/i, "")
    .trim();
}

function cleanMercariText(value) {
  return (value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function cloneListings(listings) {
  return listings.map((listing) => ({ ...listing }));
}

function pruneMercariCache() {
  const now = Date.now();
  for (const [key, cached] of mercariCache) {
    if (now - cached.createdAt >= MERCARI_CACHE_TTL_MS) {
      mercariCache.delete(key);
    }
  }
}

function parseYahooAuctions(html) {
  const blocks = html.match(/<li class="Product">[\s\S]*?<\/li>/g) || [];

  return blocks.map((block) => {
    const rawId = matchOne(block, /data-auction-id="([^"]+)"/);
    const title = cleanText(readAttribute(block, "data-auction-title"));
    const image = normalizeUrl(readAttribute(block, "data-auction-img"), YAHOO_AUCTIONS_BASE_URL);
    const price = Number(readAttribute(block, "data-auction-price") || "0");
    const href = normalizeUrl(matchOne(block, /href="([^"]*\/jp\/auction\/[^"]+)"/), YAHOO_AUCTIONS_BASE_URL);
    const categoryId = readAttribute(block, "data-auction-category");
    const categoryPath = splitCategoryPath(readAttribute(block, "data-auction-categoryidpath"));
    const startTime = Number(matchOne(block, /st:(\d+)/)) || Number(matchOne(block, /stm=(\d+)/));
    const endTime = Number(matchOne(block, /data-auction-endtime="(\d+)"/)) || Number(matchOne(block, /end:(\d+)/)) || Number(matchOne(block, /etm=(\d+)/));
    const bidCount = cleanText(matchOne(block, /<dd class="Product__bid">([\s\S]*?)<\/dd>/));
    const remainingTime = cleanText(matchOne(block, /<dd class="Product__time[^"]*"[^>]*>([\s\S]*?)<\/dd>/));

    return {
      id: `yahoo-auctions-${rawId}`,
      source: "yahoo-auctions",
      title,
      price,
      condition: createYahooAuctionCondition(bidCount, remainingTime, endTime),
      shop: "Yahoo Auctions",
      listedAt: unixTimestampToIso(startTime) || new Date().toISOString(),
      url: href,
      image,
      categoryId,
      categoryPath,
    };
  }).filter((listing) => listing.id !== "yahoo-auctions-" && listing.title && listing.url);
}

function createYahooAuctionCondition(bidCount, remainingTime, endTime) {
  const parts = ["Auction"];
  if (bidCount) parts.push(`${bidCount} bids`);
  if (remainingTime) parts.push(`ends in ${remainingTime}`);
  if (!remainingTime && endTime) parts.push(`ends ${formatYahooEndDate(endTime)}`);
  return parts.join(" · ");
}

function formatYahooEndDate(timestamp) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(timestamp * 1000));
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

function splitCategoryPath(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function matchOne(value, pattern) {
  return value.match(pattern)?.[1] || "";
}

function readAttribute(value, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return decodeHtml(matchOne(value, new RegExp(`${escapedName}="([^"]*)"`, "i")));
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
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)))
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

function unixTimestampToIso(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp * 1000).toISOString();
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
