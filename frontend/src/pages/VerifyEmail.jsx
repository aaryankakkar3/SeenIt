import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth.store";
import { Loader, CheckCircle, XCircle } from "lucide-react";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyEmail } = useAuthStore();
  const [status, setStatus] = useState("verifying"); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState("");
  const hasVerified = useRef(false); // Prevent duplicate requests

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing.");
      return;
    }

    // Prevent duplicate verification attempts
    if (hasVerified.current) {
      return;
    }

    const handleVerification = async () => {
      hasVerified.current = true; // Mark as attempting verification

      try {
        const result = await verifyEmail(token);
        if (result.success) {
          setStatus("success");
          setMessage("Email verified successfully! You can now sign in.");
          // Redirect to sign in page after 3 seconds
          setTimeout(() => {
            navigate("/login");
          }, 3000);
        } else {
          setStatus("error");
          setMessage(result.error || "Email verification failed.");
        }
      } catch (error) {
        setStatus("error");
        setMessage("An unexpected error occurred during verification.");
      }
    };

    handleVerification();
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-dark text-text px-[30px] max-md:px-[16px]">
      <div className="max-w-md w-full bg-medium border border-light p-[30px] text-center">
        <div className="mb-6">
          {status === "verifying" && (
            <div className="flex flex-col items-center">
              <Loader className="size-12 animate-spin text-primary mb-4" />
              <h1 className="text-h2 text-text font-semibold mb-2">
                Verifying Email
              </h1>
              <p className="text-textmuted text-p2">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <CheckCircle className="size-12 text-primary mb-4" />
              <h1 className="text-h2 text-text font-semibold mb-2">
                Email Verified!
              </h1>
              <p className="text-textmuted text-p2 mb-4">{message}</p>
              {/* <p className="text-p2 text-textmuted">
                Redirecting you to sign in page...
              </p> */}
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <XCircle className="size-12 text-red-500 mb-4" />
              <h1 className="text-h2 text-text font-semibold mb-2">
                Verification Failed
              </h1>
              <p className="text-textmuted text-p2 mb-6">{message}</p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => navigate("/login")}
                  className="h-[52px] w-[100%] bg-text flex justify-center items-center text-dark font-semibold cursor-pointer hover:bg-textmuted transition-colors"
                >
                  Go to Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="h-[52px] w-[100%] bg-medium text-text flex justify-center items-center font-semibold cursor-pointer hover:bg-light transition-colors border border-textmuted"
                >
                  Sign Up Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;
