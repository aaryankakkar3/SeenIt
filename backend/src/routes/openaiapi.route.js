import express from "express";
import { getAISuggestions } from "../controllers/openaiapi.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/ai-suggestions", protectRoute, getAISuggestions);

export default router;
