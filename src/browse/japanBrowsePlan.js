const JAPAN_BROWSE_TERMS = Object.freeze({
  all: Object.freeze(["シンセサイザー", "リズムマシン"]),
  synthesizers: Object.freeze(["シンセサイザー"]),
  "drum-machines": Object.freeze(["リズムマシン"]),
  samplers: Object.freeze(["サンプラー"]),
  sequencers: Object.freeze(["シーケンサー"]),
  modular: Object.freeze(["ユーロラック"]),
  "effects-pedals": Object.freeze(["ラックエフェクター"]),
  "pro-audio": Object.freeze(["ミキサー"]),
});

export const JAPAN_BROWSE_SOURCE_IDS = Object.freeze([
  "digimart",
  "five-g",
  "implant4",
  "qsic",
  "jimoty",
  "offmall",
  "rakuma",
  "reverb",
  "yahoo-fleamarket",
  "mercari",
]);

export function getJapanBrowseTerms(categoryIntent = "synthesizers") {
  return [...(JAPAN_BROWSE_TERMS[categoryIntent] || JAPAN_BROWSE_TERMS.synthesizers)];
}

export function getJapanBrowseSourceIds({ page = 1, hasBrandTerms = false } = {}) {
  if (page !== 1 || hasBrandTerms) return [];
  return [...JAPAN_BROWSE_SOURCE_IDS];
}
