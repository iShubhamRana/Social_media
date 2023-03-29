import cookie from "js-cookie";
import baseUrl from "./base";
import axios from "axios";

type info = {
  username: string;
  profilepic: string;
};
const getUserInfo = async (userId: string): Promise<info | null> => {
  try {
    const res = await axios.get(`${baseUrl}/api/profile/getUserInfo/${userId}`);
    return {
      username: res.data.username,
      profilepic: res.data.profilepic,
    };
  } catch (err) {
    return null;
  }
};

export default getUserInfo;
