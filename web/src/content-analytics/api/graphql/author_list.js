// Author List Graphql
import Reactenv from "./utils/settings";

const AUTHOR_LIST = `
  query author_List($site_id: String!, $period_date: String!, $period_month: numeric, $period_year: numeric, $offset: Int!) {
    Authors:${Reactenv.content_analytics_entity_prefix}authors(where: {site_id: {_eq: $site_id}}, order_by: {articles_aggregate: {count: desc}}, limit: 10, offset: $offset) {
      author_id
      name
      authors_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, site_id: {_eq: $site_id}}) {
        author_id
        average_time_spent
        total_time_spent
      }
      articles {
        article_id
        title
        category
        published_date
        author
      }
      articles_daily(where: {period_date: {_eq: $period_date}, site_id: {_eq: $site_id}}) {
        article_id
        page_views
        users
      }
    }
    totalCount:${Reactenv.content_analytics_entity_prefix}authors_aggregate(where: {site_id: {_eq: $site_id}}) {
      aggregate {
        count
      }
    }
  }

`;

export { AUTHOR_LIST };
