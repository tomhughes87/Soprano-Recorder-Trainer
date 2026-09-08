import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const lucyLocket: Song = {
  id: "level-1-lucy-locket",
  title: "Lucy Locket",
  difficulty: 1,
  description: "An English nursery tune arranged as a gentle G–A–B exercise.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 1), n("G4", 1), n("A4", 2),
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 4),
    n("G4", 1), n("G4", 1), n("A4", 1), n("A4", 1),
    n("B4", 1), n("B4", 1), n("A4", 2),
    n("B4", 1), n("A4", 1), n("G4", 1), n("A4", 1),
    n("G4", 4),
  ],
};
