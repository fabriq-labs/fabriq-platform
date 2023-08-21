{{ config(materialized='incremental',unique_key = ['site_id', 'article_id','period_year'  ], schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this,'yearly') }}
    {% endif %}
), scroll_depth AS (
  SELECT
    app_id AS site_id,
    content_id AS article_id,
    EXTRACT(year FROM derived_tstamp) AS period_year,
    COUNT(DISTINCT domain_userid) AS total_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 0 THEN domain_userid END) AS entered_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 25 THEN domain_userid END) AS crossed_25_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 50 THEN domain_userid END) AS crossed_50_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 75 THEN domain_userid END) AS crossed_75_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled >= 100 THEN domain_userid END) AS crossed_100_users
  FROM
    content dc
  GROUP BY
    app_id,
    content_id,
   	period_year
)
SELECT
  sd.site_id,
  sd.article_id,  
  CAST(sd.period_year AS integer) as period_year,
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