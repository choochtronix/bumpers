// Generates the crawlable gear model pages, the gear index, and the sitemap
// from data/gear-models.json. Editorial content lives in the data file; this
// script owns the HTML/schema scaffold so every model page stays consistent.
//
// Usage:
//   node scripts/build-gear-pages.mjs           # write files
//   node scripts/build-gear-pages.mjs --check    # verify files are up to date (no writes)
//
// After adding a model, paste the printed llms.txt + aeo-check sync blocks into
// server.js and scripts/aeo-check.mjs (those hand-maintained files are not
// rewritten automatically).

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_PATH = join(ROOT, "data", "gear-models.json");

// Non-model sitemap entries, in their existing order. Gear model URLs are
// appended from the data file so crawlers see every model page.
const STATIC_SITEMAP = [
  ["https://brrtz.com/", "2026-06-26"],
  ["https://brrtz.com/about", "2026-06-26"],
  ["https://brrtz.com/for-agents", "2026-06-26"],
  ["https://brrtz.com/chatgpt", "2026-07-25"],
  ["https://brrtz.com/agent-connector", "2026-06-26"],
  ["https://brrtz.com/regions", "2026-06-26"],
  ["https://brrtz.com/regions/japan", "2026-06-26"],
  ["https://brrtz.com/regions/bay-area", "2026-06-26"],
  ["https://brrtz.com/regions/los-angeles", "2026-06-26"],
  ["https://brrtz.com/regions/east-coast", "2026-06-26"],
  ["https://brrtz.com/sources", "2026-06-26"],
  ["https://brrtz.com/gear", "2026-06-26"],
];

function jsonArray(values) {
  return `[${values.map((value) => JSON.stringify(value)).join(", ")}]`;
}

function renderGearPage(model) {
  const url = `https://brrtz.com/gear/${model.slug}`;
  const title = `Used ${model.name} Search - Brrtz`;
  const pill = (region, label) =>
    `            <a class="aeo-pill-link" href="/search?region=${region}&amp;category=${model.categoryParam}&amp;q=${model.searchQuery}">${label}</a>`;
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <meta name="description" content="${model.metaDescription}" />
    <link rel="canonical" href="${url}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${model.ogDescription}" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="https://brrtz.com/assets/social/brrtz-og.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content="${model.metaDescription}" />
    <link rel="icon" type="image/svg+xml" href="/assets/ICONS-site/b-favicon.svg" />
    <link rel="stylesheet" href="/design-system.css" />
    <link rel="stylesheet" href="/aeo.css" />
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "CollectionPage",
            "@id": "${url}#webpage",
            "url": "${url}",
            "name": "${title}",
            "isPartOf": {
              "@id": "https://brrtz.com/#website"
            },
            "about": {
              "@id": "${url}#model"
            },
            "description": "${model.collectionDescription}",
            "breadcrumb": {
              "@id": "${url}#breadcrumb"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://brrtz.com/search?region=japan&category=${model.categoryParam}&q={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "ProductModel",
            "@id": "${url}#model",
            "name": "${model.name}",
            "alternateName": ${jsonArray(model.schema.alternateName)},
            "category": "${model.schema.category}",
            "manufacturer": {
              "@type": "Organization",
              "name": "${model.schema.manufacturer}"
            },
            "description": "${model.schema.description}",
            "sameAs": ${jsonArray(model.schema.sameAs)}
          },
          {
            "@type": "BreadcrumbList",
            "@id": "${url}#breadcrumb",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Brrtz",
                "item": "https://brrtz.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Gear pages",
                "item": "https://brrtz.com/gear"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "${model.name}",
                "item": "${url}"
              }
            ]
          }
        ]
      }
    </script>
  </head>
  <body>
    <div class="aeo-shell">
      <header class="aeo-header">
        <a class="aeo-logo" href="/" aria-label="Brrtz home"></a>
        <nav class="aeo-nav" aria-label="Brrtz pages">
          <a href="/gear">Gear pages</a>
          <a href="/regions">Regions</a>
          <a href="/sources">Sources</a>
          <a href="/for-agents">For agents</a>
        </nav>
      </header>

      <main class="aeo-page">
        <section class="aeo-hero">
          <p class="aeo-kicker">Model search</p>
          <h1>Used <span class="aeo-gradient">${model.name}</span> listings.</h1>
          <p class="aeo-lede">${model.lede}</p>
          <div class="aeo-link-list">
${pill("japan", "Search Japan")}
${pill("bay-area", "Search Bay Area")}
${pill("los-angeles", "Search Los Angeles")}
${pill("east-coast", "Search East Coast")}
          </div>
        </section>

        <section class="aeo-section">
          <h2>What it is</h2>
          <p>${model.sections.whatItIs}</p>
        </section>

        <section class="aeo-section">
          <h2>Buying one used — what to check</h2>
          <p>${model.sections.buyingUsed}</p>
        </section>

        <section class="aeo-section">
          <h2>Regional sourcing notes</h2>
          <p>${model.sections.regionalNotes}</p>
        </section>

        <section class="aeo-section">
          <h2>Model terms</h2>
          <p>${model.sections.modelTerms}</p>
        </section>

        <section class="aeo-section">
          <h2>Category</h2>
          <p>Primary Brrtz category: ${model.categoryLabel}.</p>
        </section>

        <section class="aeo-section">
          <h2>What Brrtz searches</h2>
          <p>Brrtz searches supported regional source groups for used ${model.name} listings and related ${model.categoryNoun} matches, then links users back to original listing sources.</p>
          <div class="aeo-link-list">
            <a class="aeo-pill-link" href="/sources">View sources</a>
            <a class="aeo-pill-link" href="/regions">View regions</a>
            <a class="aeo-pill-link" href="/for-agents">Agent guide</a>
          </div>
        </section>

        <section class="aeo-section">
          <h2>Listing boundary</h2>
          <p>Brrtz does not sell ${model.boundaryName}, does not act as the merchant of record, and does not claim source inventory as Brrtz-owned content.</p>
        </section>
      </main>

      <footer class="aeo-footer">
        <span>Gear page: ${model.name}</span>
        <span>© 2026 Brrtz</span>
      </footer>
    </div>
  </body>
</html>
`;
}

function renderIndex(models) {
  const cards = models
    .map(
      (model) => `          <article class="aeo-card">
            <h2>${model.name}</h2>
            <p>${model.indexCardDescription}</p>
            <a class="aeo-pill-link" href="/gear/${model.slug}">Open model page</a>
          </article>`,
    )
    .join("\n");
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Gear Model Pages - Brrtz</title>
    <meta name="description" content="Crawlable Brrtz model-intent pages for used synth and drum machine searches." />
    <link rel="canonical" href="https://brrtz.com/gear" />
    <meta property="og:title" content="Gear Model Pages - Brrtz" />
    <meta property="og:description" content="Start Brrtz searches for classic synth and drum machine models." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://brrtz.com/gear" />
    <meta property="og:image" content="https://brrtz.com/assets/social/brrtz-og.svg" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:description" content="Crawlable Brrtz model-intent pages for used synth and drum machine searches." />
    <link rel="icon" type="image/svg+xml" href="/assets/ICONS-site/b-favicon.svg" />
    <link rel="stylesheet" href="/design-system.css" />
    <link rel="stylesheet" href="/aeo.css" />
  </head>
  <body>
    <div class="aeo-shell">
      <header class="aeo-header">
        <a class="aeo-logo" href="/" aria-label="Brrtz home"></a>
        <nav class="aeo-nav" aria-label="Brrtz pages">
          <a href="/about">About</a>
          <a href="/regions">Regions</a>
          <a href="/sources">Sources</a>
          <a href="/for-agents">For agents</a>
        </nav>
      </header>

      <main class="aeo-page">
        <section class="aeo-hero">
          <p class="aeo-kicker">Gear pages</p>
          <h1>Model-aware searches for <span class="aeo-gradient">classic gear</span>.</h1>
          <p class="aeo-lede">These pages give search engines and agents durable model-intent URLs while sending humans into live Brrtz searches.</p>
        </section>

        <section class="aeo-section">
          <h2>Start by region</h2>
          <p>Brrtz supports regional used-gear searches across Japan, Bay Area, Los Angeles, and East Coast source groups.</p>
          <div class="aeo-link-list">
            <a class="aeo-pill-link" href="/search?region=japan&amp;category=all&amp;q=synthesizer">Search Japan</a>
            <a class="aeo-pill-link" href="/search?region=bay-area&amp;category=all&amp;q=synthesizer">Search Bay Area</a>
            <a class="aeo-pill-link" href="/search?region=los-angeles&amp;category=all&amp;q=synthesizer">Search Los Angeles</a>
            <a class="aeo-pill-link" href="/search?region=east-coast&amp;category=all&amp;q=synthesizer">Search East Coast</a>
          </div>
        </section>

        <section class="aeo-grid">
${cards}
        </section>
      </main>

      <footer class="aeo-footer">
        <span>Model-intent prototype</span>
        <span>© 2026 Brrtz</span>
      </footer>
    </div>
  </body>
</html>
`;
}

function renderSitemap(models) {
  const entries = [
    ...STATIC_SITEMAP,
    ...models.map((model) => [`https://brrtz.com/gear/${model.slug}`, model.lastmod]),
  ];
  const body = entries
    .map(([loc, lastmod]) => `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function renderSyncBlocks(models) {
  const llms = models
    .map((model) => `  "- [${model.name}](https://brrtz.com/gear/${model.slug}): Model-intent page.",`)
    .join("\n");
  const sitemapUrls = models
    .map((model) => `  "https://brrtz.com/gear/${model.slug}",`)
    .join("\n");
  const gearPages = models
    .map((model) => `  ["/gear/${model.slug}", ["Used", "${model.name}", "listings"]],`)
    .join("\n");
  return [
    "── MANUAL SYNC ─────────────────────────────────────────────",
    "server.js  llms.txt block (replace the model-page lines under 'Gear model pages'):",
    llms,
    "",
    "scripts/aeo-check.mjs  requiredSitemapUrls (gear model entries):",
    sitemapUrls,
    "",
    "scripts/aeo-check.mjs  gearPages array entries:",
    gearPages,
    "────────────────────────────────────────────────────────────",
  ].join("\n");
}

function main() {
  const models = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const check = process.argv.includes("--check");
  const outputs = [
    [join(ROOT, "sitemap.xml"), renderSitemap(models)],
    [join(ROOT, "gear", "index.html"), renderIndex(models)],
    ...models.map((model) => [join(ROOT, "gear", `${model.slug}.html`), renderGearPage(model)]),
  ];

  let stale = 0;
  for (const [path, content] of outputs) {
    if (check) {
      let current = "";
      try {
        current = readFileSync(path, "utf8");
      } catch {
        current = "";
      }
      if (current !== content) {
        stale += 1;
        console.error(`STALE: ${path}`);
      }
    } else {
      writeFileSync(path, content);
    }
  }

  if (check) {
    if (stale > 0) {
      console.error(`\n${stale} file(s) out of date. Run: node scripts/build-gear-pages.mjs`);
      process.exit(1);
    }
    console.log(`gear pages up to date (${models.length} models).`);
    return;
  }

  console.log(`Wrote ${models.length} gear pages + gear index + sitemap.`);
  console.log(renderSyncBlocks(models.slice(3)));
}

main();
