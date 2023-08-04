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
),
referrers AS (
    SELECT
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) AS period_date,
        EXTRACT(HOUR FROM derived_tstamp)  as hour,
        content_id,
        COALESCE(refr_urlhost, 'Direct') AS referrer,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    WHERE  DATE(derived_tstamp) >= DATE(CURRENT_TIMESTAMP()) - INTERVAL 8 DAY
    GROUP BY FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp), EXTRACT(HOUR FROM derived_tstamp) , referrer, content_id
),
countries AS (
    SELECT
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) AS period_date,
        EXTRACT(HOUR FROM derived_tstamp)  as hour,
        content_id,
        geo_country AS country,
        COUNT(distinct domain_userid) AS cnt
    FROM content
    WHERE DATE(derived_tstamp) >= DATE(CURRENT_TIMESTAMP()) - INTERVAL 8 DAY
    GROUP BY FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp),EXTRACT(HOUR FROM derived_tstamp) , country, content_id
),
session_counts AS (
    SELECT
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) AS period_date,
        content_id,
        domain_sessionid,
        COUNT(page_view_id) AS session_page_views
    FROM content
    WHERE  DATE(derived_tstamp) >= DATE(CURRENT_TIMESTAMP()) - INTERVAL 8 DAY
    GROUP BY FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp), domain_sessionid, content_id
),
article_hourly AS (
    SELECT
        app_id AS site_id,
        cba.content_id as article_id,
        COUNT(distinct page_view_id) AS page_views,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN domain_sessionid ELSE NULL END) AS new_users,
        SUM(CASE WHEN page_views_in_session = 1 THEN 1 ELSE 0 END) / COUNT(DISTINCT domain_sessionid) AS bounce_rate,
        AVG(session_page_views) AS pageviews_per_session,
        COUNT(distinct cba.domain_sessionid) / COUNT(distinct domain_userid) as session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        period_date,
        EXTRACT(HOUR FROM derived_tstamp)  AS hour,
        SUM(engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        '00:00' AS time_of_day,
        'hourly' AS frequency,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    JOIN session_counts ON FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) = session_counts.period_date and session_counts.content_id = cba.content_id
    WHERE DATE(derived_tstamp) >= DATE(CURRENT_TIMESTAMP()) - INTERVAL 8 DAY
    GROUP BY app_id, period_date, EXTRACT(HOUR FROM derived_tstamp) , cba.content_id
)

SELECT
    article_hourly.*,
    (SELECT CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', referrer, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      ) FROM referrers WHERE referrers.period_date = article_hourly.period_date and referrers.content_id = article_hourly.article_id and referrers.hour = article_hourly.hour ) AS referrer_distribution,
    (SELECT CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', country, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      ) FROM countries WHERE countries.period_date = article_hourly.period_date and countries.content_id = article_hourly.article_id and countries.hour = article_hourly.hour ) AS country_distribution
    ,s.org_id
FROM article_hourly
INNER JOIN public.sites s ON s.site_id = article_hourly.site_id