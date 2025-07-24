import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useShowsStore = createMediaStore(MEDIA_TYPES.shows);
