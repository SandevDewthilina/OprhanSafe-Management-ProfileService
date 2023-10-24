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
  getOrphanageIdAsync,
  getUserIdAsync,
  createInquiryAsync,
  childProfileDeleteRequestAsync,
  createFundAsync,
  createApprovalLogAsync
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
    OrphanageName,
  } = JSON.parse(req.body.otherInfo);
  const OrphanageId=await getOrphanageIdAsync (OrphanageName);
  const UserId=await getUserIdAsync(RegisteredBy);
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
    UserId[0].Id,
    OrphanageId[0].Id,
    req.files
  );
  return res.status(200).json({
    success: true,
    message: "successfully created a child profile",
  });
});

export const createStaffProfile = asyncHandler(async (req, res) => {
  const {email,
    username,
    name,
    phoneNumber,
    password,
    OrphanageName,
    address,
    nic,
    gender,
    dob,
    employeeType,}= JSON.parse(req.body.otherInfo);
    
  const O_Id=await getOrphanageIdAsync (OrphanageName);
  const orphanageId=O_Id[0].Id;
  let RoleId; // Declare RoleId here
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: {email,
      username,
      name,
      phoneNumber,
      password,
      orphanageId , 
      address,
      nic,
      gender,
      dob},
  });
  const results = await getUserByEmailAsync(email);
  
  // Check the employeeType and set RoleId accordingly
  if (employeeType === "orphanageManager") {
    RoleId = await getManagerRoleIdAsync();
  } else if(employeeType === "orphanageStaff") {
    RoleId = await getStaffRoleIdAsync();
  }else {
    // If employeeType is neither "orphanageManager" nor "orphanageStaff", return an error message
    return res.status(400).json({
      success: false,
      message: "Invalid employeeType. Must be 'orphanageManager' or 'orphanageStaff'.",
    });
  }
  await createStaffProfileAsync(results[0].Id,req.files);

  
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
  const {email,
    username,
    name,
    phoneNumber,
    password,
    OrphanageName,
    address,
    nic,
    gender,
    dob,
    Category,
    Organization,
    Role,
    Experience,}= JSON.parse(req.body.otherInfo);
  const O_Id=await getOrphanageIdAsync (OrphanageName);
  const orphanageId=O_Id[0].Id;
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: {email,
      username,
      name,
      phoneNumber,
      password,
      orphanageId , 
      address,
      nic,
      gender,
      dob},
  });
  const UserId = await getUserByEmailAsync(email);
  const RoleId = await getSocialWorkerRoleIdAsync();
  await createUserRolesAsync(UserId[0].Id, RoleId[0].Id);
  const results = await createSocialWorkerProfileAsync(
    Category,
    Organization,
    Role,
    Experience,
    UserId[0].Id,
    req.files
  );
  return res.status(200).json({
    success: true,
    message: "successfully created a socialWorker profile",
  });
});

export const createParentProfile = asyncHandler(async (req, res) => {
  const {email,
    username,
    name,
    phoneNumber,
    password,
    OrphanageName,
    address,
    nic,
    gender,
    dob,
    NameOfFather,
    NICOfFather,
    MobileOfFather,
    DOBOfFather,
    OccupationOfFather,
    NameOfMother,
    NICOfMother,
    MobileOfMother,
    DOBOfMother,
    OccupationOfMother,
    Address,
    Email,
    AdoptionPreference,
    AgePreference,
    GenderPreference,
    NationalityPreference,
    LanguagePreference,}= JSON.parse(req.body.otherInfo);
  const O_Id=await getOrphanageIdAsync (OrphanageName);
  const orphanageId=O_Id[0].Id;
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "REGISTER_USER",
    data: {email,
      username,
      name,
      phoneNumber,
      password,
      orphanageId , 
      address,
      nic,
      gender,
      dob},
  });
  const UserId = await getUserByEmailAsync(email);
  const RoleId = await getParentRoleIdAsync();
  await createUserRolesAsync(UserId[0].Id, RoleId[0].Id);
  const results = await createParentProfileAsync(
    NameOfFather,
    NICOfFather,
    MobileOfFather,
    DOBOfFather,
    OccupationOfFather,
    NameOfMother,
    NICOfMother,
    MobileOfMother,
    DOBOfMother,
    OccupationOfMother,
    Address,
    Email,
    AdoptionPreference,
    AgePreference,
    GenderPreference,
    NationalityPreference,
    LanguagePreference,
    UserId[0].Id,
    req.files
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
  const { childId, commitMessage, committedByUserName } = req.body;
  const profileData = await getChildProfileAllDetailsAsync(childId);
  const committedByUserId = await getUserByEmailAsync(committedByUserName);
  const State="DELETED";
  const ApprovalLogId=await createApprovalLogAsync(State, ReviewedBy, req.userInfo.userId); // reviewed by null value
  await childProfileDeleteRequestAsync(ApprovalLogId,childId,commitMessage);
  if (profileData) {
    await CreateProfileVersionAsync(
      childId,
      JSON.stringify(profileData),
      commitMessage,
      committedByUserId[0].Id
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
    OrphanageName,
  } = JSON.parse(req.body.otherInfo);
  const O_Id=await getOrphanageIdAsync (OrphanageName);
  const OrphanageId=O_Id[0].Id;
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
    OrphanageId,
    req.files
  );
  return res.status(200).json({
    success: true,
    message: "successfully edited child profile",
    childProfile: results,
  });
});

export const editStaffProfile = asyncHandler(async (req, res) => {
  const {email,
    id,
    name,
    phoneNumber,
    OrphanageName,
    address,
    nic,
    gender,
    dob,
    }=JSON.parse(req.body.otherInfo)
  const O_Id=await getOrphanageIdAsync (OrphanageName);
  const orphanageId=O_Id[0].Id;
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "UPDATE_USER",
    data: {email,
      name,
      phoneNumber,
      orphanageId , 
      address,
      nic,
      gender,
      dob,
      id},
  });
  const results = await editStaffProfileAsync(req.files,id);
  return res.status(200).json({
    success: true,
    message: "successfully edited staff profile",
  });
});

export const editSocialWorkerProfile = asyncHandler(async (req, res) => { const {email,
  name,
  phoneNumber,
  OrphanageName,
  address,
  nic,
  gender,
  dob,
  Category,
  Organization,
  Role,
  Experience,id,}= JSON.parse(req.body.otherInfo);
const O_Id=await getOrphanageIdAsync (OrphanageName);
const orphanageId=O_Id[0].Id;
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "UPDATE_USER",
    data:  {email,
      name,
      phoneNumber,
      orphanageId , 
      address,
      nic,
      gender,
      dob,id},
  });
  const UserId = await getUserByEmailAsync(email);
  const results = await editSocialWorkerProfileAsync(
    Category,
    Organization,
    Role,
    Experience,
    UserId[0].Id,
    req.files,
  );
  return res.status(200).json({
    success: true,
    message: "successfully edited social worker profile",
  });
});

export const editParentProfile = asyncHandler(async (req, res) => {
  const {email,
    OrphanageName,
    name,
    phoneNumber,
    address,
    nic,
    gender,
    dob,
    id,
    NameOfFather,
    NICOfFather,
    MobileOfFather,
    DOBOfFather,
    OccupationOfFather,
    NameOfMother,
    NICOfMother,
    MobileOfMother,
    DOBOfMother,
    OccupationOfMother,
    Address,
    Email,
    AdoptionPreference,
    AgePreference,
    GenderPreference,
    NationalityPreference,
    LanguagePreference,}= JSON.parse(req.body.otherInfo);
  const O_Id=await getOrphanageIdAsync (OrphanageName);
  const orphanageId=O_Id[0].Id;
  const response = await RPCRequest(AUTH_SERVICE_RPC, {
    event: "UPDATE_USER",
    data: {email,
      name,
      phoneNumber,
      orphanageId , 
      address,
      nic,
      gender,
      dob,
      id},
  });
  const UserId = await getUserByEmailAsync(email);
  const results = await editParentProfileAsync(
    NameOfFather,
    NICOfFather,
    MobileOfFather,
    DOBOfFather,
    OccupationOfFather,
    NameOfMother,
    NICOfMother,
    MobileOfMother,
    DOBOfMother,
    OccupationOfMother,
    Address,
    Email,
    AdoptionPreference,
    AgePreference,
    GenderPreference,
    NationalityPreference,
    LanguagePreference,
    UserId[0].Id,
    req.files
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
  const results = await viewChildProfilesAsync(req.query.childId);
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
    childProfile: formattedChildProfiles[0],
  });
});
export const viewStaffProfile = asyncHandler(async (req, res) => {
  const results = await viewStaffProfileAsync(req.query.staffId);
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
    staffProfile: formattedStaffProfiles[0],
  });
});
export const viewSocialWorkerProfile = asyncHandler(async (req, res) => {
  const results = await viewSocialWorkerProfileAsync(req.query.workerId);
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
    socialWorkerProfile: formattedSocialWorkerProfiles[0],
  });
});
export const viewParentProfile = asyncHandler(async (req, res) => {
  const results = await viewParentProfileAsync(req.query.parentId);
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
    parentProfile: formattedParentProfiles[0],
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


export const createInquiry = asyncHandler(async (req, res) => {
  const{Subject,Description}= req.body;
  const CreatedBy=req.userInfo.userId;
  await createInquiryAsync(CreatedBy,Subject,Description);

  return res.status(200).json({
    success: true,
    message: "successfully created an Inquiry",
  });
});

export const childProfileDeleteRequest = asyncHandler(async (req, res) => {
  const{ChildId,Remark}= req.body;
  const ApprovalId=req.userInfo.userId;
  await childProfileDeleteRequestAsync(ApprovalId,ChildId,Remark);

  return res.status(200).json({
    success: true,
    message: "successfully created childProfileDeleteRequest",
  });
});

export const createFund = asyncHandler(async (req, res) => {
  const{Name, Email, Mobile, TransactionAmount, Description}= req.body;
  const State="CREATED";
  const ApprovalLogId=await createApprovalLogAsync(State, ReviewedBy, req.userInfo.userId); // reviewed by null value
  await createFundAsync(Name, Email, Mobile, TransactionAmount, ApprovalLogId, Description);

  return res.status(200).json({
    success: true,
    message: "successfully created childProfileDeleteRequest",
  });
});