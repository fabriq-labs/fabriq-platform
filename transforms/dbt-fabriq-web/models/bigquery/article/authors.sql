{{ config(materialized='incremental',unique_key = ['site_id','name', 'author_id'], schema='public') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where  date(collector_tstamp) >= COALESCE((select max(date(created_at)) from {{this}}), '{{ var('snowplow_web')['snowplow__start_date'] }}' )
    {% endif %}
),
author_product as (
select
	app_id as site_id,
	author as name,
	author as author_id,
	CURRENT_TIMESTAMP as created_at
from
	content
group by
	app_id,
	author
	)
	select
		author_product.*,
		s.org_id
	from
		author_product
		INNER JOIN public.sites s ON s.site_id = author_product.site_id