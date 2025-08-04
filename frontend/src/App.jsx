import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/SignIn";
import MyList from "./pages/MyList";
import AI from "./pages/AI";
import SignUp from "./pages/SignUp";
import VerifyEmail from "./pages/VerifyEmail";
import { useAuthStore } from "./store/auth.store";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ForgotPassword from "./pages/ForgotPassword";
import HelpSigningIn from "./pages/HelpSigningIn";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    // Check initial theme
    const checkTheme = () => {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );
      setIsDarkMode(darkModeMediaQuery.matches);
    };

    // Check on mount
    checkTheme();

    // Listen for theme changes
    const darkModeMediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );
    const handleThemeChange = (e) => setIsDarkMode(e.matches);

    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    return () =>
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
  }, []);

  console.log("Auth User:", authUser);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }
  return (
    <div className="bg-dark min-h-screen text-text">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            style: {
              background: isDarkMode ? "#c6ff01" : "#526020",
              color: isDarkMode ? "#000000" : "#ffffff",
            },
            icon: false,
          },
          error: {
            style: {
              background: isDarkMode ? "#ff3b30" : "#a23c3c",
              color: isDarkMode ? "#ffffff" : "#ffffff",
            },
            icon: false,
          },
        }}
      />
      <Routes>
        <Route
          path="/"
          element={authUser ? <MyList /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/ai"
          element={authUser ? <AI /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/forgotpassword"
          element={!authUser ? <ForgotPassword /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/reset-password"
          element={!authUser ? <ForgotPassword /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/help-signin"
          element={!authUser ? <HelpSigningIn /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <SignIn /> : <Navigate to={"/"} />}
        ></Route>
        <Route path="/verify-email" element={<VerifyEmail />}></Route>
      </Routes>
    </div>
  );
}

export default App;
