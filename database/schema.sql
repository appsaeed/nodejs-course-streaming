--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2 (Debian 16.2-1.pgdg120+2)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookmark; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.bookmark (
    user_id character varying(20) NOT NULL,
    playlist_id character varying(20) NOT NULL,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.bookmark OWNER TO root;

--
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO root;

--
-- Name: comments; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.comments (
    id character varying(20) DEFAULT nextval('public.comments_id_seq'::regclass) NOT NULL,
    content_id character varying(20) NOT NULL,
    user_id character varying(20) NOT NULL,
    tutor_id character varying(20) NOT NULL,
    comment character varying(1000) NOT NULL,
    date date DEFAULT CURRENT_TIMESTAMP,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO root;

--
-- Name: contact_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_id_seq OWNER TO root;

--
-- Name: contact; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.contact (
    id integer DEFAULT nextval('public.contact_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    number integer NOT NULL,
    message character varying(1000) NOT NULL,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.contact OWNER TO root;

--
-- Name: content_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.content_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.content_id_seq OWNER TO root;

--
-- Name: content; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.content (
    id character varying(20) DEFAULT nextval('public.content_id_seq'::regclass) NOT NULL,
    tutor_id character varying(20) NOT NULL,
    playlist_id character varying(20) NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    video text,
    thumb text,
    date date DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'deactive'::character varying NOT NULL,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.content OWNER TO root;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.likes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO root;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.likes (
    id integer DEFAULT nextval('public.likes_id_seq'::regclass) NOT NULL,
    user_id character varying(20) NOT NULL,
    tutor_id character varying(20) NOT NULL,
    content_id character varying(20) NOT NULL,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.likes OWNER TO root;

--
-- Name: playlist_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.playlist_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.playlist_id_seq OWNER TO root;

--
-- Name: playlist; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.playlist (
    id character varying(20) DEFAULT nextval('public.playlist_id_seq'::regclass) NOT NULL,
    tutor_id character varying(20) NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(1000) NOT NULL,
    thumb character varying(100) NOT NULL,
    date date DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'deactive'::character varying NOT NULL,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.playlist OWNER TO root;

--
-- Name: tutors_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.tutors_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tutors_id_seq OWNER TO root;

--
-- Name: tutors; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.tutors (
    id character varying(20) DEFAULT nextval('public.tutors_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    profession character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password text NOT NULL,
    image text,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tutors OWNER TO root;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO root;

--
-- Name: users; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.users (
    id character varying(20) DEFAULT nextval('public.users_id_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password text NOT NULL,
    image text,
    create_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO root;

--
-- Name: contact contact_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.contact
    ADD CONSTRAINT contact_pkey PRIMARY KEY (id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

