import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const stepDownStepUp: Song = {
  id: "level-0-step-down-step-up",
  title: "Step Down, Step Up",
  difficulty: 0,
  description: "Practise clean changes in both directions between B and A.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("A4", 1), n("B4", 1), n("A4", 1),
    n("B4", 1), n("A4", 1), n("B4", 2),
    n("A4", 1), n("B4", 1), n("A4", 1), n("B4", 1),
    n("A4", 1), n("B4", 1), n("A4", 2),
  ],
};
