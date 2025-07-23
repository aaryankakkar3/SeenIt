import AnimeCache from "../models/animeCache.model.js";

// Check if cache is fresh (less than 24 hours old)
export const isCacheFresh = (lastUpdated) => {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return new Date(lastUpdated) > twentyFourHoursAgo;
};

// Fetch anime data from Jikan API
export const fetchFromJikanAPI = async (jikanId) => {
  try {
    const response = await fetch(`https://api.jikan.moe/v4/anime/${jikanId}`);
    
    if (!response.ok) {
      throw new Error(`Jikan API returned ${response.status}`);
    }
    
    const data = await response.json();
    const anime = data.data;
    
    return {
      jikanId: anime.mal_id,
      title: anime.title,
      year: anime.year || anime.aired?.prop?.from?.year || 0,
      imageUrl: anime.images?.jpg?.image_url || "https://placehold.co/90x129",
      episodesTotal: anime.episodes || 0,
      animeStatus: anime.status || "Unknown",
    };
  } catch (error) {
    console.error(`Error fetching anime ${jikanId} from Jikan API:`, error);
    throw error;
  }
};

// Get cached anime data, refresh if stale
export const getCachedAnime = async (jikanId) => {
  try {
    // First, try to get from cache
    let cachedAnime = await AnimeCache.findOne({ jikanId });
    
    // If not cached or cache is stale, fetch from API
    if (!cachedAnime || !isCacheFresh(cachedAnime.lastUpdated)) {
      try {
        const freshData = await fetchFromJikanAPI(jikanId);
        
        if (cachedAnime) {
          // Update existing cache
          cachedAnime = await AnimeCache.findOneAndUpdate(
            { jikanId },
            { ...freshData, lastUpdated: new Date() },
            { new: true }
          );
        } else {
          // Create new cache entry
          cachedAnime = await AnimeCache.create({
            ...freshData,
            lastUpdated: new Date(),
          });
        }
      } catch (apiError) {
        // If API fails and we have stale cache, return stale data
        if (cachedAnime) {
          console.warn(`Jikan API failed for anime ${jikanId}, using stale cache`);
          return cachedAnime;
        }
        // If no cache and API fails, throw error
        throw apiError;
      }
    }
    
    return cachedAnime;
  } catch (error) {
    console.error(`Error getting cached anime ${jikanId}:`, error);
    throw error;
  }
};

// Cache anime data from search results (when adding anime)
export const cacheAnimeFromSearch = async (animeData) => {
  try {
    const { jikanId, title, year, imageUrl, episodesTotal, animeStatus } = animeData;
    
    // Check if already cached and fresh
    const existing = await AnimeCache.findOne({ jikanId });
    if (existing && isCacheFresh(existing.lastUpdated)) {
      return existing;
    }
    
    // Update or create cache entry
    const cachedAnime = await AnimeCache.findOneAndUpdate(
      { jikanId },
      {
        jikanId,
        title,
        year: year === "Unknown" ? 0 : year,
        imageUrl: imageUrl || "https://placehold.co/90x129",
        episodesTotal: episodesTotal || 0,
        animeStatus: animeStatus || "Unknown",
        lastUpdated: new Date(),
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );
    
    return cachedAnime;
  } catch (error) {
    console.error("Error caching anime data:", error);
    throw error;
  }
};
