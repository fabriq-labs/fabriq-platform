// Pipelines - Api
import axios from "./axios";
import {
  REF_PIPELINE,
  REF_PIPELINE_LOG,
  REF_PIPELINE_VIEW,
  REF_PIPELINE_STATUS_UPDATE,
  REF_PIPELINE_INSERT,
  REF_PIPELINE_DELETE_UPDATE,
  REF_PIPELINE_CONFIG_UPDATE,
  REF_PIPELINE_CONFIGDATA_UPDATE,
  REF_PIPELINE_NAME_UPDATE,
  REF_DUPLICATE_PIPELINE_INSERT,
  REF_PIPELINE_LAST_RUN_AT_UPDATE
} from "./graphql/pipelines";

const Pipelines = {
  getList: (org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE,
      variables: {
        org_id
      }
    }),
  getWithId: (id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_LOG,
      variables: {
        pipeline_id: id,
        org_id
      }
    }),
  getPipelineWithId: (id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_VIEW,
      variables: {
        id,
        org_id
      }
    }),
  updateLastRunAtPipeline: (id, last_ran_at) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_LAST_RUN_AT_UPDATE,
      variables: {
        id,
        last_ran_at
      }
    }),
  updateStatus: (id, status, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_STATUS_UPDATE,
      variables: {
        id,
        status,
        org_id
      }
    }),
  updateConfigAndEntities: (id, config, entities, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_CONFIG_UPDATE,
      variables: {
        id,
        config,
        entities,
        org_id
      }
    }),
  updateConfig: (id, config, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_CONFIGDATA_UPDATE,
      variables: {
        id,
        config,
        org_id
      }
    }),
  updateName: (id, name, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_NAME_UPDATE,
      variables: {
        id,
        name,
        org_id
      }
    }),
  updateDelete: (id, org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_DELETE_UPDATE,
      variables: {
        id,
        org_id
      }
    }),
  insertPipeline: (
    name,
    description,
    source_id,
    entities,
    org_id,
    user_id,
    destination_id,
    entities_count
  ) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_PIPELINE_INSERT,
      variables: {
        name,
        description,
        source_id,
        entities,
        org_id,
        user_id,
        destination_id,
        entities_count
      }
    }),
  duplicateInsertPipeline: (
    name,
    description,
    source_id,
    entities,
    org_id,
    user_id,
    destination_id,
    entities_count,
    status,
    is_receipe,
    tenant_id,
    transform,
    transform_url,
    sync_frequency,
    sync_from,
    connection_id,
    config
  ) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_DUPLICATE_PIPELINE_INSERT,
      variables: {
        name,
        description,
        source_id,
        entities,
        org_id,
        user_id,
        destination_id,
        entities_count,
        status,
        is_receipe,
        tenant_id,
        transform,
        transform_url,
        sync_frequency,
        sync_from,
        connection_id,
        config
      }
    })
};

export default Pipelines;
