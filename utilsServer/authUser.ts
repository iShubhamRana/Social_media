import axios from "axios";
import baseUrl from "./base";
import Router from "next/router";
import cookie from "js-cookie";

export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    axios
      .post(`${baseUrl}/api/auth`, { email, password })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

export const setToken = (token: string) => {
  cookie.set("Token", token);
  Router.push("/");
};

export const destroyToken = () => {
  cookie.remove("Token");
};
