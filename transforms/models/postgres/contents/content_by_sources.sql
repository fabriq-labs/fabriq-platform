{{ config(materialized='incremental',unique_key = ['domain_userid', 'source', 'operating_system_class', 'page_urlhost', 'geo_country', 'geo_city', 'date'], schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE( (select max(date(date)) from {{this}}) , '{{ var('snowplow_web')['snowplow__start_date'] }}')
    {% endif %}
),

sources as (
select CURRENT_TIMESTAMP AS updated_time,date(collector_tstamp) as date, domain_userid, count(page_view_id) as page_view_count,
mkt_source as source,
max(CASE WHEN domain_sessionidx = 1 THEN 1 ELSE 0 end) as is_new_user,
sum(engaged_time_in_s) as time_spent_by_user,
max(CASE WHEN vertical_percentage_scrolled >= 100 THEN 1 ELSE 0 end) as is_user_vertical_scrolled_completely,
max(CASE WHEN page_view_in_session_index != page_views_in_session THEN 1 ELSE 0 end) as is_user_navigated_to_another_page,
operating_system_class, page_urlhost, geo_country, geo_city
from content dc 
group by domain_userid, mkt_source, operating_system_class, page_urlhost, geo_country, geo_city, date)

select * from sources


