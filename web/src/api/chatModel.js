/* eslint-disable no-param-reassign */
import axios from "./axios";

const ChatModel = {
  get_chat_model_Data: () => axios.get("/api/chat_modals"),
  get: (id) => axios.get(`api/chat_modals/${id}`),
  update:(id, data) => axios.post(`/api/chat_modals/${id}`, data),
  create_chatModel: (data) => axios.post("/api/chat_modals", data),
};

export { ChatModel };
