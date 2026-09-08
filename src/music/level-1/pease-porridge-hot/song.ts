import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const peasePorridgeHot: Song = {
  id: "level-1-pease-porridge-hot",
  title: "Pease Porridge Hot",
  difficulty: 1,
  description: "An easy B–A–G chant with quarters, halves and repeated notes.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 2), n("G4", 2),
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 4),
    n("G4", 0.5), n("G4", 0.5), n("G4", 0.5), n("G4", 0.5),
    n("A4", 1), n("A4", 1),
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 4),
  ],
};
