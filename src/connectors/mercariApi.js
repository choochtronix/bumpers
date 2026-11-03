import {
  generateKeyPairSync,
  randomBytes,
  randomUUID,
  sign,
} from "node:crypto";

export const MERCARI_SEARCH_API_URL = "https://api.mercari.jp/v2/entities:search";

function encodeBase64Url(value) {
  const input = typeof value === "string" ? value : JSON.stringify(value);
  return Buffer.from(input).toString("base64url");
}

export function createMercariDpopProof({
  url = MERCARI_SEARCH_API_URL,
  method = "POST",
  nowMs = Date.now(),
  jti = randomUUID(),
  keyPair = generateKeyPairSync("ec", { namedCurve: "P-256" }),
} = {}) {
  const publicJwk = keyPair.publicKey.export({ format: "jwk" });
  const header = encodeBase64Url({
    typ: "dpop+jwt",
    alg: "ES256",
    jwk: {
      kty: publicJwk.kty,
      crv: publicJwk.crv,
      x: publicJwk.x,
      y: publicJwk.y,
    },
  });
  const payload = encodeBase64Url({
    htu: url,
    htm: String(method).toUpperCase(),
    iat: Math.floor(nowMs / 1000),
    jti,
  });
  const signature = sign(
    "sha256",
    Buffer.from(`${header}.${payload}`),
    { key: keyPair.privateKey, dsaEncoding: "ieee-p1363" },
  ).toString("base64url");

  return `${header}.${payload}.${signature}`;
}

export function createMercariSearchBody(term, {
  pageSize = 40,
  searchSessionId = randomBytes(16).toString("hex"),
  deviceUuid = randomUUID(),
} = {}) {
  return {
    userId: "",
    config: { responseToggles: ["QUERY_SUGGESTION_WEB_1"] },
    pageSize: Math.max(1, Math.min(120, Math.trunc(Number(pageSize) || 40))),
    pageToken: "",
    searchSessionId,
    source: "BaseSerp",
    indexRouting: "INDEX_ROUTING_UNSPECIFIED",
    thumbnailTypes: [],
    searchCondition: {
      keyword: String(term || "").trim(),
      excludeKeyword: "",
      sort: "SORT_CREATED_TIME",
      order: "ORDER_DESC",
      status: ["STATUS_ON_SALE"],
      sizeId: [],
      categoryId: [],
      brandId: [],
      sellerId: [],
      priceMin: 0,
      priceMax: 0,
      itemConditionId: [],
      shippingPayerId: [],
      shippingFromArea: [],
      shippingMethod: [],
      colorId: [],
      hasCoupon: false,
      attributes: [],
      itemTypes: [],
      skuIds: [],
      shopIds: [],
      excludeShippingMethodIds: [],
    },
    serviceFrom: "suruga",
    withItemBrand: true,
    withItemSize: false,
    withItemPromotions: true,
    withItemSizes: true,
    withShopname: false,
    useDynamicAttribute: true,
    withSuggestedItems: true,
    withOfferPricePromotion: true,
    withProductSuggest: true,
    withParentProducts: false,
    withProductArticles: true,
    withSearchConditionId: false,
    withAuction: true,
    laplaceDeviceUuid: deviceUuid,
  };
}

export async function fetchMercariSearchPayload(term, {
  fetchImpl = fetch,
  userAgent,
  signal,
  timeoutMs = 6000,
  pageSize = 40,
} = {}) {
  const requestSignal = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
    : AbortSignal.timeout(timeoutMs);
  const response = await fetchImpl(MERCARI_SEARCH_API_URL, {
    method: "POST",
    headers: {
      accept: "application/json, text/plain, */*",
      "accept-language": "en",
      "content-type": "application/json",
      dpop: createMercariDpopProof(),
      referer: "https://jp.mercari.com/",
      "user-agent": userAgent,
      "x-country-code": "JP",
      "x-platform": "web",
    },
    body: JSON.stringify(createMercariSearchBody(term, { pageSize })),
    signal: requestSignal,
  });
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(`Mercari search API responded with ${response.status}.`);
  }
  if (!Array.isArray(payload?.items)) {
    throw new Error("Mercari search API returned an unexpected response.");
  }

  return payload;
}
