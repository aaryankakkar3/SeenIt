import { toast } from "react-hot-toast";
import { create } from "zustand";

export const useAnimeExternalStore = create((set) => ({
  queryResults: [],
  isSearching: false,

  getQueryResults: async (query) => {
    if (!query || query.trim() === "") {
      set({ queryResults: [] });
      return;
    }

    set({ isSearching: true });

    try {
      const response = await fetch(
        `https://api.jikan.moe/v4/anime?q=${query}&limit=10`
      );
      const data = await response.json();

      const filteredResults = data.data.map((anime) => ({
        title: anime.title,
        year: anime.year || anime.aired?.prop?.from?.year || "Unknown",
        imageUrl: anime.images?.jpg?.image_url,
        jikanId: anime.mal_id,
        episodesTotal: anime.episodes || 0,
        animeStatus: anime.status || "Unknown",
      }));

      set({ queryResults: filteredResults, isSearching: false });
      console.log("Query results:", filteredResults);
    } catch (error) {
      toast.error("Failed to fetch entries.");
      console.error("Error in fetching from external database.:", error);
      set({ isSearching: false });
    }
  },

  clearQueryResults: () => {
    set({ queryResults: [] });
  },
}));
