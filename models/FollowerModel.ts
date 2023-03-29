import mongoose from "mongoose";
import FollowerObj from "../types/FollowerType";
const Schema = mongoose.Schema;

const FollowerSchema = new Schema<FollowerObj>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  followers: {
    type: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    default: [],
    required: true,
  },
  following: {
    type: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
      },
    ],
    default: [],
    required: true,
  },
});

export default mongoose.model<FollowerObj>("Follower", FollowerSchema);
