

// export default auth;
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt, { JwtPayload, TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import config from "../../config";

import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import UserModel, { ClarhetModel } from "../modules/user/user.model";
import mongoose from "mongoose";
import { organizationUserModels } from "../modules/organization-role/organization-role.model";


export type TUserRole = 'companyAdmin' | 'superAdmin' | "companyEmployee";


const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    // Normalize token (handle "Bearer <token>" or raw token)
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "No authorization token provided");
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7); // Remove "Bearer " prefix
    }

    // Verify token
    let decoded: JwtPayload;

    try {
      decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;
      console.log(decoded)
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Token has expired");
      }
      if (error instanceof JsonWebTokenError) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token");
      }
      throw new AppError(httpStatus.UNAUTHORIZED, "Token verification failed");
    }

    const { role, email,userId } = decoded;

    console.log("logged in user: ",decoded)

if (!mongoose.Types.ObjectId.isValid(userId)) {
  throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID from token");
}
    // Check if user exists
    const user = await UserModel.findOne({email}) || await organizationUserModels.findOne({email}) || await ClarhetModel.findOne({email})
    console.log (user)
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    // Check if user is deleted
    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "User is deleted");
    }

    // Check role
    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Insufficient role permissions");
    }

    req.user = decoded as JwtPayload & { role: string };
    next();
  });
};

export default auth;