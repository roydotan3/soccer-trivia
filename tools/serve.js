// Zero-dependency static file server for local verification of game/.
// Uses only Node built-ins (http, fs, path, url) — no npm packages.
//
// Usage: node tools/serve.js [root] [port]
//   root defaults to "game", port defaults to 8080.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function mimeTypeFor(filePath) {
  return MIME_TYPES[extname(filePath).toLowerCase()] || "application/octet-stream";
}

function startServer(root, port) {
  const absRoot = resolve(root);

  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      let pathname = decodeURIComponent(url.pathname);
      if (pathname.endsWith("/")) pathname += "index.html";

      // Resolve against root and refuse to serve anything outside it
      // (blocks "../" path traversal).
      const requestedPath = normalize(join(absRoot, pathname));
      if (!requestedPath.startsWith(absRoot)) {
        res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Forbidden");
        return;
      }

      const fileStat = await stat(requestedPath).catch(() => null);
      if (!fileStat || !fileStat.isFile()) {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }

      const data = await readFile(requestedPath);
      res.writeHead(200, { "Content-Type": mimeTypeFor(requestedPath) });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Internal server error: ${err.message}`);
    }
  });

  server.listen(port, () => {
    console.log(`Serving ${absRoot} at http://localhost:${port}/`);
  });

  return server;
}

// Only auto-start when run directly (`node tools/serve.js`), not when
// imported — lets tests import startServer without opening a port.
const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const root = process.argv[2] || "game";
  const port = Number(process.argv[3]) || 8080;
  startServer(root, port);
}

export { startServer };
