import axios from "./axios";
import { GET_ORG_LOGO } from "./graphql/organization_details";

const organizations = {
  getOrgLogo: (id) =>
    axios.post("/api/pipeline/graphql", {
      query: GET_ORG_LOGO,
      variables: {
        id
      }
    })
};

export default organizations;
