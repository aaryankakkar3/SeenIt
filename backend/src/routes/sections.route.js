import express from "express";
import {
  addSection,
  deleteSection,
  getAllSections,
} from "../controllers/sections.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllSections);

router.post("/:section", addSection);

router.delete("/:section", deleteSection);

export default router;
