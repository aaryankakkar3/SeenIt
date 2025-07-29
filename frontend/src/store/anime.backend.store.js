import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useAnimeBackendStore = createMediaStore(MEDIA_TYPES.animes);
