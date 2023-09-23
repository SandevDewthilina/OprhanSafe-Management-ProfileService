import asyncHandler from "express-async-handler";
import {
  getChildProfilesAsync,
} from "../services/profileService.js";
import { notFound } from "../middleware/errorMiddleware.js";


// @desc notification broadcast
// route POST /api/notifications/broadcast
// @access Private
export const getChildProfileList = asyncHandler(async (req, res) => {
  // run query
  const results = await getChildProfilesAsync();
  // return response
  return res.status(200).json({
    success: true,
    childProfiles: results
  })
});