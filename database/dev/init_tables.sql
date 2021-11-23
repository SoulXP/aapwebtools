-- Start database with clean slate
DROP TABLE IF EXISTS tbl_webplatform_users CASCADE;
DROP TABLE IF EXISTS tbl_dubbing_raw_ptxedl CASCADE;
DROP TABLE IF EXISTS tbl_dubbing_raw_edicuesummary CASCADE;
DROP TABLE IF EXISTS tbl_dubbing_projects CASCADE;
DROP TABLE IF EXISTS tbl_dubbing_project_segments CASCADE;
DROP TABLE IF EXISTS tbl_dubbing_characters CASCADE;
DROP TABLE IF EXISTS tbl_dubbing_cues CASCADE;
DROP TYPE IF EXISTS enum_dubbing_gender CASCADE;
DROP TYPE IF EXISTS enum_dubbing_project_type CASCADE;

-- Enumeration types
CREATE TYPE enum_dubbing_gender AS ENUM ( 'male', 'female', 'unspecified' );
CREATE TYPE enum_dubbing_project_type AS ENUM ( 'serial',  'film' );

-- Information on users for the web platform 
CREATE TABLE tbl_webplatform_users (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    user_name                       varchar(256)                    UNIQUE NOT NULL,
    email                           varchar(256)                    UNIQUE NOT NULL,
    password_hash_bcrypt            varchar(61)                     NOT NULL,                                                                 -- Confirm length
    password_salt_bcrypt            varchar(128)                    NOT NULL,                                                                 -- Confirm length
    email_verififed                 boolean                         NOT NULL                DEFAULT FALSE,
    email_verification_guid         uuid                            UNIQUE,
    timestamp_verification_sent     timestamp WITH TIME ZONE,
    timestamp_verified              timestamp WITH TIME ZONE,
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);

-- File information of dubbing PTX EDL files on storage
CREATE TABLE tbl_dubbing_raw_ptxedl (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    vers                            varchar(256)                    NOT NULL,
    size                            bigint                          NOT NULL,
    file_path                       text                            UNIQUE NOT NULL,
    file_name                       varchar(128)                    UNIQUE NOT NULL,
    file_hash_sha512                varchar(128)                    UNIQUE NOT NULL,
    timestamp_file_creation         timestamp WITH TIME ZONE        NOT NULL,
    timestamp_file_modified         timestamp WITH TIME ZONE        NOT NULL,
    timestamp_entry                 timestamp WITH TIME ZONE        NOT NULL                DEFAULT NOW()
);

-- File information of dubbing EDICue ADR Summary files on storage
CREATE TABLE tbl_dubbing_raw_edicuesummary (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    ptxedl_id                       bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_raw_ptxedl (id),
    vers                            varchar(256)                    NOT NULL,
    size                            bigint                          NOT NULL,
    file_path                       text                            UNIQUE NOT NULL,
    file_name                       varchar(128)                    UNIQUE NOT NULL,
    file_hash_sha512                varchar(128)                    UNIQUE NOT NULL,
    timestamp_file_creation         timestamp WITH TIME ZONE        NOT NULL,
    timestamp_file_modified         timestamp WITH TIME ZONE        NOT NULL,
    timestamp_entry                 timestamp WITH TIME ZONE        NOT NULL                DEFAULT NOW()
);

-- Data of different dubbing projects
CREATE TABLE tbl_dubbing_projects (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    adrsummary_ids                  bigint[]                        NOT NULL,
    project_type                    enum_dubbing_project_type       NOT NULL,
    identifier_internal             varchar(16)                     UNIQUE NOT NULL,
    title_internal                  varchar(256)                    UNIQUE NOT NULL,
    title_external                  varchar(256)                    NOT NULL                DEFAULT 'unspecified',
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);

-- Dubbing project segmentation details
CREATE TABLE tbl_dubbing_project_segments (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    project_id                      bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_projects (id),
    adrsummary_id                   bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_raw_edicuesummary (id),
    segment_id_internal             varchar(256)                    NOT NULL, 
    segment_id_external             varchar(256)                    NOT NULL                DEFAULT 'unspecified',
    content_document_name           text                            UNIQUE NOT NULL,
    content_document_hash_sha512    varchar(128)                    UNIQUE NOT NULL,
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);

-- Dubbing project segmentation details
CREATE TABLE tbl_dubbing_characters (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    project_id                      bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_projects (id),
    adrsummary_id                   bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_raw_edicuesummary (id),
    internal_name                   varchar(128)                    NOT NULL, 
    aliases                         varchar(128)[128]               NOT NULL                DEFAULT array[128]::varchar[128],
    gender                          enum_dubbing_gender             NOT NULL,
    age_range                       bigint[2]                                               DEFAULT array[2]::bigint[],
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);

-- Dubbing cue data for each project segment
CREATE TABLE tbl_dubbing_cues (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    project_id                      bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_projects (id),
    project_segment_id              bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_project_segments (id),
    adrsummary_id                   bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_raw_edicuesummary (id),
    character_id                    bigint                          NOT NULL                                                    REFERENCES tbl_dubbing_characters (id),
    prepared_cue                    text                            NOT NULL, 
    timeline_values                 bigint[2]                       NOT NULL                DEFAULT array[2]::bigint[],
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);