import FetchedUserObj from "./FetchedUserTypes";
import FetchedPostObj from "./FetchedPost";

export type NotificationElement = {
  type: "newLike" | "newComment" | "newFollower";
  user: FetchedUserObj;
  post: FetchedPostObj | null;
  commentId: null | string;
  text: null | String;
  date: Date;
};

type Notification = {
  user: string;
  notifications: NotificationElement[];
};

export default Notification;
