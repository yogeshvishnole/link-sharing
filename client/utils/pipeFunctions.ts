import axios from "axios";
import { getCookie } from "./auth";

export const withUser = async (context) => {
  const { req, res } = context;
  const token = getCookie("token", req);
  let user = null;
  try {
    const response = await axios.get("http://localhost:5000/api/v1/users", {
      headers: {
        Authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
    });
    user = response.data.data.user;
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
    return { user, res };
  }
};

export const roleSubscriber = ({ user, res }) => {
  if (user.role === "subscriber") {
    return { user };
  } else {
    res.writeHead(302, {
      Location: "/",
    });
    return res.end();
  }
};

export const roleAdmin = ({ user, res }) => {
  if (user.role === "admin") {
    return { user };
  } else {
    res.writeHead(302, {
      Location: "/",
    });
    return res.end();
  }
};
