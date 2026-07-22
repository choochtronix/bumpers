import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const cssPaths = ["design-system.css", "styles.css", "aeo.css"];
const appPaths = ["app.js"];
const aeoPagePaths = [
  "about.html",
  "agent-connector.html",
  "for-agents.html",
  "gear/index.html",
  "gear/moog-minimoog.html",
  "gear/arp-2600.html",
  "gear/roland-tr-808.html",
  "regions/index.html",
  "regions/japan.html",
  "regions/bay-area.html",
  "regions/los-angeles.html",
  "regions/east-coast.html",
  "sources/index.html",
];

const css = cssPaths.map(read).join("\n");
const app = appPaths.map(read).join("\n");
const definitions = new Set(
  [...css.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((match) => match[1]),
);

for (const match of app.matchAll(/setProperty\(\s*["'](--[a-z0-9-]+)/g)) {
  definitions.add(match[1]);
}

const references = new Set(
  [...`${css}\n${app}`.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((match) => match[1]),
);
const unresolved = [...references].filter((name) => !definitions.has(name)).sort();

const sourceStringReferences = new Set(
  [...app.matchAll(/["'](--source-[a-z0-9-]+)["']/g)].map((match) => match[1]),
);
const unresolvedSourceStrings = [...sourceStringReferences]
  .filter((name) => !definitions.has(name))
  .sort();

const pageErrors = [];
for (const pagePath of aeoPagePaths) {
  const html = read(pagePath);
  const designSystemIndex = html.indexOf('href="/design-system.css"');
  const aeoIndex = html.indexOf('href="/aeo.css"');
  if (designSystemIndex === -1 || aeoIndex === -1 || designSystemIndex > aeoIndex) {
    pageErrors.push(`${pagePath}: load /design-system.css before /aeo.css`);
  }
}

const aeoCss = read("aeo.css");
const duplicatedBrandValues = [
  "#ff00ff",
  "#0072ff",
  "#eef0f4",
  "#11161b",
].filter((value) => aeoCss.toLowerCase().includes(value));

const errors = [
  ...unresolved.map((name) => `Unresolved custom property: ${name}`),
  ...unresolvedSourceStrings.map((name) => `Unresolved source token string: ${name}`),
  ...pageErrors,
  ...duplicatedBrandValues.map((value) => `AEO CSS duplicates design token value: ${value}`),
];

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(
  `Design-system checks passed: ${references.size} property references, `
  + `${sourceStringReferences.size} source tokens, ${aeoPagePaths.length} AEO pages.`,
);
