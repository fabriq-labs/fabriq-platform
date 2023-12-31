{{ config(materialized='incremental',unique_key = ['site_id', 'period_date', 'refr_medium', 'refr_source', 'users', 'page_urlpath', 'refr_urlhost'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),  referer as (
SELECT content_id AS article_id, period_date, refr_medium, refr_source, SUM(cnt) AS users, site_id, page_urlpath, refr_urlhost
FROM (
    SELECT
        content_id,
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) AS period_date,
        COALESCE(refr_medium, 'direct') AS refr_medium,
        COALESCE(refr_source, 'Unknown') AS refr_source,
        COALESCE(page_urlpath, 'Unknown') AS page_urlpath,
        COALESCE(refr_urlhost, 'Unknown') AS refr_urlhost,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id AS site_id
    FROM
        content
    GROUP BY
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp),
        domain_userid,
        content_id,
        refr_source,
        refr_medium,
        page_urlpath,
        refr_urlhost,
        app_id
) AS subquery
GROUP BY content_id, period_date, refr_medium, refr_source, site_id, page_urlpath, refr_urlhost
)

select referer.*, s.org_id, CURRENT_TIMESTAMP AS created_at from referer INNER JOIN public.sites s ON s.site_id = referer.site_id