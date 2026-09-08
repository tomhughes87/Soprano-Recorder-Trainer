import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const firstBreath: Song = {
  id: "level-0-first-breath",
  title: "First Breath",
  difficulty: 0,
  description: "Your first note: four calm, two-beat B notes.",
  playable: true,
  rhythmVerified: true,
  events: [n("B4", 2), n("B4", 2), n("B4", 2), n("B4", 2)],
};
