{{ config(materialized='incremental',unique_key = ['site_id', 'period_date', 'page_views', 'attention_time', 'users', 'total_time_spent', 'average_time_spent'  ], schema='public') }}
with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),average_time_spent AS (
  SELECT
    to_char(dc.derived_tstamp, 'YYYY-MM-DD' :: text) AS period_date,
    (avg(dc.engaged_time_in_s)) :: integer AS average_time
  FROM
    atomic_derived.derived_contents dc
  GROUP BY
    (to_char(dc.derived_tstamp, 'YYYY-MM-DD' :: text))
),
total_time_spent AS (
  SELECT
    to_char(dc.derived_tstamp, 'YYYY-MM-DD' :: text) AS period_date,
    sum(dc.engaged_time_in_s) AS total_time
  FROM
    atomic_derived.derived_contents dc
  GROUP BY
    (to_char(dc.derived_tstamp, 'YYYY-MM-DD' :: text))
),
article_list_daily AS (
  SELECT
    derived_contents.app_id AS site_id,
    count(DISTINCT derived_contents.domain_userid) AS users,
    count(derived_contents.page_view_id) AS page_views,
    sum(derived_contents.engaged_time_in_s) AS attention_time,
    to_char(
      derived_contents.derived_tstamp,
      'YYYY-MM-DD' :: text
    ) AS period_date
  FROM
    atomic_derived.derived_contents
  GROUP BY
    derived_contents.app_id,
    (
      to_char(
        derived_contents.derived_tstamp,
        'YYYY-MM-DD' :: text
      )
    )
)
SELECT
  article_list_daily.site_id,
  article_list_daily.users,
  article_list_daily.page_views,
  article_list_daily.attention_time,
  article_list_daily.period_date,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at,
  (
    SELECT
      total_time_spent.total_time
    FROM
      total_time_spent
    WHERE
      (
        total_time_spent.period_date = article_list_daily.period_date
      )
  ) AS total_time_spent,
  (
    SELECT
      average_time_spent.average_time
    FROM
      average_time_spent
    WHERE
      (
        average_time_spent.period_date = article_list_daily.period_date
      )
  ) AS average_time_spent
FROM
  article_list_daily
  INNER JOIN sites s ON s.site_id = article_list_daily.site_id