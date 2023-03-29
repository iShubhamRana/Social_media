import mongoose from "mongoose";

import MessageType from "../types/MessageModalType";
const Schema = mongoose.Schema;

export const MessageSchema = new Schema<MessageType>({
  sender: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  msg: { type: String },
  date: { type: Date },
  deletedBySender: { type: Boolean, default: false, select: false },
  deletedByReceiver: { type: Boolean, default: false, select: false },
});

export default mongoose.model<MessageType>("Messages", MessageSchema);
