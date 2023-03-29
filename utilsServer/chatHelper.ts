import mongoose, { Types, Document, InferSchemaType } from "mongoose";
import ChatModel, { ChatSchema } from "../models/ChatModel";
import { FetchedMessage } from "../types/MessageModalType";
import MessageModel, { MessageSchema } from "../models/MessageModel";
import UserModel from "../models/UserModel";
import FetchedUserObj from "../types/FetchedUserTypes";
import { FetchedChat } from "../types/ChatType";

//the return type is a document of type schema
type ChatModelReturnType = InferSchemaType<typeof ChatSchema> & Document;
// type MessageReturnType = FetchedMessage & Document;

export const createNewChat = async (
  owner: Types.ObjectId,
  chatWith: Types.ObjectId
): Promise<ChatModelReturnType | null> => {
  try {
    const newChatModal = new ChatModel({
      owner,
      chatWith,
      messages: [],
      unreadMessage: false,
    });
    await newChatModal.save();
    return newChatModal;
  } catch (err) {
    return null;
  }
};

export const findChatModel = async (
  owner: Types.ObjectId,
  chatWith: Types.ObjectId
): Promise<ChatModelReturnType | null> => {
  try {
    const ExistingChatModal = await ChatModel.findOne({
      owner,
      chatWith,
    });
    if (ExistingChatModal) return ExistingChatModal;
    return await createNewChat(owner, chatWith);
  } catch (err) {
    return null;
  }
};

export const loadMessages = async (
  owner: string,
  chatWith: string
): Promise<FetchedChat | null> => {
  try {
    await findChatModel(
      new mongoose.Types.ObjectId(owner),
      new mongoose.Types.ObjectId(chatWith)
    );

    const chat = await ChatModel.findOne({ owner, chatWith })
      .populate<{
        messages: { message: FetchedMessage }[];
      }>("messages.message")
      .populate<{ chatWith: FetchedUserObj }>("chatWith")
      .populate<{ owner: FetchedUserObj }>("owner");

    if (!chat) throw new Error("No chat found");
    return chat;
  } catch (err) {
    return null;
  }
};

export const sendMessage = async (
  owner: string,
  chatWith: string,
  text: string
): Promise<FetchedMessage | null> => {
  try {
    const senderChatModel = await findChatModel(
      new mongoose.Types.ObjectId(owner),
      new mongoose.Types.ObjectId(chatWith)
    );

    const receiverChatModel = await findChatModel(
      new mongoose.Types.ObjectId(chatWith),
      new mongoose.Types.ObjectId(owner)
    );

    //rare situation and is definitely a server error
    if (!senderChatModel || !receiverChatModel) {
      throw new Error("Server error");
    }

    const newMessage = new MessageModel({
      msg: text,
      sender: owner,
      receiver: chatWith,
      date: Date.now(),
    });
    await newMessage.save();

    senderChatModel.messages.push({ message: newMessage._id });
    receiverChatModel.messages.push({ message: newMessage._id });
    receiverChatModel.unreadMessage = true;

    await senderChatModel.save();
    await receiverChatModel.save();

    return {
      sender: owner,
      receiver: chatWith,
      date: newMessage.date,
      _id: newMessage._id.toString(),
      msg: text,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const setMessageToUnread = async (userId: string) => {
  try {
    const User = await UserModel.findOne({ _id: userId });
    if (!User) {
      throw new Error("User not found");
    }
    console.log(User);
    User.unreadMessage = true;
    await User.save();
  } catch (err) {
    console.log(err);
  }
};

export const markChatRead = async (owner: string, chatWith: string) => {
  try {
    const Chat = await ChatModel.findOne({ owner, chatWith });
    if (!Chat) throw new Error("Chat not found");

    Chat.unreadMessage = false;
    await Chat.save();
    return;
  } catch (err) {
    console.log(err);
  }
};

export const markMessagesRead = async (userId: string) => {
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw new Error("User not found");
    }
    user.unreadMessage = false;
    await user.save();
  } catch (err) {
    console.log(err);
  }
};

export const deleteMessage = async (
  owner: string,
  chatWith: string,
  messageId: string
): Promise<boolean> => {
  //we don't want to delete it from the document as the other person may have deleted the document;
  try {
    const message = await MessageModel.findOne({ _id: messageId })
      .select("+deletedBySender")
      .select("+deletedByReceiver");

    const Chat = await ChatModel.findOne({ owner, chatWith });
    if (!Chat) {
      throw new Error("message not found");
    }

    const index = Chat.messages.findIndex(
      (e) => e.message.toString() === messageId
    );

    if (index == -1) {
      throw new Error("message not found");
    }

    Chat.messages = Chat.messages.filter((e, idx) => {
      return idx != index;
    });

    await Chat.save();

    //first confirm if the message model has been deleted by both the sender and receiver modesls
    if (!message) {
      throw new Error("message not found");
    }

    if (message.sender.toString() === owner) {
      message.deletedBySender = true;
    } else {
      message.deletedByReceiver = true;
    }

    if (message.deletedBySender && message.deletedByReceiver) {
      await MessageModel.deleteOne({ _id: messageId });
    } else {
      await message.save();
    }

    //remove from the model of the person who requested deleted
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const deleteChat = async (
  owner: string,
  chatWith: string
): Promise<boolean> => {
  try {
    const Chat = await ChatModel.findOne({ owner, chatWith });
    if (!Chat) {
      throw new Error("Chat not found");
    }

    for (let msg of Chat.messages) {
      await deleteMessage(owner, chatWith, msg.message._id.toString());
    }

    await ChatModel.deleteOne({ owner, chatWith });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export default createNewChat;
