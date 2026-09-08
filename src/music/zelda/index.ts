import type { Song } from "../songTypes";
import { zeldasLullaby } from "./zeldas-lullaby/song";
import { eponasSong } from "./eponas-song/song";
import { sariasSong } from "./sarias-song/song";
import { sunsSong } from "./suns-song/song";
import { songOfTime } from "./song-of-time/song";
import { songOfStorms } from "./song-of-storms/song";
import { minuetOfForest } from "./minuet-of-forest/song";
import { boleroOfFire } from "./bolero-of-fire/song";
import { serenadeOfWater } from "./serenade-of-water/song";
import { requiemOfSpirit } from "./requiem-of-spirit/song";
import { nocturneOfShadow } from "./nocturne-of-shadow/song";
import { preludeOfLight } from "./prelude-of-light/song";

export const ZELDA_SONGS: Song[] = [
  zeldasLullaby,
  eponasSong,
  sariasSong,
  sunsSong,
  songOfTime,
  songOfStorms,
  minuetOfForest,
  boleroOfFire,
  serenadeOfWater,
  requiemOfSpirit,
  nocturneOfShadow,
  preludeOfLight,
];
