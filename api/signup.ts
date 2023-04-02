import express, { Request, Response } from "express";
const router = express.Router();

import UserModal from "../models/UserModel";
import ProfileModel from "../models/ProfileModel";
import FollowerModel from "../models/FollowerModel";
import NotificationModel from "../models/NotificationModel";
import UserObj from "../types/UserType";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailValidator from "validator/lib/isEmail";
import userPng from "../utilsServer/userPng";
import { Types } from "mongoose";

const regexUserName: RegExp = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

router.get("/:username", async (req: Request, res: Response) => {
  let { username } = req.params;
  try {
    username = username.trim();
    if (username.length < 1 || !regexUserName.test(username)) {
      return res.status(401).send("invalid username");
    }

    const user: UserObj | null = await UserModal.findOne({
      username: username.toLowerCase(),
    });

    if (user) {
      return res.status(401).send("Username Already Taken");
    }
    return res.status(200).send("Username Available");
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

router.post("/", async (req: Request, res: Response) => {
  const User: UserObj = req.body.user;
  try {
    if (!emailValidator(User.email))
      return res.status(400).send("Invalid email");
    if (User.password.length < 6)
      return res.status(401).send("Password must be 6 characters");

    const user: UserObj | null = await UserModal.findOne({
      email: User.email.toLowerCase(),
    });

    if (user) {
      return res.status(401).send("Email already taken");
    }
    const newUser = new UserModal({
      name: User.name,
      email: User.email.toLowerCase(),
      username: User.username.toLowerCase(),
      password: User.password,
      profilePicUrl: User.profilePicUrl === "*" ? userPng : User.profilePicUrl,
    });

    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();

    let profileFields = { user: newUser._id };
    await new ProfileModel(profileFields).save();
    await new FollowerModel({
      user: newUser._id,
      followers: [],
      following: [],
    }).save();

    //notification modal
    const userNotificationModal = new NotificationModel({
      user: newUser._id,
      notifications: [],
    });

    await userNotificationModal.save();

    const payload: { userId: Types.ObjectId } = { userId: newUser._id };
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
