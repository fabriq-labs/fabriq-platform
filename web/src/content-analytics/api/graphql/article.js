// Article page
import Reactenv from "./utils/settings";

const ARTICLE_DETAILS = `
  query article_header_details($period_date: String!, $article_id: String!, $site_id: String!) {
    ArticleDaily:${Reactenv.content_analytics_entity_prefix}articles_daily(where: {period_date: {_eq: $period_date}, article_id: {_eq: $article_id}, site_id: {_eq: $site_id}}, order_by: { page_views: desc }) {
      article_id
      page_views
      users
      new_users
      attention_time
      total_time_spent
      average_time_spent
      bounce_rate
      readability
      article {
        title
        published_date
        category
      }
      country_distribution
      exit_page_distribution
      referrer_distribution
      social_distribution
      city_distribution
      device_distribution
    }
    ReadabilityMetrics:${Reactenv.content_analytics_entity_prefix}articles_daily_aggregate(where: {period_date: {_eq: $period_date}, article_id: {_eq: $article_id}, site_id: {_eq: $site_id}}) {
      nodes {
        readability
        attention_time
        article_id
        period_date
      }
      aggregate {
        avg {
          readability
        }
      }
    }
    ArticleDailyAgg:${Reactenv.content_analytics_entity_prefix}articles_daily_aggregate(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
        }
      }
    }

    ArticleExitDistributionDailyAgg:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_daily_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_date: {_eq: $period_date}}) {
      aggregate {
        avg {
          recirculation_count
        }
        sum {
          recirculation_count
        }
      }
    }

    ArticleHourly:${Reactenv.content_analytics_entity_prefix}articles_hourly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_date: {_eq: $period_date}}) {
      article_id
      page_views
      hour
      users
      period_date
    }

    ArticleScrollDepthDaily:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, article_id: {_eq: $article_id}}) {
      article_id
      crossed_100_users
      crossed_75_users
      crossed_25_users
		  crossed_50_users
      entered_users
    }

    ArticleExitDistributionDaily:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, article_id: {_eq: $article_id}}, order_by: {recirculation_count: desc_nulls_last}, limit: 5) {
      page_title
      period_date
      next_page_title
      recirculation_count
      users
      article_id
      next_page_article_id
    }

    ArticleHourlyAverage:${Reactenv.content_analytics_entity_prefix}articles_hourly_average(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}}) {
      article_id
      page_views
      hour
      users
    }

    Internal:${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    Social:${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    Refferal:${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      refr_urlhost
      users
    }

    Search:${Reactenv.content_analytics_entity_prefix}articles_top_medium_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }
  }
`;

const HISTORICAL_CHART_VIEW = `
${Reactenv.content_analytics_entity_prefix}query historical_view($site_id: String!, $start_date: String!, $end_date: String!) {
  ${Reactenv.content_analytics_entity_prefix}historical_view(where: {site_id: {_eq: $site_id}, period_date: {_gte: $start_date, _lte:$end_date}}) {
      pageviews
      users
      period_date
    }
  }
`;

const GET_MONTHLY_DATA = `
  query ${Reactenv.content_analytics_entity_prefix}articles_monthly($site_id: String!, $article_id: String!, $period_month: Int, $period_year: Int) {
    ArticleMonthly:${Reactenv.content_analytics_entity_prefix}articles_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      article_id
      country_distribution
      device_distribution
      social_distribution
      city_distribution
      referrer_distribution
      bounce_rate
      attention_time
      period_year
      total_time_spent
      average_time_spent
      readability
      article {
        title
        published_date
        category
      }
      page_views
      users
      new_users
      exit_page_distribution
    }
    ReadabilityMetrics:${Reactenv.content_analytics_entity_prefix}articles_monthly_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      nodes {
        readability
        attention_time
        article_id
      }
      aggregate {
        avg {
          readability
        }
      }
    }
    ArticleMonthlyAgg:${Reactenv.content_analytics_entity_prefix}articles_monthly_aggregate(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
        }
      }
    }

    ArticleExitDistributionMonthlyAgg:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_monthly_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}}) {
      aggregate {
        avg {
          recirculation_count
        }
        sum {
          recirculation_count
        }
      }
    }

    ArticleScrollDepthMonthly:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      article_id
      crossed_100_users
      crossed_75_users
      crossed_25_users
		  crossed_50_users
      entered_users
    }

    ArticleExitDistributionMonthly:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}, order_by: {recirculation_count: desc_nulls_last}, limit: 5) {
      page_title
      next_page_title
      recirculation_count
      users
      period_month
      next_page_article_id
    }

    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }
    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }
    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      refr_urlhost
      users
    }
    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    ArticleDaily:${Reactenv.content_analytics_entity_prefix}articles_daily(where: {article_id: {_eq: $article_id}, site_id: {_eq: $site_id}}) {
      article_id
      page_views
      users
      period_date
    }
  }
`;

const GET_YEARLY_DATA = `
  query ${Reactenv.content_analytics_entity_prefix}articles_yearly($site_id: String!, $article_id: String!, $period_year: Int) {
    ArticleYearly:${Reactenv.content_analytics_entity_prefix}articles_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      article_id
      country_distribution
      device_distribution
      city_distribution
      social_distribution
      referrer_distribution
      bounce_rate
      attention_time
      total_time_spent
      average_time_spent
      readability
      article {
        title
        published_date
        category
      }
      page_views
      users
      new_users
      exit_page_distribution
    }
    ReadabilityMetrics:${Reactenv.content_analytics_entity_prefix}articles_yearly_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      nodes {
        readability
        attention_time
        article_id
      }
      aggregate {
        avg {
          readability
        }
      }
    }
    ArticleYearlyAgg:${Reactenv.content_analytics_entity_prefix}articles_yearly_aggregate(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
        }
      }
    }

    ArticleExitDistributionYearlyAgg:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_yearly_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      aggregate {
        avg {
          recirculation_count
        }
        sum {
          recirculation_count
        }
      }
    }

    ArticleScrollDepthYearly:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      article_id
      crossed_100_users
      crossed_75_users
      crossed_25_users
		  crossed_50_users
      entered_users
    }

    ArticleExitDistributionYearly: ${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}},  order_by: {recirculation_count: desc_nulls_last}, limit: 5) {
      page_title
      next_page_title
      recirculation_count
      users
      next_page_article_id
      period_year
    }

    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }
    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }
    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id},article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      refr_urlhost
      users
    }
    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_yearly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    ArticleMonthly:${Reactenv.content_analytics_entity_prefix}articles_monthly(where: {article_id: {_eq: $article_id}, site_id: {_eq: $site_id}}) {
      article_id
      page_views
      users
      period_month
      period_year
    }
  }
`;

const GET_QUARTERLY_DATA = `
  query ${Reactenv.content_analytics_entity_prefix}articles_quarterly($site_id: String!, $article_id: String!, $period_year: Int, $period_quarter: Int) {
    ArticleQuaterly:${Reactenv.content_analytics_entity_prefix}articles_quarterly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}) {
      article_id
      country_distribution
      device_distribution
      city_distribution
      social_distribution
      referrer_distribution
      bounce_rate
      attention_time
      total_time_spent
      average_time_spent
      readability
      article {
        title
        published_date
        category
      }
      page_views
      users
      new_users
      exit_page_distribution
    }
    ReadabilityMetrics:${Reactenv.content_analytics_entity_prefix}articles_quarterly_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_quarter: {_eq: $period_quarter}, period_year: {_eq: $period_year}}) {
      nodes {
        readability
        attention_time
        article_id
      }
      aggregate {
        avg {
          readability
        }
      }
    }
    ArticleQuaterlyAgg:${Reactenv.content_analytics_entity_prefix}articles_quarterly_aggregate(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}) {
      aggregate {
        avg {
          total_time_spent
          bounce_rate
        }
      }
    }

    ArticleExitDistributionQuaterlyAgg:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_quarterly_aggregate(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}}) {
      aggregate {
        avg {
          recirculation_count
        }
        sum {
          recirculation_count
        }
      }
    }

    ArticleScrollDepthQuaterly:${Reactenv.content_analytics_entity_prefix}article_scrolldepth_quarterly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}) {
      article_id
      crossed_100_users
      crossed_75_users
      crossed_25_users
		  crossed_50_users
      entered_users
    }

    ArticleExitDistributionQuaterly:${Reactenv.content_analytics_entity_prefix}article_exitpage_distribution_quarterly(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}},  order_by: {recirculation_count: desc_nulls_last}, limit: 5) {
      page_title
      next_page_title
      recirculation_count
      users
      next_page_article_id
      period_quarter
    }

    Internal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, article_id: {_eq: $article_id}, refr_medium: {_eq: "internal"}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quarter}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    Social: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, article_id: {_eq: $article_id}, refr_medium: {_eq: "social"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    Refferal: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, article_id: {_eq: $article_id}, refr_medium: {_eq: "unknown"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      refr_urlhost
      users
    }

    Search: ${Reactenv.content_analytics_entity_prefix}articles_top_medium_quarter(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quarter}, article_id: {_eq: $article_id}, refr_medium: {_eq: "search"}, period_year: {_eq: $period_year}}, order_by: {users: desc_nulls_last}, limit: 1) {
      article_id
      page_urlpath
      refr_medium
      refr_source
      users
    }

    ArticleMonthly:${Reactenv.content_analytics_entity_prefix}articles_monthly(where: {article_id: {_eq: $article_id}, site_id: {_eq: $site_id}}) {
      article_id
      page_views
      users
      period_month
    }
  }
`;

const ARTICLE_LIST = `
  query articles($site_id: String!, $article_id: String!) {
    ${Reactenv.content_analytics_entity_prefix}articles(where: {article_id: {_neq: $article_id}, site_id: {_eq: $site_id}, article_daily: { page_views: { _is_null: false }}}, limit: 5, order_by: { article_daily: { page_views: desc } }) {
      title
      article_id
      article_daily {
        page_views
      }
    }
  }
`;

export {
  ARTICLE_DETAILS,
  HISTORICAL_CHART_VIEW,
  GET_MONTHLY_DATA,
  GET_YEARLY_DATA,
  GET_QUARTERLY_DATA,
  ARTICLE_LIST
};
