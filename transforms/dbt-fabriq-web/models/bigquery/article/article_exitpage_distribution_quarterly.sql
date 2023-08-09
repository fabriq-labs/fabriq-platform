{{ config(materialized='incremental',unique_key = ['site_id', 'article_id','period_quarter', 'period_year', 'page_title', 'next_page_title', 'recirculation_count'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
 recirculation_content AS (
  select
    app_id as site_id,
    content_id as article_id,
    EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
    EXTRACT(YEAR FROM derived_tstamp) AS period_year,
    page_url as source_page,
    page_title,
    lead(content_id) over (partition by domain_sessionid order by derived_tstamp) as next_page_article_id,
    lead(page_url) over (partition by domain_sessionid order by derived_tstamp) as next_page,
    lead(page_title) over (partition by domain_sessionid order by derived_tstamp) as next_page_title
  from (
    select *
    from content
    where domain_sessionid in (
      select domain_sessionid
      from content rc
      where rc.content_id = content.content_id
    )
  ) as subquery
),
recirculation_counts AS (
  SELECT
    site_id,
    article_id,
    next_page_article_id,
    period_quarter,
    period_year,
    page_title,
    next_page_title,
    COUNT(*) AS recirculation_count
  FROM recirculation_content
  WHERE page_title <> next_page_title

  GROUP BY site_id, article_id, period_quarter, page_title, next_page_title, period_year, next_page_article_id
)
SELECT
  rc.site_id,
  rc.article_id,
  rc.next_page_article_id,
  rc.period_quarter,
  rc.period_year,
  rc.page_title,
  rc.next_page_title,
  rc.recirculation_count,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at
FROM recirculation_counts rc
INNER JOIN public.sites s ON s.site_id = rc.site_id
ORDER BY recirculation_count DESC



