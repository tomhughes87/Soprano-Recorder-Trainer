import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const hotCrossBuns: Song = {
  id: "level-1-hot-cross-buns",
  title: "Hot Cross Buns",
  difficulty: 1,
  description: "The classic first B–A–G recorder tune.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("G4", 0.5), n("G4", 0.5), n("G4", 0.5), n("G4", 0.5),
    n("A4", 0.5), n("A4", 0.5), n("A4", 0.5), n("A4", 0.5),
    n("B4", 1), n("A4", 1), n("G4", 2),
  ],
};
