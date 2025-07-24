import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { create } from "zustand";

export const useSectionsStore = create((set) => ({
  sections: [],
  isLoading: false,

  // Get all sections for a user
  getSections: async () => {
    try {
      set({ isLoading: true });
      const response = await axiosInstance.get("/sections");
      set({ sections: response.data.sections });
      console.log("Sections fetched:", response.data.sections);
    } catch (error) {
      toast.error("Failed to fetch sections");
      console.error("Error fetching sections:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Add a new section
  addSection: async (section) => {
    try {
      const response = await axiosInstance.post(`/sections/${section}`);
      set((state) => ({
        sections: response.data.sections,
      }));
      toast.success("Section added successfully");
      console.log("Section added:", section);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to add section");
      console.error("Error adding section:", error);
    }
  },

  // Delete a section
  deleteSection: async (section) => {
    try {
      const response = await axiosInstance.delete(`/sections/${section}`);
      set((state) => ({
        sections: response.data.sections,
      }));
      toast.success("Section deleted successfully");
      console.log("Section deleted:", section);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete section");
      console.error("Error deleting section:", error);
    }
  },
}));
