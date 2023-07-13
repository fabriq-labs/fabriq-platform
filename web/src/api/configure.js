// Connection - Api
import {
  REF_PIPELINE_UPDATE,
  REF_PIPELINE_ENTITIES_COUNT_UPDATE,
  REF_PIPELINE
} from "./graphql/configure";
import axios from "./axios";

const Connection = {
  updatePipeline: (
    id,
    sync_from,
    sync_frequency,
    entities,
    transform,
    transform_url,
    destination_id,
    org_id
  ) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_UPDATE,
      variables: {
        id,
        sync_from,
        sync_frequency,
        entities,
        transform,
        transform_url,
        destination_id,
        org_id
      }
    }),
  updateEntities: (id, entities_count, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_ENTITIES_COUNT_UPDATE,
      variables: {
        id,
        entities_count,
        org_id
      }
    }),
  getPipelineWithId: (id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE,
      variables: {
        id,
        org_id
      }
    })
};

export default Connection;
