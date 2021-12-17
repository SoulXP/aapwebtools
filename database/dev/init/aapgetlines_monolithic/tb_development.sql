-- Drop table before creating new one
DROP TABLE IF EXISTS tbl_development_monolithic CASCADE;

-- Dubbing cue data for each project segment
CREATE TABLE tbl_development_monolithic (
    id                              bigserial                       UNIQUE NOT NULL                                             PRIMARY KEY,
    project_name                    varchar(200)                    NOT NULL,
    project_identifier              varchar(10)                     NOT NULL,
    project_catalogue               varchar(10)                     NOT NULL,
    project_segment                 varchar(10)                     NOT NULL,
    character_name                  varchar(100)                    NOT NULL,
    prepared_cue                    text                            NOT NULL, 
    age_range                       bigint[2]                       NOT NULL                DEFAULT array[0,0]::bigint[],
    timeline_values                 double precision[2]             NOT NULL                DEFAULT array[0.0,0.0]::double precision[],
    frame_rate                      double precision                NOT NULL                DEFAULT 0.0,
    tick_rate                       double precision                NOT NULL                DEFAULT 0.0,
    timestamp_update                timestamp WITH TIME ZONE        NOT NULL                DEFAULT NOW(),
    timestamp_entry                 timestamp WITH TIME ZONE        NOT NULL                DEFAULT NOW()
);

-- Function for updating tables with timestamp_update columns
CREATE OR REPLACE FUNCTION fnc_timestamp_update() RETURNS Trigger
LANGUAGE 'plpgsql'
AS $$
    BEGIN
        NEW.timestamp_update = NOW();
        RETURN NEW;
    END;
$$;

-- Start fresh if trigger exist
DROP TRIGGER IF EXISTS tg_timestamp_update ON tbl_development_monolithic CASCADE;

-- Update timestamps for entries
CREATE TRIGGER tg_timestamp_update BEFORE UPDATE
ON tbl_development_monolithic FOR EACH ROW
EXECUTE PROCEDURE fnc_timestamp_update();