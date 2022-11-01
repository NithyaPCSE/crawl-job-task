-- Database: crawling

-- DROP DATABASE IF EXISTS crawling;

CREATE DATABASE crawling
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;


    -- Table: public.crawling_information

-- DROP TABLE IF EXISTS public.crawling_information;

CREATE TABLE IF NOT EXISTS public.crawling_information
(
    id SERIAL PRIMARY KEY,
    url text COLLATE pg_catalog."default" NOT NULL,
    image_path text COLLATE pg_catalog."default",
    title text COLLATE pg_catalog."default",
    brand text COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.crawling_information
    OWNER to postgres;


    -- Table: public.job_information

-- DROP TABLE IF EXISTS public.job_information;

CREATE TABLE IF NOT EXISTS public.job_information
(
    id SERIAL PRIMARY KEY,
    job_id text COLLATE pg_catalog."default" NOT NULL,
    job_name text COLLATE pg_catalog."default",
    job_url text COLLATE pg_catalog."default",
    status text COLLATE pg_catalog."default",
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.job_information
    OWNER to postgres;