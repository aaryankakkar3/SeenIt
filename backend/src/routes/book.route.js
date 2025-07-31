import express from "express";
import {
  getAllEntries,
  createEntry,
  deleteEntry,
  updateEntry,
  incrementProgress,
  decrementProgress,
} from "../controllers/book.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

export default router;

// All book routes require authentication
router.get("/", protectRoute, getAllEntries);

router.post("/", protectRoute, createEntry);

router.delete("/:id", protectRoute, deleteEntry);

router.put("/:id", protectRoute, updateEntry);

// PUT /api/books/:id/increment - Increment pages read
router.put("/:id/increment", protectRoute, incrementProgress);

// PUT /api/books/:id/decrement - Decrement pages read
router.put("/:id/decrement", protectRoute, decrementProgress);
