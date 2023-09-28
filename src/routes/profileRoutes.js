import express from "express";
import { 
    getChildProfileList, getStaffProfileList, getSocialWorkerProfileList,getParentProfileList,
    createChildProfile, createStaffProfile, createSocialWorkerProfile,createParentProfile,
    deleteChildProfile, deleteStaffProfile, deleteSocialWorkerProfile, deleteParentProfile,
    editChildProfile,editStaffProfile,editSocialWorkerProfile,editParentProfile,
    viewChildProfiles,viewStaffProfile, viewSocialWorkerProfile,viewParentProfile,
    viewChildInfoExternal,getChildProfileCount,getStaffCount,getChildProfileCountAdmin,
    getStaffCountStaff,getOrphanageCount,getChildProfileAllDetails,getProfileVersion
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/getChildProfileList").get(protect, getChildProfileList);
router.route("/getStaffProfileList").get(protect, getStaffProfileList);
router.route("/getSocialWorkerProfileList").get(protect, getSocialWorkerProfileList);
router.route("/getParentProfileList").get(protect, getParentProfileList);

router.route("/createChildProfile").post(protect, createChildProfile);
router.route("/createStaffProfile").post(protect, createStaffProfile);
router.route("/createSocialWorkerProfile").post(protect, createSocialWorkerProfile);
router.route("/createParentProfile").post(protect, createParentProfile);

router.route("/deleteChildProfile").delete(protect, deleteChildProfile);
router.route("/deleteStaffProfile").delete(protect, deleteStaffProfile);
router.route("/deleteSocialWorkerProfile").delete(protect, deleteSocialWorkerProfile);
router.route("/deleteParentProfile").delete(protect, deleteParentProfile);


router.route("/editChildProfile").put(protect, editChildProfile);
router.route("/editStaffProfile").put(protect, editStaffProfile);
router.route("/editSocialWorkerProfile").put(protect, editSocialWorkerProfile);
router.route("/editParentProfile").put(protect, editParentProfile);

router.route("/viewChildProfiles").get(protect, viewChildProfiles);
router.route("/viewStaffProfile").get(protect, viewStaffProfile);
router.route("/viewSocialWorkerProfile").get(protect, viewSocialWorkerProfile);
router.route("/viewParentProfile").get(protect, viewParentProfile);

router.route("/viewChildInfoExternal").get(protect, viewChildInfoExternal);

router.route("/getChildProfileCount").get(protect, getChildProfileCount);
router.route("/getStaffCount").get(protect, getStaffCount);
router.route("/getChildProfileCountAdmin").get(protect, getChildProfileCountAdmin);
router.route("/getStaffCountAdmin").get(protect, getStaffCountStaff);
router.route("/getOrphanageCount").get(protect, getOrphanageCount);

router.route("/getChildProfileAllDetails").get(protect, getChildProfileAllDetails);
router.route("/getProfileVersion").get(protect, getProfileVersion);
export default router;

