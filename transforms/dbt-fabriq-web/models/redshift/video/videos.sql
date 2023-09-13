{{ 
    config(materialized='incremental',unique_key = ['site_id', 'media_id', 'media_label','org_id' ], 
    sort=['site_id', 'media_id'],
    dist='media_id', 
    schema='derived') 
}}
with video_content as(
    select * from {{ ref('snowplow_media_player_base') }}
      {% if is_incremental() %}
        where  date(collector_tstamp) >= (select max(date(created_at)) from {{this}})
        {% endif %}
),
videos as (
    select
    app_id AS site_id,
    media_id,
    media_label,
    CURRENT_TIMESTAMP as created_at
    from video_content
    group by app_id,media_id,media_label
)
select v.*, s.org_id from videos v
inner join {{ source('atomic', 'sites') }} s ON s.site_id = v.site_id