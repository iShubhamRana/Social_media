import { Types } from "mongoose";

export type NotificationElement = {
  type: "newLike" | "newComment" | "newFollower";
  user: Types.ObjectId;
  post: null | Types.ObjectId;
  commentId: null | string;
  text: null | String;
  date: Date;
};

type Notification = {
  user: Types.ObjectId;
  notifications: NotificationElement[];
};

export default Notification;
