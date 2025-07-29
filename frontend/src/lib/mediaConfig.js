// Media type configurations
export const MEDIA_TYPES = {
  animes: {
    name: "Anime",
    displayName: "Anime",
    statusField: "animeStatus",
    releasedField: "episodesTotal",
    watchedField: "episodesWatched",
    releasedLabel: "Ep",
    watchedLabel: "Ep Watched",
    addButtonText: "Add Anime",
    apiEndpoint: "/anime",
  },
  mangas: {
    name: "Manga",
    displayName: "Manga",
    statusField: "mangaStatus",
    releasedField: "chaptersTotal",
    watchedField: "chaptersRead",
    releasedLabel: "Ch",
    watchedLabel: "Ch Read",
    addButtonText: "Add Manga",
    apiEndpoint: "/manga",
  },
  shows: {
    name: "TV Shows",
    displayName: "Shows",
    statusField: "showStatus",
    releasedField: "episodesTotal",
    watchedField: "episodesWatched",
    releasedLabel: "Ep",
    watchedLabel: "Ep Watched",
    addButtonText: "Add Show",
    apiEndpoint: "/shows",
  },
  comics: {
    name: "Comics",
    displayName: "Comics",
    statusField: "comicStatus",
    releasedField: "issuesTotal",
    watchedField: "issuesRead",
    releasedLabel: "Iss",
    watchedLabel: "Iss Read",
    addButtonText: "Add Comic",
    apiEndpoint: "/comics",
  },
};

export const AVAILABLE_SECTIONS = Object.keys(MEDIA_TYPES);
