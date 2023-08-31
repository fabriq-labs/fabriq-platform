{{ 
    config(materialized='incremental',unique_key = ['site_id', 'media_id', 'media_label', 'period_year', 'org_id' ], 
    sort=['site_id', 'media_id', 'period_year'],
    dist='media_id', 
    schema='derived') 
}}
with video_content as(
    select * from {{ ref('snowplow_media_player_base') }}
    --  {% if is_incremental() %}
    --     where  date(collector_tstamp) >= (select max(date(created_at)) from {{this}})
    -- {% endif %}
),
cities as (
    select site_id, media_id,period_year, city, average_users
    from (
        select
            site_id, media_id,
            period_year,
            city,
            average_users,
            row_number() over(partition by period_year order by average_users desc) as rank_within_period
        from (
            SELECT
                app_id AS site_id, media_id,
                EXTRACT(YEAR FROM collector_tstamp) AS period_year,
                COALESCE(geo_city, 'unknown') AS city,
                COUNT(DISTINCT domain_userid) AS users,
                AVG(COUNT(DISTINCT domain_userid)) OVER (PARTITION BY city, period_year) AS average_users
            FROM video_content
            GROUP BY 1, 2, 3, 4
        ) as sub
    ) as ranked_sub
    where rank_within_period <= 5
    order by period_year, average_users desc
),
top_refrer_source as (
    select site_id, media_id,period_year,referrer, users
    from (
        select 
            site_id, media_id,
            period_year,
            referrer,
            users,
            row_number() over(partition by period_year order by users desc) as rank_within_period
        from (
            select 
                app_id as site_id, media_id,
                EXTRACT(YEAR FROM collector_tstamp) AS  period_year,
                coalesce(refr_source, 'direct') as referrer,
                count(distinct domain_userid) as users
            from video_content c
            group by site_id, media_id,period_year, referrer
        ) as sub
    ) as ranked_sub
    where rank_within_period <= 5
    order by period_year, users desc
),
viewer_segments as (
    select
        domain_userid,
        app_id as site_id,
        media_id,
        EXTRACT(YEAR FROM collector_tstamp) AS  period_year,
        sum(play_time_sec) as total_play_time,
        count(distinct domain_sessionid) as total_sessions
    from video_content
    group by 1, 2, 3, 4
),
segmented_viewers as (
    select
        site_id,
        media_id,
        period_year,
        domain_userid,
        total_play_time,
        total_sessions,
        case
            when total_play_time <= 30 and total_sessions <= 3 then 'casual'
            else 'loyal'
        end as viewer_segment
    from
        viewer_segments
),
viewer_counts as (
    select
        site_id,
        media_id,
        period_year,
        viewer_segment,
        count(*) as segment_count
    from
        segmented_viewers
    group by
        site_id, media_id,period_year, viewer_segment
),
viewer_percent as (
    select
        site_id,
        media_id,
        period_year,
        viewer_segment,
        (segment_count * 100) / sum(segment_count) as segment_percentage
    from
        viewer_counts
    group by
        site_id, media_id,period_year, viewer_segment, segment_count
),
final_segmented_viewers as (
    select
        vc.site_id,
        vc.media_id,
        vc.period_year,
        '{ "casual": ' || coalesce(max(case when viewer_segment = 'casual' then segment_percentage end), 0) || ', "loyal": ' || coalesce(max(case when viewer_segment = 'loyal' then segment_percentage end), 0) || ' }'  as casual_and_loyal_viewers_percentage
    from
        viewer_percent vc
    group by
        vc.site_id, vc.media_id, vc.period_year
),
devices as (
    select
        app_id as site_id,
        media_id,
        dvce_type,
        EXTRACT(YEAR FROM collector_tstamp) AS  period_year,
        count(distinct domain_userid) as users
    from video_content
    group by 1, 2, 3, 4
),
device_summary as (
    select
        site_id,
        media_id,
        period_year,
        sum(case when dvce_type = 'phone' then users else 0 end) as mobile_users,
        sum(case when dvce_type is null or dvce_type != 'phone' then users else 0 end) as other_users
    from devices
    group by 1, 2, 3
),
final_device_summary as (
    select
        vc.site_id,
        vc.media_id,
        vc.period_year,
        '{ "mobile": ' || 
        case
            when (mobile_users + other_users) = 0 then 0
            else round((mobile_users * 100.0) / (mobile_users + other_users), 2)
        end || 
        ', "desktop_and_tablet": ' || 
         case
            when (mobile_users + other_users) = 0 then 0
            else round((other_users * 100.0) / (mobile_users + other_users), 2)
        end
        || ' }'  
        as mobile_and_desktop_viewer_percentage
    from
        device_summary vc
    group by
        1, 2, 3, 4
),
completion_rate as (
    select 
        app_id as site_id, 
        media_id,
        EXTRACT(YEAR FROM collector_tstamp) AS  period_year,
        count(distinct domain_userid) as users,
        '{ "_10_percent_reached": ' || 
            COUNT(DISTINCT CASE WHEN COALESCE(max_percent_progress,0) >= 10 THEN domain_userid END)
        || ', "_25_percent_reached": ' || 
            COUNT(DISTINCT CASE WHEN COALESCE(max_percent_progress,0) >= 25 THEN domain_userid END)
        || ', "_50_percent_reached": ' || 
            COUNT(DISTINCT CASE WHEN COALESCE(max_percent_progress,0) >= 50 THEN domain_userid END)
        || ', "_75_percent_reached": ' || 
            COUNT(DISTINCT CASE WHEN COALESCE(max_percent_progress,0) >= 75 THEN domain_userid END)
        || ', "_100_percent_reached": ' || 
            COUNT(DISTINCT CASE WHEN COALESCE(max_percent_progress,0) >= 100 THEN domain_userid END)
        || ' }'  
        as completion_rate_viewer_percent
    from video_content
    group by 1,2,3
),
video as (
    select app_id as site_id, media_id, media_label, EXTRACT(YEAR FROM collector_tstamp) AS  period_year,
    count(distinct page_view_id) page_views, sum(case when is_valid_play then 1 else 0 end) as valid_play_views,
    count(distinct v.domain_userid) users,
        case
            when count(v.domain_sessionid) > 0 
            then (sum(case when is_complete_play = 1 then 1 else 0 end) / count(v.domain_sessionid)) * 100
            else 0
        end as completion_rate,
        case
            when sum(play_time_sec_muted + play_time_sec) > 0 
            then (sum(play_time_sec) / sum(play_time_sec_muted + play_time_sec)) * 100
            else 0
        end as unmute_rate,
        case
            when sum(play_time_sec_fullscreen + play_time_sec) > 0 
            then (sum(play_time_sec) / sum(play_time_sec_fullscreen + play_time_sec)) * 100
            else 0
        end as fullscreen_rate
    from video_content v
    group by 1, 2, 3, 4
)
select 
    v.*,
    s.org_id,
    (
    select
      '{' || listagg('"' || city || '": ' || average_users, ', ') within group (order by average_users desc) || '}'
    from
      cities
    where cities.period_year =  v.period_year and cities.site_id = v.site_id and cities.media_id = v.media_id
    ) as top_cities,
    (
    select
      '{' || listagg('"' || referrer || '": ' || users, ', ') within group (order by users desc) || '}'
    from
      top_refrer_source re
    where re.period_year = v.period_year and re.site_id = v.site_id and re.media_id = v.media_id
    ) as top_referers,
    (
      select casual_and_loyal_viewers_percentage
      from final_segmented_viewers re where re.period_year = v.period_year and re.site_id = v.site_id and re.media_id = v.media_id
    ) as casual_and_loyal_viewers_percentage,
    (
      select mobile_and_desktop_viewer_percentage
      from final_device_summary re 
      where re.period_year = v.period_year and re.site_id = v.site_id and re.media_id = v.media_id
    ) as mobile_and_desktop_viewer_percentage,
    (
      select completion_rate_viewer_percent
      from completion_rate re 
      where re.period_year = v.period_year and re.site_id = v.site_id and re.media_id = v.media_id
    ) as completion_rate_viewer_percent,
    current_timestamp as created_at
from video v
inner join {{ source('atomic', 'sites') }} s ON s.site_id = v.site_id
