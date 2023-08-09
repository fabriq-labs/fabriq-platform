{{ config(materialized='incremental',unique_key = ['site_id', 'author','period_month', 'period_year' ],  sort=['site_id', 'author_id','period_month', 'period_year' ],
    dist='author_id', schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this, 'monthly') }}
    {% endif %}
),
total_time_spent as (
	select
		EXTRACT(year FROM derived_tstamp) AS period_year,
		EXTRACT(MONTH FROM derived_tstamp)as period_month,
		sum(dc.engaged_time_in_s) as total_time,
    	(sum(dc.engaged_time_in_s)/count(distinct dc.domain_userid)) :: integer AS average_time,
		author
	from
		content dc
	group by
		EXTRACT(MONTH FROM derived_tstamp),
		EXTRACT(year FROM derived_tstamp),
		author
),
resf_source as (
SELECT 

	 EXTRACT(year FROM derived_tstamp) AS period_year,
	 EXTRACT(MONTH FROM derived_tstamp)as period_month,
     coalesce(refr_source, 'Unknown') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, EXTRACT(MONTH FROM derived_tstamp),EXTRACT(year FROM derived_tstamp), referrer
),
source_distribution as (
SELECT 
	 period_year,
	 period_month,
     referrer,
     author,
     sum(cnt) as cnt
FROM resf_source c
GROUP BY period_year,period_month, referrer, author
),
refr_medium as (
SELECT 
	 EXTRACT(year FROM derived_tstamp) AS period_year,
	 EXTRACT(MONTH FROM derived_tstamp)as period_month,
     coalesce(refr_medium, 'Direct') as referrer,
     author,
     COUNT(distinct domain_userid) as cnt
FROM content c
GROUP BY app_id, author, EXTRACT(MONTH FROM derived_tstamp),EXTRACT(year FROM derived_tstamp), referrer
),
medium_distribution as (
SELECT 
	 period_year,
	 period_month,
     referrer,
     author,
     sum(cnt) as cnt
FROM refr_medium c
GROUP BY period_year, period_month,referrer, author
),
countries as (
select
	EXTRACT(year FROM derived_tstamp) AS period_year,
	EXTRACT(MONTH FROM derived_tstamp)as period_month,
	author,
	geo_country as country,
	COUNT(distinct domain_userid) as cnt
from content
group by
EXTRACT(MONTH FROM derived_tstamp),
	EXTRACT(year FROM derived_tstamp),
	country,
	author
),
city AS (
    SELECT
        EXTRACT(year FROM derived_tstamp) AS period_year,
		EXTRACT(MONTH FROM derived_tstamp)as period_month,
        author,
        geo_country AS country,
        geo_city AS city,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id
    FROM content
    GROUP BY app_id, author, geo_country, geo_city, EXTRACT(MONTH FROM derived_tstamp),
	EXTRACT(year FROM derived_tstamp)
),
ranked_cities AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY country, period_year, period_month, author ORDER BY cnt DESC) AS city_rank
    FROM city
),
country_wise_city AS (
    SELECT
        JSON_OBJECT_AGG(COALESCE(city, 'Unknown'), cnt) AS cities,
        country,
        period_year,
		period_month,
        author
    FROM ranked_cities
    WHERE city_rank <= 10
    GROUP BY app_id, author, country, period_year,period_month
),
authors as (
select
	app_id as site_id,
	count(distinct page_view_id) as page_views,
	author,
	author as author_id,
	count(distinct domain_userid) as users,
	EXTRACT(year FROM derived_tstamp) AS period_year,
	EXTRACT(MONTH FROM derived_tstamp)as period_month,
	sum(engaged_time_in_s) as attention_time,
	CURRENT_TIMESTAMP as created_at,
	'00:00' as time_of_day,
	'monthly' as frequency,
	'[]' as key_words,
	'{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' as exit_page_distribution
	
from content c
group by app_id, author, EXTRACT(year FROM derived_tstamp),EXTRACT(MONTH FROM derived_tstamp)
)

select 
s.org_id,
a.site_id,
a.page_views,
a.author,
a.author_id,
a.users,
a.attention_time,
a.created_at,
a.time_of_day,
a.frequency,
a.key_words,
a.exit_page_distribution,
CAST(a.period_month AS integer) as period_month,
CAST(a.period_year AS integer) as period_year,
(select total_time from total_time_spent tts where tts.period_year=a.period_year and tts.period_month=a.period_month and tts.author=a.author) as total_time_spent,
(select average_time from total_time_spent tts where tts.period_year=a.period_year and tts.period_month=a.period_month and tts.author=a.author) as average_time_spent,
(select JSON_OBJECT_AGG(referrer,cnt) from source_distribution refr where refr.period_year = a.period_year and refr.period_month=a.period_month and refr.author = a.author) as source_distribution,
(select JSON_OBJECT_AGG(referrer,cnt) from medium_distribution refr where refr.period_year = a.period_year and refr.period_month=a.period_month and refr.author = a.author) as medium_distribution,
(select JSON_OBJECT_AGG(COALESCE(country, 'Unknown'), cnt) from countries c where c.period_year = a.period_year and c.period_month = a.period_month and c.author = a.author) as country_distribution,
(select JSON_OBJECT_AGG(COALESCE(country, 'Unknown'), cities)
from country_wise_city c where
c.period_month = a.period_month
and c.period_year = a.period_year and c.author = a.author) as country_wise_city
from authors a
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = a.site_id

