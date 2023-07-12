{{ config(materialized='incremental',unique_key = ['author','period_date', 'page_views', 'attention_time', 'users'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
total_time_spent as (
	select
		to_char(dc.derived_tstamp, 'YYYY-MM-DD'::text) as period_date,
		sum(dc.engaged_time_in_s) as total_time,
		DATE_PART('hour', derived_tstamp) as period_hour,
    	(avg(dc.engaged_time_in_s)) :: integer AS average_time,
		author
	from
		content dc
	group by
		(to_char(dc.derived_tstamp, 'YYYY-MM-DD'::text)),
		DATE_PART('hour', derived_tstamp),
		author
),
resf_source as (
SELECT 
	 TO_CHAR(derived_tstamp,'YYYY-MM-DD') as period_date,
	 DATE_PART('hour', derived_tstamp) as period_hour,
     coalesce(refr_source, 'Unknown') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, TO_CHAR(derived_tstamp,'YYYY-MM-DD'), referrer, DATE_PART('hour', derived_tstamp)
),
source_distribution as (
SELECT 
	 period_date,
     referrer,
     period_hour,
     author,
     sum(cnt) as cnt
FROM resf_source c
GROUP BY period_date, referrer, author,period_hour
),
refr_medium as (
SELECT 
	 TO_CHAR(derived_tstamp,'YYYY-MM-DD') as period_date,
	 DATE_PART('hour', derived_tstamp) as period_hour,
     coalesce(refr_medium, 'Direct') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, TO_CHAR(derived_tstamp,'YYYY-MM-DD'), referrer, DATE_PART('hour', derived_tstamp)
),
medium_distribution as (
SELECT 
	 period_date,
     referrer,
     period_hour,
     author,
     sum(cnt) as cnt
FROM refr_medium c
GROUP BY period_date, referrer, author,period_hour
),
countries as (
select
	TO_CHAR(derived_tstamp,'YYYY-MM-DD') as period_date,
	DATE_PART('hour', derived_tstamp) as period_hour,
	author,
	geo_country as country,
	COUNT(distinct domain_userid) as cnt
from content
group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),DATE_PART('hour', derived_tstamp),
	country,
	author
),
authors as (
select
	app_id as site_id,
	count(distinct page_view_id) as page_views,
	author,
	author as author_id,
	count(distinct domain_userid) as users,
	TO_CHAR(derived_tstamp,'YYYY-MM-DD') as period_date,
	sum(engaged_time_in_s) as attention_time,
	DATE_PART('hour', derived_tstamp) AS period_hour,
	CURRENT_TIMESTAMP as created_at,
	'00:00' as time_of_day,
	'daily' as frequency,
	'[]' as key_words,
	'{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' as exit_page_distribution
	
from content c
group by app_id, author, TO_CHAR(derived_tstamp,'YYYY-MM-DD'), DATE_PART('hour', derived_tstamp)
)

select a.*,
s.org_id,
(select total_time from total_time_spent tts where tts.period_date=a.period_date and tts.author=a.author and tts.period_hour = a.period_hour) as total_time_spent,
(select average_time from total_time_spent tts where tts.period_date=a.period_date and tts.author=a.author and tts.period_hour = a.period_hour) as average_time_spent,
(select JSON_OBJECT_AGG(referrer,cnt) from source_distribution refr where refr.period_date = a.period_date and refr.author = a.author and refr.period_hour = a.period_hour) as source_distribution,
(select JSON_OBJECT_AGG(referrer,cnt) from medium_distribution refr where refr.period_date = a.period_date and refr.author = a.author and refr.period_hour = a.period_hour) as medium_distribution,
(select JSON_OBJECT_AGG(country, cnt) from countries c where c.period_date = a.period_date and c.author = a.author and c.period_hour = a.period_hour) as country_distribution
from authors a
inner join sites s on
	s.site_id = a.site_id