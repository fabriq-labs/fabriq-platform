// Chat
import axios from "./axios";

const ChatApi = {
  getMessage: (data) => axios.post('/api/gpt', data)
};

export default ChatApi;
