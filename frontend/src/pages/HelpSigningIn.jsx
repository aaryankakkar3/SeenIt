import { useState, useEffect } from "react";
import Dither from "../components/react-components/Dither";
import { useAuthStore } from "../store/auth.store";
import { toast } from "react-hot-toast";

function HelpSigningIn() {
  const [formData, setFormData] = useState({
    email: "",
  });
  const {
    forgotPassword,
    isSendingReset,
    resendVerificationEmail,
    isResendingVerification,
  } = useAuthStore();

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

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    return true;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await forgotPassword(formData.email);
    } catch (error) {
      console.log("Forgot password failed");
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await resendVerificationEmail(formData.email);
    } catch (error) {
      console.log("Resend verification failed");
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
      <div className="w-[50%] flex flex-col items-center justify-center gap-[24px] text-p1 p-[64px] max-md:p-0 max-md:w-[75%] max-sm:w-[100%]">
        <div className="text-h1 leading-[1em]">Help Signing In</div>
        <form className="flex flex-col w-[100%] gap-[16px]" autoComplete="on">
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
            type="button"
            onClick={handleForgotPassword}
            disabled={isSendingReset}
            className="h-[52px] w-[100%] bg-text flex justify-center items-center text-dark font-semibold cursor-pointer hover:bg-textmuted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSendingReset ? "Sending..." : "Forgot password"}
          </button>
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isResendingVerification}
            className="h-[52px] w-[100%] bg-text flex justify-center items-center text-dark font-semibold cursor-pointer hover:bg-textmuted disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isResendingVerification
              ? "Sending..."
              : "Resend verification email"}
          </button>
        </form>
        <div className="text-textmuted leading-[1.5rem]">
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
