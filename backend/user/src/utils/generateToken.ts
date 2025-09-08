import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// get jwt secret from env
const JWT_SECRET = process.env.JWT_SECRET as string;

// generate a jwt token
export const generateToken = (user: any) => {
  // sign the user object with the secret and set an expiration time of 15 days
  return jwt.sign({ user }, JWT_SECRET, { expiresIn: "15d" });
};
