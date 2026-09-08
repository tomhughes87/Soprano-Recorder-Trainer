import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const southAustralia: Song = {
  id: "south-australia",
  title: "South Australia",
  difficulty: 3,
  description: "Traditional English-language hauling shanty in C.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("C4", 1), n("E4", 1), n("G4", 1), n("G4", 1),
    n("F4", 1), n("E4", 1), n("D4", 2),
    n("C4", 1), n("E4", 1), n("G4", 2),
    n("A4", 1), n("E4", 1), n("G4", 1.5), n("A4", 0.5),
    n("C4", 1), n("E4", 1), n("G4", 1), n("G4", 0.5), n("G4", 0.5),
    n("F4", 1), n("E4", 1), n("D4", 1), n("D4", 0.5), n("E4", 0.5),
    n("E4", 1.5), n("E4", 0.5), n("G4", 1), n("E4", 1),
    n("D4", 1), n("C4", 3),
    n("C5", 1.5), n("C5", 0.5), n("C5", 1), n("G4", 1),
    n("A4", 0.75), n("B4", 0.25), n("C5", 0.75), n("A4", 0.25), n("G4", 2),
    n("E4", 1), n("D4", 1), n("D4", 2),
    n("E4", 1), n("D4", 1), n("D4", 2),
    n("C5", 1.5), n("C5", 0.5), n("C5", 1), n("G4", 1),
    n("A4", 0.75), n("B4", 0.25), n("C5", 0.75), n("A4", 0.25), n("G4", 1), n("C4", 0.5), n("D4", 0.5),
    n("E4", 1.5), n("E4", 0.5), n("G4", 1), n("E4", 1),
    n("D4", 1), n("C4", 3),
  ],
};
