import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import MovieEntry from "../models/movie.model.js";
import MovieCache from "../models/movieCache.model.js";

const mediaConfig = {
  name: "Movie",
};

const { getCachedMedia, cacheMediaFromSearch } = createCacheService(
  MovieCache,
  mediaConfig
);

console.log(
  `[MovieController] Cache service initialized for ${mediaConfig.name}`
);

const { getAllEntries, createEntry, updateEntry, deleteEntry } =
  createMediaController(
    MovieEntry,
    MovieCache,
    getCachedMedia,
    cacheMediaFromSearch,
    mediaConfig
  );

console.log(
  `[MovieController] Media controller initialized for ${mediaConfig.name}`
);

export { getAllEntries, createEntry, updateEntry, deleteEntry };
