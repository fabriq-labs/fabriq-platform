{{ config(materialized='incremental',unique_key = ['period_date', 'quarter', 'page_views', 'attention_time', 'users'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
referrers AS (
    SELECT
       
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(refr_urlhost, 'Unknown') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), referrer, content_id
),
countries AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        geo_country AS country,
        COUNT(domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), country, content_id
),
countries_month AS (
    SELECT
         EXTRACT(MONTH FROM derived_tstamp) AS period_month,
        content_id,
        geo_country AS country,
        COUNT(domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(MONTH FROM derived_tstamp), country, content_id
),
countries_year AS (
    SELECT
         EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        geo_country AS country,
        COUNT(domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp), country, content_id
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
article_daily AS (
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
        'hourly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    JOIN session_counts ON TO_CHAR(derived_tstamp, 'YYYY-MM-DD') = session_counts.period_date
    GROUP BY app_id, TO_CHAR(cba.derived_tstamp, 'YYYY-MM-DD'), cba.content_id, EXTRACT(MONTH FROM derived_tstamp), EXTRACT(YEAR FROM derived_tstamp)
)

select
case
		when extract(month
	from
		article_daily.period_date::date) between 1 and 3 then 'Q1'
		when extract(month
	from
		article_daily.period_date::date) between 4 and 6 then 'Q2'
		when extract(month
	from
		article_daily.period_date::date) between 7 and 9 then 'Q3'
		when extract(month
	from
		article_daily.period_date::date) between 10 and 12 then 'Q4'
	end as quarter,
	article_daily.*,
	(
	select
		JSON_OBJECT_AGG(referrer,
		cnt)
	from
		referrers
	where
		referrers.period_date = article_daily.period_date) as referrer_distribution,
		 (
	select
		JSON_OBJECT_AGG(country,
		cnt)
	from
		countries
	where
		countries.period_date = article_daily.period_date and
		countries.content_id = article_daily.article_id) as country_distribution,
	(
	select
		JSON_OBJECT_AGG(country,
		cnt)
	from
		countries_month
	where
		countries_month.period_month = article_daily.period_month
		and
		countries_month.content_id = article_daily.article_id) as country_distribution_month,
		(
	select
		JSON_OBJECT_AGG(country,
		cnt)
	from
		countries_year
	where
		countries_year.period_year = article_daily.period_year
		and
		countries_year.content_id = article_daily.article_id) as country_distribution_year,
		s.org_id

from
	article_daily
	inner join sites s  on s.site_id = article_daily.site_id

