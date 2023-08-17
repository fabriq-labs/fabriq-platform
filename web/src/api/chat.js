// Chat
import axios from "./axios";
import {
  CHAT_TYPES,
  CHAT_OPTIONS,
  INSERT_CHAT_RESULTS,
  GET_CHAT_RESULT_LIST,
  GET_CHAT_RESULT_BY_ID,
  UPDATE_CHAT_RESULT
} from "./graphql/chat";

const ChatApi = {
  getMessage: (data) => axios.post("/api/gpt", data),
  getChatTypes: () =>
    axios.post("/api/pipeline/graphql", {
      query: CHAT_TYPES
    }),
  getChatOptions: () =>
    axios.post("/api/pipeline/graphql", {
      query: CHAT_OPTIONS
    }),
  insertChatResult: (variables) =>
    axios.post("/api/pipeline/graphql", {
      query: INSERT_CHAT_RESULTS,
      variables: variables
    }),
  getChatReslutList: (org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: GET_CHAT_RESULT_LIST,
      variables: { org_id: org_id }
    }),
  getChatResultID: (variables) =>
    axios.post("/api/pipeline/graphql", {
      query: GET_CHAT_RESULT_BY_ID,
      variables: variables
    }),
  updateChatReslut: (variables) =>
    axios.post("/api/pipeline/graphql", {
      query: UPDATE_CHAT_RESULT,
      variables: variables
    })
};

export default ChatApi;
