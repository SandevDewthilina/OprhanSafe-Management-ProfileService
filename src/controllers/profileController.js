import asyncHandler from "express-async-handler";
import {
  getChildProfilesAsync,
  getStaffProfileListAsync,
  getSocialWorkerProfileListAsync,
  getParentProfileListAsync,
  createChildProfileAsync,
  createStaffProfileAsync,
  createSocialWorkerProfileAsync,
  createParentProfileAsync,
  deleteChildProfileAsync,
  deleteStaffProfileAsync,
  deleteSocialWorkerProfileAsync,
  deleteParentProfileAsync,
  editChildProfileAsync,
  editStaffProfileAsync,
  editSocialWorkerProfileAsync,
  editParentProfileAsync,
  viewChildProfilesAsync,
  viewStaffProfileAsync,
  viewSocialWorkerProfileAsync,
  viewParentProfileAsync,
  viewChildInfoExternalAsync,
  getChildProfileCountAsync,
  getStaffCountAsync,
  getChildProfileCountAdminAsync,
  getStaffCountStaffAsync,
  getUserByEmailAsync,
  CreateProfileVersionAsync,
  getOrphanageCountAsync,
  getChildProfileAllDetailsAsync,
  getChildProfileNameListByOrphanageIdAsync,
  getSocialWorkerNameListByOrphanageIdAsync,
  getProfileVersionAsync,
  createUserRolesAsync,
  getStaffRoleIdAsync,
  getSocialWorkerRoleIdAsync,
  getParentRoleIdAsync,
  getManagerRoleIdAsync,
} from "../services/profileService.js";

import { RPCRequest } from "../lib/rabbitmq/index.js";
import { AUTH_SERVICE_RPC } from "../config/index.js";

// @desc notification broadcast
// route POST /api/notifications/broadcast
// @access Private

/**
 * get profile lists
 *
 */
export const getChildProfileList = asyncHandler(async (req, res) => {
  const childProfiles = await getChildProfilesAsync();
  // Remove the timestamp from DateOfBirth
  const formattedChildProfiles = childProfiles.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    if (profile["DateOfAdmission"]) {
      const DateOfAdmissionTimestamp = new Date(profile["DateOfAdmission"]);
      const datePart = DateOfAdmissionTimestamp.toISOString().split("T")[0];
      profile["DateOfAdmission"] = datePart;
    }
    return profile;
  });

  return res.status(200).json({
    success: true,
    childProfiles: formattedChildProfiles,
  });
});

export const getStaffProfileList = asyncHandler(async (req, res) => {
  const results = await getStaffProfileListAsync();
  return res.status(200).json({
    success: true,
    staffProfiles: results,
  });
});

export const getSocialWorkerProfileList = asyncHandler(async (req, res) => {
  const results = await getSocialWorkerProfileListAsync();
  return res.status(200).json({
    success: true,
    socialWorkerProfiles: results,
  });
});

export const getParentProfileList = asyncHandler(async (req, res) => {
  const results = await getParentProfileListAsync();
  return res.status(200).json({
    success: true,
    parentsProfiles: results,
  });
});

/**
 * Create Profiles
 */

export const createChildProfile = asyncHandler(async (req, res) => {
  const {
    FullName,
    DOB,
    Gender,
    DateOfAdmission,
    Country,
    City,
    Nationality,
    Language,
    Remark,
    MedicalDesc,
    BirthFather,
    BirthMother,
    ReasonForPlacement,
    RegisteredBy,
    OrphanageId,
  } = req.body;
  await createChildProfileAsync(
    FullName,
    DOB,
    Gender,
    DateOfAdmission,
    Country,
    City,
    Nationality,
    Language,
    Remark,
    MedicalDesc,
    BirthFather,
    BirthMother,
    ReasonForPlacement,
    RegisteredBy,
    OrphanageId
  );
  return res.status(200).json({
    success: true,
    message: "successfully created a child profile",
  });
});

export const createStaffProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: req.body,
  });
  const results = await getUserByEmailAsync(req.body.email);
  const RoleId = await getStaffRoleIdAsync();
  await createUserRolesAsync(results[0].Id, RoleId[0].Id);

  return res.status(200).json({
    success: true,
    message: "successfully created a staff profile",
  });
});

export const createManagerProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: req.body,
  });
  const results = await getUserByEmailAsync(req.body.email);
  const RoleId = await getManagerRoleIdAsync();
  await createUserRolesAsync(results[0].Id, RoleId[0].Id);

  return res.status(200).json({
    success: true,
    message: "successfully created a Manager profile",
  });
});

export const createSocialWorkerProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: req.body,
  });
  const UserId = await getUserByEmailAsync(req.body.email);
  const RoleId = await getSocialWorkerRoleIdAsync();
  await createUserRolesAsync(UserId[0].Id, RoleId[0].Id);
  const results = await createSocialWorkerProfileAsync(
    req.body.Category,
    req.body.Organization,
    req.body.Role,
    req.body.Experience,
    UserId[0].Id
  );
  return res.status(200).json({
    success: true,
    message: "successfully created a socialWorker profile",
  });
});

export const createParentProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: req.body,
  });
  const UserId = await getUserByEmailAsync(req.body.email);
  const RoleId = await getParentRoleIdAsync();
  await createUserRolesAsync(UserId[0].Id, RoleId[0].Id);
  const results = await createParentProfileAsync(
    req.body.NameOfFather,
    req.body.NICOfFather,
    req.body.MobileOfFather,
    req.body.DOBOfFather,
    req.body.OccupationOfFather,
    req.body.NameOfMother,
    req.body.NICOfMother,
    req.body.MobileOfMother,
    req.body.DOBOfMother,
    req.body.OccupationOfMother,
    req.body.Address,
    req.body.Email,
    req.body.AdoptionPreference,
    req.body.AgePreference,
    req.body.GenderPreference,
    req.body.NationalityPreference,
    req.body.LanguagePreference,
    UserId[0].Id
  );

  return res.status(200).json({
    success: true,
    message: "successfully created a parent profile",
  });
});

/**
 * Delete Profiles
 */
export const deleteChildProfile = asyncHandler(async (req, res) => {
  const { childId, commitMessage, committedByUserId } = req.body;
  const profileData = await getChildProfileAllDetailsAsync(childId);
  if (profileData) {
    await CreateProfileVersionAsync(
      childId,
      JSON.stringify(profileData),
      commitMessage,
      committedByUserId
    );
    await deleteChildProfileAsync(childId);
  } else {
    console.error("Child profile not found");
  }

  return res.status(200).json({
    success: true,
    message: "successfully deleted child profile",
    profileData: JSON.stringify(profileData),
  });
});
export const deleteStaffProfile = asyncHandler(async (req, res) => {
  const results = await deleteStaffProfileAsync(req.body.userIdToDelete);
  return res.status(200).json({
    success: true,
    message: "successfully deleted staff profile",
  });
});
export const deleteSocialWorkerProfile = asyncHandler(async (req, res) => {
  const results = await deleteSocialWorkerProfileAsync(req.body.userIdToDelete);
  return res.status(200).json({
    success: true,
    parentProfile: results,
  });
});
export const deleteParentProfile = asyncHandler(async (req, res) => {
  const results = await deleteParentProfileAsync(req.body.userIdToDelete);
  return res.status(200).json({
    success: true,
    parentProfile: results,
  });
});

/**
 * Edit profiles
 */
export const editChildProfile = asyncHandler(async (req, res) => {
  const {
    Id,
    FullName,
    DOB,
    Gender,
    DateOfAdmission,
    Country,
    City,
    Nationality,
    Language,
    Remark,
    MedicalDesc,
    BirthFather,
    BirthMother,
    ReasonForPlacement,
    OrphanageId,
  } = req.body;
  const results = await editChildProfileAsync(
    Id,
    FullName,
    DOB,
    Gender,
    DateOfAdmission,
    Country,
    City,
    Nationality,
    Language,
    Remark,
    MedicalDesc,
    BirthFather,
    BirthMother,
    ReasonForPlacement,
    OrphanageId
  );
  return res.status(200).json({
    success: true,
    message: "successfully edited child profile",
    childProfile: results,
  });
});

export const editStaffProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "UPDATE_USER",
    data: req.body,
  });
  //const results = await editStaffProfileAsync();
  return res.status(200).json({
    success: true,
    message: "successfully edited staff profile",
  });
});

export const editSocialWorkerProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "UPDATE_USER",
    data: req.body,
  });
  const UserId = await getUserByEmailAsync(req.body.email);
  const results = await editSocialWorkerProfileAsync(
    req.body.Category,
    req.body.Organization,
    req.body.Role,
    req.body.Experience,
    UserId[0].Id
  );
  return res.status(200).json({
    success: true,
    message: "successfully edited social worker profile",
  });
});

export const editParentProfile = asyncHandler(async (req, res) => {
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "UPDATE_USER",
    data: req.body,
  });
  const UserId = await getUserByEmailAsync(req.body.email);
  const results = await editParentProfileAsync(
    req.body.NameOfFather,
    req.body.NICOfFather,
    req.body.MobileOfFather,
    req.body.DOBOfFather,
    req.body.OccupationOfFather,
    req.body.NameOfMother,
    req.body.NICOfMother,
    req.body.MobileOfMother,
    req.body.DOBOfMother,
    req.body.OccupationOfMother,
    req.body.Address,
    req.body.Email,
    req.body.AdoptionPreference,
    req.body.AgePreference,
    req.body.GenderPreference,
    req.body.NationalityPreference,
    req.body.LanguagePreference,
    UserId[0].Id
  );
  return res.status(200).json({
    success: true,
    message: "successfully edited parent profile",
  });
});

/**
 * View profiles by managers
 */
export const viewChildProfiles = asyncHandler(async (req, res) => {
  const results = await viewChildProfilesAsync(req.body.childId);
  // Remove the timestamp from DateOfBirth
  const formattedChildProfiles = results.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    if (profile["DateOfAdmission"]) {
      const DateOfAdmissionTimestamp = new Date(profile["DateOfAdmission"]);
      const datePart = DateOfAdmissionTimestamp.toISOString().split("T")[0];
      profile["DateOfAdmission"] = datePart;
    }
    return profile;
  });

  return res.status(200).json({
    success: true,
    childProfile: formattedChildProfiles,
  });
});
export const viewStaffProfile = asyncHandler(async (req, res) => {
  const results = await viewStaffProfileAsync(req.body.Id);
  const formattedStaffProfiles = results.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    return profile;
  });
  return res.status(200).json({
    success: true,
    staffProfile: formattedStaffProfiles,
  });
});
export const viewSocialWorkerProfile = asyncHandler(async (req, res) => {
  const results = await viewSocialWorkerProfileAsync(req.body.Id);
  const formattedSocialWorkerProfiles = results.map((profile) => {
    if (profile["DOB"]) {
      const DOBTimestamp = new Date(profile["DOB"]);
      const datePart = DOBTimestamp.toISOString().split("T")[0];
      profile["DOB"] = datePart;
    }
    return profile;
  });
  return res.status(200).json({
    success: true,
    socialWorkerProfile: formattedSocialWorkerProfiles,
  });
});
export const viewParentProfile = asyncHandler(async (req, res) => {
  const results = await viewParentProfileAsync();
  const formattedParentProfiles = results.map((profile) => {
    if (profile["DOBOfFather"]) {
      const DOBOfFatherTimestamp = new Date(profile["DOBOfFather"]);
      const datePart = DOBOfFatherTimestamp.toISOString().split("T")[0];
      profile["DOBOfFather"] = datePart;
    }
    if (profile["DOBOfMother"]) {
      const DOBOfMotherTimestamp = new Date(profile["DOBOfMother"]);
      const datePart = DOBOfMotherTimestamp.toISOString().split("T")[0];
      profile["DOBOfMother"] = datePart;
    }
    return profile;
  });
  return res.status(200).json({
    success: true,
    parentProfile: formattedParentProfiles,
  });
});

/**
 * External party view child profiles
 */

export const viewChildInfoExternal = asyncHandler(async (req, res) => {
  const results = await viewChildInfoExternalAsync(req.body.childId);
  return res.status(200).json({
    success: true,
    parentProfile: results,
  });
});

/**
 * Profile count
 */

export const getChildProfileCount = asyncHandler(async (req, res) => {
  const results = await getChildProfileCountAsync(req.body.OrphanageId);
  return res.status(200).json({
    success: true,
    childProfileCount: results,
  });
});

export const getStaffCount = asyncHandler(async (req, res) => {
  const results = await getStaffCountAsync(req.body.OrphanageId);
  return res.status(200).json({
    success: true,
    StaffCount: results,
  });
});

export const getChildProfileCountAdmin = asyncHandler(async (req, res) => {
  const results = await getChildProfileCountAdminAsync();
  return res.status(200).json({
    success: true,
    ChildProfileCount: results,
  });
});

export const getStaffCountStaff = asyncHandler(async (req, res) => {
  const results = await getStaffCountStaffAsync();
  return res.status(200).json({
    success: true,
    StaffCount: results,
  });
});

export const getOrphanageCount = asyncHandler(async (req, res) => {
  const results = await getOrphanageCountAsync();
  return res.status(200).json({
    success: true,
    OrphanageCount: results,
  });
});

export const getChildProfileAllDetails = asyncHandler(async (req, res) => {
  const results = await getChildProfileAllDetailsAsync(req.body.childId);
  return res.status(200).json({
    success: true,
    ChildProfiles: results,
  });
});

export const getChildProfileNameListByOrphanageId = asyncHandler(
  async (req, res) => {
    const result = await getChildProfileNameListByOrphanageIdAsync(
      req.userInfo.orphanageId
    );
    return res.status(200).json({
      success: true,
      childProfileNameList: result,
    });
  }
);

export const getSocialWorkerNameListByOrphanageId = asyncHandler(
  async (req, res) => {
    const result = await getSocialWorkerNameListByOrphanageIdAsync(
      req.userInfo.orphanageId
    );
    return res.status(200).json({
      success: true,
      socialWorkerNameList: result,
    });
  }
);

export const getProfileVersion = asyncHandler(async (req, res) => {
  const results = await getProfileVersionAsync();
  return res.status(200).json({
    success: true,
    ProfileVersion: results,
  });
});
