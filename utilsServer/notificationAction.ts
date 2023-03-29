import UserModal from "../models/UserModel";
import NotificationModal from "../models/NotificationModel";
import { NotificationElement } from "../types/NotificationType";
import { Types } from "mongoose";

export const setNotificationUnread = async (userId: Types.ObjectId) => {
  try {
    const User = await UserModal.findOne({ _id: userId });

    if (!User) {
      throw new Error("User not found");
    }

    if (!User.unreadNotification) {
      User.unreadNotification = true;
      await User.save();
    }
    return;
  } catch (err) {
    console.log(err);
  }
};

export const newLikeNotification = async (
  userLiking: Types.ObjectId,
  postId: Types.ObjectId,
  postAuthorId: Types.ObjectId
) => {
  try {
    // if(userLiking)
    const postauthor = await NotificationModal.findOne({ user: postAuthorId });
    if (!postauthor) {
      throw new Error("Author not found");
    }
    const newNotification: NotificationElement = {
      user: userLiking,
      type: "newLike",
      post: postId,
      commentId: null,
      text: null,
      date: new Date(),
    };
    postauthor.notifications.unshift(newNotification);
    await postauthor.save();
    await setNotificationUnread(postAuthorId);
  } catch (err) {
    console.log(err);
  }
};

export const removeLikeNotification = async (
  userLiking: Types.ObjectId,
  postId: Types.ObjectId,
  postAuthorId: Types.ObjectId
) => {
  try {
    const postAuthor = await NotificationModal.findOne({ user: postAuthorId });
    if (!postAuthor) {
      throw new Error("Post author not found");
    }

    const notificationToFind = postAuthor.notifications.findIndex(
      (notification) =>
        notification.user.equals(userLiking) &&
        notification.post !== null &&
        notification.post.equals(postId) &&
        notification.type === "newLike"
    );

    postAuthor.notifications = postAuthor.notifications.filter(
      (post, index) => {
        return index !== notificationToFind;
      }
    );

    await postAuthor.save();
  } catch (err) {
    console.log(err);
  }
};

export const newCommentNotification = async (
  userCommenting: Types.ObjectId,
  postId: Types.ObjectId,
  postAuthorId: Types.ObjectId,
  commentId: string,
  text: string
) => {
  try {
    const postAuthor = await NotificationModal.findOne({ user: postAuthorId });
    if (!postAuthor) {
      throw new Error("Post author not found");
    }
    const newNotification: NotificationElement = {
      user: userCommenting,
      type: "newComment",
      post: postId,
      commentId: commentId,
      text: text,
      date: new Date(),
    };

    postAuthor.notifications.unshift(newNotification);
    await postAuthor.save();

    await setNotificationUnread(postAuthorId);
  } catch (err) {
    console.log(err);
  }
};

export const removeCommentNotification = async (
  userCommenting: Types.ObjectId,
  postId: Types.ObjectId,
  postAuthorId: Types.ObjectId,
  commentId: string
) => {
  try {
    const postAuthor = await NotificationModal.findOne({ user: postAuthorId });
    if (!postAuthor) {
      throw new Error("Post author not found");
    }

    const notificationToFind = postAuthor.notifications.findIndex(
      (notification) =>
        notification.user.equals(userCommenting) &&
        notification.post !== null &&
        notification.post.equals(postId) &&
        notification.type === "newComment" &&
        notification.commentId === commentId
    );
    postAuthor.notifications = postAuthor.notifications.filter(
      (post, index) => {
        return index !== notificationToFind;
      }
    );

    await postAuthor.save();
  } catch (err) {
    console.log(err);
  }
};

export const newFollowerNotification = async (
  userId: Types.ObjectId,
  userToNotifyId: Types.ObjectId
) => {
  try {
    //userId is actually string , changing it would cause bugs
    const UsertoNotify = await NotificationModal.findOne({
      user: userToNotifyId,
    });
    if (!UsertoNotify) {
      throw new Error("Post author not found");
    }
    const newNotification: NotificationElement = {
      user: userId,
      type: "newFollower",
      post: null,
      commentId: null,
      text: null,
      date: new Date(),
    };

    UsertoNotify.notifications.unshift(newNotification);
    UsertoNotify.save();
    await setNotificationUnread(userToNotifyId);
  } catch (err) {
    console.log(err);
  }
};
