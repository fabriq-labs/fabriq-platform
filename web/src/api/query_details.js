// Query Details - Api
import axios from "./axios";
import {
  QUERY_FOLDER_LIST,
  QUERY_DELETE_UPDATE
} from "./graphql/query_details";

const QueryDetails = {
  getQueryFolderList: () =>
    axios.post("/api/pipeline/graphql", {
      query: QUERY_FOLDER_LIST
    }),
  delete_query: (variables) =>
    axios.post("/api/pipeline/graphql", {
      query: QUERY_DELETE_UPDATE,
      variables: variables
    })
};

export default QueryDetails;
