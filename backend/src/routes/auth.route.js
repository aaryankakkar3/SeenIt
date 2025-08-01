import express from "express";
import {
  login,
  logout,
  signup,
  checkAuth,
  googleSignIn,
  googleSignUp,
  verifyEmail,
  resendVerificationEmail,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/google-signin", googleSignIn);
router.post("/google-signup", googleSignUp);
router.post("/resend-verification", resendVerificationEmail);

router.get("/verify-email", verifyEmail);
router.get("/check", protectRoute, checkAuth);

export default router;
