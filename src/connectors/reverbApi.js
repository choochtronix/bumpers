import { request as httpsRequest } from "node:https";

const REVERB_AUTH_FAILURES = new Set([401, 403]);

export function fetchHttpsOverIpv6(input, {
  headers = {},
  signal,
  timeoutMs = 5000,
  maxBytes = 8 * 1024 * 1024,
  requestImpl = httpsRequest,
} = {}) {
  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const requestSignal = signal
    ? AbortSignal.any([signal, timeoutSignal])
    : timeoutSignal;

  return new Promise((resolve, reject) => {
    const request = requestImpl(input, {
      family: 6,
      headers,
      method: "GET",
      signal: requestSignal,
    }, (response) => {
      const chunks = [];
      let totalBytes = 0;

      response.on("data", (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > maxBytes) {
          request.destroy(new Error("Upstream response exceeds the size limit."));
          return;
        }
        chunks.push(chunk);
      });
      response.on("end", () => {
        const responseHeaders = new Headers();
        Object.entries(response.headers).forEach(([name, value]) => {
          const values = Array.isArray(value) ? value : [value];
          values.filter(Boolean).forEach((entry) => responseHeaders.append(name, entry));
        });
        resolve(new Response(Buffer.concat(chunks), {
          status: response.statusCode || 500,
          statusText: response.statusMessage || "",
          headers: responseHeaders,
        }));
      });
      response.on("error", reject);
    });

    request.on("error", reject);
    request.end();
  });
}

async function requestWithPublicRetry(requestFn, url, headers, signal) {
  let response = await requestFn(url, { headers, signal });
  if (!REVERB_AUTH_FAILURES.has(response.status) || !headers.authorization) return response;

  const publicHeaders = { ...headers };
  delete publicHeaders.authorization;
  response = await requestFn(url, { headers: publicHeaders, signal });
  return response;
}

export async function fetchReverbListingsResponse(url, headers, {
  fetchImpl = fetch,
  fetchIpv6Impl = fetchHttpsOverIpv6,
  preferIpv6 = true,
  signal,
} = {}) {
  if (preferIpv6) {
    try {
      const response = await requestWithPublicRetry(fetchIpv6Impl, url, headers, signal);
      if (!REVERB_AUTH_FAILURES.has(response.status)) return response;
    } catch (error) {
      if (signal?.aborted) throw error;
    }
  }

  return requestWithPublicRetry(fetchImpl, url, headers, signal);
}
