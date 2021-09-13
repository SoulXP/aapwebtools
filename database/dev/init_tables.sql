-- Start database with clean slate
DROP TABLE IF EXISTS tbl_webplatform_users;
DROP TABLE IF EXISTS tbl_dubbing_raw_ptxedl;
DROP TABLE IF EXISTS tbl_dubbing_raw_edicuesummary;
DROP TYPE IF EXISTS enum_gender;
DROP TYPE IF EXISTS enum_dubbing_project_type;

-- Enumeration types
CREATE TYPE enum_gender AS ENUM ( 'male', 'female', 'unspecified' );
CREATE TYPE enum_dubbing_project_type AS ENUM ( 'serial',  'film' );

-- Information on users for the web platform 
CREATE TABLE tbl_webplatform_users (
    id                              bigserial                       UNIQUE NOT NULL                             PRIMARY KEY,
    user_name                       varchar(256)                    UNIQUE NOT NULL,
    email                           varchar(256)                    UNIQUE NOT NULL,
    password_hash_bcrypt            varchar(61)                     NOT NULL,                                                      -- Confirm length
    password_salt_bcrypt            varchar(128)                    NOT NULL,                                                      -- Confirm length
    email_verififed                 boolean                         NOT NULL                DEFAULT FALSE,
    email_verification_guid         uuid                            UNIQUE,
    timestamp_verification_sent     timestamp WITH TIME ZONE,
    timestamp_verified              timestamp WITH TIME ZONE,
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);

-- File information of dubbing PTX EDL files on storage
CREATE TABLE tbl_dubbing_raw_ptxedl (
    id                              bigserial                       UNIQUE NOT NULL                             PRIMARY KEY,
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
    id                              bigserial                       UNIQUE NOT NULL                             PRIMARY KEY,
    ptxedl_id                       bigint                          NOT NULL                                    REFERENCES tbl_dubbing_raw_ptxedl (id),
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
    id                              bigserial                       UNIQUE NOT NULL                             PRIMARY KEY,

    adrsummary_ids                  bigint[]                        NOT NULL,
        FOREIGN KEY (EACH ELEMENT OF adrsummary_ids) REFERENCES tbl_dubbing_raw_edicuesummary,

    project_type                    enum_dubbing_project_type       NOT NULL,
    identifier_internal             varchar(16)                     UNIQUE NOT NULL,
    title_internal                  varchar(256)                    UNIQUE NOT NULL,
    title_external                  varchar(256)                    NOT NULL                DEFAULT 'unspecified',
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);