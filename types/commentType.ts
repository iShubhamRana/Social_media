import { Types } from "mongoose";
type commentObj = {
  _id: string;
  user: Types.ObjectId;
  text: string;
  date: number;
};

export default commentObj;
