export type Articulation = "normal" | "staccato" | "slur";

export type SongEvent = {
  note: string;
  beats: number;
  articulation?: Articulation;
  tieToNext?: boolean;
};

export type Song = {
  id: string;
  title: string;
  difficulty: number;
  description: string;
  playable: boolean;
  notes?: string[];
  events?: SongEvent[];
  longNotes?: string[];
  longEvents?: SongEvent[];
  rhythmVerified?: boolean;
};

export const noteEvent = (
  note: string,
  beats = 1,
  options: Omit<SongEvent, "note" | "beats"> = {},
): SongEvent => ({
  note,
  beats,
  ...options,
});

export const notesToEvents = (notes: string[] = []): SongEvent[] =>
  notes.map((note) => noteEvent(note, 1));

/** Portion of an event's time slot during which its sound is sustained. */
export function articulationGateRatio(
  articulation: Articulation = "normal",
) {
  if (articulation === "staccato") return 0.58;
  if (articulation === "slur") return 1;
  return 0.92;
}

export function eventLengthLabel(event: SongEvent) {
  if (event.beats === 0.25) return "¼ beat";
  if (event.beats === 0.5) return "½ beat";
  if (event.beats === 0.75) return "¾ beat";
  if (event.beats === 1) return "1 beat";
  if (event.beats === 1.5) return "1½ beats";
  if (event.beats === 2) return "2 beats";
  if (event.beats === 3) return "3 beats";
  if (event.beats === 4) return "4 beats";
  return `${event.beats} beats`;
}

export function articulationLabel(event: SongEvent) {
  if (event.tieToNext) return "hold into next";
  if (event.articulation === "slur") return "blend to next";
  if (event.articulation === "staccato") return "short / detached";
  return "";
}

/**
 * Collapse explicitly tied repeated pitches into one logical held event.
 * Example:
 *   E4 (1 beat, tieToNext) + E4 (1 beat)
 * becomes:
 *   E4 (2 beats)
 *
 * This is used by playback, Rhythm Game and any future rhythm views so a tie
 * is never treated as two separate attacks.
 */
export function mergeTiedEvents(events: SongEvent[]): SongEvent[] {
  const merged: SongEvent[] = [];

  for (let index = 0; index < events.length; index += 1) {
    const current = events[index];
    let beats = current.beats;
    let finalArticulation = current.articulation;
    let tieToNext = current.tieToNext;

    while (
      tieToNext &&
      index + 1 < events.length &&
      events[index + 1].note === current.note
    ) {
      const next = events[index + 1];
      beats += next.beats;
      finalArticulation = next.articulation ?? finalArticulation;
      tieToNext = next.tieToNext;
      index += 1;
    }

    merged.push({
      ...current,
      beats,
      articulation: finalArticulation,
      tieToNext: false,
    });
  }

  return merged;
}
