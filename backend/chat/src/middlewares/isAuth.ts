import type { NextFunction, Request, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

// Define a simple IUser interface which extends Document
interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
}

// Extend the Authenticated Request interface to include user property

export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

// Middleware to check if the user is authenticated
export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get the authorization header from the request

    const authHeader = req.headers.authorization;

    // If no auth header or it doesn't start with "Bearer ", throw an error

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Please login - No Auth header");
    }

    // Extract the token from the header
    const token = authHeader.split(" ")[1];

    // Verify the token and extract the payload

    const decodedToken = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;


    // If token is invalid or doesn't contain user info, throw an error

    if (!decodedToken || !decodedToken.user) {
      throw new ApiError(401, "Invalid token");
    }

    // Attach the user info to the request object for further use
    req.user = decodedToken.user;

    next();
  } catch (error) {
    throw new ApiError(401, "Please Login - JWT error");
  }
};

export default isAuth;