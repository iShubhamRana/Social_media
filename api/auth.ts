import express, { Request, Response } from "express";
import emailValidator from "validator/lib/isEmail";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import UserModal from "../models/UserModel";
import RequestObj from "../types/express/RequestObj";
import authMiddleMare from "../middleware/authMiddleware";
import FollowerModel from "../models/FollowerModel";
import NotificationModel from "../models/NotificationModel";
const router = express.Router();

router.get("/", authMiddleMare, async (req: RequestObj, res: Response) => {
  const { userId } = req;
  try {
    const user = await UserModal.findOne({ _id: userId });
    const userFollowStats = await FollowerModel.findOne({ user: userId });

    return res.status(200).json({ user, userFollowStats });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server Error");
  }
});

//router for login
router.post("/", async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (!emailValidator(email)) return res.status(400).send("Invalid email");
    if (password.length < 6)
      return res.status(401).send("Password must be 6 characters");

    const user = await UserModal.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).send("Invalid Credentials");
    }

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res.status(401).send("Invalid Credentials");
    }

    //create notification model for new user
    const prevNotificationModal = await NotificationModel.findOne({ user: user._id });
    if (!prevNotificationModal) {
      const userNotificationModal = new NotificationModel({
        user: user._id,
        notifications: [],
      });

      await userNotificationModal.save();
    }

    const payload: { userId: Types.ObjectId } = { userId: user._id };
    jwt.sign(payload, "shubham", { expiresIn: "2d" }, (err, token) => {
      if (err) throw err;
      res.status(200).json(token);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
