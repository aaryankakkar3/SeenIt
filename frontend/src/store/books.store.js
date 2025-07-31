import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useBookStore = createMediaStore(MEDIA_TYPES.books);
