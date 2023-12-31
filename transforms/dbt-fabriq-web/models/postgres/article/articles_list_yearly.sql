{{ config(materialized='incremental',unique_key = ['site_id', 'period_year'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this,'yearly') }}
    {% endif %}
),
total_time_spent AS (
  SELECT
    EXTRACT(
      year
      FROM
        cba.derived_tstamp
    ) AS period_year,
    sum(cba.engaged_time_in_s) AS total_time
  FROM
    atomic_derived.derived_contents cba
  GROUP BY
    (
      EXTRACT(
        year
        FROM
          cba.derived_tstamp
      )
    )
),
average_time_spent AS (
  SELECT
    EXTRACT(
      year
      FROM
        dc.derived_tstamp
    ) AS period_year,
    (sum(dc.engaged_time_in_s)/count(distinct dc.domain_userid)) :: integer AS average_time
  FROM
    atomic_derived.derived_contents dc
  GROUP BY
    (
      EXTRACT(
        year
        FROM
          dc.derived_tstamp
      )
    )
),
articles_list_yearly AS (
  SELECT
    derived_contents.app_id AS site_id,
    count(DISTINCT derived_contents.domain_userid) AS users,
    count(derived_contents.page_view_id) AS page_views,
    sum(derived_contents.engaged_time_in_s) AS attention_time,
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
        year
        FROM
          derived_contents.derived_tstamp
      )
    )
)
SELECT
  articles_list_yearly.site_id,
  articles_list_yearly.users,
  articles_list_yearly.page_views,
  articles_list_yearly.attention_time,
  CAST(articles_list_yearly.period_year AS integer) as period_year,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at,
  (
    SELECT
      total_time_spent.total_time
    FROM
      total_time_spent
    WHERE
      (
        total_time_spent.period_year = articles_list_yearly.period_year
      )
  ) AS total_time_spent,
  (
    SELECT
      average_time_spent.average_time
    FROM
      average_time_spent
    WHERE
      (
        average_time_spent.period_year = articles_list_yearly.period_year
      )
  ) AS average_time_spent
FROM
  articles_list_yearly
   INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = articles_list_yearly.site_id