// Article
import axios from "../../api/axios";

import {
  ARTICLE_DETAILS,
  HISTORICAL_CHART_VIEW,
  GET_MONTHLY_DATA,
  GET_YEARLY_DATA,
  GET_QUARTERLY_DATA,
  ARTICLE_LIST
} from "../api/graphql/article";

const ArticleQuery = {
  get_article_details: (period_date, article_id, site_id) =>
    axios.post("/api/pipeline/graphql", {
      query: ARTICLE_DETAILS,
      variables: {
        period_date,
        article_id,
        site_id
      }
    }),
  get_historical_data: (site_id, start_date, end_date) =>
    axios.post("/api/pipeline/graphql", {
      query: HISTORICAL_CHART_VIEW,
      variables: {
        site_id,
        start_date,
        end_date
      }
    }),
  getMonthlyData: (site_id, article_id, period_year, period_month) =>
    axios.post("/api/pipeline/graphql", {
      query: GET_MONTHLY_DATA,
      variables: {
        site_id,
        article_id,
        period_month,
        period_year
      }
    }),
  getYearlyData: (site_id, article_id, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: GET_YEARLY_DATA,
      variables: {
        site_id,
        article_id,
        period_year
      }
    }),
  getQuarterlyData: (site_id, article_id, period_year, period_quarter) =>
    axios.post("/api/pipeline/graphql", {
      query: GET_QUARTERLY_DATA,
      variables: {
        site_id,
        article_id,
        period_year,
        period_quarter
      }
    }),
  getList: (site_id, article_id) =>
    axios.post("/api/pipeline/graphql", {
      query: ARTICLE_LIST,
      variables: {
        site_id,
        article_id
      }
    })
};

export { ArticleQuery };
