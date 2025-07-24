import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import ShowEntry from "../models/show.model.js";
import ShowCache from "../models/showCache.model.js";

const mediaConfig = {
  name: "TV Shows",
  statusField: "showStatus",
  releasedField: "episodesTotal",
  watchedField: "episodesWatched",
  releasedLabel: "Episodes",
  watchedLabel: "Episodes Watched",
};

const { getCachedMedia } = createCacheService(ShowCache, mediaConfig);

const {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} = createMediaController(ShowEntry, ShowCache, getCachedMedia, mediaConfig);

export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
};
