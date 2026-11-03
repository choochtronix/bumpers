import test from "node:test";
import assert from "node:assert/strict";
import { createPublicKey, verify } from "node:crypto";

import {
  createMercariDpopProof,
  createMercariSearchBody,
  fetchMercariSearchPayload,
  MERCARI_SEARCH_API_URL,
} from "../src/connectors/mercariApi.js";

function decodeJson(segment) {
  return JSON.parse(Buffer.from(segment, "base64url").toString("utf8"));
}

test("Mercari DPoP proof signs the current endpoint and method", () => {
  const proof = createMercariDpopProof({
    nowMs: 1_800_000_000_000,
    jti: "fixture-request-id",
  });
  const [encodedHeader, encodedPayload, encodedSignature] = proof.split(".");
  const header = decodeJson(encodedHeader);
  const payload = decodeJson(encodedPayload);

  assert.equal(header.typ, "dpop+jwt");
  assert.equal(header.alg, "ES256");
  assert.equal(payload.htu, MERCARI_SEARCH_API_URL);
  assert.equal(payload.htm, "POST");
  assert.equal(payload.iat, 1_800_000_000);
  assert.equal(payload.jti, "fixture-request-id");
  assert.equal(verify(
    "sha256",
    Buffer.from(`${encodedHeader}.${encodedPayload}`),
    { key: createPublicKey({ key: header.jwk, format: "jwk" }), dsaEncoding: "ieee-p1363" },
    Buffer.from(encodedSignature, "base64url"),
  ), true);
});

test("Mercari direct search body requests newest on-sale listings", () => {
  const body = createMercariSearchBody("Roland Juno 106", {
    pageSize: 40,
    searchSessionId: "fixture-session",
    deviceUuid: "fixture-device",
  });

  assert.equal(body.pageSize, 40);
  assert.equal(body.searchSessionId, "fixture-session");
  assert.equal(body.laplaceDeviceUuid, "fixture-device");
  assert.equal(body.searchCondition.keyword, "Roland Juno 106");
  assert.equal(body.searchCondition.sort, "SORT_CREATED_TIME");
  assert.equal(body.searchCondition.order, "ORDER_DESC");
  assert.deepEqual(body.searchCondition.status, ["STATUS_ON_SALE"]);
});

test("Mercari direct search sends an anonymous DPoP request", async () => {
  let captured;
  const payload = { items: [{ id: "m123", name: "Fixture synth" }] };
  const result = await fetchMercariSearchPayload("Fixture synth", {
    userAgent: "Brrtz fixture",
    timeoutMs: 1000,
    fetchImpl: async (url, options) => {
      captured = { url, options };
      return new Response(JSON.stringify(payload), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    },
  });

  assert.deepEqual(result, payload);
  assert.equal(captured.url, MERCARI_SEARCH_API_URL);
  assert.equal(captured.options.method, "POST");
  assert.equal(captured.options.headers["x-platform"], "web");
  assert.equal(captured.options.headers["x-country-code"], "JP");
  assert.equal(captured.options.headers["user-agent"], "Brrtz fixture");
  assert.equal(captured.options.headers.dpop.split(".").length, 3);
  assert.equal(JSON.parse(captured.options.body).searchCondition.keyword, "Fixture synth");
});

test("Mercari direct search rejects failed API responses", async () => {
  await assert.rejects(
    fetchMercariSearchPayload("Fixture synth", {
      userAgent: "Brrtz fixture",
      timeoutMs: 1000,
      fetchImpl: async () => new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 }),
    }),
    /responded with 401/,
  );
});
