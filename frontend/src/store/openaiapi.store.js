import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOpenAIStore = create((set) => ({
  suggestions: [],
  isLoading: false,
  error: null,

  getAISuggestions: async (data) => {
    try {
      set({ isLoading: true, error: null });

      const res = await axiosInstance.post("/openai/ai-suggestions", data);

      set({
        suggestions: res.data.suggestions || [],
        isLoading: false,
      });

      toast.success("AI suggestions generated successfully!");
      return { success: true, suggestions: res.data.suggestions };
    } catch (error) {
      console.error("OpenAI API Error:", error);

      const errorMessage =
        error.response?.data?.message || "Failed to get AI suggestions";

      set({
        error: errorMessage,
        isLoading: false,
        suggestions: [],
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  clearSuggestions: () => {
    set({ suggestions: [], error: null });
  },

  clearError: () => {
    set({ error: null });
  },
}));
