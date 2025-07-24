import express from "express";
import {
  getAllEntries,
  createEntry,
  updateEntry,
  deleteEntry,
  incrementProgress,
  decrementProgress,
} from "../controllers/show.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes
router.use(protectRoute);

// GET /api/shows - Get all show entries for the authenticated user
router.get("/", getAllEntries);

// POST /api/shows - Create a new show entry
router.post("/", createEntry);

// PUT /api/shows/:id - Update a show entry
router.put("/:id", updateEntry);

// DELETE /api/shows/:id - Delete a show entry
router.delete("/:id", deleteEntry);

// PUT /api/shows/:id/increment - Increment episodes watched
router.put("/:id/increment", incrementProgress);

// PUT /api/shows/:id/decrement - Decrement episodes watched
router.put("/:id/decrement", decrementProgress);

export default router;
