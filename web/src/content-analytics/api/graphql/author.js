// Author
import Reactenv from "./utils/settings";

const AUTHOR_REAL_TIME_DETAILS = `
  query Author($period_date: String!, $author_id: String!, $site_id: String!) {
    Authors: ${Reactenv.content_analytics_entity_prefix}authors(where: {author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
      name
      articles {
        article_id
      }
    }
    
    AuthorsPageViews:${Reactenv.content_analytics_entity_prefix}author_page_views(where: {author_id: {_eq: $author_id}, period_date: {_eq: $period_date}, author: {site_id: {_eq: $site_id}}}) {
      total_time_spent
      page_views
      author {
        author_id
        name
        articles {
          article_id
          category
          published_date
          title
        }
      }
    }
    AuthorsDaily:${Reactenv.content_analytics_entity_prefix}authors_daily(where: {site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}, limit: 30) {
      author_id
      country_distribution
      page_views
      period_date
      medium_distribution
      exit_page_distribution
      site_id
      users
    }

    AuthorsHourly:${Reactenv.content_analytics_entity_prefix}authors_hourly(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, author_id: {_eq: $author_id}}) {
      page_views
      users
      period_hour
    }

    AuthorsHourlyAverage:${Reactenv.content_analytics_entity_prefix}authors_hourly_average(where: {site_id: {_eq: $site_id}, author_id: {_eq: $author_id}}) {
      page_views
      users
      period_hour
    }
  }
`;

const AUTHOR_MONTHLY_DETAILS = `
query author_monthly_users($period_month: Int, $author_id: String!, $site_id: String!, $period_year: Int) {
  AuthorsMonthly:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {period_month: {_eq: $period_month}, period_year: {_eq: $period_year}, author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
    author
    author_id
    average_time_spent
    total_time_spent
    country_distribution
    exit_page_distribution
    medium_distribution
    page_views
    source_distribution
    users
    period_year
    period_month
  }

  AuthorsDaily:${Reactenv.content_analytics_entity_prefix}authors_daily(where: {author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
    medium_distribution
    period_date
    page_views
    users
  }
}
`;

const AUTHOR_QUATERLY_DETAILS = `
query author_quaterly($period_quater: Int, $author_id: String!, $site_id: String!, $period_year: Int) {
  AuthorsQuaterly:${Reactenv.content_analytics_entity_prefix}authors_quarterly(where: {period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}, author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
    author
    author_id
    average_time_spent
    total_time_spent
    country_distribution
    exit_page_distribution
    medium_distribution
    page_views
    source_distribution
    users
    period_year
    period_quarter
  }
  AuthorsMonthly:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
    medium_distribution
    period_month
    period_year
    page_views
    users
  }
}
`;

const AUTHOR_YEARLY_DETAILS = `
query author_yearly($author_id: String!, $site_id: String!, $period_year: Int) {
  AuthorsYearly:${Reactenv.content_analytics_entity_prefix}authors_yearly(where: {period_year: {_eq: $period_year}, author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
    author
    author_id
    average_time_spent
    total_time_spent
    country_distribution
    exit_page_distribution
    medium_distribution
    page_views
    source_distribution
    users
    period_year
  }
  AuthorsMonthly:${Reactenv.content_analytics_entity_prefix}authors_monthly(where: {author_id: {_eq: $author_id}, site_id: {_eq: $site_id}}) {
    medium_distribution
    period_month
    period_year
    page_views
    users
  }
}
`;

export {
  AUTHOR_REAL_TIME_DETAILS,
  AUTHOR_MONTHLY_DETAILS,
  AUTHOR_QUATERLY_DETAILS,
  AUTHOR_YEARLY_DETAILS
};
