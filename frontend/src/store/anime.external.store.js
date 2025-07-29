import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAnimeExternalStore = create((set) => ({
  queryResults: [],
  isSearching: false,

  getQueryResults: async (query, type = "anime") => {
    if (!query || query.trim() === "") {
      set({ queryResults: [] });
      return;
    }

    set({ isSearching: true });

    try {
      const response = await axiosInstance.get(
        `/external/${type}/${encodeURIComponent(query)}`
      );
      const data = response.data;

      // The external API already returns transformed data, so we can use it directly
      const filteredResults = data.data || [];

      set({ queryResults: filteredResults, isSearching: false });
      console.log("Query results:", filteredResults);
    } catch (error) {
      toast.error("Failed to fetch entries.");
      console.error("Error in fetching from backend.:", error);
      set({ isSearching: false });
    }
  },

  clearQueryResults: () => {
    set({ queryResults: [] });
  },
}));
