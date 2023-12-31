with prep as (
  select
    app_id,
    platform,
    etl_tstamp,
    collector_tstamp,
    dvce_created_tstamp,
    event,
    event_id,
    txn_id,
    name_tracker,
    v_tracker,
    v_collector,
    v_etl,
    user_id,
    user_ipaddress,
    user_fingerprint,
    domain_userid,
    domain_sessionidx,
    network_userid,
    geo_country,
    geo_region,
    geo_city,
    geo_zipcode,
    geo_latitude,
    geo_longitude,
    geo_region_name,
    ip_isp,
    ip_organization,
    ip_domain,
    ip_netspeed,
    page_url,
    page_title,
    page_referrer,
    page_urlscheme,
    page_urlhost,
    page_urlport,
    page_urlpath,
    page_urlquery,
    page_urlfragment,
    refr_urlscheme,
    refr_urlhost,
    refr_urlport,
    refr_urlpath,
    refr_urlquery,
    refr_urlfragment,
    refr_medium,
    refr_source,
    refr_term,
    mkt_medium,
    mkt_source,
    mkt_term,
    mkt_content,
    mkt_campaign,
    se_category,
    se_action,
    se_label,
    se_property,
    se_value,
    tr_orderid,
    tr_affiliation,
    tr_total,
    tr_tax,
    tr_shipping,
    tr_city,
    tr_state,
    tr_country,
    ti_orderid,
    ti_sku,
    ti_name,
    ti_category,
    ti_price,
    ti_quantity,
    pp_xoffset_min,
    pp_xoffset_max,
    pp_yoffset_min,
    pp_yoffset_max,
    useragent,
    br_name,
    br_family,
    br_version,
    br_type,
    br_renderengine,
    br_lang,
    br_features_pdf,
    br_features_flash,
    br_features_java,
    br_features_director,
    br_features_quicktime,
    br_features_realplayer,
    br_features_windowsmedia,
    br_features_gears,
    br_features_silverlight,
    br_cookies,
    br_colordepth,
    br_viewwidth,
    br_viewheight,
    os_name,
    os_family,
    os_manufacturer,
    os_timezone,
    dvce_type,
    dvce_ismobile,
    dvce_screenwidth,
    dvce_screenheight,
    doc_charset,
    doc_width,
    doc_height,
    tr_currency,
    tr_total_base,
    tr_tax_base,
    tr_shipping_base,
    ti_currency,
    ti_price_base,
    base_currency,
    geo_timezone,
    mkt_clickid,
    mkt_network,
    etl_tags,
    dvce_sent_tstamp,
    refr_domain_userid,
    refr_dvce_tstamp,
    domain_sessionid,
    derived_tstamp,
    event_vendor,
    event_name,
    event_format,
    event_version,
    event_fingerprint,
    true_tstamp,
    event_id_dedupe_index,
    row_count,
    parse_json(contexts_com_snowplowanalytics_snowplow_web_page_1_0_0) as contexts_com_snowplowanalytics_snowplow_web_page_1,
    parse_json(contexts_org_whatwg_video_element_1_0_0) as contexts_org_whatwg_video_element_1,
    parse_json(contexts_org_whatwg_media_element_1_0_0) as contexts_org_whatwg_media_element_1,
    parse_json(contexts_com_youtube_youtube_1_0_0) as contexts_com_youtube_youtube_1,
    parse_json(contexts_com_snowplowanalytics_snowplow_media_player_1_0_0) as contexts_com_snowplowanalytics_snowplow_media_player_1,
    parse_json(unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1_0_0) as unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1

from {{ ref('snowplow_media_player_events') }}
)

, flatten as (

  select
    *,
    --unstruct_event_com_snowplowanalytics_mobile_screen_view_1[0]:previous_id::varchar AS previousId,
    contexts_com_snowplowanalytics_snowplow_web_page_1[0]:id::varchar as id,
    contexts_org_whatwg_video_element_1[0]:video_height::varchar as videoHeight,
    contexts_org_whatwg_video_element_1[0]:video_width::varchar as videoWidth,
    contexts_org_whatwg_video_element_1[0]:auto_picture_in_picture::varchar as autoPictureInPicture,
    contexts_org_whatwg_video_element_1[0]:disable_picture_in_picture::varchar as disablePictureInPicture,
    contexts_org_whatwg_video_element_1[0]:poster::varchar as poster,

    contexts_org_whatwg_media_element_1[0]:auto_play::varchar as autoPlay,
    contexts_org_whatwg_media_element_1[0]:current_src::varchar as currentSrc,
    contexts_org_whatwg_media_element_1[0]:default_muted::varchar as defaultMuted,
    contexts_org_whatwg_media_element_1[0]:default_playback_rate::varchar as defaultPlaybackRate,
    contexts_org_whatwg_media_element_1[0]:html_id::varchar as htmlId,
    contexts_org_whatwg_media_element_1[0]:media_type::varchar as mediaType,
    contexts_org_whatwg_media_element_1[0]:network_state::varchar as networkState,
    contexts_org_whatwg_media_element_1[0]:preload::varchar as preload,
    contexts_org_whatwg_media_element_1[0]:ready_state::varchar as readyState,
    contexts_org_whatwg_media_element_1[0]:seeking::varchar as seeking,
    contexts_org_whatwg_media_element_1[0]:cross_origin::varchar as crossOrigin,
    contexts_org_whatwg_media_element_1[0]:disable_remote_playback::varchar as disableRemotePlayback,
    contexts_org_whatwg_media_element_1[0]:error::varchar as error,
    contexts_org_whatwg_media_element_1[0]:file_extension::varchar as fileExtension,
    contexts_org_whatwg_media_element_1[0]:fullscreen::varchar as fullscreen,
    contexts_org_whatwg_media_element_1[0]:picture_in_picture::varchar as pictureInPicture,
    contexts_org_whatwg_media_element_1[0]:played::varchar as played,
    contexts_org_whatwg_media_element_1[0]:src::varchar as src,
    contexts_org_whatwg_media_element_1[0]:text_tracks::varchar as textTracks,

    contexts_com_youtube_youtube_1[0]:auto_play::varchar as YautoPlay,
    contexts_com_youtube_youtube_1[0]:available_playback_rates::varchar as availablePlaybackRates,
    contexts_com_youtube_youtube_1[0]:buffering::varchar as buffering,
    contexts_com_youtube_youtube_1[0]:controls::varchar as controls,
    contexts_com_youtube_youtube_1[0]:cued::varchar as cued,
    contexts_com_youtube_youtube_1[0]:loaded::varchar as loaded,
    contexts_com_youtube_youtube_1[0]:playback_quality::varchar as playbackQuality,
    contexts_com_youtube_youtube_1[0]:player_id::varchar as playerId,
    contexts_com_youtube_youtube_1[0]:unstarted::varchar as unstarted,
    contexts_com_youtube_youtube_1[0]:url::varchar as url,
    contexts_com_youtube_youtube_1[0]:error::varchar as Yerror,
    contexts_com_youtube_youtube_1[0]:fov::varchar as fov,
    contexts_com_youtube_youtube_1[0]:origin::varchar as origin,
    contexts_com_youtube_youtube_1[0]:pitch::varchar as pitch,
    contexts_com_youtube_youtube_1[0]:playlist::varchar as playlist,
    contexts_com_youtube_youtube_1[0]:playlist_index::varchar as playlist_index,
    contexts_com_youtube_youtube_1[0]:roll::varchar as roll,
    contexts_com_youtube_youtube_1[0]:yaw::varchar as yaw,

    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:current_time::varchar as currentTime,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:ended::varchar as ended,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:loop::varchar as loop,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:muted::varchar as muted,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:paused::varchar as paused,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:playback_rate::varchar as playbackRate,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:volume::varchar as volume,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:duration::varchar as duration,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:is_live::varchar as isLive,
    contexts_com_snowplowanalytics_snowplow_media_player_1[0]:percent_progress::varchar as percentProgress,

    unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1[0]:type as type,
    unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1[0]:label as label

from prep

)

select
  app_id,
  platform,
  etl_tstamp,
  collector_tstamp,
  dvce_created_tstamp,
  event,
  event_id,
  txn_id,
  name_tracker,
  v_tracker,
  v_collector,
  v_etl,
  user_id,
  user_ipaddress,
  user_fingerprint,
  domain_userid,
  domain_sessionidx,
  network_userid,
  geo_country,
  geo_region,
  geo_city,
  geo_zipcode,
  geo_latitude,
  geo_longitude,
  geo_region_name,
  ip_isp,
  ip_organization,
  ip_domain,
  ip_netspeed,
  page_url,
  page_title,
  page_referrer,
  page_urlscheme,
  page_urlhost,
  page_urlport,
  page_urlpath,
  page_urlquery,
  page_urlfragment,
  refr_urlscheme,
  refr_urlhost,
  refr_urlport,
  refr_urlpath,
  refr_urlquery,
  refr_urlfragment,
  refr_medium,
  refr_source,
  refr_term,
  mkt_medium,
  mkt_source,
  mkt_term,
  mkt_content,
  mkt_campaign,
  se_category,
  se_action,
  se_label,
  se_property,
  se_value,
  tr_orderid,
  tr_affiliation,
  tr_total,
  tr_tax,
  tr_shipping,
  tr_city,
  tr_state,
  tr_country,
  ti_orderid,
  ti_sku,
  ti_name,
  ti_category,
  ti_price,
  ti_quantity,
  pp_xoffset_min,
  pp_xoffset_max,
  pp_yoffset_min,
  pp_yoffset_max,
  useragent,
  br_name,
  br_family,
  br_version,
  br_type,
  br_renderengine,
  br_lang,
  br_features_pdf,
  br_features_flash,
  br_features_java,
  br_features_director,
  br_features_quicktime,
  br_features_realplayer,
  br_features_windowsmedia,
  br_features_gears,
  br_features_silverlight,
  br_cookies,
  br_colordepth,
  br_viewwidth,
  br_viewheight,
  os_name,
  os_family,
  os_manufacturer,
  os_timezone,
  dvce_type,
  dvce_ismobile,
  dvce_screenwidth,
  dvce_screenheight,
  doc_charset,
  doc_width,
  doc_height,
  tr_currency,
  tr_total_base,
  tr_tax_base,
  tr_shipping_base,
  ti_currency,
  ti_price_base,
  base_currency,
  geo_timezone,
  mkt_clickid,
  mkt_network,
  etl_tags,
  dvce_sent_tstamp,
  refr_domain_userid,
  refr_dvce_tstamp,
  domain_sessionid,
  derived_tstamp,
  event_vendor,
  event_name,
  event_format,
  event_version,
  event_fingerprint,
  true_tstamp,
  event_id_dedupe_index,
  row_count,
  parse_json('[{"id":"'||id||'"}]' ) as contexts_com_snowplowanalytics_snowplow_web_page_1,
  parse_json('[{"videoHeight":"'||videoHeight||'", "videoWidth":"'||videoWidth||'", "autoPictureInPicture":"'||autoPictureInPicture||'", "disablePictureInPicture":"'||disablePictureInPicture||'", "poster":"'||poster||'"}]' ) as contexts_org_whatwg_video_element_1,
  parse_json('[{"autoPlay":"'||autoPlay||'", "currentSrc":"'||currentSrc||'", "defaultMuted":"'||defaultMuted||'", "defaultPlaybackRate":"'||defaultPlaybackRate||'", "htmlId":"'||htmlId||'", "mediaType":"'||mediaType||'", "networkState":"'||networkState||'", "preload":"'||preload||'", "readyState":"'||readyState||'", "seeking":"'||seeking||'", "crossOrigin":"'||crossOrigin||'", "disableRemotePlayback":"'||disableRemotePlayback||'", "error":"'||error||'", "fileExtension":"'||fileExtension||'", "fullscreen":"'||fullscreen||'", "pictureInPicture":"'||pictureInPicture||'", "played":"'||played||'", "src":"'||src||'", "textTracks":"'||textTracks||'"}]') as contexts_org_whatwg_media_element_1,
  parse_json('[{"autoPlay":"'||YautoPlay||'", "availablePlaybackRates":"'||availablePlaybackRates||'", "buffering":"'||buffering||'", "controls":"'||controls||'", "cued":"'||cued||'", "loaded":"'||loaded||'", "playbackQuality":"'||playbackQuality||'", "playerId":"'||playerId||'", "unstarted":"'||unstarted||'", "url":"'||url||'", "error":"'||Yerror||'", "fov":"'||fov||'", "origin":"'||origin||'", "pitch":"'||pitch||'", "playlist":"'||playlist||'", "playlist_index":"'||playlist_index||'", "roll":"'||roll||'", "yaw":"'||yaw||'"}]') as contexts_com_youtube_youtube_1,
  parse_json('[{"currentTime":"'||currentTime||'", "ended":"'||ended||'", "loop":"'||loop||'", "muted":"'||muted||'", "paused":"'||paused||'", "playbackRate":"'||playbackRate||'", "volume":"'||volume||'", "duration":"'||duration||'", "isLive":"'||isLive||'", "percentProgress":"'||percentProgress||'"}]') as contexts_com_snowplowanalytics_snowplow_media_player_1,
  object_construct('label',label,'type',type) as unstruct_event_com_snowplowanalytics_snowplow_media_player_event_1

from flatten

