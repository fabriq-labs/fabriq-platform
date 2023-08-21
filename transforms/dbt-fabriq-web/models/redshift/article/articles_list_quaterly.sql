{{ config(materialized='incremental',unique_key = ['site_id', 'period_quarter', 'period_year' ], schema='derived') }}
with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this, 'quarterly') }}
    {% endif %}
),
total_time_spent AS (
  SELECT
    EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
    sum(cba.engaged_time_in_s) AS total_time
  FROM
    atomic_derived.derived_contents cba
  GROUP BY
    (
      EXTRACT(QUARTER FROM derived_tstamp)
    )
),
average_time_spent AS (
  SELECT
    EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
    (sum(cba.engaged_time_in_s)/count(distinct cba.domain_userid)) :: integer AS average_time
  FROM
    atomic_derived.derived_contents cba
  GROUP BY
    (
     EXTRACT(QUARTER FROM derived_tstamp)
    )
),
articles_list_quaterly AS (
  SELECT
    derived_contents.app_id AS site_id,
    count(DISTINCT derived_contents.domain_userid) AS users,
    count(derived_contents.page_view_id) AS page_views,
    sum(derived_contents.engaged_time_in_s) AS attention_time,
   EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
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
      EXTRACT(QUARTER FROM derived_tstamp)
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
  articles_list_quaterly.site_id,
  articles_list_quaterly.users,
  articles_list_quaterly.page_views,
  articles_list_quaterly.attention_time,
  CAST(articles_list_quaterly.period_quarter AS integer) as period_quarter,
  CAST(articles_list_quaterly.period_year AS integer) as period_year,
  s.org_id,
  CURRENT_TIMESTAMP AS created_at,
  (
    SELECT
      total_time_spent.total_time
    FROM
      total_time_spent
    WHERE
      (
        total_time_spent.period_quarter = articles_list_quaterly.period_quarter
      )
  ) AS total_time_spent,
  (
    SELECT
      average_time_spent.average_time
    FROM
      average_time_spent
    WHERE
      (
        average_time_spent.period_quarter = articles_list_quaterly.period_quarter
      )
  ) AS average_time_spent
FROM
  articles_list_quaterly
  INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = articles_list_quaterly.site_id