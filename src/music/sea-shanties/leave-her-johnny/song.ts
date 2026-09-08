import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const leaveHerJohnny: Song = {
  id: "leave-her-johnny",
  title: "Leave Her, Johnny",
  difficulty: 3,
  description: "Traditional homeward-bound shanty, transposed for recorder.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("C4", 0.5), n("D4", 0.5),
    n("E4", 1), n("E4", 1), n("E4", 0.5), n("D4", 0.5), n("C4", 0.5), n("D4", 0.5),
    n("E4", 1), n("E4", 0.5), n("D4", 0.5), n("C4", 2),
    n("D4", 1), n("D4", 1), n("D4", 1.5), n("C4", 0.5),
    n("E4", 1), n("G4", 2), n("G4", 1),
    n("A4", 1), n("A4", 1), n("G4", 1), n("G4", 0.5), n("F4", 0.5),
    n("E4", 1), n("E4", 0.5), n("D4", 0.5), n("C4", 1), n("G4", 0.5), n("F4", 0.5),
    n("E4", 1.5), n("E4", 0.5), n("E4", 1.5), n("D4", 0.5),
    n("D4", 1), n("C4", 2),
  ],
};
