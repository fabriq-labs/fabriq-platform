// Datasource Api
import axios from "./axios";
import { REF_DATASOURCE } from "./graphql/datasource";

export const SCHEMA_NOT_SUPPORTED = 1;
export const SCHEMA_LOAD_ERROR = 2;

const DataSource = {
  query: () => axios.get("api/data_sources"),
  get: ({ id }) => axios.get(`api/data_sources/${id}`),
  types: () => axios.get("api/data_sources/types"),
  create: (data) => axios.post("api/data_sources", data),
  save: (data) => axios.post(`api/data_sources/${data.id}`, data),
  test: (data) => axios.post(`api/data_sources/${data.id}/test`),
  delete: ({ id }) => axios.delete(`api/data_sources/${id}`),
  get_redirecturi: (id) => axios.get(`/api/destination/${id}/connect`),
  get_data_source: (id) => axios.get(`api/data_sources/${id}`),
  delete_data_source: (id) => axios.delete(`api/data_sources/${id}`),
  fetchSchema: (data, refresh = false) => {
    const params = {};

    if (refresh) {
      params.refresh = true;
    }

    return axios.get(`api/data_sources/${data.id}/schema`, { params });
  },
  getList: (org_id) =>
    axios.post("/api/pipeline/graphql", {
      query: REF_DATASOURCE,
      variables: {
        org_id
      }
    })
};

export default DataSource;
