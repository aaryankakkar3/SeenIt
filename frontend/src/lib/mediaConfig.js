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
};

export const AVAILABLE_SECTIONS = Object.keys(MEDIA_TYPES);
