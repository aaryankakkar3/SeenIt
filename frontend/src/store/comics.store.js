import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useComicsStore = createMediaStore(MEDIA_TYPES.comics);
