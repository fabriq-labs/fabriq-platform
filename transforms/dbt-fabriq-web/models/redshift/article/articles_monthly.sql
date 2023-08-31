{{ config(materialized='incremental',unique_key = ['site_id', 'article_id', 'period_month', 'period_year'  ], sort=['site_id', 'article_id', 'period_month', 'period_year' ],
    dist='article_id', schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this, 'monthly') }}
    {% endif %}
),devices AS (
    SELECT
        EXTRACT(MONTH FROM custom_tstamp) AS period_month,
        EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        content_id,
       	COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM custom_tstamp),EXTRACT(MONTH FROM custom_tstamp), device, content_id
),
referrers AS (
    SELECT
       
        EXTRACT(MONTH FROM custom_tstamp) AS period_month,
        EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        content_id,
        COALESCE(refr_medium, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM custom_tstamp),EXTRACT(MONTH FROM custom_tstamp), referrer, content_id
),
countries AS (
    SELECT
         EXTRACT(MONTH FROM custom_tstamp) AS period_month,
         EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        content_id,
        geo_country AS country,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY EXTRACT(YEAR FROM custom_tstamp),EXTRACT(MONTH FROM custom_tstamp), country, content_id
),
city AS (
    SELECT
        EXTRACT(MONTH FROM custom_tstamp) AS period_month,
        EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        geo_country AS country,
        geo_city AS city,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id,
		content_id
    FROM content
    GROUP BY app_id, content_id, geo_country, geo_city, EXTRACT(YEAR FROM custom_tstamp),EXTRACT(MONTH FROM custom_tstamp)
),
ranked_cities AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY country, content_id, period_month, period_year ORDER BY cnt DESC) AS city_rank
    FROM city
),
country_wise_city AS (
    SELECT
        '{' || LISTAGG('"' || city || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY city) || '}' AS cities,
        country,
        period_month,
        period_year,
		content_id,
		app_id
    FROM ranked_cities
    WHERE city_rank <= 8
    GROUP BY app_id,content_id, country, period_year,period_month
),
socials AS (
    SELECT
        EXTRACT(MONTH FROM custom_tstamp) AS period_month,
        EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        content_id,
       COALESCE(refr_source , 'Unknown') AS social,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  EXTRACT(YEAR FROM custom_tstamp),EXTRACT(MONTH FROM custom_tstamp), social, content_id
),
session_counts AS (
    SELECT
        EXTRACT(MONTH FROM custom_tstamp) AS period_month,
        EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        content_id,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    GROUP BY EXTRACT(YEAR FROM custom_tstamp),EXTRACT(MONTH FROM custom_tstamp), domain_sessionid, content_id
),
article_monthly AS (
    SELECT
        app_id AS site_id,        
        EXTRACT(YEAR FROM custom_tstamp) AS  period_year,
        EXTRACT(MONTH FROM custom_tstamp)as period_month,
        cba.content_id as article_id,
        COUNT(DISTINCT page_view_id) AS page_views,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN cba.domain_sessionid ELSE NULL END) AS new_users,
        SUM(case when page_views_in_session = 1 then 1 else 0 end)::decimal / COUNT(distinct cba.domain_sessionid)::decimal as bounce_rate,
        SUM(CASE WHEN vertical_percentage_scrolled >= COALESCE({{var('snowplow_web')['snowplow__readability_percentage']}}, 100) THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT domain_userid)::decimal AS readability,
        COUNT(DISTINCT cba.domain_sessionid)::DECIMAL / COUNT(distinct domain_userid)::DECIMAL as session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        SUM(engaged_time_in_s) AS total_time_spent,
        (SUM(engaged_time_in_s) / COUNT(DISTINCT domain_userid))::integer AS average_time_spent,
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'monthly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    GROUP BY app_id, EXTRACT(MONTH FROM custom_tstamp), EXTRACT(YEAR FROM custom_tstamp), cba.content_id
)

select
	article_monthly.site_id,
	article_monthly.article_id,
	article_monthly.page_views,
	article_monthly.new_users,
	article_monthly.bounce_rate,
    article_monthly.readability,
	article_monthly.session_per_user,
	article_monthly.users,
	article_monthly.attention_time,
	article_monthly.total_time_spent,
	article_monthly.average_time_spent,
	article_monthly.created_at,
	article_monthly.time_of_day,
	article_monthly.frequency,
	article_monthly.key_words,
	article_monthly.exit_page_distribution,
    CAST(article_monthly.period_month AS integer) as period_month,
    CAST(article_monthly.period_year AS integer) as period_year,
	(
        SELECT avg(session_page_views::double precision)
        FROM session_counts sc
        WHERE sc.period_month = article_monthly.period_month and sc.period_year = article_monthly.period_year and
         sc.content_id = article_monthly.article_id
    ) AS pageviews_per_session,
	(
	select
		'{' || LISTAGG('"' || country || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY country) || '}'
	from
		countries
	where
		countries.period_month = article_monthly.period_month and countries.period_year = article_monthly.period_year and
		countries.content_id = article_monthly.article_id) as country_distribution,
	(
	select
		'{' || LISTAGG('"' || country || '": ' || cities, ', ') WITHIN GROUP (ORDER BY country) || '}'
	from
		country_wise_city c
	where
		c.period_month = article_monthly.period_month
        and c.period_year = article_monthly.period_year
		and c.content_id = article_monthly.article_id) as city_distribution,
    (
	select
		'{' || LISTAGG('"' || referrer || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY referrer) || '}'
	from
		referrers
	where
		referrers.period_month = article_monthly.period_month and referrers.period_year = article_monthly.period_year and
		referrers.content_id = article_monthly.article_id) as referrer_distribution,
	(
	select
		'{' || LISTAGG('"' || device || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY device) || '}'
	from
		devices
	where
		devices.period_month = article_monthly.period_month and devices.period_year = article_monthly.period_year and
		devices.content_id = article_monthly.article_id) as device_distribution,
    (
	select
		'{' || LISTAGG('"' || social || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY social) || '}'
	from
		socials
	where
		socials.period_month = article_monthly.period_month and socials.period_year = article_monthly.period_year and
		socials.content_id = article_monthly.article_id) as social_distribution,
        s.org_id

from
	article_monthly
	inner join {{ source('atomic', 'sites') }} s  on s.site_id = article_monthly.site_id