import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import Dither from "../components/react-components/Dither";
import { useAuthStore } from "../store/auth.store";
import { toast } from "react-hot-toast";

function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
  });
  const [token, setToken] = useState("");
  const { resetPassword, isResettingPassword } = useAuthStore();

  // Add custom CSS to override autofill styles
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      /* Autofill input styling */
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-box-shadow: 0 0 0 30px var(--color-medium) inset !important;
        -webkit-text-fill-color: var(--color-text) !important;
        background-color: var(--color-medium) !important;
        border: none !important;
        transition: background-color 5000s ease-in-out 0s;
      }
      
      /* Autofill dropdown/suggestion styling */
      input::-webkit-credentials-auto-fill-button {
        background-color: var(--color-medium) !important;
        color: var(--color-text) !important;
      }
      
      /* Chrome autofill dropdown suggestions */
      input:-webkit-autofill-selected {
        background-color: var(--color-light) !important;
        color: var(--color-text) !important;
      }
      
      /* Firefox autofill */
      input:-moz-autofill {
        background-color: var(--color-medium) !important;
        color: var(--color-text) !important;
        border: none !important;
      }
      
      input:-moz-autofill:hover {
        background-color: var(--color-light) !important;
        color: var(--color-text) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    // Get token from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get("token");

    if (!resetToken) {
      toast.error("Invalid or missing reset token");
      window.location.href = "/help-signin";
      return;
    }

    setToken(resetToken);
  }, []);

  const validateForm = () => {
    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!token) {
      toast.error("Invalid reset token");
      return;
    }

    try {
      const result = await resetPassword(token, formData.password);
      if (result.success) {
        // Redirect to sign in page after successful reset
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    } catch (error) {
      console.log("Password reset failed");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-row gap-[64px] h-[100vh] p-[64px] justify-center max-md:p-[32]">
      <div className="w-[50%] relative h-full rounded-[36px] overflow-hidden max-md:hidden">
        <Dither
          waveColor={[0.784, 1, 0]}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={0.3}
          colorNum={4}
          waveAmplitude={0.3}
          waveFrequency={3}
          waveSpeed={0.05}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute top-[60px] left-[60px] text-h1 font-semibold text-text cursor-pointer">
          SeenIt
        </div>
      </div>
      <div className="w-[50%] flex flex-col items-center justify-center gap-[24px] text-p1 p-[64px] max-md:p-0 max-md:w-[75%]">
        <div className="text-h1">Reset Password</div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[100%] gap-[16px]"
          autoComplete="on"
        >
          <div className="w-[100%] h-[52px] bg-medium flex flex-row px-[30px]">
            <input
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="New Password"
              value={formData.password}
              onChange={handleChange}
              className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="text-textmuted cursor-pointer h-[24px] w-[24px]" />
              ) : (
                <Eye className="text-textmuted cursor-pointer h-[24px] w-[24px]" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isResettingPassword}
            className="h-[52px] w-[100%] bg-primary flex justify-center items-center text-dark font-semibold cursor-pointer hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResettingPassword ? "Resetting..." : "Reset Password"}
          </button>
        </form>
        <div className="text-textmuted leading-[1.5rem]">
          Remember your password?{" "}
          <button
            className="text-primary hover:underline cursor-pointer"
            onClick={() => (window.location.href = "/login")}
          >
            Sign In.
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
