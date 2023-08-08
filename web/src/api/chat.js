// Chat
import axios from "./axios";
import { CHAT_TYPES, CHAT_OPTIONS } from "./graphql/chat";

const ChatApi = {
  getMessage: (data) => axios.post("/api/gpt", data),
  getChatTypes: () =>
    axios.post("/api/pipeline/graphql", {
      query: CHAT_TYPES
    }),
  getChatOptions: () =>
    axios.post("/api/pipeline/graphql", {
      query: CHAT_OPTIONS
    })
};

export default ChatApi;
