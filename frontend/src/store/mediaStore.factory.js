import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";

export const createMediaStore = (mediaConfig) => {
  return create((set) => ({
    entries: [],

    getEntries: async () => {
      try {
        const response = await axiosInstance.get(mediaConfig.apiEndpoint);
        set({ entries: response.data.data });
      } catch (error) {
        toast.error(
          `Failed to fetch ${mediaConfig.name.toLowerCase()} entries`
        );
        console.error(
          `Error fetching ${mediaConfig.name.toLowerCase()} entries:`,
          error
        );
      }
    },

    createEntry: async (entry) => {
      try {
        const response = await axiosInstance.post(
          mediaConfig.apiEndpoint,
          entry
        );
        set((state) => ({
          entries: [...state.entries, response.data.data],
        }));
        toast.success("Entry created successfully");
      } catch (error) {
        toast.error("Failed to create entry");
        console.error(
          `Error creating ${mediaConfig.name.toLowerCase()} entry:`,
          error
        );
      }
    },

    editEntry: async (entryId, updatedEntry) => {
      console.log(
        `Editing ${mediaConfig.name.toLowerCase()} entry:`,
        entryId,
        updatedEntry
      );
      try {
        const response = await axiosInstance.put(
          `${mediaConfig.apiEndpoint}/${entryId}`,
          updatedEntry
        );
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry._id === entryId ? response.data.data : entry
          ),
        }));
        toast.success("Entry updated successfully");
      } catch (error) {
        toast.error("Failed to update entry");
        console.error(
          `Error updating ${mediaConfig.name.toLowerCase()} entry:`,
          error
        );
      }
    },

    incrementProgress: async (entryId) => {
      try {
        const response = await axiosInstance.put(
          `${mediaConfig.apiEndpoint}/${entryId}/increment`
        );
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry._id === entryId ? response.data.data : entry
          ),
        }));
        toast.success(`${mediaConfig.consumedLabel} incremented`);
      } catch (error) {
        toast.error(
          `Failed to increment ${mediaConfig.consumedLabel.toLowerCase()}`
        );
        console.error(
          `Error incrementing ${mediaConfig.name.toLowerCase()} progress:`,
          error
        );
      }
    },

    decrementProgress: async (entryId) => {
      try {
        const response = await axiosInstance.put(
          `${mediaConfig.apiEndpoint}/${entryId}/decrement`
        );
        set((state) => ({
          entries: state.entries.map((entry) =>
            entry._id === entryId ? response.data.data : entry
          ),
        }));
        toast.success(`${mediaConfig.consumedLabel} decremented`);
      } catch (error) {
        toast.error(
          `Failed to decrement ${mediaConfig.consumedLabel.toLowerCase()}`
        );
        console.error(
          `Error decrementing ${mediaConfig.name.toLowerCase()} progress:`,
          error
        );
      }
    },

    deleteEntry: async (entryId) => {
      try {
        await axiosInstance.delete(`${mediaConfig.apiEndpoint}/${entryId}`);
        set((state) => ({
          entries: state.entries.filter((entry) => entry._id !== entryId),
        }));
        toast.success("Entry deleted successfully");
      } catch (error) {
        toast.error("Failed to delete entry");
        console.error(
          `Error deleting ${mediaConfig.name.toLowerCase()} entry:`,
          error
        );
      }
    },

    preFetchCache: async (externalId) => {
      try {
        console.log(
          `[${mediaConfig.name}Store] Pre-fetching cache for external ID:`,
          externalId
        );
        console.log(
          `[${mediaConfig.name}Store] API endpoint:`,
          `${mediaConfig.apiEndpoint}/cache/${externalId}`
        );
        const response = await axiosInstance.get(
          `${mediaConfig.apiEndpoint}/cache/${externalId}`
        );
        console.log(
          `[${mediaConfig.name}Store] Pre-fetch response:`,
          response.data
        );
        return response.data.data;
      } catch (error) {
        console.error(
          `Error pre-fetching ${mediaConfig.name.toLowerCase()} cache:`,
          error
        );
        console.error(`Error details:`, error.response?.data || error.message);
        // Don't show toast for cache errors as this is a background operation
        return null;
      }
    },
  }));
};
