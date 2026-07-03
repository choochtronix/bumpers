import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:5173";
const limit = Number(process.argv[3] || 80);

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox"]
});

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1200 } });
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 30000 }).catch(() => {});
  await page.waitForFunction(
    () => typeof getCuratedGearScannerListings === "function" && document.querySelectorAll(".listing-card.is-browse-home-card").length > 0,
    null,
    { timeout: 30000 }
  );
  await page.waitForTimeout(1200);

  const report = await page.evaluate((candidateLimit) => {
    const rawListings = browseCategoryListings || [];
    const renderContext = createListingRenderContext();
    const curatedListings = getCuratedGearScannerListings(rawListings, {
      limit: 24,
      candidateLimit,
      renderContext
    });
    const displayedTitles = [...document.querySelectorAll(".listing-card.is-browse-home-card h3")]
      .map((node) => node.textContent.trim())
      .filter(Boolean);
    const rows = rawListings.slice(0, candidateLimit).map((listing) => {
      const classification = classifyGearScannerListing(listing, { renderContext });
      return {
        title: listing.title || "",
        source: listing.source || "",
        price: listing.priceLabel || listing.price || "",
        date: listing.listedAt || listing.firstSeenAt || listing.lastVerifiedAt || "",
        include: classification.include,
        score: Math.round(classification.score),
        category: classification.category,
        reasons: classification.reasons
      };
    });

    return {
      rawCount: rawListings.length,
      curatedCount: curatedListings.length,
      displayedCount: displayedTitles.length,
      displayedTitles,
      rows
    };
  }, limit);

  console.log(`Gear Scanner curation report for ${baseUrl}`);
  console.log(`Raw candidates: ${report.rawCount}`);
  console.log(`Curated sample: ${report.curatedCount}`);
  console.log(`Displayed homepage cards: ${report.displayedCount}`);
  console.log("\nDisplayed:");
  report.displayedTitles.forEach((title, index) => console.log(`${index + 1}. ${title}`));
  console.log("\nDecisions:");
  report.rows.forEach((row) => {
    const status = row.include ? "INCLUDED" : "EXCLUDED";
    const reason = row.reasons.slice(0, 6).join("; ");
    console.log(`${status} | score ${row.score} | ${row.category} | ${row.source} | ${row.price || "-"} | ${row.title} | reason: ${reason}`);
  });
} finally {
  await browser.close();
}
