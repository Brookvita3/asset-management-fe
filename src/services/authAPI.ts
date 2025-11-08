import axios from "./axios.customize";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    token: string;
  };
}

export const loginAPI = (payload: LoginPayload) =>
  axios.post<LoginResponse>("/login", payload);
