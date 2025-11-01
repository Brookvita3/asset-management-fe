import axios from "axios";

const rawBaseUrl = (import.meta as any).env.VITE_BACKEND_URL as string | undefined;
const normalizedBaseUrl = rawBaseUrl
  ? rawBaseUrl.replace(/\/+$/, "")
  : "http://10.28.128.57:8080";

const instance = axios.create({
  baseURL: normalizedBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  (config) => {
    if (
      typeof window !== "undefined" &&
      window?.localStorage?.getItem("access_token")
    ) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${window.localStorage.getItem(
        "access_token"
      )}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data ?? response,
  (error) => {
    const normalizedError = error?.response?.data ?? {
      message: error?.message ?? "Unknown error",
    };
    return Promise.reject(normalizedError);
  }
);

export default instance;
