import mongoose from "mongoose";
import NotificationObj from "../types/NotificationType";
const Schema = mongoose.Schema;

const NotificationSchema = new Schema<NotificationObj>({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  notifications: [
    {
      type: { type: String, enum: ["newLike", "newComment", "newFollower"] },
      user: { type: Schema.Types.ObjectId, ref: "User" },
      post: { type: Schema.Types.ObjectId, ref: "Post" },
      commentId: { type: String },
      text: { type: String },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<NotificationObj>(
  "Notification",
  NotificationSchema
);
