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
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW
)