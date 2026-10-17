import test from "node:test";
import assert from "node:assert/strict";

import { serverFunctions } from "./helpers/server-functions.js";

const context = serverFunctions([
  "decodeHtml",
  "cleanText",
  "matchOne",
  "readAttribute",
  "normalizeUrl",
  "splitCategoryPath",
  "unixTimestampToIso",
  "formatYahooEndDate",
  "createYahooAuctionCondition",
  "parseYahooAuctionsNextData",
  "parseYahooAuctions",
  "normalizeText",
  "classifyMercariLoadFailure",
], {
  YAHOO_AUCTIONS_BASE_URL: "https://auctions.yahoo.co.jp",
  normalizeSourceListedAt: (value) => String(value || ""),
});

test("Yahoo Auctions parses the current Next.js listing payload", () => {
  const payload = {
    props: {
      pageProps: {
        initialState: {
          search: {
            items: {
              listing: {
                items: [{
                  auctionId: "e1234567890",
                  bidCount: 2,
                  buyNowPrice: 22000,
                  category: { id: 2084240149, name: "Moog" },
                  categoryPath: [{ id: 22436 }, { id: 2084019003 }, { id: 2084240149 }],
                  endTime: "2026-10-18T20:10:14+09:00",
                  imageUrl: "https://example.test/moog.jpg",
                  initPriceNoTax: 15000,
                  price: 15500,
                  startTime: "2026-10-14T17:10:15+09:00",
                  title: "Moog MAVIS assembled",
                }],
              },
            },
          },
        },
      },
    },
  };
  const html = `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(payload)}</script>`;

  const listings = context.parseYahooAuctions(html);

  assert.equal(listings.length, 1);
  assert.equal(listings[0].id, "yahoo-auctions-e1234567890");
  assert.equal(listings[0].price, 15500);
  assert.equal(listings[0].auction.buyoutPrice, 22000);
  assert.equal(listings[0].auction.bidCount, 2);
  assert.deepEqual([...listings[0].categoryPath], ["22436", "2084019003", "2084240149"]);
  assert.equal(listings[0].url, "https://auctions.yahoo.co.jp/jp/auction/e1234567890");
});

test("Yahoo Auctions ignores malformed structured data without breaking legacy fallback", () => {
  const html = [
    '<script id="__NEXT_DATA__" type="application/json">not-json</script>',
    '<li class="Product"><div data-auction-id="a123" data-auction-title="Moog One"',
    ' data-auction-img="https://example.test/moog-one.jpg" data-auction-price="900000"',
    ' data-auction-category="2084240149" data-auction-categoryidpath="22436/2084019003/2084240149">',
    '<a href="/jp/auction/a123">Moog One</a></li>',
  ].join("");

  const listings = context.parseYahooAuctions(html);

  assert.equal(listings.length, 1);
  assert.equal(listings[0].id, "yahoo-auctions-a123");
});

test("Mercari load failures distinguish an empty search from blocked automation", () => {
  assert.equal(context.classifyMercariLoadFailure({
    title: "Please wait",
    bodyText: "Security verification powered by Cloudflare",
  }), "security_verification");
  assert.equal(context.classifyMercariLoadFailure({
    bodyText: "検索条件に一致する商品が見つかりませんでした",
  }), "empty");
  assert.equal(context.classifyMercariLoadFailure({ bodyText: "Loading" }), "timeout");
});
