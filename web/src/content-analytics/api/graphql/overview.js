// Overview Graphql
import moment from "moment";
import Reactenv from "./utils/settings";

const SEARCH = `
  query search($searchValue: String!) {
    Articles:${Reactenv.content_analytics_entity_prefix}articles(where: {title: {_ilike: $searchValue}}) {
      title
      article_id
    }
    Authors:${Reactenv.content_analytics_entity_prefix}authors(where: {name: {_ilike: $searchValue}}) {
      name
      author_id
    }
  }
`;

const OVERVIEW_DATA = (partial_period_date) => {
  const obj = `
    limit: $limit, order_by: {
      page_views: desc_nulls_last
    }, where: {
      period_date: {
        _eq: $period_date
      },
      site_id: {
        _eq: $site_id
      },
      article: {
        published_date: {
          _like: "${partial_period_date}"
        }
      }
    }
  `;

  const query = `
    query OverallData($period_date: String!, $limit: Int!, $site_id: String!) {
      daily_aggregate:${Reactenv.content_analytics_entity_prefix}articles_daily_aggregate(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
        aggregate {
          sum {
            page_views
            total_time_spent
            users
            attention_time
            total_shares
          }
        }
      }

      NewPostArticles: ${Reactenv.content_analytics_entity_prefix} articles(where: {site_id: {_eq: $site_id}, published_date: {_gte: $period_date}}) {
        article_id
      }

      TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_daily(${obj}) {
        page_views
        site_id
        period_date
        article {
          category
          published_date
          title
          article_id
          authors {
            name
          }
        }
      }

      TopAuthors: ${Reactenv.content_analytics_entity_prefix}author_page_views(order_by: {page_views: desc_nulls_last}, limit: 5, where: {author: {site_id: {_eq: $site_id}}, period_date: {_eq: $period_date}}) {
        author {
          author_id
          name
          site_id
          articles_aggregate{
            aggregate{
              count
            }
          }
        }
        page_views
      }

      ArticleCurrentHours: ${Reactenv.content_analytics_entity_prefix}articles_overall_hourly(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
        hour
        users
        page_views
        site_id
      }

      ArticleAvgHours: ${Reactenv.content_analytics_entity_prefix}articles_overall_hourly_average(where: {site_id: {_eq: $site_id}}) {
        hour
        page_views
        users
        site_id
      }
    }
  `;

  return query;
};

const GET_LAST_30DAYS_DATA = (period_date) => {
  const twentyFourHoursAgo = moment
    .utc(period_date)
    .subtract(24, "hours")
    .format("YYYY-MM-DD");
  const obj = `
      where: {
        period_date: { _gte: "${twentyFourHoursAgo}", _lte: "${period_date}" }
        site_id: { _eq: $site_id }
        article_id: { _in: $article_id }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $article_id: [String!]!) {
      last30DaysData:${Reactenv.content_analytics_entity_prefix}articles_hourly(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        hour
        article {
          category
          published_date
          title
          article_id
          authors {
            name
          }
        }
      }
    }
  `;

  return query;
};

const GET_LAST_24HOURS_DATA = (period_date) => {
  const twentyFourHoursAgo = moment.utc(period_date).subtract(24, 'hours').format('YYYY-MM-DD');
  const obj = `
      where: {
        period_date: { _gte: "${twentyFourHoursAgo}", _lte: "${period_date}" }
        site_id: { _eq: $site_id }
        author_id: { _in: $author_id }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $author_id: [String!]!) {
      last24HoursData:${Reactenv.content_analytics_entity_prefix}authors_hourly(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        author_id
        period_hour
      }
    }
  `;

  return query;
};

const GET_LAST_30DAYS_DATA_FOR_ARTICLE = (period_date) => {
  const start_date = moment(period_date)
    .subtract(30, "days")
    .format("YYYY-MM-DD");

  const obj = `
      where: {
        period_date: { _gte: "${start_date}" }
        site_id: { _eq: $site_id }
        article_id: { _in: $article_id }
      }
  `;

  const query = `
    query overViewData($site_id: String!, $article_id: [String!]!) {
      last30DaysData:${Reactenv.content_analytics_entity_prefix}articles_daily(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        article {
          category
          published_date
          title
          article_id
          authors {
            name
          }
        }
      }
    }
  `;

  return query;
};

const GET_LAST_30DAYS_DATA_AUTHOR = (period_date) => {
  const start_date = moment(period_date)
    .subtract(30, "days")
    .format("YYYY-MM-DD");
  const obj = `
    where: {
      period_date: { _gte: "${start_date}" }
      site_id: { _eq: $site_id }
      author_id: { _in: $author_id }
    }
`;

  const query = `
    query overViewData($site_id: String!, $author_id: [String!]) {
      last30DaysDataForAuthor:${Reactenv.content_analytics_entity_prefix}authors_daily(
        ${obj}
        order_by: {period_date: asc}
      ) {
        page_views
        period_date
        author_id
      }
    }
`;

  return query;
};

export {
  SEARCH,
  OVERVIEW_DATA,
  GET_LAST_30DAYS_DATA,
  GET_LAST_30DAYS_DATA_AUTHOR,
  GET_LAST_30DAYS_DATA_FOR_ARTICLE,
  GET_LAST_24HOURS_DATA
};
