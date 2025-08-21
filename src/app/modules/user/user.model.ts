import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    companyRole: { type: String, required: true, default: null },
    isSubscribed: { type: Boolean, required: true, default: false },
    planExpiration: { type: Date, required: false },
    foundationId: { type: Schema.Types.ObjectId, default: null },
    role: {
      type: String,
      enum: ["companyAdmin", "superAdmin", "companyEmployee"],
      default: "companyEmployee",
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Create the model
const UserModel = model<IUser>("User", userSchema);

export default UserModel;
