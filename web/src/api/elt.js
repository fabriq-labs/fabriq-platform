import axios from "axios";
import axiosApi from "./axios";

const url = process.env.REACT_APP_BACKEND_BASE_URL;

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `${token}` : "";
};

const elt_service = {
  get_connections: (workspace_id) =>
    axios.post(`${url}/api/v1/web_backend/connections/list`, {
      workspaceId: workspace_id
    }),
  get_jobs: (pipeline) =>
    axios.post(`${url}elt-wrapper/pipeline/update`, {
      event: {
        session_variables: {
          "x-hasura-role": "admin"
        },
        op: "GET_JOBS",
        data: {
          new: {
            id: pipeline?.id
          }
        }
      }
    }),
  trigger_sync: (pipelineId) =>
    axios.post(`${url}elt-wrapper/pipeline/update`, {
      event: {
        session_variables: {
          "x-hasura-role": "admin"
        },
        op: "SYNC",
        data: {
          new: {
            id: pipelineId
          }
        }
      }
    }),
  create_source: (pipelineId) =>
    axios.post(`${url}elt-wrapper/connection/update`, {
      event: {
        data: {
          new: {
            id: pipelineId
          }
        },
        op: "INSERT"
      }
    }),
  get_job_info: (pipelineId, jobId) =>
    axios.post(`${url}elt-wrapper/pipeline/update`, {
      event: {
        session_variables: {
          "x-hasura-role": "admin"
        },
        op: "GET_JOB_INFO",
        data: {
          new: {
            id: pipelineId
          },
          job_id: jobId
        }
      }
    }),
  get_destinations: (workspace_id) =>
    axios.post(`${url}/api/v1/destinations/list`, {
      workspaceId: workspace_id
    }),

  check_destionation_connection: (id) =>
    axios.post(`${url}/api/v1/destinations/check_connection`, {
      destinationId: id
    }),
  deploy: (pipelineId) =>
    axios.post(
      `${process.env.REACT_APP_BACKEND_BASE_URL}elt-wrapper/pipeline/update`,
      {
        event: {
          data: {
            new: {
              id: pipelineId
            }
          },
          op: "INSERT"
        }
      }
    ),
  deployDestionation: (destination_id, org_id, org_slug) =>
    axios.post(
      `${process.env.REACT_APP_BACKEND_BASE_URL}elt-wrapper/destination/update`,
      {
        event: {
          data: {
            new: {
              id: destination_id
            },
            org_id: org_id,
            org_slug: org_slug,
            key: getToken()
          },
          op: "INSERT"
        }
      }
    ),
  getSchema: (id) =>
    axiosApi.post(
      `/api/v1/sources/discover_schema`,
      {
        sourceId: id
      },
      {
        "Content-Type": "application/json",
        Authorization: `${process.env.REACT_APP_AIRBYTE_API_KEY}`
      }
    )
};

export default elt_service;
