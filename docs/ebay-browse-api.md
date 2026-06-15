# eBay Browse API Setup For Brrtz

Brrtz uses eBay's official Browse API instead of scraping eBay pages.

## What Brrtz Uses

- OAuth client-credentials token request.
- Browse API item summary search.
- Marketplace header: `EBAY_US`.
- Default category narrowing to eBay category `619` (Musical Instruments & Gear).
- Optional category overrides with `EBAY_CATEGORY_IDS`.

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

Do not commit real values. Use `.env.local` locally and Railway Variables in production. Leave `EBAY_CATEGORY_IDS` blank unless you intentionally want to override the built-in category `619` default.

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
- eBay is treated as US/global inventory for Bay Area and Los Angeles beta regions. It is not local-only.

## Category IDs

Brrtz currently defaults to `619` (Musical Instruments & Gear). If a more precise set of synth/pro-audio category IDs is verified later, add a comma-separated override through `EBAY_CATEGORY_IDS` and run golden searches with Gear Mode spot checks.
