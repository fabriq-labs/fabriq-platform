{{ config(materialized='incremental',unique_key = ['site_id','name', 'author_id'], schema='derived') }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
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
		INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = author_product.site_id