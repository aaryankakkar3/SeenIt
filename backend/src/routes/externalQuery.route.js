import express from "express";
import { fetchData } from "../controllers/externalQuery.controller.js";

const router = express.Router();

// GET /api/external/:type/:query - Search external APIs for media
router.get("/:type/:query", fetchData);

export default router;
