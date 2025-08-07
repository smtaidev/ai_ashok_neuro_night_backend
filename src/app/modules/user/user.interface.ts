import { Types } from "mongoose";

export interface IUser {
  userName: string;
  email: string;
  password: string;
  companyName: string;
  foundationId: Types.ObjectId;
  companyRole: string;
  role: "companyAdmin" | "superAdmin" | "companyEmployee";
  isDeleted: boolean;
}
