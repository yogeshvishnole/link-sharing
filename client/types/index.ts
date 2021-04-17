export interface UserType {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginResponseType {
  status: string;
  token: string;
  data: {
    user: UserType;
  };
}

export type linkType = "free" | "paid";

export type linkMedium = "video" | "book";

export interface Category {
  name: string;
  content: string;
  image: {
    url: string;
    key: string;
  };
}
