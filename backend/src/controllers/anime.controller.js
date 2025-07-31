import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import AnimeEntry from "../models/anime.model.js";
import AnimeCache from "../models/animeCache.model.js";

const mediaConfig = {
  name: "Anime",
  statusField: "status",
  releasedField: "released",
  watchedField: "consumed",
  releasedLabel: "Episodes",
  watchedLabel: "Episodes Watched",
};

const { getCachedMedia, cacheMediaFromSearch } = createCacheService(
  AnimeCache,
  mediaConfig
);

const {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} = createMediaController(
  AnimeEntry,
  AnimeCache,
  getCachedMedia,
  cacheMediaFromSearch,
  mediaConfig
);

// Export with the old function names for backward compatibility
export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress as incrementWatchedEpisodes,
  decrementProgress as decrementWatchedEpisodes,
};
