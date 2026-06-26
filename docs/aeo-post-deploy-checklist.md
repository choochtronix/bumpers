# AEO Post-Deploy Checklist

Use this after deploying AEO or agent-readiness changes to `brrtz.com`.

## Automated Check

Run the local AEO regression script against production:

```sh
AEO_BASE_URL=https://brrtz.com npm run aeo:check
```

For local verification before deploy:

```sh
npm start
npm run aeo:check
```

## Search Console

- Submit `https://brrtz.com/sitemap.xml` in Google Search Console.
- Inspect and request indexing for:
  - `https://brrtz.com/about`
  - `https://brrtz.com/regions`
  - `https://brrtz.com/sources`
  - `https://brrtz.com/for-agents`
  - `https://brrtz.com/gear`
  - `https://brrtz.com/agent-connector`
- Inspect key model pages:
  - `https://brrtz.com/gear/moog-minimoog`
  - `https://brrtz.com/gear/arp-2600`
  - `https://brrtz.com/gear/roland-tr-808`
- Request recrawl or removal for stale legacy URLs such as `/category/uncategorized/`.

## Structured Data And AEO Checks

- Run Google Rich Results Test on:
  - `https://brrtz.com/`
  - `https://brrtz.com/for-agents`
  - `https://brrtz.com/agent-connector`
  - `https://brrtz.com/gear/moog-minimoog`
  - `https://brrtz.com/gear/arp-2600`
  - `https://brrtz.com/gear/roland-tr-808`
- Run an `llms.txt` audit if available.

## Production Curl Checks

Verify public machine-readable files:

```sh
curl -i https://brrtz.com/robots.txt
curl -i https://brrtz.com/llms.txt
curl -i https://brrtz.com/agent-tools.json
curl -i https://brrtz.com/sitemap.xml
```

Confirm:

- `/robots.txt` is multi-line `text/plain`.
- `/llms.txt` is readable Markdown and has no malformed `Â®ion` text.
- `/agent-tools.json` parses as JSON.
- `/sitemap.xml` is valid XML and includes current AEO pages.

## Search Fallback Check

Verify the query-aware `/search` fallback:

```sh
curl -s "https://brrtz.com/search?region=bay-area&category=synthesizers&q=moog%20voyager" | grep "Search Brrtz for Moog Voyager in the Bay Area"
```

Parameterized `/search` pages should remain accessible to users and agents. They should use `noindex,follow` for traditional search engines to avoid infinite crawl space.
