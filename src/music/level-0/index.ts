import type { Song } from "../songTypes";
import { echoB } from "./echo-b/song";
import { firstBreath } from "./first-breath/song";
import { levelZeroChallenge } from "./level-zero-challenge/song";
import { longAndShort } from "./long-and-short/song";
import { meetA } from "./meet-a/song";
import { steadyB } from "./steady-b/song";
import { stepDownStepUp } from "./step-down-step-up/song";
import { twoNoteMarch } from "./two-note-march/song";

export const LEVEL_0_SONGS: Song[] = [
  firstBreath,
  steadyB,
  echoB,
  meetA,
  stepDownStepUp,
  twoNoteMarch,
  longAndShort,
  levelZeroChallenge,
];
