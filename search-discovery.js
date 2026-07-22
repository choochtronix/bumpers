(function initializeSearchDiscovery(root) {
  const MAX_PLAN_TERMS = 64;
  const JAPANESE_SOURCE_IDS = new Set([
    "digimart",
    "five-g",
    "hardoff",
    "implant4",
    "jimoty",
    "mercari",
    "offmall",
    "qsic",
    "rakuma",
    "yahoo-auctions",
    "yahoo-fleamarket",
  ]);

  const BRAND_ALIAS_GROUPS = [
    ["Moog", "モーグ", "ムーグ"],
    ["Oberheim", "オーバーハイム"],
    ["ARP", "アープ"],
    ["Sequential", "Sequential Circuits", "シーケンシャル"],
    ["Roland", "ローランド"],
    ["Korg", "コルグ"],
    ["Yamaha", "ヤマハ"],
    ["Akai", "アカイ"],
    ["Waldorf", "ウォルドルフ"],
    ["Ensoniq", "エンソニック"],
    ["Elektron", "エレクトロン"],
    ["Arturia", "アートリア"],
    ["Novation", "ノベーション"],
    ["Behringer", "ベリンガー"],
    ["Clavia", "クラビア"],
    ["Nord", "ノード"],
  ];

  const MODEL_ALIAS_GROUPS = [
    ["Voyager", "ボイジャー"],
    ["Minimoog", "Mini Moog", "ミニモーグ", "ミニムーグ"],
    ["Memorymoog", "Memory Moog", "メモリームーグ"],
    ["Odyssey", "オデッセイ"],
    ["Axxe", "Axe", "アクシー"],
    ["Solina", "ソリーナ"],
    ["Prophet", "プロフェット"],
    ["Juno", "ジュノ"],
    ["Jupiter", "ジュピター"],
    ["Fizmo", "フィズモ"],
    ["Microwave", "マイクロウェーブ"],
    ["Blofeld", "ブロフェルド"],
    ["Drum Machine", "Rhythm Machine", "ドラムマシン", "リズムマシン"],
    ["Groovebox", "Groove Box", "グルーブボックス", "グルーヴボックス"],
  ];

  function buildSearchDiscoveryPlan(inputTerms = []) {
    const cleanInputs = uniqueTerms(inputTerms.map(cleanTerm).filter(Boolean));
    const variants = [];
    const seen = new Set();

    cleanInputs.forEach((term, inputIndex) => {
      addVariant(variants, seen, {
        term,
        inputIndex,
        reason: "original",
        original: true,
      });
    });

    cleanInputs.forEach((term, inputIndex) => {
      const simplified = simplifyDiscoveryTerm(term);
      if (simplified && normalizeTerm(simplified) !== normalizeTerm(term)) {
        addVariant(variants, seen, {
          term: simplified,
          inputIndex,
          reason: "simplified",
        });
      }

      const structural = uniqueTerms([
        ...createSeparatorVariants(term),
        ...(simplified ? createSeparatorVariants(simplified) : []),
      ]);
      structural.forEach((variant) => {
        addVariant(variants, seen, {
          term: variant,
          inputIndex,
          reason: "model-format",
        });
      });

      const baseTerms = uniqueTerms([term, simplified, ...structural].filter(Boolean));
      const brandTerms = expandAliasGroups(baseTerms, BRAND_ALIAS_GROUPS);
      brandTerms.forEach((variant) => {
        addVariant(variants, seen, {
          term: variant,
          inputIndex,
          reason: "brand-alias",
        });
      });

      const modelTerms = expandAliasGroups(
        uniqueTerms([...baseTerms, ...brandTerms]),
        MODEL_ALIAS_GROUPS,
      );
      modelTerms.forEach((variant) => {
        addVariant(variants, seen, {
          term: variant,
          inputIndex,
          reason: "model-alias",
        });
      });
    });

    const limitedVariants = variants.slice(0, MAX_PLAN_TERMS);
    return {
      inputTerms: cleanInputs,
      terms: limitedVariants.map((variant) => variant.term),
      matchTerms: limitedVariants.map((variant) => variant.term),
      variants: limitedVariants,
      generatedTermCount: Math.max(0, limitedVariants.length - cleanInputs.length),
    };
  }

  function selectSearchDiscoveryTerms(inputTerms = [], options = {}) {
    const plan = buildSearchDiscoveryPlan(inputTerms);
    const source = String(options.source || "").trim();
    const maxTerms = Math.max(0, Number(options.maxTerms ?? 5));
    const maxGeneratedTerms = Math.max(0, Number(options.maxGeneratedTerms ?? maxTerms));
    const prefersJapanese = JAPANESE_SOURCE_IDS.has(source);
    const rankedVariants = [...plan.variants]
      .sort((first, second) => compareVariants(first, second, prefersJapanese));
    const originalVariants = rankedVariants
      .filter((variant) => variant.original)
      .slice(0, maxTerms);
    const generatedVariants = rankedVariants
      .filter((variant) => !variant.original)
      .slice(0, Math.min(maxGeneratedTerms, Math.max(0, maxTerms - originalVariants.length)));
    const selectedVariants = [...originalVariants, ...generatedVariants];

    return {
      ...plan,
      source,
      terms: selectedVariants.map((variant) => variant.term),
      selectedVariants,
    };
  }

  function compareVariants(first, second, prefersJapanese) {
    if (first.original !== second.original) return first.original ? -1 : 1;
    if (first.original && second.original) return first.inputIndex - second.inputIndex;

    const firstScore = getVariantScore(first, prefersJapanese);
    const secondScore = getVariantScore(second, prefersJapanese);
    if (firstScore !== secondScore) return firstScore - secondScore;
    if (first.inputIndex !== second.inputIndex) return first.inputIndex - second.inputIndex;
    return first.order - second.order;
  }

  function getVariantScore(variant, prefersJapanese) {
    const localeScore = prefersJapanese
      ? variant.locale === "ja" ? 0 : 8
      : variant.locale === "ja" ? 8 : 0;
    const reasonScore = {
      simplified: 1,
      "model-format": 2,
      "brand-alias": 3,
      "model-alias": 4,
    }[variant.reason] ?? 6;
    const fillerPenalty = normalizeTerm(simplifyDiscoveryTerm(variant.term)) !== normalizeTerm(variant.term)
      ? 5
      : 0;
    return localeScore + reasonScore + fillerPenalty;
  }

  function addVariant(variants, seen, variant) {
    const term = cleanTerm(variant.term);
    const key = normalizeTerm(term);
    if (!key || seen.has(key) || variants.length >= MAX_PLAN_TERMS) return;
    seen.add(key);
    variants.push({
      ...variant,
      term,
      locale: containsJapanese(term) ? "ja" : "latin",
      order: variants.length,
    });
  }

  function expandAliasGroups(inputTerms, groups) {
    const variants = [];
    inputTerms.forEach((term) => {
      groups.forEach((aliases) => {
        const matchedAlias = [...aliases]
          .sort((first, second) => second.length - first.length)
          .find((alias) => containsAlias(term, alias));
        if (!matchedAlias) return;
        aliases.forEach((alias) => {
          if (normalizeTerm(alias) === normalizeTerm(matchedAlias)) return;
          variants.push(replaceAlias(term, matchedAlias, alias));
        });
      });
    });
    return uniqueTerms(variants);
  }

  function containsAlias(value, alias) {
    const normalizedValue = normalizeTerm(value);
    const normalizedAlias = normalizeTerm(alias);
    if (!normalizedValue || !normalizedAlias) return false;
    if (containsJapanese(normalizedAlias)) return normalizedValue.includes(normalizedAlias);

    const pattern = escapeRegExp(normalizedAlias)
      .replace(/\s+/g, "[\\s._/-]*")
      .replace(/([a-z])(\d)/g, "$1[\\s._/-]*$2")
      .replace(/(\d)([a-z])/g, "$1[\\s._/-]*$2");
    return new RegExp(`(^|[^a-z0-9])${pattern}($|[^a-z0-9])`, "i").test(normalizedValue);
  }

  function replaceAlias(value, matchedAlias, replacement) {
    if (containsJapanese(matchedAlias)) {
      return cleanTerm(value.replace(matchedAlias, replacement));
    }

    const escaped = escapeRegExp(matchedAlias)
      .replace(/\s+/g, "[\\s._/-]*")
      .replace(/([a-z])(\d)/gi, "$1[\\s._/-]*$2")
      .replace(/(\d)([a-z])/gi, "$1[\\s._/-]*$2");
    return cleanTerm(value.replace(new RegExp(escaped, "i"), replacement));
  }

  function simplifyDiscoveryTerm(value) {
    let simplified = cleanTerm(value);
    simplified = simplified.replace(/^(?:used|pre[- ]?owned|second[- ]?hand)\s+/i, "");
    simplified = simplified.replace(/\s+(?:for sale|used|pre[- ]?owned)$/i, "");

    const withoutCategory = simplified.replace(
      /\s+(?:analog\s+)?(?:synthesizer|synth|keyboard|module|rackmount|rack module)$/i,
      "",
    );
    if (normalizeTerm(withoutCategory).length >= 3) simplified = withoutCategory;
    return cleanTerm(simplified);
  }

  function createSeparatorVariants(value) {
    const variants = [];
    const compactable = /([a-z])[\s._/-]+(\d)/i.test(value);
    if (compactable) {
      variants.push(value.replace(/([a-z])[\s._/-]+(\d)/gi, "$1-$2"));
      variants.push(value.replace(/([a-z])[\s._/-]+(\d)/gi, "$1$2"));
    }

    const compactModel = /([a-z]+)(\d+)/i.test(value);
    if (compactModel) {
      variants.push(value.replace(/([a-z]+)(\d+)/gi, "$1-$2"));
      variants.push(value.replace(/([a-z]+)(\d+)/gi, "$1 $2"));
    }
    return variants;
  }

  function uniqueTerms(terms) {
    const seen = new Set();
    return terms.filter((term) => {
      const key = normalizeTerm(term);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function cleanTerm(value) {
    return String(value || "").normalize("NFKC").replace(/\s+/g, " ").trim();
  }

  function normalizeTerm(value) {
    return cleanTerm(value).toLocaleLowerCase("ja-JP");
  }

  function containsJapanese(value) {
    return /[\u3040-\u30ff\u3400-\u9fff]/.test(String(value || ""));
  }

  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  root.BrrtzSearchDiscovery = Object.freeze({
    buildSearchDiscoveryPlan,
    selectSearchDiscoveryTerms,
  });
}(globalThis));
