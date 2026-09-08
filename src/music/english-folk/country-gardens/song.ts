import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const A = [
  n("C5", 1), n("C5", 0.75), n("B4", 0.25), n("A4", 1), n("A4", 1),
  n("G4", 0.5), n("A4", 0.5), n("G4", 0.5), n("F4", 0.5), n("E4", 1), n("E4", 0.75), n("F4", 0.25),
  n("G4", 1), n("C4", 1), n("D4", 1), n("F4", 1),
  n("E4", 1.5), n("D4", 0.5), n("C4", 2),
];

const B = [
  n("C5", 1), n("C5", 0.75), n("A4", 0.25), n("B4", 1), n("G4", 1),
  n("C5", 1), n("C5", 0.5), n("A4", 0.5), n("B4", 0.5), n("A4", 0.5), n("G4", 1),
  n("C5", 1), n("C5", 0.5), n("B4", 0.5), n("A4", 1), n("D5", 1),
  n("B4", 1.5), n("A4", 0.5), n("G4", 1), n("A4", 0.5), n("B4", 0.5),
];

export const countryGardens: Song = {
  id: "country-gardens",
  title: "Country Gardens",
  difficulty: 3,
  description: "Traditional English Morris dance, transposed for recorder range.",
  playable: true,
  rhythmVerified: true,
  events: [...A, ...A, ...B, ...A, ...B, ...A],
};
