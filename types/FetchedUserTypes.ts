import UserObj from "./UserType";
import { Types } from "mongoose";

type FetchedUserObj = {
  name: string;
  email: string;
  password?: string;
  username: string;
  profilePicUrl: string;
  newMessagePopup: boolean;
  unreadMessage: boolean;
  unreadNotification: boolean;
  role: string;
  resetToken?: string;
  expireToken?: string;
  _id: string;
};

export default FetchedUserObj;
