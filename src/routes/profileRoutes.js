import express from "express";
import { getChildProfileList, getStaffProfileList, getSocialWorkerProfileList,getParentProfileList } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/getChildProfileList").get(protect, getChildProfileList);
router.route("/getStaffProfileList").get(protect, getStaffProfileList);
router.route("/getSocialWorkerProfileList").get(protect, getSocialWorkerProfileList);
router.route("/getParentProfileList").get(protect, getParentProfileList);

export default router;

