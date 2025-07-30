import express from "express";
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
  preFetchCache,
} from "../controllers/comic.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// GET /api/comics - Get all comic entries for the authenticated user
router.get("/", getAllEntries);

// POST /api/comics - Create a new comic entry
router.post("/", createEntry);

// PUT /api/comics/:id - Update a comic entry
router.put("/:id", updateEntry);

// DELETE /api/comics/:id - Delete a comic entry
router.delete("/:id", deleteEntry);

// PUT /api/comics/:id/increment - Increment issues read
router.put("/:id/increment", incrementProgress);

// PUT /api/comics/:id/decrement - Decrement issues read
router.put("/:id/decrement", decrementProgress);

// GET /api/comics/cache/:id - Pre-fetch cache data for a comic
router.get("/cache/:id", preFetchCache);

export default router;
