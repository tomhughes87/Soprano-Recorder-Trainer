import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const verse = [
  n("E4", 1),
  n("G4", 2), n("A4", 1),
  n("B4", 1.5), n("C5", 0.5), n("B4", 1),
  n("A4", 2), n("Fs4", 1),
  n("D4", 1.5), n("E4", 0.5), n("Fs4", 1),
  n("G4", 2), n("E4", 1),
  n("E4", 1.5), n("Ds4", 0.5), n("E4", 1),
  n("Fs4", 2), n("Ds4", 1),
  n("B4", 2), n("E4", 1),
  n("G4", 2), n("A4", 1),
  n("B4", 1.5), n("C5", 0.5), n("B4", 1),
  n("A4", 2), n("Fs4", 1),
  n("D4", 1.5), n("E4", 0.5), n("Fs4", 1),
  n("G4", 1.5), n("Fs4", 0.5), n("E4", 1),
  n("Ds4", 1.5), n("Cs4", 0.5), n("Ds4", 1),
  n("E4", 5),
];

export const greensleeves: Song = {
  id: "greensleeves",
  title: "Greensleeves",
  difficulty: 4,
  description: "Historic English melody; first verse arranged for the available range.",
  playable: true,
  rhythmVerified: true,
  events: verse,
};
