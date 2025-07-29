import express from "express";
import {
  getAllEntries,
  createEntry,
  deleteEntry,
  updateEntry,
  incrementWatchedEpisodes,
  decrementWatchedEpisodes,
} from "../controllers/anime.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

export default router;

// All anime routes require authentication
router.get("/", protectRoute, getAllEntries);

router.post("/", protectRoute, createEntry);

router.delete("/:id", protectRoute, deleteEntry);

router.put("/:id", protectRoute, updateEntry);

// PUT /api/anime/:id/increment - Increment episodes watched
router.put("/:id/increment", protectRoute, incrementWatchedEpisodes);

// PUT /api/anime/:id/decrement - Decrement episodes watched
router.put("/:id/decrement", protectRoute, decrementWatchedEpisodes);
