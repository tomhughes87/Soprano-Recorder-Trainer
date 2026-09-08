import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const hotCrossBunsVariations: Song = {
  id: "level-1-hot-cross-buns-variations",
  title: "Hot Cross Buns — rhythm variations",
  difficulty: 1,
  description: "Three trainer-made variations: steady notes, quick echoes and detached notes.",
  playable: true,
  rhythmVerified: true,
  events: [
    // Theme: the familiar rhythm.
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("B4", 1), n("A4", 1), n("G4", 2),
    // Variation 1: paired eighth-note echoes.
    n("B4", 0.5), n("B4", 0.5), n("A4", 0.5), n("A4", 0.5), n("G4", 2),
    n("B4", 0.5), n("B4", 0.5), n("A4", 0.5), n("A4", 0.5), n("G4", 2),
    // Variation 2: detached quarter notes.
    n("G4", 1, { articulation: "staccato" }),
    n("G4", 1, { articulation: "staccato" }),
    n("A4", 1, { articulation: "staccato" }),
    n("A4", 1, { articulation: "staccato" }),
    n("B4", 1, { articulation: "staccato" }),
    n("A4", 1, { articulation: "staccato" }),
    n("G4", 2),
  ],
};
