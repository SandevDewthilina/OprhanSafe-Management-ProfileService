import jwt from "jsonwebtoken";
import { JWT_SECRET, NODE_ENV, APP_PASS_SECRET } from "../config/index.js";

const generatePassword = async (originalPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(originalPassword, salt);
};


const verifyJWT = (token) => {
  return jwt.verify(token, JWT_SECRET)
};

const verifyAppPassToken = (token) => {
  return token === APP_PASS_SECRET;
}

export {verifyJWT, verifyAppPassToken,generatePassword };
