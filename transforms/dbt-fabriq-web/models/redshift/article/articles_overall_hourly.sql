{{
  config(
    materialized='incremental',
    unique_key = ['site_id', 'period_date', 'hour'  ],
    sort=['site_id','period_date', 'hour'],
    schema='derived',
    tags="hourly_run"
  )
}}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),referrers AS (
    SELECT
        TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', custom_tstamp) as hour,
        COALESCE(refr_urlhost, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id
    FROM content
    WHERE  date(custom_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY TO_CHAR(custom_tstamp, 'YYYY-MM-DD'),DATE_PART('hour', custom_tstamp), referrer, app_id
),
countries AS (
    SELECT
        TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', custom_tstamp) as hour,
        geo_country AS country,
        COUNT(domain_userid) AS cnt,
        app_id
    FROM content
    WHERE date(custom_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY TO_CHAR(custom_tstamp, 'YYYY-MM-DD'),DATE_PART('hour', custom_tstamp), country, app_id
),
city AS (
    SELECT
        TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', custom_tstamp) as hour,
        geo_country AS country,
        geo_city AS city,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id
    FROM content
    GROUP BY app_id, geo_country, geo_city, TO_CHAR(custom_tstamp, 'YYYY-MM-DD'),DATE_PART('hour', custom_tstamp)
),
ranked_cities AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY country, period_date, hour  ORDER BY cnt DESC) AS city_rank
    FROM city
),
country_wise_city AS (
    SELECT
        '{' || LISTAGG('"' || city || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY city) || '}' AS cities,
        country,
        period_date,
        app_id,
        hour
    FROM ranked_cities
    WHERE city_rank <= 8
    GROUP BY app_id, country, period_date, hour
),
session_counts AS (
    SELECT
        TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', custom_tstamp) as hour,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views,
        app_id
    FROM content
    WHERE  date(custom_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY TO_CHAR(custom_tstamp,'YYYY-MM-DD'),  DATE_PART('hour', custom_tstamp),domain_sessionid, app_id
),
article_hourly AS (
    SELECT
        app_id AS site_id,
        COUNT(DISTINCT page_view_id) AS page_views,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN cba.domain_sessionid ELSE NULL END) AS new_users,
        SUM(case when page_views_in_session = 1 then 1 else 0 end)::decimal / COUNT(distinct cba.domain_sessionid)::decimal as bounce_rate,
        COUNT(DISTINCT cba.domain_sessionid)::DECIMAL / COUNT(distinct domain_userid)::DECIMAL as session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', custom_tstamp) AS hour,
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'hourly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    WHERE date(custom_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY app_id, period_date, DATE_PART('hour', custom_tstamp)
)

SELECT
    article_hourly.*,
    (
        SELECT avg(session_page_views::double precision)
        FROM session_counts sc
        WHERE sc.period_date = article_hourly.period_date and sc.hour = article_hourly.hour
    ) AS pageviews_per_session,
   (SELECT '{' || LISTAGG('"' || referrer || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY referrer) || '}' FROM referrers WHERE referrers.period_date = article_hourly.period_date and referrers.hour = article_hourly.hour ) AS referrer_distribution,
    (SELECT '{' || LISTAGG('"' || country || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY country) || '}' FROM countries WHERE countries.period_date = article_hourly.period_date and countries.hour = article_hourly.hour ) AS country_distribution,
    (
	select
		'{' || LISTAGG('"' || country || '": ' || cities, ', ') WITHIN GROUP (ORDER BY country) || '}'
	from country_wise_city c where
		c.period_date = article_hourly.period_date and c.hour = article_hourly.hour) as city_distribution,
    s.org_id
FROM article_hourly
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = article_hourly.site_id