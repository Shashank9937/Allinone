import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, normalize, resolve } from "node:path";

const PORT = Number(process.env.PORT || 10000);
const DIST_DIR = resolve(process.cwd(), "dist");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

function sendFile(res, filePath) {
  const ext = extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, { "Content-Type": type });
  createReadStream(filePath).pipe(res);
}

function safePathFromUrl(urlPath) {
  const cleaned = normalize(decodeURIComponent(urlPath)).replace(/^(\.\.[/\\])+/, "");
  const candidate = resolve(DIST_DIR, `.${cleaned}`);
  if (!candidate.startsWith(DIST_DIR)) return null;
  return candidate;
}

const server = createServer((req, res) => {
  const requestPath = (req.url || "/").split("?")[0] || "/";
  const isRoot = requestPath === "/";
  const filePath = isRoot ? resolve(DIST_DIR, "index.html") : safePathFromUrl(requestPath);

  if (filePath && existsSync(filePath) && statSync(filePath).isFile()) {
    sendFile(res, filePath);
    return;
  }

  const indexPath = resolve(DIST_DIR, "index.html");
  if (existsSync(indexPath)) {
    sendFile(res, indexPath);
    return;
  }

  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Build output not found. Run `npm run build` first.");
});

server.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`FounderOS server listening on port ${PORT}`);
});
