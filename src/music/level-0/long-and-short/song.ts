import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const longAndShort: Song = {
  id: "level-0-long-and-short",
  title: "Long and Short",
  difficulty: 0,
  description: "Read half-, one- and two-beat cards using only B and A.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 2), n("A4", 2),
    n("B4", 1), n("A4", 1), n("B4", 2),
    n("A4", 0.5), n("A4", 0.5), n("B4", 1), n("A4", 2),
    n("B4", 0.5), n("B4", 0.5), n("A4", 1), n("B4", 2),
  ],
};
