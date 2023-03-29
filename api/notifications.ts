import express, { Request, Response } from "express";

import { Types } from "mongoose";
import UserModal from "../models/UserModel";
import RequestObj from "../types/express/RequestObj";
import authMiddleWare from "../middleware/authMiddleware";
import FollowerModel from "../models/FollowerModel";
import NotificationModel from "../models/NotificationModel";
const router = express.Router();

router.get(
  "/getNotificationModal",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const notificationModal = await NotificationModel.findOne({
        user: userId,
      })
        .populate("notifications.user")
        .populate("notifications.post");

      return res.status(200).send(notificationModal);
    } catch (err) {}
  }
);

router.post(
  "/offunreadNotifications",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const User = await UserModal.findOne({ _id: userId });
      if (!User) {
        return res.status(402).send("No user found");
      }

      User.unreadNotification = false;
      await User.save();
      return res.status(200).send("Action complete");
    } catch (err) {
      return res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
