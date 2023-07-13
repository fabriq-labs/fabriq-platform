// Common Links
const organization = localStorage.getItem("organization");
let parsed = null;

if (organization) {
  parsed = JSON.parse(organization);
}

const baseURL = process.env.REACT_APP_BACKEND_BASE_URL;
const URL = `${baseURL}${
  parsed && parsed.fabriq_org_slug ? parsed.fabriq_org_slug : ""
}/api/pipeline/graphql`;

const getToken = () => {
  const token = localStorage.getItem("token");
  return token ? `${token}` : "";
};

let headers = {
  "Content-Type": "application/json"
};

let token = getToken();
if (token) {
  headers["META-KEY"] = getToken();
}

export { headers, URL };
