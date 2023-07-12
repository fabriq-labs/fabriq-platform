// Article
import axios from "../../api/axios";
import {
  AUTHOR_REAL_TIME_DETAILS,
  AUTHOR_MONTHLY_DETAILS,
  AUTHOR_QUATERLY_DETAILS,
  AUTHOR_YEARLY_DETAILS
} from "../api/graphql/author";

const AuthorQuery = {
  get_real_time_details: (period_date, author_id, site_id) =>
    axios.post("/api/pipeline/graphql", {
      query: AUTHOR_REAL_TIME_DETAILS,
      variables: {
        period_date,
        author_id,
        site_id
      }
    }),
  get_monthly_details: (site_id, author_id, period_month, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: AUTHOR_MONTHLY_DETAILS,
      variables: {
        site_id,
        author_id,
        period_month,
        period_year
      }
    }),
  get_quaterly_details: (site_id, author_id, period_quater, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: AUTHOR_QUATERLY_DETAILS,
      variables: {
        site_id,
        author_id,
        period_quater,
        period_year
      }
    }),
  get_yearly_details: (site_id, author_id, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: AUTHOR_YEARLY_DETAILS,
      variables: {
        site_id,
        author_id,
        period_year
      }
    })
};

export { AuthorQuery };
