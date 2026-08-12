const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000";

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent(req.url.split("?")[0]);

  if (requestPath.startsWith("/api/")) {
    const targetUrl = new URL(requestPath, BACKEND_URL);
    const proxyReq = http.request(
      {
        hostname: targetUrl.hostname,
        port: targetUrl.port || 5000,
        path: `${targetUrl.pathname}${targetUrl.search}`,
        method: req.method,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode || 502, proxyRes.headers);
        proxyRes.pipe(res);
      }
    );

    proxyReq.on("error", () => {
      res.writeHead(502, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: false, message: "Backend unavailable" }));
    });

    req.pipe(proxyReq);
    return;
  }

  const safePath = path.normalize(requestPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(
    ROOT,
    safePath === path.sep ? "index.html" : safePath
  );

  const resolvedPath = path.resolve(filePath);
  if (!resolvedPath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(resolvedPath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const ext = path.extname(resolvedPath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    });
    fs.createReadStream(resolvedPath).pipe(res);
  });
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(
      `Port ${PORT} is already in use. Stop the other server or run:\n` +
        `  $env:PORT=8001; npm run dev`
    );
    process.exit(1);
  }

  throw err;
});

server.listen(PORT, () => {
  console.log(`Frontend running at http://127.0.0.1:${PORT}`);
});
