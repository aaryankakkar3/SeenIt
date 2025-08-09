import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsMobileMenuOpen(false);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="h-[64px] w-[100%] flex flex-row items-center justify-between relative">
      <div
        className="text-h1 text-primary cursor-pointer"
        onClick={() => handleNavigate("/")}
      >
        SeenIt
      </div>

      {/* Desktop Menu */}
      <div className="text-p1 text-textmuted flex flex-row gap-[32px] max-md:hidden">
        <div
          className={`text-primarysoft hover:underline cursor-pointer ${
            isActive("/ai") ? "underline" : ""
          }`}
          onClick={() => handleNavigate("/ai")}
        >
          AI Suggestions
        </div>
        <div
          className={`hover:underline cursor-pointer ${
            isActive("/") ? "underline" : ""
          }`}
          onClick={() => handleNavigate("/")}
        >
          My List
        </div>
        <div className="hover:underline cursor-pointer" onClick={handleLogout}>
          Logout
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <button
        className="md:hidden text-primary"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <Menu size={40} />
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-dark z-50 md:hidden">
          <div className="flex flex-col items-start justify-start p-[32px] text-h2 h-full gap-[8px] leading-normal">
            <div className="flex flex-row justify-between w-full">
              <div
                className="text-primary cursor-pointer text-h1"
                onClick={() => handleNavigate("/")}
              >
                SeenIt
              </div>
              <button
                className="md:hidden text-primary"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <X size={40} />
              </button>
            </div>
            <div
              className={`text-primarysoft hover:underline cursor-pointer ${
                isActive("/ai") ? "underline" : ""
              }`}
              onClick={() => handleNavigate("/ai")}
            >
              AI Suggestions
            </div>
            <div
              className={`text-textmuted hover:underline cursor-pointer ${
                isActive("/") ? "underline" : ""
              }`}
              onClick={() => handleNavigate("/")}
            >
              My List
            </div>
            <div
              className="text-textmuted hover:underline cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
