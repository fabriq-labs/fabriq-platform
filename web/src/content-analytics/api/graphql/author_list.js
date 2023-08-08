// Author List Graphql
import Reactenv from "./utils/settings";

const AUTHOR_LIST = `
query author_List($site_id: String!,$period_date: String!, $period_month: Int, $period_year: Int, $offset: Int!) {
  Authors:${Reactenv.content_analytics_entity_prefix}authors(where: {site_id: {_eq: $site_id}}, order_by: {articles_aggregate: {count: desc}}, limit: 10, offset: $offset) {
    author_id
    name
    authors_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, site_id: {_eq: $site_id}}) {
      author_id
      average_time_spent
      total_time_spent
    }
    articles(limit: 5, where: {published_date: {_like: $period_date}}, order_by: {article_daily: {page_views: desc_nulls_last}}) {
      article_id
      title
      category
      published_date
      author
      article_daily {
        article_id
        page_views
        users
      }
    }
    articles_aggregate{
      aggregate{
        count
      }
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
