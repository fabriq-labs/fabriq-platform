--
-- PostgreSQL database dump
--

-- Dumped from database version 11.19
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: hdb_catalog; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA hdb_catalog;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: gen_hasura_uuid(); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.gen_hasura_uuid() RETURNS uuid
    LANGUAGE sql
    AS $$select gen_random_uuid()$$;


--
-- Name: insert_event_log(text, text, text, text, json); Type: FUNCTION; Schema: hdb_catalog; Owner: -
--

CREATE FUNCTION hdb_catalog.insert_event_log(schema_name text, table_name text, trigger_name text, op text, row_data json) RETURNS text
    LANGUAGE plpgsql
    AS $$
  DECLARE
    id text;
    payload json;
    session_variables json;
    server_version_num int;
    trace_context json;
  BEGIN
    id := gen_random_uuid();
    server_version_num := current_setting('server_version_num');
    IF server_version_num >= 90600 THEN
      session_variables := current_setting('hasura.user', 't');
      trace_context := current_setting('hasura.tracecontext', 't');
    ELSE
      BEGIN
        session_variables := current_setting('hasura.user');
      EXCEPTION WHEN OTHERS THEN
                  session_variables := NULL;
      END;
      BEGIN
        trace_context := current_setting('hasura.tracecontext');
      EXCEPTION WHEN OTHERS THEN
        trace_context := NULL;
      END;
    END IF;
    payload := json_build_object(
      'op', op,
      'data', row_data,
      'session_variables', session_variables,
      'trace_context', trace_context
    );
    INSERT INTO hdb_catalog.event_log
                (id, schema_name, table_name, trigger_name, payload)
    VALUES
    (id, schema_name, table_name, trigger_name, payload);
    RETURN id;
  END;
$$;


--
-- Name: queries_search_vector_update(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.queries_search_vector_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
            BEGIN
                NEW.search_vector = ((setweight(to_tsvector('pg_catalog.simple', regexp_replace(coalesce(CAST(NEW.id AS TEXT), ''), '[-@.]', ' ', 'g')), 'B') || setweight(to_tsvector('pg_catalog.simple', regexp_replace(coalesce(NEW.name, ''), '[-@.]', ' ', 'g')), 'A')) || setweight(to_tsvector('pg_catalog.simple', regexp_replace(coalesce(NEW.description, ''), '[-@.]', ' ', 'g')), 'C')) || setweight(to_tsvector('pg_catalog.simple', regexp_replace(coalesce(NEW.query, ''), '[-@.]', ' ', 'g')), 'D');
                RETURN NEW;
            END
            $$;


--
-- Name: set_current_timestamp_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_current_timestamp_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$;


SET default_tablespace = '';

--
-- Name: event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: event_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.event_log (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    schema_name text NOT NULL,
    table_name text NOT NULL,
    trigger_name text NOT NULL,
    payload jsonb NOT NULL,
    delivered boolean DEFAULT false NOT NULL,
    error boolean DEFAULT false NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    locked timestamp with time zone,
    next_retry_at timestamp without time zone,
    archived boolean DEFAULT false NOT NULL
);


--
-- Name: hdb_action_log; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_action_log (
    id uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    action_name text,
    input_payload jsonb NOT NULL,
    request_headers jsonb NOT NULL,
    session_variables jsonb NOT NULL,
    response_payload jsonb,
    errors jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    response_received_at timestamp with time zone,
    status text NOT NULL,
    CONSTRAINT hdb_action_log_status_check CHECK ((status = ANY (ARRAY['created'::text, 'processing'::text, 'completed'::text, 'error'::text])))
);


--
-- Name: hdb_cron_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_cron_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_cron_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_event_log_cleanups; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_event_log_cleanups (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    trigger_name text NOT NULL,
    scheduled_at timestamp without time zone NOT NULL,
    deleted_event_logs integer,
    deleted_event_invocation_logs integer,
    status text NOT NULL,
    CONSTRAINT hdb_event_log_cleanups_status_check CHECK ((status = ANY (ARRAY['scheduled'::text, 'paused'::text, 'completed'::text, 'dead'::text])))
);


--
-- Name: hdb_metadata; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_metadata (
    id integer NOT NULL,
    metadata json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL
);


--
-- Name: hdb_scheduled_event_invocation_logs; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_event_invocation_logs (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    event_id text,
    status integer,
    request json,
    response json,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: hdb_scheduled_events; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_scheduled_events (
    id text DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    webhook_conf json NOT NULL,
    scheduled_time timestamp with time zone NOT NULL,
    retry_conf json,
    payload json,
    header_conf json,
    status text DEFAULT 'scheduled'::text NOT NULL,
    tries integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    next_retry_at timestamp with time zone,
    comment text,
    CONSTRAINT valid_status CHECK ((status = ANY (ARRAY['scheduled'::text, 'locked'::text, 'delivered'::text, 'error'::text, 'dead'::text])))
);


--
-- Name: hdb_schema_notifications; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_schema_notifications (
    id integer NOT NULL,
    notification json NOT NULL,
    resource_version integer DEFAULT 1 NOT NULL,
    instance_id uuid NOT NULL,
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT hdb_schema_notifications_id_check CHECK ((id = 1))
);


--
-- Name: hdb_source_catalog_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_source_catalog_version (
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL
);


--
-- Name: hdb_version; Type: TABLE; Schema: hdb_catalog; Owner: -
--

CREATE TABLE hdb_catalog.hdb_version (
    hasura_uuid uuid DEFAULT hdb_catalog.gen_hasura_uuid() NOT NULL,
    version text NOT NULL,
    upgraded_on timestamp with time zone NOT NULL,
    cli_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    console_state jsonb DEFAULT '{}'::jsonb NOT NULL,
    ee_client_id text,
    ee_client_secret text
);


--
-- Name: sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sites (
    id integer NOT NULL,
    org_id integer NOT NULL,
    site_id text NOT NULL,
    site_name text,
    host_name text,
    collector_url text
);


--
-- Name: TABLE sites; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.sites IS 'Sites under Organizations';


--
-- Name: Sites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Sites_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Sites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Sites_id_seq" OWNED BY public.sites.id;


--
-- Name: access_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.access_permissions (
    object_type character varying(255) NOT NULL,
    object_id integer NOT NULL,
    id integer NOT NULL,
    access_type character varying(255) NOT NULL,
    grantor_id integer NOT NULL,
    grantee_id integer NOT NULL
);


--
-- Name: access_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.access_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: access_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.access_permissions_id_seq OWNED BY public.access_permissions.id;


--
-- Name: action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.action (
    id integer NOT NULL,
    ref_source_id integer NOT NULL,
    ref_action_id integer NOT NULL,
    data_source_id integer NOT NULL,
    data_model_type text DEFAULT 'table'::text NOT NULL,
    action_mapping jsonb NOT NULL,
    connection_id integer,
    data_model text,
    name text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    status text DEFAULT 'Active'::text NOT NULL,
    org_id integer DEFAULT 2 NOT NULL,
    data_model_id integer,
    is_deleted boolean DEFAULT false,
    config jsonb,
    data_flow_model_id integer
);


--
-- Name: TABLE action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.action IS 'Table for storing action configuration';


--
-- Name: action_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.action_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.action_id_seq OWNED BY public.action.id;


--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


--
-- Name: alert_subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alert_subscriptions (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    user_id integer NOT NULL,
    destination_id integer,
    alert_id integer NOT NULL
);


--
-- Name: alert_subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alert_subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alert_subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alert_subscriptions_id_seq OWNED BY public.alert_subscriptions.id;


--
-- Name: alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.alerts (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    query_id integer NOT NULL,
    user_id integer NOT NULL,
    options text NOT NULL,
    state character varying(255) NOT NULL,
    last_triggered_at timestamp with time zone,
    rearm integer
);


--
-- Name: alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.alerts_id_seq OWNED BY public.alerts.id;


--
-- Name: api_keys; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.api_keys (
    object_type character varying(255) NOT NULL,
    object_id integer NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    org_id integer NOT NULL,
    api_key character varying(255) NOT NULL,
    active boolean NOT NULL,
    created_by_id integer
);


--
-- Name: api_keys_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.api_keys_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: api_keys_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.api_keys_id_seq OWNED BY public.api_keys.id;


--
-- Name: changes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.changes (
    object_type character varying(255) NOT NULL,
    object_id integer NOT NULL,
    id integer NOT NULL,
    object_version integer NOT NULL,
    user_id integer NOT NULL,
    change text NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: changes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.changes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: changes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.changes_id_seq OWNED BY public.changes.id;


--
-- Name: connection; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connection (
    id integer NOT NULL,
    name text,
    principal text,
    display_name text,
    credentials jsonb,
    user_info jsonb,
    source_id integer NOT NULL,
    created_by integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    org_id integer,
    status text,
    deleted boolean,
    updated_at timestamp without time zone,
    config jsonb
);


--
-- Name: TABLE connection; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.connection IS 'Connection Info for Source';


--
-- Name: connection_external_elt_mapping; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.connection_external_elt_mapping (
    connection_id integer NOT NULL,
    elt_source_id text NOT NULL,
    id integer NOT NULL
);


--
-- Name: connection_external_elt_mapping_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.connection_external_elt_mapping_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: connection_external_elt_mapping_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.connection_external_elt_mapping_id_seq OWNED BY public.connection_external_elt_mapping.id;


--
-- Name: connection_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.connection_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: connection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.connection_id_seq OWNED BY public.connection.id;


--
-- Name: dashboards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dashboards (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    version integer NOT NULL,
    org_id integer NOT NULL,
    slug character varying(140) NOT NULL,
    name character varying(100) NOT NULL,
    user_id integer NOT NULL,
    layout text NOT NULL,
    dashboard_filters_enabled boolean NOT NULL,
    is_archived boolean NOT NULL,
    is_draft boolean NOT NULL,
    tags character varying[],
    is_team_editable boolean,
    options jsonb
);


--
-- Name: dashboards_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dashboards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dashboards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dashboards_id_seq OWNED BY public.dashboards.id;


--
-- Name: data_flow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_flow (
    id integer NOT NULL,
    name text NOT NULL,
    created_by integer DEFAULT 8,
    created_at timestamp with time zone DEFAULT now(),
    org_id integer,
    last_ran_at timestamp with time zone,
    summary text DEFAULT 'No Summary'::text NOT NULL,
    ui_state jsonb,
    input_model_id integer,
    input_table_name text,
    flow_type text DEFAULT 'dbt'::text,
    data_source_id integer,
    is_deleted boolean DEFAULT false,
    config jsonb
);


--
-- Name: TABLE data_flow; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.data_flow IS 'Data Flow';


--
-- Name: data_model; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_model (
    id integer NOT NULL,
    name text NOT NULL,
    dataflow_id integer NOT NULL,
    query_id integer,
    created_by integer,
    created_at timestamp with time zone DEFAULT now(),
    org_id integer,
    prev_model_id integer,
    next_model_id integer,
    ref_id integer DEFAULT 1,
    summary text DEFAULT 'No Summary'::text NOT NULL,
    model_config jsonb,
    uistate jsonb,
    output_cols jsonb DEFAULT jsonb_build_array(),
    active boolean DEFAULT true NOT NULL,
    last_run_at timestamp with time zone DEFAULT now(),
    prev_model_ids jsonb DEFAULT jsonb_build_array(),
    next_model_ids jsonb DEFAULT jsonb_build_array(),
    model_type text,
    action_id integer,
    pipeline_id integer,
    level integer,
    dbt_id integer
);


--
-- Name: TABLE data_model; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.data_model IS 'Data Model';


--
-- Name: data_source_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_source_groups (
    id integer NOT NULL,
    data_source_id integer NOT NULL,
    group_id integer NOT NULL,
    view_only boolean NOT NULL
);


--
-- Name: data_source_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_source_groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_source_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_source_groups_id_seq OWNED BY public.data_source_groups.id;


--
-- Name: data_sources; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.data_sources (
    id integer NOT NULL,
    org_id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    encrypted_options bytea NOT NULL,
    queue_name character varying(255) NOT NULL,
    scheduled_queue_name character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: data_sources_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.data_sources_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: data_sources_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.data_sources_id_seq OWNED BY public.data_sources.id;


--
-- Name: dataflow_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.dataflow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: dataflow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.dataflow_id_seq OWNED BY public.data_flow.id;


--
-- Name: datamodel_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.datamodel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: datamodel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.datamodel_id_seq OWNED BY public.data_model.id;


--
-- Name: destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.destination (
    id integer NOT NULL,
    name text NOT NULL,
    org_id integer,
    created_by uuid
);


--
-- Name: TABLE destination; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.destination IS 'Destination';


--
-- Name: destination_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.destination_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: destination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.destination_id_seq OWNED BY public.destination.id;


--
-- Name: events; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.events (
    id integer NOT NULL,
    org_id integer NOT NULL,
    user_id integer,
    action character varying(255) NOT NULL,
    object_type character varying(255) NOT NULL,
    object_id character varying(255),
    additional_properties text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.favorites (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    org_id integer NOT NULL,
    object_type character varying(255) NOT NULL,
    object_id integer NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.favorites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id integer NOT NULL,
    org_id integer NOT NULL,
    type character varying(255) NOT NULL,
    name character varying(100) NOT NULL,
    permissions character varying(255)[] NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.groups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.groups_id_seq OWNED BY public.groups.id;


--
-- Name: infra; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.infra (
    id integer NOT NULL,
    org_id integer NOT NULL,
    infra jsonb NOT NULL,
    type text
);


--
-- Name: infra_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.infra_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: infra_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.infra_id_seq OWNED BY public.infra.id;


--
-- Name: knex_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations (
    id integer NOT NULL,
    name character varying(255),
    batch integer,
    migration_time timestamp with time zone
);


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_id_seq OWNED BY public.knex_migrations.id;


--
-- Name: knex_migrations_lock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.knex_migrations_lock (
    index integer NOT NULL,
    is_locked integer
);


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.knex_migrations_lock_index_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: knex_migrations_lock_index_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.knex_migrations_lock_index_seq OWNED BY public.knex_migrations_lock.index;


--
-- Name: log_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_action (
    id integer NOT NULL,
    action_id integer NOT NULL,
    activity_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text,
    org_id integer DEFAULT 2 NOT NULL,
    job_id text,
    details text,
    triggered_by text DEFAULT 'system'::text NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    no_of_rows_api integer
);


--
-- Name: TABLE log_action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.log_action IS 'Action runs';


--
-- Name: log_action_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_action_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_action_id_seq OWNED BY public.log_action.id;


--
-- Name: log_flow; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_flow (
    id integer NOT NULL,
    flow_id integer NOT NULL,
    activity_name text NOT NULL,
    status text NOT NULL,
    triggered_by text DEFAULT 'system'::text NOT NULL,
    details text,
    org_id integer DEFAULT 2 NOT NULL,
    started_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    job_id text
);


--
-- Name: log_flow_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_flow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_flow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_flow_id_seq OWNED BY public.log_flow.id;


--
-- Name: log_pipeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.log_pipeline (
    id integer NOT NULL,
    pipeline_id integer NOT NULL,
    activity_name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text,
    triggered_by text DEFAULT 'system'::text NOT NULL,
    org_id integer DEFAULT 2 NOT NULL,
    started_at timestamp with time zone,
    completed_at timestamp with time zone,
    job_id text,
    details text,
    target_record_count integer,
    tap_record_count integer
);


--
-- Name: TABLE log_pipeline; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.log_pipeline IS 'Pipeline runs';


--
-- Name: log_pipeline_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.log_pipeline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: log_pipeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.log_pipeline_id_seq OWNED BY public.log_pipeline.id;


--
-- Name: notification_destinations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification_destinations (
    id integer NOT NULL,
    org_id integer NOT NULL,
    user_id integer NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(255) NOT NULL,
    options text NOT NULL,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: notification_destinations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_destinations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_destinations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_destinations_id_seq OWNED BY public.notification_destinations.id;


--
-- Name: organizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.organizations (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    settings text NOT NULL,
    logo text,
    external_mapping jsonb DEFAULT jsonb_build_object()
);


--
-- Name: organizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.organizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: organizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.organizations_id_seq OWNED BY public.organizations.id;


--
-- Name: pipeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pipeline (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    source_id integer DEFAULT 1 NOT NULL,
    tenant_id integer DEFAULT 1 NOT NULL,
    last_ran_at timestamp with time zone DEFAULT now(),
    status boolean DEFAULT true,
    destination_id integer DEFAULT 2 NOT NULL,
    config jsonb,
    entities jsonb,
    sync_from text,
    sync_frequency text,
    org_id integer,
    destination_schema text,
    source_type text,
    connection_principal text,
    connection_id integer,
    entities_count integer,
    is_deleted boolean DEFAULT false,
    is_receipe boolean DEFAULT false,
    config_changed boolean DEFAULT true NOT NULL,
    time_of_day_in_mins integer DEFAULT 0 NOT NULL,
    transform_url text,
    transform text DEFAULT 'skip'::text NOT NULL,
    created_by integer DEFAULT 1 NOT NULL,
    external_mapping jsonb DEFAULT jsonb_build_object() NOT NULL
);


--
-- Name: TABLE pipeline; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.pipeline IS 'Pipeline';


--
-- Name: pipeline_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.pipeline_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: pipeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.pipeline_id_seq OWNED BY public.pipeline.id;


--
-- Name: queries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.queries (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    version integer NOT NULL,
    org_id integer NOT NULL,
    data_source_id integer,
    latest_query_data_id integer,
    name character varying(255) NOT NULL,
    description character varying(4096),
    query text NOT NULL,
    query_hash character varying(32) NOT NULL,
    api_key character varying(40) NOT NULL,
    user_id integer NOT NULL,
    last_modified_by_id integer,
    is_archived boolean NOT NULL,
    is_draft boolean NOT NULL,
    schedule text,
    schedule_failures integer NOT NULL,
    options text NOT NULL,
    search_vector tsvector,
    tags character varying[],
    is_team_editable boolean DEFAULT false NOT NULL,
    query_folder_id integer,
    is_deleted boolean DEFAULT false
);


--
-- Name: queries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.queries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: queries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.queries_id_seq OWNED BY public.queries.id;


--
-- Name: query_folder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.query_folder (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: query_folder_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.query_folder_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: query_folder_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.query_folder_id_seq OWNED BY public.query_folder.id;


--
-- Name: query_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.query_results (
    id integer NOT NULL,
    org_id integer NOT NULL,
    data_source_id integer NOT NULL,
    query_hash character varying(32) NOT NULL,
    query text NOT NULL,
    data text NOT NULL,
    runtime double precision NOT NULL,
    retrieved_at timestamp with time zone NOT NULL
);


--
-- Name: query_results_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.query_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: query_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.query_results_id_seq OWNED BY public.query_results.id;


--
-- Name: query_snippets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.query_snippets (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    org_id integer NOT NULL,
    trigger character varying(255) NOT NULL,
    description text NOT NULL,
    user_id integer NOT NULL,
    snippet text NOT NULL
);


--
-- Name: query_snippets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.query_snippets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: query_snippets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.query_snippets_id_seq OWNED BY public.query_snippets.id;


--
-- Name: ref_data_model; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_data_model (
    id integer NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    active boolean DEFAULT true NOT NULL,
    summary text DEFAULT 'No Summary'::text NOT NULL
);


--
-- Name: ref_destination; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_destination (
    name text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    "group" text NOT NULL,
    app_config jsonb,
    id integer NOT NULL
);


--
-- Name: ref_destination_action; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_destination_action (
    id integer NOT NULL,
    name text NOT NULL,
    ref_destination_id integer NOT NULL,
    display_name text NOT NULL,
    description text NOT NULL,
    request_params jsonb
);


--
-- Name: ref_destination_action_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ref_destination_action_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ref_destination_action_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ref_destination_action_id_seq OWNED BY public.ref_destination_action.id;


--
-- Name: ref_destination_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ref_destination_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ref_destination_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ref_destination_id_seq OWNED BY public.ref_destination.id;


--
-- Name: ref_source; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ref_source (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    "group" text NOT NULL,
    entities jsonb,
    app_config jsonb,
    is_target boolean DEFAULT false,
    is_data_source boolean DEFAULT true NOT NULL,
    is_source boolean DEFAULT true
);


--
-- Name: TABLE ref_source; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.ref_source IS 'List of Source / Connectors';


--
-- Name: ref_source_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ref_source_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ref_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ref_source_id_seq OWNED BY public.ref_source.id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL
);


--
-- Name: sampleProfiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."sampleProfiles" (
    id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: sampleProfiles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."sampleProfiles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: sampleProfiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."sampleProfiles_id_seq" OWNED BY public."sampleProfiles".id;


--
-- Name: tenant; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant (
    id integer NOT NULL,
    name text NOT NULL,
    admin_id integer NOT NULL,
    plan_id integer NOT NULL
);


--
-- Name: TABLE tenant; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.tenant IS 'Group of Users';


--
-- Name: tenant_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tenant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tenant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tenant_id_seq OWNED BY public.tenant.id;


--
-- Name: test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test (
    id integer NOT NULL,
    name text NOT NULL,
    url text,
    description text
);


--
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_id_seq OWNED BY public.test.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    active boolean DEFAULT true,
    tenant_id integer DEFAULT 1 NOT NULL
);


--
-- Name: user_role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_role (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    role_id uuid,
    user_id uuid
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    org_id integer NOT NULL,
    name character varying(320) NOT NULL,
    email character varying(255) NOT NULL,
    profile_image_url character varying(320),
    password_hash character varying(128),
    groups integer[],
    api_key character varying(40) NOT NULL,
    disabled_at timestamp with time zone,
    details json DEFAULT '{}'::json,
    home_db_slug text,
    sites integer[]
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: visualizations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visualizations (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    type character varying(100) NOT NULL,
    query_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(4096),
    options text NOT NULL
);


--
-- Name: visualizations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visualizations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visualizations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visualizations_id_seq OWNED BY public.visualizations.id;


--
-- Name: widgets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.widgets (
    updated_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone NOT NULL,
    id integer NOT NULL,
    visualization_id integer,
    text text,
    width integer NOT NULL,
    options text NOT NULL,
    dashboard_id integer NOT NULL
);


--
-- Name: widgets_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.widgets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: widgets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.widgets_id_seq OWNED BY public.widgets.id;


--
-- Name: access_permissions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_permissions ALTER COLUMN id SET DEFAULT nextval('public.access_permissions_id_seq'::regclass);


--
-- Name: action id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action ALTER COLUMN id SET DEFAULT nextval('public.action_id_seq'::regclass);


--
-- Name: alert_subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_subscriptions ALTER COLUMN id SET DEFAULT nextval('public.alert_subscriptions_id_seq'::regclass);


--
-- Name: alerts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts ALTER COLUMN id SET DEFAULT nextval('public.alerts_id_seq'::regclass);


--
-- Name: api_keys id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys ALTER COLUMN id SET DEFAULT nextval('public.api_keys_id_seq'::regclass);


--
-- Name: changes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.changes ALTER COLUMN id SET DEFAULT nextval('public.changes_id_seq'::regclass);


--
-- Name: connection id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection ALTER COLUMN id SET DEFAULT nextval('public.connection_id_seq'::regclass);


--
-- Name: connection_external_elt_mapping id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection_external_elt_mapping ALTER COLUMN id SET DEFAULT nextval('public.connection_external_elt_mapping_id_seq'::regclass);


--
-- Name: dashboards id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards ALTER COLUMN id SET DEFAULT nextval('public.dashboards_id_seq'::regclass);


--
-- Name: data_flow id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_flow ALTER COLUMN id SET DEFAULT nextval('public.dataflow_id_seq'::regclass);


--
-- Name: data_model id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model ALTER COLUMN id SET DEFAULT nextval('public.datamodel_id_seq'::regclass);


--
-- Name: data_source_groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_source_groups ALTER COLUMN id SET DEFAULT nextval('public.data_source_groups_id_seq'::regclass);


--
-- Name: data_sources id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_sources ALTER COLUMN id SET DEFAULT nextval('public.data_sources_id_seq'::regclass);


--
-- Name: destination id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination ALTER COLUMN id SET DEFAULT nextval('public.destination_id_seq'::regclass);


--
-- Name: events id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: groups id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups ALTER COLUMN id SET DEFAULT nextval('public.groups_id_seq'::regclass);


--
-- Name: infra id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.infra ALTER COLUMN id SET DEFAULT nextval('public.infra_id_seq'::regclass);


--
-- Name: knex_migrations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations ALTER COLUMN id SET DEFAULT nextval('public.knex_migrations_id_seq'::regclass);


--
-- Name: knex_migrations_lock index; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock ALTER COLUMN index SET DEFAULT nextval('public.knex_migrations_lock_index_seq'::regclass);


--
-- Name: log_action id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_action ALTER COLUMN id SET DEFAULT nextval('public.log_action_id_seq'::regclass);


--
-- Name: log_flow id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_flow ALTER COLUMN id SET DEFAULT nextval('public.log_flow_id_seq'::regclass);


--
-- Name: log_pipeline id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_pipeline ALTER COLUMN id SET DEFAULT nextval('public.log_pipeline_id_seq'::regclass);


--
-- Name: notification_destinations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations ALTER COLUMN id SET DEFAULT nextval('public.notification_destinations_id_seq'::regclass);


--
-- Name: organizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations ALTER COLUMN id SET DEFAULT nextval('public.organizations_id_seq'::regclass);


--
-- Name: pipeline id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline ALTER COLUMN id SET DEFAULT nextval('public.pipeline_id_seq'::regclass);


--
-- Name: queries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries ALTER COLUMN id SET DEFAULT nextval('public.queries_id_seq'::regclass);


--
-- Name: query_folder id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_folder ALTER COLUMN id SET DEFAULT nextval('public.query_folder_id_seq'::regclass);


--
-- Name: query_results id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_results ALTER COLUMN id SET DEFAULT nextval('public.query_results_id_seq'::regclass);


--
-- Name: query_snippets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_snippets ALTER COLUMN id SET DEFAULT nextval('public.query_snippets_id_seq'::regclass);


--
-- Name: ref_destination id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_destination ALTER COLUMN id SET DEFAULT nextval('public.ref_destination_id_seq'::regclass);


--
-- Name: ref_destination_action id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_destination_action ALTER COLUMN id SET DEFAULT nextval('public.ref_destination_action_id_seq'::regclass);


--
-- Name: ref_source id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_source ALTER COLUMN id SET DEFAULT nextval('public.ref_source_id_seq'::regclass);


--
-- Name: sampleProfiles id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."sampleProfiles" ALTER COLUMN id SET DEFAULT nextval('public."sampleProfiles_id_seq"'::regclass);


--
-- Name: sites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sites ALTER COLUMN id SET DEFAULT nextval('public."Sites_id_seq"'::regclass);


--
-- Name: tenant id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant ALTER COLUMN id SET DEFAULT nextval('public.tenant_id_seq'::regclass);


--
-- Name: test id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test ALTER COLUMN id SET DEFAULT nextval('public.test_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: visualizations id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visualizations ALTER COLUMN id SET DEFAULT nextval('public.visualizations_id_seq'::regclass);


--
-- Name: widgets id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widgets ALTER COLUMN id SET DEFAULT nextval('public.widgets_id_seq'::regclass);


--
-- Name: event_invocation_logs event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_invocation_logs
    ADD CONSTRAINT event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: event_log event_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.event_log
    ADD CONSTRAINT event_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_action_log hdb_action_log_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_action_log
    ADD CONSTRAINT hdb_action_log_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_cron_events hdb_cron_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_events
    ADD CONSTRAINT hdb_cron_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_event_log_cleanups hdb_event_log_cleanups_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_event_log_cleanups
    ADD CONSTRAINT hdb_event_log_cleanups_pkey PRIMARY KEY (id);


--
-- Name: hdb_event_log_cleanups hdb_event_log_cleanups_trigger_name_scheduled_at_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_event_log_cleanups
    ADD CONSTRAINT hdb_event_log_cleanups_trigger_name_scheduled_at_key UNIQUE (trigger_name, scheduled_at);


--
-- Name: hdb_metadata hdb_metadata_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_pkey PRIMARY KEY (id);


--
-- Name: hdb_metadata hdb_metadata_resource_version_key; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_metadata
    ADD CONSTRAINT hdb_metadata_resource_version_key UNIQUE (resource_version);


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_pkey PRIMARY KEY (id);


--
-- Name: hdb_scheduled_events hdb_scheduled_events_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_events
    ADD CONSTRAINT hdb_scheduled_events_pkey PRIMARY KEY (id);


--
-- Name: hdb_schema_notifications hdb_schema_notifications_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_schema_notifications
    ADD CONSTRAINT hdb_schema_notifications_pkey PRIMARY KEY (id);


--
-- Name: hdb_version hdb_version_pkey; Type: CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_version
    ADD CONSTRAINT hdb_version_pkey PRIMARY KEY (hasura_uuid);


--
-- Name: sites Sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT "Sites_pkey" PRIMARY KEY (id);


--
-- Name: access_permissions access_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_permissions
    ADD CONSTRAINT access_permissions_pkey PRIMARY KEY (id);


--
-- Name: action action_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_pkey PRIMARY KEY (id);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: alert_subscriptions alert_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_subscriptions
    ADD CONSTRAINT alert_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: alerts alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_pkey PRIMARY KEY (id);


--
-- Name: api_keys api_keys_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_pkey PRIMARY KEY (id);


--
-- Name: changes changes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.changes
    ADD CONSTRAINT changes_pkey PRIMARY KEY (id);


--
-- Name: connection_external_elt_mapping connection_external_elt_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection_external_elt_mapping
    ADD CONSTRAINT connection_external_elt_mapping_pkey PRIMARY KEY (id);


--
-- Name: connection connection_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection
    ADD CONSTRAINT connection_pkey PRIMARY KEY (id);


--
-- Name: dashboards dashboards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_pkey PRIMARY KEY (id);


--
-- Name: data_source_groups data_source_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_source_groups
    ADD CONSTRAINT data_source_groups_pkey PRIMARY KEY (id);


--
-- Name: data_sources data_sources_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_sources
    ADD CONSTRAINT data_sources_pkey PRIMARY KEY (id);


--
-- Name: data_flow dataflow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_flow
    ADD CONSTRAINT dataflow_pkey PRIMARY KEY (id);


--
-- Name: data_model datamodel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT datamodel_pkey PRIMARY KEY (id);


--
-- Name: destination destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_pkey PRIMARY KEY (id);


--
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: infra infra_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.infra
    ADD CONSTRAINT infra_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: log_action log_action_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_action
    ADD CONSTRAINT log_action_pkey PRIMARY KEY (id);


--
-- Name: log_flow log_flow_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_flow
    ADD CONSTRAINT log_flow_pkey PRIMARY KEY (id);


--
-- Name: log_pipeline log_pipeline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_pipeline
    ADD CONSTRAINT log_pipeline_pkey PRIMARY KEY (id);


--
-- Name: notification_destinations notification_destinations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations
    ADD CONSTRAINT notification_destinations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_pkey PRIMARY KEY (id);


--
-- Name: organizations organizations_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.organizations
    ADD CONSTRAINT organizations_slug_key UNIQUE (slug);


--
-- Name: pipeline pipeline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT pipeline_pkey PRIMARY KEY (id);


--
-- Name: queries queries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_pkey PRIMARY KEY (id);


--
-- Name: query_folder query_folder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_folder
    ADD CONSTRAINT query_folder_pkey PRIMARY KEY (id);


--
-- Name: query_results query_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_results
    ADD CONSTRAINT query_results_pkey PRIMARY KEY (id);


--
-- Name: query_snippets query_snippets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_snippets
    ADD CONSTRAINT query_snippets_pkey PRIMARY KEY (id);


--
-- Name: query_snippets query_snippets_trigger_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_snippets
    ADD CONSTRAINT query_snippets_trigger_key UNIQUE (trigger);


--
-- Name: ref_data_model ref_data_model_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_data_model
    ADD CONSTRAINT ref_data_model_pkey PRIMARY KEY (id);


--
-- Name: ref_destination_action ref_destination_action_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_destination_action
    ADD CONSTRAINT ref_destination_action_pkey PRIMARY KEY (id);


--
-- Name: ref_destination ref_destination_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_destination
    ADD CONSTRAINT ref_destination_pkey PRIMARY KEY (id);


--
-- Name: ref_source ref_source_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_source
    ADD CONSTRAINT ref_source_pkey PRIMARY KEY (id);


--
-- Name: role role_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_id_unique UNIQUE (id);


--
-- Name: role role_name_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_unique UNIQUE (name);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id);


--
-- Name: sampleProfiles sampleProfiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."sampleProfiles"
    ADD CONSTRAINT "sampleProfiles_pkey" PRIMARY KEY (id);


--
-- Name: tenant tenant_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant
    ADD CONSTRAINT tenant_pkey PRIMARY KEY (id);


--
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- Name: favorites unique_favorite; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT unique_favorite UNIQUE (object_type, object_id, user_id);


--
-- Name: user user_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_id_unique UNIQUE (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_role user_role_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_id_unique UNIQUE (id);


--
-- Name: user_role user_role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_pkey PRIMARY KEY (id);


--
-- Name: user user_username_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_username_unique UNIQUE (username);


--
-- Name: users users_api_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_api_key_key UNIQUE (api_key);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visualizations visualizations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visualizations
    ADD CONSTRAINT visualizations_pkey PRIMARY KEY (id);


--
-- Name: widgets widgets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widgets
    ADD CONSTRAINT widgets_pkey PRIMARY KEY (id);


--
-- Name: event_invocation_logs_event_id_idx; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX event_invocation_logs_event_id_idx ON hdb_catalog.event_invocation_logs USING btree (event_id);


--
-- Name: event_log_fetch_events; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX event_log_fetch_events ON hdb_catalog.event_log USING btree (locked NULLS FIRST, next_retry_at NULLS FIRST, created_at) WHERE ((delivered = false) AND (error = false) AND (archived = false));


--
-- Name: event_log_trigger_name_idx; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX event_log_trigger_name_idx ON hdb_catalog.event_log USING btree (trigger_name);


--
-- Name: hdb_cron_event_invocation_event_id; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_invocation_event_id ON hdb_catalog.hdb_cron_event_invocation_logs USING btree (event_id);


--
-- Name: hdb_cron_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_cron_event_status ON hdb_catalog.hdb_cron_events USING btree (status);


--
-- Name: hdb_cron_events_unique_scheduled; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_cron_events_unique_scheduled ON hdb_catalog.hdb_cron_events USING btree (trigger_name, scheduled_time) WHERE (status = 'scheduled'::text);


--
-- Name: hdb_scheduled_event_status; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE INDEX hdb_scheduled_event_status ON hdb_catalog.hdb_scheduled_events USING btree (status);


--
-- Name: hdb_source_catalog_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_source_catalog_version_one_row ON hdb_catalog.hdb_source_catalog_version USING btree (((version IS NOT NULL)));


--
-- Name: hdb_version_one_row; Type: INDEX; Schema: hdb_catalog; Owner: -
--

CREATE UNIQUE INDEX hdb_version_one_row ON hdb_catalog.hdb_version USING btree (((version IS NOT NULL)));


--
-- Name: alert_subscriptions_destination_id_alert_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX alert_subscriptions_destination_id_alert_id ON public.alert_subscriptions USING btree (destination_id, alert_id);


--
-- Name: api_keys_object_type_object_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX api_keys_object_type_object_id ON public.api_keys USING btree (object_type, object_id);


--
-- Name: data_sources_org_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX data_sources_org_id_name ON public.data_sources USING btree (org_id, name);


--
-- Name: ix_api_keys_api_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_api_keys_api_key ON public.api_keys USING btree (api_key);


--
-- Name: ix_dashboards_is_archived; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_dashboards_is_archived ON public.dashboards USING btree (is_archived);


--
-- Name: ix_dashboards_is_draft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_dashboards_is_draft ON public.dashboards USING btree (is_draft);


--
-- Name: ix_dashboards_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_dashboards_slug ON public.dashboards USING btree (slug);


--
-- Name: ix_queries_is_archived; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_queries_is_archived ON public.queries USING btree (is_archived);


--
-- Name: ix_queries_is_draft; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_queries_is_draft ON public.queries USING btree (is_draft);


--
-- Name: ix_queries_search_vector; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_queries_search_vector ON public.queries USING gin (search_vector);


--
-- Name: ix_query_results_query_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_query_results_query_hash ON public.query_results USING btree (query_hash);


--
-- Name: ix_widgets_dashboard_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX ix_widgets_dashboard_id ON public.widgets USING btree (dashboard_id);


--
-- Name: notification_destinations_org_id_name; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX notification_destinations_org_id_name ON public.notification_destinations USING btree (org_id, name);


--
-- Name: user_active_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_active_index ON public."user" USING btree (active);


--
-- Name: user_role_role_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_role_role_id_index ON public.user_role USING btree (role_id);


--
-- Name: user_role_user_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX user_role_user_id_index ON public.user_role USING btree (user_id);


--
-- Name: users_org_id_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_org_id_email ON public.users USING btree (org_id, email);


--
-- Name: queries queries_search_vector_trigger; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER queries_search_vector_trigger BEFORE INSERT OR UPDATE ON public.queries FOR EACH ROW EXECUTE PROCEDURE public.queries_search_vector_update();


--
-- Name: query_folder set_public_query_folder_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_public_query_folder_updated_at BEFORE UPDATE ON public.query_folder FOR EACH ROW EXECUTE PROCEDURE public.set_current_timestamp_updated_at();


--
-- Name: TRIGGER set_public_query_folder_updated_at ON query_folder; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TRIGGER set_public_query_folder_updated_at ON public.query_folder IS 'trigger to set value of column "updated_at" to current timestamp on row update';


--
-- Name: hdb_cron_event_invocation_logs hdb_cron_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_cron_event_invocation_logs
    ADD CONSTRAINT hdb_cron_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_cron_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: hdb_scheduled_event_invocation_logs hdb_scheduled_event_invocation_logs_event_id_fkey; Type: FK CONSTRAINT; Schema: hdb_catalog; Owner: -
--

ALTER TABLE ONLY hdb_catalog.hdb_scheduled_event_invocation_logs
    ADD CONSTRAINT hdb_scheduled_event_invocation_logs_event_id_fkey FOREIGN KEY (event_id) REFERENCES hdb_catalog.hdb_scheduled_events(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: sites Sites_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sites
    ADD CONSTRAINT "Sites_org_id_fkey" FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: access_permissions access_permissions_grantee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_permissions
    ADD CONSTRAINT access_permissions_grantee_id_fkey FOREIGN KEY (grantee_id) REFERENCES public.users(id);


--
-- Name: access_permissions access_permissions_grantor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.access_permissions
    ADD CONSTRAINT access_permissions_grantor_id_fkey FOREIGN KEY (grantor_id) REFERENCES public.users(id);


--
-- Name: action action_connection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_connection_id_fkey FOREIGN KEY (connection_id) REFERENCES public.connection(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: action action_data_flow_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_data_flow_model_id_fkey FOREIGN KEY (data_flow_model_id) REFERENCES public.data_model(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: action action_data_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_data_model_id_fkey FOREIGN KEY (data_model_id) REFERENCES public.queries(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: action action_data_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_data_source_id_fkey FOREIGN KEY (data_source_id) REFERENCES public.data_sources(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: action action_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: action action_ref_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_ref_action_id_fkey FOREIGN KEY (ref_action_id) REFERENCES public.ref_destination_action(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: action action_ref_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action
    ADD CONSTRAINT action_ref_source_id_fkey FOREIGN KEY (ref_source_id) REFERENCES public.ref_source(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: alert_subscriptions alert_subscriptions_alert_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_subscriptions
    ADD CONSTRAINT alert_subscriptions_alert_id_fkey FOREIGN KEY (alert_id) REFERENCES public.alerts(id);


--
-- Name: alert_subscriptions alert_subscriptions_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_subscriptions
    ADD CONSTRAINT alert_subscriptions_destination_id_fkey FOREIGN KEY (destination_id) REFERENCES public.notification_destinations(id);


--
-- Name: alert_subscriptions alert_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alert_subscriptions
    ADD CONSTRAINT alert_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: alerts alerts_query_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_query_id_fkey FOREIGN KEY (query_id) REFERENCES public.queries(id);


--
-- Name: alerts alerts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.alerts
    ADD CONSTRAINT alerts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: api_keys api_keys_created_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_created_by_id_fkey FOREIGN KEY (created_by_id) REFERENCES public.users(id);


--
-- Name: api_keys api_keys_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.api_keys
    ADD CONSTRAINT api_keys_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: changes changes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.changes
    ADD CONSTRAINT changes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: connection_external_elt_mapping connection_external_elt_mapping_connection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection_external_elt_mapping
    ADD CONSTRAINT connection_external_elt_mapping_connection_id_fkey FOREIGN KEY (connection_id) REFERENCES public.connection(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: connection connection_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection
    ADD CONSTRAINT connection_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: connection connection_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.connection
    ADD CONSTRAINT connection_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.ref_source(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: dashboards dashboards_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: dashboards dashboards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dashboards
    ADD CONSTRAINT dashboards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: data_model data_model_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.action(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_model data_model_dbt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_dbt_id_fkey FOREIGN KEY (dbt_id) REFERENCES public.data_flow(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_model data_model_next_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_next_model_id_fkey FOREIGN KEY (next_model_id) REFERENCES public.data_model(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_model data_model_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES public.pipeline(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_model data_model_prev_model_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_prev_model_id_fkey FOREIGN KEY (prev_model_id) REFERENCES public.data_model(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_model data_model_query_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_query_id_fkey FOREIGN KEY (query_id) REFERENCES public.queries(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_model data_model_ref_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT data_model_ref_id_fkey FOREIGN KEY (ref_id) REFERENCES public.ref_data_model(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: data_source_groups data_source_groups_data_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_source_groups
    ADD CONSTRAINT data_source_groups_data_source_id_fkey FOREIGN KEY (data_source_id) REFERENCES public.data_sources(id);


--
-- Name: data_source_groups data_source_groups_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_source_groups
    ADD CONSTRAINT data_source_groups_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: data_sources data_sources_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_sources
    ADD CONSTRAINT data_sources_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: data_model datamodel_dataflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.data_model
    ADD CONSTRAINT datamodel_dataflow_id_fkey FOREIGN KEY (dataflow_id) REFERENCES public.data_flow(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: destination destination_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_created_by_fkey FOREIGN KEY (created_by) REFERENCES public."user"(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: destination destination_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.destination
    ADD CONSTRAINT destination_tenant_id_fkey FOREIGN KEY (org_id) REFERENCES public.tenant(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: events events_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: events events_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: favorites favorites_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: groups groups_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: infra infra_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.infra
    ADD CONSTRAINT infra_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: log_action log_action_action_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_action
    ADD CONSTRAINT log_action_action_id_fkey FOREIGN KEY (action_id) REFERENCES public.action(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: log_flow log_flow_flow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_flow
    ADD CONSTRAINT log_flow_flow_id_fkey FOREIGN KEY (flow_id) REFERENCES public.data_flow(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: log_pipeline log_pipeline_pipeline_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.log_pipeline
    ADD CONSTRAINT log_pipeline_pipeline_id_fkey FOREIGN KEY (pipeline_id) REFERENCES public.pipeline(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: notification_destinations notification_destinations_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations
    ADD CONSTRAINT notification_destinations_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: notification_destinations notification_destinations_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification_destinations
    ADD CONSTRAINT notification_destinations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: pipeline pipeline_connection_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT pipeline_connection_id_fkey FOREIGN KEY (connection_id) REFERENCES public.connection(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: pipeline pipeline_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT pipeline_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: pipeline pipeline_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT pipeline_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.ref_source(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: pipeline pipeline_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pipeline
    ADD CONSTRAINT pipeline_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: queries queries_data_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_data_source_id_fkey FOREIGN KEY (data_source_id) REFERENCES public.data_sources(id);


--
-- Name: queries queries_last_modified_by_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_last_modified_by_id_fkey FOREIGN KEY (last_modified_by_id) REFERENCES public.users(id);


--
-- Name: queries queries_latest_query_data_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_latest_query_data_id_fkey FOREIGN KEY (latest_query_data_id) REFERENCES public.query_results(id);


--
-- Name: queries queries_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: queries queries_query_folder_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_query_folder_fkey FOREIGN KEY (query_folder_id) REFERENCES public.query_folder(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: queries queries_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.queries
    ADD CONSTRAINT queries_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: query_results query_results_data_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_results
    ADD CONSTRAINT query_results_data_source_id_fkey FOREIGN KEY (data_source_id) REFERENCES public.data_sources(id);


--
-- Name: query_results query_results_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_results
    ADD CONSTRAINT query_results_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: query_snippets query_snippets_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_snippets
    ADD CONSTRAINT query_snippets_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: query_snippets query_snippets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.query_snippets
    ADD CONSTRAINT query_snippets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: ref_destination_action ref_destination_action_ref_destination_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ref_destination_action
    ADD CONSTRAINT ref_destination_action_ref_destination_id_fkey FOREIGN KEY (ref_destination_id) REFERENCES public.ref_source(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_role user_role_role_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_role_id_foreign FOREIGN KEY (role_id) REFERENCES public.role(id);


--
-- Name: user_role user_role_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_role
    ADD CONSTRAINT user_role_user_id_foreign FOREIGN KEY (user_id) REFERENCES public."user"(id);


--
-- Name: user user_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenant(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: users users_org_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_org_id_fkey FOREIGN KEY (org_id) REFERENCES public.organizations(id);


--
-- Name: visualizations visualizations_query_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visualizations
    ADD CONSTRAINT visualizations_query_id_fkey FOREIGN KEY (query_id) REFERENCES public.queries(id);


--
-- Name: widgets widgets_dashboard_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widgets
    ADD CONSTRAINT widgets_dashboard_id_fkey FOREIGN KEY (dashboard_id) REFERENCES public.dashboards(id);


--
-- Name: widgets widgets_visualization_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.widgets
    ADD CONSTRAINT widgets_visualization_id_fkey FOREIGN KEY (visualization_id) REFERENCES public.visualizations(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

