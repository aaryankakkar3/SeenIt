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
  isSendingReset: false,
  isResettingPassword: false,
  isResendingVerification: false,

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

      // Don't set authUser since user needs to verify email first
      toast.success(
        res.data.message ||
          "Account created successfully! Please check your email to verify your account."
      );
      return { success: true, needsVerification: true };
    } catch (error) {
      toast.error(error.response.data.message);
      return { success: false, error: error.response.data.message };
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
      return { success: true, user: res.data };
    } catch (error) {
      toast.error(error.response.data.message);
      throw error; // Re-throw so the component can catch it
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
      const errorData = error.response?.data;

      // Handle email verification requirement for Google sign-in
      if (!isSignUp && errorData?.requiresVerification) {
        toast.error(
          errorData.message ||
            "Please verify your email address before signing in."
        );
      } else {
        toast.error(errorData?.message || "Google authentication failed");
      }
    } finally {
      set({ isGoogleLoading: false });
    }
  },

  verifyEmail: async (token) => {
    try {
      const res = await axiosInstance.get(`/auth/verify-email?token=${token}`);
      // Don't show toast here - let the VerifyEmail component handle UI feedback
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Email verification failed";
      // Don't show toast here - let the VerifyEmail component handle UI feedback
      return { success: false, error: errorMessage };
    }
  },

  resendVerificationEmail: async (email) => {
    try {
      set({ isResendingVerification: true });
      const res = await axiosInstance.post("/auth/resend-verification", {
        email,
      });
      toast.success(res.data.message || "Verification email sent!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send verification email";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isResendingVerification: false });
    }
  },

  forgotPassword: async (email) => {
    try {
      set({ isSendingReset: true });
      const res = await axiosInstance.post("/auth/forgot-password", { email });
      toast.success(res.data.message || "Password reset email sent!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to send password reset email";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isSendingReset: false });
    }
  },

  resetPassword: async (token, newPassword) => {
    try {
      set({ isResettingPassword: true });
      const res = await axiosInstance.post("/auth/reset-password", {
        token,
        newPassword,
      });
      toast.success(res.data.message || "Password reset successful!");
      return { success: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      set({ isResettingPassword: false });
    }
  },
}));
