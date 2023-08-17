{{ config(materialized='incremental',unique_key = ['site_id', 'title', 'author','period_date' ], sort=['site_id', 'article_id', 'author','period_date'],
dist='article_id', schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
devices AS (
    SELECT
        TO_CHAR(derived_tstamp,
	'YYYY-MM-DD') AS period_date,
        content_id,
       	COALESCE(device_class , 'Unknown') AS device,
        COUNT(DISTINCT domain_userid) AS cnt
    FROM content
    GROUP BY  TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'), device, content_id
),
referrers AS (
    SELECT
       
        TO_CHAR(derived_tstamp,
	'YYYY-MM-DD') as period_date,
        content_id,
        coalesce(refr_medium, 'Direct') as referrer,
        COUNT(distinct domain_userid) as cnt
from
content
group by
TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
referrer,
content_id
),
countries as (
select
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD') as period_date,
	content_id,
	geo_country as country,
	COUNT(distinct domain_userid) as cnt
from
	content
group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	country,
	content_id
),
city AS (
    SELECT
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        geo_country AS country,
        geo_city AS city,
        COUNT(DISTINCT domain_userid) AS cnt,
        app_id,
		content_id
    FROM content
    GROUP BY app_id, content_id, geo_country, geo_city, TO_CHAR(derived_tstamp, 'YYYY-MM-DD')
),
ranked_cities AS (
    SELECT
        *,
        ROW_NUMBER() OVER (PARTITION BY country, period_date, content_id ORDER BY cnt DESC) AS city_rank
    FROM city
),
country_wise_city AS (
    SELECT
        '{' || LISTAGG('"' || city || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY city) || '}' AS cities,
        country,
        period_date,
		content_id,
		app_id
    FROM ranked_cities
    WHERE city_rank <= 8
    GROUP BY app_id,content_id, country, period_date
),
socials as (
select
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD') as period_date,
	content_id,
	coalesce(refr_source , 'Unknown') as social,
	COUNT(distinct domain_userid) as cnt
from
	content
group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	social,
	content_id
),
session_counts as (
select
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD') as period_date,
	content_id,
	domain_sessionid,
	COUNT(page_view_id) as session_page_views
from
	content
group by
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	domain_sessionid,
	content_id
),
article_daily as (
SELECT
        app_id AS site_id,
        TO_CHAR(derived_tstamp, 'YYYY-MM-DD') AS period_date,
        cba.content_id AS article_id,
        COUNT(DISTINCT page_view_id) AS page_views,
        cba.content_name AS title,
        author,
        author AS author_id,
        COUNT(DISTINCT CASE WHEN domain_sessionidx = 1 THEN cba.domain_sessionid ELSE NULL END) AS new_users,
        SUM(CASE WHEN page_views_in_session = 1 THEN 1 ELSE 0 END)::decimal / COUNT(DISTINCT cba.domain_sessionid)::decimal AS bounce_rate,
        COUNT(DISTINCT cba.domain_sessionid)::DECIMAL / COUNT(DISTINCT domain_userid)::DECIMAL AS session_per_user,
        COUNT(DISTINCT domain_userid) AS users,
        SUM(engaged_time_in_s) AS attention_time,
		SUM(engaged_time_in_s) AS total_time_spent,
        (SUM(engaged_time_in_s) / COUNT(DISTINCT domain_userid))::integer AS average_time_spent,
        CURRENT_TIMESTAMP AS created_at,
        'daily' AS frequency,
        1 AS total_shares,
        '[]' AS key_words,
        '{"/contact": 0.8973783730855086, "/about": 0.9826743335287549, "/home": 0.4678587811144468}' AS exit_page_distribution
    FROM content cba
    group by
	app_id,
	TO_CHAR(derived_tstamp,
	'YYYY-MM-DD'),
	cba.content_id,
	cba.content_name,
	cba.author
)

select
	article_daily.*,
	(
        SELECT avg(session_page_views::double precision)
        FROM session_counts sc
        WHERE sc.period_date = article_daily.period_date
            AND sc.content_id = article_daily.article_id
    ) AS pageviews_per_session,
	(
	select
		'{' || LISTAGG('"' || country || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY country) || '}'
	from
		countries
	where
		countries.period_date = article_daily.period_date
		and
		countries.content_id = article_daily.article_id) as country_distribution,
	(
	select
		'{' || LISTAGG('"' || country || '": ' || cities, ', ') WITHIN GROUP (ORDER BY country) || '}'
	from
		country_wise_city c
	where
		c.period_date = article_daily.period_date
		and c.content_id = article_daily.article_id) as city_distribution,
	(
	select
		'{' || LISTAGG('"' || referrer || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY referrer) || '}'
	from
		referrers
	where
		referrers.period_date = article_daily.period_date
		and
		referrers.content_id = article_daily.article_id) as referrer_distribution,
	(
	select
		'{' || LISTAGG('"' || device || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY device) || '}'
	from
		devices
	where
		devices.period_date = article_daily.period_date
		and
		devices.content_id = article_daily.article_id) as device_distribution,
    (
	select
		'{' || LISTAGG('"' || social || '": ' || cnt, ', ') WITHIN GROUP (ORDER BY social) || '}'
	from
		socials
	where
		socials.period_date = article_daily.period_date
		and
		socials.content_id = article_daily.article_id) as social_distribution,
		s.org_id
from
	article_daily
	
	inner join {{ source('atomic', 'sites') }} s  on s.site_id = article_daily.site_id