// Minimal static server for ./out, used by the browser tests and `npm run preview`.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const dir = process.argv[2] ?? "out";
const root = join(process.cwd(), dir);
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".woff": "font/woff", ".xml": "application/xml", ".txt": "text/plain", ".json": "application/json" };

createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    res.writeHead(200, { "content-type": types[extname(file)] ?? "application/octet-stream" }).end(body);
  } catch {
    const body = await readFile(join(root, "404.html")).catch(() => "Not found");
    res.writeHead(404, { "content-type": "text/html; charset=utf-8" }).end(body);
  }
}).listen(4173, () => console.log(`Serving ./${dir} at http://localhost:4173`));
