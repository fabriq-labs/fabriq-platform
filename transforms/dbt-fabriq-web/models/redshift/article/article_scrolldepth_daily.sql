{{ config(materialized='incremental',unique_key = ['site_id', 'article_id','period_date' ], schema='derived', tags="hourly_run") }}


with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
), scroll_depth AS (
  SELECT
    app_id AS site_id,
    content_id AS article_id,
    TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
    COUNT(DISTINCT domain_userid) AS total_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 0 THEN domain_userid END) AS entered_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > COALESCE({{var('snowplow_web')['snowplow__scrolldepth_crossed_25_value']}}, 25) THEN domain_userid END) AS crossed_25_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > COALESCE({{var('snowplow_web')['snowplow__scrolldepth_crossed_50_value']}}, 50) THEN domain_userid END) AS crossed_50_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > COALESCE({{var('snowplow_web')['snowplow__scrolldepth_crossed_75_value']}}, 75) THEN domain_userid END) AS crossed_75_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled >= COALESCE({{var('snowplow_web')['snowplow__scrolldepth_crossed_100_value']}}, 100) THEN domain_userid END) AS crossed_100_users
  FROM
    content dc
  GROUP BY
    app_id,
    content_id,
   	period_date   
)
SELECT
  sd.site_id,
  sd.article_id,
  sd.period_date,
  sd.total_users,
  sd.entered_users,
  sd.crossed_25_users,
  sd.crossed_50_users,
  sd.crossed_75_users,
  sd.crossed_100_users,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at
FROM
  scroll_depth sd
  INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = sd.site_id