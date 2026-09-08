import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const threeBlindMice: Song = {
  id: "level-1-three-blind-mice",
  title: "Three Blind Mice",
  difficulty: 1,
  description: "The recognisable opening plus a G–A–B rhythm exercise.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("G4", 0.5), n("G4", 0.5), n("A4", 0.5), n("A4", 0.5), n("B4", 2),
    n("G4", 0.5), n("G4", 0.5), n("A4", 0.5), n("A4", 0.5), n("B4", 2),
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("B4", 1), n("A4", 1), n("G4", 2),
  ],
};
