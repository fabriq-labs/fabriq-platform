{{ config(materialized='incremental',unique_key = ['site_id', 'article_id', 'period_quarter','period_year' ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
devices AS (
    SELECT
       EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
       EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        content_id,
       	COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp),EXTRACT(QUARTER FROM derived_tstamp), device, content_id
),
referrers AS (
    SELECT
       
        EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
        EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        content_id,
        COALESCE(refr_medium, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp),EXTRACT(QUARTER FROM derived_tstamp), referrer, content_id
),
countries AS (
    SELECT
         EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
         EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        content_id,
        geo_country AS country,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp),EXTRACT(QUARTER FROM derived_tstamp), country, content_id
),
socials AS (
       SELECT
        EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
        EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        content_id,
        COALESCE(refr_source , 'Unknown') AS social,        
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM derived_tstamp),EXTRACT(QUARTER FROM derived_tstamp), social, content_id
),
session_counts AS (
    SELECT
        EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
        EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        content_id,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    GROUP BY EXTRACT(YEAR FROM derived_tstamp),EXTRACT(QUARTER FROM derived_tstamp), domain_sessionid, content_id
),

article_quarterly AS (
    SELECT
        app_id AS site_id,        
        EXTRACT(QUARTER FROM derived_tstamp) AS  period_quarter,
        EXTRACT(YEAR FROM derived_tstamp) AS  period_year,
        cba.content_id as article_id,
        COUNT(distinct page_view_id) AS page_views,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN cba.domain_sessionid ELSE NULL END) AS new_users,
        SUM(case when page_views_in_session = 1 then 1 else 0 end)::decimal / COUNT(distinct cba.domain_sessionid)::decimal as bounce_rate,
        COUNT(DISTINCT cba.domain_sessionid)::DECIMAL / COUNT(distinct domain_userid)::DECIMAL as session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        SUM(engaged_time_in_s) AS total_time_spent,
        (SUM(engaged_time_in_s) / COUNT(DISTINCT domain_userid))::integer AS average_time_spent,
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'quarterly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    GROUP BY app_id, EXTRACT(QUARTER FROM derived_tstamp),EXTRACT(YEAR FROM derived_tstamp), cba.content_id
)

select
    article_quarterly.site_id,
	article_quarterly.article_id,
	article_quarterly.page_views,
	article_quarterly.new_users,
	article_quarterly.bounce_rate,
	article_quarterly.session_per_user,
	article_quarterly.users,
	article_quarterly.attention_time,
	article_quarterly.total_time_spent,
	article_quarterly.average_time_spent,
	article_quarterly.created_at,
	article_quarterly.time_of_day,
	article_quarterly.frequency,
	article_quarterly.key_words,
	article_quarterly.exit_page_distribution,
    CAST(article_quarterly.period_quarter AS integer) as period_quarter,
    CAST(article_quarterly.period_year AS integer) as period_year,
	(
        SELECT avg(session_page_views)
        FROM session_counts sc
        WHERE sc.period_quarter = article_quarterly.period_quarter  AND sc.period_year = article_quarterly.period_year  AND  
        sc.content_id = article_quarterly.article_id
    ) AS pageviews_per_session,
	(
	select
		JSON_OBJECT_AGG(COALESCE(country, 'Unknown'), cnt)
	from
		countries
	where
		countries.period_quarter = article_quarterly.period_quarter and countries.period_year = article_quarterly.period_year and
		countries.content_id = article_quarterly.article_id) as country_distribution,
	(
	select
		JSON_OBJECT_AGG(referrer,
		cnt)
	from
		referrers
	where
		referrers.period_quarter = article_quarterly.period_quarter and referrers.period_year = article_quarterly.period_year and
		referrers.content_id = article_quarterly.article_id) as referrer_distribution,
	(
	select
		JSON_OBJECT_AGG(device,
		cnt)
	from
		devices
	where
		devices.period_quarter = article_quarterly.period_quarter and devices.period_year = article_quarterly.period_year and
		devices.content_id = article_quarterly.article_id) as device_distribution,
	(
	select
		JSON_OBJECT_AGG(social,
		cnt)
	from
		socials
	where
		socials.period_quarter = article_quarterly.period_quarter and socials.period_year = article_quarterly.period_year and
		socials.content_id = article_quarterly.article_id) as social_distribution,
        s.org_id

from
	article_quarterly
	INNER JOIN sites s ON s.site_id = article_quarterly.site_id