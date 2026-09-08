import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const steadyB: Song = {
  id: "level-0-steady-b",
  title: "Steady B",
  difficulty: 0,
  description: "Keep one fingering steady while playing an even pulse.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("B4", 1), n("B4", 1), n("B4", 1),
    n("B4", 1), n("B4", 1), n("B4", 1), n("B4", 1),
  ],
};
