// Source - Api
import {
  REF_SOURCE,
  REF_DESTINATION,
  REF_SOURCE_CONNECTION,
  REF_CONNECTION_GET,
} from "./graphql/source";
import axios from "./axios";

const Source = {
  getSourceList: () =>
    axios.post("/api/pipeline/graphql", {
      query: REF_SOURCE
    }),
  getConnections: () =>
    axios.post("/api/pipeline/graphql", {
      query: REF_SOURCE_CONNECTION
    }),
  getConnectionWithId: (id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_CONNECTION_GET,
      variables: {
        id,
        org_id
      }
    }),
  getWithId: (id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_DESTINATION,
      variables: {
        ref_destination_id: id
      }
    }),
};

export default Source;
