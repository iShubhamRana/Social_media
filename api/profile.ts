import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import  { Types } from "mongoose";
import UserModal from "../models/UserModel";
import RequestObj from "../types/express/RequestObj";
import authMiddleWare from "../middleware/authMiddleware";
import FollowerModel from "../models/FollowerModel";
import ProfileModel from "../models/ProfileModel";
import { newFollowerNotification } from "../utilsServer/notificationAction";
import UserModel from "../models/UserModel";

const router = express.Router();

router.get(
  "/:username",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    const { userId } = req;
    const { username } = req.params;

    try {
      const user = await UserModal.findOne({
        username: username.toLowerCase(),
      });
      if (!user) {
        return res.status(404).send("User not found");
      }

      const profile = await ProfileModel.findOne({ user: user._id }).populate(
        "user"
      );

      const profileFollowStats = await FollowerModel.findOne({
        user: user._id,
      });
      return res.status(200).json({
        profile,
        followers: profileFollowStats?.followers,
        following: profileFollowStats?.following,
      });
    } catch (err) {
      res.send(500).send("Server error");
    }
  }
);

router.get("/followers/:userId", authMiddleWare, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId }).populate(
      "followers.user"
    );
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

router.get("/following/:userId", authMiddleWare, async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await FollowerModel.findOne({ user: userId }).populate(
      "following.user"
    );
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

router.post(
  "/addFollower",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const followedUser = req.body.to;

      const user = await FollowerModel.findOne({ user: userId });
      const userToFollow = await FollowerModel.findOne({ user: followedUser });

      if (!user || !userToFollow) {
        return res.status(404).send("User Not Found");
      }

      const isFollowing = user.following.find((itfollows) =>
        itfollows.user.equals(followedUser as Types.ObjectId)
      );
      

      if (isFollowing) {
        return res.status(401).send("User Already followed");
      }

      user.following.unshift({ user: followedUser });
      await user.save();

      userToFollow.followers.unshift({ user: userId as Types.ObjectId });
      await userToFollow.save();

      newFollowerNotification(userId as Types.ObjectId, userToFollow.user);

      return res.status(200).send("Followed successfully");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }
  }
);

router.post(
  "/removeFollower",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const followedUser = req.body.to;

      const user = await FollowerModel.findOne({ user: userId });
      const userToFollow = await FollowerModel.findOne({ user: followedUser });

      if (!user || !userToFollow) {
        return res.status(404).send("User Not Found");
      }

      const isFollowing = user.following.find((itfollows) =>
        itfollows.user.equals(followedUser as Types.ObjectId)
      );
      if (!isFollowing) {
        return res.status(401).send("User Not Followed");
      }

      user.following = user.following.filter(
        (itfollows) => !itfollows.user.equals(followedUser)
      );

      await user.save();
      userToFollow.followers = userToFollow.followers.filter(
        (itfollows) => !itfollows.user.equals(userId as Types.ObjectId)
      );

      await userToFollow.save();

      return res.status(200).send("Unfollowed successfully");
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }
  }
);

router.get(
  "/getfollowstats/:userId",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    const { userId } = req.params;

    try {
      const followstats = await FollowerModel.findOne({ user: userId });
      if (!followstats) {
        return res.status(404).send("User Not Found");
      }

      return res.status(200).json(followstats);
    } catch (err) {
      console.log(err);
    }
  }
);

router.put(
  "/updateProfile",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { profilepic, bio, instagram, twitter, youtube } = req.body;
      const { userId } = req;

      const profile = await ProfileModel.findOne({ user: userId });
      const user = await UserModal.findOne({ _id: userId });

      if (!profile || !user) {
        return res.status(404).send("Profile not found");
      }

      profile.bio = bio;
      profile.social.instagram = instagram;
      profile.social.youtube = youtube;
      profile.social.twitter = twitter;
      await profile.save();

      console.log(profile);

      user.profilePicUrl = profilepic;
      await user.save();

      return res.status(200).send("Profile Updated Successfully");
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

router.put(
  "/changePassword",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const user = await UserModal.findOne({
        _id: userId,
      }).select("+password");

      if (!user) {
        return res.status(401).send("User not found");
      }

      const isPassword = await bcrypt.compare(oldPassword, user.password);
      if (!isPassword) {
        return res.status(401).send("Invalid Password");
      }
      // console.log(newPassword , oldPassword)
      if (newPassword !== confirmPassword) {
        return res
          .status(401)
          .send("New password and confirmed password does not match");
      }

      user.password = await bcrypt.hash(newPassword, 10);

      await user.save();
      return res.status(200).send("Password Changed Successfully!");
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

router.put(
  "/allowPopup",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const { allowed } = req.body;

      const user = await UserModal.findOne({ _id: userId });
      if (!user) {
        return res.status(402).send("Invalid user");
      }

      user.newMessagePopup = allowed;
      await user.save();
      return res.status(200).send("Successfully updated ");
    } catch (err) {
      return res.status(500).send("Server error");
    }
  }
);

router.get("/getUserInfo/:userId", async (req: RequestObj, res: Response) => {
  try {
    const { userId } = req.params;
    const User = await UserModel.findOne({ _id: userId });
    if (!User) {
      throw new Error("no user found");
    }
    const info = {
      username: User.username,
      profilepic: User.profilePicUrl,
    };
    return res.status(200).send(info);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Server error");
  }
});

module.exports = router;
