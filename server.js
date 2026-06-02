import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { networkInterfaces } from "node:os";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.PORT || 5173);
const HOST = process.env.HOST || "0.0.0.0";
const ROOT = fileURLToPath(new URL(".", import.meta.url));
const DIGIMART_BASE_URL = "https://www.digimart.net";
const FIVE_G_BASE_URL = "https://fiveg.net";
const IMPLANT4_BASE_URL = "https://shop.implant4.com";
const JIMOTY_BASE_URL = "https://jmty.jp";
const MERCARI_BASE_URL = "https://jp.mercari.com";
const OFFMALL_BASE_URL = "https://netmall.hardoff.co.jp";
const RAKUMA_BASE_URL = "https://fril.jp";
const REVERB_API_BASE_URL = "https://api.reverb.com";
const REVERB_BASE_URL = "https://reverb.com";
const YAHOO_AUCTIONS_BASE_URL = "https://auctions.yahoo.co.jp";
const YAHOO_FLEAMARKET_BASE_URL = "https://paypayfleamarket.yahoo.co.jp";
const MERCARI_CACHE_TTL_MS = 5 * 60 * 1000;
const MERCARI_CONNECTOR_TIMEOUT_MS = 12000;
const MERCARI_RESULT_LIMIT = 40;
const MERCARI_TERM_LIMIT = 2;
const REVERB_RESULT_LIMIT = 32;
const REVERB_TERM_LIMIT = 3;
const RAKUMA_THUMBNAIL_BATCH_SIZE = 4;
const RAKUMA_THUMBNAIL_LIMIT = 32;
const RAKUMA_IMAGE_PROXY_CACHE_TTL_MS = 15 * 60 * 1000;
const YAHOO_AUCTIONS_PAGE_SIZE = 100;
const YAHOO_AUCTIONS_DEFAULT_CATEGORY_SWEEPS = [
  "",
  "22436", // Musical instruments
  "2084019003", // Keyboards and synthesizers
];
const YAHOO_AUCTIONS_RHYTHM_CATEGORY = "2084019005";
const YAHOO_AUCTIONS_RHYTHM_TERMS = [
  "drum machine",
  "drum machines",
  "rhythm machine",
  "ドラムマシン",
  "リズムマシン",
  "リズムボックス",
];
const USER_AGENT = "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Bumpers/0.1 local personal gear search";
const mercariCache = new Map();
const rakumaThumbnailCache = new Map();
const rakumaImageProxyCache = new Map();
let mercariBrowserPromise;

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", `http://${request.headers.host}`);

    if (url.pathname === "/api/search") {
      await handleSearch(url, response);
      return;
    }

    if (url.pathname === "/api/rakuma-image") {
      await handleRakumaImageProxy(url, response);
      return;
    }

    if (url.pathname === "/api/rakuma-thumbnail") {
      await handleRakumaThumbnail(url, response);
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
  console.log(`Bumpers running locally at http://127.0.0.1:${PORT}`);
  for (const url of getLanUrls(PORT)) {
    console.log(`Bumpers available on your Wi-Fi at ${url}`);
  }
});

function getLanUrls(port) {
  return Object.values(networkInterfaces())
    .flat()
    .filter((details) => details && details.family === "IPv4" && !details.internal)
    .map((details) => `http://${details.address}:${port}`);
}

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, async () => {
    await closeMercariBrowser();
    process.exit(0);
  });
}

async function handleSearch(url, response) {
  const terms = createSourceSearchTerms(splitParam(url.searchParams.get("terms")));
  const excludes = splitParam(url.searchParams.get("excludes"));
  const maxPrice = Number(url.searchParams.get("maxPrice") || 0);
  const sources = splitParam(url.searchParams.get("sources"));
  const wantsDigimart = sources.length === 0 || sources.includes("digimart");
  const wantsFiveG = sources.length === 0 || sources.includes("five-g");
  const wantsImplant4 = sources.length === 0 || sources.includes("implant4");
  const wantsJimoty = sources.length === 0 || sources.includes("jimoty");
  const wantsMercari = sources.length === 0 || sources.includes("mercari");
  const wantsOffmall = sources.length === 0 || sources.includes("offmall") || sources.includes("hardoff");
  const wantsRakuma = sources.length === 0 || sources.includes("rakuma");
  const wantsReverb = sources.length === 0 || sources.includes("reverb");
  const wantsYahooAuctions = sources.length === 0 || sources.includes("yahoo-auctions");
  const wantsYahooFleamarket = sources.length === 0 || sources.includes("yahoo-fleamarket");
  const startedAt = new Date();

  if ((!wantsDigimart && !wantsFiveG && !wantsImplant4 && !wantsJimoty && !wantsMercari && !wantsOffmall && !wantsRakuma && !wantsReverb && !wantsYahooAuctions && !wantsYahooFleamarket) || terms.length === 0) {
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

  if (wantsFiveG) {
    sourceTasks.push(searchSourceTerms("five-g", terms, searchFiveG, {
      maxTerms: 3,
    }));
  }

  if (wantsImplant4) {
    sourceTasks.push(searchSourceTerms("implant4", terms, searchImplant4, {
      maxTerms: 3,
    }));
  }

  if (wantsJimoty) {
    sourceTasks.push(searchSourceTerms("jimoty", terms, searchJimoty, {
      maxTerms: 3,
    }));
  }

  if (wantsOffmall) {
    sourceTasks.push(searchSourceTerms("offmall", terms, searchOffmall));
  }

  if (wantsRakuma) {
    sourceTasks.push(searchSourceTerms("rakuma", terms, searchRakuma));
  }

  if (wantsReverb) {
    sourceTasks.push(searchSourceTerms("reverb", terms, searchReverb, {
      maxTerms: REVERB_TERM_LIMIT,
    }));
  }

  if (wantsYahooAuctions) {
    sourceTasks.push(searchSourceTerms("yahoo-auctions", terms, searchYahooAuctions));
  }

  if (wantsYahooFleamarket) {
    sourceTasks.push(searchSourceTerms("yahoo-fleamarket", terms, searchYahooFleamarket));
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

  const listings = [...listingsById.values()].sort((a, b) => new Date(b.listedAt) - new Date(a.listedAt));
  await hydrateRakumaThumbnails(listings.filter((listing) => listing.source === "rakuma"));

  sendJson(response, 200, {
    listings,
    meta: createSearchMeta(startedAt, sourceStats, errors, terms),
  });
}

function collectFilteredListings(listings, listingsById, excludes, maxPrice) {
  for (const listing of listings) {
    const title = normalizeText(listing.title);
    const excluded = excludes.some((exclude) => termMatches(title, exclude));
    const tooExpensive = maxPrice > 0 && listing.price > maxPrice;
    const unavailable = isUnavailableListing(listing);

    if (!excluded && !tooExpensive && !unavailable) {
      listingsById.set(listing.id, listing);
    }
  }
}

async function handleRakumaImageProxy(url, response) {
  const imageUrl = url.searchParams.get("url") || "";

  if (!isAllowedRakumaImageUrl(imageUrl)) {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    response.end("Unsupported image URL");
    return;
  }

  const cached = rakumaImageProxyCache.get(imageUrl);
  if (cached && Date.now() - cached.createdAt < RAKUMA_IMAGE_PROXY_CACHE_TTL_MS) {
    sendImage(response, cached);
    return;
  }

  const upstream = await fetch(imageUrl, {
    headers: {
      "user-agent": USER_AGENT,
      "accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      "referer": RAKUMA_BASE_URL,
    },
  });

  if (!upstream.ok) {
    response.writeHead(upstream.status, { "content-type": "text/plain; charset=utf-8" });
    response.end(`Image request failed with ${upstream.status}`);
    return;
  }

  const image = {
    body: Buffer.from(await upstream.arrayBuffer()),
    contentType: upstream.headers.get("content-type") || "image/jpeg",
    createdAt: Date.now(),
  };
  rakumaImageProxyCache.set(imageUrl, image);
  sendImage(response, image);
}

async function handleRakumaThumbnail(url, response) {
  const itemUrl = url.searchParams.get("url") || "";

  if (!isAllowedRakumaItemUrl(itemUrl)) {
    sendJson(response, 400, { error: "unsupported_item_url" });
    return;
  }

  sendJson(response, 200, { image: await fetchRakumaThumbnail(itemUrl) });
}

function sendImage(response, image) {
  response.writeHead(200, {
    "content-type": image.contentType,
    "cache-control": "private, max-age=900",
  });
  response.end(image.body);
}

function isAllowedRakumaImageUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === "img.fril.jp";
  } catch {
    return false;
  }
}

function isAllowedRakumaItemUrl(value) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && parsed.hostname === "item.fril.jp";
  } catch {
    return false;
  }
}

function isUnavailableListing(listing) {
  const status = normalizeText([
    listing.condition,
    listing.availability,
    listing.itemStatus,
  ].filter(Boolean).join(" "));

  return [
    "sold",
    "soldout",
    "sold out",
    "売り切れ",
    "売切れ",
    "売約済",
    "売却済",
    "販売済",
    "成約済",
    "ended",
    "終了",
    "受付終了",
    "closed",
  ].some((token) => status.includes(normalizeText(token)));
}

async function searchSourceTerms(source, terms, searchFn, options = {}) {
  const listingsById = new Map();
  const errors = [];
  const searchedTerms = terms.slice(0, options.maxTerms ?? 5);
  const termDelayMs = options.termDelayMs ?? 700;

  for (const [index, term] of searchedTerms.entries()) {
    try {
      const listings = await searchFn(term);
      listings.forEach((listing) => {
        const existing = listingsById.get(listing.id);
        const image = existing && isPlaceholderImage(listing.image) && !isPlaceholderImage(existing.image)
          ? existing.image
          : listing.image;

        listingsById.set(listing.id, { ...listing, image });
      });
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

async function searchFiveG(term) {
  const url = new URL("/", FIVE_G_BASE_URL);
  url.searchParams.set("mode", "srh");
  url.searchParams.set("field", "product_name");
  url.searchParams.set("keyword", term);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Five G responded with ${response.status}`);
  }

  return parseFiveG(await decodeResponseBody(response));
}

async function searchImplant4(term) {
  const url = new URL("/search", IMPLANT4_BASE_URL);
  url.searchParams.set("type", "product");
  url.searchParams.set("options[prefix]", "last");
  url.searchParams.set("options[unavailable_products]", "last");
  url.searchParams.set("q", term);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`implant4 responded with ${response.status}`);
  }

  return parseImplant4(await response.text());
}

async function searchJimoty(term) {
  const url = new URL("/all/sale-inc", JIMOTY_BASE_URL);
  url.searchParams.set("keyword", term);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Jimoty responded with ${response.status}`);
  }

  return parseJimoty(await decodeResponseBody(response));
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

async function searchRakuma(term) {
  const url = new URL(`/search/${encodeURIComponent(term)}`, RAKUMA_BASE_URL);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Rakuma responded with ${response.status}`);
  }

  return parseRakuma(await response.text());
}

async function searchReverb(term) {
  const url = new URL("/api/listings", REVERB_API_BASE_URL);
  url.searchParams.set("query", `country:jp ${term}`);
  url.searchParams.set("per_page", String(REVERB_RESULT_LIMIT));
  url.searchParams.set("display_currency", "JPY");
  url.searchParams.set("sort", "published_at|desc");

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept": "application/hal+json",
      "accept-version": "3.0",
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Reverb responded with ${response.status}`);
  }

  return parseReverb(await response.json());
}

async function searchYahooAuctions(term) {
  const listingsById = new Map();
  const categorySweeps = getYahooAuctionsCategorySweeps(term);

  for (const categoryId of categorySweeps) {
    const html = await fetchYahooAuctionsSearch(term, categoryId);
    parseYahooAuctions(html).forEach((listing) => listingsById.set(listing.id, listing));

    if (categoryId !== categorySweeps.at(-1)) {
      await wait(400);
    }
  }

  return [...listingsById.values()];
}

async function searchYahooFleamarket(term) {
  const url = new URL(`/search/${encodeURIComponent(term)}`, YAHOO_FLEAMARKET_BASE_URL);

  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
      "accept-language": "ja,en-US;q=0.9,en;q=0.8",
    },
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(`Yahoo Fleamarket responded with ${response.status}`);
  }

  return parseYahooFleamarket(await response.text());
}

function getYahooAuctionsCategorySweeps(term) {
  const normalized = normalizeText(term);
  const shouldSearchRhythmCategory = YAHOO_AUCTIONS_RHYTHM_TERMS.some((item) => normalized.includes(normalizeText(item)));
  const categorySweeps = shouldSearchRhythmCategory
    ? [...YAHOO_AUCTIONS_DEFAULT_CATEGORY_SWEEPS, YAHOO_AUCTIONS_RHYTHM_CATEGORY]
    : YAHOO_AUCTIONS_DEFAULT_CATEGORY_SWEEPS;

  return [...new Set(categorySweeps)];
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

  if (response.status === 404) {
    return "";
  }

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

function parseFiveG(html) {
  const searchResultList = matchOne(html, /<ul class="product-list productlist-list row">([\s\S]*?)<\/ul>/) || "";
  const blocks = searchResultList.match(/<li class="product-list__unit productlist-list__unit[\s\S]*?<\/li>/g) || [];
  const listedAt = new Date().toISOString();

  return blocks.map((block) => {
    const href = readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]+class="product-list__link"/i)
      || readAttributeFromPattern(block, /<a[^>]+class="product-list__link"[^>]+href="([^"]+)"/i);
    const url = normalizeRelativeUrl(href, FIVE_G_BASE_URL);
    const rawId = url.match(/[?&]pid=(\d+)/)?.[1] || href;
    const title = cleanText(matchOne(block, /<a[^>]+class="product-list__name[^"]*"[^>]*>([\s\S]*?)<\/a>/i));
    const description = cleanText(matchOne(block, /<p class="product-list__expl[^"]*"[^>]*>([\s\S]*?)<\/p>/i));
    const image = normalizeRelativeUrl(readAttributeFromPattern(block, /<img[^>]+src="([^"]+)"/i), FIVE_G_BASE_URL);
    const price = parseYenPrice(matchOne(block, /<span class="product-list__price[^"]*"[^>]*>([\s\S]*?)<\/span>/i));
    const condition = title.includes("中古") || description.includes("中古") ? "Used" : "Listed";

    return {
      id: `five-g-${rawId}`,
      source: "five-g",
      title,
      price,
      condition,
      shop: "Five G",
      listedAt,
      url,
      image,
    };
  }).filter((listing) => listing.id !== "five-g-" && listing.title && listing.url && listing.price > 0);
}

function parseImplant4(html) {
  const collectionStart = html.indexOf('<div class="product-list product-list--collection">');
  const collectionHtml = collectionStart >= 0 ? html.slice(collectionStart) : html;
  const blocks = splitHtmlBlocks(collectionHtml, /<div class="product-item product-item--vertical\b/g);
  const listedAt = new Date().toISOString();

  return blocks.map((block) => {
    const href = readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]+class="product-item__title/i)
      || readAttributeFromPattern(block, /<a[^>]+class="product-item__title[^"]*"[^>]+href="([^"]+)"/i)
      || readAttributeFromPattern(block, /data-product-url="([^"]+)"/i);
    const url = normalizeRelativeUrl(href, IMPLANT4_BASE_URL);
    const rawId = url.match(/\/products\/([^/?#]+)/)?.[1] || readAttributeFromPattern(block, /data-product-url="\/products\/([^"?]+)[^"]*"/i) || href;
    const title = cleanText(matchOne(block, /<a[^>]+class="product-item__title[^"]*"[^>]*>([\s\S]*?)<\/a>/i));
    const vendor = cleanText(matchOne(block, /<a[^>]+class="product-item__vendor[^"]*"[^>]*>([\s\S]*?)<\/a>/i));
    const image = normalizeRelativeUrl(
      normalizeShopifyImage(
        readAttributeFromPattern(block, /<img[^>]+class="product-item__primary-image[^"]*"[^>]+data-src="([^"]+)"/i)
          || readAttributeFromPattern(block, /<img[^>]+data-src="([^"]+)"[^>]+class="product-item__primary-image/i)
          || readAttributeFromPattern(block, /<img[^>]+src="([^"]+)"/i),
      ),
      IMPLANT4_BASE_URL,
    );
    const priceList = matchOne(block, /<div class="product-item__price-list price-list">([\s\S]*?)<\/div>/i);
    const price = parseYenPrice(priceList);
    const inventory = cleanText(matchOne(block, /<span class="product-item__inventory[^"]*"[^>]*>([\s\S]*?)<\/span>/i)) || "Listed";

    return {
      id: `implant4-${rawId}`,
      source: "implant4",
      title,
      price,
      condition: inventory,
      shop: vendor ? `implant4 · ${vendor}` : "implant4",
      listedAt,
      url,
      image,
    };
  }).filter((listing) => listing.id !== "implant4-" && listing.title && listing.url && listing.price > 0);
}

function parseJimoty(html) {
  const blocks = splitHtmlBlocks(html, /<li class='p-articles-list-item'>/g);

  return blocks.map((block) => {
    const href = readAttributeFromPattern(block, /<a[^>]+class="p-item-image-link"[^>]+href="([^"]+)"/i)
      || readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]*>[\s\S]*?<\/a>/i);
    const url = normalizeRelativeUrl(href, JIMOTY_BASE_URL);
    const rawId = url.match(/\/article-([^/?#]+)/)?.[1] || href;
    const title = cleanText(matchOne(block, /<div class='p-item-title'>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i))
      || cleanText(readAttributeFromPattern(block, /<img[^>]+alt="([^"]+)"/i));
    const price = parseYenPrice(matchOne(block, /<div class='p-item-most-important'>[\s\S]*?<b>([\s\S]*?)<\/b>/i));
    const image = normalizeRelativeUrl(readAttributeFromPattern(block, /<img[^>]+class="p-item-image"[^>]+src="([^"]+)"/i), JIMOTY_BASE_URL);
    const closeLabel = cleanText(matchOne(block, /<div class='p-item-close-text'>[\s\S]*?([\s\S]*?)<\/div>/i));
    const area = cleanText(matchOne(block, /<div class='p-item-secondary-important'>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/i));
    const category = cleanText(matchOne(block, /<a href="\/all\/sale-inc\/g-[^"]+">([\s\S]*?)<\/a>/i));
    const createdAt = cleanText(matchOne(block, /<div class='u-color-gray'>[\s\S]*?作成(\d{1,2}月\d{1,2}日)[\s\S]*?<\/div>/i));

    return {
      id: `jimoty-${rawId}`,
      source: "jimoty",
      title,
      price,
      condition: closeLabel || "Listed",
      shop: ["Jimoty", area, category].filter(Boolean).join(" · "),
      listedAt: parseJapaneseMonthDay(createdAt) || new Date().toISOString(),
      url,
      image,
      categoryPath: category ? [category] : [],
    };
  }).filter((listing) => listing.id !== "jimoty-" && listing.title && listing.url);
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

function parseRakuma(html) {
  const blocks = html.match(/<div class="item">\s*<div class="item-box">[\s\S]*?(?=<div class="item">\s*<div class="item-box">|<\/section>)/g) || [];
  const listedAt = new Date().toISOString();

  return blocks.map((block) => {
    const href = normalizeUrl(
      readAttributeFromPattern(block, /<a[^>]+href="([^"]+)"[^>]+class="link_search_title"/)
        || readAttributeFromPattern(block, /<a[^>]+class="link_search_title"[^>]+href="([^"]+)"/),
      RAKUMA_BASE_URL,
    );
    const rawId = readAttributeFromPattern(block, /data-rat-itemid="([^"]+)"/).split("/").at(-1) || href.match(/item\.fril\.jp\/([^/?#]+)/)?.[1] || "";
    const title = cleanText(readAttributeFromPattern(block, /data-rat-item_name="([^"]+)"/))
      || cleanText(matchOne(block, /<p class="item-box__item-name">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/));
    const price = Number(readAttributeFromPattern(block, /data-rat-price="([^"]+)"/) || readAttributeFromPattern(block, /data-content="(\d+)"/));
    const brand = cleanText(matchOne(block, /<a[^>]+class="brand-name"[^>]*>([\s\S]*?)<\/a>/));
    const categoryId = readAttributeFromPattern(block, /data-rat-igenre="([^"]+)"/);
    const image = createSourcePlaceholderImage("Rakuma", "#12a05c");

    return {
      id: `rakuma-${rawId}`,
      source: "rakuma",
      title,
      price,
      condition: block.includes("soldout") || block.includes("売り切れ") ? "Sold" : "Listed",
      shop: brand ? `Rakuma · ${brand}` : "Rakuma",
      listedAt,
      url: href,
      image,
      categoryId,
    };
  }).filter((listing) => listing.id !== "rakuma-" && listing.title && listing.url);
}

async function hydrateRakumaThumbnails(listings) {
  const targets = listings
    .filter((listing) => listing.image.startsWith("data:image/svg+xml"))
    .slice(0, RAKUMA_THUMBNAIL_LIMIT);

  for (let index = 0; index < targets.length; index += RAKUMA_THUMBNAIL_BATCH_SIZE) {
    const batch = targets.slice(index, index + RAKUMA_THUMBNAIL_BATCH_SIZE);
    const images = await Promise.all(batch.map((listing) => fetchRakumaThumbnail(listing.url)));

    images.forEach((image, imageIndex) => {
      if (image) {
        batch[imageIndex].image = image;
      }
    });

    if (index + RAKUMA_THUMBNAIL_BATCH_SIZE < targets.length) {
      await wait(250);
    }
  }
}

async function fetchRakumaThumbnail(url) {
  if (!url) return "";
  if (rakumaThumbnailCache.has(url)) return rakumaThumbnailCache.get(url);

  try {
    const response = await fetch(url, {
      headers: {
        "user-agent": USER_AGENT,
        "accept-language": "ja,en-US;q=0.9,en;q=0.8",
      },
    });

    if (!response.ok) {
      rakumaThumbnailCache.set(url, "");
      return "";
    }

    const image = extractRakumaThumbnail(await response.text());
    rakumaThumbnailCache.set(url, image);
    return image;
  } catch {
    rakumaThumbnailCache.set(url, "");
    return "";
  }
}

function extractRakumaThumbnail(html) {
  const image = normalizeUrl(
    readAttributeFromPattern(html, /<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i)
      || readAttributeFromPattern(html, /<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i)
      || matchOne(html, /<img[^>]+src="([^"]*img\.fril\.jp[^"]+)"/i),
    RAKUMA_BASE_URL,
  );
  return createRakumaImageProxyUrl(image);
}

function createRakumaImageProxyUrl(image) {
  if (!isAllowedRakumaImageUrl(image)) return image;
  return `/api/rakuma-image?url=${encodeURIComponent(image)}`;
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

function parseReverb(data) {
  return (data?.listings || []).map((item) => {
    const rawId = String(item.id || "");
    const categories = Array.isArray(item.categories)
      ? item.categories.map((category) => cleanText(String(category.full_name || ""))).filter(Boolean)
      : [];
    const condition = [
      cleanText(String(item.condition?.display_name || "")),
      item.state?.description && item.state?.slug !== "live" ? cleanText(String(item.state.description)) : "",
      ...categories,
    ].filter(Boolean).join(" · ") || "Listed";

    return {
      id: `reverb-${rawId}`,
      source: "reverb",
      title: cleanText(String(item.title || [item.make, item.model].filter(Boolean).join(" "))),
      price: parseReverbPrice(item.price),
      condition,
      shop: cleanText(String(item.shop_name || "")),
      listedAt: item.published_at || item.created_at || new Date().toISOString(),
      url: normalizeUrl(item._links?.web?.href || `/item/${rawId}`, REVERB_BASE_URL),
      image: normalizeUrl(
        item.photos?.[0]?._links?.large_crop?.href
          || item.photos?.[0]?._links?.small_crop?.href
          || item._links?.photo?.href
          || "",
        REVERB_BASE_URL,
      ),
      categoryPath: categories,
      availability: item.state?.slug || "",
    };
  }).filter((listing) => listing.id !== "reverb-" && listing.title && listing.url && listing.price > 0);
}

function parseReverbPrice(price) {
  if (!price) return 0;
  if (price.currency === "JPY") return Number(String(price.amount || "").replace(/[^\d]/g, ""));
  return Number(String(price.amount_cents || "0").replace(/[^\d]/g, "")) / 100;
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

function isPlaceholderImage(image) {
  return !image || image.startsWith("data:image/svg+xml");
}

function pruneMercariCache() {
  const now = Date.now();
  for (const [key, cached] of mercariCache) {
    if (now - cached.createdAt >= MERCARI_CACHE_TTL_MS) {
      mercariCache.delete(key);
    }
  }
}

function parseYahooFleamarket(html) {
  const script = matchOne(html, /<script id="__NEXT_DATA__" type="application\/json"[^>]*>([\s\S]*?)<\/script>/);
  if (!script) return [];

  const data = JSON.parse(script);
  const items = data?.props?.initialState?.searchState?.search?.result?.items || [];

  return items.map((item) => {
    const rawId = String(item.id || "");
    const categoryPath = Array.isArray(item.category?.path)
      ? item.category.path.map((category) => String(category.id)).filter(Boolean)
      : [];

    return {
      id: `yahoo-fleamarket-${rawId}`,
      source: "yahoo-fleamarket",
      title: cleanText(String(item.title || "")),
      price: Number(item.price || 0),
      condition: formatYahooFleamarketCondition(item),
      shop: "Yahoo Fleamarket",
      listedAt: item.openTime || new Date().toISOString(),
      url: normalizeUrl(`/item/${rawId}`, YAHOO_FLEAMARKET_BASE_URL),
      image: normalizeUrl(item.thumbnailImageUrl || "", YAHOO_FLEAMARKET_BASE_URL),
      categoryId: item.category?.id ? String(item.category.id) : "",
      categoryPath,
    };
  }).filter((listing) => listing.id !== "yahoo-fleamarket-" && listing.title && listing.url);
}

function formatYahooFleamarketCondition(item) {
  const parts = [];
  if (item.itemStatus === "SOLD") parts.push("Sold");
  if (String(item.condition || "").startsWith("used")) parts.push("Used");
  if (String(item.condition || "").startsWith("new")) parts.push("New/unused");
  if (item.isPriceDown) parts.push("Price down");
  return parts.join(" · ") || "Listed";
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
    "cache-control": "no-store",
  });
  response.end(contents);
}

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function splitParam(value) {
  return (value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createSourceSearchTerms(terms) {
  const seen = new Set();
  return terms
    .map((term) => parseMatchTerm(term).value)
    .filter((term) => {
      const normalized = normalizeText(term);
      if (!normalized || seen.has(normalized)) return false;
      seen.add(normalized);
      return true;
    });
}

function termMatches(searchable, term) {
  const matchTerm = parseMatchTerm(term);
  const normalized = normalizeText(matchTerm.value);
  if (!normalized) return false;

  if (matchTerm.exact) {
    return exactPhraseMatches(searchable, normalized);
  }

  if (/^[a-z0-9]+$/.test(normalized) && normalized.length <= 3) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalized)}($|[^a-z0-9])`).test(searchable);
  }

  return searchable.includes(normalized);
}

function parseMatchTerm(term) {
  const value = String(term || "").trim();
  const quotePairs = [
    ['"', '"'],
    ["'", "'"],
    ["“", "”"],
    ["‘", "’"],
  ];
  const quotePair = quotePairs.find(([open, close]) => value.startsWith(open) && value.endsWith(close) && value.length >= open.length + close.length + 1);

  if (!quotePair) {
    return { exact: false, value };
  }

  return {
    exact: true,
    value: value.slice(quotePair[0].length, value.length - quotePair[1].length).trim(),
  };
}

function exactPhraseMatches(searchable, normalizedPhrase) {
  const phrase = normalizedPhrase.replace(/\s+/g, " ").trim();
  if (!phrase) return false;

  const phrasePattern = phrase.split(/\s+/).map(escapeRegExp).join("\\s+");
  const startBoundary = /^[a-z0-9]/.test(phrase) ? "(^|[^a-z0-9])" : "";
  const endBoundary = /[a-z0-9]$/.test(phrase) ? "($|[^a-z0-9])" : "";
  return new RegExp(`${startBoundary}${phrasePattern}${endBoundary}`).test(searchable);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function splitCategoryPath(value) {
  return (value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function decodeResponseBody(response) {
  const contentType = response.headers.get("content-type") || "";
  const charset = contentType.match(/charset=([^;]+)/i)?.[1]?.trim().toLowerCase() || "utf-8";
  const body = Buffer.from(await response.arrayBuffer());

  try {
    return new TextDecoder(charset).decode(body);
  } catch {
    return body.toString("utf8");
  }
}

function splitHtmlBlocks(html, markerPattern) {
  const starts = [...html.matchAll(markerPattern)].map((match) => match.index).filter((index) => typeof index === "number");
  return starts.map((start, index) => html.slice(start, starts[index + 1] || html.length));
}

function parseYenPrice(value) {
  const text = cleanText(String(value || ""));
  const yenMatch = text.match(/(?:¥|￥)?\s*([\d,]+)\s*(?:円|¥|￥)/);
  const rawPrice = yenMatch?.[1] || text.match(/(?:¥|￥)\s*([\d,]+)/)?.[1] || "";
  return rawPrice ? Number(rawPrice.replace(/[^\d]/g, "")) : 0;
}

function normalizeRelativeUrl(value, baseUrl) {
  if (!value) return "";
  if (value.startsWith("//")) return `https:${value}`;

  try {
    return new URL(value, baseUrl).toString();
  } catch {
    return value;
  }
}

function normalizeShopifyImage(value) {
  return String(value || "").replace("{width}", "600");
}

function matchOne(value, pattern) {
  return value.match(pattern)?.[1] || "";
}

function readAttribute(value, attributeName) {
  const escapedName = attributeName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return decodeHtml(matchOne(value, new RegExp(`${escapedName}="([^"]*)"`, "i")));
}

function readAttributeFromPattern(value, pattern) {
  return decodeHtml(matchOne(value, pattern));
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

function parseJapaneseMonthDay(value) {
  const match = String(value || "").match(/(\d{1,2})月(\d{1,2})日/);
  if (!match) return "";

  const now = new Date();
  const year = now.getFullYear();
  const month = Number(match[1]);
  const day = Number(match[2]);
  if (!month || !day) return "";

  const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

function createSourcePlaceholderImage(label, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540"><rect width="720" height="540" fill="${color}"/><rect x="28" y="28" width="664" height="484" rx="34" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.28)" stroke-width="3"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="64" font-weight="800" letter-spacing="0">${label}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function wait(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
