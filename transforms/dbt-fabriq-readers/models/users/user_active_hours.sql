{{ config(materialized='incremental',unique_key = ['domain_userid', 'date', 'hour'], schema='public', tags="hourly_run") }}

with web_page_views as (
    select * from {{ ref('snowplow_web_page_views') }}
	{% if is_incremental() %}
    where  date(collector_tstamp) >= (select max(date("date")) from {{this}})
    {% endif %}
)

SELECT app_id as site_id,
       web_user_mapping.user_id,
       domain_userid,
       Date(collector_tstamp) as date,
       Extract(hour FROM collector_tstamp) AS hour,
       Count(page_view_id)as pageviews,
       s.org_id,
       CURRENT_TIMESTAMP AS updated_time
FROM web_page_views
       LEFT JOIN {{ ref('snowplow_web_user_mapping') }}
                 web_user_mapping using (domain_userid)
       INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = web_page_views.app_id
       GROUP BY domain_userid, date, hour, app_id, org_id, web_user_mapping.user_id