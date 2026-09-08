import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const twoNoteMarch: Song = {
  id: "level-0-two-note-march",
  title: "Two-Note March",
  difficulty: 0,
  description: "A small original tune with a strong B–A walking pulse.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("B4", 1), n("A4", 1), n("B4", 2),
    n("A4", 1), n("A4", 1), n("B4", 1), n("B4", 1),
    n("A4", 1), n("B4", 1), n("A4", 2),
  ],
};
