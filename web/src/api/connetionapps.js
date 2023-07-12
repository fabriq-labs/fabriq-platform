// Jira Project Name - Api
import axios from "axios";

// Get url from window
const url = window.location.origin;
const data = {
  env: url === process.env.REACT_APP_BACKEND_BASE_URL ? "dev" : ""
};

const ConnectionApi = {
  getProjectName: (info) =>
    axios.post(
      `${process.env.REACT_APP_CLOUD_FUNCTION}/function-1/pipeline/${info}/lookup/jira_projects`,
      data
    )
};

export default ConnectionApi;
