import axios from "../../api/axios";
import {
  PROFILE_DATA,
  PROFILE_LAST_SEVEN_DAYS_DATA,
  PROFILE_LAST_SESSION_DETAILS,
  PROFILE_TOPAUTHORCATEGORY_DETAILS
} from "./graphql/profile";

const Profile = {
  get_profileData: (domain_userid, site_id) =>
    axios.post("/api/pipeline/graphql", {
      query: PROFILE_DATA,
      variables: {
        id: domain_userid,
        site_id: site_id
      }
    }),
  get_sevendayData: (domain_userid, start_date, end_date, site_id) =>
    axios.post("/api/pipeline/graphql", {
      query: PROFILE_LAST_SEVEN_DAYS_DATA,
      variables: {
        id: domain_userid,
        start_date: start_date,
        end_date: end_date,
        site_id: site_id
      }
    }),
  get_lastSessionData: (domain_userid, site_id) =>
    axios.post("/api/pipeline/graphql", {
      query: PROFILE_LAST_SESSION_DETAILS,
      variables: {
        id: domain_userid,
        site_id: site_id
      }
    })
};

export { Profile };
