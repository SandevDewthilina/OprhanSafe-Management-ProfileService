import asyncHandler from "express-async-handler";
import {
  getChildProfilesAsync, getStaffProfileListAsync,getSocialWorkerProfileListAsync,
  getParentProfileListAsync,
} from "../services/profileService.js";
import { notFound } from "../middleware/errorMiddleware.js";


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
    if (profile["DateOfBirth"]) {
      const dateOfBirthTimestamp = new Date(profile["DateOfBirth"]);
      const datePart = dateOfBirthTimestamp.toISOString().split("T")[0];
      profile["DateOfBirth"] = datePart;
    }
    return profile;
  });

  return res.status(200).json({
    success: true,
    childProfiles: formattedChildProfiles,
    
  })
});

export const getStaffProfileList = asyncHandler(async(req,res)=>{
  const results = await getStaffProfileListAsync();
  return res.status(200).json({
    success:true,
    staffProfiles:results
  })
});

export const getSocialWorkerProfileList = asyncHandler(async(req,res)=>{
  const results = await getSocialWorkerProfileListAsync();
  return res.status(200).json({
    success:true,
    socialWorkerProfiles:results
  })
});

export const getParentProfileList = asyncHandler(async(req,res)=>{
  const results = await getParentProfileListAsync();
  return res.status(200).json({
    success:true,
    parentsProfiles:results
  })
});

/**
 * Create Profiles
 */

