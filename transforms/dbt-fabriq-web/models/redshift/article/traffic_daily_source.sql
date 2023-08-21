{{ config(materialized='incremental',unique_key = ['site_id','article_id','period_date'], schema='derived', tags="hourly_run") }}

WITH content AS (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
medium_daily AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        CASE
            WHEN refr_medium IN ('social', 'social-media') THEN 'Social'
            WHEN refr_medium = 'internal' THEN 'Internal'
            WHEN refr_medium = 'direct' THEN 'Direct'
            WHEN refr_medium = 'referral' THEN 'Referral'
            ELSE 'Other'
        END AS medium,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), medium, content_id
),
social_daily AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(refr_source, 'Unknown') AS social,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), social, content_id
),
traffic_daily_source AS (
    SELECT
        app_id AS site_id,
        c.content_id AS article_id,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN c.domain_sessionid ELSE NULL END) AS new_users,
        SUM(case when page_views_in_session = 1 then 1 else 0 end)::decimal / COUNT(distinct c.domain_sessionid)::decimal as bounce_rate,
        COUNT(distinct c.page_view_id) AS page_views,
        COUNT(distinct c.domain_userid) AS users,
        SUM(c.engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        0 AS exit_rate,
        'daily' AS frequency,
        TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD') AS period_date,
        (SELECT '{' || LISTAGG('"' || medium || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY medium) || '}' FROM medium_daily WHERE medium_daily.content_id = c.content_id) AS medium_distribution,
        (SELECT '{' || LISTAGG('"' || social || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY social) || '}' FROM social_daily WHERE social_daily.content_id = c.content_id) AS source_distribution
    FROM content c
    GROUP BY app_id, TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD'), c.content_id, c.br_viewheight, c.br_colordepth
)
SELECT
traffic_daily_source.*, s.org_id
FROM traffic_daily_source
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = traffic_daily_source.site_id
