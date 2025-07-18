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

router.patch("/:id/increment", protectRoute, incrementWatchedEpisodes);

router.patch("/:id/decrement", protectRoute, decrementWatchedEpisodes);
