// Article List Graphql
import Reactenv from "./utils/settings";

const REALTIME_VISITORS = `
  query realtime_visitors($period_date: String!, $limit: Int!, $site_id: String!) {
    daily_data: ${Reactenv.content_analytics_entity_prefix}articles_list_daily(where: {site_id: {_eq: $site_id}, period_date: {_eq: $period_date}}) {
      total_time_spent
      users
      average_time_spent
      attention_time
    }

    TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_daily(limit: $limit, order_by: {page_views: desc_nulls_last}, where: {period_date: {_eq: $period_date}, site_id: {_eq: $site_id}}) {
      page_views
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

const REALTIME_TABLE_SORT = `
  query realtime_table_list($period_date: String!, $site_id: String!, $order_by: ${Reactenv.content_analytics_entity_prefix}articles_daily_order_by!) {
    real_time_sort: ${Reactenv.content_analytics_entity_prefix}articles_daily(limit: 10, where: {period_date: {_eq: $period_date}, site_id: {_eq: $site_id}}, order_by: [$order_by]) {
      users
      total_time_spent
      site_id
      average_time_spent
      attention_time
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
      page_views
    }
  }
`;

const REALTIME_TABLE_FILTER_AUTHOR = `
  query realtime_table_list($period_date: String!,$site_id: String!, $filter_value: String!) {
    real_time_sort: ${Reactenv.content_analytics_entity_prefix}articles_daily(limit: 10, where: {period_date: {_eq: $period_date},site_id: {_eq: $site_id}, article: {authors: {name: {_eq: $filter_value}}}}, order_by: {page_views: desc}) {
        users
        total_time_spent
        site_id
        attention_time
        average_time_spent
        article {
          article_id
          title
          category
          published_date
          authors {
            name
            author_id
          }
        }
        page_views
      }
    }
`;

const REALTIME_TABLE_FILTER_CATEGORY = `
  query realtime_table_list($period_date: String!,$site_id: String!, $filter_value: String!) {
    real_time_sort: ${Reactenv.content_analytics_entity_prefix}articles_daily(limit: 10, where: {period_date: {_eq: $period_date},site_id: {_eq: $site_id}, article: {category: {_eq: $filter_value}}}, order_by: {page_views: desc}) {
      users
      total_time_spent
      attention_time
      site_id
      average_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
      page_views
    }
  }
`;

const REALTIME_TABLE_FILTER_PUBLISHED_DATE = `
  query realtime_table_list($period_date: String!,$site_id: String!, $filter_value: String!) {
    real_time_sort: ${Reactenv.content_analytics_entity_prefix}articles_daily(limit: 10, where: {period_date: {_eq: $period_date},site_id: {_eq: $site_id}, article: {published_date: {_eq: $filter_value}}}, order_by: {page_views: desc}) {
      users
      total_time_spent
      site_id
      attention_time
      average_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
      page_views
    }
  }
`;


const MONTHLY_VISITORS = `
  query monthly_visitors($site_id: String!, $period_month: numeric, $period_year: numeric) {
    monthly_visitor_daily: ${Reactenv.content_analytics_entity_prefix}articles_list_daily(where: {site_id: {_eq: $site_id}}) {
      attention_time
      page_views
      period_date
      users
    }
    TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_monthly(limit: 10, order_by: {page_views: desc_nulls_last}, where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      page_views
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
    monthly_visitors: ${Reactenv.content_analytics_entity_prefix}articles_list_monthly(where: {site_id: {_eq: $site_id}, period_month: {_eq: $period_month}, period_year: {_eq: $period_year}}) {
      page_views
      users
      attention_time
      period_year
      total_time_spent
      average_time_spent
    }
  }
`;

const QUARTERLY_VISITORS = `
  query quaterly_visitors($site_id: String!, $period_quater: numeric, $period_year: numeric) {
    quarterly_visitors: ${Reactenv.content_analytics_entity_prefix}articles_list_monthly(where: {site_id: {_eq: $site_id}}) {
      attention_time
      page_views
      users
        period_month
      }
      TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(limit: 10, order_by: {page_views: desc_nulls_last}, where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}}) {
        page_views
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
      quarterly_visitors_list: ${Reactenv.content_analytics_entity_prefix}articles_list_quaterly(where: {site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quater}, period_year: {_eq: $period_year}}) {
        attention_time
        page_views
        users
        total_time_spent
        average_time_spent
      }
    }
`;

const YEARLY_VISITORS = `
  query yearly_visitors($site_id: String!,$period_year: numeric) {
    yearly_list_data: ${Reactenv.content_analytics_entity_prefix}articles_list_monthly(where: {site_id: {_eq: $site_id}}) {
      attention_time
      page_views
      users
      period_month
      period_year
    }
    TopPosts: ${Reactenv.content_analytics_entity_prefix}articles_yearly(limit: 10, order_by: {page_views: desc_nulls_last}, where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
      page_views
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
    yearly_list: ${Reactenv.content_analytics_entity_prefix}articles_list_yearly(where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}}) {
      attention_time
      page_views
      users
      total_time_spent
      average_time_spent
    }
  }
`;

const Monthly_TABLE_SORT = `
  query monthly_table_sort($site_id: String!, $period_month: numeric, $period_year: numeric, $order_by: ${Reactenv.content_analytics_entity_prefix}articles_monthly_order_by!) {
    monthly_data: ${Reactenv.content_analytics_entity_prefix}articles_monthly(limit: 10,where: {period_year: {_eq: $period_year}, site_id: {_eq: $site_id}, period_month: {_eq: $period_month}}, order_by: [$order_by]) {
      users
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        category
        title
        published_date
        authors {
          author_id
          name
        }
      }
      page_views
    }
  }
`;

const QUATERLY_TABLE_SORT = `
  query quaterly_table_sort($site_id: String!, $period_quater: numeric, $period_year: numeric, $order_by: ${Reactenv.content_analytics_entity_prefix}articles_quarterly_order_by!) {
    quarterly_data: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(limit: 10,where: {period_year: {_eq: $period_year}, site_id: {_eq: $site_id}, period_quarter: {_eq: $period_quater}}, order_by: [$order_by]) {
      users
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        category
        title
        published_date
        authors {
          author_id
          name
        }
      }
      page_views
    }
  }
`;

const YEARLY_TABLE_SORT = `
  query yearly_table_sort($site_id: String!, $period_year: numeric, $order_by: ${Reactenv.content_analytics_entity_prefix}articles_yearly_order_by!) {
    yearly_data: ${Reactenv.content_analytics_entity_prefix}articles_yearly(limit: 10,where: {period_year: {_eq: $period_year}, site_id: {_eq: $site_id}}, order_by: [$order_by]) {
      users
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        category
        title
        published_date
        authors {
          author_id
          name
        }
      }
      page_views
    }
  }
`;

const MONTHLY_TABLE_FILTER_AUTHOR = `
  query Monthly_Filter_Author($site_id: String!, $period_year: numeric, $period_month: numeric, $filter_value: String!) {
    monthly_data: ${Reactenv.content_analytics_entity_prefix}articles_monthly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, period_month: {_eq: $period_month}, article: {authors: {name: {_eq: $filter_value}}}}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

const Monthly_TABLE_FILTER_CATEGORY = `
  query Monthly_Filter_Category($site_id: String!, $period_year: numeric, $period_month: numeric, $filter_value: String!) {
    monthly_data: ${Reactenv.content_analytics_entity_prefix}articles_monthly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, period_month: {_eq: $period_month}, article: {authors: {}, category: {_eq: $filter_value}}}, order_by: {page_views: desc_nulls_last}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

const MONTHLY_TABLE_FILTER_PUBLISHED_DATE = `
  query Monthly_Filter_publishDate($site_id: String!, $period_year: numeric, $period_month: numeric, $filter_value: String!) {
    monthly_data: ${Reactenv.content_analytics_entity_prefix}articles_monthly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, period_month: {_eq: $period_month}, article: {authors: {}, published_date: {_eq: $filter_value}}}, order_by: {page_views: desc_nulls_last}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

const QUATERLY_TABLE_FILTER_PUBLISHED_DATE = `
  query Quaterly_Filter_publishDate($site_id: String!, $period_year: numeric, $period_quater: numeric, $filter_value: String!) {
    quarterly_data: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, article: {published_date: {_eq: $filter_value}}, period_quarter: {_eq: $period_quater}}, order_by: {page_views: desc_nulls_last}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

const QUATERLY_TABLE_FILTER_CATEGORY = `
  query Quaterly_Filter_Category($site_id: String!, $period_year: numeric, $period_quater: numeric, $filter_value: String!) {
    quarterly_data: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, article: {category: {_eq: $filter_value}}, period_quarter: {_eq: $period_quater}}, order_by: {page_views: desc_nulls_last}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

const QUARTERLY_TABLE_FILTER_AUTHOR = `
  query Quaterly_Filter_Author($site_id: String!, $period_year: numeric, $period_quater: numeric, $filter_value: String!) {
    quarterly_data: ${Reactenv.content_analytics_entity_prefix}articles_quarterly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, period_quarter: {_eq: $period_quater}, article: {authors: {name: {_eq: $filter_value}}}}) {
        article_id
        users
        site_id
        page_views
        attention_time
        average_time_spent
        total_time_spent
        article {
          article_id
          title
          category
          published_date
          authors {
            name
            author_id
          }
        }
      }
    }
`;

const YEARLY_TABLE_FILTER_AUTHOR = `
  query Yearly_Filter_Author($site_id: String!, $period_year: numeric, $filter_value: String!) {
    yearly_data: ${Reactenv.content_analytics_entity_prefix}articles_yearly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, article: {authors: {name: {_eq: $filter_value}}}}) {
        article_id
        users
        site_id
        page_views
        attention_time
        average_time_spent
        total_time_spent
        article {
          article_id
          title
          category
          published_date
          authors {
            name
            author_id
          }
        }
      }
    }
`;

const YEARLY_TABLE_FILTER_CATEGORY = `
  query Yearly_Filter_Category($site_id: String!, $period_year: numeric, $filter_value: String!) {
    yearly_data: ${Reactenv.content_analytics_entity_prefix}articles_yearly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, article: {category: {_eq: $filter_value}}}, order_by: {page_views: desc_nulls_last}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

const YEARLY_TABLE_FILTER_PUBLISHED_DATE = `
  query Yearly_Filter_PublishedDate($site_id: String!, $period_year: numeric, $filter_value: String!) {
    yearly_data: ${Reactenv.content_analytics_entity_prefix}articles_yearly(limit: 10,where: {site_id: {_eq: $site_id}, period_year: {_eq: $period_year}, article: {published_date: {_eq: $filter_value}}}, order_by: {page_views: desc_nulls_last}) {
      article_id
      users
      site_id
      page_views
      attention_time
      average_time_spent
      total_time_spent
      article {
        article_id
        title
        category
        published_date
        authors {
          name
          author_id
        }
      }
    }
  }
`;

export {
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
};
