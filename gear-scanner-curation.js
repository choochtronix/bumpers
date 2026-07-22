// Gear Scanner curation core — shared between the browser app and Node tests.
//
// In the browser this loads as a classic <script> BEFORE app.js, so every
// declaration here is a global that app.js uses directly. In Node it is
// imported for its side effect of populating globalThis.BrrtzGearScannerCuration
// (see test/gear-scanner-curation.test.js).
//
// Keep this file free of direct DOM/localStorage access. Browser-only
// dependencies (loadLedger, createGearQualityContext, getProfileFeedback,
// getActiveNoiseTerms) are resolved through typeof guards and fall back to
// neutral defaults when absent, so classification behaves identically in Node.

const FRESH_FIND_CURATOR_TERMS = [
  "arp",
  "cs-",
  "drum machine",
  "dx7",
  "eurorack",
  "juno",
  "jupiter",
  "korg",
  "moog",
  "oberheim",
  "prophet",
  "roland",
  "sampler",
  "sequential",
  "sequential circuits",
  "sh-",
  "synth",
  "synthesizer",
  "tb-",
  "tr-",
  "vintage",
  "waldorf",
];

const STRICT_LATIN_TERMS = [
  "roli",
];

const AMBIGUOUS_GEAR_BRANDS = [
  "roli",
  "waldorf",
  "ワルドルフ",
];

const BRAND_MODEL_SIGNAL_TERMS = {
  mackie: [
    "1202",
    "1402",
    "1604",
    "1642",
    "8 bus",
    "8-bus",
    "cr1604",
    "cr-1604",
    "d8b",
    "mix8",
    "mix12",
    "onyx",
    "pro fx",
    "profx",
    "vlz",
    "vlz3",
    "vlz4",
  ],
  roli: [
    "airwave",
    "blocks",
    "lumi",
    "lightpad",
    "piano m",
    "rise",
    "seaboard",
    "songmaker",
  ],
  waldorf: [
    "blofeld",
    "iridium",
    "kyra",
    "largo",
    "micro q",
    "microwave",
    "m",
    "nw1",
    "pulse",
    "q",
    "quantum",
    "rocket",
    "streichfett",
    "stromberg",
    "zarenbourg",
    "xt",
    "xtk",
  ],
  "ワルドルフ": [
    "blofeld",
    "iridium",
    "kyra",
    "largo",
    "micro q",
    "microwave",
    "nw1",
    "pulse",
    "q",
    "quantum",
    "rocket",
    "streichfett",
    "stromberg",
    "zarenbourg",
    "xt",
    "xtk",
    "ブロフェルド",
    "イリジウム",
    "マイクロウェーブ",
    "マイクロ q",
    "パルス",
    "クォンタム",
    "ストライヒフェット",
  ],
};

const GEAR_SIGNAL_TERMS = [
  "analog",
  "analog mixer",
  "audio interface",
  "audio mixer",
  "compact mixer",
  "desktop",
  "digital",
  "digital mixer",
  "drum machine",
  "drum machines",
  "drum module",
  "drum modules",
  "dr rhythm",
  "dr. rhythm",
  "eurorack",
  "groove box",
  "groovebox",
  "keyboard",
  "midi",
  "mixer",
  "mixers",
  "mixing board",
  "mixing console",
  "mixing desk",
  "module",
  "mpc",
  "powered mixer",
  "rack mixer",
  "rack",
  "rhythm composer",
  "rhythm machine",
  "rhythmtrak",
  "sampler",
  "samplers",
  "sequencer",
  "synth",
  "synthesizer",
  "vco",
  "vca",
  "vcf",
  "vlz",
  "アナログ",
  "インターフェース",
  "オーディオ",
  "キーボード",
  "グルーブボックス",
  "サンプラー",
  "シーケンサー",
  "シンセ",
  "シンセサイザー",
  "ドラムマシン",
  "ドラムマシーン",
  "リズムボックス",
  "リズムマシン",
  "リズムマシーン",
  "ミキサー",
  "ミキシング",
  "モジュール",
];

const MEDIA_NOISE_TERMS = [
  "12\"",
  "7\"",
  "album",
  "blu-ray",
  "bluray",
  "cassette",
  "cd",
  "dvd",
  "ep",
  "first press",
  "jacket",
  "laserdisc",
  "lp",
  "model kit",
  "record",
  "sample cd",
  "sampling cd",
  "single",
  "soundtrack",
  "vinyl",
  "アナログ盤",
  "アルバム",
  "カセット",
  "フィギュア",
  "プラモデル",
  "ピンバッジ",
  "マグネット",
  "サントラ",
  "サンプリングcd",
  "ジャズ",
  "レコード",
  "7インチ",
  "帯付",
  "帯付き",
  "歌謡",
  "紙ジャケ",
  "輸入盤",
];

const NEGATIVE_CATEGORY_IDS = [
  "20060", // comics and anime goods
  "21600", // books and magazines
  "21964", // movies and video
  "22152", // music media
  "23000", // fashion
  "23140", // accessories and watches
  "23976", // food and drink
  "24198", // home and interior
  "24202", // baby goods
  "24698", // sports and leisure
  "25464", // toys and games
  "26086", // garden
  "26318", // cars and motorbikes
  "42177", // beauty and health
  "2084032594", // celebrity goods
  "2084019007", // sampling CDs
  "2084214619", // DVDs
  "2084216603", // DVDs
  "2084055844", // pets
  "416", // Rakuma toys
  "770", // Rakuma CDs and music media
  "1622", // Rakuma character goods
];

const HARD_NEGATIVE_CATEGORY_IDS = [
  "21600", // books and magazines
  "21964", // movies and video
  "22152", // music media
  "23000", // fashion
  "2084019007", // sampling CDs
  "416", // Rakuma toys
  "770", // Rakuma CDs and music media
  "1622", // Rakuma character goods
];

const POSITIVE_GEAR_CATEGORY_IDS = [
  "22436",
  "22532",
  "2084019003",
  "2084019005",
  "2084240145",
  "46914",
  "1459",
  "1473",
  "1616",
];

const STARTER_FRESH_FIND_EXCLUDES = [
  "CD",
  "LP",
  "record",
  "book",
  "brochure",
  "magazine",
  "manual",
  "miniature",
  "pamphlet",
  "poster",
  "score",
  "shirt",
  "songbook",
  "sticker",
  "t shirt",
  "t-shirt",
  "tee",
  "video",
  "vhs",
  "patch book",
  "Tシャツ",
  "カタログ",
  "キーボード・マガジン",
  "マガジン",
  "パンフレット",
  "マニュアル",
  "ムック",
  "楽譜",
  "映像",
  "雑誌",
  "ミニチュア",
  "取扱説明書",
];

const GEAR_SCANNER_EXCLUDE_TERMS = [
  "replacement",
  "spare part",
  "spare parts",
  "repair part",
  "parts only",
  "case only",
  "manual only",
  "cable only",
  "power supply only",
  "screen",
  "display",
  "lcd",
  "oled",
  "led screen",
  "rom",
  "eprom",
  "firmware",
  "chip",
  "panel",
  "sheet music",
  "music stand",
  "newspaper",
  "piano sticker",
  "keyboard sticker",
  "note sticker",
  "finger guard",
  "sustain pedal",
  "damper pedal",
  "keyboard stand",
  "soft case",
  "carry bag",
  "carrying bag",
  "keyboard cover",
  "hard case",
  "travel case",
  "keyboard case",
  "mouse case",
  "computer keyboard",
  "monsgeek",
  "kitcut",
  "吹奏楽",
  "野外演奏",
  "野外ライブ",
  "風対策",
  "新聞",
  "創刊号",
  "音符シール",
  "五線譜",
  "ステッカー",
  "鍵盤シール",
  "ピアノシール",
  "ドレミ",
  "音階",
  "初心者",
  "練習用",
  "フィンガーガード",
  "譜面",
  "譜面ファイル",
  "液晶",
  "液晶パネル",
  "有機el",
  "ディスプレイ",
  "パネル",
  "交換",
  "交換用",
  "修理",
  "部品",
  "パーツ",
  "ケース",
  "ハードケース",
  "トラベルケース",
  "キーボードケース",
  "マウスケース",
  "キーボードスタンド",
  "ソフトケース",
  "キャリーバッグ",
  "キーボードカバー",
  "収納",
  "バッグ",
  "リュック",
  "サステインペダル",
  "サスティーンペダル",
  "ダンパーペダル",
  "コンピューター",
  "ケーブル",
  "コード",
  "アダプター",
  "電源のみ",
  "電子キーボード",
  "エレクトーン",
  "玩具",
  "おもちゃ",
  "光ナビゲーション",
];

const GEAR_SCANNER_HARD_EXCLUDE_TERMS = [
  "replacement lcd",
  "replacement oled",
  "replacement screen",
  "lcd panel",
  "oled display",
  "display module",
  "display replacement",
  "firmware chip",
  "expansion rom",
  "special edition rom",
  "upgrade rom",
  "rom chip",
  "ser-7",
  "hard travel case",
  "keyboard case",
  "mouse case",
  "computer keyboard",
  "piano sticker",
  "keyboard sticker",
  "note sticker",
  "finger guard",
  "monsgeek",
  "kitcut",
  "cable only",
  "manual only",
  "case only",
  "power supply only",
  "液晶パネル",
  "有機el",
  "譜面ファイル",
  "吹奏楽",
  "野外演奏",
  "野外ライブ",
  "風対策",
  "新聞",
  "創刊号",
  "音符シール",
  "五線譜",
  "鍵盤シール",
  "ピアノシール",
  "フィンガーガード",
  "交換用",
  "キーボードケース",
  "マウスケース",
];

// Thresholds are calibrated for the freshness-free quality score (see
// classifyGearScannerListing) — retune if the scoring weights change.
const GEAR_SCANNER_MIN_INCLUDE_SCORE = 55;

// Below-threshold listings may only backfill up to this many cards, and never
// below the fallback floor — fewer strong cards beats filling with junk.
const GEAR_SCANNER_MIN_FALLBACK_CARDS = 3;

const GEAR_SCANNER_FALLBACK_MIN_SCORE = 30;

const GEAR_SCANNER_POSITIVE_TERMS = [
  "synth",
  "synthesizer",
  "synthesiser",
  "analog synth",
  "analogue synth",
  "keyboard",
  "module",
  "desktop module",
  "sound module",
  "rack",
  "rackmount",
  "drum machine",
  "groovebox",
  "sampler",
  "sequencer",
  "eurorack",
  "modular",
  "semi-modular",
  "vco",
  "vcf",
  "vca",
  "moog",
  "arp",
  "oberheim",
  "sequential",
  "sequential circuits",
  "roland",
  "yamaha",
  "waldorf",
  "ensoniq",
  "korg",
  "akai",
  "elektron",
  "novation",
  "behringer",
  "arturia",
  "dave smith",
  "prophet",
  "juno",
  "jupiter",
  "sh-101",
  "tb-303",
  "tr-808",
  "tr-909",
  "volca",
  "volca sample",
  "volca bass",
  "volca fm",
  "dx7",
  "minimoog",
  "odyssey",
  "シンセ",
  "シンセサイザー",
  "アナログシンセ",
  "キーボード",
  "音源モジュール",
  "ドラムマシン",
  "ドラムマシーン",
  "リズムマシン",
  "リズムマシーン",
  "リズムボックス",
  "サンプラー",
  "シーケンサー",
  "モジュラー",
  "ユーロラック",
];

const GEAR_SCANNER_KNOWN_BRANDS = [
  "moog",
  "arp",
  "oberheim",
  "sequential circuits",
  "sequential",
  "roland",
  "yamaha",
  "waldorf",
  "ensoniq",
  "korg",
  "akai",
  "elektron",
  "arturia",
  "novation",
  "behringer",
  "dave smith",
  "dsi",
  "alesis",
  "casio",
  "teenage engineering",
  "make noise",
  "mutable instruments",
  "erica synths",
  "doepfer",
  "intellijel",
  "boss",
  "zoom",
  "hammond",
  "kawai",
  "nord",
  "clavia",
  "buchla",
  "e-mu",
  "kurzweil",
  "rhodes",
  "wurlitzer",
  "access",
];

const GEAR_SCANNER_KNOWN_MODELS = [
  "dx7",
  "juno",
  "juno-106",
  "jupiter",
  "sh-101",
  "tb-303",
  "tr-808",
  "tr-909",
  "minimoog",
  "grandmother",
  "matriarch",
  "odyssey",
  "prophet",
  "ob-x",
  "ob-xa",
  "sem",
  "microwave",
  "sq-80",
  "mirage",
  "volca",
  "ms-20",
  "monologue",
  "minilogue",
  "mpc",
  "octatrack",
  "digitakt",
  "digitone",
  "op-1",
  "tr-606",
  "tr-707",
  "tr-626",
  "mc-202",
  "mc-303",
  "sh-09",
  "sh-201",
  "system-100",
  "jx-3p",
  "jx-8p",
  "jd-800",
  "d-50",
  "juno-6",
  "juno-60",
  "dx21",
  "dx100",
  "cs-80",
  "an1x",
  "motif",
  "montage",
  "fantom",
  "m1",
  "triton",
  "trinity",
  "wavestation",
  "polysix",
  "ms2000",
  "microkorg",
  "electribe",
  "kaossilator",
  "monotron",
  "monotribe",
  "esq-1",
  "k5000",
  "nord lead",
  "sp-404",
  "sp-1200",
];

function normalizeText(value) {
  return value.toLocaleLowerCase("ja-JP").normalize("NFKC");
}

function normalizeListingText(listing) {
  return normalizeText([
    listing?.title,
    listing?.description,
    listing?.brand,
    listing?.category,
    listing?.condition,
    listing?.shop,
    listing?.source,
    Array.isArray(listing?.categoryPath) ? listing.categoryPath.join(" ") : "",
  ].filter(Boolean).join(" "));
}

function getGearScannerSearchableText(listing) {
  return normalizeListingText(listing);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createFlexiblePhrasePattern(value) {
  return value
    .split(/[\s._/-]+/)
    .filter(Boolean)
    .map(escapeRegExp)
    .join("[\\s._/-]*")
    .replace(/([a-z])(\d)/gi, "$1[\\s._/-]*$2")
    .replace(/(\d)([a-z])/gi, "$1[\\s._/-]*$2");
}

function parseMatchTerm(term) {
  const value = String(term || "").trim();
  const quotePairs = [
    ['"', '"'],
    ["'", "'"],
    ["“", "”"],
    ["‘", "’"],
  ];
  const quotePair = quotePairs.find(([open, close]) => value.startsWith(open) && value.endsWith(close) && value.length >= open.length + close.length + 1);

  if (!quotePair) {
    return { exact: false, value };
  }

  return {
    exact: true,
    value: value.slice(quotePair[0].length, value.length - quotePair[1].length).trim(),
  };
}

function exactPhraseMatches(searchable, normalizedPhrase) {
  const phrase = normalizedPhrase.replace(/\s+/g, " ").trim();
  if (!phrase) return false;

  const phrasePattern = createFlexiblePhrasePattern(phrase);
  const startBoundary = /^[a-z0-9]/.test(phrase) ? "(^|[^a-z0-9])" : "";
  const endBoundary = /[a-z0-9]$/.test(phrase) ? "($|[^a-z0-9])" : "";
  return new RegExp(`${startBoundary}${phrasePattern}${endBoundary}`).test(searchable);
}

function flexibleSeparatorMatches(searchable, normalizedTerm) {
  if (!/[a-z0-9][\s._/-]+[a-z0-9]/.test(normalizedTerm) && !/[a-z]+\d|\d+[a-z]/.test(normalizedTerm)) return false;

  const startBoundary = /^[a-z0-9]/.test(normalizedTerm) ? "(^|[^a-z0-9])" : "";
  const endBoundary = /[a-z0-9]$/.test(normalizedTerm) ? "($|[^a-z0-9])" : "";
  return new RegExp(`${startBoundary}${createFlexiblePhrasePattern(normalizedTerm)}${endBoundary}`).test(searchable);
}

function createLooseWordTerms(value) {
  return String(value || "")
    .normalize("NFKC")
    .split(/[\s/+|・,、]+/)
    .map((term) => term.trim())
    .filter((term) => {
      const normalized = normalizeText(term);
      return normalized.length >= 2 || /^\d+$/.test(normalized);
    });
}

function termMatches(searchable, term) {
  const matchTerm = parseMatchTerm(term);
  const normalized = normalizeText(matchTerm.value);
  if (!normalized) return false;

  if (matchTerm.exact) {
    return exactPhraseMatches(searchable, normalized);
  }

  if (/^[a-z0-9]+$/.test(normalized) && (normalized.length <= 3 || STRICT_LATIN_TERMS.includes(normalized))) {
    return new RegExp(`(^|[^a-z0-9])${escapeRegExp(normalized)}($|[^a-z0-9])`).test(searchable);
  }

  const looseWordTerms = createLooseWordTerms(matchTerm.value);
  if (looseWordTerms.length > 1 && looseWordTerms.every((word) => termMatches(searchable, word))) {
    return true;
  }

  return searchable.includes(normalized) || flexibleSeparatorMatches(searchable, normalized);
}

function getMatchingTerms(searchable, terms) {
  return terms.filter((term) => termMatches(searchable, term));
}

function countMatchingTerms(searchable, terms) {
  return terms.reduce((count, term) => {
    return termMatches(searchable, term) ? count + 1 : count;
  }, 0);
}

function countBrandModelSignals(searchable) {
  return Object.entries(BRAND_MODEL_SIGNAL_TERMS).reduce((count, [brand, modelTerms]) => {
    if (!termMatches(searchable, brand)) return count;
    return count + countMatchingTerms(searchable, modelTerms);
  }, 0);
}

function hasRecordCatalogMarker(searchable) {
  return /(^|[^a-z0-9])lp[\s-]?\d{2,}/.test(searchable) || /(^|[^a-z0-9])ep[\s-]?\d{2,}/.test(searchable);
}

function getListingCategoryIds(listing) {
  const ids = [];
  if (listing.categoryId) ids.push(String(listing.categoryId));
  if (Array.isArray(listing.categoryPath)) ids.push(...listing.categoryPath.map(String));
  return [...new Set(ids.filter(Boolean))];
}

// Browser-state lookups. app.js defines these globals when this file runs in
// the browser; under Node they are absent and the classifier uses neutral
// defaults so classification stays deterministic and side-effect free.
function resolveProfileFeedback() {
  if (typeof getProfileFeedback === "function") return getProfileFeedback();
  return { gearListingIds: [], noiseListingIds: [], hiddenCategories: [], hiddenTerms: [] };
}

function resolveActiveNoiseTerms() {
  return typeof getActiveNoiseTerms === "function" ? getActiveNoiseTerms() : [];
}

function resolveLedger() {
  return typeof loadLedger === "function" ? loadLedger() : {};
}

function resolveQualityContext() {
  return typeof createGearQualityContext === "function" ? createGearQualityContext() : null;
}

function getListingFeedbackStatus(listing, feedback = resolveProfileFeedback()) {
  if ((feedback.gearListingIds || []).includes(listing.id)) return "gear";
  if ((feedback.noiseListingIds || []).includes(listing.id)) return "noise";
  return "";
}

function scoreGearConfidence(listing, context = null) {
  const cache = context?.gearConfidenceCache;
  const cacheKey = cache ? getListingCacheKey(listing) : "";
  if (cacheKey && cache.has(cacheKey)) return cache.get(cacheKey);

  const finish = (confidence) => {
    if (cacheKey) cache.set(cacheKey, confidence);
    return confidence;
  };

  const searchable = normalizeText(`${listing.title} ${listing.condition || ""} ${listing.shop || ""}`);
  const categoryIds = getListingCategoryIds(listing);
  const feedback = context?.feedback || resolveProfileFeedback();
  const feedbackStatus = getListingFeedbackStatus(listing, feedback);

  if (feedbackStatus === "gear") return finish({ level: "likely-gear", score: 99 });
  if (feedbackStatus === "noise") return finish({ level: "likely-noise", score: -99 });

  const positiveTermCount = countMatchingTerms(searchable, GEAR_SIGNAL_TERMS);
  const brandModelSignalCount = countBrandModelSignals(searchable);
  const profileNoiseCount = countMatchingTerms(searchable, resolveActiveNoiseTerms());
  const mediaNoiseCount = countMatchingTerms(searchable, MEDIA_NOISE_TERMS);
  const feedbackNoiseCount = countMatchingTerms(searchable, feedback.hiddenTerms || []);
  const hasPositiveCategory = categoryIds.some((id) => POSITIVE_GEAR_CATEGORY_IDS.includes(id));
  const hasNegativeCategory = categoryIds.some((id) => NEGATIVE_CATEGORY_IDS.includes(id));
  const hasHardNegativeCategory = categoryIds.some((id) => HARD_NEGATIVE_CATEGORY_IDS.includes(id));
  const hasAmbiguousBrand = AMBIGUOUS_GEAR_BRANDS.some((brand) => termMatches(searchable, brand));
  const hasGearSignal = positiveTermCount > 0 || brandModelSignalCount > 0 || hasPositiveCategory;
  const hasMediaCatalogMarker = hasRecordCatalogMarker(searchable);
  const hasFeedbackHiddenCategory = categoryIds.some((id) => (feedback.hiddenCategories || []).includes(id));
  let score = 0;

  if (hasHardNegativeCategory && !hasPositiveCategory) {
    return finish({ level: "likely-noise", score: -12 });
  }

  if (hasAmbiguousBrand && !hasGearSignal) {
    return finish({ level: "likely-noise", score: -8 });
  }

  score += positiveTermCount * 3;
  score += brandModelSignalCount * 5;
  if (hasPositiveCategory) score += 4;
  if (hasNegativeCategory) score -= 5;
  if (hasHardNegativeCategory && !hasPositiveCategory && positiveTermCount < 2) score -= 4;
  if (hasMediaCatalogMarker) score -= 4;
  if (hasFeedbackHiddenCategory) score -= 8;
  score -= mediaNoiseCount * 4;
  score -= profileNoiseCount * 2;
  score -= feedbackNoiseCount * 6;

  if (positiveTermCount > 0 && !hasNegativeCategory) score += 2;
  if (mediaNoiseCount > 0 && positiveTermCount === 0) score -= 3;
  if (hasNegativeCategory && positiveTermCount === 0) score -= 2;

  if (score >= 3) return finish({ level: "likely-gear", score });
  if (score <= -3) return finish({ level: "likely-noise", score });
  return finish({ level: "maybe-gear", score });
}

function getFreshFindAgeHours(listing, entry = {}) {
  const firstSeenAt = entry.firstSeenAt || entry.firstDiscoveredAt || listing.firstSeenAt || listing.listedAt || "";
  const firstSeenTime = Date.parse(firstSeenAt);
  if (!Number.isFinite(firstSeenTime)) return Infinity;
  return (Date.now() - firstSeenTime) / (60 * 60 * 1000);
}

function scoreFreshFindListing(listing, ledger = resolveLedger(), context = null, options = {}) {
  if (listing.isStarterFreshFind) return 0;

  const searchable = normalizeText(`${listing.title || ""} ${listing.condition || ""} ${listing.shop || ""}`);
  const confidence = scoreGearConfidence(listing, context);
  const entry = ledger[listing.id] || {};
  let score = 0;

  if (listing.image) score += 8;
  if (confidence.level === "likely-gear") score += 28;
  if (confidence.level === "maybe-gear") score += 10;
  if (confidence.level === "likely-noise") score -= 40;
  score += Math.min(countMatchingTerms(searchable, FRESH_FIND_CURATOR_TERMS) * 5, 30);
  score += Math.min(countBrandModelSignals(searchable) * 6, 24);
  score -= countMatchingTerms(searchable, STARTER_FRESH_FIND_EXCLUDES) * 8;
  if (listing.price > 0) score += 3;

  if (options.includeFreshness !== false) {
    const ageHours = getFreshFindAgeHours(listing, entry);
    if (Number.isFinite(ageHours)) {
      score += Math.max(0, 18 - ageHours / 2);
    }
    score -= Math.min(Math.max(0, Number(entry.unchangedScanCount || 0) - 1) * 2, 12);
  }

  return score;
}

function classifyGearScannerListing(listing, options = {}) {
  const ledger = options.ledger || options.renderContext?.ledger || resolveLedger();
  const qualityContext = options.renderContext || resolveQualityContext();
  const searchable = normalizeListingText(listing);
  const confidence = scoreGearConfidence(listing, qualityContext);
  const reasons = [];
  const hardExcludeReasons = getGearScannerHardExcludeReasons(searchable);
  const positiveTerms = getMatchingTerms(searchable, GEAR_SCANNER_POSITIVE_TERMS);
  const brandMatches = getMatchingTerms(searchable, GEAR_SCANNER_KNOWN_BRANDS);
  const modelMatches = getMatchingTerms(searchable, GEAR_SCANNER_KNOWN_MODELS);
  const accessoryTerms = getMatchingTerms(searchable, GEAR_SCANNER_EXCLUDE_TERMS);
  // Quality only — freshness stays out of the classification score so recent
  // boring items cannot outrank stale grails; it is used as the sort
  // tiebreaker in getCuratedGearScannerListings instead.
  let score = scoreFreshFindListing(listing, ledger, qualityContext, { includeFreshness: false });

  positiveTerms.forEach((term) => reasons.push(`positive term: ${term}`));
  brandMatches.forEach((term) => reasons.push(`brand match: ${term}`));
  modelMatches.forEach((term) => reasons.push(`model match: ${term}`));
  accessoryTerms.forEach((term) => reasons.push(`accessory term: ${term}`));
  hardExcludeReasons.forEach((reason) => reasons.push(`hard exclude: ${reason}`));

  score += Math.min(positiveTerms.length * 6, 48);
  score += Math.min(brandMatches.length * 5, 24);
  score += Math.min(modelMatches.length * 14, 42);
  score += Math.min(countBrandModelSignals(searchable) * 8, 32);
  score -= accessoryTerms.length * 10;
  if (confidence.level === "likely-gear") score += 18;
  if (confidence.level === "maybe-gear") score += 4;
  if (confidence.level === "likely-noise") score -= 50;
  if (listing.image) score += 4;

  if (confidence.level) reasons.push(`gear confidence: ${confidence.level}`);
  if (listing.image) reasons.push("has image");

  const hardExcluded = hardExcludeReasons.length > 0;
  const category = getGearScannerClassificationCategory({ searchable, hardExcluded, hardExcludeReasons, positiveTerms, brandMatches, modelMatches });
  const include = !hardExcluded && score >= GEAR_SCANNER_MIN_INCLUDE_SCORE;
  const classification = { include, hardExcluded, score, category, reasons };
  logGearScannerCurationDecision(listing, classification);
  return classification;
}

function getGearScannerHardExcludeReasons(searchable) {
  const reasons = [];
  const hasStrongInstrumentSignal = countMatchingTerms(searchable, GEAR_SCANNER_POSITIVE_TERMS) >= 2 || countMatchingTerms(searchable, GEAR_SCANNER_KNOWN_MODELS) > 0;
  // Instrument-category words only — model/brand names are deliberately not
  // counted here because accessories cite them constantly ("DX7用...").
  const hasInstrumentWord = /(synth|synthesizer|synthesiser|シンセ|シンセサイザー|アナログシンセ|drum machine|ドラムマシン|ドラムマシーン|リズムマシン|リズムマシーン|リズムボックス|rhythm machine|sampler|サンプラー|sequencer|シーケンサー|modular|モジュラー|eurorack|ユーロラック|groovebox|グルーヴボックス|音源モジュール)/i.test(searchable);
  const hasSynthSpecificSignal = hasInstrumentWord || countMatchingTerms(searchable, GEAR_SCANNER_KNOWN_MODELS) > 0;
  const accessoryForPattern = /(?:dx7|juno|jupiter|motif|montage|kross|ms-20|tr-808|tr-909|tb-303|rx5|r-8|qy70|qy300|yamaha|roland|korg|akai|casio|moog|シンセサイザー|シンセ|キーボード|ピアノ|鍵盤)[\w\s/-]{0,12}用.*(oled|lcd|led|rom|eprom|firmware|chip|display|screen|panel|case|cover|sticker|seal|cable|adapter|有機el|液晶|ディスプレイ|スクリーン|画面|パネル|ケース|カバー|シール|ステッカー|ケーブル|アダプター|機能アップ|簡単装着)/i.test(searchable);
  const electronicPartPattern = /(^|[^a-z0-9])(lcd|oled|led screen|display|screen|rom|eprom|firmware|chip|ser-7)([^a-z0-9]|$)/i.test(searchable);
  const computerAccessoryPattern = /(hard travel case|keyboard case|mouse case|computer keyboard|60% keyboard|monsgeek|kitcut|キーボードケース|マウスケース)/i.test(searchable);
  const computerContextPattern = /コンピューター/i.test(searchable);
  const caseOnlyPattern = /(case only|hard case|travel case|soft case|carry bag|carrying bag|keyboard cover|^キーボードハードケース|^ハードケース|^ケース|ケースのみ|ハードケースのみ|トラベルケースのみ|ソフトケース|キャリーバッグ|キーボードカバー|収納 バッグ|リュック)/i.test(searchable);
  const sheetMusicPattern = /(sheet music|music stand|piano sticker|keyboard sticker|note sticker|譜面|譜面ファイル|吹奏楽|野外演奏|野外ライブ|風対策|音符シール|五線譜|鍵盤シール|ピアノシール)/i.test(searchable);
  const weakSheetMusicPattern = /(ステッカー|ドレミ|音階|初心者|練習用)/i.test(searchable);
  const repairPartPattern = /(^|[^a-z0-9])(replacement|spare parts?|parts only|manual only|cable only|adapter only|power supply only|knobs? only|buttons? only|sliders? only|panel only)([^a-z0-9]|$)|交換用|修理|部品|パーツ/i.test(searchable);
  const utilityAccessoryPattern = /(keyboard stand|sustain pedal|damper pedal|finger guard|キーボードスタンド|サステインペダル|サスティーンペダル|ダンパーペダル|フィンガーガード)/i.test(searchable);
  const mediaAccessoryPattern = /(newspaper|新聞|創刊号|book only|manual only|取扱説明書のみ)/i.test(searchable);
  const digitalPianoOnlyPattern = /(digital piano|デジタルピアノ|電子ピアノ|ピアノタッチ)/i.test(searchable) && !hasSynthSpecificSignal;
  const toyLessonKeyboardPattern = /(玩具|おもちゃ|toy keyboard|子供|キッズ|kids keyboard|光ナビゲーション|光ナビ|エレクトーン|electone)/i.test(searchable);

  getMatchingTerms(searchable, GEAR_SCANNER_HARD_EXCLUDE_TERMS).forEach((term) => reasons.push(term));
  if (accessoryForPattern) reasons.push("Japanese 用 accessory grammar");
  if (electronicPartPattern && !hasInstrumentWord) reasons.push("electronic part/display/ROM");
  if (computerAccessoryPattern) reasons.push("computer keyboard accessory");
  if (computerContextPattern && !hasInstrumentWord) reasons.push("computer accessory context");
  if (caseOnlyPattern && !hasStrongInstrumentSignal) reasons.push("case-only accessory");
  if (sheetMusicPattern) reasons.push("sheet music or band accessory");
  if (weakSheetMusicPattern && !hasInstrumentWord) reasons.push("sticker or lesson accessory");
  if (repairPartPattern && !hasStrongInstrumentSignal) reasons.push("repair part or accessory-only phrase");
  if (utilityAccessoryPattern && !hasInstrumentWord) reasons.push("utility accessory");
  if (mediaAccessoryPattern) reasons.push("media accessory");
  if (digitalPianoOnlyPattern) reasons.push("digital piano / lesson keyboard");
  if (toyLessonKeyboardPattern && !hasInstrumentWord) reasons.push("toy or lesson keyboard");

  return [...new Set(reasons)];
}

function getGearScannerClassificationCategory(details) {
  const searchable = details.searchable || "";
  if (details.hardExcluded) {
    const reasonText = details.hardExcludeReasons.join(" ");
    if (/computer keyboard|case/.test(reasonText)) return "computer-accessory";
    if (/sheet music|band/.test(reasonText)) return "sheet-music-accessory";
    if (/display|rom|part|repair|utility|media/.test(reasonText)) return "replacement-part";
    return "accessory-only";
  }

  if (/drum machine|ドラムマシン|ドラムマシーン|tr-808|tr-909|tr-606|drumatix|rhythm machine|リズムマシン|リズムマシーン|リズムボックス/.test(searchable)) return "drum-machine";
  if (/sampler|サンプラー|mpc|digitakt|mirage|sk-8/.test(searchable)) return "sampler";
  if (/sequencer|シーケンサー|qy100|qy70|qy300/.test(searchable)) return "sequencer";
  if (/modular|eurorack|ユーロラック|モジュラー|vco|vcf|vca/.test(searchable)) return "modular";
  if (/sound module|音源モジュール|rack|rackmount/.test(searchable)) return "sound-module";
  if (details.positiveTerms.length > 0 || details.brandMatches.length > 0 || details.modelMatches.length > 0) return "hardware-synth";
  return "unknown-low-confidence";
}

function scoreGearScannerListing(listing, ledger = resolveLedger(), context = null) {
  return classifyGearScannerListing(listing, { ledger, renderContext: context }).score;
}

function isHardExcludedGearScannerListing(listing) {
  return classifyGearScannerListing(listing).hardExcluded;
}

function isLikelyAccessoryOrPartOnly(listing) {
  return classifyGearScannerListing(listing).hardExcluded;
}

function logGearScannerCurationDecision(listing, classification) {
  if (typeof window === "undefined" || !window.BRRTZ_DEBUG_GEAR_SCANNER) return;
  console.debug("[Gear Scanner curation]", {
    title: listing?.title || "",
    include: classification.include,
    score: classification.score,
    category: classification.category,
    reasons: classification.reasons,
  });
}
// Node/tooling entry point. In the browser these are already globals; the
// namespace exists so Node ESM importers can reach them.
globalThis.BrrtzGearScannerCuration = {
  classifyGearScannerListing,
  getGearScannerHardExcludeReasons,
  getGearScannerClassificationCategory,
  scoreGearScannerListing,
  scoreFreshFindListing,
  scoreGearConfidence,
  isHardExcludedGearScannerListing,
  normalizeListingText,
  termMatches,
  GEAR_SCANNER_MIN_INCLUDE_SCORE,
  GEAR_SCANNER_MIN_FALLBACK_CARDS,
  GEAR_SCANNER_FALLBACK_MIN_SCORE,
};
