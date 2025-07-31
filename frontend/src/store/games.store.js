import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useGameStore = createMediaStore(MEDIA_TYPES.games);
