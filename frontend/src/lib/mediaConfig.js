// Media type configurations
export const MEDIA_TYPES = {
  animes: {
    name: "Anime",
    statusField: "animeStatus",
    releasedField: "episodesTotal",
    watchedField: "episodesWatched",
    releasedLabel: "Episodes",
    watchedLabel: "Episodes Watched",
    addButtonText: "Add Anime",
  },
  mangas: {
    name: "Manga",
    statusField: "mangaStatus",
    releasedField: "chaptersTotal",
    watchedField: "chaptersRead",
    releasedLabel: "Chapters",
    watchedLabel: "Chapters Read",
    addButtonText: "Add Manga",
  },
  shows: {
    name: "TV Shows",
    statusField: "showStatus",
    releasedField: "episodesTotal",
    watchedField: "episodesWatched",
    releasedLabel: "Episodes",
    watchedLabel: "Episodes Watched",
    addButtonText: "Add Show",
  },
  comics: {
    name: "Comics",
    statusField: "comicStatus",
    releasedField: "issuesTotal",
    watchedField: "issuesRead",
    releasedLabel: "Issues",
    watchedLabel: "Issues Read",
    addButtonText: "Add Comic",
  },
};

export const AVAILABLE_SECTIONS = Object.keys(MEDIA_TYPES);
