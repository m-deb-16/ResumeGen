import express from "express";
import {
  createResume,
  getResumeById,
  getAllresumes,
  deleteResume,
  updateResume,
  downloadLatex,
  downloadPdf,
  enhanceWithAI,
  generatePortfolio,
  enhanceFieldText,
} from "../controllers/resumeController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public debug route
router.get("/debug", (req, res) => {
  res.json({ message: "Resume route working" });
});

// All resume routes require authentication
router.use(authenticate);

router.post("/", createResume);
router.get("/", getAllresumes);
router.post("/enhance-field", enhanceFieldText);
router.get("/:id/latex", downloadLatex);
router.get("/:id/pdf", downloadPdf);
router.post("/:id/enhance", enhanceWithAI);
router.post("/:id/portfolio", generatePortfolio);
router.get("/:id", getResumeById);
router.put("/:id", updateResume);
router.delete("/:id", deleteResume);

export default router;
