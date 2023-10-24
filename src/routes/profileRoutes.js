import express from "express";

import {
  getChildProfileList,
  getStaffProfileList,
  getSocialWorkerProfileList,
  getParentProfileList,
  createChildProfile,
  createStaffProfile,
  createSocialWorkerProfile,
  createParentProfile,
  createManagerProfile,
  deleteChildProfile,
  deleteStaffProfile,
  deleteSocialWorkerProfile,
  deleteParentProfile,
  editChildProfile,
  editStaffProfile,
  editSocialWorkerProfile,
  editParentProfile,
  viewChildProfiles,
  viewStaffProfile,
  viewSocialWorkerProfile,
  viewParentProfile,
  viewChildInfoExternal,
  getChildProfileCount,
  getStaffCount,
  getChildProfileCountAdmin,
  getStaffCountStaff,
  getOrphanageCount,
  getChildProfileAllDetails,
  getChildProfileNameListByOrphanageId,
  getSocialWorkerNameListByOrphanageId,
  getProfileVersion,
  createInquiry,
  createFund,
  getProfileCountForOrphanage,
  getStaffCountForOrphanage,
  getParentCountForOrphanage
} from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/s3UploadMiddleware.js";
const router = express.Router();

router.route("/getChildProfileList").get(protect, getChildProfileList);
router.route("/getStaffProfileList").get(protect, getStaffProfileList);
router
  .route("/getSocialWorkerProfileList")
  .get(protect, getSocialWorkerProfileList);
router.route("/getParentProfileList").get(protect, getParentProfileList);

router
  .route("/createChildProfile")
  .post(
    protect,
    upload.fields([
      { name: "MedicalDoc" },
      { name: "Photograph" },
      { name: "ChildProtectionCertificate" },
      { name: "BirthCertificate" },
      { name: "MothersBirthCertificate" },
      { name: "FathersBirthCertificate" },
    ]),
    createChildProfile
  );
router
  .route("/createStaffProfile")
  .post(
    protect,
    upload.fields([
      { name: "NICDoc" },
      { name: "BirthCertificate" },
      { name: "ResidenceCertificate" },
      { name: "CharacterCertificate" },
    ]),
    createStaffProfile
  );

router
  .route("/createSocialWorkerProfile")
  .post(
    protect,
    upload.fields([
      { name: "NICDoc" },
      { name: "BirthCertificate" },
      { name: "OccupationCertificate" },
    ]),
    createSocialWorkerProfile
  );

router.route("/createManagerProfile").post(protect, createManagerProfile);

router
  .route("/createParentProfile")
  .post(
    protect,
    upload.fields([
      { name: "NICDocMother" },
      { name: "NICDocFather" },
      { name: "MarriageCertificate" },
      { name: "ResidenceCertificate" },
      { name: "MothersBirthCertificate" },
      { name: "FathersBirthCertificate" },
      { name: "SalaryPaySheet" },
    ]),
    createParentProfile
  );

router.route("/deleteChildProfile").delete(protect, deleteChildProfile);
router.route("/deleteStaffProfile").delete(protect, deleteStaffProfile);
router
  .route("/deleteSocialWorkerProfile")
  .delete(protect, deleteSocialWorkerProfile);
router.route("/deleteParentProfile").delete(protect, deleteParentProfile);

router
  .route("/editChildProfile")
  .put(
    protect,
    upload.fields([
      { name: "MedicalDoc" },
      { name: "Photograph" },
      { name: "ChildProtectionCertificate" },
      { name: "BirthCertificate" },
      { name: "MothersBirthCertificate" },
      { name: "FathersBirthCertificate" },
    ]),
    editChildProfile
  );
router
  .route("/editStaffProfile")
  .put(
    protect,
    upload.fields([
      { name: "NICDoc" },
      { name: "BirthCertificate" },
      { name: "ResidenceCertificate" },
      { name: "CharacterCertificate" },
    ]),
    editStaffProfile
  );
router
  .route("/editSocialWorkerProfile")
  .put(
    protect,
    upload.fields([
      { name: "NICDoc" },
      { name: "BirthCertificate" },
      { name: "OccupationCertificate" },
    ]),
    editSocialWorkerProfile
  );
router
  .route("/editParentProfile")
  .put(
    protect,
    upload.fields([
      { name: "NICDocMother" },
      { name: "NICDocFather" },
      { name: "MarriageCertificate" },
      { name: "ResidenceCertificate" },
      { name: "MothersBirthCertificate" },
      { name: "FathersBirthCertificate" },
      { name: "SalaryPaySheet" },
    ]),
    editParentProfile
  );

router.route("/viewChildProfiles").get(protect, viewChildProfiles);
router.route("/viewStaffProfile").get(protect, viewStaffProfile);
router.route("/viewSocialWorkerProfile").get(protect, viewSocialWorkerProfile);
router.route("/viewParentProfile").get(protect, viewParentProfile);

router.route("/viewChildInfoExternal").get(protect, viewChildInfoExternal);

router.route("/getChildProfileCount").get(protect, getChildProfileCount);
router.route("/getStaffCount").get(protect, getStaffCount);
router
  .route("/getChildProfileCountAdmin")
  .get(protect, getChildProfileCountAdmin);
router.route("/getStaffCountAdmin").get(protect, getStaffCountStaff);
router.route("/getOrphanageCount").get(protect, getOrphanageCount);

router
  .route("/getChildProfileAllDetails")
  .get(protect, getChildProfileAllDetails);
router
  .route("/getChildProfileNameListByOrphanageId")
  .get(protect, getChildProfileNameListByOrphanageId);
router
  .route("/getSocialWorkerNameListByOrphanageId")
  .get(protect, getSocialWorkerNameListByOrphanageId);

router
  .route("/getChildProfileAllDetails")
  .get(protect, getChildProfileAllDetails);
router.route("/getProfileVersion").get(protect, getProfileVersion);
router.route("/createInquiry").post(protect, createInquiry);
router.route("/createFund").post(protect, createFund);
router
  .route("/getProfileCountForOrphanage")
  .get(protect, getProfileCountForOrphanage);
router
  .route("/getStaffCountForOrphanage")
  .get(protect, getStaffCountForOrphanage);
router
  .route("/getParentCountForOrphanage")
  .get(protect, getParentCountForOrphanage);
export default router;
