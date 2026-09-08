import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const scarboroughFair: Song = {
  id: "scarborough-fair",
  title: "Scarborough Fair",
  difficulty: 3,
  description: "Traditional modal melody, transposed down for recorder range.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("D4", 2), n("D4", 1), n("A4", 2), n("A4", 1),
    n("E4", 1), n("F4", 1), n("E4", 1), n("D4", 4),
    n("A4", 1), n("C5", 1), n("D5", 2), n("C5", 1),
    n("A4", 1), n("B4", 1), n("G4", 1), n("A4", 5),
    n("D5", 1), n("D5", 2), n("D5", 1),
    n("C5", 2), n("A4", 1), n("A4", 1), n("G4", 1), n("F4", 1),
    n("E4", 1), n("C4", 5),
    n("D4", 2), n("A4", 1), n("G4", 2), n("F4", 1),
    n("E4", 1), n("D4", 1), n("C4", 1), n("D4", 6),
  ],
};
