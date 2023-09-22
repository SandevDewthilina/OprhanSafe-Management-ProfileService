import asyncHandler from "express-async-handler";
import DatabaseHandler from "../lib/database/DatabaseHandler.js";
import {
  broadcastNotification,
} from "../services/profileService.js";


// @desc notification broadcast
// route POST /api/notifications/broadcast
// @access Private
export const broadcast = asyncHandler(async (req, res) => {
  const response = await broadcastNotification(req.body);
  return res
    .status(200)
    .json({ success: true, results: response });
});