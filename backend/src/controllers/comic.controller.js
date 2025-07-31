import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import ComicEntry from "../models/comic.model.js";
import ComicCache from "../models/comicCache.model.js";

const mediaConfig = {
  name: "Comics",
  statusField: "status",
  releasedField: "released",
  watchedField: "consumed",
  releasedLabel: "Issues",
  watchedLabel: "Issues Read",
};

const { getCachedMedia, cacheMediaFromSearch } = createCacheService(
  ComicCache,
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
  ComicEntry,
  ComicCache,
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
