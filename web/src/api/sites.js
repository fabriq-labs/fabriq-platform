/* eslint-disable no-param-reassign */
import axios from "./axios";

const Sites = {
  get_sitesData: () => axios.get("/api/sites"),
  get: (id) => axios.get(`api/site/${id}`),
  create_site: (data) => axios.post("api/sites", data),
};

export { Sites };
