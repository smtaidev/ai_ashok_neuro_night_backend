import { Types } from "mongoose";

export interface INotification {
  companyName: string;
  userId: Types.ObjectId; 
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  isRead: boolean;
  createdAt?: Date; 
  updatedAt?: Date; }
