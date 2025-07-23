import axios from "axios";
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isGoogleLoading: false,

  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({
        authUser: res.data,
      });
    } catch (error) {
      console.log("Error checking auth:", error);
      set({
        authUser: null,
      });
    } finally {
      set({
        isCheckingAuth: false,
      });
    }
  },

  signup: async (data) => {
    try {
      set({ isSigningUp: true });
      const res = await axiosInstance.post("/auth/signup", data);
      set({
        authUser: res.data,
      });
      toast.success("Account created successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    try {
      console.log("useAuthStore reached with data :");
      set({ isLoggingIn: true });
      const res = await axiosInstance.post("/auth/login", data);
      set({
        authUser: res.data,
      });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async (data) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

  googleAuth: async (credential, isSignUp = false) => {
    try {
      set({ isGoogleLoading: true });
      const endpoint = isSignUp ? "/auth/google-signup" : "/auth/google-signin";
      const res = await axiosInstance.post(endpoint, { credential });
      set({
        authUser: res.data.user,
      });
      toast.success(
        isSignUp ? "Account created successfully" : "Logged in successfully"
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Google authentication failed"
      );
    } finally {
      set({ isGoogleLoading: false });
    }
  },
}));
