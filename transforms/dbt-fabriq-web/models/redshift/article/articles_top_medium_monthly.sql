{{ config(materialized='incremental',unique_key = ['site_id', 'article_id', 'period_year','period_month' ], schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this, 'monthly') }}
    {% endif %}
), referer as (
SELECT content_id as article_id, 
CAST(period_month AS integer) as period_month,
CAST(period_year AS integer) as period_year, 
refr_medium, refr_source, sum(cnt) as users, site_id, page_urlpath, refr_urlhost
FROM (
  SELECT
    content_id,
    EXTRACT(MONTH FROM customer_tstamp) AS period_month,
    EXTRACT(year FROM customer_tstamp) AS period_year,
    COALESCE(refr_medium, 'direct') AS refr_medium,
    COALESCE(refr_source, 'Unknown') AS refr_source,
    COALESCE(page_urlpath, 'Unknown') AS page_urlpath,
    COALESCE(refr_urlhost, 'Unknown') AS refr_urlhost,
    COUNT(DISTINCT domain_userid) AS cnt,
    app_id as site_id
  FROM
    content
  GROUP by
  EXTRACT(year FROM customer_tstamp),
   EXTRACT(MONTH FROM customer_tstamp),
    domain_userid,
    content_id,
    refr_source,
    refr_medium,
    page_urlpath,
    refr_urlhost,
    app_id
) AS subquery

group by content_id, period_year, period_month, refr_medium, refr_source,site_id, page_urlpath, refr_urlhost
)

select referer.*,
  s.org_id, 
  CURRENT_TIMESTAMP AS created_at from referer 
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = referer.site_id
