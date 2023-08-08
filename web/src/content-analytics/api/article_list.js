// Article List
import axios from "../../api/axios";
import {
  REALTIME_VISITORS,
  MONTHLY_VISITORS,
  QUARTERLY_VISITORS,
  YEARLY_VISITORS,
  REALTIME_TABLE_SORT,
  REALTIME_TABLE_FILTER_AUTHOR,
  REALTIME_TABLE_FILTER_CATEGORY,
  REALTIME_TABLE_FILTER_PUBLISHED_DATE,
  Monthly_TABLE_SORT,
  QUATERLY_TABLE_SORT,
  YEARLY_TABLE_SORT,
  MONTHLY_TABLE_FILTER_AUTHOR,
  Monthly_TABLE_FILTER_CATEGORY,
  MONTHLY_TABLE_FILTER_PUBLISHED_DATE,
  QUARTERLY_TABLE_FILTER_AUTHOR,
  QUATERLY_TABLE_FILTER_CATEGORY,
  QUATERLY_TABLE_FILTER_PUBLISHED_DATE,
  YEARLY_TABLE_FILTER_AUTHOR,
  YEARLY_TABLE_FILTER_CATEGORY,
  YEARLY_TABLE_FILTER_PUBLISHED_DATE
} from "../api/graphql/article_list";

const ArticleList = {
  get_Visitors_data: (period_date, limit, site_id) => {
    const partial_period_date = `${period_date}%`;
    const query = REALTIME_VISITORS(partial_period_date);

    return axios.post("/api/pipeline/graphql", {
      query,
      variables: {
        period_date,
        limit,
        site_id
      }
    });
  },
  get_Monthly_Visitors: (site_id, period_month, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: MONTHLY_VISITORS,
      variables: {
        site_id,
        period_month,
        period_year
      }
    }),
  get_Quarterly_Visitors: (site_id, period_quater, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: QUARTERLY_VISITORS,
      variables: {
        site_id,
        period_quater,
        period_year
      }
    }),
  get_Yearly_Visitors: (site_id, period_year) =>
    axios.post("/api/pipeline/graphql", {
      query: YEARLY_VISITORS,
      variables: {
        site_id,
        period_year
      }
    }),
  get_Table_List: (period_date, selectedSort, site_id) => {
    const partial_period_date = `${period_date}%`;
    const query = REALTIME_TABLE_SORT(partial_period_date);

    return axios.post("/api/pipeline/graphql", {
      query,
      variables: {
        period_date,
        site_id,
        order_by: {
          [selectedSort]: "desc"
        }
      }
    });
  },
  get_Table_List_Filter: (
    period_date,
    filter_value,
    selectedFilter,
    site_id
  ) => {
    const partial_period_date = `${period_date}%`;
    const query =
      selectedFilter === "author"
        ? REALTIME_TABLE_FILTER_AUTHOR(partial_period_date)
        : selectedFilter === "category"
        ? REALTIME_TABLE_FILTER_CATEGORY(partial_period_date)
        : REALTIME_TABLE_FILTER_PUBLISHED_DATE();
    
    return axios.post("/api/pipeline/graphql", {
      query,
      variables: {
        period_date,
        site_id,
        filter_value
      }
    });
  },
  get_Monthly_Table_List: (site_id, period_month, period_year, selectedSort) =>
    axios.post("/api/pipeline/graphql", {
      query: Monthly_TABLE_SORT,
      variables: {
        site_id,
        period_month,
        period_year,
        order_by: {
          [selectedSort]: "desc"
        }
      }
    }),
  get_Quaterly_Table_List: (
    site_id,
    period_quater,
    period_year,
    selectedSort
  ) =>
    axios.post("/api/pipeline/graphql", {
      query: QUATERLY_TABLE_SORT,
      variables: {
        site_id,
        period_quater,
        period_year,
        order_by: {
          [selectedSort]: "desc"
        }
      }
    }),
  get_Yearly_Table_List: (site_id, period_year, selectedSort) =>
    axios.post("/api/pipeline/graphql", {
      query: YEARLY_TABLE_SORT,
      variables: {
        site_id,
        period_year,
        order_by: {
          [selectedSort]: "desc"
        }
      }
    }),
  get_Monthly_Table_List_Filter: (
    period_month,
    period_year,
    filter_value,
    selectedFilter,
    site_id
  ) =>
    axios.post("/api/pipeline/graphql", {
      query:
        selectedFilter === "author"
          ? MONTHLY_TABLE_FILTER_AUTHOR
          : selectedFilter === "category"
          ? Monthly_TABLE_FILTER_CATEGORY
          : MONTHLY_TABLE_FILTER_PUBLISHED_DATE,
      variables: {
        site_id,
        period_year,
        period_month,
        filter_value
      }
    }),
  get_Quaterly_Table_List_Filter: (
    period_quater,
    period_year,
    filter_value,
    selectedFilter,
    site_id
  ) =>
    axios.post("/api/pipeline/graphql", {
      query:
        selectedFilter === "author"
          ? QUARTERLY_TABLE_FILTER_AUTHOR
          : selectedFilter === "category"
          ? QUATERLY_TABLE_FILTER_CATEGORY
          : QUATERLY_TABLE_FILTER_PUBLISHED_DATE,
      variables: {
        site_id,
        period_year,
        period_quater,
        filter_value
      }
    }),
  get_Yearly_Table_List_Filter: (
    period_year,
    filter_value,
    selectedFilter,
    site_id
  ) =>
    axios.post("/api/pipeline/graphql", {
      query:
        selectedFilter === "author"
          ? YEARLY_TABLE_FILTER_AUTHOR
          : selectedFilter === "category"
          ? YEARLY_TABLE_FILTER_CATEGORY
          : YEARLY_TABLE_FILTER_PUBLISHED_DATE,
      variables: {
        site_id,
        period_year,
        filter_value
      }
    })
};

export { ArticleList };
