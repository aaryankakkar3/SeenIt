import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { GoogleLogin } from "@react-oauth/google";
import Dither from "../components/react-components/Dither";
import { useAuthStore } from "../store/auth.store";
import { toast } from "react-hot-toast";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const { signup, isSigningUp, googleAuth, isGoogleLoading } = useAuthStore();

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
    googleAuth(credentialResponse.credential, true);
  };

  const handleGoogleError = () => {
    toast.error("Google sign up failed");
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fullNameWords = formData.fullName.trim().split(/\s+/);

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }

    if (fullNameWords.length !== 2) {
      toast.error("Full name must contain first name and last name.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Store the form data for potential credential storage
    const formElement = e.target;
    const formData = new FormData(formElement);
    const credentials = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const result = await signup(credentials);

      // Only store credentials if signup was successful
      if (
        result.success &&
        navigator.credentials &&
        window.PasswordCredential
      ) {
        try {
          const cred = new window.PasswordCredential(formElement);
          await navigator.credentials.store(cred);
        } catch (credError) {
          console.log("Credential storage failed:", credError);
        }
      }
    } catch (error) {
      // Signup failed, don't store credentials
      console.log("Signup failed, not storing credentials");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-row gap-[64px] h-[100vh] p-[64px] justify-center max-md:p-[32px]">
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
      <div className="w-[50%] flex flex-col items-center justify-center gap-[32px] text-p1 p-[64px] max-md:p-0 max-md:w-[75%]">
        <div className="text-h1">
          <span className="text-primary">SeenIt </span>Sign Up
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col w-[100%] gap-[16px]"
          autoComplete="on"
        >
          <div className="w-[100%] h-[52px] bg-medium px-[30px]">
            <input
              autoComplete="given-name"
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="w-[100%] h-[100%] placeholder:text-textmuted focus:outline-none"
              required
            />
          </div>
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
          <div className="w-[100%] h-[52px] bg-medium flex flex-row px-[30px]">
            <input
              autoComplete="new-password"
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              placeholder="Password"
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
                <Eye className="text-textmuted  cursor-pointer h-[24px] w-[24px]" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={isSigningUp}
            className="h-[52px] w-[100%] bg-text flex justify-center items-center text-dark font-semibold cursor-pointer hover:bg-textmuted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSigningUp ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <div className="flex flex-col w-[100%] gap-[16px]">
          <div className="relative h-[52px] w-[100%] group">
            <button
              className={`h-[52px] w-[100%] bg-medium flex justify-center items-center text-text gap-[16px] cursor-pointer group-hover:bg-light transition-colors ${
                isGoogleLoading ? "opacity-50" : ""
              }`}
              disabled={isGoogleLoading}
            >
              <FaGoogle className="w-36px h-36px" />
              <div>
                {isGoogleLoading
                  ? "Signing up with Google..."
                  : "Sign up with Google"}
              </div>
            </button>
            {/* Invisible GoogleLogin component positioned over custom button */}
            <div
              className={`absolute inset-0 ${
                isGoogleLoading ? "pointer-events-none" : "pointer-events-auto"
              }`}
              style={{ opacity: 0 }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                width="100%"
                size="large"
              />
            </div>
          </div>
        </div>
        <div className="text-textmuted leading-[1.5rem]">
          Already have an account?{" "}
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

export default SignUp;
