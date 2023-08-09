{% macro generate_schema_name(custom_schema_name, node) -%}

    {%- set default_schema = target.schema -%}
    {%- set model_folder = node.model_folder -%}
    {%- if custom_schema_name == 'public' -%}
        {{ custom_schema_name | trim }}
    {%- else -%}
        {%- if custom_schema_name is none -%}
            {{ default_schema }}
        {%- else -%}
            {{ default_schema }}_{{ custom_schema_name | trim }}
        {%- endif -%}       
    {%- endif -%}
{%- endmacro %}

