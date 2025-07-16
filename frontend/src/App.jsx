import { Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import SignIn from "./pages/SignIn";
import MyList from "./pages/MyList";
import AI from "./pages/AI";
import Friends from "./pages/Friends";
import SignUp from "./pages/SignUp";
import { useAuthStore } from "./store/auth.store";
import { useEffect } from "react";
import { Loader } from "lucide-react";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
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
              background: "#10B981",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#EF4444",
              color: "#fff",
            },
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
          path="/friends"
          element={authUser ? <Friends /> : <Navigate to="/login" />}
        ></Route>
        <Route
          path="/signup"
          element={!authUser ? <SignUp /> : <Navigate to={"/"} />}
        ></Route>
        <Route
          path="/login"
          element={!authUser ? <SignIn /> : <Navigate to={"/"} />}
        ></Route>
      </Routes>
    </div>
  );
}

export default App;
