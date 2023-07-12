{{ config(materialized='incremental',unique_key = ['period_date','period_month', 'period_year', 'page_views', 'attention_time', 'users'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
operating_systems AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(operating_system_name , 'Unknown') AS operating_system,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), operating_system, content_id
),
operating_systems_monthly AS (
    SELECT
        EXTRACT(MONTH FROM derived_tstamp) AS period_month,
        content_id,
       COALESCE(operating_system_name , 'Unknown') AS operating_system_month,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(MONTH FROM derived_tstamp), operating_system_month, content_id
),
operating_systems_yearly AS (
       SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        COALESCE(operating_system_name , 'Unknown') AS operating_system_year,        
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp), operating_system_year, content_id
),
devices AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), device, content_id
),
devices_monthly AS (
    SELECT
        EXTRACT(MONTH FROM derived_tstamp) AS period_month,
        content_id,
       COALESCE(device_class , 'Unknown') AS device_month,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(MONTH FROM derived_tstamp), device_month, content_id
),
devices_yearly AS (
       SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        COALESCE(device_class , 'Unknown') AS device_year,        
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp), device_year, content_id
),
social_daily AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(refr_source, 'Unknown') AS social,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), social, content_id
),
social_monthly AS (
    SELECT
        EXTRACT(MONTH FROM derived_tstamp) AS period_month,
        content_id,
       COALESCE(refr_source , 'Unknown') AS social_month,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(MONTH FROM derived_tstamp), social_month, content_id
),
social_yearly AS (
       SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        COALESCE(refr_source , 'Unknown') AS social_year,        
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp), social_year, content_id
),
medium_daily AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        CASE
            WHEN refr_medium IN ('social', 'social-media') THEN 'Social'
            WHEN refr_medium = 'internal' THEN 'Internal'
            WHEN refr_medium = 'direct' THEN 'Direct'
            WHEN refr_medium = 'referral' THEN 'Referral'
            ELSE 'Other'
        END AS medium,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), medium, content_id
),
medium_monthly AS (
    SELECT
        EXTRACT(MONTH FROM derived_tstamp) AS period_month,
        content_id,
        CASE
            WHEN refr_medium IN ('social', 'social-media') THEN 'Social'
            WHEN refr_medium = 'internal' THEN 'Internal'
            WHEN refr_medium = 'direct' THEN 'Direct'
            WHEN refr_medium = 'referral' THEN 'Referral'
            ELSE 'Other'
        END AS medium_month,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(MONTH FROM derived_tstamp), medium_month, content_id
),
medium_yearly AS (
       SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        CASE
            WHEN refr_medium IN ('social', 'social-media') THEN 'Social'
            WHEN refr_medium = 'internal' THEN 'Internal'
            WHEN refr_medium = 'direct' THEN 'Direct'
            WHEN refr_medium = 'referral' THEN 'Referral'
            ELSE 'Other'
        END AS medium_year,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp), medium_year, content_id
),
session_counts AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), domain_sessionid, content_id
),
page_views_monthly AS (
    SELECT
        EXTRACT(MONTH FROM derived_tstamp) AS period_month,
        content_id,
        COUNT(DISTINCT page_view_id) AS page_views_month
    FROM content
    GROUP BY  EXTRACT(MONTH FROM derived_tstamp), page_view_id, content_id
),
traffice_source_daily AS (
    SELECT
        app_id AS site_id,        
        EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        EXTRACT(MONTH FROM derived_tstamp)as period_month,
        TO_CHAR(cba.derived_tstamp, 'YYYY-MM-DD') as period_date,
        cba.content_id as article_id,
        COUNT(page_view_id) AS page_views,
        COUNT(CASE WHEN domain_sessionidx = 1 THEN 1 ELSE NULL END) AS new_users,
        SUM(CASE WHEN session_page_views = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT cba.domain_sessionid)::decimal AS bounce_rate,
        AVG(session_page_views) AS pageviews_per_session,
        COUNT(cba.domain_sessionid)::DECIMAL / COUNT(DISTINCT domain_userid)::DECIMAL AS session_per_user,
        COUNT(domain_userid) AS users,
        
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'daily' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    JOIN session_counts ON TO_CHAR(derived_tstamp, 'YYYY-MM-DD') = session_counts.period_date
    GROUP BY app_id, TO_CHAR(cba.derived_tstamp, 'YYYY-MM-DD'), cba.content_id, EXTRACT(MONTH FROM derived_tstamp), EXTRACT(YEAR FROM derived_tstamp)
)
select
	traffice_source_daily.*,
	(
	select
		JSON_OBJECT_AGG(social,
		cnt)
	from
		social_daily
	where
		social_daily.period_date = traffice_source_daily.period_date and
		social_daily.content_id = traffice_source_daily.article_id) as social_distribution,
		(
	select
		JSON_OBJECT_AGG(social_month,
		cnt)
	from
		social_monthly
	where
		social_monthly.period_month = traffice_source_daily.period_month
		and
		social_monthly.content_id = traffice_source_daily.article_id) as social_distribution_month,
		(
	select
		JSON_OBJECT_AGG(social_year,
		cnt)
	from
		social_yearly
	where
		social_yearly.period_year = traffice_source_daily.period_year
		and
		social_yearly.content_id = traffice_source_daily.article_id) as social_distribution_year,
	 (
	select
		JSON_OBJECT_AGG(operating_system,
		cnt)
	from
		operating_systems
	where
		operating_systems.period_date = traffice_source_daily.period_date and
		operating_systems.content_id = traffice_source_daily.article_id) as operating_system,
		(
	select
		JSON_OBJECT_AGG(operating_system_month,
		cnt)
	from
		operating_systems_monthly
	where
		operating_systems_monthly.period_month = traffice_source_daily.period_month
		and
		operating_systems_monthly.content_id = traffice_source_daily.article_id) as operating_system_month,
		(
	select
		JSON_OBJECT_AGG(operating_system_year,
		cnt)
	from
		operating_systems_yearly
	where
		operating_systems_yearly.period_year = traffice_source_daily.period_year
		and
		operating_systems_yearly.content_id = traffice_source_daily.article_id) as operating_system_year,
	 (
	select
		JSON_OBJECT_AGG(device,
		cnt)
	from
		devices
	where
		devices.period_date = traffice_source_daily.period_date and
		devices.content_id = traffice_source_daily.article_id) as device_distribution,
		(
	select
		JSON_OBJECT_AGG(device_month,
		cnt)
	from
		devices_monthly
	where
		devices_monthly.period_month = traffice_source_daily.period_month
		and
		devices_monthly.content_id = traffice_source_daily.article_id) as device_distribution_month,
		(
	select
		JSON_OBJECT_AGG(device_year,
		cnt)
	from
		devices_yearly
	where
		devices_yearly.period_year = traffice_source_daily.period_year
		and
		devices_yearly.content_id = traffice_source_daily.article_id) as device_distribution_year,
		 (
	select
		JSON_OBJECT_AGG(medium,
		cnt)
	from
		medium_daily
	where
		medium_daily.period_date = traffice_source_daily.period_date and
		medium_daily.content_id = traffice_source_daily.article_id) as medium_distribution,
	(
	select
		JSON_OBJECT_AGG(medium_month,
		cnt)
	from
		medium_monthly
	where
		medium_monthly.period_month = traffice_source_daily.period_month
		and
		medium_monthly.content_id = traffice_source_daily.article_id) as medium_distribution_month,
		(
	select
		JSON_OBJECT_AGG(medium_year,
		cnt)
	from
		medium_yearly
	where
		medium_yearly.period_year = traffice_source_daily.period_year
		and
		medium_yearly.content_id = traffice_source_daily.article_id) as medium_distribution_year,
case
		when extract(month
	from
		traffice_source_daily.period_date::date) between 1 and 3 then 'Q1'
		when extract(month
	from
		traffice_source_daily.period_date::date) between 4 and 6 then 'Q2'
		when extract(month
	from
		traffice_source_daily.period_date::date) between 7 and 9 then 'Q3'
		when extract(month
	from
		traffice_source_daily.period_date::date) between 10 and 12 then 'Q4'
	end as quarter
from
	traffice_source_daily