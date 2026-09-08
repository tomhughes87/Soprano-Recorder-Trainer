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
