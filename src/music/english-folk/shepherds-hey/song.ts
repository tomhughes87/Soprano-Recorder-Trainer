import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

const A = [
  n("Fs4", 0.75),
  n("G4", 0.25),
  n("A4", 0.75),
  n("Fs4", 0.25),
  n("G4", 1),
  n("G4", 1),
  n("Fs4", 0.75),
  n("G4", 0.25),
  n("A4", 0.75),
  n("Fs4", 0.25),
  n("E4", 1, { tieToNext: true }),
  n("E4", 1),
  n("Fs4", 0.75),
  n("G4", 0.25),
  n("A4", 0.75),
  n("Fs4", 0.25),
  n("G4", 1),
  n("Fs4", 0.75),
  n("G4", 0.25),
  n("A4", 1),
  n("A4", 1),
  n("D4", 2),
];

const B_PICKUP = [n("D4", 0.75), n("E4", 0.25)];

const B = [
  n("Fs4", 1),
  n("D4", 1),
  n("G4", 1, { tieToNext: true }),
  n("G4", 1),
  n("Fs4", 1),
  n("D4", 1),
  n("E4", 1, { tieToNext: true }),
  n("E4", 1),
  n("Fs4", 0.75),
  n("G4", 0.25),
  n("A4", 0.75),
  n("Fs4", 0.25),
  n("G4", 1),
  n("Fs4", 0.75),
  n("G4", 0.25),
  n("A4", 1),
  n("A4", 1),
  n("D4", 2),
];

export const shepherdsHey: Song = {
  id: "shepherds-hey",
  title: "Shepherd's Hey",
  difficulty: 1,
  description:
    "Traditional Morris tune. A good F♯ fingering and rhythm workout.",
  playable: true,
  rhythmVerified: true,
  // The score repeats both strains; the B pickup is played once.
  events: [...A, ...A, ...B_PICKUP, ...B, ...B],
};
