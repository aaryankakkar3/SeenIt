import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";

export const useAnimeBackendStore = create((set) => ({
  entries: [],

  getAnimes: async () => {
    try {
      const response = await axiosInstance.get("/anime");
      set({ entries: response.data.data });
    } catch (error) {
      toast.error("Failed to fetch anime entries");
      console.error("Error fetching anime entries:", error);
    }
  },

  createAnime: async (anime) => {
    try {
      const response = await axiosInstance.post("/anime", anime);
      set((state) => ({
        entries: [...state.entries, response.data.data],
      }));
      toast.success("Entry created successfully");
    } catch (error) {
      toast.error("Failed to create entry");
      console.error("Error creating anime entry:", error);
    }
  },

  editAnime: async (animeId, updatedAnime) => {
    console.log("Editing anime entry:", animeId, updatedAnime);
    try {
      const response = await axiosInstance.put(
        `/anime/${animeId}`,
        updatedAnime
      );
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry._id === animeId ? response.data.data : entry
        ),
      }));
      toast.success("Entry updated successfully");
    } catch (error) {
      toast.error("Failed to update entry");
      console.error("Error updating anime entry:", error);
    }
  },

  incrementEpisodes: async (animeId) => {
    try {
      // Get current entry to check limits
      const currentEntry = useAnimeBackendStore
        .getState()
        .entries.find((entry) => entry._id === animeId);

      if (
        currentEntry &&
        currentEntry.episodesTotal > 0 &&
        currentEntry.episodesWatched >= currentEntry.episodesTotal
      ) {
        return;
      }

      const response = await axiosInstance.patch(`/anime/${animeId}/increment`);
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry._id === animeId ? response.data.data : entry
        ),
      }));
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(
          error.response.data.message || "Cannot increment past total episodes"
        );
      } else {
        toast.error("Failed to increment episodes");
      }
      console.error("Error incrementing episodes:", error);
    }
  },

  decrementEpisodes: async (animeId) => {
    try {
      // Get current entry to check limits
      const currentEntry = useAnimeBackendStore
        .getState()
        .entries.find((entry) => entry._id === animeId);

      if (currentEntry && currentEntry.episodesWatched <= 0) {
        return;
      }

      const response = await axiosInstance.patch(`/anime/${animeId}/decrement`);
      set((state) => ({
        entries: state.entries.map((entry) =>
          entry._id === animeId ? response.data.data : entry
        ),
      }));
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(
          error.response.data.message || "Cannot decrement below 0 episodes"
        );
      } else {
        toast.error("Failed to decrement episodes");
      }
      console.error("Error decrementing episodes:", error);
    }
  },

  deleteAnime: async (animeId) => {
    try {
      await axiosInstance.delete(`/anime/${animeId}`);
      set((state) => ({
        entries: state.entries.filter((entry) => entry._id !== animeId),
      }));
      toast.success("Entry deleted successfully");
    } catch (error) {
      toast.error("Failed to delete entry");
      console.error("Error deleting anime entry:", error);
    }
  },
}));
