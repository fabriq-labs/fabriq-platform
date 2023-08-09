{{ config(materialized='incremental',unique_key = ['site_id','article_id', 'title', 'author', 'category'], schema="public")  }}


with content as (
    select * from {{ ref('derived_contents') }}
   	{% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
article_product as (
select
	app_id as site_id,
	content_id as article_id,
	content_name as title,
	author,
	author as author_id,
	content_category as category,
	date_published as published_date,
	CURRENT_TIMESTAMP as created_at
from
	content
group by
	app_id,
	content_id,
	content_name,
	content_category,
	author,
	date_published)
SELECT
    ap.*,
    s.org_id
FROM
    article_product ap
INNER JOIN {{ source('atomic', 'sites') }} s ON s.site_id = ap.site_id