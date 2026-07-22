import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const tokenPath = path.join(root, "tokens", "brrtz-tokens.json");
const cssPath = path.join(root, "design-system.css");

const sourceVariables = {
  default: "source-default",
  mercari: "source-mercari",
  yahooAuctions: "source-yahoo-auctions",
  yahooFleamarket: "source-yahoo-fleamarket",
  rakuma: "source-rakuma",
  digimart: "source-digimart",
  reverb: "source-reverb",
  ebay: "source-ebay",
  sweetwater: "source-sweetwater",
  guitarCenter: "source-guitar-center",
  craigslist: "source-craigslist",
  qsic: "source-qsic",
  robotspeak: "source-robotspeak",
  missionSynths: "source-mission-synths",
  starvingMusician: "source-starving-musician",
  bananasAtLarge: "source-bananas-at-large",
  gelbMusic: "source-gelb-music",
  mainDrag: "source-main-drag",
  rogueMusic: "source-rogue-music",
  threeWave: "source-three-wave",
  altoMusic: "source-alto-music",
  toneTweakers: "source-tone-tweakers",
  proAudioStar: "source-pro-audio-star",
  jimoty: "source-jimoty",
  offmall: "source-offmall",
  hardoff: "source-hardoff",
  fiveG: "source-five-g",
  implant4: "source-implant4",
  randomGreen: "source-random-green",
  randomOrange: "source-random-orange",
  randomViolet: "source-random-violet",
  inkOnColor: "source-ink-on-color",
  inkOnYellow: "source-ink-on-yellow",
};

const componentVariables = [
  { path: ["color", "controlOnInk"], variableName: "color-control-on-ink", anchor: "color-brand-hot" },
  { path: ["color", "modalBackdrop"], variableName: "color-modal-backdrop", anchor: "color-control-on-ink" },
  { path: ["radius", "cardMedia"], variableName: "radius-card-media", anchor: "radius-card-list" },
  { path: ["typography", "size", "listingTitleGrid"], variableName: "text-listing-title-grid", anchor: "text-title" },
  { path: ["typography", "size", "listingTitleList"], variableName: "text-listing-title-list", anchor: "text-listing-title-grid" },
  { path: ["typography", "size", "listingTitleGallery"], variableName: "text-listing-title-gallery", anchor: "text-listing-title-list" },
  { path: ["typography", "size", "listingPriceGrid"], variableName: "text-listing-price-grid", anchor: "text-listing-title-gallery" },
  { path: ["typography", "size", "listingPriceList"], variableName: "text-listing-price-list", anchor: "text-listing-price-grid" },
];

const tokens = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
let css = fs.readFileSync(cssPath, "utf8");
const lines = Object.entries(sourceVariables).map(([tokenName, variableName]) => {
  const value = tokens.source?.[tokenName]?.$value;
  if (typeof value !== "string") {
    throw new Error(`Missing source token: source.${tokenName}`);
  }
  return `  --${variableName}: ${value};`;
});

const startMarker = "  --source-default:";
const endMarker = "  --source-ink-on-yellow:";
const start = css.indexOf(startMarker);
const end = css.indexOf("\n", css.indexOf(endMarker));
if (start === -1 || end === -1) {
  throw new Error("Could not locate the marketplace token block in design-system.css");
}

css = `${css.slice(0, start)}${lines.join("\n")}${css.slice(end)}`;

for (const { path: tokenPathParts, variableName, anchor } of componentVariables) {
  const token = tokenPathParts.reduce((value, part) => value?.[part], tokens);
  const value = token?.$value;
  if (typeof value !== "string") {
    throw new Error(`Missing component token: ${tokenPathParts.join(".")}`);
  }

  const variableLine = `  --${variableName}: ${value};`;
  const variablePattern = new RegExp(`^\\s*--${variableName}:.*$`, "m");
  if (variablePattern.test(css)) {
    css = css.replace(variablePattern, variableLine);
    continue;
  }

  const anchorPattern = new RegExp(`^(\\s*--${anchor}:.*)$`, "m");
  if (!anchorPattern.test(css)) {
    throw new Error(`Could not locate CSS anchor: --${anchor}`);
  }
  css = css.replace(anchorPattern, `$1\n${variableLine}`);
}

fs.writeFileSync(cssPath, css);
console.log(`Synced ${lines.length + componentVariables.length} tokens to design-system.css`);
