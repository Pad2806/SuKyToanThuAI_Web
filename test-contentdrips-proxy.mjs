/**
 * Proxy server đơn giản để bypass CORS khi gọi Contentdrips API từ browser.
 * Chạy: node test-contentdrips-proxy.js
 * Frontend gọi: http://localhost:9090/proxy/...
 */
import http from "http";
import https from "https";

const PORT = 9090;
const TARGET = "generate.contentdrips.com";

const server = http.createServer((req, res) => {
  // CORS headers cho frontend
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // Strip /proxy prefix
  const targetPath = req.url.replace(/^\/proxy/, "");
  console.log(`[PROXY] ${req.method} ${targetPath}`);

  const options = {
    hostname: TARGET,
    port: 443,
    path: targetPath,
    method: req.method,
    headers: { ...req.headers, host: TARGET },
  };

  // Remove problematic headers
  delete options.headers["origin"];
  delete options.headers["referer"];

  const proxyReq = https.request(options, (proxyRes) => {
    console.log(`[PROXY] Response: ${proxyRes.statusCode}`);
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (err) => {
    console.error("[PROXY] Error:", err.message);
    res.writeHead(502);
    res.end(JSON.stringify({ error: err.message }));
  });

  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`\n🔌 Contentdrips proxy running at http://localhost:${PORT}`);
  console.log(`   Frontend calls: http://localhost:${PORT}/proxy/render?tool=carousel-maker`);
  console.log(`   Proxied to:     https://${TARGET}/render?tool=carousel-maker\n`);
});
