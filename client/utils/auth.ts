import cookie from "js-cookie";
import Router from "next/router";
import { LoginResponseType, UserType } from "../types";

export const setCookie = (key: string, value: string) => {
  if (process.browser) {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

export const removeCookie = (key: string) => {
  if (process.browser) {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

export const getCookie = (key: string, req?) => {
  return process.browser
    ? getCookieFromBrowser(key)
    : getCookieFromServer(key, req);
};

const getCookieFromBrowser = (key: string) => cookie.get(key);

const getCookieFromServer = (key: string, req) => {
  if (req.headers.cookie) {
    const cookieHeader = req.headers.cookie
      .split(";")
      .find((c) => c.trim().startsWith(`${key}`));
    const tokenValue = cookieHeader?.split("=")[1].trim();
    return tokenValue;
  }
};

export const setLocalStorage = (key: string, value: UserType) => {
  if (process.browser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeLocalStorage = (key: string) => {
  if (process.browser) {
    localStorage.removeItem(key);
  }
};

export const authenticate = (response: LoginResponseType, next: Function) => {
  const { data, token } = response;
  setCookie("token", token);
  setLocalStorage("user", data.user);
  next();
};

export const isAuth = (): UserType | false => {
  if (process.browser) {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      return JSON.parse(localStorage.getItem("user")) as UserType;
    } else {
      return false;
    }
  }
};

export const logout = () => {
  removeLocalStorage("user");
  removeCookie("token");
  Router.push("/");
};
