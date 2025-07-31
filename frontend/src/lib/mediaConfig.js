// Media type configurations
export const MEDIA_TYPES = {
  animes: {
    name: "Anime",
    displayName: "Anime",
    // Internal field names (standardized)
    statusField: "status",
    releasedField: "released",
    consumedField: "consumed",
    // Display labels (what users see)
    releasedLabel: "Ep",
    consumedLabel: "Ep Watched",
    addButtonText: "Add Anime",
    apiEndpoint: "/anime",
  },
  mangas: {
    name: "Manga",
    displayName: "Manga",
    // Internal field names (standardized)
    statusField: "status",
    releasedField: "released",
    consumedField: "consumed",
    // Display labels (what users see)
    releasedLabel: "Ch",
    consumedLabel: "Ch Read",
    addButtonText: "Add Manga",
    apiEndpoint: "/manga",
  },
  shows: {
    name: "TV Shows",
    displayName: "Shows",
    // Internal field names (standardized)
    statusField: "status",
    releasedField: "released",
    consumedField: "consumed",
    // Display labels (what users see)
    releasedLabel: "Ep",
    consumedLabel: "Ep Watched",
    addButtonText: "Add Show",
    apiEndpoint: "/shows",
  },
  comics: {
    name: "Comics",
    displayName: "Comics",
    // Internal field names (standardized)
    statusField: "status",
    releasedField: "released",
    consumedField: "consumed",
    // Display labels (what users see)
    releasedLabel: "Iss",
    consumedLabel: "Iss Read",
    addButtonText: "Add Comic",
    apiEndpoint: "/comics",
  },

  books: {
    name: "Books",
    displayName: "Books",
    // Internal field names (standardized)
    releasedField: "released", // total pages from backend
    consumedField: "consumed", // pages read from backend
    // Display labels (what users see)
    releasedLabel: "Pages",
    consumedLabel: "Pages Read",
    addButtonText: "Add Book",
    apiEndpoint: "/books",
  },
  games: {
    name: "Games",
    displayName: "Games",
    // Internal field names (standardized)
    consumedField: "progress", // progress percentage from backend
    // Display labels (what users see)
    consumedLabel: "Progress",
    addButtonText: "Add Game",
    apiEndpoint: "/games",
  },
  movies: {
    name: "Movies",
    displayName: "Movies",
    // Internal field names (standardized)
    addButtonText: "Add Movie",
    apiEndpoint: "/movies",
  },
};

export const AVAILABLE_SECTIONS = Object.keys(MEDIA_TYPES);
