-- Drop table before creating new one
DROP TABLE IF EXISTS tbl_dubbing_cues_monolithic CASCADE;

-- Dubbing cue data for each project segment
CREATE TABLE tbl_dubbing_cues_monolithic (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    project_name                    varchar(200)                    NOT NULL,
    project_identifier              varchar(10)                     NOT NULL,
    project_segment                 varchar(10)                     NOT NULL,
    character_name                  varchar(100)                    NOT NULL,
    prepared_cue                    text                            NOT NULL, 
    age_range                       bigint[2]                       NOT NULL                DEFAULT array[2]::bigint[],
    timeline_values                 double precision[2]             NOT NULL                DEFAULT array[2]::double precision[],
    timestamp_entry                 timestamp WITH TIME ZONE        DEFAULT NOW()
);