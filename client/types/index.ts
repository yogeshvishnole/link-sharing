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
