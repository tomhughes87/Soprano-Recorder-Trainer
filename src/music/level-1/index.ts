import type { Song } from "../songTypes";
import { auClairDeLaLune } from "./au-clair-de-la-lune/song";
import { hotCrossBuns } from "./hot-cross-buns/song";
import { hotCrossBunsVariations } from "./hot-cross-buns-variations/song";
import { lucyLocket } from "./lucy-locket/song";
import { maryHadALittleLamb } from "./mary-had-a-little-lamb/song";
import { merrilyWeRollAlong } from "./merrily-we-roll-along/song";
import { odeToJoy } from "./ode-to-joy/song";
import { oldMacDonald } from "./old-macdonald/song";
import { peasePorridgeHot } from "./pease-porridge-hot/song";
import { rainRainGoAway } from "./rain-rain-go-away/song";
import { threeBlindMice } from "./three-blind-mice/song";

export const LEVEL_1_SONGS: Song[] = [
  hotCrossBuns,
  maryHadALittleLamb,
  merrilyWeRollAlong,
  auClairDeLaLune,
  rainRainGoAway,
  oldMacDonald,
  odeToJoy,
  threeBlindMice,
  lucyLocket,
  peasePorridgeHot,
  hotCrossBunsVariations,
];
