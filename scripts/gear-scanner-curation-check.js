import fs from "node:fs";
import { chromium } from "playwright";

const baseUrl = process.argv[2] || "http://127.0.0.1:5173";
const fixturePath = new URL("../test/fixtures/gear-scanner-curation.json", import.meta.url);
const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf8"));

const browser = await chromium.launch({
  executablePath: "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox"]
});

try {
  const page = await browser.newPage();
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });

  const results = await page.evaluate(({ excluded, included }) => {
    const classify = (title, index) => {
      const listing = {
        id: `fixture-${index}`,
        source: "yahoo-auctions",
        region: "japan",
        currency: "JPY",
        title,
        price: 120000,
        condition: "Used",
        listedAt: new Date().toISOString(),
        url: `https://example.com/listing/${index}`,
        image: "https://example.com/image.jpg"
      };
      return {
        title,
        ...classifyGearScannerListing(listing)
      };
    };

    return {
      excluded: excluded.map((title, index) => classify(title, index)),
      included: included.map((title, index) => classify(title, index + excluded.length))
    };
  }, fixtures);

  const failures = [];
  for (const result of results.excluded) {
    if (result.include || !result.hardExcluded) {
      failures.push(`Expected excluded: ${result.title} :: ${result.reasons.join("; ")}`);
    }
  }

  for (const result of results.included) {
    if (!result.include || result.hardExcluded) {
      failures.push(`Expected included: ${result.title} :: ${result.reasons.join("; ")}`);
    }
  }

  if (failures.length > 0) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log("Gear Scanner curation fixtures passed.");
    console.log(JSON.stringify(results, null, 2));
  }
} finally {
  await browser.close();
}
