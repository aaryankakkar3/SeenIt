import express from "express";
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} from "../controllers/manga.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// GET /api/manga - Get all manga entries for the authenticated user
router.get("/", getAllEntries);

// POST /api/manga - Create a new manga entry
router.post("/", createEntry);

// PUT /api/manga/:id - Update a manga entry
router.put("/:id", updateEntry);

// DELETE /api/manga/:id - Delete a manga entry
router.delete("/:id", deleteEntry);

// PUT /api/manga/:id/increment - Increment chapters read
router.put("/:id/increment", incrementProgress);

// PUT /api/manga/:id/decrement - Decrement chapters read
router.put("/:id/decrement", decrementProgress);

export default router;
