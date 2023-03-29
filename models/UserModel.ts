import mongoose, { Types } from "mongoose";
import UserObj from "../types/UserType";

const Schema = mongoose.Schema;

const userSchema = new Schema<UserObj>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false }, //doesnt wanna show it as default when searching
    username: { type: String, required: true, trim: true, unique: true },
    profilePicUrl: { type: String },
    newMessagePopup: { type: Boolean, default: true },
    unreadMessage: { type: Boolean, default: false },
    unreadNotification: { type: Boolean, default: false },
    role: { type: String, default: "user", enum: ["user", "root"] },
    resetToken: { type: String },
    expireToken: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model<UserObj>("User", userSchema);
