{{ config(materialized='incremental',unique_key = ['site_id', 'period_year','period_quarter', 'refr_medium', 'refr_source', 'users', 'page_urlpath', 'refr_urlhost'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
referer as (
SELECT content_id as article_id, period_year, period_quarter, refr_medium, refr_source, sum(cnt) as users, site_id, page_urlpath, refr_urlhost
FROM (
  SELECT
    content_id,
   EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
    EXTRACT(year FROM derived_tstamp) AS period_year,
    COALESCE(refr_medium, 'direct') AS refr_medium,
    COALESCE(refr_source, 'Unknown') AS refr_source,
    COALESCE(page_urlpath, 'Unknown') AS page_urlpath,
    COALESCE(refr_urlhost, 'Unknown') AS refr_urlhost,
    COUNT(DISTINCT domain_userid) AS cnt,
    app_id as site_id
  FROM
    content
  GROUP by
  EXTRACT(year FROM derived_tstamp),
   EXTRACT(QUARTER FROM derived_tstamp),
    domain_userid,
    content_id,
    refr_source,
    refr_medium,
    page_urlpath,
    refr_urlhost,
    app_id
) AS subquery

group by content_id, period_year, period_quarter, refr_medium, refr_source,site_id, page_urlpath, refr_urlhost
)

select *, s.org_id, CURRENT_TIMESTAMP AS created_at from referer INNER JOIN sites s ON s.site_id = referer.site_id