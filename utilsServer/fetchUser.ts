import ProtectedRouteProps from "../types/ProtectedRouteProps";
import FetchedUserObj from "../types/FetchedUserTypes";
import cookie from "js-cookie";
import baseUrl from "./base";
import axios from "axios";

const fetchUser = async (): Promise<FetchedUserObj | null> => {
  try {
    const Token = cookie.get("Token");

    if (!Token) {
      return null;
    } else {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { authorization: Token },
      });
      return res.data.user as FetchedUserObj;
    }
  } catch (err) {
    //an error occurred therefore it must be a protected route
    return null;
  }
};
export default fetchUser;
