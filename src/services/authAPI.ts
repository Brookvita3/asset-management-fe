import axios from './axios.customize';

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

export const loginAPI = async (payload: LoginPayload) => {
  try {
    const response = await axios.post<LoginResponse>('/login', payload);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
