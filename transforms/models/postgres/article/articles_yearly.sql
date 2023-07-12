{{ config(materialized='incremental',unique_key = ['period_year', 'page_views', 'attention_time', 'users'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),

devices AS (
    SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
       	COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp), device, content_id
),
referrers AS (
    SELECT
       
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        COALESCE(refr_medium, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp), referrer, content_id
),
countries AS (
    SELECT
         EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        geo_country AS country,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp), country, content_id
),
socials AS (
       SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        COALESCE(refr_source , 'Unknown') AS social,        
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp), social, content_id
),
session_counts AS (
    SELECT
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        content_id,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp), domain_sessionid, content_id
),
total_time_spent AS (
    SELECT
        content_id as content_id,
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        SUM(engaged_time_in_s) AS total_time
    FROM
        content cba
    GROUP BY
         EXTRACT(YEAR FROM derived_tstamp), content_id
),
average_time_spent AS (
    SELECT
        content_id as content_id,
        EXTRACT(YEAR FROM derived_tstamp) AS period_year,
        (avg(engaged_time_in_s)) :: integer AS average_time
    FROM
        content cba
    GROUP BY
         EXTRACT(YEAR FROM derived_tstamp), content_id
),
article_yearly AS (
    SELECT
        app_id AS site_id,        
        EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        cba.content_id as article_id,
        COUNT(distinct page_view_id) AS page_views,
        COUNT(CASE WHEN domain_sessionidx = 1 THEN 1 ELSE NULL END) AS new_users,
        SUM(CASE WHEN session_page_views = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT cba.domain_sessionid)::decimal AS bounce_rate,
        AVG(session_page_views) AS pageviews_per_session,
        COUNT(cba.domain_sessionid)::DECIMAL / COUNT(DISTINCT domain_userid)::DECIMAL AS session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'yearly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    JOIN session_counts ON EXTRACT(YEAR FROM derived_tstamp) = session_counts.period_year and session_counts.content_id = cba.content_id
    GROUP BY app_id, EXTRACT(YEAR FROM derived_tstamp), cba.content_id
)

select
	article_yearly.site_id,
	article_yearly.article_id,
	article_yearly.page_views,
	article_yearly.new_users,
	article_yearly.bounce_rate,
	article_yearly.pageviews_per_session,
	article_yearly.session_per_user,
	article_yearly.users,
	article_yearly.attention_time,
	article_yearly.created_at,
	article_yearly.time_of_day,
	article_yearly.frequency,
	article_yearly.key_words,
	article_yearly.exit_page_distribution,
    CAST(article_yearly.period_year AS integer) as period_year,
	(
	select
		total_time
	from
		total_time_spent
	where
		total_time_spent.period_year = article_yearly.period_year
		and
		total_time_spent.content_id = article_yearly.article_id) as total_time_spent,
	(
	select
		average_time
	from
		average_time_spent
	where
		average_time_spent.period_year = article_yearly.period_year
		and
		average_time_spent.content_id = article_yearly.article_id) as average_time_spent,
	(
	select
		JSON_OBJECT_AGG(country,
		cnt)
	from
		countries
	where
		countries.period_year = article_yearly.period_year
		and
		countries.content_id = article_yearly.article_id) as country_distribution,
	(
	select
		JSON_OBJECT_AGG(referrer,
		cnt)
	from
		referrers
	where
		referrers.period_year = article_yearly.period_year
		and
		referrers.content_id = article_yearly.article_id) as referrer_distribution,
	(
	select
		JSON_OBJECT_AGG(device,
		cnt)
	from
		devices
	where
		devices.period_year = article_yearly.period_year
		and
		devices.content_id = article_yearly.article_id) as device_distribution,
    (
	select
		JSON_OBJECT_AGG(social,
		cnt)
	from
		socials
	where
		socials.period_year = article_yearly.period_year
		and
		socials.content_id = article_yearly.article_id) as social_distribution,
        s.org_id

from
	article_yearly
	INNER JOIN sites s ON s.site_id = article_yearly.site_id

