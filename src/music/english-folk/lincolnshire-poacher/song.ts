import { noteEvent, type Song } from "../../songTypes";

const n = noteEvent;

export const lincolnshirePoacher: Song = {
  id: "lincolnshire-poacher",
  title: "The Lincolnshire Poacher",
  difficulty: 2,
  description: "Traditional English song in 6/8, raised a semitone for recorder range.",
  playable: true,
  rhythmVerified: true,
  events: [
    n("Gs4", 0.5),
    n("Cs4", 1), n("F4", 0.5), n("Gs4", 1), n("Gs4", 0.5),
    n("Bb4", 1), n("Gs4", 0.5), n("F4", 1), n("Cs4", 0.5),
    n("F4", 1), n("Ds4", 0.5), n("Cs4", 1), n("C4", 0.5),
    n("Cs4", 2.5), n("F4", 0.5),
    n("Gs4", 1), n("Gs4", 0.5), n("Bb4", 1), n("C5", 0.5),
    n("Cs5", 1.5), n("C5", 0.5), n("Bb4", 0.5), n("Gs4", 0.5),
    n("Bb4", 1), n("Bb4", 0.5), n("Bb4", 1), n("F4", 0.5),
    n("Gs4", 2.5), n("F4", 0.5),
    n("Gs4", 1), n("Gs4", 0.5), n("Bb4", 1), n("C5", 0.5),
    n("Cs5", 1.5), n("C5", 0.5), n("Bb4", 0.5), n("Gs4", 0.5),
    n("Bb4", 1), n("Bb4", 0.5), n("Bb4", 0.5), n("Gs4", 0.5), n("F4", 0.5),
    n("Gs4", 1.5), n("Gs4", 1), n("F4", 0.5),
    n("Cs4", 1), n("F4", 0.5), n("Gs4", 0.5), n("Gs4", 0.5), n("Gs4", 0.5),
    n("Bb4", 1), n("Bb4", 0.5), n("Bb4", 0.5), n("Gs4", 0.5), n("Cs4", 0.5),
    n("Ds4", 1), n("F4", 0.5), n("Cs4", 1), n("Cs4", 0.5),
    n("Cs4", 3),
  ],
};
