export type Grade = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

export type SongRating = {
  bestPercentage: number;
  bestGrade: Grade;
  lastPercentage: number;
  lastGrade: Grade;
  attempts: number;
  updatedAt: string;
};

export type SongRatings = Record<string, SongRating>;

const STORAGE_KEY = "carryon-song-ratings-v1";

export function gradeForPercentage(percentage: number): Grade {
  if (percentage >= 95) return "A+";
  if (percentage >= 90) return "A";
  if (percentage >= 85) return "B";
  if (percentage >= 80) return "C";
  if (percentage >= 75) return "D";
  if (percentage >= 70) return "E";
  return "F";
}

export function loadSongRatings(): SongRatings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as SongRatings) : {};
  } catch {
    return {};
  }
}

export function saveSongResult(
  songId: string,
  percentage: number,
): SongRatings {
  const ratings = loadSongRatings();
  const previous = ratings[songId];
  const safePercentage = Math.max(0, Math.min(100, Math.round(percentage)));
  const bestPercentage = Math.max(
    previous?.bestPercentage ?? 0,
    safePercentage,
  );

  const next: SongRatings = {
    ...ratings,
    [songId]: {
      bestPercentage,
      bestGrade: gradeForPercentage(bestPercentage),
      lastPercentage: safePercentage,
      lastGrade: gradeForPercentage(safePercentage),
      attempts: (previous?.attempts ?? 0) + 1,
      updatedAt: new Date().toISOString(),
    },
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The result still appears for this session if storage is unavailable.
  }

  return next;
}

export function clearSongRating(songId: string): SongRatings {
  const next = { ...loadSongRatings() };
  delete next[songId];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The in-memory result can still be cleared if storage is unavailable.
  }

  return next;
}

export const SONG_RATINGS_STORAGE_KEY = STORAGE_KEY;
