import jwt from "jsonwebtoken";
import config from "../../config";
import bcrypt from "bcrypt";

export const createPasswordSetupToken = (payload: { userId: string; email: string }) => {
  return jwt.sign(payload, config.jwt_password_setup_secret as string, { expiresIn: "12h" });
};

export const verifyPasswordSetupToken = (token: string) => {
  return jwt.verify(token, config.jwt_password_setup_secret as string) as { userId: string; email: string; iat: number; exp: number };
};



export const hashPassword = async (plain: string) => {
  const saltRounds = 12;
  return bcrypt.hash(plain, saltRounds);
};