import { model, Schema } from "mongoose";
import { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const userSchema = new Schema<IUser>(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String ,default:"vtemporary-initial"},
    companyName: { type: String, required: true },
    companyRole: { type: String, required: true},
    isSubscribed: { type: Boolean, required: true, default: false },
    planExpiration: { type: Date, required: false },
    foundationId: { type: Schema.Types.ObjectId, default: null },
    role: {
      type: String,
      enum: ["companyAdmin"],
      default: "companyAdmin",
      required: true,
    },
    isDeleted: { type: Boolean, default: true },
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


const clarhetSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true},
    password: { type: String ,default:"vtemporary-initial"},
    role: {
      type: String,
      enum: ["finance", "superAdmin", "ops","support"],  
      default: "support",
      required: true,
    },
    isDeleted: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const  ClarhetModel= model("clarhet-store",clarhetSchema)