{{ config(materialized='incremental',unique_key = ['title', 'author','period_date', 'page_views', 'attention_time', 'users'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
devices AS (
    SELECT
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
        content_id,
       	COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) , device, content_id
),
referrers AS (
    SELECT
       
        FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
        content_id,
        coalesce(refr_medium, 'Direct') as referrer,
        COUNT(distinct domain_userid) as cnt
from
content
group by
FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) ,
referrer,
content_id
),
countries as (
select
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
	content_id,
	geo_country as country,
	COUNT(distinct domain_userid) as cnt
from
	content
group by
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) ,
	country,
	content_id
),
socials as (
select
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
	content_id,
	coalesce(refr_source , 'Unknown') as social,
	COUNT(distinct domain_userid) as cnt
from
	content
group by
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) ,
	social,
	content_id
),
session_counts as (
select
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
	content_id,
	domain_sessionid,
	COUNT(page_view_id) as session_page_views
from
	content
group by
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) ,
	domain_sessionid,
	content_id
),
   total_time_spent as (
select
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
	sum(dc.engaged_time_in_s) as total_time,
	content_id
from
	atomic_derived.derived_contents dc
group by
	(FORMAT_TIMESTAMP('%Y-%m-%d', dc.derived_tstamp) ),
	content_id
        ),
 average_time_spent AS (
  SELECT
    FORMAT_TIMESTAMP('%Y-%m-%d', dc.derived_tstamp) AS period_date,
    (avg(dc.engaged_time_in_s))  AS average_time,
    content_id
  FROM
    atomic_derived.derived_contents dc
  GROUP BY
    (FORMAT_TIMESTAMP('%Y-%m-%d', dc.derived_tstamp)), content_id
),
article_daily as (
select
	app_id as site_id,
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) as period_date,
	cba.content_id as article_id,
	COUNT(DISTINCT page_view_id) as page_views,
	cba.content_name as title,
		author,
		author as author_id,
	COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN domain_sessionid ELSE NULL END) AS new_users,
	SUM(CASE WHEN page_views_in_session = 1 THEN 1 ELSE 0 END) / COUNT(DISTINCT domain_sessionid) AS bounce_rate,
	AVG(session_page_views) as pageviews_per_session,
	COUNT(distinct cba.domain_sessionid) / COUNT(distinct domain_userid) as session_per_user,
	COUNT(distinct domain_userid) as users,
	SUM(engaged_time_in_s) as attention_time,
	CURRENT_TIMESTAMP as created_at,
	'daily' as frequency,
	1 as total_shares,
	'[]' as key_words,
	'{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' as exit_page_distribution
from
	content cba
join session_counts on
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) = session_counts.period_date
	and session_counts.content_id = cba.content_id
group by
	app_id,
	FORMAT_TIMESTAMP('%Y-%m-%d', derived_tstamp) ,
	cba.content_id,
	cba.content_name,
	cba.author
)

select
	article_daily.*,
	(
	select
		total_time
	from
		total_time_spent
	where
		total_time_spent.period_date = article_daily.period_date
		and
		total_time_spent.content_id = article_daily.article_id) as total_time_spent,
(
	select
		average_time
	from
		average_time_spent
	where
		average_time_spent.period_date = article_daily.period_date
		and
		average_time_spent.content_id = article_daily.article_id) as average_time_spent,
	(
	select
		CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', country, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      )
	from
		countries
	where
		countries.period_date = article_daily.period_date
		and
		countries.content_id = article_daily.article_id) as country_distribution,
	(
	select
		CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', referrer, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      )
	from
		referrers
	where
		referrers.period_date = article_daily.period_date
		and
		referrers.content_id = article_daily.article_id) as referrer_distribution,
	(
	select
		CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', device, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      )
	from
		devices
	where
		devices.period_date = article_daily.period_date
		and
		devices.content_id = article_daily.article_id) as device_distribution,
    (
	select
		CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', social, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      )
	from
		socials
	where
		socials.period_date = article_daily.period_date
		and
		socials.content_id = article_daily.article_id) as social_distribution,
		s.org_id
from
	article_daily
	
	inner join public.sites s  on s.site_id = article_daily.site_id