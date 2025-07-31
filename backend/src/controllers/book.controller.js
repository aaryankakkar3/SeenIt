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

export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
};
