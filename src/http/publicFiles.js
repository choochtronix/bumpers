import { readFile, realpath } from "node:fs/promises";
import { resolve, relative, extname, sep } from "node:path";
import { createHash } from "node:crypto";
import { gzip as gzipCallback } from "node:zlib";
import { promisify } from "node:util";
import { isIP } from "node:net";

const gzip = promisify(gzipCallback);
const publicFiles = new Set([
  "index.html", "about.html", "for-agents.html", "chatgpt.html", "agent-connector.html",
  "app.js", "regions.js", "search-discovery.js", "listing-freshness.js",
  "gear-scanner-curation.js", "auth-session.js", "account-storage.js", "styles.css", "aeo.css",
  "design-system.css", "sitemap.xml", "robots.txt", "llms.txt",
]);
const assetTypes = new Map(Object.entries({
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".gif": "image/gif", ".ico": "image/x-icon", ".avif": "image/avif",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".mp4": "video/mp4",
}));
const textTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".xml": "application/xml", ".txt": "text/plain" };

export function isPublicPath(pathname) {
  if (pathname.includes("\\") || pathname.includes("\0")) return false;
  const path = pathname.replace(/^\//, "");
  if (path.split("/").some((part) => !part || part.startsWith("."))) return false;
  return publicFiles.has(path)
    || (/^(gear|regions|sources)\/[a-z0-9/-]+\.html$/.test(path))
    || (path.startsWith("assets/") && assetTypes.has(extname(path).toLowerCase()));
}

export function setSecurityHeaders(request, response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("X-Frame-Options", "DENY");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader("Content-Security-Policy", "base-uri 'self'; object-src 'none'; frame-ancestors 'none'");
  // Observe compatibility before enforcing script/style restrictions on the legacy shell.
  response.setHeader("Content-Security-Policy-Report-Only", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-ancestors 'none'; base-uri 'self'; object-src 'none'");
  if (/^(www\.)?brrtz\.com(?::443)?$/i.test(request.headers.host || "")) {
    response.setHeader("Strict-Transport-Security", "max-age=31536000");
  }
}

export function publicRequestOrigin(request, configured = process.env.BRRTZ_PUBLIC_ORIGIN) {
  if (configured) {
    const url = new URL(configured);
    if (url.protocol !== "https:" || url.username || url.password) throw new Error("Invalid public origin configuration.");
    return url.origin;
  }
  const host = String(request.headers.host || "");
  if (/^(www\.)?brrtz\.com(?::443)?$/i.test(host)) return `https://${host}`;
  const url = new URL(`http://${host || "127.0.0.1:5173"}`);
  const name = url.hostname;
  const [first, second] = name.split(".").map(Number);
  const privateIpv4 = isIP(name) === 4 && (first === 127 || first === 10
    || (first === 192 && second === 168) || (first === 172 && second >= 16 && second <= 31)
    || (first === 100 && second >= 64 && second <= 127));
  if (name === "localhost" || name === "[::1]" || privateIpv4) return url.origin;
  return "https://brrtz.com";
}

export async function servePublicFile({ root, pathname, request, response, transformHtml = (html) => html }) {
  if (!["GET", "HEAD"].includes(request.method)) {
    response.writeHead(405, { Allow: "GET, HEAD" });
    response.end();
    return;
  }
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { decoded = ""; }
  if (!isPublicPath(decoded)) return notFound(response);
  try {
    const rootPath = await realpath(root);
    const filePath = await realpath(resolve(rootPath, decoded.replace(/^\//, "")));
    const path = relative(rootPath, filePath);
    // Recheck the resolved path: a public-looking symlink must not expose private files.
    if (path.startsWith(`..${sep}`) || !isPublicPath(path.split(sep).join("/"))) return notFound(response);
    const extension = extname(filePath).toLowerCase();
    let contents = await readFile(filePath);
    if (extension === ".html") contents = Buffer.from(transformHtml(contents.toString("utf8")));
    const etag = `W/"${createHash("sha256").update(contents).digest("hex").slice(0, 32)}"`;
    const headers = {
      "content-type": textTypes[extension] ? `${textTypes[extension]}; charset=utf-8` : assetTypes.get(extension),
      "cache-control": "no-cache", etag, vary: "Accept-Encoding",
    };
    if ((request.headers["if-none-match"] || "").split(/,\s*/).includes(etag)) {
      response.writeHead(304, headers);
      response.end();
      return;
    }
    if (contents.length > 1024 && (textTypes[extension] || extension === ".svg")
      && /\bgzip\b(?!\s*;\s*q=0(?:\.0*)?(?:\s*,|$))/.test(request.headers["accept-encoding"] || "")) {
      contents = await gzip(contents);
      headers["content-encoding"] = "gzip";
    }
    headers["content-length"] = contents.length;
    response.writeHead(200, headers);
    response.end(request.method === "HEAD" ? undefined : contents);
  } catch (error) {
    if (!["ENOENT", "ENOTDIR", "EISDIR"].includes(error.code)) throw error;
    notFound(response);
  }
}

function notFound(response) {
  response.writeHead(404, { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" });
  response.end("Not found");
}
