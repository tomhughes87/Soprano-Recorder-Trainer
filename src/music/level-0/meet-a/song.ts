import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const meetA: Song = {
  id: "level-0-meet-a",
  title: "Meet A",
  difficulty: 0,
  description: "Add one finger to step gently from B down to A.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 2), n("A4", 2),
    n("B4", 2), n("A4", 2),
    n("B4", 1), n("B4", 1), n("A4", 2),
    n("A4", 1), n("A4", 1), n("B4", 2),
  ],
};
