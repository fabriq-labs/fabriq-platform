// Pipeline
import axios from "./axios";

function timeRange(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const fetchDataFromJob = (data, setLoaderTip, message) => {
  return axios.get(`api/jobs/${data.job.id}`).then((res) => {
    const { data } = res;
    if (data.job.status < 3) {
      if (setLoaderTip) {
        setLoaderTip(message);
      }
      return timeRange(3000).then(() => fetchDataFromJob(data));
    } else if (data.job.status === 3) {
      return data.job.result;
    } else if (data.job.status === 4 && data.job.error.code === 1) {
      return [];
    } else {
      return Promise.reject(new Error(data.job.error));
    }
  });
};

const PipelineConnect = {
  get: (id) => axios.get(`api/pipelines/${id}/connect`),
  callback: (data) => axios.post("api/pipeline/connect/callback", data),
  init: (data) => axios.post("api/pipeline/connect/init", data),
  sync: (id) => axios.post(`api/pipelines/${id}/sync`),
  fetchDataFromJob: (data, setLoaderTip, message) => {
    return fetchDataFromJob(data, setLoaderTip, message);
  },
  pipelineLog: (requestData) => axios.post("api/elt-logs", requestData),
  testConnection: (connectionId) =>
    axios.post(`/api/test_connection/${connectionId}`),
  getMyUserDetails: () => axios.get(`/api/user/my`),
};

export default PipelineConnect;
