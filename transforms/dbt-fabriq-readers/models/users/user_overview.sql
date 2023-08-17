{{ config(materialized='incremental',unique_key = ['domain_userid'], sort=['domain_userid','user_id', 'site_id'],
          dist='domain_userid', schema='public') }}

with web_users as (
    select * from {{ ref('snowplow_web_users') }}
    {% if is_incremental() %}
        where  date(model_tstamp) >= (select max(date(model_tstamp)) from {{this}})
    {% endif %}
),
contents as (
    SELECT * FROM {{ ref('derived_contents') }}
),
categories as (
    SELECT
        domain_userid, content_category, count(1) as category_views
    FROM
        contents group by domain_userid, content_category
),
authors as (
    SELECT
        domain_userid, author, count(1) as author_views
    FROM
        contents group by domain_userid, author
),
ranked_categories AS (
    SELECT
        domain_userid,
        content_category,
        category_views,
        ROW_NUMBER() OVER (PARTITION BY domain_userid ORDER BY category_views DESC) AS rn
    FROM
        categories
),
ranked_authors AS (
    SELECT
        domain_userid,
        author,
        author_views,
        ROW_NUMBER() OVER (PARTITION BY domain_userid ORDER BY author_views DESC) AS rn
    FROM
        authors
)

SELECT app_id as site_id,
       web_user_mapping.user_id,
       web_users.domain_userid,
       web_users.network_userid,
       web_users.start_tstamp,
       web_users.end_tstamp,
       web_users.model_tstamp,
       web_users.page_views,
       sessions,
       web_users.engaged_time_in_s,
       ( web_users.engaged_time_in_s / web_users.page_views ) AS average_engaged_time,
       web_users.first_page_title,
       web_users.first_page_url,
       web_users.first_page_urlscheme,
       web_users.first_page_urlhost,
       web_users.first_page_urlpath,
       web_users.first_page_urlquery,
       web_users.first_page_urlfragment,
       web_users.last_page_title,
       web_users.last_page_url,
       web_users.last_page_urlscheme,
       web_users.last_page_urlhost,
       web_users.last_page_urlpath,
       web_users.last_page_urlquery,
       web_users.last_page_urlfragment,
       web_users.referrer as first_page_referrer,
       web_users.refr_urlscheme as first_page_refr_urlscheme,
       web_users.refr_urlhost as first_page_refr_urlhost,
       web_users.refr_urlpath as first_page_refr_urlpath,
       web_users.refr_urlquery as first_page_refr_urlquery,
       web_users.refr_urlfragment as first_page_refr_urlfragment,
       web_users.refr_medium as first_page_refr_medium,
       web_users.refr_source as first_page_refr_source,
       web_users.refr_term as first_page_refr_term,
       web_users.mkt_medium as first_page_mkt_medium,
       web_users.mkt_source as first_page_mkt_source,
       web_users.mkt_term as first_page_mkt_term,
       web_users.mkt_content as first_page_mkt_content,
       web_users.mkt_campaign as first_page_mkt_campaign,
       web_users.mkt_clickid as first_page_mkt_clickid,
       web_users.mkt_network as first_page_mkt_network,
       domain_sessionid as last_domain_sessionid,
       web_sessions.geo_country as last_session_geo_country,
       geo_city as last_session_geo_city,
       device_class as last_session_device_class,
       web_sessions.engaged_time_in_s as last_session_engaged_time_in_s,
       web_sessions.referrer as last_session_referrer,
       web_sessions.refr_urlscheme as last_session_refr_urlscheme,
       web_sessions.refr_urlhost as last_session_refr_urlhost,
       web_sessions.refr_urlpath as last_session_refr_urlpath,
       web_sessions.refr_urlquery as last_session_refr_urlquery,
       web_sessions.refr_urlfragment as last_session_refr_urlfragment,
       web_sessions.refr_medium as last_session_refr_medium,
       web_sessions.refr_source as last_session_refr_source,
       web_sessions.refr_term as last_session_refr_term,
       s.org_id,
       CURRENT_TIMESTAMP AS updated_time,
        (
        SELECT json_object_agg(author, author_views) AS top_authors FROM 
        (   
            SELECT author, author_views FROM ranked_authors WHERE ranked_authors.domain_userid = web_users.domain_userid AND rn <= 3
        ) subquery
            ) as top_authors,
        (
        SELECT json_object_agg(content_category, category_views) 
        FROM (
            SELECT content_category, category_views FROM ranked_categories WHERE ranked_categories.domain_userid = web_users.domain_userid AND rn <= 3
            ) subquery
        ) as top_categories                                                              
FROM   web_users
        LEFT JOIN {{ ref('snowplow_web_user_mapping') }}
                 web_user_mapping using (domain_userid)
        LEFT JOIN  {{ ref('snowplow_web_sessions') }} web_sessions
               ON web_users.domain_userid = web_sessions.domain_userid
                  AND web_users.end_tstamp = web_sessions.end_tstamp 
        INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = app_id
