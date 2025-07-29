import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useAnimeStore = createMediaStore(MEDIA_TYPES.animes);
