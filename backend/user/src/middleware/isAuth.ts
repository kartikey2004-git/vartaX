import type { NextFunction, Request, Response } from "express";
import type { IUser } from "../model/UserModel.js";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

// Extend the Request interface to include user property
export interface AuthenticatedRequest extends Request {
  user?: IUser | null;
}

// Middleware to check if user is authenticated
export const isAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    // check if token is present or starts with Bearer
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Please Login - No auth header");
    }

    // Extract token from authorization header
    const token = authHeader.split(" ")[1];

    // verify the jwt token with help of jwt secret and get decoded token
    const decodedToken = jwt.verify(
      token as string,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    // check if decoded token is valid and has user property
    if (!decodedToken || !decodedToken.user) {
      throw new ApiError(401, "Invalid token");
    }

    // Attach user information to the request object
    req.user = decodedToken.user;

    next();
  } catch (error) {
    throw new ApiError(401, "Please Login - Invalid token");
  }
};