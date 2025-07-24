import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import ComicEntry from "../models/comic.model.js";
import ComicCache from "../models/comicCache.model.js";

const mediaConfig = {
  name: "Comics",
  statusField: "comicStatus",
  releasedField: "issuesTotal",
  watchedField: "issuesRead",
  releasedLabel: "Issues",
  watchedLabel: "Issues Read",
};

const { getCachedMedia } = createCacheService(ComicCache, mediaConfig);

const {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} = createMediaController(ComicEntry, ComicCache, getCachedMedia, mediaConfig);

export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
};
