import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const OPENING = [
  n("G4", 1), n("G4", 1), n("G4", 1), n("A4", 1),
  n("B4", 2), n("A4", 2),
  n("G4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
  n("G4", 4),
];

export const auClairDeLaLune: Song = {
  id: "level-1-au-clair-de-la-lune",
  title: "Au Clair de la Lune",
  difficulty: 1,
  description: "The opening phrase, transposed to G–A–B and repeated.",
  playable: true,
  rhythmVerified: true,
  events: [...OPENING, ...OPENING],
};
