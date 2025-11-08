import axios from './axios.customize';

const sendChatMessageAPI = (message: string, userId: string) => {
  const URL_BACKEND = `/api/v1/chatbot/chat?userId=${userId}`;
  return axios.post(URL_BACKEND, {
    message: message,
    userId: userId,
  });
};

const loadChatHistoryAPI = (userId: string) => {
  const URL_BACKEND = `/api/v1/chatbot/history?userId=${userId}`;
  return axios.get(URL_BACKEND);
};

export { sendChatMessageAPI, loadChatHistoryAPI };
