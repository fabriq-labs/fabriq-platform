{{ config(materialized='table', sort=['domain_userid','collector_tstamp'],
          dist='domain_userid', schema='derived') }}

SELECT user_overview.site_id,
       user_overview.user_id,
       user_overview.domain_userid,
       user_overview.network_userid,
       user_overview.last_domain_sessionid as domain_sessionid,
       user_overview.org_id,
       web_page_views.page_view_id,
       web_page_views.collector_tstamp,
       web_page_views.page_title,
       web_page_views.page_url,
       CURRENT_TIMESTAMP AS updated_time
FROM   {{ ref('user_overview') }} user_overview
       LEFT JOIN {{ ref('snowplow_web_page_views') }} web_page_views
              ON web_page_views.domain_sessionid = user_overview.last_domain_sessionid 