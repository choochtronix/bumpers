import { AsyncLocalStorage } from "node:async_hooks";

export const requestContext = new AsyncLocalStorage();

export function createCoalescer() {
  const pending = new Map();
  return async (key, work, signal) => {
    signal?.throwIfAborted();
    let task = pending.get(key);
    if (!task) {
      if (pending.size >= 200) throw new Error("Source capacity reached. Try again shortly.");
      task = { users: 0, controller: new AbortController() };
      task.promise = Promise.resolve().then(() => work(task.controller.signal)).finally(() => {
        if (pending.get(key) === task) pending.delete(key);
      });
      pending.set(key, task);
    }
    task.users += 1;
    let abort;
    try {
      return await Promise.race([task.promise, new Promise((_, reject) => {
        abort = () => reject(signal.reason);
        signal?.addEventListener("abort", abort, { once: true });
      })]);
    } finally {
      signal?.removeEventListener("abort", abort);
      if (--task.users === 0) {
        if (pending.get(key) === task) pending.delete(key);
        task.controller.abort();
      }
    }
  };
}

export class BoundedCache extends Map {
  constructor({ maxEntries = 200, maxBytes = 32 * 1024 * 1024, ttl = 900_000 } = {}) {
    super(); Object.assign(this, { maxEntries, maxBytes, ttl, bytes: 0 });
  }
  delete(key) { const entry = super.get(key); if (entry) this.bytes -= entry.bytes; return super.delete(key); }
  get(key) {
    const entry = super.get(key);
    if (!entry) return undefined;
    if (entry.expires <= Date.now()) { this.delete(key); return undefined; }
    super.delete(key); super.set(key, entry); return entry.value;
  }
  has(key) { return this.get(key) !== undefined; }
  *entries() { for (const [key, entry] of super.entries()) yield [key, entry.value]; }
  [Symbol.iterator]() { return this.entries(); }
  set(key, value) {
    this.delete(key);
    for (const [id, entry] of super.entries()) if (entry.expires <= Date.now()) this.delete(id);
    const bytes = value?.body?.byteLength ?? Buffer.byteLength(JSON.stringify(value));
    if (bytes > this.maxBytes) return this;
    super.set(key, { value, bytes, expires: Date.now() + this.ttl }); this.bytes += bytes;
    while (this.size > this.maxEntries || this.bytes > this.maxBytes) this.delete(super.keys().next().value);
    return this;
  }
  clear() { super.clear(); this.bytes = 0; }
}

export class Semaphore {
  constructor(limit, maxQueue = 64) { this.limit = limit; this.maxQueue = maxQueue; this.active = 0; this.queue = []; }
  async acquire(signal) {
    signal?.throwIfAborted();
    if (this.active >= this.limit) {
      if (this.queue.length >= this.maxQueue) throw Object.assign(new Error("Source capacity reached. Try again shortly."), { code: "capacity" });
      await new Promise((resolve, reject) => {
        const item = { resolve, reject, signal, abort: null };
        item.abort = () => { this.queue = this.queue.filter((queued) => queued !== item); reject(signal.reason); };
        signal?.addEventListener("abort", item.abort, { once: true });
        this.queue.push(item);
      });
    } else this.active += 1;
    let released = false;
    return () => {
      if (released) return; released = true;
      const next = this.queue.shift();
      if (next) { next.signal?.removeEventListener("abort", next.abort); next.resolve(); }
      else this.active -= 1;
    };
  }
}

export function createBoundedFetch(fetchImpl = globalThis.fetch, { timeout = 25_000, maxBytes = 8 * 1024 * 1024 } = {}) {
  const globalSlots = new Semaphore(16, 128);
  const hostSlots = new Map();
  return async (input, options = {}) => {
    const url = new URL(input);
    const signals = [AbortSignal.timeout(Math.min(65_000, options.timeoutMs || timeout)), options.signal, requestContext.getStore()?.signal].filter(Boolean);
    const signal = AbortSignal.any(signals);
    if (!hostSlots.has(url.host)) hostSlots.set(url.host, new Semaphore(4, 64));
    const releaseHost = await hostSlots.get(url.host).acquire(signal);
    let releaseGlobal;
    try {
      releaseGlobal = await globalSlots.acquire(signal);
      const response = await fetchImpl(input, { ...options, signal });
      if (!response.body) return response;
      const reader = response.body.getReader();
      const chunks = []; let total = 0;
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          total += value.byteLength;
          if (total > maxBytes) throw new Error("Upstream response exceeds the size limit.");
          chunks.push(value);
        }
      } catch (error) { await reader.cancel().catch(() => {}); throw error; }
      const headers = new Headers(response.headers);
      headers.delete("content-encoding"); headers.delete("content-length");
      return new Response(Buffer.concat(chunks), { status: response.status, statusText: response.statusText, headers });
    } finally { releaseGlobal?.(); releaseHost(); }
  };
}

export function createPublicRouteGuard() {
  const clients = new Map();
  return (request, response, url) => {
    const search = ["/api/search", "/api/browse", "/mcp"].includes(url.pathname);
    const noise = url.pathname === "/api/curation/noise";
    if (!search && !noise && !url.pathname.startsWith("/api/rakuma-")) return true;
    if (url.pathname !== "/mcp" && !noise && !["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }); response.end(); return false;
    }
    if (url.toString().length > 8000 || ["terms", "excludes"].some((key) => (url.searchParams.get(key) || "").split("|").length > 32)) {
      response.writeHead(400); response.end("Search input is too large."); return false;
    }
    // Use the socket identity unless a trusted deployment explicitly enables one proxy hop.
    const ip = process.env.BRRTZ_TRUST_PROXY === "true"
      ? String(request.headers["x-forwarded-for"] || request.socket.remoteAddress).split(",").at(-1).trim()
      : request.socket.remoteAddress;
    const key = `${ip}:${noise ? "noise" : search ? "search" : "image"}`;
    const now = Date.now();
    for (const [id, entry] of clients) if (entry.until <= now) clients.delete(id);
    if (!clients.has(key) && clients.size >= 10_000) {
      response.writeHead(503, { "Retry-After": "60" }); response.end("Please try again shortly."); return false;
    }
    const entry = clients.get(key) || { count: 0, until: now + 60_000 };
    clients.set(key, entry); entry.count += 1;
    if (entry.count > (noise ? 20 : search ? 180 : 600)) {
      response.writeHead(429, { "Retry-After": String(Math.ceil((entry.until - now) / 1000)) });
      response.end("Please try again shortly."); return false;
    }
    return true;
  };
}
