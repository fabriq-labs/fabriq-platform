{{ config(materialized='incremental',unique_key = ['site_id','name', 'author_id'], schema='derived', tags="hourly_run") }}

with content as (
    select * from {{ ref('derived_contents') }}
    {% if is_incremental() %}
    where {{ get_where_condition_for_article_incremental(this) }}
    {% endif %}
),
articles as (
    select count(*) as published_articles, author_id, site_id from {{ ref('articles') }}
    group by author_id, site_id
),
author_product as (
    select
        app_id as site_id,
        author as name,
        author as author_id,
        CURRENT_TIMESTAMP as created_at
    from content
    group by app_id,author
)
select author_product.*, ar.published_articles, s.org_id
from author_product
inner join articles ar on ar.author_id = author_product.author_id and ar.site_id=author_product.site_id
inner join  {{ source('atomic', 'sites') }} s ON s.site_id = author_product.site_id