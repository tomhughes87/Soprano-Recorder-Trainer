import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const response = [
  n("D5", 1), n("D5", 0.5), n("A4", 0.5),
  n("C5", 1.5), n("A4", 0.5),
  n("G4", 0.75), n("G4", 0.25), n("A4", 1),
  n("D4", 2),
];

export const haulAwayJoe: Song = {
  id: "haul-away-joe",
  title: "Haul Away Joe",
  difficulty: 2,
  description: "Traditional short-drag shanty, transposed to D minor/Dorian range.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("D5", 0.5), n("D5", 0.5), n("D5", 0.5), n("A4", 0.5),
    n("C5", 0.75), n("C5", 0.25), n("C5", 0.5), n("A4", 0.5),
    n("G4", 0.5), n("G4", 0.5), n("F4", 0.5), n("G4", 0.5),
    n("A4", 0.5), n("C5", 0.5), n("C5", 0.25), n("A4", 0.75),
    ...response,
    n("D5", 0.5), n("D5", 0.5), n("D5", 0.5), n("A4", 0.5),
    n("C5", 0.75), n("C5", 0.25), n("C5", 0.5), n("A4", 0.5),
    n("G4", 0.5), n("G4", 0.5), n("F4", 0.5), n("G4", 0.5),
    n("A4", 0.5), n("C5", 0.5), n("C5", 0.25), n("A4", 0.75),
    ...response,
  ],
};
