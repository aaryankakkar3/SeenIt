import { toast } from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useExternalStore = create((set) => ({
  queryResults: [],
  isSearching: false,

  getQueryResults: async (query, type) => {
    if (!query || query.trim() === "") {
      set({ queryResults: [] });
      return;
    }

    set({ isSearching: true });

    try {
      const request = `/external/${type}/${encodeURIComponent(query)}`;
      const response = await axiosInstance.get(request);
      const data = response.data;

      // The external API already returns transformed data, so we can use it directly
      const filteredResults = data.data || [];

      set({ queryResults: filteredResults, isSearching: false });
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
