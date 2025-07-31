import { createMediaStore } from "./mediaStore.factory";
import { MEDIA_TYPES } from "../lib/mediaConfig";

export const useMovieStore = createMediaStore(MEDIA_TYPES.movies);
