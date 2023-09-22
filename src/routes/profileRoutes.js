import express from "express";
import { broadcast } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/broadcast").post(protect, broadcast);

export default router;

