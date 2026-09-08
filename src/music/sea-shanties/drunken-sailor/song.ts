import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const verse = [
  n("A4", 0.5), n("A4", 0.25), n("A4", 0.25), n("A4", 0.5), n("A4", 0.25), n("A4", 0.25),
  n("A4", 0.5), n("D4", 0.5), n("F4", 0.5), n("A4", 0.5),
  n("G4", 0.5), n("G4", 0.25), n("G4", 0.25), n("G4", 0.5), n("G4", 0.25), n("G4", 0.25),
  n("G4", 0.5), n("C4", 0.5), n("E4", 0.5), n("G4", 0.5),
  n("A4", 0.5), n("A4", 0.25), n("A4", 0.25), n("A4", 0.5), n("A4", 0.25), n("A4", 0.25),
  n("A4", 0.5), n("B4", 0.5), n("C5", 0.5), n("D5", 0.5),
  n("C5", 0.5), n("A4", 0.5), n("G4", 0.5), n("E4", 0.5),
  n("D4", 1), n("D4", 1),
];

const chorus = [
  n("A4", 1), n("A4", 0.75), n("A4", 0.25),
  n("A4", 0.5), n("D4", 0.5), n("F4", 0.5), n("A4", 0.5),
  n("G4", 1), n("G4", 0.75), n("G4", 0.25),
  n("G4", 0.5), n("C4", 0.5), n("E4", 0.5), n("G4", 0.5),
  n("A4", 1), n("A4", 0.75), n("A4", 0.25),
  n("A4", 0.5), n("B4", 0.5), n("C5", 0.5), n("D5", 0.5),
  n("C5", 0.5), n("A4", 0.5), n("G4", 0.5), n("E4", 0.5),
  n("D4", 1), n("D4", 1),
];

export const drunkenSailor: Song = {
  id: "drunken-sailor",
  title: "Drunken Sailor",
  difficulty: 2,
  description: "Traditional capstan shanty, transposed to D Dorian.",
  playable: true,
  rhythmVerified: true,
  events: [...verse, ...chorus],
};
