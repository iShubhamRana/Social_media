import { Types } from "mongoose";
import cookie from "js-cookie";
import axios from "axios";
import baseUrl from "../utilsServer/base";

const unfollow = async (to: string) => {
  const Token = cookie.get("Token");
  console.log("unfollowing", to);
  try {
    const res = await axios.post(
      `${baseUrl}/api/profile/removeFollower`,
      {
        to,
      },
      {
        headers: { Authorization: Token },
      }
    );
  } catch (err) {
    console.log(err);
    throw new Error("Could not comeplete this action");
  }
};
export default unfollow;
