import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { notificationServices } from "./notification.services";


// ✅ Create Notification
const createNotificationIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await notificationServices.createNotificationIntoDb(
    company?.companyName,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification created successfully",
    data: result,
  });
});

// ✅ Get All Notifications
const getAllNotificationsFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const result = await notificationServices.getAllNotificationsFromDb(
    company?.companyName
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All Notifications retrieved successfully",
    data: result,
  });
});

// ✅ Get Single Notification by ID
const getSingleNotificationFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await notificationServices.getSingleNotificationFromDb(
    company?.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification retrieved successfully",
    data: result,
  });
});

// ✅ Update Notification
const updateNotificationIntoDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await notificationServices.updateNotificationIntoDb(
    company?.companyName,
    id,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification updated successfully",
    data: result,
  });
});

// ✅ Delete Notification
const deleteNotificationFromDb = catchAsync(async (req, res) => {
  const company = req.user;
  const { id } = req.params;

  const result = await notificationServices.deleteNotificationFromDb(
    company?.companyName,
    id
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});

export const notificationControllers = {
  createNotificationIntoDb,
  getAllNotificationsFromDb,
  getSingleNotificationFromDb,
  updateNotificationIntoDb,
  deleteNotificationFromDb,
};
