{{ config(materialized='incremental',unique_key = ['site_id', 'article_id','period_quarter', 'period_year', 'page_title', 'next_page_title'  ], schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this, 'quarterly') }}
    {% endif %}
),
 recirculation_content AS (
  select
    app_id as site_id,
    content_id as article_id,
    EXTRACT(QUARTER FROM customer_tstamp) AS period_quarter,
    EXTRACT(YEAR FROM customer_tstamp) AS period_year,
    page_url as source_page,
    page_title,
    lead(content_id) over (partition by domain_sessionid order by customer_tstamp) as next_page_article_id,
    lead(page_url) over (partition by domain_sessionid order by customer_tstamp) as next_page,
    lead(page_title) over (partition by domain_sessionid order by customer_tstamp) as next_page_title,
    lead(domain_userid) over (partition by domain_sessionid order by customer_tstamp) as next_domain_userid
  from content
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
    COUNT(*) AS recirculation_count,
    count(distinct next_domain_userid) users,
    ROW_NUMBER() OVER (PARTITION BY article_id ORDER BY COUNT(*) DESC) AS row_number
  FROM recirculation_content
  WHERE page_title <> next_page_title

  GROUP BY site_id, article_id, period_quarter, page_title, next_page_title, period_year, next_page_article_id
)
SELECT
  rc.site_id,
  rc.article_id,
  rc.next_page_article_id,
  CAST(rc.period_quarter AS integer) as period_quarter,
  CAST(rc.period_year AS integer) as period_year,
  rc.page_title,
  rc.next_page_title,
  rc.recirculation_count,
  rc.users,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at
FROM recirculation_counts rc
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = rc.site_id
WHERE row_number <= 5 
ORDER BY recirculation_count DESC



