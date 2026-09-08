import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const dataFile = path.resolve(
  process.env.SCORE_DATA_FILE ?? path.join(process.cwd(), "data/song-scores.json"),
);
let writeQueue = Promise.resolve();

function emptyStore() {
  return { version: 1, songs: {} };
}

async function readStore() {
  try {
    const parsed = JSON.parse(await readFile(dataFile, "utf8"));
    return parsed?.songs && typeof parsed.songs === "object"
      ? parsed
      : emptyStore();
  } catch (error) {
    if (error?.code === "ENOENT" || error instanceof SyntaxError) {
      return emptyStore();
    }
    throw error;
  }
}

async function writeStore(store) {
  await mkdir(path.dirname(dataFile), { recursive: true });
  const temporaryFile = `${dataFile}.tmp`;
  await writeFile(temporaryFile, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(temporaryFile, dataFile);
}

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(body));
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 16_384) throw new Error("Request body is too large");
  }
  return JSON.parse(body || "{}");
}

function cleanName(value) {
  return typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, 30)
    : "";
}

function cleanSongId(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value)
    ? value
    : "";
}

function playerKey(name) {
  return name.toLocaleLowerCase("en");
}

function publicLeaderboards(store) {
  return Object.fromEntries(
    Object.entries(store.songs).map(([songId, players]) => [
      songId,
      Object.values(players)
        .sort(
          (left, right) =>
            right.percentage - left.percentage ||
            right.score - left.score ||
            left.updatedAt.localeCompare(right.updatedAt),
        )
        .slice(0, 50),
    ]),
  );
}

function queueStoreChange(change) {
  const operation = writeQueue.then(async () => {
    const store = await readStore();
    await change(store);
    await writeStore(store);
    return store;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

export async function handleScoreApi(request, response) {
  const url = new URL(request.url ?? "/", "http://localhost");
  if (url.pathname !== "/api/scores") return false;

  try {
    if (request.method === "GET") {
      const store = await readStore();
      sendJson(response, 200, { leaderboards: publicLeaderboards(store) });
      return true;
    }

    if (request.method === "POST") {
      const body = await readJsonBody(request);
      const songId = cleanSongId(body.songId);
      const playerName = cleanName(body.playerName);
      const percentage = Math.round(Number(body.percentage));
      const score = Math.round(Number(body.score));
      const maximumScore = Math.round(Number(body.maximumScore));

      if (
        !songId ||
        !playerName ||
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100 ||
        !Number.isFinite(score) ||
        score < 0 ||
        !Number.isFinite(maximumScore) ||
        maximumScore <= 0
      ) {
        sendJson(response, 400, { error: "Invalid score submission" });
        return true;
      }

      const store = await queueStoreChange(async (next) => {
        next.songs[songId] ??= {};
        const key = playerKey(playerName);
        const previous = next.songs[songId][key];
        const isBetter =
          !previous ||
          percentage > previous.percentage ||
          (percentage === previous.percentage && score > previous.score);

        if (isBetter) {
          next.songs[songId][key] = {
            playerName,
            percentage,
            score,
            maximumScore,
            updatedAt: new Date().toISOString(),
          };
        }
      });

      sendJson(response, 200, { leaderboards: publicLeaderboards(store) });
      return true;
    }

    if (request.method === "DELETE") {
      const body = await readJsonBody(request);
      const songId = cleanSongId(body.songId);
      const playerName = cleanName(body.playerName);
      if (!songId || !playerName) {
        sendJson(response, 400, { error: "Invalid score deletion" });
        return true;
      }

      const store = await queueStoreChange(async (next) => {
        delete next.songs[songId]?.[playerKey(playerName)];
        if (next.songs[songId] && !Object.keys(next.songs[songId]).length) {
          delete next.songs[songId];
        }
      });

      sendJson(response, 200, { leaderboards: publicLeaderboards(store) });
      return true;
    }

    sendJson(response, 405, { error: "Method not allowed" });
    return true;
  } catch (error) {
    console.error(error);
    sendJson(response, 500, { error: "Score server error" });
    return true;
  }
}
