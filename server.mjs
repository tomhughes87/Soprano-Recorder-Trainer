import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import { handleScoreApi } from "./scoreServer.mjs";

const host = process.env.HOST ?? "0.0.0.0";
const port = Number(process.env.PORT ?? 4173);
const publicDirectory = path.resolve("dist");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function serveFile(response, filePath) {
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) return false;
    response.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] ?? "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
    return true;
  } catch {
    return false;
  }
}

const server = createServer(async (request, response) => {
  if (await handleScoreApi(request, response)) return;

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }

  const url = new URL(request.url ?? "/", "http://localhost");
  const requestedPath = decodeURIComponent(url.pathname);
  const relativePath = requestedPath === "/" ? "index.html" : requestedPath.slice(1);
  const candidate = path.resolve(publicDirectory, relativePath);

  if (candidate.startsWith(`${publicDirectory}${path.sep}`) && (await serveFile(response, candidate))) {
    return;
  }

  if (await serveFile(response, path.join(publicDirectory, "index.html"))) return;
  response.writeHead(404).end("Run npm run build before starting the server.");
});

server.listen(port, host, () => {
  console.log(`Recorder trainer listening on http://${host}:${port}`);
});
