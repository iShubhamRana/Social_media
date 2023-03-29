import mongoose from "mongoose";
import ChatType from "../types/ChatType";
const Schema = mongoose.Schema;

export const ChatSchema = new Schema<ChatType>({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  chatWith: { type: Schema.Types.ObjectId, ref: "User" },
  messages: [
    {
      message: { type: Schema.Types.ObjectId, ref: "Messages" },
    },
  ],
  unreadMessage: { type: Boolean, default: false },
});

export default mongoose.model<ChatType>("Chats", ChatSchema);
