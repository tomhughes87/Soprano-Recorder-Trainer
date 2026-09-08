import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const oldMacDonald: Song = {
  id: "level-1-old-macdonald",
  title: "Old MacDonald",
  difficulty: 1,
  description: "A simplified three-note farm-song arrangement using only G, A and B.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("G4", 1), n("G4", 1), n("G4", 1), n("A4", 1),
    n("B4", 1), n("B4", 1), n("A4", 2),
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 4),
    n("G4", 1), n("G4", 1), n("G4", 1), n("A4", 1),
    n("B4", 1), n("B4", 1), n("A4", 2),
    n("B4", 1), n("A4", 1), n("G4", 1), n("A4", 1),
    n("G4", 4),
  ],
};
