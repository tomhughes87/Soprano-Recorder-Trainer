import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const echoB: Song = {
  id: "level-0-echo-b",
  title: "Echo B",
  difficulty: 0,
  description: "Copy a simple long–short pattern without changing fingering.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 2), n("B4", 1), n("B4", 1),
    n("B4", 2), n("B4", 1), n("B4", 1),
    n("B4", 1, { articulation: "staccato" }),
    n("B4", 1, { articulation: "staccato" }),
    n("B4", 2),
    n("B4", 4),
  ],
};
