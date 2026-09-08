import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const earlyOneMorning: Song = {
  id: "early-one-morning",
  title: "Early One Morning",
  difficulty: 2,
  description: "Traditional English air in 2/4.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("D4", 1), n("D4", 0.5), n("D4", 0.5),
    n("D4", 0.5, { articulation: "slur" }), n("Fs4", 0.5), n("A4", 0.5), n("A4", 0.5),
    n("B4", 0.5), n("G4", 0.5), n("E4", 0.5), n("D4", 0.5),
    n("Cs4", 0.5, { articulation: "slur" }), n("E4", 0.5), n("A4", 0.5), n("A4", 0.5),
    n("D4", 0.75), n("D4", 0.25), n("D4", 1),
    n("D4", 0.5, { articulation: "slur" }), n("Fs4", 0.5), n("A4", 0.5), n("A4", 0.5),
    n("B4", 0.5), n("G4", 0.5), n("E4", 0.5), n("Cs4", 0.5), n("D4", 2),
    n("E4", 1), n("Fs4", 0.5), n("G4", 0.5),
    n("A4", 0.5, { articulation: "slur" }), n("Fs4", 0.5), n("D4", 1),
    n("E4", 1), n("Fs4", 0.5), n("G4", 0.5),
    n("A4", 0.5, { articulation: "slur" }), n("Fs4", 0.5), n("D4", 1),
    n("D4", 0.5, { articulation: "slur" }), n("Fs4", 0.5), n("A4", 0.5), n("D5", 0.5),
    n("Cs5", 0.5, { articulation: "slur" }), n("B4", 0.5, { articulation: "slur" }), n("A4", 0.5), n("G4", 0.5),
    n("Fs4", 0.5, { articulation: "slur" }), n("E4", 0.5), n("D4", 0.5), n("Cs4", 0.5), n("D4", 2),
  ],
};
