import axios from "axios";
import { getCookie } from "./auth";

export const withUser = async (context) => {
  const { req, res, query } = context;
  const token = getCookie("token", req);
  let user = null;
  let userLinks = [];
  try {
    const response = await axios.get("http://localhost:4000/api/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });
    user = response.data.data.user;
    userLinks = response.data.data.links;
  } catch (err) {
    if (err.response.status === 401) {
      user = null;
    }
  }

  if (user === null) {
    res.writeHead(302, {
      Location: "/",
    });
    return res.end();
  } else {
    return { user, res, userLinks, token: token, query };
  }
};

export const roleSubscriber = ({ user, userLinks, res, token, query }) => {
  if (user.role === "subscriber") {
    return { user, userLinks, token, query };
  } else {
    res.writeHead(302, {
      Location: "/",
    });
    return res.end();
  }
};

export const roleAdmin = ({ user, userLinks, res, token, query }) => {
  if (user.role === "admin") {
    return { user, userLinks, token, query };
  } else {
    res.writeHead(302, {
      Location: "/",
    });
    return res.end();
  }
};

export const getCategory = async ({ user, token, query }) => {
  const response = await axios.post(
    `${process.env.API_HOST}/api/v1/categories/${query.slug}`
  );
  return { user, token, category: response.data.data.category };
};

export const getLink = async ({ user, token, query }) => {
  const response = await axios.get(
    `${process.env.API_HOST}/api/v1/links/${query.id}`
  );

  return { user, token, link: response.data.data.link };
};

export const getUser = ({ user, token }) => {
  return { user, token };
};
