import express from "express";
import {
  addSection,
  deleteSection,
  getAllSections,
} from "../controllers/sections.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getAllSections);

router.post("/:section", protectRoute, addSection);

router.delete("/:section", protectRoute, deleteSection);

export default router;
