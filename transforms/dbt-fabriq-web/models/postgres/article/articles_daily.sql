{{ config(materialized='incremental', unique_key=['site_id', 'title', 'author', 'period_date'], sort=['site_id', 'article_id', 'author','period_date'],
dist='article_id', schema='public') }}

WITH content AS (
    SELECT * FROM {{ ref('derived_contents') }}
   {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
devices AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(device_class, 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'), device, content_id
),
referrers AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(refr_medium, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    group by
TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
referrer,
content_id
),
countries AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        geo_country AS country,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	country,
	content_id
),
city AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        geo_country AS country,
        geo_city AS city,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id,
		content_id
    FROM content
    GROUP BY app_id, content_id, geo_country, geo_city, TO_CHAR(derived_tstamp, 'YYYY-MM-DD')
),
ranked_cities AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY country, period_date, content_id ORDER BY cnt DESC) AS city_rank
    FROM city
),
country_wise_city AS (
    SELECT
        JSON_OBJECT_AGG(COALESCE(city, 'Unknown'), cnt) AS cities,
        country,
        period_date,
		content_id,
		app_id
    FROM ranked_cities
    WHERE city_rank <= 8
    GROUP BY app_id,content_id, country, period_date
),
socials AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(refr_source, 'Unknown') AS social,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
   group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	social,
	content_id
),
session_counts AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	domain_sessionid,
	content_id
),
article_daily AS (
    SELECT
        app_id AS site_id,
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        cba.content_id AS article_id,
        COUNT(DISTINCT page_view_id) AS page_views,
        cba.content_name AS title,
        author,
        author AS author_id,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN cba.domain_sessionid ELSE NULL END) AS new_users,
        SUM(CASE WHEN page_views_in_session = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT cba.domain_sessionid)::decimal AS bounce_rate,
        COUNT(DISTINCT cba.domain_sessionid)::DECIMAL / COUNT(DISTINCT domain_userid)::DECIMAL AS session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        SUM(engaged_time_in_s) AS attention_time,
		SUM(engaged_time_in_s) AS total_time_spent,
        (SUM(engaged_time_in_s) / COUNT(DISTINCT domain_userid))::integer AS average_time_spent,
        CURRENT_TIMESTAMP AS created_at,
        'daily' AS frequency,
        1 AS total_shares,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    group by
	app_id,
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	cba.content_id,
	cba.content_name,
	cba.author
)

SELECT
    article_daily.*,
	(
        SELECT avg(session_page_views)
        FROM session_counts sc
        WHERE sc.period_date = article_daily.period_date
            AND sc.content_id = article_daily.article_id
    ) AS pageviews_per_session,
    (
        SELECT JSON_OBJECT_AGG(COALESCE(country, 'Unknown'), cnt)
        FROM countries
        WHERE countries.period_date = article_daily.period_date
            AND countries.content_id = article_daily.article_id
    ) AS country_distribution,
    (
        SELECT JSON_OBJECT_AGG(COALESCE(country, 'Unknown'), cities)
        FROM country_wise_city c
        WHERE c.period_date = article_daily.period_date
            AND c.content_id = article_daily.article_id
    ) AS city_distribution,
    (
        SELECT JSON_OBJECT_AGG(referrer, cnt)
        FROM referrers
        WHERE referrers.period_date = article_daily.period_date
            AND referrers.content_id = article_daily.article_id
    ) AS referrer_distribution,
    (
        SELECT JSON_OBJECT_AGG(device, cnt)
        FROM devices
        WHERE devices.period_date = article_daily.period_date
            AND devices.content_id = article_daily.article_id
    ) AS device_distribution,
    (
        SELECT JSON_OBJECT_AGG(social, cnt)
        FROM socials
        WHERE socials.period_date = article_daily.period_date
            AND socials.content_id = article_daily.article_id
    ) AS social_distribution,
    s.org_id
FROM article_daily
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = article_daily.site_id
