import { Types } from "mongoose";
import cookie from "js-cookie";
import axios from "axios";
import baseUrl from "../utilsServer/base";
const follow = async (to: string) => {
  const Token = cookie.get("Token");
  try {
    const res = await axios.post(
      `${baseUrl}/api/profile/addFollower`,
      {
        to,
      },
      {
        headers: { Authorization: Token },
      }
    );
  } catch (err) {
    throw new Error("Could not comeplete this action");
  }
};
export default follow;
