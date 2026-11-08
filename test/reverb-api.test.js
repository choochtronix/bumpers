import test from "node:test";
import assert from "node:assert/strict";

import { fetchReverbListingsResponse } from "../src/connectors/reverbApi.js";

const API_URL = "https://api.reverb.com/api/listings";

test("Reverb prefers successful IPv6 egress", async () => {
  let defaultCalls = 0;
  const response = await fetchReverbListingsResponse(API_URL, {}, {
    fetchIpv6Impl: async () => new Response("{}", { status: 200 }),
    fetchImpl: async () => {
      defaultCalls += 1;
      return new Response("{}", { status: 200 });
    },
  });

  assert.equal(response.status, 200);
  assert.equal(defaultCalls, 0);
});

test("Reverb falls back to ordinary egress when IPv6 is unavailable or blocked", async () => {
  for (const ipv6Result of [new Error("connect ENETUNREACH"), new Response("", { status: 403 })]) {
    let defaultCalls = 0;
    const response = await fetchReverbListingsResponse(API_URL, {}, {
      fetchIpv6Impl: async () => {
        if (ipv6Result instanceof Error) throw ipv6Result;
        return ipv6Result;
      },
      fetchImpl: async () => {
        defaultCalls += 1;
        return new Response("{}", { status: 200 });
      },
    });

    assert.equal(response.status, 200);
    assert.equal(defaultCalls, 1);
  }
});

test("Reverb retries a rejected token anonymously on each transport", async () => {
  const calls = [];
  const response = await fetchReverbListingsResponse(API_URL, {
    authorization: "Bearer rejected-token",
  }, {
    fetchIpv6Impl: async (_url, options) => {
      calls.push(["ipv6", options.headers.authorization]);
      return new Response("", { status: 403 });
    },
    fetchImpl: async (_url, options) => {
      calls.push(["default", options.headers.authorization]);
      return new Response("{}", { status: options.headers.authorization ? 403 : 200 });
    },
  });

  assert.equal(response.status, 200);
  assert.deepEqual(calls, [
    ["ipv6", "Bearer rejected-token"],
    ["ipv6", undefined],
    ["default", "Bearer rejected-token"],
    ["default", undefined],
  ]);
});

test("Reverb does not retry non-auth failures", async () => {
  for (const status of [429, 500, 503]) {
    let calls = 0;
    const response = await fetchReverbListingsResponse(API_URL, {}, {
      fetchIpv6Impl: async () => {
        calls += 1;
        return new Response("", { status });
      },
      fetchImpl: async () => {
        calls += 1;
        return new Response("", { status: 200 });
      },
    });

    assert.equal(response.status, status);
    assert.equal(calls, 1);
  }
});
