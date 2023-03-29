import { Types } from "mongoose";

export type FetchedMessage = {
  msg: string;
  sender: string;
  receiver: string;
  date: Date;
  _id: string;
};

type Message = {
  msg: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  deletedBySender: boolean;
  deletedByReceiver: boolean;
  date: Date;
};
export default Message;
