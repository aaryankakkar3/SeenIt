import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import Dither from "../components/react-components/Dither";
import { useAuthStore } from "../store/auth.store";
import { toast } from "react-hot-toast";

function HelpSigningIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn, googleAuth, isGoogleLoading } = useAuthStore();

  const [shouldTriggerSave, setShouldTriggerSave] = useState(false);

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

  const handleGoogleSuccess = (credentialResponse) => {
    console.log("Google auth started, isGoogleLoading:", isGoogleLoading);
    googleAuth(credentialResponse.credential, false);
  };

  const handleGoogleError = () => {
    toast.error("Google sign in failed");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const credentials = {
      email: formData.email,
      password: formData.password,
    };

    try {
      await login(credentials);
      setShouldTriggerSave(true);
    } catch (error) {
      console.log("Login failed");
    }
  };

  // Effect to trigger password save after successful login
  useEffect(() => {
    if (shouldTriggerSave) {
      // Reset the flag
      setShouldTriggerSave(false);

      // Try to trigger the browser's password save prompt
      if (navigator.credentials && window.PasswordCredential) {
        try {
          // Create a credential object
          const cred = new window.PasswordCredential({
            id: formData.email,
            password: formData.password,
            name: formData.email,
          });
          navigator.credentials.store(cred);
        } catch (error) {
          console.log("Could not store credentials:", error);
        }
      }
    }
  }, [shouldTriggerSave, formData.email, formData.password]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-row gap-[64px] h-[100vh] p-[64px] justify-center">
      <div className="w-[50%] relative h-full rounded-[36px] overflow-hidden">
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
      <div className="w-[50%] flex flex-col items-center justify-center gap-[24px] text-p1 p-[64px]">
        <div className="text-h1">Help Signing In</div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[100%] gap-[16px]"
          autoComplete="on"
        >
          <div className="w-[100%] h-[52px] bg-medium px-[30px]">
            <input
              autoComplete="email"
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="h-[52px] w-[100%] bg-text flex justify-center items-center text-dark font-semibold cursor-pointer hover:bg-textmuted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? "Resetting..." : "Forgot password"}
          </button>
          <button
            type="submit"
            disabled={isLoggingIn}
            className="h-[52px] w-[100%] bg-text flex justify-center items-center text-dark font-semibold cursor-pointer hover:bg-textmuted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingIn ? "Resetting..." : "Resend verification email"}
          </button>
        </form>
        <div className="text-textmuted">
          Don't need help?{" "}
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

export default HelpSigningIn;
