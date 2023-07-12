{{ config(materialized='incremental',unique_key = ['site_id','article_id','new_users', 'bounce_rate','page_views','users','attention_time','exit_rate','period_date'], schema='public') }}

WITH content AS (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
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
session_counts AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        content_id,
        domain_sessionid,
        COUNT(DISTINCT domain_sessionid) AS total_sessions,
        COUNT(page_view_id) AS session_page_views
    FROM content
    GROUP BY TO_CHAR(derived_tstamp, 'YYYY-MM-DD'), domain_sessionid, content_id
),
device_daily_source AS (
    SELECT
        app_id AS site_id,
        c.content_id AS article_id,
        COUNT(CASE WHEN domain_sessionidx = 1 THEN 1 ELSE NULL END) AS new_users,
        COUNT(c.domain_userid) AS users,
        SUM(CASE WHEN session_page_views = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT c.domain_sessionid)::decimal AS bounce_rate,
        COUNT(c.page_view_id) AS page_views,
        SUM(c.engaged_time_in_s) AS time_on_page,
        SUM(c.engaged_time_in_s) AS attention_time,
        CURRENT_TIMESTAMP AS created_at,
        0 AS exit_rate,
        'daily' AS frequency,
        TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD') AS period_date,
        (SELECT JSONB_OBJECT_AGG(device, cnt) FROM devices WHERE devices.content_id = c.content_id) AS device_category,
        (SELECT JSONB_OBJECT_AGG(operating_system, cnt) FROM operating_systems WHERE operating_systems.content_id = c.content_id) AS operating_system
    FROM content c
    JOIN session_counts sc ON TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD') = sc.period_date
    GROUP BY app_id, TO_CHAR(c.derived_tstamp, 'YYYY-MM-DD'), c.content_id
)
SELECT
*, s.org_id
FROM device_daily_source
INNER JOIN sites s ON s.site_id = device_daily_source.site_id