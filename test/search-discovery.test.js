import { test } from "node:test";
import assert from "node:assert/strict";

import "../search-discovery.js";

const {
  buildSearchDiscoveryPlan,
  selectSearchDiscoveryTerms,
} = globalThis.BrrtzSearchDiscovery;

test("natural-language model searches gain bounded brand and model aliases", () => {
  const plan = buildSearchDiscoveryPlan(["used Moog Voyager synthesizer"]);

  assert.equal(plan.terms[0], "used Moog Voyager synthesizer");
  assert.ok(plan.terms.includes("Moog Voyager"));
  assert.ok(plan.terms.includes("モーグ ボイジャー"));
  assert.ok(plan.terms.includes("ムーグ ボイジャー"));
  assert.ok(plan.terms.length <= 64);
});

test("Japanese sources prioritize Japanese aliases within their query budget", () => {
  const plan = selectSearchDiscoveryTerms(["Moog Voyager"], {
    source: "mercari",
    maxTerms: 3,
  });

  assert.deepEqual(plan.terms, [
    "Moog Voyager",
    "モーグ Voyager",
    "ムーグ Voyager",
  ]);
});

test("global sources keep Latin model formatting ahead of Japanese aliases", () => {
  const plan = selectSearchDiscoveryTerms(["Roland TR 808"], {
    source: "ebay-us",
    maxTerms: 3,
  });

  assert.deepEqual(plan.terms, [
    "Roland TR 808",
    "Roland TR-808",
    "Roland TR808",
  ]);
});

test("explicit user terms are preserved before generated variants", () => {
  const plan = selectSearchDiscoveryTerms([
    "ARP 2600",
    "ARP Odyssey",
    "ARP Axxe",
  ], {
    source: "yahoo-auctions",
    maxTerms: 3,
  });

  assert.deepEqual(plan.terms, [
    "ARP 2600",
    "ARP Odyssey",
    "ARP Axxe",
  ]);
});

test("generated recall is capped without dropping explicit user terms", () => {
  const plan = selectSearchDiscoveryTerms([
    "Moog Voyager",
    "Minimoog",
    "Memorymoog",
  ], {
    source: "yahoo-auctions",
    maxTerms: 5,
    maxGeneratedTerms: 2,
  });

  assert.equal(plan.terms.length, 5);
  assert.deepEqual(plan.terms.slice(0, 3), [
    "Moog Voyager",
    "Minimoog",
    "Memorymoog",
  ]);
  assert.equal(plan.selectedVariants.filter((variant) => !variant.original).length, 2);
});
