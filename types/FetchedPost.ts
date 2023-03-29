import { Types } from "mongoose";
import FetchedUserObj from "./FetchedUserTypes";
type PostObj = {
  _id: string;
  user: FetchedUserObj;
  text: string;
  location: string;
  picUrl: string;
  likes: FetchedUserObj[];
  comments: {
    _id: string;
    user: FetchedUserObj;
    text: string;
    date:Date
  }[];
};
export default PostObj;
