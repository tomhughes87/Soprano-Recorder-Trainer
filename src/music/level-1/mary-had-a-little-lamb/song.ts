import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const maryHadALittleLamb: Song = {
  id: "level-1-mary-had-a-little-lamb",
  title: "Mary Had a Little Lamb",
  difficulty: 1,
  description: "The familiar melody transposed to the beginner notes B, A and G.",
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
