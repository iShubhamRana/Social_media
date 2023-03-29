import { Types } from "mongoose";
type FollowerObj = {
  user: Types.ObjectId;
  followers: { user: Types.ObjectId }[];
  following: { user: Types.ObjectId }[];
};
 
export default FollowerObj;
