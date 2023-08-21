{{ config(materialized='incremental',unique_key = ['site_id','article_id', 'period_date'], schema='derived', tags="hourly_run") }}

WITH content AS (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
devices AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), device, content_id
),
operating_systems AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        COALESCE(operating_system_name , 'Unknown') AS operating_system,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), operating_system, content_id
),
device_daily_source AS (
    SELECT
        app_id AS site_id,
        c.content_id AS article_id,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN c.domain_sessionid ELSE NULL END) AS new_users,
        COUNT(distinct c.domain_userid) AS users,
        SUM(case when page_views_in_session = 1 then 1 else 0 end)::decimal / COUNT(distinct c.domain_sessionid)::decimal as bounce_rate,
        COUNT(distinct c.page_view_id) AS page_views,
        SUM(c.engaged_time_in_s) AS time_on_page,
        SUM(c.engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        0 AS exit_rate,
        'daily' AS frequency,
        TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD') AS period_date,
        (SELECT '{' || LISTAGG('"' || device || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY device) || '}' FROM devices WHERE devices.content_id = c.content_id) AS device_category,
        (SELECT '{' || LISTAGG('"' || operating_system || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY operating_system) || '}' FROM operating_systems WHERE operating_systems.content_id = c.content_id) AS operating_system
    FROM content c
    GROUP BY app_id, TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD'), c.content_id
)
SELECT
device_daily_source.*,
s.org_id
FROM device_daily_source
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = device_daily_source.site_id