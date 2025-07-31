import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import MovieEntry from "../models/movie.model.js";
import MovieCache from "../models/movieCache.model.js";

const mediaConfig = {
  name: "Movie",
};

const { getCachedMedia } = createCacheService(MovieCache, mediaConfig);

const { getAllEntries, createEntry, updateEntry, deleteEntry } =
  createMediaController(MovieEntry, MovieCache, getCachedMedia, mediaConfig);

export { getAllEntries, createEntry, updateEntry, deleteEntry };
