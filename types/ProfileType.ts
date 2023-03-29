import { Types } from "mongoose";
type ProfileObj = {
  user: Types.ObjectId;
  bio: string;
  social: {
    youtube: string;
    instagram: string;
    twitter: string;
  };
};
export default ProfileObj;
