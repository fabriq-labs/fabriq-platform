{{ config(materialized='incremental',unique_key = 'event_id', schema='derived', tags="hourly_run") }}

with snowplow_web_page_views as (
    select * from {{ ref('snowplow_web_page_views') }}
	{% if is_incremental() %}
    where  date(collector_tstamp) >= (select max(date(collector_tstamp)) from {{this}})
    {% endif %}
),

contents as (
	SELECT
	    CURRENT_TIMESTAMP AS updated_time,
	    wp.id AS page_view_id,
	    c.id as content_id,
	    c.category AS content_category, 
	    c.name AS content_name, 
	    c.date_published AS date_published,
		CASE 
            WHEN LENGTH(c.author) > 0 THEN 
			CASE
                WHEN POSITION(' (' IN c.author) > 0 THEN TRIM(LEFT(c.author, POSITION(' (' IN c.author) - 1))
                ELSE c.author
			END
            ELSE 'unknown'
        END AS author,
	    pv.app_id,
	    pv.event_id,
	    pv.domain_userid,
	    pv.network_userid,
	    pv.domain_sessionid,
	    pv.domain_sessionidx,
	    pv.page_view_in_session_index,
	    pv.page_views_in_session,
	    pv.dvce_created_tstamp,
	    pv.collector_tstamp,
	    pv.derived_tstamp,
	    pv.start_tstamp,
	    pv.end_tstamp,
	    pv.model_tstamp,
	    pv.engaged_time_in_s,
	    pv.absolute_time_in_s,
	    pv.horizontal_pixels_scrolled,
	    pv.vertical_pixels_scrolled,
	    pv.horizontal_percentage_scrolled,
	    pv.vertical_percentage_scrolled,
	    pv.doc_width,
	    pv.doc_height,
	    pv.page_title,
	    pv.page_url,
	    pv.page_urlscheme,
	    pv.page_urlhost,
	    pv.page_urlpath,
	    pv.page_urlquery,
	    pv.page_urlfragment,
	    pv.mkt_medium,
	    pv.mkt_source,
	    pv.mkt_term,
	    pv.mkt_content,
	    pv.mkt_campaign,
	    pv.mkt_clickid,
	    pv.mkt_network,
	    pv.page_referrer,
	    pv.refr_urlscheme,
	    pv.refr_urlhost,
	    pv.refr_urlpath,
	    pv.refr_urlquery,
	    pv.refr_urlfragment,
	    pv.refr_medium,
	    pv.refr_source,
	    pv.refr_term,
	    pv.geo_country,
	    pv.geo_region,
	    pv.geo_region_name,
	    pv.geo_city,
	    pv.geo_zipcode,
	    pv.geo_latitude,
	    pv.geo_longitude,
	    pv.geo_timezone,
	    pv.user_ipaddress,
	    pv.useragent,
	    pv.br_lang,
	    pv.br_viewwidth,
	    pv.br_viewheight,
	    pv.br_colordepth,
	    pv.br_renderengine,
	    pv.os_timezone,
	    pv.category,
	    pv.primary_impact,
	    pv.reason,
	    pv.spider_or_robot,
	    pv.useragent_family,
	    pv.useragent_major,
	    pv.useragent_minor,
	    pv.useragent_patch,
	    pv.useragent_version,
	    pv.os_family,
	    pv.os_major,
	    pv.os_minor,
	    pv.os_patch,
	    pv.os_patch_minor,
	    pv.os_version,
	    pv.device_family,
	    pv.device_class,
	    pv.agent_class,
	    pv.agent_name,
	    pv.agent_name_version,
	    pv.agent_name_version_major,
	    pv.agent_version,
	    pv.agent_version_major,
	    pv.device_brand,
	    pv.device_name,
	    pv.device_version,
	    pv.layout_engine_class,
	    pv.layout_engine_name,
	    pv.layout_engine_name_version,
	    pv.layout_engine_name_version_major,
	    pv.layout_engine_version,
	    pv.layout_engine_version_major,
	    pv.operating_system_class,
	    pv.operating_system_name,
	    pv.operating_system_name_version,
	    pv.operating_system_version
	FROM snowplow_web_page_views AS pv
	INNER JOIN {{ source('atomic', 'com_snowplowanalytics_snowplow_web_page_1') }} AS wp
	    ON pv.event_id = wp.root_id AND pv.collector_tstamp = wp.root_tstamp
	INNER JOIN {{ source('atomic', 'io_snowplow_foundation_content_1') }} AS c
	    ON pv.event_id = c.root_id AND pv.collector_tstamp = c.root_tstamp
)

select * from contents