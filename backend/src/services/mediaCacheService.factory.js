// Generic cache service factory
export const createCacheService = (CacheModel, mediaConfig) => {
  // Check if cache is fresh (less than 24 hours old)
  const isCacheFresh = (lastUpdated) => {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return new Date(lastUpdated) > twentyFourHoursAgo;
  };

  // Fetch data from Jikan API (using anime API for all media types as requested)
  const fetchFromJikanAPI = async (jikanId) => {
    try {
      console.log(
        `[${mediaConfig.name}CacheService] Fetching from Jikan API for jikanId:`,
        jikanId
      );
      const response = await fetch(`https://api.jikan.moe/v4/anime/${jikanId}`);

      if (!response.ok) {
        throw new Error(`Jikan API returned ${response.status}`);
      }

      const data = await response.json();
      const anime = data.data;

      // Transform the anime data to match the media type
      const transformedData = {
        jikanId: anime.mal_id,
        title: anime.title,
        year: anime.year || anime.aired?.prop?.from?.year || 0,
        imageUrl: anime.images?.jpg?.image_url || "https://placehold.co/90x129",
        lastUpdated: new Date(),
      };

      // Add media-specific fields based on the media config
      if (mediaConfig.name === "Anime") {
        transformedData.episodesTotal = anime.episodes || 0;
        transformedData.animeStatus = anime.status || "Unknown";
      } else if (mediaConfig.name === "Manga") {
        transformedData.chaptersTotal = anime.episodes || 0; // Using episodes as chapters for now
        transformedData.mangaStatus = anime.status || "Unknown";
      } else if (mediaConfig.name === "TV Shows") {
        transformedData.episodesTotal = anime.episodes || 0;
        transformedData.showStatus = anime.status || "Unknown";
      } else if (mediaConfig.name === "Comics") {
        transformedData.issuesTotal = anime.episodes || 0; // Using episodes as issues for now
        transformedData.comicStatus = anime.status || "Unknown";
      }

      return transformedData;
    } catch (error) {
      console.error(
        `Error fetching ${mediaConfig.name.toLowerCase()} ${jikanId} from Jikan API:`,
        error
      );
      throw error;
    }
  };

  // Get cached data, refresh if stale
  const getCachedMedia = async (jikanId) => {
    try {
      console.log(
        `[${mediaConfig.name}CacheService] Getting cached data for jikanId:`,
        jikanId,
        typeof jikanId
      );

      // First, try to get from cache
      let cachedData = await CacheModel.findOne({ jikanId });

      // If not cached or cache is stale, fetch from API
      if (!cachedData || !isCacheFresh(cachedData.lastUpdated)) {
        try {
          const freshData = await fetchFromJikanAPI(jikanId);

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
            console.warn(
              `API failed for ${mediaConfig.name.toLowerCase()} ${jikanId}, using stale cache:`,
              apiError.message
            );
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
      if (existingCache && isCacheFresh(existingCache.lastUpdated)) {
        return existingCache;
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

      // Add media-specific fields
      if (mediaConfig.name === "Anime") {
        cacheData.episodesTotal =
          searchResult.episodesTotal || searchResult.episodes || 0;
        cacheData.animeStatus =
          searchResult.animeStatus || searchResult.status || "Unknown";
      } else if (mediaConfig.name === "Manga") {
        cacheData.chaptersTotal =
          searchResult.chaptersTotal || searchResult.episodes || 0;
        cacheData.mangaStatus =
          searchResult.mangaStatus || searchResult.status || "Unknown";
      } else if (mediaConfig.name === "TV Shows") {
        cacheData.episodesTotal =
          searchResult.episodesTotal || searchResult.episodes || 0;
        cacheData.showStatus =
          searchResult.showStatus || searchResult.status || "Unknown";
      } else if (mediaConfig.name === "Comics") {
        cacheData.issuesTotal =
          searchResult.issuesTotal || searchResult.episodes || 0;
        cacheData.comicStatus =
          searchResult.comicStatus || searchResult.status || "Unknown";
      }

      if (existingCache) {
        // Update existing
        return await CacheModel.findOneAndUpdate({ jikanId }, cacheData, {
          new: true,
        });
      } else {
        // Create new
        const newCache = new CacheModel(cacheData);
        return await newCache.save();
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
    fetchFromJikanAPI,
  };
};
