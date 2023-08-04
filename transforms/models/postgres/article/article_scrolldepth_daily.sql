{{ config(materialized='incremental',unique_key = ['site_id', 'article_id','period_date' ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
), scroll_depth AS (
  SELECT
    app_id AS site_id,
    content_id AS article_id,
    TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
    COUNT(DISTINCT domain_userid) AS total_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 0 THEN domain_userid END) AS entered_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled > 70 THEN domain_userid END) AS crossed_70_users,
    COUNT(DISTINCT CASE WHEN vertical_percentage_scrolled >= 100 THEN domain_userid END) AS crossed_100_users
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
  sd.crossed_70_users,
  sd.crossed_100_users,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at
FROM
  scroll_depth sd
  INNER JOIN sites s ON s.site_id = sd.site_id