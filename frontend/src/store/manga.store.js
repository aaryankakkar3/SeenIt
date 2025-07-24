import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useMangaStore = createMediaStore(MEDIA_TYPES.mangas);
