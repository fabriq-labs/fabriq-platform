{{
  config(
    materialized='table',
    tags=["this_run"],
    partition_by = snowplow_utils.get_value_by_target_type(bigquery_val={
      "field": "start_tstamp",
      "data_type": "timestamp"
    }, databricks_val='start_tstamp_date'),
    cluster_by=snowplow_utils.get_value_by_target_type(bigquery_val=["media_id"]),
    sort = 'start_tstamp',
    dist = 'play_id',
    sql_header=snowplow_utils.set_query_tag(var('snowplow__query_tag', 'snowplow_dbt'))
  )
}}

with prep as (

  select
    i.play_id,
    i.page_view_id,
    i.media_id,
    i.media_label,
    i.domain_sessionid,
    i.domain_userid,
    max(i.duration) as duration,
    i.media_type,
    i.media_player_type,
    i.page_referrer,
    i.page_url,
    max(i.source_url) as source_url,
    i.app_id,
    i.geo_city,
    i.geo_region_name,
    i.geo_country,
    i.collector_tstamp,
    i.refr_source,
    i.refr_medium,
    i.page_title,
    i.page_urlpath,
    i.refr_urlhost,
    i.br_name,
    i.dvce_type,
    i.os_name,
    i.os_timezone,
    min(start_tstamp) as start_tstamp,
    max(start_tstamp) as end_tstamp,
    sum(case when i.event_type = 'play' then 1 else 0 end) as plays,
    sum(case when i.event_type in ('seek', 'seeked') then 1 else 0 end) as seeks,
    sum(i.play_time_sec) as play_time_sec,
    sum(i.play_time_sec_muted) as play_time_sec_muted,
    sum(i.play_time_sec_fullscreen) as play_time_sec_fullscreen,
    coalesce(sum(i.playback_rate * i.play_time_sec) / nullif(sum(i.play_time_sec), 0), max(i.playback_rate)) as avg_playback_rate,
    {{ snowplow_utils.get_string_agg('percent_progress', 'i', sort_numeric=true) }} as percent_progress_reached,
    min(case when i.event_type in ('seek', 'seeked') then start_tstamp end) as first_seek_time,
    max(i.percent_progress) as max_percent_progress

  from  {{ ref('snowplow_media_player_interactions_this_run') }} as i

  group by 1,2,3,4,5,6,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26

)

, dedupe as (

  select
    *,
    row_number() over (partition by play_id order by start_tstamp) as duplicate_count

  from prep

)

, retention_rate as (

    select
      d.play_id,
      max(i.percent_progress) as retention_rate

    from dedupe d

    inner join {{ ref("snowplow_media_player_interactions_this_run") }} i
    on i.play_id = d.play_id

    where i.percent_progress is not null and (i.start_tstamp <= d.first_seek_time or d.first_seek_time is null)

    group by 1

)

-- for correcting NULLs in case of 'ready' events only where the metadata showing the duration is usually missing as the event fires before it has time to load
, duration_fix as (

  select
    f.media_id,
    max(f.duration) as duration

  from  {{ ref('snowplow_media_player_interactions_this_run') }} as f

  group by 1

)

select
  d.app_id,
  d.play_id,
  d.page_view_id,
  d.media_id,
  d.media_label,
  d.domain_sessionid,
  d.domain_userid,
  f.duration,
  d.media_type,
  d.media_player_type,
  d.page_referrer,
  d.page_url,
  d.source_url,  
  d.geo_city,
  d.geo_region_name,
  d.geo_country,
  d.collector_tstamp,
  d.collector_tstamp AT TIME ZONE 'UTC' AT TIME ZONE '{{var('snowplow_web')['snowplow__customer_tstamp']}}' AS customer_tstamp,
  d.refr_source,
  d.refr_medium,
  d.page_title,
  d.page_urlpath,
  d.refr_urlhost,
  d.br_name,
  d.dvce_type,
  d.os_name,
  d.os_timezone,
  d.start_tstamp,
  d.end_tstamp,
  d.play_time_sec,
  d.play_time_sec_muted,
  d.play_time_sec_fullscreen,
  d.plays > 0 as is_played,
  d.max_percent_progress,
  case when d.play_time_sec > {{ var("snowplow__valid_play_sec") }} then true else false end is_valid_play,
  case when play_time_sec / nullif(f.duration, 0) >= {{ var("snowplow__complete_play_rate") }} then true else false end as is_complete_play,
  cast(d.avg_playback_rate as {{ type_float() }}) as avg_playback_rate,
  cast(coalesce(case when r.retention_rate > d.max_percent_progress
          then d.max_percent_progress / cast(100 as {{ type_float() }})
          else r.retention_rate / cast(100 as {{ type_float() }})
          end, 0) as {{ type_float() }}) as retention_rate, -- to correct incorrect result due to duplicate session_id (one removed)
  d.seeks,
  case when d.percent_progress_reached = '' then null else d.percent_progress_reached end as percent_progress_reached

  {% if target.type in ['databricks', 'spark'] -%}
  , date(start_tstamp) as start_tstamp_date
  {%- endif %}

from dedupe d

left join retention_rate r
on r.play_id = d.play_id

left join duration_fix f
on f.media_id = d.media_id

where d.duplicate_count = 1
