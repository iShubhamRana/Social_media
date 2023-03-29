import { Types } from "mongoose";
import Message, { FetchedMessage } from "./MessageModalType";
import FetchedUserObj from "./FetchedUserTypes";

type Chat = {
  owner: Types.ObjectId;
  chatWith: Types.ObjectId;
  messages: { message: Types.ObjectId }[];
  unreadMessage: boolean;
};

export type FetchedChat = {
  owner: FetchedUserObj;
  chatWith: FetchedUserObj;
  messages: { message: FetchedMessage }[];
  unreadMessage: boolean;
};

export default Chat;
