import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import BookEntry from "../models/book.model.js";
import BookCache from "../models/bookCache.model.js";

const mediaConfig = {
  name: "Book",
  releasedField: "released",
  watchedField: "consumed",
  releasedLabel: "Pages",
  watchedLabel: "Pages Read",
};

const { getCachedMedia, cacheMediaFromSearch } = createCacheService(
  BookCache,
  mediaConfig
);

console.log(
  `[BookController] Cache service initialized for ${mediaConfig.name}`
);

const {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} = createMediaController(
  BookEntry,
  BookCache,
  getCachedMedia,
  cacheMediaFromSearch,
  mediaConfig
);

console.log(
  `[BookController] Media controller initialized for ${mediaConfig.name}`
);

export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
};
