{{ config(materialized='incremental',unique_key = ['site_id', 'period_date'  ], schema='derived', tags="hourly_run") }}
with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),average_time_spent AS (
  SELECT
    to_char(dc.customer_tstamp, 'YYYY-MM-DD' :: text) AS period_date,
    (sum(dc.engaged_time_in_s)/count(distinct dc.domain_userid)) :: integer AS average_time
  FROM
    content dc
  GROUP BY
    (to_char(dc.customer_tstamp, 'YYYY-MM-DD' :: text))
),
total_time_spent AS (
  SELECT
    to_char(dc.customer_tstamp, 'YYYY-MM-DD' :: text) AS period_date,
    sum(dc.engaged_time_in_s) AS total_time
  FROM
    content dc
  GROUP BY
    (to_char(dc.customer_tstamp, 'YYYY-MM-DD' :: text))
),
cities as (
SELECT period_date, city, average_users
FROM (
  SELECT
    period_date,
    city,
    average_users,
    ROW_NUMBER() OVER(PARTITION BY period_date ORDER BY average_users DESC) AS rank_within_period
  FROM (
    SELECT
      TO_CHAR(customer_tstamp, 'YYYY-MM-DD') AS period_date,
      geo_city AS city,
      COUNT(DISTINCT domain_userid) AS users,
      COUNT(DISTINCT domain_userid) AS average_users
    FROM content
    GROUP BY 1, 2
  ) AS sub
) AS ranked_sub
WHERE rank_within_period <= 5
ORDER BY period_date, average_users DESC
),
top_refrer_source as(
    SELECT period_date, referrer, users
    FROM (
      SELECT 
        period_date,
        referrer,
        users,
        ROW_NUMBER() OVER(PARTITION BY period_date ORDER BY users DESC) AS rank_within_period
      FROM (
        SELECT 
          TO_CHAR(customer_tstamp, 'YYYY-MM-DD') AS period_date,
          COALESCE(refr_source, 'Direct') AS referrer,
          COUNT(DISTINCT domain_userid) AS users
        FROM content c
        GROUP BY period_date, referrer
      ) AS sub
    ) AS ranked_sub
    WHERE rank_within_period <= 5
    ORDER BY period_date, users DESC
),
article_list_daily AS (
  SELECT
    derived_contents.app_id AS site_id,
    count(DISTINCT derived_contents.domain_userid) AS users,
    count(derived_contents.page_view_id) AS page_views,
    sum(derived_contents.engaged_time_in_s) AS attention_time,
    to_char(
      derived_contents.customer_tstamp,
      'YYYY-MM-DD' :: text
    ) AS period_date
  FROM
    atomic_derived.derived_contents
  GROUP BY
    derived_contents.app_id,
    (
      to_char(
        derived_contents.customer_tstamp,
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
    SELECT total_time_spent.total_time FROM total_time_spent
    WHERE (total_time_spent.period_date = article_list_daily.period_date)
  ) AS total_time_spent,
  (
    SELECT average_time_spent.average_time FROM average_time_spent 
    WHERE (average_time_spent.period_date = article_list_daily.period_date )
  ) AS average_time_spent,
  (
    SELECT
      '{' || LISTAGG('"' || city || '": ' || average_users, ', ') WITHIN GROUP (ORDER BY average_users desc) || '}'
    FROM
      cities
    WHERE cities.period_date = article_list_daily.period_date
    ) AS top_cities,
    (
    SELECT
      '{' || LISTAGG('"' || referrer || '": ' || users, ', ') WITHIN GROUP (ORDER BY users desc) || '}'
    FROM
      top_refrer_source re
    WHERE re.period_date = article_list_daily.period_date
    ) AS top_referer
FROM
  article_list_daily
  INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = article_list_daily.site_id