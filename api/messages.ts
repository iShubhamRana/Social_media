import express, { Request, Response } from "express";

import mongoose, { Types } from "mongoose";
import UserModel from "../models/UserModel";
import RequestObj from "../types/express/RequestObj";
import authMiddleWare from "../middleware/authMiddleware";
import FollowerModel from "../models/FollowerModel";
import NotificationModel from "../models/NotificationModel";
import MessageModel from "../models/MessageModel";
import ChatModel from "../models/ChatModel";
import { findChatModel } from "../utilsServer/chatHelper";
import Chat from "../types/ChatType";
import FetchedUserObj from "../types/FetchedUserTypes";
import Message from "../types/MessageModalType";
const router = express.Router();

router.get(
  "/getAllChats",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId } = req;
      const chats = await ChatModel.find({ owner: userId })
        .populate<{ chatWith: FetchedUserObj }>("chatWith")
        .populate<{ messages: { message: Message }[] }>("messages.message");

      if (!chats) {
        throw new Error("chat not found");
      }

      //filter the chats to only show last message
      const filteredChats = chats.map((chat) => {
        return {
          chat_id: chat._id,
          chatWith_id: chat.chatWith._id,
          chatWith_profilePicUrl: chat.chatWith.profilePicUrl,
          chatWith_username: chat.chatWith.username,
          lastMessage:
            chat.messages.length >= 1
              ? chat.messages[chat.messages.length - 1].message.msg
              : " ",
          hasUnreadMessage: chat.unreadMessage,
          date:
            chat.messages.length >= 1
              ? chat.messages[chat.messages.length - 1].message.date
              : Date.now(),
        };
      });

      return res.status(200).send(filteredChats);
    } catch (err) {
      console.log(err);
      return res.status(500).send("Server error");
    }
  }
);

router.post(
  "/createChat",
  authMiddleWare,
  async (req: RequestObj, res: Response) => {
    try {
      const { userId: owner } = req;
      const { chatWith } = req.body;

      await findChatModel(
        new mongoose.Types.ObjectId(owner),
        new mongoose.Types.ObjectId(chatWith)
      );

      return res.status(200).send("ok");
    } catch (err) {
      console.log(err);
      return res.status(500).send("server error");
    }
  }
);

module.exports = router;
