# eBay Browse API Setup For Brrtz

Brrtz uses eBay's official Browse API instead of scraping eBay pages.

## What Brrtz Uses

- OAuth client-credentials token request.
- Browse API item summary search.
- Marketplace header: `EBAY_US`.
- Optional category narrowing with `EBAY_CATEGORY_IDS`.

## Required Environment Variables

```text
EBAY_CLIENT_ID=
EBAY_CLIENT_SECRET=
EBAY_MARKETPLACE_ID=EBAY_US
```

Optional:

```text
EBAY_CATEGORY_IDS=
```

Do not commit real values. Use `.env.local` locally and Railway Variables in production.

## Local Test Flow

1. Add credentials to `.env.local`.
2. Restart Brrtz with `npm start`.
3. Open `/api/health` and confirm:

```json
{
  "ebayConfigured": true
}
```

4. Run a narrow local search:

```bash
BRRTZ_QA_SOURCES=ebay-us BRRTZ_QA_REGION=bay-area npm run qa:golden-searches
```

5. Spot-check Brrtz UI in Bay Area and Los Angeles regions.

## Production Test Flow

1. Add the same eBay values to Railway Variables.
2. Redeploy.
3. Check:

```bash
curl https://brrtz.com/api/health
```

4. Run:

```bash
BRRTZ_QA_BASE_URL=https://brrtz.com BRRTZ_QA_SOURCES=ebay-us npm run qa:golden-searches
```

## QA Notes

- If credentials are missing, source health skips eBay so the beta health report does not show false failures.
- If a user explicitly searches with eBay selected and credentials are missing, the eBay source pill should show an isolated source error.
- Keep Gear Mode on while evaluating broad eBay terms; eBay is expected to be noisier than Reverb and music-specialist shops.

## Category IDs

Leave `EBAY_CATEGORY_IDS` blank until eBay category IDs are verified in the developer account. Once verified, add a comma-separated list and run golden searches with Gear Mode spot checks.
