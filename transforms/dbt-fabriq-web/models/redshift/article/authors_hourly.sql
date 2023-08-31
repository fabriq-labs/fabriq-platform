{{ config(materialized='incremental',unique_key = ['site_id', 'author','period_date', 'period_hour'  ],  sort=['site_id', 'author_id','period_date', 'period_hour' ],
    dist='author_id', schema='derived', tags="hourly_run") }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
total_time_spent as (
	select
		to_char(dc.custom_tstamp, 'YYYY-MM-DD'::text) as period_date,
		sum(dc.engaged_time_in_s) as total_time,
		DATE_PART('hour', custom_tstamp) as period_hour,
    	(sum(dc.engaged_time_in_s)/count(distinct dc.domain_userid)) :: integer AS average_time,
		author
	from
		content dc
	group by
		(to_char(dc.custom_tstamp, 'YYYY-MM-DD'::text)),
		DATE_PART('hour', custom_tstamp),
		author
),
resf_source as (
SELECT 
	 TO_CHAR(custom_tstamp,'YYYY-MM-DD') as period_date,
	 DATE_PART('hour', custom_tstamp) as period_hour,
     coalesce(refr_source, 'Unknown') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, TO_CHAR(custom_tstamp,'YYYY-MM-DD'), referrer, DATE_PART('hour', custom_tstamp)
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
	 TO_CHAR(custom_tstamp,'YYYY-MM-DD') as period_date,
	 DATE_PART('hour', custom_tstamp) as period_hour,
     coalesce(refr_medium, 'Direct') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, TO_CHAR(custom_tstamp,'YYYY-MM-DD'), referrer, DATE_PART('hour', custom_tstamp)
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
	TO_CHAR(custom_tstamp,'YYYY-MM-DD') as period_date,
	DATE_PART('hour', custom_tstamp) as period_hour,
	author,
	geo_country as country,
	COUNT(distinct domain_userid) as cnt
from content
group by
	TO_CHAR(custom_tstamp,
	'YYYY-MM-DD'),DATE_PART('hour', custom_tstamp),
	country,
	author
),
city AS (
    SELECT
        TO_CHAR(custom_tstamp, 'YYYY-MM-DD') AS period_date,
		DATE_PART('hour', custom_tstamp) as period_hour,
        author,
        geo_country AS country,
        geo_city AS city,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id
    FROM content
    GROUP BY app_id, author, geo_country, geo_city, TO_CHAR(custom_tstamp, 'YYYY-MM-DD'), DATE_PART('hour', custom_tstamp)
),
ranked_cities AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY country, period_date, period_hour, author ORDER BY cnt DESC) AS city_rank
    FROM city
),
country_wise_city AS (
    SELECT
        '{' || LISTAGG('"' || city || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY city) || '}' AS cities,
        country,
        period_date,
		period_hour,
        author
    FROM ranked_cities
    WHERE city_rank <= 10
    GROUP BY app_id, author, country, period_date,period_hour
),
authors as (
select
	app_id as site_id,
	count(distinct page_view_id) as page_views,
	author,
	author as author_id,
	count(distinct domain_userid) as users,
	TO_CHAR(custom_tstamp,'YYYY-MM-DD') as period_date,
	sum(engaged_time_in_s) as attention_time,
	DATE_PART('hour', custom_tstamp) AS period_hour,
	CURRENT_TIMESTAMP as created_at,
	'00:00' as time_of_day,
	'hourly' as frequency,
	'[]' as key_words,
	'{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' as exit_page_distribution
	
from content c
group by app_id, author, TO_CHAR(custom_tstamp,'YYYY-MM-DD'), DATE_PART('hour', custom_tstamp)
)

select a.*,
s.org_id,
(select total_time from total_time_spent tts where tts.period_date=a.period_date and tts.author=a.author and tts.period_hour = a.period_hour) as total_time_spent,
(select average_time from total_time_spent tts where tts.period_date=a.period_date and tts.author=a.author and tts.period_hour = a.period_hour) as average_time_spent,
(select '{' || LISTAGG('"' || referrer || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY referrer) || '}' from source_distribution refr where refr.period_date = a.period_date and refr.author = a.author and refr.period_hour = a.period_hour) as source_distribution,
(select '{' || LISTAGG('"' || referrer || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY referrer) || '}' from medium_distribution refr where refr.period_date = a.period_date and refr.author = a.author and refr.period_hour = a.period_hour) as medium_distribution,
(select '{' || LISTAGG('"' || country || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY country) || '}' from countries c where c.period_date = a.period_date and c.author = a.author and c.period_hour = a.period_hour) as country_distribution,
(select '{' || LISTAGG('"' || country || '": ' || cities, ', ') WITHIN GROUP (ORDER BY country) || '}'
from country_wise_city c where
c.period_date = a.period_date
and c.period_hour = a.period_hour and c.author = a.author) as country_wise_city
from authors a
inner join {{ source('atomic', 'sites') }} s on
	s.site_id = a.site_id