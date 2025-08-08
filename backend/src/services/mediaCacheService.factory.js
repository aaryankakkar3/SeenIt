// Generic cache service factory
export const createCacheService = (CacheModel, mediaConfig) => {
  // Check if cache is fresh (less than 24 hours old)
  const isCacheFresh = (lastUpdated) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(lastUpdated) > twentyFourHoursAgo;
  };

  // Fetch data from appropriate API based on media type
  const fetchFromAPI = async (jikanId) => {
    try {
      let response, data, transformedData;

      if (mediaConfig.name === "Anime" || mediaConfig.name === "Manga") {
        // Use Jikan API for anime and manga
        const apiType = mediaConfig.name === "Anime" ? "anime" : "manga";
        response = await fetch(
          `https://api.jikan.moe/v4/${apiType}/${jikanId}`
        );

        if (!response.ok) {
          throw new Error(`Jikan API returned ${response.status}`);
        }

        data = await response.json();
        const item = data.data;

        transformedData = {
          jikanId: item.mal_id,
          title: item.title,
          year:
            mediaConfig.name === "Anime"
              ? item.year || item.aired?.prop?.from?.year || 0
              : item.published?.prop?.from?.year || 0,
          imageUrl:
            item.images?.jpg?.image_url || "https://placehold.co/90x129",
          lastUpdated: new Date(),
          released:
            mediaConfig.name === "Anime"
              ? item.episodes || 0
              : item.chapters || 0,
          status: item.status || "Unknown",
        };
      } else if (mediaConfig.name === "TV Shows") {
        // Use TMDB API for TV shows
        response = await fetch(
          `https://api.themoviedb.org/3/tv/${jikanId}?api_key=${process.env.TMDB_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`TMDB API returned ${response.status}`);
        }

        data = await response.json();

        transformedData = {
          jikanId: data.id,
          title: data.name,
          year: data.first_air_date
            ? new Date(data.first_air_date).getFullYear()
            : 0,
          imageUrl: data.poster_path
            ? `https://image.tmdb.org/t/p/w300${data.poster_path}`
            : "https://placehold.co/90x129",
          lastUpdated: new Date(),
          released: data.number_of_episodes || 0,
          status: data.status || "Unknown",
        };
      } else if (mediaConfig.name === "Comics") {
        // Use ComicVine API for comics
        const comicUrl = `https://comicvine.gamespot.com/api/volume/4050-${jikanId}/?api_key=${process.env.COMICVINE_API_KEY}&format=json`;

        response = await fetch(comicUrl);

        if (!response.ok) {
          throw new Error(`ComicVine API returned ${response.status}`);
        }

        data = await response.json();

        if (data.error !== "OK" || !data.results) {
          throw new Error(`ComicVine API error: ${data.error || "No results"}`);
        }

        const comic = data.results;

        // Determine status based on last updated date
        let comicStatus = "Unknown";
        if (comic.date_last_updated) {
          const lastUpdatedDate = new Date(comic.date_last_updated);
          const oneYearAgo = new Date();
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

          if (lastUpdatedDate > oneYearAgo) {
            comicStatus = "Publishing";
          } else {
            comicStatus = "Finished";
          }
        }

        transformedData = {
          jikanId: comic.id,
          title: comic.name,
          year: comic.start_year || 0,
          imageUrl: comic.image?.medium_url || "https://placehold.co/90x129",
          lastUpdated: new Date(),
          released: comic.count_of_issues || 0,
          status: comicStatus,
        };
      } else if (
        mediaConfig.name === "Movie" ||
        mediaConfig.name === "Game" ||
        mediaConfig.name === "Book"
      ) {
        // For Movies, Games, and Books, we don't fetch additional data from APIs
        // Instead, we create cache entries from the search results data
        // This should not be called - cache should be created when entries are made
        return {
          jikanId: jikanId,
          title: "Unknown Title",
          year: 0,
          imageUrl: "https://placehold.co/90x129",
          lastUpdated: new Date(),
          released: 0,
          status: "Unknown",
        };
      } else {
        throw new Error(`Unsupported media type: ${mediaConfig.name}`);
      }

      return transformedData;
    } catch (error) {
      console.error(
        `Error fetching ${mediaConfig.name.toLowerCase()} ${jikanId} from API:`,
        error
      );
      throw error;
    }
  };

  // Get cached data, refresh if stale
  const getCachedMedia = async (jikanId) => {
    try {
      // First, try to get from cache
      let cachedData = await CacheModel.findOne({ jikanId });

      // Check if this is a static media type that never needs updates
      const isStaticMediaType = ["Movie", "Game", "Book"].includes(
        mediaConfig.name
      );

      // If not cached, cache is stale, or status is Unknown for comics, fetch from API
      // BUT: Never refresh static media types once they're cached
      const shouldRefresh =
        !cachedData ||
        (!isStaticMediaType &&
          (!isCacheFresh(cachedData.lastUpdated) ||
            (mediaConfig.name === "Comics" &&
              cachedData.status === "Unknown")));

      if (shouldRefresh) {
        try {
          const freshData = await fetchFromAPI(jikanId);

          if (cachedData) {
            // Update existing cache
            cachedData = await CacheModel.findOneAndUpdate(
              { jikanId },
              { ...freshData, lastUpdated: new Date() },
              { new: true }
            );
          } else {
            // Create new cache entry
            cachedData = new CacheModel(freshData);
            await cachedData.save();
          }
        } catch (apiError) {
          // If API fails and we have cached data, use it
          if (cachedData) {
            return cachedData;
          }
          throw apiError;
        }
      }

      return cachedData;
    } catch (error) {
      console.error(
        `Error getting cached ${mediaConfig.name.toLowerCase()} ${jikanId}:`,
        error
      );
      throw error;
    }
  };

  // Cache data from search results
  const cacheMediaFromSearch = async (searchResult) => {
    try {
      const jikanId = searchResult.jikanId || searchResult.mal_id;

      if (!jikanId) {
        throw new Error("No jikanId found in search result");
      }

      // Check if already cached and fresh
      const existingCache = await CacheModel.findOne({ jikanId });

      if (existingCache) {
        const isFresh = isCacheFresh(existingCache.lastUpdated);
        if (isFresh) {
          return existingCache;
        }
      }

      // Transform search result data to match the cache schema
      const cacheData = {
        jikanId,
        title: searchResult.title,
        year: searchResult.year || 0,
        imageUrl:
          searchResult.imageUrl ||
          searchResult.images?.jpg?.image_url ||
          "https://placehold.co/90x129",
        lastUpdated: new Date(),
      };

      // Add media-specific fields using standardized names
      cacheData.released =
        searchResult.released ||
        searchResult.episodesTotal ||
        searchResult.chaptersTotal ||
        searchResult.issuesTotal ||
        searchResult.episodes ||
        0;
      cacheData.status =
        searchResult.status ||
        searchResult.animeStatus ||
        searchResult.mangaStatus ||
        searchResult.showStatus ||
        searchResult.comicStatus ||
        "Unknown";

      if (existingCache) {
        // Update existing
        const updatedCache = await CacheModel.findOneAndUpdate(
          { jikanId },
          cacheData,
          {
            new: true,
          }
        );
        return updatedCache;
      } else {
        // Create new
        const newCache = new CacheModel(cacheData);
        const savedCache = await newCache.save();
        return savedCache;
      }
    } catch (error) {
      console.error(
        `Error caching ${mediaConfig.name.toLowerCase()} from search:`,
        error
      );
      throw error;
    }
  };

  return {
    getCachedMedia,
    cacheMediaFromSearch,
    isCacheFresh,
    fetchFromAPI,
  };
};
