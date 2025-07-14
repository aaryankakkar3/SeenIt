import express from "express";
import {
  getAllEntries,
  createEntry,
  deleteEntry,
  updateEntry,
  incrementWatchedEpisodes,
  decrementWatchedEpisodes,
} from "../controllers/anime.controller.js";

const router = express.Router();

export default router;

router.get("/", getAllEntries);

router.post("/", createEntry);

router.delete("/:id", deleteEntry);

router.put("/:id", updateEntry);

router.patch("/:id/increment", incrementWatchedEpisodes);

router.patch("/:id/decrement", decrementWatchedEpisodes);
