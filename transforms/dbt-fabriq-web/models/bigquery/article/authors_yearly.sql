{{ config(materialized='incremental',unique_key = ['author','period_year', 'page_views', 'attention_time', 'users'  ], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
), 

total_time_spent as (
	select
		EXTRACT(year FROM derived_tstamp) AS period_year,
		sum(dc.engaged_time_in_s) as total_time,
    	(avg(dc.engaged_time_in_s))  AS average_time,
		author
	from
		content dc
	group by
		EXTRACT(year FROM derived_tstamp),
		author
),
resf_source as (
SELECT 
	 EXTRACT(year FROM derived_tstamp) AS period_year,
     coalesce(refr_source, 'Unknown') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, EXTRACT(year FROM derived_tstamp), referrer
),
source_distribution as (
SELECT 
	 period_year,
     referrer,
     author,
     sum(cnt) as cnt
FROM resf_source c
GROUP BY period_year, referrer, author
),
refr_medium as (
SELECT 
	 EXTRACT(year FROM derived_tstamp) AS period_year,
     coalesce(refr_medium, 'Direct') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, EXTRACT(year FROM derived_tstamp), referrer
),
medium_distribution as (
SELECT 
	 period_year,
     referrer,
     author,
     sum(cnt) as cnt
FROM refr_medium c
GROUP BY period_year, referrer, author
),
countries as (
select
	EXTRACT(year FROM derived_tstamp) AS period_year,
	author,
	geo_country as country,
	COUNT(distinct domain_userid) as cnt
from content
group by
	EXTRACT(year FROM derived_tstamp),
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
	EXTRACT(year FROM derived_tstamp) AS period_year,
	sum(engaged_time_in_s) as attention_time,
	CURRENT_TIMESTAMP as created_at,
	'00:00' as time_of_day,
	'daily' as frequency,
	'[]' as key_words,
	'{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' as exit_page_distribution
	
from content c
group by app_id, author, EXTRACT(year FROM derived_tstamp)
)

select a.*,s.org_id,
(select total_time from total_time_spent tts where tts.period_year=a.period_year and tts.author=a.author) as total_time_spent,
(select average_time from total_time_spent tts where tts.period_year=a.period_year and tts.author=a.author) as average_time_spent,
(select CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', referrer, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      ) from source_distribution refr where refr.period_year = a.period_year and refr.author = a.author) as source_distribution,
(select CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', referrer, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      ) from medium_distribution refr where refr.period_year = a.period_year and refr.author = a.author) as medium_distribution,
(select CONCAT(
        '{',
        STRING_AGG(
          CONCAT('"', country, '":', CAST(cnt AS STRING)),
          ','
        ),
        '}'
      ) from countries c where c.period_year = a.period_year and c.author = a.author) as country_distribution
from authors a
inner join public.sites s on
	s.site_id = a.site_id
