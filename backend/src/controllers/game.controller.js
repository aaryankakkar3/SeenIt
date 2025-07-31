import { createMediaController } from "./mediaController.factory.js";
import { createCacheService } from "../services/mediaCacheService.factory.js";
import GameEntry from "../models/game.model.js";
import GameCache from "../models/gameCache.model.js";

const mediaConfig = {
  name: "Game",
  watchedField: "progress",
  watchedLabel: "Progress",
};

const { getCachedMedia, cacheMediaFromSearch } = createCacheService(
  GameCache,
  mediaConfig
);

const { getAllEntries, createEntry, updateEntry, deleteEntry } =
  createMediaController(
    GameEntry,
    GameCache,
    getCachedMedia,
    cacheMediaFromSearch,
    mediaConfig
  );

export { getAllEntries, createEntry, updateEntry, deleteEntry };
