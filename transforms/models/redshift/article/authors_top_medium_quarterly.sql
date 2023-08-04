{{ config(materialized='incremental',unique_key = ['site_id', 'author', 'period_quarter', 'period_year', 'refr_medium' ], sort=['site_id', 'author', 'period_quarter', 'period_year' ],
    dist='author', schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this, 'quarterly') }}
    {% endif %}
),
referer AS (
    SELECT
        author,
        CAST(period_quarter AS integer) as period_quarter,
        CAST(period_year AS integer) as period_year, 
        refr_medium,
        refr_source,
        SUM(cnt) AS users,
        site_id,
        page_urlpath,
        refr_urlhost,
        ROW_NUMBER() OVER (PARTITION BY refr_medium,period_quarter,period_year,author,site_id ORDER BY SUM(cnt) DESC) AS rn
    FROM (
        SELECT
            author,
            EXTRACT(QUARTER FROM derived_tstamp) AS period_quarter,
            EXTRACT(year FROM derived_tstamp) AS period_year,
            COALESCE(refr_medium, 'direct') AS refr_medium,
            COALESCE(refr_source, 'Unknown') AS refr_source,
            COALESCE(page_urlpath, 'Unknown') AS page_urlpath,
            COALESCE(refr_urlhost, 'Unknown') AS refr_urlhost,
            COUNT(DISTINCT domain_userid) AS cnt,
            app_id AS site_id
        FROM
            content
        GROUP BY
            EXTRACT(year FROM derived_tstamp),
            EXTRACT(QUARTER FROM derived_tstamp),
            domain_userid,
            author,
            refr_source,
            refr_medium,
            page_urlpath,
            refr_urlhost,
            app_id
    ) AS subquery
    GROUP BY author, period_quarter, period_year, refr_medium, refr_source, site_id, page_urlpath, refr_urlhost
)
SELECT
    referer.*,
    s.org_id,
    CURRENT_TIMESTAMP AS created_at
FROM
    referer
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = referer.site_id
WHERE refr_medium IN ('internal', 'direct', 'search', 'unknown', 'social') AND rn = 1