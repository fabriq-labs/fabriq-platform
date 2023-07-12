{{
  config(
    materialized='incremental',
    unique_key = ['period_date','page_views', 'attention_time', 'users'  ],
    schema='public'
  )
}}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),referrers AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', derived_tstamp) as hour,
        COALESCE(refr_urlhost, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    WHERE  date(derived_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'),DATE_PART('hour', derived_tstamp), referrer
),
countries AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        DATE_PART('hour', derived_tstamp) as hour,
        geo_country AS country,
        COUNT(domain_userid) AS cnt
    FROM content
    WHERE date(derived_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'),DATE_PART('hour', derived_tstamp), country
),
session_counts AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    WHERE  date(derived_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), domain_sessionid
),
article_hourly AS (
    SELECT
        app_id AS site_id,
        COUNT(DISTINCT page_view_id) AS page_views,
        COUNT(CASE WHEN domain_sessionidx = 1 THEN 1 ELSE NULL END) AS new_users,
        SUM(CASE WHEN session_page_views = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT cba.domain_sessionid)::decimal AS bounce_rate,
        AVG(session_page_views) AS pageviews_per_session,
        COUNT(cba.domain_sessionid)::DECIMAL / COUNT(DISTINCT domain_userid)::DECIMAL AS session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        period_date,
        DATE_PART('hour', derived_tstamp) AS hour,
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'hourly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    JOIN session_counts ON TO_CHAR(derived_tstamp, 'YYYY-MM-DD') = session_counts.period_date
    WHERE date(derived_tstamp) >= CURRENT_DATE - INTERVAL '8 days'
    GROUP BY app_id, period_date, DATE_PART('hour', derived_tstamp)
)

SELECT
    article_hourly.*,
   (SELECT JSON_OBJECT_AGG(referrer, cnt) FROM referrers WHERE referrers.period_date = article_hourly.period_date and referrers.hour = article_hourly.hour ) AS referrer_distribution,
    (SELECT JSON_OBJECT_AGG(country, cnt) FROM countries WHERE countries.period_date = article_hourly.period_date and countries.hour = article_hourly.hour ) AS country_distribution,
    s.org_id
FROM article_hourly
INNER JOIN sites s ON s.site_id = article_hourly.site_id