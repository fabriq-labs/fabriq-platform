{{ config(materialized='incremental',unique_key = ['app_id','ga_date','ga_operatingsystem','ga_devicecategory','ga_browser'], schema='derived') }}

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


temp_devices as (   
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
	    operating_system_name as t1_ga_operatingsystem,
	    operating_system_class as t1_ga_devicecategory,
	    agent_name as t1_ga_browser
	from web_sessions 
	    group by app_id,
		operating_system_name,
	    operating_system_class,
	    agent_name, date(start_tstamp)) t1
	FULL OUTER JOIN (SELECT
		app_id as t2_app_id,
	    date(collector_tstamp) as t2_ga_date,
	    SUM(engaged_time_in_s)::decimal / COUNT(DISTINCT domain_userid)::decimal as ga_avgtimeonpage,
	    COUNT(DISTINCT CASE WHEN page_view_in_session_index = page_views_in_session THEN page_view_id END)::decimal / count(DISTINCT page_view_id)::decimal as ga_exitrate,
	    COUNT(DISTINCT page_view_id) AS ga_pageviews,
	    operating_system_name as t2_ga_operatingsystem,
	    operating_system_class as t2_ga_devicecategory,
	    agent_name as t2_ga_browser
	FROM web_page_views
	    GROUP BY app_id,
		operating_system_name,
	    operating_system_class,
	    agent_name, date(collector_tstamp)) t2
	on t1_ga_date = t2_ga_date
		and t1_app_id = t2_app_id
		and coalesce(t1_ga_operatingsystem,'') = coalesce(t2_ga_operatingsystem,'')
		and coalesce(t1_ga_devicecategory,'') = coalesce(t2_ga_devicecategory,'')
		and coalesce(t1_ga_browser,'') = coalesce(t2_ga_browser,'')
),

devices as (
    select
	    CURRENT_TIMESTAMP AS updated_time, 
		coalesce(t1_app_id, t2_app_id) as app_id,
        coalesce(t1_ga_date, t2_ga_date) as ga_date,
        coalesce(t1_ga_operatingsystem, t2_ga_operatingsystem) as ga_operatingsystem,
        coalesce(t1_ga_devicecategory, t2_ga_devicecategory) as ga_devicecategory,
        coalesce(t1_ga_browser, t2_ga_browser) as ga_browser,
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
    from  temp_devices
)

select * from devices