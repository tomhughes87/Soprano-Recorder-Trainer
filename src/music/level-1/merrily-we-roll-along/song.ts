import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const merrilyWeRollAlong: Song = {
  id: "level-1-merrily-we-roll-along",
  title: "Merrily We Roll Along",
  difficulty: 1,
  description: "A B–A–G tune that reinforces the same pattern as Mary Had a Little Lamb.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("A4", 1), n("G4", 1), n("A4", 1),
    n("B4", 1), n("B4", 1), n("B4", 2),
    n("A4", 1), n("A4", 1), n("A4", 2),
    n("B4", 1), n("B4", 1), n("B4", 2),
    n("B4", 1), n("A4", 1), n("G4", 1), n("A4", 1),
    n("B4", 1), n("B4", 1), n("B4", 1), n("B4", 1),
    n("A4", 1), n("A4", 1), n("B4", 1), n("A4", 1),
    n("G4", 4),
  ],
};
