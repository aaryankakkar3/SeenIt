import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import ShowEntry from "../models/show.model.js";
import ShowCache from "../models/showCache.model.js";

const mediaConfig = {
  name: "TV Shows",
  statusField: "status",
  releasedField: "released",
  watchedField: "consumed",
  releasedLabel: "Episodes",
  watchedLabel: "Episodes Watched",
};

const { getCachedMedia, cacheMediaFromSearch } = createCacheService(
  ShowCache,
  mediaConfig
);

const {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
  preFetchCache,
} = createMediaController(
  ShowEntry,
  ShowCache,
  getCachedMedia,
  cacheMediaFromSearch,
  mediaConfig
);

export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
  preFetchCache,
};
