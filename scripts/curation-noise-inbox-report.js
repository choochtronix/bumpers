import fs from "node:fs";

const inboxPath = new URL("../ops/curation/noise-inbox.jsonl", import.meta.url);

if (!fs.existsSync(inboxPath)) {
  console.log("No curation noise inbox found yet.");
  console.log("Tap \"This is noise\" on listings, then run this command again.");
  process.exit(0);
}

const lines = fs.readFileSync(inboxPath, "utf8")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean);

const records = [];
const parseFailures = [];

lines.forEach((line, index) => {
  try {
    records.push(JSON.parse(line));
  } catch (error) {
    parseFailures.push({ line: index + 1, message: error.message });
  }
});

const byKey = new Map();
for (const record of records) {
  const key = record.dedupeKey || record.listing?.url || record.listing?.title || "unknown";
  if (!byKey.has(key)) byKey.set(key, []);
  byKey.get(key).push(record);
}

const uniqueGroups = Array.from(byKey.entries())
  .map(([key, group]) => ({ key, group }))
  .sort((first, second) => second.group.length - first.group.length);

console.log(`Noise inbox records: ${records.length}`);
console.log(`Unique listing groups: ${uniqueGroups.length}`);
if (parseFailures.length) {
  console.log(`Parse failures: ${parseFailures.length}`);
  for (const failure of parseFailures.slice(0, 10)) {
    console.log(`- line ${failure.line}: ${failure.message}`);
  }
}

console.log("");
console.log("Top duplicate groups:");
for (const { key, group } of uniqueGroups.slice(0, 10)) {
  const latest = group.at(-1);
  console.log(`- ${group.length}x ${latest.listing?.title || "(missing title)"}`);
  console.log(`  key: ${key}`);
  console.log(`  source: ${latest.listing?.source || "unknown"} | url: ${latest.listing?.url || "missing"}`);
}

console.log("");
console.log("Recent pending examples:");
for (const record of records.slice(-20).reverse()) {
  console.log(`- ${record.listing?.title || "(missing title)"}`);
  console.log(`  source: ${record.listing?.source || "unknown"} | captured: ${record.capturedAt || "unknown"}`);
  console.log(`  url: ${record.listing?.url || "missing"}`);
}

console.log("");
console.log("Next step: review these examples, classify the reason, then promote approved titles and generalized rules into test/fixtures/gear-scanner-curation.json and gear-scanner-curation.js.");
