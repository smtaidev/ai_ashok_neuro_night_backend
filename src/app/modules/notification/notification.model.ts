
import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    companyName:{type: String,
      required: true},
    userId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true, 
    },
    message: {
      type: String,
      required: true, 
    },
    type: {
      type: String,
      enum: ["info", "warning", "success", "error"], 
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, 
  }
);

export default mongoose.model("Notification", notificationSchema);
