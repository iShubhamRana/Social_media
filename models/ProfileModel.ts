import mongoose from "mongoose";
import ProfileObj from "../types/ProfileType";
const Schema = mongoose.Schema;

const ProfileSchema = new Schema<ProfileObj>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
    bio: { type: String, default: "I belong to Genzee" },
    social: {
      youtube: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ProfileObj>("Profile", ProfileSchema);
