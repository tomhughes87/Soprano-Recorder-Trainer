import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const A = [
  n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("A4", 0.5), n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("A4", 0.5),
  n("G4", 1), n("E4", 1), n("E4", 1.5), n("D4", 0.5),
  n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("A4", 0.5), n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("G4", 0.5),
  n("C5", 1), n("A4", 1), n("A4", 2),
  n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("A4", 0.5), n("G4", 0.5), n("A4", 0.5), n("B4", 0.5), n("A4", 0.5),
  n("G4", 1), n("E4", 1), n("C5", 2),
  n("E4", 1), n("D4", 0.5), n("C4", 0.5), n("D4", 1), n("B4", 1),
  n("C5", 1), n("A4", 1), n("A4", 2),
];

const B = [
  n("D5", 1.5), n("C5", 0.5), n("B4", 1), n("A4", 1),
  n("G4", 1), n("E4", 1), n("E4", 2),
  n("D5", 1.5), n("C5", 0.5), n("B4", 1), n("A4", 0.5), n("G4", 0.5),
  n("C5", 1), n("A4", 1), n("A4", 2),
  n("D5", 1.5), n("C5", 0.5), n("B4", 1), n("A4", 1),
  n("G4", 1), n("E4", 1), n("C5", 1), n("E4", 1),
  n("E4", 1), n("D4", 0.5), n("C4", 0.5), n("D4", 1), n("B4", 1),
  n("C5", 1), n("A4", 1), n("A4", 2),
];

export const overTheHillsAndFarAway: Song = {
  id: "over-the-hills",
  title: "Over the Hills and Far Away",
  difficulty: 2,
  description: "Traditional English slow air in A Dorian.",
  playable: true,
  rhythmVerified: true,
  events: [...A, ...A, ...B, ...B],
};
