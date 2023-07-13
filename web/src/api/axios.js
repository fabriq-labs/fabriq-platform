// Axios Api
import axios from "axios";
import { headers } from "./headers";

const organization = localStorage.getItem("organization");
let parsed = null;

if (organization) {
  parsed = JSON.parse(organization);
}
const URL = process.env.REACT_APP_BACKEND_BASE_URL;
const instance = axios.create({
  baseURL: `${URL}${
    parsed && parsed.fabriq_org_slug ? parsed.fabriq_org_slug : ""
  }`
});

instance.defaults.headers.common = headers;

export default instance;
