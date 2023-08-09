{% macro get_where_condition_for_article_incremental(table_name, method) %}
    {% set manual_start_date = var('snowplow_web')['snowplow__article_incremental_manual_start_date'] %}
    {% set default_start_date = var('snowplow_web')['snowplow__start_date'] %}
    {% set current_date = "CURRENT_DATE" %}


    {% if method == 'monthly' %}
        {% if manual_start_date %}
            {% set current_month_start = manual_start_date[:7] ~ '-01' %}
            {% set where_condition = "DATE(derived_tstamp) >= '" ~ current_month_start ~ "'" %}
        {% else %}
            {% set subquery = "select DATE_TRUNC('month', max(date(created_at))) from " ~ table_name ~ "" %}
            {% set where_condition = "date(derived_tstamp) >= COALESCE((" ~ subquery ~ "), '" ~ default_start_date ~ "')" %}
        {% endif %}
        
    {% elif method == 'quarterly' %}
        {% if manual_start_date %}
            {% set current_quarter = ((manual_start_date[:5] | int - 1) / 3) + 1 %}
            {% set current_quarter_start = manual_start_date[:4] ~ '-' ~ '%02d' % (current_quarter * 3) ~ '-01' %}
            {% set where_condition = "DATE(derived_tstamp) >= '" ~ current_quarter_start ~ "'" %}
        {% else %}          
            {% set subquery = "select DATE_TRUNC('quarter', max(date(created_at))) from " ~ table_name ~ "" %}
            {% set where_condition = "date(derived_tstamp) >= COALESCE((" ~ subquery ~ "), '" ~ default_start_date ~ "')" %}
        {% endif %}
    {% elif method == 'yearly' %}
        {% if manual_start_date %}
            {% set current_year_start = manual_start_date[:4] ~ '-01-01' %}
            {% set where_condition = "DATE(derived_tstamp) >= '" ~ current_year_start ~ "'" %}
        {% else %}
            {% set subquery = "select DATE_TRUNC('year', max(date(created_at))) from " ~ table_name ~ "" %}
            {% set where_condition = "date(derived_tstamp) >= COALESCE((" ~ subquery ~ "), '" ~ default_start_date ~ "')" %}
        {% endif %}        
    {% else %}
        {% if manual_start_date %}
            {% set where_condition = "date(derived_tstamp) >= '" ~ manual_start_date ~ "'" %}
        {% else %}
            {% set subquery = "select max(date(created_at)) from " ~ table_name ~ "" %}
            {% set where_condition = "date(derived_tstamp) >= COALESCE((" ~ subquery ~ "), '" ~ default_start_date ~ "')" %}
        {% endif %}
    {% endif %}

    {{ where_condition }}
{% endmacro %}
