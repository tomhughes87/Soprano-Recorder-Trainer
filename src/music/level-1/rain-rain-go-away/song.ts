import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const rainRainGoAway: Song = {
  id: "level-1-rain-rain-go-away",
  title: "Rain, Rain, Go Away",
  difficulty: 1,
  description: "A compact B–A–G beginner adaptation of the nursery rhyme.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("B4", 1), n("B4", 1), n("A4", 1), n("B4", 1),
    n("G4", 2), n("G4", 2),
    n("B4", 1), n("B4", 1), n("A4", 1), n("B4", 1),
    n("G4", 2), n("G4", 2),
    n("G4", 1), n("G4", 1), n("A4", 1), n("A4", 1),
    n("B4", 1), n("A4", 1), n("G4", 2),
    n("A4", 1), n("A4", 1), n("G4", 2),
    n("G4", 4),
  ],
};
