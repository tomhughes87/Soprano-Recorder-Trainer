import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const odeToJoy: Song = {
  id: "level-1-ode-to-joy",
  title: "Ode to Joy — three-note study",
  difficulty: 1,
  description: "A deliberately reduced B–A–G contour study based on Beethoven's theme.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("B4", 1), n("B4", 1), n("B4", 1),
    n("B4", 1), n("B4", 1), n("A4", 1), n("A4", 1),
    n("G4", 1), n("G4", 1), n("A4", 1), n("B4", 1),
    n("B4", 1.5), n("A4", 0.5), n("A4", 2),
    n("A4", 1), n("A4", 1), n("B4", 1), n("G4", 1),
    n("A4", 1), n("B4", 1), n("B4", 1), n("G4", 1),
    n("A4", 1), n("B4", 1), n("A4", 1), n("G4", 1),
    n("A4", 2), n("G4", 2),
  ],
};
