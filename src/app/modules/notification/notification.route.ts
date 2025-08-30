import express from "express";
import auth from "../../middlewares/auth";
import { notificationControllers } from "./notification.contllors";


const router = express.Router();

// ✅ Create Notification
router.post(
  "/create-notification",
  auth(),
  notificationControllers.createNotificationIntoDb
);

// ✅ Get All Notifications
router.get(
  "/get-all-notifications",
  auth("companyAdmin","companyEmployee"),
  notificationControllers.getAllNotificationsFromDb
);

// ✅ Get Single Notification
router.get(
  "/:id",
  auth("companyAdmin","companyEmployee"),
  notificationControllers.getSingleNotificationFromDb
);

// ✅ Update Notification
router.patch(
  "/:id",
  auth("companyAdmin","companyEmployee"),
  notificationControllers.updateNotificationIntoDb
);

// ✅ Delete Notification
router.delete(
  "/:id",
  auth("companyAdmin","companyEmployee"),
  notificationControllers.deleteNotificationFromDb
);

export const NotificationRoute = router;
