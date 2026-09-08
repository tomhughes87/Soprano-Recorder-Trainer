import type { Song } from "../songTypes";
import { concerningHobbits } from "./concerning-hobbits/song";
import { inDreams } from "./in-dreams/song";
import { rohan } from "./rohan/song";
import { evenstar } from "./evenstar/song";
import { gollumsSong } from "./gollums-song/song";
import { intoTheWest } from "./into-the-west/song";
import { theGreyHavens } from "./the-grey-havens/song";

export const LOTR_SONGS: Song[] = [
  concerningHobbits,
  inDreams,
  rohan,
  evenstar,
  gollumsSong,
  intoTheWest,
  theGreyHavens,
];
