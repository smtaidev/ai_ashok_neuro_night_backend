import status from "http-status";
import bcrypt from "bcrypt";
import AppError from "../../errors/AppError";
import { IAuth, IJwtPayload } from "../../types/userAuthTypes";
import { createToken } from "../../utils/auth.utils";
import config from "../../../config";
import { JwtPayload } from "jsonwebtoken";
import UserModel, { ClarhetModel } from "../user/user.model";
import { organizationUserModels } from "../organization-role/organization-role.model";

const loginUserIntoDB = async (payload: IAuth) => {
  const { email, password } = payload;

  const user = await UserModel.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError(
      status.NOT_FOUND,
      "User with this email does not exist!"
    );
  }


  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Incorrect password!");
  }

  const jwtPayload: IJwtPayload = {
    userId:user._id ,
    email: user.email as string,
    userName: user.userName,
    role: user.role,
    companyName: user?.companyName,
    companyRole: user.companyRole
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

const organizationUser = async (payload: IAuth) => {
  const { email, password } = payload;

  const user = await organizationUserModels.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError(
      status.NOT_FOUND,
      "User with this email does not exist!"
    );
  }


  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Incorrect password!");
  }

  const jwtPayload: IJwtPayload = {
    userId:user._id ,
    email: user.email as string,
    userName: user.userName,
    role: user.role,
    companyName: user?.companyName,
    companyRole: user.companyRole
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};
const clarhetUserLogin = async (payload: IAuth) => {
  const { email, password } = payload;

  const user = await ClarhetModel.findOne({ email, isDeleted: false });
  if (!user) {
    throw new AppError(
      status.NOT_FOUND,
      "User with this email does not exist!"
    );
  }


  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(status.UNAUTHORIZED, "Incorrect password!");
  }

  const jwtPayload = {
    userId:user._id ,
    email: user.email as string,
    userName: user.userName,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string
  );

  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUserIntoDB,
  organizationUser,
  clarhetUserLogin
};
