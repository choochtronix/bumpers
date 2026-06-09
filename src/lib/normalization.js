import { GEAR_TAXONOMY } from "./gearTaxonomy.js";

const CURRENCY_PATTERNS = [
  { currency: "JPY", pattern: /(?:¥|￥)\s*([\d,]+)|([\d,]+)\s*円/i },
  { currency: "USD", pattern: /\$\s*([\d,]+(?:\.\d{1,2})?)/i },
];

export function normalizeListing(rawListing, options = {}) {
  const title = cleanTitle(rawListing.title || rawListing.rawTitle || "");
  const description = rawListing.description || rawListing.rawDescription || "";
  const sourceId = rawListing.source || rawListing.sourceId || options.sourceId || "unknown";
  const regionId = rawListing.regionId || options.regionId || inferRegionFromCurrency(rawListing.currency) || "japan";
  const text = `${title} ${description}`;
  const brand = detectBrand(text);
  const model = detectModel(text);
  const category = detectCategory(text, model);
  const condition = detectCondition(text, rawListing.condition);
  const price = normalizePrice(rawListing.price, rawListing.priceLabel || rawListing.rawPrice || text);
  const imageUrls = normalizeImages(rawListing.imageUrls || rawListing.rawImages || rawListing.image);
  const location = rawListing.location || rawListing.rawLocation || "";
  const sellerName = rawListing.sellerName || rawListing.shopName || rawListing.rawSeller || "";
  const status = normalizeStatus(rawListing);
  const noiseScore = estimateNoiseScore({ title, description, brand, model, category, imageUrls, sourceId });
  const qualityScore = estimateQualityScore({ title, description, brand, model, category, price, imageUrls, location, status, noiseScore });
  const trustScore = estimateTrustScore({ sourceId, price, imageUrls, sellerName });

  return {
    id: rawListing.id || rawListing.externalId || createListingFingerprint(sourceId, title, rawListing.sourceUrl || rawListing.url),
    rawListingId: rawListing.rawListingId || rawListing.id || null,
    sourceId,
    regionId,
    title,
    brand,
    model,
    category,
    gearType: inferGearType(category, model, text),
    priceAmount: price.amount,
    priceCurrency: price.currency || options.currency || inferCurrency(regionId),
    condition,
    location,
    sellerName,
    sellerType: inferSellerType(sellerName, sourceId),
    sourceUrl: rawListing.sourceUrl || rawListing.url || "",
    imageUrls,
    postedAt: normalizeDate(rawListing.postedAt || rawListing.listedAt || rawListing.rawPostedAt),
    fetchedAt: normalizeDate(rawListing.fetchedAt) || new Date().toISOString(),
    duplicateGroupId: rawListing.duplicateGroupId || null,
    qualityScore,
    noiseScore,
    trustScore,
    status,
    createdAt: normalizeDate(rawListing.createdAt) || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function cleanTitle(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .replace(/[【】]/g, "")
    .trim();
}

export function detectBrand(text) {
  const normalized = normalizeSearchText(text);
  return GEAR_TAXONOMY.brands.find((brand) => normalized.includes(normalizeSearchText(brand))) || null;
}

export function detectModel(text) {
  const normalized = normalizeSearchText(text);
  for (const [alias, canonical] of Object.entries(GEAR_TAXONOMY.aliases)) {
    const aliasPattern = normalizeSearchText(alias).replace(/[\s._-]+/g, "[\\s._-]*");
    if (new RegExp(`(^|[^a-z0-9])${aliasPattern}($|[^a-z0-9])`, "i").test(normalized)) {
      return canonical;
    }
  }

  const likelyModel = String(text || "").match(/\b[A-Z]{1,4}[-\s]?\d{1,4}[A-Z]?\b/i);
  return likelyModel ? canonicalizeModel(likelyModel[0]) : null;
}

export function detectCategory(text, model = "") {
  const normalized = normalizeSearchText(`${text} ${model}`);
  for (const [category, terms] of Object.entries(GEAR_TAXONOMY.categoryTerms)) {
    if (terms.some((term) => normalized.includes(normalizeSearchText(term)))) return category;
  }

  if (model && /\b(TR|DR|R)-?\d{1,4}\b/i.test(model)) return "drum-machine";
  if (model && /\b(DX|JUNO|JUPITER|PROPHET|OB|MINIMOOG|SH|JX|TG)-?\d*/i.test(model)) return "synth";
  return null;
}

export function detectCondition(text, fallback = "") {
  const normalized = normalizeSearchText(`${fallback} ${text}`);
  if (/(junk|ジャンク|難あり|parts|部品取り)/i.test(normalized)) return "junk";
  if (/(new|新品|未使用|unused|mint)/i.test(normalized)) return "new";
  if (/(excellent|美品|極美品|near mint)/i.test(normalized)) return "excellent";
  if (/(used|中古|vintage|ヴィンテージ|ビンテージ)/i.test(normalized)) return "used";
  return fallback || "unknown";
}

export function normalizePrice(priceValue, priceText = "") {
  if (Number.isFinite(Number(priceValue)) && Number(priceValue) > 0) {
    return { amount: Number(priceValue), currency: null };
  }

  const text = String(priceText || "");
  for (const { currency, pattern } of CURRENCY_PATTERNS) {
    const match = text.match(pattern);
    const value = match?.[1] || match?.[2];
    if (value) return { amount: Number(value.replace(/,/g, "")), currency };
  }

  return { amount: null, currency: null };
}

export function estimateQualityScore({ title, description, brand, model, category, price, imageUrls, location, status, noiseScore }) {
  let score = 35;
  if (title) score += 8;
  if (brand) score += 16;
  if (model) score += 18;
  if (category) score += 10;
  if (price.amount) score += 8;
  if (imageUrls.length > 0) score += 8;
  if (location) score += 4;
  if (description) score += 4;
  if (status !== "active") score -= 35;
  score -= Math.round(noiseScore * 0.35);
  return clampScore(score);
}

export function estimateNoiseScore({ title, description, brand, model, category, imageUrls }) {
  const normalized = normalizeSearchText(`${title} ${description}`);
  let score = 20;
  const noiseHits = GEAR_TAXONOMY.noiseTerms.filter((term) => normalized.includes(normalizeSearchText(term))).length;
  score += noiseHits * 16;
  if (!brand && !model) score += 20;
  if (!category) score += 12;
  if (imageUrls.length === 0) score += 8;
  if (/(shirt|fashion|lamp|comic|album|record|cd|dvd|poster|sticker)/i.test(normalized)) score += 18;
  if (brand || model) score -= 12;
  return clampScore(score);
}

export function estimateTrustScore({ sourceId, price, imageUrls, sellerName }) {
  let score = 50;
  if (["digimart", "offmall", "five-g", "implant4", "reverb"].includes(sourceId)) score += 18;
  if (["mercari", "rakuma", "yahoo-fleamarket", "jimoty"].includes(sourceId)) score -= 4;
  if (price.amount) score += 8;
  if (imageUrls.length > 0) score += 8;
  if (sellerName) score += 6;
  return clampScore(score);
}

function normalizeImages(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return [value].filter(Boolean);
}

function normalizeStatus(listing) {
  const status = normalizeSearchText([listing.status, listing.availability, listing.condition, listing.itemStatus].filter(Boolean).join(" "));
  if (/(sold|soldout|sold out|売り切れ|売切れ|売約済|販売済|ended|終了|受付終了|closed)/i.test(status)) return "sold";
  if (listing.hidden) return "hidden";
  return "active";
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function inferRegionFromCurrency(currency) {
  if (currency === "USD") return "bay-area";
  if (currency === "JPY") return "japan";
  return null;
}

function inferCurrency(regionId) {
  return regionId === "japan" ? "JPY" : "USD";
}

function inferSellerType(sellerName, sourceId) {
  if (["digimart", "offmall", "five-g", "implant4"].includes(sourceId)) return "shop";
  if (sellerName) return "individual";
  return "unknown";
}

function inferGearType(category, model, text) {
  const normalized = normalizeSearchText(`${model || ""} ${text || ""}`);
  if (category === "synth" && /(juno|jupiter|prophet|oberheim|moog|analog|アナログ)/i.test(normalized)) return "analog synthesizer";
  if (category === "synth" && /(dx|fm|tg-33|tg33)/i.test(normalized)) return "FM synth";
  if (category === "drum-machine") return "drum machine";
  if (category === "modular") return "eurorack / modular";
  return category || null;
}

function canonicalizeModel(value) {
  const compact = String(value || "").replace(/\s+/g, "-").toUpperCase();
  return GEAR_TAXONOMY.aliases[value] || GEAR_TAXONOMY.aliases[compact] || compact;
}

function createListingFingerprint(sourceId, title, url) {
  const input = `${sourceId}|${title}|${url}`;
  let hash = 0;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) - hash + input.charCodeAt(index)) | 0;
  }
  return `${sourceId}-${Math.abs(hash).toString(36)}`;
}

function normalizeSearchText(value) {
  return String(value || "").toLocaleLowerCase("ja-JP").normalize("NFKC");
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
}
