import { Types } from "mongoose";
import commentObj from "./commentType";
type PostObj = {
  user: Types.ObjectId;
  text: string;
  location: string;
  picUrl: string;
  likes: Types.ObjectId[];
  comments: commentObj[];
};
export default PostObj;
