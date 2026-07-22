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
  buyee: "source-buyee",
  buyeeInk: "source-buyee-ink",
  inkOnColor: "source-ink-on-color",
  inkOnYellow: "source-ink-on-yellow",
};

const componentVariables = [
  { path: ["color", "controlOnInk"], variableName: "color-control-on-ink", anchor: "color-brand-hot" },
  { path: ["color", "modalBackdrop"], variableName: "color-modal-backdrop", anchor: "color-control-on-ink" },
  { path: ["color", "mobileNavSurfaceTop"], variableName: "color-mobile-nav-surface-top", anchor: "color-modal-backdrop" },
  { path: ["color", "mobileNavSurfaceBottom"], variableName: "color-mobile-nav-surface-bottom", anchor: "color-mobile-nav-surface-top" },
  { path: ["color", "mobileNavBorder"], variableName: "color-mobile-nav-border", anchor: "color-mobile-nav-surface-bottom" },
  { path: ["color", "mobileNavInk"], variableName: "color-mobile-nav-ink", anchor: "color-mobile-nav-border" },
  { path: ["color", "mobileNavInteraction"], variableName: "color-mobile-nav-interaction", anchor: "color-mobile-nav-ink" },
  { path: ["color", "toastSurface"], variableName: "color-toast-surface", anchor: "color-mobile-nav-interaction" },
  { path: ["color", "toastInk"], variableName: "color-toast-ink", anchor: "color-toast-surface" },
  { path: ["color", "toastLink"], variableName: "color-toast-link", anchor: "color-toast-ink" },
  { path: ["color", "overlayInteraction"], variableName: "color-overlay-interaction", anchor: "color-toast-link" },
  { path: ["color", "overlayEdge"], variableName: "color-overlay-edge", anchor: "color-overlay-interaction" },
  { path: ["control", "searchHeightDesktop"], variableName: "control-search-height-desktop", anchor: "radius-pill" },
  { path: ["control", "searchHeightMobile"], variableName: "control-search-height-mobile", anchor: "control-search-height-desktop" },
  { path: ["control", "searchFontSize"], variableName: "control-search-font-size", anchor: "control-search-height-mobile" },
  { path: ["control", "searchSubmitDesktop"], variableName: "control-search-submit-desktop", anchor: "control-search-font-size" },
  { path: ["control", "searchSubmitMobile"], variableName: "control-search-submit-mobile", anchor: "control-search-submit-desktop" },
  { path: ["control", "searchClear"], variableName: "control-search-clear", anchor: "control-search-submit-mobile" },
  { path: ["control", "refineActionHeight"], variableName: "control-refine-action-height", anchor: "control-search-clear" },
  { path: ["control", "suggestionHeight"], variableName: "control-suggestion-height", anchor: "control-refine-action-height" },
  { path: ["control", "tagMinHeight"], variableName: "control-tag-min-height", anchor: "control-suggestion-height" },
  { path: ["control", "tokenFieldMinHeight"], variableName: "control-token-field-min-height", anchor: "control-tag-min-height" },
  { path: ["control", "excludeFieldMinHeight"], variableName: "control-exclude-field-min-height", anchor: "control-token-field-min-height" },
  { path: ["control", "headerUtilitySize"], variableName: "control-header-utility-size", anchor: "control-exclude-field-min-height" },
  { path: ["control", "mobileNavHeight"], variableName: "control-mobile-nav-height", anchor: "control-header-utility-size" },
  { path: ["control", "mobileNavItemHeight"], variableName: "control-mobile-nav-item-height", anchor: "control-mobile-nav-height" },
  { path: ["control", "mobileNavIconSize"], variableName: "control-mobile-nav-icon-size", anchor: "control-mobile-nav-item-height" },
  { path: ["control", "backToTopSize"], variableName: "control-back-to-top-size", anchor: "control-mobile-nav-icon-size" },
  { path: ["control", "toastMinHeight"], variableName: "control-toast-min-height", anchor: "control-back-to-top-size" },
  { path: ["control", "toastCloseSize"], variableName: "control-toast-close-size", anchor: "control-toast-min-height" },
  { path: ["control", "actionMenuRowHeight"], variableName: "control-action-menu-row-height", anchor: "control-toast-close-size" },
  { path: ["control", "actionSheetRowHeight"], variableName: "control-action-sheet-row-height", anchor: "control-action-menu-row-height" },
  { path: ["control", "actionMenuIconSize"], variableName: "control-action-menu-icon-size", anchor: "control-action-sheet-row-height" },
  { path: ["control", "actionSheetIconSize"], variableName: "control-action-sheet-icon-size", anchor: "control-action-menu-icon-size" },
  { path: ["shadow", "toast"], variableName: "shadow-toast", anchor: "shadow-float" },
  { path: ["shadow", "actionMenu"], variableName: "shadow-action-menu", anchor: "shadow-toast" },
  { path: ["shadow", "actionSheet"], variableName: "shadow-action-sheet", anchor: "shadow-action-menu" },
  { path: ["motion", "toastFade"], variableName: "motion-toast-fade", anchor: "motion-standard" },
  { path: ["motion", "toastTravel"], variableName: "motion-toast-travel", anchor: "motion-toast-fade" },
  { path: ["radius", "navigationItem"], variableName: "radius-navigation-item", anchor: "radius-sheet" },
  { path: ["radius", "cardMedia"], variableName: "radius-card-media", anchor: "radius-card-list" },
  { path: ["typography", "size", "listingTitleGrid"], variableName: "text-listing-title-grid", anchor: "text-title" },
  { path: ["typography", "size", "listingTitleList"], variableName: "text-listing-title-list", anchor: "text-listing-title-grid" },
  { path: ["typography", "size", "listingTitleGallery"], variableName: "text-listing-title-gallery", anchor: "text-listing-title-list" },
  { path: ["typography", "size", "listingPriceGrid"], variableName: "text-listing-price-grid", anchor: "text-listing-title-gallery" },
  { path: ["typography", "size", "listingPriceList"], variableName: "text-listing-price-list", anchor: "text-listing-price-grid" },
];

const themedVariables = [
  { path: ["color", "searchField"], variableName: "color-search-field", lightAnchor: "color-modal-backdrop", darkAnchor: "color-field" },
  { path: ["color", "searchInk"], variableName: "color-search-ink", lightAnchor: "color-search-field", darkAnchor: "color-search-field" },
];

function setVariableInBlock(source, selector, variableName, value, anchor) {
  const blockStart = source.indexOf(`${selector} {`);
  if (blockStart === -1) {
    throw new Error(`Could not locate CSS block: ${selector}`);
  }

  const bodyStart = source.indexOf("{", blockStart) + 1;
  const bodyEnd = source.indexOf("\n}", bodyStart);
  if (bodyEnd === -1) {
    throw new Error(`Could not locate the end of CSS block: ${selector}`);
  }

  const before = source.slice(0, bodyStart);
  let body = source.slice(bodyStart, bodyEnd);
  const after = source.slice(bodyEnd);
  const variableLine = `  --${variableName}: ${value};`;
  const variablePattern = new RegExp(`^\\s*--${variableName}:.*$`, "m");

  if (variablePattern.test(body)) {
    body = body.replace(variablePattern, variableLine);
    return `${before}${body}${after}`;
  }

  const anchorPattern = new RegExp(`^(\\s*--${anchor}:.*)$`, "m");
  if (!anchorPattern.test(body)) {
    throw new Error(`Could not locate CSS anchor in ${selector}: --${anchor}`);
  }

  body = body.replace(anchorPattern, `$1\n${variableLine}`);
  return `${before}${body}${after}`;
}

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

for (const { path: tokenPathParts, variableName, lightAnchor, darkAnchor } of themedVariables) {
  const token = tokenPathParts.reduce((value, part) => value?.[part], tokens);
  const values = token?.$value;
  if (typeof values?.light !== "string" || typeof values?.dark !== "string") {
    throw new Error(`Missing themed component token: ${tokenPathParts.join(".")}`);
  }

  css = setVariableInBlock(css, ":root", variableName, values.light, lightAnchor);
  css = setVariableInBlock(css, 'body[data-theme="dark"]', variableName, values.dark, darkAnchor);
}

fs.writeFileSync(cssPath, css);
console.log(`Synced ${lines.length + componentVariables.length + themedVariables.length} tokens to design-system.css`);
