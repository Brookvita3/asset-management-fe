import axios from "./axios.customize";

const sendChatMessageAPI = (message: string, userId: number) => {
  const URL_BACKEND = `/api/chatbot/chat?userId=${userId}`;
  return axios.post(URL_BACKEND, {
    message: message,
    userId: userId,
  });
};

const loadChatHistoryAPI = (userId: number) => {
  const URL_BACKEND = `/api/chatbot/history?userId=${userId}`;
  return axios.get(URL_BACKEND);
};

export {
  sendChatMessageAPI,
  loadChatHistoryAPI,
};