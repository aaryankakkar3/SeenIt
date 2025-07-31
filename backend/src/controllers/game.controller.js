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

console.log(
  `[GameController] Cache service initialized for ${mediaConfig.name}`
);

const { getAllEntries, createEntry, updateEntry, deleteEntry } =
  createMediaController(
    GameEntry,
    GameCache,
    getCachedMedia,
    cacheMediaFromSearch,
    mediaConfig
  );

console.log(
  `[GameController] Media controller initialized for ${mediaConfig.name}`
);

export { getAllEntries, createEntry, updateEntry, deleteEntry };
