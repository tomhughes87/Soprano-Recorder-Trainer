export type LeaderboardEntry = {
  playerName: string;
  percentage: number;
  score: number;
  maximumScore: number;
  updatedAt: string;
};

export type Leaderboards = Record<string, LeaderboardEntry[]>;

export type ScoreSubmission = {
  songId: string;
  playerName: string;
  percentage: number;
  score: number;
  maximumScore: number;
};

const PLAYER_NAME_STORAGE_KEY = "carryon-player-name-v1";

export function loadPlayerName() {
  try {
    return localStorage.getItem(PLAYER_NAME_STORAGE_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}

export function savePlayerName(playerName: string) {
  const cleanName = playerName.trim().replace(/\s+/g, " ").slice(0, 30);
  try {
    localStorage.setItem(PLAYER_NAME_STORAGE_KEY, cleanName);
  } catch {
    // The name remains available for this session through React state.
  }
  return cleanName;
}

async function readResponse(response: Response): Promise<Leaderboards> {
  const body = (await response.json()) as {
    error?: string;
    leaderboards?: Leaderboards;
  };
  if (!response.ok) throw new Error(body.error ?? "Score server unavailable");
  return body.leaderboards ?? {};
}

export async function fetchLeaderboards() {
  return readResponse(await fetch("/api/scores", { cache: "no-store" }));
}

export async function submitScore(submission: ScoreSubmission) {
  return readResponse(
    await fetch("/api/scores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submission),
    }),
  );
}

export async function deleteScore(songId: string, playerName: string) {
  return readResponse(
    await fetch("/api/scores", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ songId, playerName }),
    }),
  );
}

export function samePlayer(left: string, right: string) {
  return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
}
