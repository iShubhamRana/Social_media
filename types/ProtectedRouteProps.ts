import UserObj from "./UserType";
import FollowerObj from "./FollowerType";
import FetchedUserObj from "./FetchedUserTypes";
import { Types } from "mongoose";

type ProtectedRouteProps = {
  user: FetchedUserObj | null;
  isProtected: boolean;
};

export default ProtectedRouteProps;
