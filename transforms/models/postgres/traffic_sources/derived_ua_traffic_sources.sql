{{ config(materialized='incremental',unique_key = ['app_id','ga_date','ga_medium','ga_source'], schema='derived') }}

with web_sessions as (
    select * from {{ ref('snowplow_web_sessions') }}
	 {% if is_incremental() %}
    where  date(start_tstamp) >= COALESCE((select max(date(ga_date)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),

web_page_views as (
    select * from {{ ref('snowplow_web_page_views') }}
	{% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(ga_date)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),

temp_traffic_sources as (   
	SELECT *
        FROM (select app_id as t1_app_id,
		date(start_tstamp) as t1_ga_date,
	    SUM(engaged_time_in_s)::decimal / COUNT(DISTINCT domain_sessionid)::decimal as  ga_avgsessionduration,
	    SUM(CASE WHEN page_views = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT domain_sessionid)::decimal AS ga_bouncerate,
	    COUNT(CASE WHEN domain_sessionidx = 1 then 1 else null end) as ga_newusers,
	    Avg(page_views) as ga_pageviewspersession,
	    COUNT(domain_sessionid) as ga_sessions,
	    COUNT(domain_sessionid)::decimal / COUNT(DISTINCT domain_userid)::decimal as ga_sessionsperuser,
	    COUNT(distinct domain_userid) as ga_users,
	    mkt_medium as t1_ga_medium,
        mkt_source as t1_ga_source
	from web_sessions
	    group by app_id,
		mkt_medium,
	    mkt_source,
        date(start_tstamp)) t1
	FULL OUTER JOIN (SELECT
		app_id as t2_app_id,
	    date(collector_tstamp) as t2_ga_date,
	    SUM(engaged_time_in_s)::decimal / COUNT(DISTINCT domain_userid)::decimal as ga_avgtimeonpage,
	    COUNT(DISTINCT CASE WHEN page_view_in_session_index = page_views_in_session THEN page_view_id END)::decimal / count(DISTINCT page_view_id)::decimal as ga_exitrate,
	    COUNT(DISTINCT page_view_id) AS ga_pageviews,
	    mkt_medium as t2_ga_medium,
        mkt_source as t2_ga_source
	FROM web_page_views
	    GROUP BY app_id,
		mkt_medium,
	    mkt_source,
        date(collector_tstamp)) t2
	on t1_ga_date = t2_ga_date
		and t1_app_id = t2_app_id
		and coalesce(t1_ga_medium,'') = coalesce(t2_ga_medium,'')
		and coalesce(t1_ga_source,'') = coalesce(t2_ga_source,'')
),

traffic_sources as (
    select
	    CURRENT_TIMESTAMP AS updated_time,
		coalesce(t1_app_id, t2_app_id) as app_id, 
        coalesce(t1_ga_date, t2_ga_date) as ga_date,
        coalesce(t1_ga_medium, t2_ga_medium) as ga_medium,
        coalesce(t1_ga_source, t2_ga_source) as ga_source,
        ga_avgsessionduration,
        ga_avgtimeonpage,
        ga_bouncerate,
        ga_exitrate,
        ga_newusers,
        ga_pageviews,
        ga_pageviewspersession,
        ga_sessions,
        ga_sessionsperuser,
        ga_users
    from  temp_traffic_sources
)

select * from traffic_sources