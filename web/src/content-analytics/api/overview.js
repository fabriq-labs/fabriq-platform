import axios from "../../api/axios";
import {
  SEARCH,
  OVERVIEW_DATA,
  GET_LAST_30DAYS_DATA,
  GET_LAST_30DAYS_DATA_AUTHOR
} from "./graphql/overview";

const Overview = {
  get_search: (variables) =>
    axios.post("/api/pipeline/graphql", {
      query: SEARCH,
      variables: variables
    }),
  get_overviewData: (variables) =>
    axios.post("/api/pipeline/graphql", {
      query: OVERVIEW_DATA,
      variables: variables
    }),
  getLast30Days: (req) => {
    const query = GET_LAST_30DAYS_DATA(req?.period_date);
    return axios.post("/api/pipeline/graphql", {
      query,
      variables: {
        site_id: req?.site_id,
        article_id: req?.article_id
      }
    });
  },
  getLast30DaysForAuthor: (req) => {
    const query = GET_LAST_30DAYS_DATA_AUTHOR(req?.period_date);
    return axios.post("/api/pipeline/graphql", {
      query,
      variables: {
        site_id: req?.site_id,
        author_id: req?.author_id
      }
    });
  }
};

export { Overview };
