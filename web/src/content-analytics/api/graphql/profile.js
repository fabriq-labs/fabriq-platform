// Profile Query
import Reactenv from "./utils/settings";

const PROFILE_DATA = `
query GetUserOverview($id: String, $site_id: String) {
  ${Reactenv.content_analytics_entity_prefix}user_overview(where: {_or: [{domain_userid: {_eq: $id}}, {user_id: {_eq: $id}}], site_id: {_eq: $site_id}}, limit: 1) {
    average_engaged_time
    engaged_time_in_s
    last_session_engaged_time_in_s
    page_views
    sessions
    domain_userid
    network_userid
    end_tstamp
    model_tstamp
    start_tstamp
    user_id
    site_id
    last_session_device_class
    last_session_geo_city
    last_session_geo_country
    last_session_referrer
    last_session_refr_medium
    last_page_url
    last_page_title
    last_session_refr_source
    top_categories
    top_authors
  }
}

`;

const PROFILE_LAST_SEVEN_DAYS_DATA = `
query Getlats7daysdata($id: String, $start_date: date, $end_date: date, $site_id: String) {
  ${Reactenv.content_analytics_entity_prefix}user_active_hours(where: {_or: [{domain_userid: {_eq: $id}}, {user_id: {_eq: $id}}], date: {_gte: $start_date, _lte: $end_date}, site_id: {_eq: $site_id}}, order_by: {date: desc}) {
    domain_userid
    hour
    updated_time
    pageviews
    date
    user_id
    site_id
    org_id
  }
}
`;

const PROFILE_LAST_SESSION_DETAILS = `
query GetUserLastSession($id: String, $site_id: String) {
  ${Reactenv.content_analytics_entity_prefix}user_last_session_pageviews(where: {site_id: {_eq: $site_id}, _or: [{domain_userid: {_eq: $id}}, {user_id: {_eq: $id}}]}, order_by: {collector_tstamp: desc}) {
    domain_userid
    user_id
    updated_time
    site_id
    page_view_id
    page_url
    page_title
    network_userid
    domain_sessionid
    collector_tstamp
    org_id
  }
}
`;

export {
  PROFILE_DATA,
  PROFILE_LAST_SEVEN_DAYS_DATA,
  PROFILE_LAST_SESSION_DETAILS
};
