import { parseCookies } from "nookies";
import { GetServerSidePropsContext } from "next";
import axios from "axios";
import baseUrl from "./base";
import ProtectedRouteProps from "../types/ProtectedRouteProps";

export const protectedRoute = [
  "/",
  "/[username]",
  "/notifications",
  "/logout",
  "/manageAccount",
  "/messages",
];

const routeProtection = async (
  context: GetServerSidePropsContext
): Promise<ProtectedRouteProps> => {
  try {
    const isProtected = protectedRoute.some(
      (route) => route === context.resolvedUrl
    );
    if (!isProtected) {
      return { user: null, isProtected };
    }
    const { Token } = parseCookies(context);

    if (!Token) {
      return { user: null, isProtected };
    } else {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { authorization: Token },
      });
      const { user, userFollowStats } = res.data;
      return { user, isProtected };
    }
  } catch (err) {
    //an error occurred therefore it must be a protected route
    return { user: null, isProtected: true };
  }
};
export default routeProtection;
