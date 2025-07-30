import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import MangaEntry from "../models/manga.model.js";
import MangaCache from "../models/mangaCache.model.js";

const mediaConfig = {
  name: "Manga",
  statusField: "status",
  releasedField: "released",
  watchedField: "consumed",
  releasedLabel: "Chapters",
  watchedLabel: "Chapters Read",
};

const { getCachedMedia } = createCacheService(MangaCache, mediaConfig);

const {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} = createMediaController(MangaEntry, MangaCache, getCachedMedia, mediaConfig);

export {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
};
