import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="h-[64px] w-[100%] flex flex-row items-center justify-between">
      <div
        className="text-h1 text-primary cursor-pointer"
        onClick={() => navigate("/")}
      >
        SeenIt
      </div>
      <div className="text-p1 text-textmuted flex flex-row gap-[32px]">
        <div
          className={`text-primarysoft hover:underline cursor-pointer ${
            isActive("/ai") ? "underline" : ""
          }`}
          onClick={() => navigate("/ai")}
        >
          AI Suggestions
        </div>
        <div
          className={`hover:underline cursor-pointer ${
            isActive("/") ? "underline" : ""
          }`}
          onClick={() => navigate("/")}
        >
          My List
        </div>
        <div className="hover:underline cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
}

export default Navbar;
