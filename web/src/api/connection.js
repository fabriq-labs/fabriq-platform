// Connection - Api
import axios from "./axios";
import {
  REF_PIPELINE,
  REF_PIPELINE_UPDATE,
  REF_PIPELINE_ENTITIES_UPDATE,
  REF_INSERT_CONNECTION,
  REF_INSERT_CONNECTION_WITH_CONFIG
} from "./graphql/connection";

const Connection = {
  getPipeline: (id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE,
      variables: {
        id,
        org_id
      }
    }),
  updatePipeline: (id, connection_id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_UPDATE,
      variables: {
        id,
        connection_id,
        org_id
      }
    }),
  updatePipelineWithEntities: (id, entities, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_ENTITIES_UPDATE,
      variables: {
        id,
        entities,
        org_id
      }
    }),
  insertConnection: (display_name, credentials, source_id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_INSERT_CONNECTION,
      variables: {
        display_name,
        credentials,
        source_id,
        org_id
      }
    }),
  insertConnectionWithConfig: (
    display_name,
    credentials,
    source_id,
    org_id,
    config
  ) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_INSERT_CONNECTION_WITH_CONFIG,
      variables: {
        display_name,
        credentials,
        source_id,
        org_id,
        config
      }
    }),
  get: (params) => axios.get("/api/connections", { params }),
  delete: (key) => axios.delete(`/api/connections/${key}`)
};

export default Connection;
