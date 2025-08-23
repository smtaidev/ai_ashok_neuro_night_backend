
import status from "http-status";
import AppError from "../../errors/AppError";
import mongoose from "mongoose";
import { INotification } from "./notification.intefaction";
import notificationModel from "./notification.model";

// ✅ Create Notification
const createNotificationIntoDb = async (
  companyName: string,
  payload: INotification
) => {
  if (!payload.title || !payload.message || !payload.userId) {
    throw new AppError(status.BAD_REQUEST, "Required fields are missing!");
  }

  const payloadData = { ...payload, companyName };
  const result = await notificationModel.create(payloadData);
  return result;
};

// ✅ Get All Notifications for a Company
const getAllNotificationsFromDb = async (companyName: string) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
  };

  const result = await notificationModel.find(query);
  return result;
};

// ✅ Get Single Notification by ID
const getSingleNotificationFromDb = async (
  companyName: string,
  id: string
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await notificationModel.findOne(query);
  if (!result) {
    throw new AppError(status.NOT_FOUND, "Notification not found!");
  }
  return result;
};

// ✅ Update Notification
const updateNotificationIntoDb = async (
  companyName: string,
  id: string,
  payload: Partial<INotification>
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await notificationModel.findOneAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(status.NOT_FOUND, "Notification not found!");
  }

  return result;
};

// ✅ Delete Notification
const deleteNotificationFromDb = async (
  companyName: string,
  id: string
) => {
  if (!companyName) {
    throw new AppError(status.BAD_REQUEST, "Company name is required!");
  }

  const query = {
    companyName: { $regex: new RegExp(`^${companyName}$`, "i") },
    _id: new mongoose.Types.ObjectId(id),
  };

  const result = await notificationModel.deleteOne(query);
  if (!result.deletedCount) {
    throw new AppError(status.NOT_FOUND, "Notification not found!");
  }

  return result;
};

export const notificationServices = {
  createNotificationIntoDb,
  getAllNotificationsFromDb,
  getSingleNotificationFromDb,
  updateNotificationIntoDb,
  deleteNotificationFromDb,
};
