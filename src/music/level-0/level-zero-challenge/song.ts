import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const levelZeroChallenge: Song = {
  id: "level-0-challenge",
  title: "Level 0 Challenge",
  difficulty: 0,
  description: "Put B, A, repeated notes and changing lengths together.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("A4", 1), n("B4", 2),
    n("B4", 0.5), n("B4", 0.5), n("A4", 1), n("A4", 2),
    n("A4", 1), n("B4", 1), n("A4", 1), n("B4", 1),
    n("B4", 1, { articulation: "staccato" }),
    n("A4", 1, { articulation: "staccato" }),
    n("B4", 2),
  ],
};
