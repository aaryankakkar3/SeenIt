import express from "express";
import {
  getAllEntries,
  createEntry,
  deleteEntry,
  updateEntry,
} from "../controllers/game.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

export default router;

// All game routes require authentication
router.get("/", protectRoute, getAllEntries);

router.post("/", protectRoute, createEntry);

router.delete("/:id", protectRoute, deleteEntry);

router.put("/:id", protectRoute, updateEntry);
