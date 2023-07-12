{{ config(materialized='incremental',unique_key = ['site_id', 'period_month', 'period_year', 'page_views', 'attention_time', 'users', 'total_time_spent', 'average_time_spent'  ], schema='public') }}
with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
total_time_spent AS (
  SELECT
    EXTRACT(
      month
      FROM
        cba.derived_tstamp
    ) AS period_month,
    sum(cba.engaged_time_in_s) AS total_time
  FROM
    atomic_derived.derived_contents cba
  GROUP BY
    (
      EXTRACT(
        month
        FROM
          cba.derived_tstamp
      )
    )
),
average_time_spent AS (
  SELECT
    EXTRACT(
      month
      FROM
        cba.derived_tstamp
    ) AS period_month,
    (avg(cba.engaged_time_in_s)) :: integer AS average_time
  FROM
    atomic_derived.derived_contents cba
  GROUP BY
    (
      EXTRACT(
        month
        FROM
          cba.derived_tstamp
      )
    )
),
articles_list_monthly AS (
  SELECT
    derived_contents.app_id AS site_id,
    count(DISTINCT derived_contents.domain_userid) AS users,
    count(derived_contents.page_view_id) AS page_views,
    sum(derived_contents.engaged_time_in_s) AS attention_time,
    EXTRACT(
      month
      FROM
        derived_contents.derived_tstamp
    ) AS period_month,
    EXTRACT(
      year
      FROM
        derived_contents.derived_tstamp
    ) AS period_year
  FROM
    atomic_derived.derived_contents
  GROUP BY
    derived_contents.app_id,
    (
      EXTRACT(
        month
        FROM
          derived_contents.derived_tstamp
      )
    ),
    (
      EXTRACT(
        year
        FROM
          derived_contents.derived_tstamp
      )
    )
)
SELECT
  articles_list_monthly.site_id,
  articles_list_monthly.users,
  articles_list_monthly.page_views,
  articles_list_monthly.attention_time,
  CAST(articles_list_monthly.period_month AS integer) as period_month,
  CAST(articles_list_monthly.period_year AS integer) as period_year,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at,
  (
    SELECT
      total_time_spent.total_time
    FROM
      total_time_spent
    WHERE
      (
        total_time_spent.period_month = articles_list_monthly.period_month
      )
  ) AS total_time_spent,
  (
    SELECT
      average_time_spent.average_time
    FROM
      average_time_spent
    WHERE
      (
        average_time_spent.period_month = articles_list_monthly.period_month
      )
  ) AS average_time_spent
FROM
  articles_list_monthly
  INNER JOIN sites s ON s.site_id = articles_list_monthly.site_id