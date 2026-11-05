// Minimal GitHub Pages emulator: /Sk-Engineering-Works/<path> -> out dir, gzip text, Range support for video.
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import zlib from "node:zlib";
const [root, port] = [process.argv[2], Number(process.argv[3] || 4000)]; const BASE = "/Sk-Engineering-Works";
const types = { ".html":"text/html; charset=utf-8", ".js":"application/javascript", ".css":"text/css", ".json":"application/json", ".txt":"text/plain", ".xml":"application/xml", ".svg":"image/svg+xml", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".webp":"image/webp", ".avif":"image/avif", ".ico":"image/x-icon", ".mp4":"video/mp4", ".webm":"video/webm", ".woff2":"font/woff2", ".glb":"model/gltf-binary" };
http.createServer((req, res) => {
  let u = decodeURIComponent(req.url.split("?")[0]);
  if (!u.startsWith(BASE)) { res.writeHead(404); return res.end(); }
  let f = path.join(root, u.slice(BASE.length));
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) {
    if (!u.endsWith("/")) { res.writeHead(301, { Location: u + "/" }); return res.end(); }
    f = path.join(f, "index.html");
  }
  if (!fs.existsSync(f)) { f = path.join(root, "404.html"); res.statusCode = 404; }
  const ext = path.extname(f); const type = types[ext] || "application/octet-stream"; const size = fs.statSync(f).size;
  res.setHeader("Content-Type", type); res.setHeader("Cache-Control", "max-age=600"); res.setHeader("Accept-Ranges", "bytes");
  const range = req.headers.range;
  if (range && /video|model/.test(type)) {
    const [s, e] = range.replace("bytes=", "").split("-"); const start = Number(s); const end = e ? Number(e) : size - 1;
    res.writeHead(206, { "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
    return fs.createReadStream(f, { start, end }).pipe(res);
  }
  if (/text|javascript|json|xml|svg/.test(type) && /gzip/.test(req.headers["accept-encoding"] || "")) {
    res.setHeader("Content-Encoding", "gzip"); return fs.createReadStream(f).pipe(zlib.createGzip()).pipe(res);
  }
  res.setHeader("Content-Length", size); fs.createReadStream(f).pipe(res);
}).listen(port, () => console.log("serving", root, "on", port));
